#!/usr/bin/env python3
"""Generate SVG for the NEW Nextcloud Developer Manual structure.

Hierarchy (3 levels):
- Section (top): e.g. "App Development"
- Subsection: e.g. "PHP App", "ExApp", "Release notes"
- Sub-sub-section (only inside subsections that have nested groups):
  e.g. under PHP App -> "Basics", "Core concepts", "Backend", ...
- Leaves: actual page boxes.

Each subsection lays out its content in one or more columns:
- ("leaves", header, kind, [...])    => 1 column
- ("groups", header, kind, [groups]) => N columns (one per sub-sub)
- ("bare", [...])                    => 1 column without subsection header
"""

# ----- Style -----
FONT = "Inter, -apple-system, BlinkMacSystemFont, sans-serif"

SEC_FILL = "#f3f4f6"
SEC_BORDER = "#6b7280"
SEC_TEXT = "#111827"

SUB_FILL = "#e5e7eb"
SUB_BORDER = "#9ca3af"
SUB_TEXT = "#1f2937"

SSUB_FILL = "#eef2f4"
SSUB_BORDER = "#b5bcc4"
SSUB_TEXT = "#1f2937"

LEAF_FILL = "#ffffff"
LEAF_BORDER = "#d1d5db"
LEAF_TEXT = "#374151"

SLEAF_FILL = "#f9fafb"
SLEAF_BORDER = "#e5e7eb"

NEW_FILL = "#e6f3fa"
NEW_BORDER = "#0082c9"

ARROW = "#9ca3af"
BG = "#fafafa"

# ----- Layout -----
COL_W = 200
COL_GAP = 40
COL_STRIDE = COL_W + COL_GAP
SEC_H = 34
SUB_H = 26
SSUB_H = 24
ITEM_W = 190
ITEM_H = 26
SLEAF_W = 174
SLEAF_H = 22
GAP = 4

LEFT_PAD = 30
TOP = 30
SEC_GAP = 30  # gap between top-level sections


# section: (title, [subsection])
# subsection forms:
#   ("bare",   [(kind, label), ...])
#   ("leaves", header, hkind, [(kind, label), ...])
#   ("groups", header, hkind, [(g_title, g_kind, [(kind, label), ...]), ...])

