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

## CI checks (must all pass)

| Check | What it catches |
|-------|----------------|
| `sphinxbuild` | Build errors and warnings |
| `sphinx-lint` | RST syntax issues |
| `codespell` | Spelling errors |
| `check-occ-command` | Invalid OCC command references |

Sphinx treats warnings as errors in CI — fix all of them.
