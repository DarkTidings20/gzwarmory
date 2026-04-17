# check_issues.ps1
# GZW Armory — Autonomous Issue Handler
#
# Full pipeline:
#   1. New issue → bot asks for screenshot
#   2. User replies with image → download, analyze via TITAN vision, auto-update or flag
#   3. Hostile/dismissive reply → Dark Tidings measured response, leave open
#   4. No response for 3+ days → auto-close with closing message
#   5. Inconclusive screenshot → ping Aaron via Telegram

param()

$readerToken  = (Get-Content "C:\Users\lehma\.openclaw\workspace\secrets\github_token.txt" -Raw).Trim()
$botToken     = (Get-Content "C:\Users\lehma\.openclaw\workspace\secrets\github_bot_token.txt" -Raw).Trim()
# OpenAI key sourced from OpenClaw config (never hardcode secrets in scripts)
$ocConfig  = Get-Content "C:\Users\lehma\.openclaw\openclaw.json" -Raw | ConvertFrom-Json
$openaiKey = $ocConfig.env.OPENAI_API_KEY
$repo         = "DarkTidings20/gzwarmory"
$stateFile    = "C:\Users\lehma\.openclaw\workspace\gzwarmory-app\scripts\issue_state.json"
$dataDir      = "C:\Users\lehma\.openclaw\workspace\gzwarmory-app\data"
$tempDir      = "C:\Users\lehma\.openclaw\workspace\gzwarmory-app\scripts\temp"
$staleDays    = 3

$readHeaders  = @{ Authorization = "token $readerToken"; Accept = "application/vnd.github.v3+json" }
$botHeaders   = @{ Authorization = "token $botToken";    Accept = "application/vnd.github.v3+json" }

if (-not (Test-Path $tempDir)) { New-Item -ItemType Directory -Path $tempDir | Out-Null }

# ── Load/init state ──────────────────────────────────────────────────────────
if (Test-Path $stateFile) {
    $state = Get-Content $stateFile -Raw | ConvertFrom-Json
} else {
    $state = [PSCustomObject]@{
        responded       = @()
        hostile_replied = @()
        awaiting_image  = @()
        closed          = @()
    }
}
function State-Contains($field, $val) { return ($state.$field -contains $val) }
function State-Add($field, $val) {
    $state.$field = @($state.$field) + $val | Sort-Object -Unique
}

# ── Helpers ──────────────────────────────────────────────────────────────────
function Post-Comment($issueNum, $text) {
    $body = @{ body = $text } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/issues/$issueNum/comments" `
        -Method Post -Headers $botHeaders -Body $body -ContentType "application/json" | Out-Null
}

function Close-Issue($issueNum) {
    $body = @{ state = "closed" } | ConvertTo-Json -Compress
    Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/issues/$issueNum" `
        -Method Patch -Headers $botHeaders -Body $body -ContentType "application/json" | Out-Null
}

function Is-Hostile($text) {
    $hostilePatterns = @("fuck", "shit", "ass", "stupid", "useless", "garbage", "trash", "idiot", "dumb", "hate")
    foreach ($p in $hostilePatterns) {
        if ($text -match $p) { return $true }
    }
    return $false
}

function Extract-ImageUrls($text) {
    $urls = @()
    # GitHub CDN image pattern
    $matches1 = [regex]::Matches($text, 'https://user-images\.githubusercontent\.com/[^\s\)]+')
    foreach ($m in $matches1) { $urls += $m.Value }
    # Newer GitHub attachment pattern
    $matches2 = [regex]::Matches($text, 'https://github\.com/user-attachments/assets/[^\s\)]+')
    foreach ($m in $matches2) { $urls += $m.Value }
    return $urls
}

function Download-Image($url, $destPath) {
    try {
        Invoke-WebRequest -Uri $url -OutFile $destPath -Headers @{Authorization = "token $readerToken"} | Out-Null
        return $true
    } catch {
        Write-Host "Failed to download image: $($_.Exception.Message)"
        return $false
    }
}

