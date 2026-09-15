# AGENTS.md

Bun TypeScript CLI that talks to Telegram over MTProto. Uses `teleproto` (client) and `@clack/prompts` (interactive setup). Entry point is `src/index.ts`; imports carry explicit `.ts` extensions. No build step. No tests.

## Commands

- Install deps: `bun install` (runs the husky `prepare` hook; hook scripts live in `.husky/`)
- Typecheck: `bunx tsc` — `tsconfig.json` sets `noEmit`, so this is the only check. Leave no errors.
- Lint: `bun run lint` — `oxlint --fix`. Writes fixes **in place** and is type-aware (`typeAware`/`typeCheck` on).
- Format: `bun run fmt` — `oxfmt`. Formats in place.

No test command exists. Do not invent one.

## Code style

Tabs, no semicolons, single quotes, no trailing commas, avoided arrow parens, sorted imports, no final newline. Enforced by `.editorconfig` and `.oxfmtrc.json`.

After editing run `bun run fmt` then `bun run lint`. Unstaged drift gets cleaned at commit.

## TypeScript

Target ESNext on bun (`types: ["bun"]`, module `Preserve`). Constraints from `tsconfig.json`:

- `verbatimModuleSyntax` — type-only imports must use `import type`
- `erasableSyntaxOnly` — no enums, no parameter properties, no namespaces; use const objects / string unions
- `noUncheckedIndexedAccess` — indexed access returns `T | undefined`; narrow before use
- `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters` — strict; unused or loose optional code fails typecheck
- imports require explicit `.ts` extensions (`allowImportingTsExtensions`); no extensionless imports

## Git workflow

`prepare` installs husky; `.husky/pre-commit` runs `nano-staged`, which runs `oxfmt` then `oxlint --fix` on **staged files only**.

- `git add` exactly what you intend to commit, then commit. If a commit fails, fix the issue in a new commit; don't amend.
- Keep the diff scoped and all checks clean (`bunx tsc`, `bun run lint`) before committing.

## OpenCode workflow

- Coding tasks run through `/pipeline` (defined in `.opencode/`): the `implementer` subagent writes code, the `reviewer` subagent (`edit: deny`) approves or requests changes. The orchestrator never edits code.
- The `caveman` skill (`.agents/skills/caveman/SKILL.md`, registered in `opencode.json`) is always active during pipeline runs. Session output is terse; committed code, comments, and commit messages stay normal prose.
- Do not commit dependencies under `.opencode/` — the local `package.json` there is gitignored.