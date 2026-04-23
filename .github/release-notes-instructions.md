# Release Notes Instructions

When generating release notes for a new release, use the following prompt with GitHub Copilot (or another AI assistant), substituting the changelog and version number as appropriate.

---

## Prompt

Generate release notes for **[version]** of the `nextcloud/documentation` repository based on the following changelog.

For each PR in the changelog, look up the original (non-backport) PR to identify the true author. Organize the release notes into sections by which manual the PR touches: **Admin Manual**, **Developer Manual**, and **User Manual**. If a PR touches multiple manuals, include it in each relevant section with a summary appropriately tuned to that manual's audience. Eliminate any section for which there are no PRs.

For each entry, write a concise human-readable summary (not just the PR title), and attribute it with `by @author in #number`.

At the end, include a **New Contributors** section calling out any authors whose `author_association` on the original PR is `CONTRIBUTOR` (rather than `MEMBER`) — these are first-time or external contributors.

All PRs are backported via `@backportbot` — include a note at the bottom acknowledging this and clarifying that original authors are credited throughout.

**Changelog:**

[paste changelog here]

---

## Notes

- The changelog can be found on the [releases page](https://github.com/nextcloud/documentation/releases) or generated via GitHub's "Generate release notes" button as a starting point.
- The key instructions that drive the correct output are:
  1. **Look up original PRs** to get the real author, not `backportbot`
  2. **Organize by manual**, not by type of change
  3. **Cross-manual PRs appear in each relevant section** with tuned summaries
  4. **`CONTRIBUTOR` association = new/external contributor** worth calling out
