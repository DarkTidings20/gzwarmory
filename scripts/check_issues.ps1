# check_issues.ps1
# Checks GZW Armory GitHub issues once daily.
# Uses DarkTidings20 token to read, gzwarmory-bot token to respond.
# Skips issues already commented on by the bot.
# Bot responds in Dark Tidings voice.

param()

$readerToken = (Get-Content "C:\Users\lehma\.openclaw\workspace\secrets\github_token.txt" -Raw).Trim()
$botToken    = (Get-Content "C:\Users\lehma\.openclaw\workspace\secrets\github_bot_token.txt" -Raw).Trim()
$repo        = "DarkTidings20/gzwarmory"
$stateFile   = "C:\Users\lehma\.openclaw\workspace\gzwarmory-app\scripts\issue_state.json"

$readHeaders = @{ Authorization = "token $readerToken"; Accept = "application/vnd.github.v3+json" }
$botHeaders  = @{ Authorization = "token $botToken";    Accept = "application/vnd.github.v3+json" }

# Load or init state
if (Test-Path $stateFile) {
    $state = Get-Content $stateFile -Raw | ConvertFrom-Json
    $responded = [System.Collections.Generic.List[int]]($state.responded)
} else {
    $responded = [System.Collections.Generic.List[int]]@()
}

# Fetch open issues
$issues = Invoke-RestMethod -Uri "https://api.github.com/repos/$repo/issues?state=open&per_page=50" -Headers $readHeaders

foreach ($issue in $issues) {
    $num = [int]$issue.number

    if ($responded -contains $num) {
        Write-Host "Issue #$num already handled - skipping."
        continue
    }

    Write-Host ("New issue #" + $num + ": " + $issue.title + " by " + $issue.user.login)

    $responseText = "Thanks for bringing this to the Armory.`n`nEvery piece of accurate intel keeps our operators alive longer - that matters to me. Before we update the records, I need to verify this firsthand. If you've got a screenshot of the vendor screen or stat tooltip showing the relevant info, drop it here. A single image is worth a hundred claims.`n`nIf you can provide it, I'll get the data corrected and push an update. If not, we'll flag it for in-game verification on our end.`n`n*— TITAN*"

    $body = @{ body = $responseText } | ConvertTo-Json -Compress
    $commentUrl = "https://api.github.com/repos/$repo/issues/$num/comments"

    try {
        Invoke-RestMethod -Uri $commentUrl -Method Post -Headers $botHeaders -Body $body -ContentType "application/json" | Out-Null
        Write-Host "Responded to issue #$num."
        $responded.Add($num)
    } catch {
        Write-Host "Failed to respond to issue #$num`: $($_.Exception.Message)"
    }
}

# Save state
$newState = @{ responded = $responded.ToArray() }
$newState | ConvertTo-Json | Set-Content $stateFile

Write-Host "Done. State saved."
