Set-Location "C:\Users\lehma\.openclaw\workspace\gzwarmory-app"
Write-Host "Starting npm install..."
$process = Start-Process -FilePath "npm" -ArgumentList "install" -NoNewWindow -PassThru -Wait
Write-Host "npm install exited with: $($process.ExitCode)"
