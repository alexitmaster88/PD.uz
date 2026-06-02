---
name: tech-debt
description: Scan the codebase for technical debt, deprecated patterns, and areas that need refactoring.
---


## Tech Debt Scanner

Scan the project for technical debt and create a prioritized report.

## Steps

1. Search for TODO, FIXME, HACK, and XXX comments across all source files
2. Look for deprecated API usage and outdated patterns
3. Check for duplicated code blocks (3+ similar lines)
4. Identify functions longer than 50 lines
5. Flag any hardcoded values that should be config/env vars
6. Check for missing error handling (try/catch, .catch())

## Output Format

Create a summary with:
- **Critical** - Things that could break in production
- **High** - Should fix soon
- **Medium** - Clean up when touching nearby code
- **Low** - Nice to have improvements
For each item, include the file path, line number, and a one-line description.