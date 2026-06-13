# Project Documentation

## Purpose

Single source of truth for project architecture, status, and roadmap. These docs are the navigational map for anyone working on the project.

## Ownership

- `ARCHITECTURE.md` — System design, data flow, and architectural decisions
- `PROJECT_STATUS.md` — Current completion state of every feature and phase
- `TODO.md` — Prioritized near-term actions and future roadmap

## Local Contracts

- `ARCHITECTURE.md` is the single source of truth for system design — if it's not there, it doesn't exist
- `PROJECT_STATUS.md` tracks completion state of every feature — updated after every phase
- `TODO.md` is prioritized with the most immediate actions first
- Documentation must be internally consistent: no stale references, no contradictory statements
- Every phase completion updates all three docs

## Work Guidance

- Update docs immediately after completing work — not "later"
- ARCHITECTURE.md changes that affect core design should note the rationale
- PROJECT_STATUS.md uses a consistent format: phase → feature → status (done/in-progress/planned)
- TODO.md items link to relevant GitHub issues when they exist

## Verification

- All three docs are consistent with each other
- PROJECT_STATUS.md accurately reflects the current codebase
- No stale references to removed or renamed features
- ARCHITECTURE.md is up to date with the actual implementation

## Child DOX Index

No children — leaf node.
