param(
  [switch]$InstallDeepSeekCodexBridge
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot

Write-Host "DuDu AI team setup" -ForegroundColor Magenta
Write-Host "Workspace: $root"

$codex = Get-Command codex -ErrorAction SilentlyContinue
$agy = Get-Command agy -ErrorAction SilentlyContinue
if (-not $agy) {
  $agyFallback = Join-Path $env:LOCALAPPDATA "agy\bin\agy.exe"
  if (Test-Path -LiteralPath $agyFallback) { $agy = Get-Item -LiteralPath $agyFallback }
}
$dsh = Get-Command dsh -ErrorAction SilentlyContinue

Write-Host ("Codex CLI: " + $(if ($codex) { "ready" } else { "missing" }))
Write-Host ("Antigravity CLI: " + $(if ($agy) { "ready" } else { "missing from PATH" }))
Write-Host ("DeepSeek Harness CLI: " + $(if ($dsh) { "ready" } else { "available through npx when Node.js is installed" }))

if ($InstallDeepSeekCodexBridge) {
  Write-Host "Installing the official DeepSeek Codex subagent bundle..."
  Push-Location $root
  try {
    npx --yes @deepseek-ai/dsh@0.2.0-rc.2 plugin --profile web add @deepseek-ai/dsh-subagent-codex@0.2.0-rc.2
  } finally {
    Pop-Location
  }
}

if (-not $agy) {
  Write-Warning "Antigravity Pro is present as an app, but its 'agy' CLI is not on PATH. Install Antigravity CLI, sign in, then rerun this check."
}

Write-Host "Next: open DeepSeek Harness in this folder and paste orchestration/prompts/deepseek-manager.md as the first task."
Write-Host "Command: npx @deepseek-ai/dsh@0.2.0-rc.2 web"
