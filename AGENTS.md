# Agent instructions

You are working on soominlab.com, a case-study portfolio. The site is itself the evidence for
what it claims, so a change that quietly makes a claim untrue is worse than no change.

This file is the entrypoint. Read it in full; load the rest only as the task demands.

## Read first

[`CONTRIBUTING.md`](CONTRIBUTING.md) governs how to work here. Walk its **Read-First Checklist**
before the first edit and its **Self-Verification** before claiming anything is done.

## Reference map

| If the task is…                                         | Read                                              |
| ------------------------------------------------------- | ------------------------------------------------- |
| Anything that writes code                               | `CONTRIBUTING.md`                                 |
| Running it locally, and what each script does           | `README.md` §Getting Started, §Scripts            |
| Why routes prerender, which two do not, theming and CSP | `README.md`                                       |
| Next.js APIs, config, file conventions                  | `node_modules/next/dist/docs/`                    |
| Framework-level quality bar before shipping             | `…/docs/01-app/02-guides/production-checklist.md` |
| What must pass before a change ships                    | `README.md` §Verification Gates                   |
| What a case study asserts about this site               | `content/work/{en,ko}/*.mdx`                      |

Skip what the task does not need. Do not preload everything.

Next ships the framework half of this: version-matched docs, a production checklist, and runtime
visibility through its MCP server. It does not ship project conventions, and cannot — those are
`CONTRIBUTING.md`. Neither substitutes for the other.

## Verifying at runtime

Compiling is not working. Use the tooling rather than inferring from a green build:

- `next dev` serves `/_next/mcp`, which answers what Next itself sees — routes, server logs,
  compilation issues — without a full `next build`. `.mcp.json` wires it up; a production build
  does not serve it.
- `.claude/skills/next-dev-loop` is the edit-and-verify rhythm on top of that, cross-checked
  against the browser. Invoke it as a skill after edits to app code; where skills do not exist,
  read it as a document and follow it. `/_next/mcp` is a plain HTTP endpoint — `curl` reaches it
  from any tool, with or without `.mcp.json`.
- `next dev` forwards browser warnings and errors to the terminal
  (`logging.browserToTerminal` in `next.config.ts`).
- A second `next dev` prints the running server's URL and PID instead of starting a duplicate.
  Connect to the one already running.

## Instruction priority

The user's explicit instructions > this file and `CONTRIBUTING.md` > default behaviour.

## The one rule, if you read nothing else

**Do not state a cause, a number, or a fix you have not measured.** Everything in
`CONTRIBUTING.md` §Never-Do is a specific case of this, and every entry there is drawn from a
mistake that actually shipped from this repo.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
