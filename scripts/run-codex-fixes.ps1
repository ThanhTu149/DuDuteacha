$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$codex = Get-Command codex -ErrorAction SilentlyContinue

if (-not $codex) {
  throw "Codex CLI is not available on PATH."
}

$prompt = Get-Content -Raw (Join-Path $root "orchestration/prompts/codex-fix.md")
Push-Location $root
try {
  codex exec --full-auto $prompt
} finally {
  Pop-Location
}

