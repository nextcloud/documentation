---
title: Fix X-NC-WebDAV-AutoMkcol header name in WebDAV client API docs
date: 2026-08-07
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
execution: code
product_contract_source: ce-plan-bootstrap
origin: issue #15365 (https://github.com/nextcloud/documentation/issues/15365)
depth: lightweight
settled_decision_conflicts: []
---

# Fix X-NC-WebDAV-AutoMkcol header name in WebDAV client API docs

## Problem Frame

The developer manual documents the optional upload header as
`X-NC-WebDAV-AutoMkcol` in `developer_manual/client_apis/WebDAV/basic.rst`
at two places (lines 111 and 615). The Nextcloud server reads
`X-NC-WebDAV-Auto-Mkcol` (with a second hyphen) in
`apps/dav/lib/Upload/UploadAutoMkcolPlugin.php` (line 41 of nextcloud/server
master). Clients following the documentation send the wrong header and
receive a 403 on uploads that should auto-create parent directories.

## Requirements

- R1. Rename the header from `X-NC-WebDAV-AutoMkcol` to
  `X-NC-WebDAV-Auto-Mkcol` in both occurrences in
  `developer_manual/client_apis/WebDAV/basic.rst`.
- R2. No other file in the repository may contain the misspelled
  `AutoMkcol` variant after the change (verified by repository-wide grep).
- R3. The fix is documentation-only; no source code of this repository
  changes, and no server-side behavior is proposed or requested.

## Scope Boundary

In scope: the two header-name occurrences in `basic.rst`.

Out of scope:
- Any change to server code (the server name is canonical).
- Reformatting or rewording the affected tables beyond the header name.
- Other documented headers or WebDAV endpoint behavior.

## Key Technical Decisions

- KTD-1 (user-directed): use `X-NC-WebDAV-Auto-Mkcol` as the corrected name.
  Rejected alternative: keeping `AutoMkcol` — the server's
  `UploadAutoMkcolPlugin` checks `X-NC-WebDAV-Auto-Mkcol`; the docs are
  wrong, not the server. Evidence: nextcloud/server
  `apps/dav/lib/Upload/UploadAutoMkcolPlugin.php:41`.

## Assumptions

- The server-side header name remains stable for the current and upcoming
  documented versions (the plugin line was verified on server master).
- The reporter's observed 403 was caused by the header mismatch; the fix
  aligns docs with server behavior.

## Implementation Units

### U-1 Rename header in WebDAV request-headers table

Files: `developer_manual/client_apis/WebDAV/basic.rst`

- Line 111 (PUT row in the request-methods table): replace
  ``X-NC-WebDAV-AutoMkcol`` with ``X-NC-WebDAV-Auto-Mkcol`` inside the
  existing literal markup, keeping the table cell width intact.
- Line 615 (request-headers table row): replace the header cell
  ``X-NC-WebDAV-AutoMkcol`` with ``X-NC-WebDAV-Auto-Mkcol`` and widen the
  first table column to fit the longer name, keeping the RST grid-table
  borders aligned (re-run `sphinx-build`/`rst-lint` equivalent check or
  visually verify the table renders).

Verification:
1. Repository-wide grep for `AutoMkcol` (excluding the hyphenated variant)
   returns zero matches.
2. Grep confirms both `X-NC-WebDAV-Auto-Mkcol` occurrences exist at the
   expected lines.
3. RST table structure remains valid (grid-table column widths consistent;
   doc build succeeds or cell borders line up).

## Dependencies and Sequencing

Single unit; no ordering constraints.

## Risks

- RST grid tables break silently when column widths are edited
  incorrectly — mitigation is the table-validity check in U-1 verification.
