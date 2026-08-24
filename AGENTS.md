# Nextcloud Documentation — Agent Instructions

## Project identity

Sphinx/RST documentation repo for Nextcloud Server. Three manuals, no application code.
Vue, TypeScript, PHP, and framework conventions do not apply here.

Manuals:
- `user_manual/` — end-user features and workflows
- `admin_manual/` — server installation, configuration, operations
- `developer_manual/` — app development, APIs, architecture

Never mix content across manuals. If scope is ambiguous, ask.

## Content format

- Format: reStructuredText (`.rst`) exclusively — no Markdown
- File names: lowercase, underscores only (e.g. `file_name_config.rst`)
- Image names: lowercase, hyphens (e.g. `my-screenshot.png`)
- Line wrap: 120 characters max
- Headings: sentence case, 3 levels max

```rst
================
Page title (h1)
================

Subhead (h2)
------------

Subhead (h3)
^^^^^^^^^^^^
```

- GUI elements: bold and literal (`**Create** button`, `**Username** field`)
- Sphinx directives: `.. note::`, `.. warning::`, `.. tip::`, `.. figure::`, `.. toctree::`, `.. code-block::`
- Cross-refs: `:doc:`, `:ref:`, `:guilabel:`, `:kbd:`, `:command:`
- Full conventions: `style_guide.rst`

## Build

```bash
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

make html                                                    # all manuals
cd user_manual && make html                                  # single manual
cd user_manual && make SPHINXBUILD=sphinx-autobuild html     # live-reload

sphinx-lint path/to/file.rst    # RST lint
codespell path/to/file.rst      # spell check
```

Build output: `<manual>/_build/html/`. Run a build locally before marking work done.

## Page moves — redirects required

When renaming or moving a page, add a redirect in that manual's `conf.py` via `sphinx_reredirects`.
Never leave a broken URL.

```python
# in e.g. admin_manual/conf.py
redirects = {
    "old/page_name": "../new/page_name.html",
}
```

## Translations

Never edit files under `locale/`. Managed by Transifex, synced via CI.
Source strings live in `.rst` files only.

## Before starting any PR — required reading

Read `style_guide.rst` at the repo root before making any changes. It is the authoritative style reference for all three manuals and takes precedence over generic RST conventions.

```bash
# quick reference during work
cat style_guide.rst
```

## Resources