structure = [
    ("Getting Started", [
        ("bare", [("new", "Welcome page")]),
    ]),

    ("Concepts", [
        ("bare", [
            ("existing", "Architecture"),
            ("existing", "Request lifecycle"),
            ("new", "Apps overview"),
            ("new", "API overview"),
        ]),
    ]),

    ("App Development", [
        ("groups", "PHP App", "new", [
            ("App basics", "existing", [
                ("existing", "Introduction"),
                ("existing", "Tutorial"),
                ("existing", "Bootstrapping"),
                ("existing", "App metadata"),
                ("existing", "Navigation & pre-app config"),
                ("existing", "Dependency management"),
                ("existing", "Extending the DAV server"),
            ]),
            ("Core concepts", "existing", [
                ("existing", "Routing"),
                ("existing", "Controllers"),
                ("existing", "Dependency injection"),
                ("existing", "Middlewares"),
                ("existing", "Events"),
            ]),
            ("Backend", "existing", [
                ("existing", "Storage"),
                ("existing", "Caching"),
                ("existing", "Config"),
                ("existing", "Settings"),
                ("existing", "Declarative settings"),
                ("existing", "Settings basics"),
                ("existing", "Security"),
                ("existing", "Background jobs"),
                ("existing", "Logging"),
                ("existing", "Translations"),
                ("existing", "Translation"),
            ]),
            ("Frontend", "existing", [
                ("existing", "Front-end basics"),
                ("existing", "JavaScript & Vue"),
                ("existing", "JavaScript APIs"),
                ("existing", "Design system"),
                ("existing", "HTML / CSS guidelines"),
            ]),
            ("Testing", "existing", [
                ("existing", "Testing"),
                ("existing", "Debugging"),
                ("existing", "Profiler"),
                ("existing", "Performance"),
                ("existing", "Continuous integration"),
            ]),
            ("Publishing & maintenance", "existing", [
                ("existing", "App ecosystem"),
                ("existing", "Maintainers"),
                ("existing", "Release process"),
                ("existing", "Monetizing"),
                ("existing", "Publishing"),
                ("existing", "Code signing"),
                ("existing", "Release automation"),
                ("existing", "Upgrade guide"),
            ]),
        ]),
        ("leaves", "ExApp", "existing", [
            ("existing", "Introduction"),
            ("existing", "Dev setup"),
            ("existing", "Development overview"),
            ("existing", "Technical details"),
            ("existing", "FAQ"),
        ]),
        ("leaves", "Release notes", "existing", [
            ("existing", "Critical changes"),
            ("existing", "What's new"),
            ("existing", "Deprecations"),
        ]),
    ]),

    ("API Reference", [
        ("bare", [("existing", "Landing page")]),
        ("leaves", "OCP", "existing", [
            ("existing", "PHP public API"),
        ]),
        ("leaves", "OCS", "existing", [
            ("existing", "OCS OpenAPI"),
            ("existing", "OCS APIs overview"),
            ("existing", "Share API"),
            ("existing", "Sharee API"),
            ("existing", "User Status API"),
            ("existing", "Recommendations API"),
            ("existing", "User preferences API"),
            ("existing", "Translation API"),
            ("existing", "Text processing API"),
            ("existing", "Text-to-image API"),
            ("existing", "Task processing API"),
            ("existing", "Out of office API"),
            ("existing", "Full-text search collections"),
        ]),
        ("leaves", "WebDAV", "existing", [
            ("existing", "Basic"),
            ("existing", "Chunking"),
            ("existing", "Bulk upload"),
            ("existing", "Trashbin"),
            ("existing", "Versions"),
            ("existing", "Search"),
            ("existing", "Comments"),
            ("existing", "Collection preload"),
        ]),
        ("leaves", "REST", "existing", [
            ("existing", "REST APIs"),
            ("existing", "External API"),
        ]),
    ]),

    ("Extending Nextcloud", [
        ("leaves", "AI & Machine Learning", "new", [
            ("existing", "Task processing"),
            ("existing", "Context Chat"),
            ("existing", "Machine translation"),
            ("existing", "Speech to text"),
            ("existing", "Text processing"),
            ("existing", "Text to image"),
        ]),
        ("leaves", "Files", "new", [
            ("existing", "Filesystem API"),
            ("existing", "Files metadata"),
            ("existing", "Public share template"),
        ]),
        ("leaves", "Groupware & workflows", "new", [
            ("existing", "Calendar"),
            ("existing", "Calendar provider"),
            ("existing", "Contacts menu"),
            ("existing", "Mail provider"),
            ("existing", "Flow"),
            ("existing", "Projects"),
        ]),
        ("leaves", "Users & authentication", "new", [
            ("existing", "User management"),
            ("existing", "User migration"),
            ("existing", "Profile"),
            ("existing", "User status"),
            ("existing", "Out of office"),
            ("existing", "OIDC"),
            ("existing", "Two-factor provider"),
        ]),
        ("leaves", "Search & discovery", "new", [
            ("existing", "Search"),
            ("existing", "Reference providers"),
        ]),
        ("leaves", "Communication", "new", [
            ("existing", "Talk integration"),
            ("existing", "Email"),
            ("existing", "Notifications"),
        ]),
        ("leaves", "UI", "new", [
            ("existing", "Dashboard"),
            ("existing", "Public pages"),
        ]),
        ("leaves", "Server internals", "new", [
            ("existing", "Class loader"),
            ("existing", "PSR"),
            ("existing", "Deadlocks"),
            ("existing", "Snowflake IDs"),
            ("existing", "Time"),
            ("existing", "OpenMetrics"),
            ("existing", "Phone number util"),
            ("existing", "HTTP client"),
            ("existing", "Web host metadata"),
            ("existing", "Setup checks"),
            ("existing", "Repair steps"),
        ]),
    ]),

    ("Client Development", [
        ("bare", [
            ("new", "Landing page"),
            ("existing", "General"),
            ("existing", "Activity"),
            ("existing", "Files"),
            ("existing", "Android"),
            ("existing", "Desktop"),
            ("existing", "Client integration"),
        ]),
        ("leaves", "Authentication", "new", [
            ("existing", "Login flow"),
            ("existing", "Remote wipe"),
        ]),
    ]),

    ("Contribute", [
        ("bare", [
            ("existing", "Code of conduct"),
            ("existing", "Communication"),
            ("new", "Security reporting"),
            ("existing", "Development process"),
            ("existing", "Dev environment"),
        ]),
        ("leaves", "Bug tracker", "existing", [
            ("existing", "Code reviews"),
            ("existing", "Triaging"),
        ]),
        ("leaves", "Coding standards", "existing", [
            ("existing", "PHP"),
            ("existing", "JavaScript"),
            ("existing", "HTML / CSS"),
        ]),
        ("leaves", "Server Development", "existing", [
            ("existing", "Front-end"),
            ("existing", "Back-end"),
            ("existing", "Static analysis"),
            ("existing", "Unit testing"),
            ("existing", "How to test"),
        ]),
    ]),
]


