# DuDu Trà Sữa

A responsive, buildless Vietnamese milk-tea site with a filterable menu and local demo cart.

## Preview locally

From this directory:

```powershell
npx --yes serve dist
```

Then open the local URL printed by the command.

## Three-AI workflow

1. Run `powershell -ExecutionPolicy Bypass -File scripts/setup-ai-team.ps1` to check prerequisites.
2. To add Codex as a DeepSeek Harness subagent, rerun it with `-InstallDeepSeekCodexBridge`.
3. Start DeepSeek Harness with `npx @deepseek-ai/dsh@0.2.0-rc.2 web` from this directory.
4. Give it `orchestration/prompts/deepseek-manager.md` as the manager task.
5. Antigravity owns visual review; Codex owns code changes; DeepSeek owns coordination and QA.

The Antigravity desktop app is not enough for scripted handoffs: its `agy` CLI must be installed and available on `PATH`.

## Before public launch

Confirm the sample menu prices and replace the pending address, phone, social, and order channel. The initial hosted version is private.
