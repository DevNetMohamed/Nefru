# Claude Code CLI — Quick Tutorial

A hands‑on guide to the most useful Claude Code features, oriented to this NEFRU_ai (Node + React) project.

---

## 1. Installation & First Run

```bash
npm install -g @anthropic-ai/claude-code
claude            # launch interactive CLI in current dir
claude "fix the login bug in backend/src/controllers/Auth"
```

- Runs in the **current working directory** (this repo).
- Git‑aware: it reads diffs, respects `.gitignore`, and never commits unless you ask.

---

## 2. ThePrompt & Modes

| Command | What it does |
|---------|--------------|
| `claude` | Interactive REPL |
| `claude "task"` | One‑shot task, then exit |
| `claude --help` | List all flags |
| `/model` | Switch model (Opus / Sonnet / Haiku) — **keeps the chat** |
| `Esc` | Cancel the current generation |

**Permission modes** (how freely Claude edits):
- **Default** – asks before risky/destructive actions.
- **Accept edits** – auto‑allows file edits, still prompts for shell.
- **Plan mode** – Claude explores and proposes a plan, you approve before any code changes (`EnterPlanMode` / `ExitPlanMode`).

---

## 3. Essential Slash Commands

Type `/` to see the full list. Most useful:

| Command | Purpose |
|---------|---------|
| `/init` | Generate a `CLAUDE.md` project doc |
| `/review` | Review the current git diff (PR‑style) |
| `/code-review` | Deeper review with effort level |
| `/security-review` | Security audit of pending changes |
| `/verify` | Run the change end‑to‑end and observe behavior |
| `/run` | Launch the app (uses project’s run skill if present) |
| `/loop 5m "check build"` | Repeat a prompt on an interval |
| `/config` | Tweak theme, model, permissions |
| `/memory` | Show/edit persistent memory |
| `/clear` | Reset conversation context |
| `/help` | Built‑in documentation |

---

## 4. Agents (Sub‑agents)

Custom agents live in `.claude/agents/*.md`. This repo already has:
`code-reviewer`, `verify-run`, `security-review`, `run-tests`, `deploy-checker`, `lint-checker`.

```bash
# invoke from chat:
/agent code-reviewer
```

Each agent file has front‑matter (`name`, `description`) + instructions. Claude routes tasks to the right agent automatically, or you can call one explicitly.

**Create your own:**
```bash
# ask Claude: "create an agent that lints and auto-fixes"
```
It writes `.claude/agents/<name>.md`.

---

## 5. Skills

Skills are reusable, documented capabilities (e.g. `dataviz`, `update-config`, `verify`). Invoke with `/skill-name` or let Claude trigger them when relevant. Project‑specific skills can live in `.claude/skills/`.

---

## 6. Memory (Persistent Across Sessions)

Two layers:

1. **Session context** – the live transcript; survives `/model` switches.
2. **Project memory** – `C:\Users\Admin\.claude\projects\D--Projects‑NEFRU‑ai\memory\`
   - One Markdown file per fact, indexed by `MEMORY.md`.
   - Tell Claude: *“remember that the API uses Bearer tokens”* → it creates a file + index entry.
   - Deduplicated, updatable, deletable.

---

## 7. Hooks & Settings

`~/.claude/settings.json` (global) or `.claude/settings.json` (project) controls:
- **Permissions** – allow/deny commands (`"allow": ["Bash(npm test:*)"]`).
- **Hooks** – run scripts on events (`PreToolUse`, `PostToolUse`, `Stop`).
  Example: block `git push` unless explicitly approved.

```json
{
  "permissions": { "allow": ["Bash(npm run:*)"], "deny": ["Bash(git push:*)"] }
}
```

---

## 8. MCP (Model Context Protocol)

Connect external tools (databases, browsers, APIs):
```bash
claude mcp add mydb -- npx -y @modelcontextprotocol/server-sqlite ./data.db
```
Then Claude can query that DB directly in chat.

---

## 9. Common Workflows in This Repo

| Goal | Command |
|------|---------|
| Start full stack | `npm run dev` (concurrently backend + frontend) |
| Seed DB | `npm run seed` |
| Review changes | `/code-review` |
| Security pass | `/security-review` |
| Boot & smoke‑test | `/agent verify-run` |
| Build & check Docker | `/agent deploy-checker` |
| Lint | `npm run lint --prefix frontend` (or `/agent lint-checker`) |

---

## 10. Pro Tips

- **Be specific**: “Add JWT refresh to `authUser.controller.js`, mirror the existing login flow” beats “add auth”.
- **Use Plan mode** for big refactors — approve the approach before code is written.
- **Ask it to remember** project conventions so future sessions stay consistent.
- **Iterate**: if output is off, say “now make it match the style in `Table.jsx`”.
- **`/clear`** when context gets noisy and you want a fresh start.

---

*Generated for the NEFRU_ai project. Edit `docs/claude-code-tutorial.md` to keep it in sync with your setup.*
