# Contributing to Nextcloud Documentation

Thank you for taking the time to contribute! This guide explains everything you
need to know to submit improvements to the Nextcloud user, administration, and
developer manuals.

---

## Table of Contents

1. [Where to ask questions](#where-to-ask-questions)
2. [Setting up a local build environment](#setting-up-a-local-build-environment)
3. [Making changes](#making-changes)
4. [Opening a pull request](#opening-a-pull-request)
5. [DCO sign-off](#dco-sign-off)
6. [Review process](#review-process)
7. [Style guide](#style-guide)
8. [Issue templates](#issue-templates)

---

## Where to ask questions

- **GitHub Discussions / Issues** – open an issue in this repository for
  documentation-specific questions and suggestions.
- **Nextcloud Community Forum** – <https://help.nextcloud.com>
- **Talk room** – join the public documentation chat room at
  <https://cloud.nextcloud.com/call/uuz59j6z> for real-time chat with
  contributors.

---

## Setting up a local build environment

Documentation is built with [Sphinx](https://www.sphinx-doc.org/). A local
build lets you preview changes accurately before opening a PR.

### Using a Python virtual environment (recommended)

```bash
# 1. Clone the repository
git clone https://github.com/nextcloud/documentation.git
cd documentation

# 2. Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate       # on Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Build HTML (all manuals)
make html
```

The built HTML files appear under each manual's `_build/html/` directory,
e.g. `user_manual/_build/html/index.html`.

### Using the VSCode DevContainer

The repository ships a ready-to-use
[Dev Container](https://code.visualstudio.com/docs/devcontainers/containers).
Open the repository in VSCode, accept the prompt to reopen in the container,
then run `make html` in the integrated terminal.

### Live-reload while editing

```bash
pip install sphinx-autobuild
cd user_manual          # or admin_manual / developer_manual
make SPHINXBUILD=sphinx-autobuild html
# Open http://127.0.0.1:8000 in your browser
```

See [README.rst](README.rst) for additional build targets (PDF, translated
versions, etc.).

---

## Making changes

- Work in the correct branch:
  - `master` → latest (unreleased) version
  - `stable*` branches → the corresponding released version (e.g. `stable29`)
- If your change applies to multiple versions, open one PR per branch (or
  note in the PR description that backporting is needed).
- Keep the scope of a PR focused. Separate unrelated fixes into separate PRs.
- Wrap prose at **120 characters** per line where practical.
- Follow the [Style Guide](style_guide.rst) for formatting conventions.
- Do **not** rename or move existing pages without adding a redirect, because
  many external sites link to our documentation.

---

## Opening a pull request

1. Fork the repository on GitHub.
2. Create a new branch from the target branch:
   ```bash
   git checkout -b fix/short-description
   ```
3. Make your changes and commit them (see [DCO sign-off](#dco-sign-off) below).
4. Push the branch to your fork:
   ```bash
   git push origin fix/short-description
   ```
5. Open a pull request against the appropriate branch of
   `nextcloud/documentation`.
6. Fill in the pull request template — include a screenshot of changed pages
   where relevant.

---

## DCO sign-off

All commits must be signed off to certify adherence to the
[Developer Certificate of Origin](https://developercertificate.org/).

Add the following line to every commit message (replace with your real name and
email):

```
Signed-off-by: Your Name <your.email@example.com>
```

The easiest way is to pass `-s` to `git commit`:

```bash
git commit -s -m "docs: fix typo in backup section"
```

Make sure the email address matches the one in your GitHub profile. If you have
GitHub's privacy setting enabled, it will be
`github-username@users.noreply.github.com`.

---

## Review process

1. A maintainer will review your PR, usually within a few days.
2. Automated checks (spelling, link validation) run on every PR. Fix any
   reported issues before requesting a re-review.
3. The reviewer may request changes. Address feedback and push new commits to
   the same branch — do **not** force-push after a review has started.
4. Once approved, a maintainer will merge the PR.

---

## Style guide

Please read [style_guide.rst](style_guide.rst) before writing new content. It
covers:

- File and image naming conventions
- Heading hierarchy
- GUI label formatting and inline code
- Admonitions (`.. note::`, `.. warning::`, `.. tip::`, `.. danger::`)
- Voice and tone (active voice, present tense, second person)
- Code block language tags
- Version directives (`.. versionadded::`, `.. versionchanged::`,
  `.. deprecated::`)
- Internal cross-references (`:doc:`, `:ref:`, `:guilabel:`, `:kbd:`)
- Shared content with `.. include::`
- Table syntax

---

## Issue templates

When reporting a problem or suggesting an improvement, please use the GitHub
issue templates provided in this repository. They help maintainers triage
requests quickly.
