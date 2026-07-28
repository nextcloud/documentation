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

## Screenshot composition

Rules for Playwright screenshot specs. Refine this section as new patterns emerge.

### Clip to element bounding box, not container offsets

Always anchor clips to the target element's own `boundingBox()`, never to hardcoded pixel offsets
from a parent container. Fixed offsets break silently when adjacent UI (badges, notification buttons,
extra rows) shifts position.

```typescript
const btn = page.locator('button', { hasText: 'Archived conversations' })
const listEl = page.locator('[aria-label="Conversation list"]')
const listBox = await listEl.boundingBox()
const btnBox = await btn.boundingBox()
if (listBox && btnBox) {
    await page.screenshot({
        path: dest,
        clip: {
            x: listBox.x,
            y: btnBox.y - 80,            // ~80px above to show context
            width: listBox.width,
            height: btnBox.height + 88,  // button height + ~8px below
        },
    })
}
```

### Show menu/list items in context

When screenshotting a button or item inside a list or panel, include enough surrounding rows to show
where it lives. ~80px above the target is a reasonable default; adjust if nearby rows are unusually
tall. A crop so tight the element appears orphaned gives users no spatial reference.

### Wait for animation before screenshotting nested panels

If clicking a button navigates *within* a container (not a separate modal), the replaced section may
still be animating out. Wait for it to reach `state: 'hidden'`, then add a short `waitForTimeout(400)`
to let the incoming panel settle:

```typescript
await page.locator('button:has-text("Manage bans")').click()
const banDialog = page.getByRole('dialog', { name: /banned users/i })
await banDialog.waitFor({ state: 'visible', timeout: 10000 })
await page.locator('#settings-section_conversation-settings')
    .waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {})
await page.waitForTimeout(400)
await banDialog.screenshot({ path: dest })
```

### Use `pressSequentially` for Vue reactive search inputs

`fill()` sets an input's value in one shot and can bypass Vue's reactive watchers, leaving the UI
in its previous state (e.g. a search field appears empty, results never update). Use
`pressSequentially` with a small inter-key delay so each keystroke fires its own input event:

```typescript
// fill() bypasses Vue reactivity — use pressSequentially instead
await searchInput.click()
await searchInput.pressSequentially('laptop', { delay: 80 })
// Confirm reactivity fired: wait for a DOM change only possible after the search updates
await page.locator('.frequently-used-label').waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {})
await page.locator('.search-result').first().click({ timeout: 3000 }).catch(() => {})
```

### Guard conditional `boundingBox()` calls with `isVisible()`

`locator.boundingBox()` waits for the element using the full action timeout (default 30–60 s) when the
element is absent from the DOM. An unguarded `.catch(() => null)` does not help — the 60 s timeout fires
before the catch runs. Always check `isVisible()` first (instant, no wait) before calling `boundingBox()`:

```typescript
// Wrong — times out for 60s if element is absent:
const box = await locator.boundingBox().catch(() => null)

// Correct — instant check, then fetch box only when present:
const box = (await locator.isVisible()) ? await locator.boundingBox() : null
```

This is especially important inside screenshot tests that compute clip regions from optional UI
(e.g. a badge button that only appears under certain conditions).

### Seed rich content inline between messages

File shares, reactions, and other message cards must be seeded *between* the surrounding messages
they should appear near. Seeding them before the conversation is populated places them at the top of
chat history, scrolled out of the visible viewport by the time the screenshot is taken.

```typescript
await seedChatMessages(token, [ /* messages before the share */ ])
await uploadFile(path, name, user, password)
await ocsRequest('POST', '/ocs/v2.php/apps/files_sharing/api/v1/shares', user, password, {
    shareType: '10', path: `/${name}`, shareWith: token,
})
await seedChatMessages(token, [ /* messages after the share */ ])
```

### Backdating folder mtimes in the Files app

NC's `oc_filecache.mtime` is what the Files app displays, but you must update **both** the DB and
the real filesystem — NC's lazy scanner re-reads the filesystem on every PROPFIND and will overwrite
a DB-only change. Use `files/FolderName` as the path (the home storage prepends `files/`):

```typescript
// Update oc_filecache
const sql = `UPDATE oc_filecache SET mtime=${ts}, storage_mtime=${ts}
             WHERE path='files/Documents'
             AND storage=(SELECT numeric_id FROM oc_storages WHERE id='home::christine')`
// Also touch the real directory
await runExec(['touch', '-m', '-d', `@${ts}`, '/var/www/html/data/christine/files/Documents'])
```

Run backdates **after** the first login — apps like Talk initialise their storage folder on first
login and would overwrite an earlier backdate.

NC's in-process Sabre/DAV cache (per Apache worker, not APCu) holds the mtime from first access
and ignores external writes for the lifetime of that worker. For screenshots that must show a
specific folder date, intercept the PROPFIND response and patch `getlastmodified` directly:

```typescript
// In beforeEach — intercepts the root directory listing for all tests
await page.route('**/remote.php/dav/files/christine/', async (route, request) => {
    if (request.method() !== 'PROPFIND') { await route.continue(); return }
    try {
        const response = await route.fetch()
        const body = await response.text()
        const patched = body.replace(
            /(<d:href>[^<]*\/Talk\/<\/d:href>[\s\S]*?<d:getlastmodified>)(.*?)(<\/d:getlastmodified>)/,
            '$1Thu, 15 May 2026 00:00:00 GMT$3',
        )
        await route.fulfill({ response, body: patched, contentType: response.headers()['content-type'] || 'application/xml' })
    } catch (_) {
        await route.continue().catch(() => {})
    }
})
```

### `oc_talk_rooms.last_activity` is a DATETIME column, not a Unix integer

Writing a raw integer to this column causes PHP's `new DateTime()` to throw (HTTP 500). Use
SQLite's `datetime()` conversion:

```sql
UPDATE oc_talk_rooms SET last_activity = datetime(1748822400, 'unixepoch') WHERE token = 'abc'
```

Talk's `getRooms` API also filters rooms by `modifiedSince`. Backdating `last_activity` makes rooms
disappear after the first poll. Fix by setting `last_attendee_activity` 2 h in the future — Talk
passes the room if either timestamp is recent enough:

```sql
UPDATE oc_talk_attendees SET last_attendee_activity = <now + 7200>
WHERE room_id = (SELECT id FROM oc_talk_rooms WHERE token = 'abc') AND actor_id = 'christine'
```

## CI checks (must all pass)

| Check | What it catches |
|-------|----------------|
| `sphinxbuild` | Build errors and warnings |
| `sphinx-lint` | RST syntax issues |
| `codespell` | Spelling errors |
| `check-occ-command` | Invalid OCC command references |

Sphinx treats warnings as errors in CI — fix all of them.