def subsection_cols(sub):
    if sub[0] == "groups":
        return len(sub[3])
    return 1


def section_cols(subs):
    return sum(subsection_cols(s) for s in subs)


def escape(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def emit():
    out = []

    sections = []
    x = LEFT_PAD
    for title, subs in structure:
        n_cols = section_cols(subs)
        sec_x = x
        sec_w = n_cols * COL_W + (n_cols - 1) * COL_GAP
        sections.append((title, subs, sec_x, sec_w, n_cols))
        x += sec_w + SEC_GAP

    total_w = x - SEC_GAP + LEFT_PAD

    y_sec = TOP
    y_sub = y_sec + SEC_H + 16
    y_ssub = y_sub + SUB_H + 4
    y_leaves_groups = y_ssub + SSUB_H + 4
    y_leaves_leaves = y_ssub
    y_leaves_bare = y_sub

    bottoms = []
    for _, subs, *_ in sections:
        for sub in subs:
            if sub[0] == "bare":
                bottoms.append(y_leaves_bare + len(sub[1]) * (ITEM_H + GAP))
            elif sub[0] == "leaves":
                bottoms.append(y_leaves_leaves + len(sub[3]) * (SLEAF_H + 2))
            else:
                m = max(len(g[2]) for g in sub[3])
                bottoms.append(y_leaves_groups + m * (SLEAF_H + 2))
    max_bottom = max(bottoms)
    total_h = max_bottom + 60

    out.append('<?xml version="1.0" encoding="UTF-8"?>')
    out.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_w}" height="{total_h}" viewBox="0 0 {total_w} {total_h}">')
    out.append(f'  <rect width="{total_w}" height="{total_h}" fill="{BG}"/>')

    for title, subs, sec_x, sec_w, n_cols in sections:
        sec_cx = sec_x + sec_w / 2
        out.append(f'  <rect x="{sec_x}" y="{y_sec}" width="{sec_w}" height="{SEC_H}" rx="5" fill="{SEC_FILL}" stroke="{SEC_BORDER}" stroke-width="1.2"/>')
        out.append(f'  <text x="{sec_cx}" y="{y_sec+22}" text-anchor="middle" font-family="{FONT}" font-size="11" font-weight="700" fill="{SEC_TEXT}">{escape(title)}</text>')

        col_cursor = 0
        for sub in subs:
            n = subsection_cols(sub)
            sub_x = sec_x + col_cursor * COL_STRIDE
            sub_w = n * COL_W + (n - 1) * COL_GAP
            sub_cx = sub_x + sub_w / 2
            kind = sub[0]

            if kind == "bare":
                items = sub[1]
                cx = sub_x
                ccx = cx + COL_W / 2
                out.append(f'  <line x1="{ccx}" y1="{y_sec+SEC_H}" x2="{ccx}" y2="{y_leaves_bare-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                yy = y_leaves_bare
                for ik, label in items:
                    fill = NEW_FILL if ik == "new" else LEAF_FILL
                    border = NEW_BORDER if ik == "new" else LEAF_BORDER
                    out.append(f'  <rect x="{cx + (COL_W-ITEM_W)/2}" y="{yy}" width="{ITEM_W}" height="{ITEM_H}" rx="4" fill="{fill}" stroke="{border}" stroke-width="1"/>')
                    out.append(f'  <text x="{ccx}" y="{yy+17}" text-anchor="middle" font-family="{FONT}" font-size="9.5" fill="{LEAF_TEXT}">{escape(label)}</text>')
                    yy += ITEM_H + GAP

            elif kind == "leaves":
                _, header, hkind, items = sub
                fill = NEW_FILL if hkind == "new" else SUB_FILL
                border = NEW_BORDER if hkind == "new" else SUB_BORDER
                out.append(f'  <line x1="{sub_cx}" y1="{y_sec+SEC_H}" x2="{sub_cx}" y2="{y_sub-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                out.append(f'  <rect x="{sub_x}" y="{y_sub}" width="{COL_W}" height="{SUB_H}" rx="4" fill="{fill}" stroke="{border}" stroke-width="1"/>')
                out.append(f'  <text x="{sub_cx}" y="{y_sub+17}" text-anchor="middle" font-family="{FONT}" font-size="10" font-weight="700" fill="{SUB_TEXT}">{escape(header)}</text>')
                yy = y_leaves_leaves
                for ik, label in items:
                    item_fill = NEW_FILL if ik == "new" else SLEAF_FILL
                    item_border = NEW_BORDER if ik == "new" else SLEAF_BORDER
                    out.append(f'  <rect x="{sub_x + (COL_W-SLEAF_W)/2}" y="{yy}" width="{SLEAF_W}" height="{SLEAF_H}" rx="3" fill="{item_fill}" stroke="{item_border}" stroke-width="0.8"/>')
                    out.append(f'  <text x="{sub_cx}" y="{yy+15}" text-anchor="middle" font-family="{FONT}" font-size="9" fill="{LEAF_TEXT}">{escape(label)}</text>')
                    yy += SLEAF_H + 2

            else:  # groups
                _, header, hkind, groups = sub
                fill = NEW_FILL if hkind == "new" else SUB_FILL
                border = NEW_BORDER if hkind == "new" else SUB_BORDER
                out.append(f'  <line x1="{sub_cx}" y1="{y_sec+SEC_H}" x2="{sub_cx}" y2="{y_sub-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                out.append(f'  <rect x="{sub_x}" y="{y_sub}" width="{sub_w}" height="{SUB_H}" rx="4" fill="{fill}" stroke="{border}" stroke-width="1"/>')
                out.append(f'  <text x="{sub_cx}" y="{y_sub+17}" text-anchor="middle" font-family="{FONT}" font-size="10" font-weight="700" fill="{SUB_TEXT}">{escape(header)}</text>')
                for gi, (g_title, g_kind, items) in enumerate(groups):
                    gx = sub_x + gi * COL_STRIDE
                    gcx = gx + COL_W / 2
                    g_fill = NEW_FILL if g_kind == "new" else SSUB_FILL
                    g_border = NEW_BORDER if g_kind == "new" else SSUB_BORDER
                    out.append(f'  <line x1="{gcx}" y1="{y_sub+SUB_H}" x2="{gcx}" y2="{y_ssub-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                    out.append(f'  <rect x="{gx+6}" y="{y_ssub}" width="{COL_W-12}" height="{SSUB_H}" rx="3" fill="{g_fill}" stroke="{g_border}" stroke-width="1"/>')
                    out.append(f'  <text x="{gcx}" y="{y_ssub+16}" text-anchor="middle" font-family="{FONT}" font-size="9.5" font-weight="700" fill="{SSUB_TEXT}">{escape(g_title)}</text>')
                    yy = y_leaves_groups
                    for ik, label in items:
                        item_fill = NEW_FILL if ik == "new" else SLEAF_FILL
                        item_border = NEW_BORDER if ik == "new" else SLEAF_BORDER
                        out.append(f'  <rect x="{gx + (COL_W-SLEAF_W)/2}" y="{yy}" width="{SLEAF_W}" height="{SLEAF_H}" rx="3" fill="{item_fill}" stroke="{item_border}" stroke-width="0.8"/>')
                        out.append(f'  <text x="{gcx}" y="{yy+15}" text-anchor="middle" font-family="{FONT}" font-size="9" fill="{LEAF_TEXT}">{escape(label)}</text>')
                        yy += SLEAF_H + 2

            col_cursor += n

    ly = total_h - 32
    out.append(f'  <rect x="{LEFT_PAD}" y="{ly}" width="14" height="14" rx="2" fill="{NEW_FILL}" stroke="{NEW_BORDER}" stroke-width="1"/>')
    out.append(f'  <text x="{LEFT_PAD+22}" y="{ly+11}" font-family="{FONT}" font-size="10" fill="{LEAF_TEXT}">New / placeholder page (under development)</text>')
    out.append(f'  <rect x="{LEFT_PAD+340}" y="{ly}" width="14" height="14" rx="2" fill="{LEAF_FILL}" stroke="{LEAF_BORDER}" stroke-width="1"/>')
    out.append(f'  <text x="{LEFT_PAD+362}" y="{ly+11}" font-family="{FONT}" font-size="10" fill="{LEAF_TEXT}">Existing page (moved to new location)</text>')

    out.append('</svg>')
    return "\n".join(out)


if __name__ == "__main__":
    print(emit())
