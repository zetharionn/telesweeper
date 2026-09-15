# AGENTS.md

Toolchain: bun. No build step, no tests, no README. `src/` currently empty.

## Verify work

- Typecheck: `bunx tsc` (`tsconfig.json` has `noEmit`, so this is the only kind of check)
- Lint: `bun run lint` — runs `oxlint --fix`, **mutates files in place**
- Format: `bun run fmt` — `oxfmt`, formats in place

No test command exists. Do not invent one; `src/` is a blank slate.

## Style (enforced, not optional)

- Tabs, no semicolons, single quotes, no trailing commas, avoided arrow parens, sorted imports, no final newline (`.editorconfig`, `.oxfmtrc.json`)
- After editing run `bun run fmt`; format drift will be auto-fixed on commit anyway
- Git hooks via `simple-git-hooks` (postinstall) -> `nano-staged` -> `oxfmt; oxlint --fix` on **staged files only**. Stage with `git add`, then commit; unstaged edits get cleaned at commit.

## TypeScript constraints (tsconfig)

- `verbatimModuleSyntax`: type-only imports must use `import type`
- `erasableSyntaxOnly`: no enums, no parameter properties, no namespaces; use const objects / unions instead
- `noUncheckedIndexedAccess`: indexed access returns `T | undefined`
- `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters` all strict
- Runtime is bun: `types: ["bun"]`, `allowImportingTsExtensions`, import extensions required

## opencode workflow

- Coding tasks run through `/pipeline` command: `implementer` subagent writes code, `reviewer` subagent (`edit: deny`) approves or requests changes. Orchestrator never edits code.
- Caveman skill auto-discovered from `.agents/skills/caveman/SKILL.md` (registered in `opencode.json`). Response style follows it; committed code, comments, and commit messages stay normal prose.
- `.opencode/` holds agent/command definitions plus a gitignored `package.json` for `@opencode-ai/plugin`; do not commit deps under `.opencode/`.