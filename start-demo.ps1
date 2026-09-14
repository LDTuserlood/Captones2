$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$demoNode = Get-Command node.exe -ErrorAction SilentlyContinue
if ($demoNode) {
    $demoNodePath = $demoNode.Source
} else {
    $demoNodePath = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
}
if (-not (Test-Path -LiteralPath $demoNodePath)) {
    Write-Host 'Please install Node.js 24 LTS from https://nodejs.org and try again.'
    exit 1
}
$demoNext = Join-Path $PSScriptRoot 'node_modules\next\dist\bin\next'
if (-not (Test-Path -LiteralPath $demoNext)) {
    Write-Host 'Dependencies are missing. See README.md for installation instructions.'
    exit 1
}
Write-Host 'FallGuard demo: http://127.0.0.1:3000'
Write-Host 'Keep this window open. Press Ctrl+C to stop.'
if (Test-Path -LiteralPath (Join-Path $PSScriptRoot '.next\BUILD_ID')) {
    & $demoNodePath $demoNext start --hostname 127.0.0.1
} else {
    & $demoNodePath $demoNext dev --hostname 127.0.0.1
}