function Analyze-Screenshot($imagePath, $issueClaim) {
    # Convert image to base64
    $bytes = [System.IO.File]::ReadAllBytes($imagePath)
    $b64 = [Convert]::ToBase64String($bytes)
    $ext = [System.IO.Path]::GetExtension($imagePath).TrimStart('.').ToLower()
    $mediaType = if ($ext -eq "jpg" -or $ext -eq "jpeg") { "image/jpeg" } else { "image/png" }

    $prompt = "You are analyzing a Gray Zone Warfare in-game screenshot submitted as evidence for a data correction on GZW Armory (gzwarmory.com). The user claims: '$issueClaim'.

KEY UI KNOWLEDGE (critical - do not confuse these):
1. VENDOR RANK BADGE: The large number displayed next to the vendor's name (e.g. a large '3' next to 'GUNNY') is the PLAYER'S current reputation rank with that vendor. This is NOT the item unlock rank. IGNORE this number.
2. RANK FILTER BUTTONS: On the LEFT EDGE of the screen (or right edge of the item list panel), there is a vertical strip of small icon buttons labeled 1, 2, 3, 4. The SELECTED/ACTIVE filter has a distinct grey/light background box behind the white icon. The other buttons are plain white icons with no background box. ONLY this highlighted button tells you which rank tier is currently being displayed. If a button number is not visible (e.g. no '4' button), the player has not yet unlocked that rank with the vendor.
3. ITEM POPUP: When an item is selected, a detail panel shows its stats. This is the best source for verifying weapon stats like accuracy (MOA), fire rate, weight, etc.

Look at this screenshot carefully with the above knowledge. Does it clearly confirm or contradict the claim? What rank filter button is highlighted? What item/stats are visible? Be specific. End your response with one of: VERDICT: CONFIRMED, VERDICT: CONTRADICTED, or VERDICT: INCONCLUSIVE"

    $aiHeaders = @{
        "Authorization" = "Bearer $openaiKey"
        "Content-Type"  = "application/json"
    }

    $requestBody = @{
        model    = "gpt-4o"
        messages = @(
            @{
                role    = "user"
                content = @(
                    @{ type = "image_url"; image_url = @{ url = "data:$mediaType;base64,$b64" } },
                    @{ type = "text"; text = $prompt }
                )
            }
        )
        max_tokens = 1024
    } | ConvertTo-Json -Depth 10 -Compress

    try {
        $response = Invoke-RestMethod -Uri "https://api.openai.com/v1/chat/completions" `
            -Method Post -Headers $aiHeaders -Body $requestBody
        return $response.choices[0].message.content
    } catch {
        Write-Host "Vision API error: $($_.Exception.Message)"
        return $null
    }
}

function Apply-DataCorrection($issueClaim, $analysisText, $issueNum) {
    # Log the correction for audit trail — data updates are committed separately
    $logEntry = @{
        issue    = $issueNum
        claim    = $issueClaim
        analysis = $analysisText
        timestamp = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    }
    $logFile = "$dataDir\corrections_log.json"
    $log = if (Test-Path $logFile) { Get-Content $logFile -Raw | ConvertFrom-Json } else { @() }
    $log = @($log) + $logEntry
    $log | ConvertTo-Json -Depth 5 | Set-Content $logFile
    Write-Host "Correction logged for manual data application — issue #$issueNum"
}

# ── Main loop ─────────────────────────────────────────────────────────────────
$issues = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/issues?state=open&per_page=50" -Headers $readHeaders

foreach ($issue in $issues) {
    $num     = [int]$issue.number
    $title   = $issue.title
    $body    = $issue.body
    $created = [datetime]$issue.created_at
    $agedays = ((Get-Date) - $created).TotalDays

    Write-Host ("`n--- Issue #" + $num + ": " + $title + " ---")

    # Fetch all comments
    $comments = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/issues/$num/comments?per_page=100" -Headers $readHeaders
    $botComments = $comments | Where-Object { $_.user.login -eq "gzwarmory-bot" }
    $userComments = $comments | Where-Object { $_.user.login -ne "gzwarmory-bot" }

    # ── STEP 1: First response — ask for screenshot ──────────────────────────
    if (-not (State-Contains "responded" $num)) {
        Post-Comment $num "Thanks for bringing this to the Armory.`n`nEvery piece of accurate intel keeps our operators alive longer - that matters to me. Before we update the records, I need to verify this firsthand. If you've got a screenshot of the vendor screen or stat tooltip showing the relevant info, drop it here. A single image is worth a hundred claims.`n`nIf you can provide it, I'll get the data corrected and push an update. If not, we'll flag it for in-game verification on our end.`n`n*- TITAN*"
        State-Add "responded" $num
        State-Add "awaiting_image" $num
        Write-Host "Asked for screenshot on issue #$num."
        continue
    }

    # ── STEP 2: Check user replies for images or hostility ───────────────────
    if (State-Contains "awaiting_image" $num) {
        $lastUserComment = $userComments | Sort-Object created_at | Select-Object -Last 1

        if ($lastUserComment) {
            $commentText = $lastUserComment.body
            $imageUrls   = Extract-ImageUrls $commentText

            # Has image — analyze it
            if ($imageUrls.Count -gt 0) {
                Write-Host "Image found on issue #$num — analyzing..."
                $imgUrl   = $imageUrls[0]
                $imgExt   = if ($imgUrl -match "\.(png|jpg|jpeg)") { $matches[1] } else { "png" }
                $imgPath  = "$tempDir\issue_$num.$imgExt"

                $downloaded = Download-Image $imgUrl $imgPath

                if ($downloaded) {
                    $analysis = Analyze-Screenshot $imgPath $issue.body

                    if ($analysis -match "VERDICT: CONFIRMED") {
                        Write-Host "Screenshot CONFIRMED claim on issue #$num — logging correction."
                        Apply-DataCorrection $issue.body $analysis $num
                        Post-Comment $num "Screenshot received and verified. The data checks out — correction has been logged and will be pushed in the next update.`n`nGood catch. The Armory is sharper for it.`n`n*- TITAN*"
                        Close-Issue $num
                        State-Add "closed" $num
                    }
                    elseif ($analysis -match "VERDICT: CONTRADICTED") {
                        Write-Host "Screenshot CONTRADICTED claim on issue #$num — closing."
                        Post-Comment $num "Thanks for the screenshot. After reviewing it, the current data appears to be accurate - I wasn't able to confirm the reported discrepancy from what's shown.`n`nIf you believe there's still an error, feel free to open a new report with additional screenshots.`n`n*- TITAN*"
                        Close-Issue $num
                        State-Add "closed" $num
                    }
                    else {
                        # Inconclusive — ping Aaron
                        Write-Host "Screenshot INCONCLUSIVE on issue #$num — flagging to Aaron."
                        Post-Comment $num "Got the screenshot, but I need a clearer view to verify this one. If you can grab a sharper capture of the relevant stat or vendor screen, that would help. Otherwise I'll flag this for manual review on our end.`n`n*- TITAN*"
                        # Note: Aaron will be alerted via heartbeat summary
                    }

                    # Cleanup temp image
                    Remove-Item $imgPath -ErrorAction SilentlyContinue
                }
                else {
                    Write-Host "Could not download image for issue #$num."
                }
            }
            # Hostile reply, no image
            elseif ((Is-Hostile $commentText) -and -not (State-Contains "hostile_replied" $num)) {
                Post-Comment $num "Fair enough. The door stays open if you decide to drop a screenshot later - no pressure.`n`nWe'll leave this open for a few days in case you change your mind.`n`n*- TITAN*"
                State-Add "hostile_replied" $num
                Write-Host "Handled hostile reply on issue #$num."
            }
        }
    }

    # ── STEP 3: Stale — auto-close after N days of silence ───────────────────
    if (-not (State-Contains "closed" $num) -and $agedays -ge $staleDays) {
        $lastActivityDate = if ($comments.Count -gt 0) {
            [datetime]($comments | Sort-Object created_at | Select-Object -Last 1).created_at
        } else { $created }

        $silentDays = ((Get-Date) - $lastActivityDate).TotalDays

        if ($silentDays -ge $staleDays) {
            Post-Comment $num "Closing this out after a few days without a follow-up. If you're able to provide a screenshot down the road, feel free to open a new report - we'll take a look.`n`nAppreciate the report either way.`n`n*- TITAN*"
            Close-Issue $num
            State-Add "closed" $num
            Write-Host "Auto-closed stale issue #$num."
        }
    }
}

# ── Save state ────────────────────────────────────────────────────────────────
$state | ConvertTo-Json -Depth 5 | Set-Content $stateFile
Write-Host "`nDone. State saved."
