# .agent — Working Context for AI-Assisted Refactoring

This folder persists planning, analysis, and change history so work can continue
across sessions and be reviewed by humans.

## Contents

| File | Purpose |
|---|---|
| `CONTEXT.md` | Project snapshot: stack, structure, key facts an agent needs before touching code |
| `analysis/frontend-analysis.md` | Full frontend audit (findings with file paths + line numbers) |
| `analysis/admin-analysis.md` | Admin backend + admin portal audit (2026-08-26) |
| `PLAN.md` | Phased plan of changes — single source of truth for what to do next |
| `checklists/phase-N.md` | Detailed per-phase checklists with status |
| `CHANGELOG.md` | What was actually changed, per phase, with file lists — for human review |

## Workflow rules

1. Before starting any work: read `PLAN.md` and the current phase checklist.
2. Update the checklist item status as you complete each step (not in batches).
3. After finishing a phase (or a meaningful unit), append to `CHANGELOG.md`
   listing every file touched and why.
4. Never start a new phase without explicit user approval.
5. If reality diverges from the plan, update the plan first, then the code.

## Status

- **Phase 1** (critical fixes): COMPLETE 2026-08-26 — build passes; see
  `CHANGELOG.md` for full review notes and `checklists/phase-1.md`
- Phase 2–5: NOT STARTED (Phase 2 next — needs user approval)
- **Phases 6–7** (admin backend + frontend): COMPLETE 2026-08-26 — see
  `checklists/phase-6-7.md` + `CHANGELOG.md`; booking page is READ-ONLY per
  product decision
