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

## CI checks (must all pass)

| Check | What it catches |
|-------|----------------|
| `sphinxbuild` | Build errors and warnings |
| `sphinx-lint` | RST syntax issues |
| `codespell` | Spelling errors |
| `check-occ-command` | Invalid OCC command references |

Sphinx treats warnings as errors in CI — fix all of them.