### Sphinx / RST
- [reStructuredText Primer](https://www.sphinx-doc.org/en/master/usage/restructuredtext/basics.html) — core RST syntax
- [Sphinx directives reference](https://www.sphinx-doc.org/en/master/usage/restructuredtext/directives.html) — `.. note::`, `.. code-block::`, `.. toctree::`, etc.
- [Sphinx cross-referencing](https://www.sphinx-doc.org/en/master/usage/referencing.html) — `:doc:`, `:ref:`, `:guilabel:`, `:kbd:`
- [sphinx-rtd-theme](https://sphinx-rtd-theme.readthedocs.io/) — the theme used; check it for layout behaviour

### This repo
- `style_guide.rst` — **read this first**, always
- `CONTRIBUTING.md` — full contributor workflow
- `.github/pull_request_template.md` — PR checklist

### Tools
- [sphinx-lint](https://github.com/sphinx-contrib/sphinx-lint) — RST linter used in CI
- [codespell](https://github.com/codespell-project/codespell) — spell checker used in CI
- [sphinx_reredirects](https://pypi.org/project/sphinx-reredirects/) — redirect extension used for page moves

## Working on existing issues

Before editing any page:
1. **Read the full page first** — never patch blind; understand existing context, structure, and tone
2. **Search for related content** — same topic may appear in multiple manuals or sections; check all of them for consistency
3. **Check cross-references** — search for `:doc:` and `:ref:` links pointing to the page; related pages may need updating too
4. **Grep for the affected term/feature** across the repo — docs often repeat concepts in different contexts

```bash
grep -r "feature_name" user_manual/ admin_manual/ developer_manual/ --include="*.rst" -l
```

5. **Verify the fix builds** — run `sphinx-lint` on edited files and `make html` on the affected manual before marking done
6. **One issue, one PR** — don't fix unrelated problems noticed along the way; open separate issues instead

## Branch strategy

- `master` = latest (currently NC34)
- `stableNN` = specific release (e.g. `stable32`, `stable33`)
- Always branch from `master` for new work
- Backports: cherry-pick to stable branches, or trigger bot with `/backport to stableNN` comment
- Branch naming: `fix/short-description`, `feature/short-description`, `fix/short-description-stableNN`

## Git rules

- Every commit must be signed off: `git commit --signoff` (DCO required)
- Conventional Commits: `docs:`, `fix:`, `feat:`, `chore:`, `ci:`
- `git pull --rebase` — never merge master into branch
- Squash fixup commits before marking PR ready for review

## PR conventions

- Fill in `.github/pull_request_template.md` — never skip or replace it
- Screenshots required for any visual or layout changes
- Link issues: `Fix #NNNN` or `relates to #NNNN`
- One concern per PR; separate PRs per target version
- No force-push after review has started

## Labels

### State labels — exactly one at all times
State labels are mutually exclusive. Always remove the old one when applying a new one.

| Label | When |
|-------|------|
| `0. needs triage` | Newly opened, not yet assessed |
| `1. to develop` | Confirmed, not yet started |
| `2. developing` | PR is a draft / in progress |
| `3. to review` | PR is ready for review |

### Feature / topic labels
Use feature labels (e.g. `talk`, `groupware`, `files`, `installation`) to tag PRs and issues by area.
When opening a PR that fixes an issue, check what labels the issue has and copy relevant feature labels to the PR.

```bash
# inspect labels on the linked issue
gh issue view NNNN --json labels
```

### Issue hygiene when opening a PR
When a PR fixes or relates to an issue:
1. Set the issue state label to `3. to review` — remove all other state labels (`0.`, `1.`, `2.`)
2. Copy any relevant feature labels from the issue to the PR
3. Assign yourself to the issue

```bash
gh issue edit NNNN \
  --add-label "3. to review" \
  --remove-label "0. Needs triage" --remove-label "1. to develop" --remove-label "2. developing" \
  --add-assignee "@me"
```

Use `fixes #NNNN` in the PR body to auto-close on merge; use `relates to #NNNN` if the PR only partially addresses the issue.

## CI checks (must all pass)

| Check | What it catches |
|-------|----------------|
| `sphinxbuild` | Build errors and warnings |
| `sphinx-lint` | RST syntax issues |
| `codespell` | Spelling errors |
| `check-occ-command` | Invalid OCC command references |

Sphinx treats warnings as errors in CI — fix all of them.

## Nextcloud Contribution Policy

All contributions generated or assisted by this agent must fully comply with:

- **[AI Contribution Policy](https://github.com/nextcloud/.github/blob/master/AI_POLICY.md)** - the primary reference for AI-specific rules, covering disclosure, author accountability, communication, security, licensing, code quality, and autonomous agent behavior.
- **[Contribution Guidelines](https://github.com/nextcloud/.github/blob/master/CONTRIBUTING.md)** - covering testing requirements, the Developer Certificate of Origin (DCO), license headers, conventional commits, and translations. These apply in full to all contributions regardless of how they were produced.

### What this agent must always do

- Add an `Assisted-by: AGENT_NAME:MODEL_VERSION` git trailer to every commit containing AI-assisted content.
- Ensure every pull request includes a disclosure of AI tool use in the PR description.
- Produce focused, scoped pull requests that address exactly one concern. Do not touch unrelated files or introduce incidental refactors.
- Write code comments that document the code, never the process that produced it:
  - Comments describe what the code does - method signatures, behavior, and constraints the code itself cannot express (e.g. a non-obvious invariant or workaround).
  - Never add comments that document progress, decisions, or changes (e.g. "changed X to Y", "as requested", "this fixes ...", "previously this did ..."). That belongs in the commit message or PR discussion; in the code it goes stale and becomes misleading.
  - Do not narrate self-explanatory code. If the code is readable without a comment, omit the comment.
  - Keep comments brief - short and simple, matching the comment density of the surrounding code.
- Reuse existing helper functions and utilities instead of re-implementing their logic inline. When fixing a flawed pattern, fix every occurrence of it across the changed code, not only the instance that was pointed out.
- Explicitly inform the contributor when any action they are about to take, or have taken, would violate the AI Contribution Policy or the Contribution Guidelines. Do not silently proceed. State which rule is at risk and what the contributor should do instead.
- Warn the contributor if a pull request is growing too large. A PR approaching several thousand lines of changed code is a signal that it should be split into smaller, focused PRs. Suggest a logical split before the PR is opened, not after.
- Recommend opening a ticket for discussion before starting implementation whenever a feature or change is sufficiently complex - for example when it touches multiple subsystems, requires architectural decisions, or the right approach is not yet clear. A ticket allows maintainers and the contributor to align on direction before code is written, avoiding wasted effort on a PR that may be rejected or require fundamental rework.

### What this agent must never do

- Open issues, submit pull requests, post review comments, or send security reports autonomously. Every contribution must be reviewed and submitted by a human.
- Add `Signed-off-by` tags to commits. Only the human contributor can certify the Developer Certificate of Origin.
- Generate or submit security reports without independent human verification. Report verified vulnerabilities via [HackerOne](https://hackerone.com/nextcloud), not as GitHub issues.
- Write PR descriptions, review comments, or issue reports on behalf of the contributor. These must be in the contributor's own words.
- Fully automate the resolution of issues labeled [`good first issue`](https://github.com/issues?q=org%3Anextcloud+label%3A%22good+first+issue%22) or similar beginner-friendly labels.
- Submit code that has not been reviewed and cleaned up by the contributor. Dead code, redundant logic, excessive comments, malformed or garbled characters (e.g. `�` replacement characters), and unrelated changes must be removed before submission.
