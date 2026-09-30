$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$agy = Get-Command agy -ErrorAction SilentlyContinue
if (-not $agy) {
  $agyFallback = Join-Path $env:LOCALAPPDATA "agy\bin\agy.exe"
  if (Test-Path -LiteralPath $agyFallback) { $agy = Get-Item -LiteralPath $agyFallback }
}

if (-not $agy) {
  throw "Antigravity CLI ('agy') is not available on PATH. Install/sign in to Antigravity CLI first."
}

$prompt = Get-Content -Raw (Join-Path $root "orchestration/prompts/antigravity-review.md")
Push-Location $root
try {
  & $agy.FullName -p $prompt --output-format json --print-timeout 15m
} finally {
  Pop-Location
}
