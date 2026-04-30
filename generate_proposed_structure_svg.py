#!/usr/bin/env python3
"""Generate SVG for the PROPOSED Nextcloud Developer Manual structure.

Hierarchy (up to 4 levels deep where required):
- Section
- Subsection
- Sub-sub-section (column header within a subsection)
- Leaf page  (may itself contain a small list of nested children)
- Sub-group inside a column (e.g. OCS "Core APIs" / "AI & Processing APIs")

Within a single column the body is a list of entries:
    ("leaf",     kind, label[, children])
    ("subgroup", label, children)           # bolder mini-header inside a column

`kind` ∈ {"existing", "new", "external"}.
`children` is a list of (kind, label) tuples; rendered smaller and indented.
"""

# ----- Style -----
FONT = "Inter, -apple-system, BlinkMacSystemFont, sans-serif"

SEC_FILL   = "#f3f4f6"; SEC_BORDER   = "#6b7280"; SEC_TEXT   = "#111827"
SUB_FILL   = "#e5e7eb"; SUB_BORDER   = "#9ca3af"; SUB_TEXT   = "#1f2937"
SSUB_FILL  = "#eef2f4"; SSUB_BORDER  = "#b5bcc4"; SSUB_TEXT  = "#1f2937"
GRP_FILL   = "#f1f5f9"; GRP_BORDER   = "#cbd5e1"; GRP_TEXT   = "#0f172a"

LEAF_FILL  = "#ffffff"; LEAF_BORDER  = "#d1d5db"; LEAF_TEXT  = "#374151"
SLEAF_FILL = "#f9fafb"; SLEAF_BORDER = "#e5e7eb"
CHILD_FILL = "#ffffff"; CHILD_BORDER = "#e5e7eb"; CHILD_TEXT = "#4b5563"

NEW_FILL = "#e6f3fa"; NEW_BORDER = "#0082c9"
EXT_FILL = "#fff7ed"; EXT_BORDER = "#f59e0b"

ARROW = "#9ca3af"
BG = "#fafafa"

# ----- Layout -----
COL_W = 220
COL_GAP = 32
COL_STRIDE = COL_W + COL_GAP
SEC_H = 34
SUB_H = 26
SSUB_H = 24
GRP_H = 22

LEAF_W = 200
LEAF_H = 24
CHILD_W = 178
CHILD_H = 18
GAP = 3
CHILD_INDENT = 18

LEFT_PAD = 28
TOP = 26
SEC_GAP = 28


# ===== Data =====
def L(kind, label, children=None):
    return ("leaf", kind, label, children or [])

def G(label, children):
    return ("subgroup", label, children)

# (kind,label) for children
def n(label):  return ("new", label)
def e(label):  return ("existing", label)
def x(label):  return ("external", label)


structure = [
    ("1. Getting Started", [
        ("bare", [
            L("new", "Welcome to Nextcloud development"),
        ]),
    ]),

    ("2. Concepts", [
        ("bare", [
            L("existing", "Nextcloud architecture overview"),
            L("existing", "Request lifecycle"),
            L("new", "Introduction to Nextcloud apps"),
            L("new", "Introduction to Nextcloud APIs"),
        ]),
    ]),

    ("3. App Development", [
        ("groups", "PHP App Development", "existing", [
            ("App basics", "existing", [
                L("existing", "Introduction"),
                L("existing", "Tutorial: Your first app"),
                L("existing", "Bootstrapping & initialization"),
                L("existing", "App metadata (info.xml)"),
                L("existing", "Navigation & pre-app configuration"),
                L("existing", "Dependency management"),
                L("existing", "Extending the DAV server"),
            ]),
            ("Core Concepts", "existing", [
                L("existing", "Routing"),
                L("existing", "Controllers"),
                L("existing", "Dependency injection"),
                L("existing", "Middleware"),
                L("existing", "Events & listeners"),
            ]),
            ("Back-End", "existing", [
                L("existing", "Storage & database"),
                L("existing", "Caching"),
                L("existing", "Config & Preferences", [
                    e("AppConfig"), e("UserConfig"), e("Lexicon"),
                ]),
                L("existing", "Settings"),
                L("existing", "Security", [
                    e("Writing secure code"),
                    e("Security APIs"),
                ]),
                L("existing", "Background jobs (Cron)"),
                L("existing", "Logging"),
                L("existing", "Translations"),
            ]),
            ("Front-End", "existing", [
                L("existing", "Front-end basics"),
                L("existing", "JavaScript & Vue / NPM"),
                L("existing", "JavaScript APIs", [
                    e("npm packages (@nextcloud/*)"),
                    e("Events"),
                    e("Global variables (legacy)"),
                ]),
                L("existing", "Design System", [
                    e("Introduction"), e("Foundations"), e("Layout"),
                    e("Layout components"), e("Atomic components"),
                ]),
                L("existing", "HTML/CSS Guidelines", [
                    e("Navigation"), e("Main content"), e("Content list"),
                    e("Popover menu"), e("HTML elements"), e("CSS"), e("Icons"),
                ]),
            ]),
            ("Testing & Quality", "existing", [
                L("existing", "Unit testing"),
                L("existing", "Static analysis"),
                L("existing", "Continuous Integration"),
                L("existing", "Debugging"),
                L("existing", "Profiler"),
                L("existing", "Performance considerations"),
            ]),
            ("Publishing & Maintenance", "existing", [
                L("existing", "App ecosystem compatibility"),
                L("existing", "App Store rules"),
                L("existing", "Release process"),
                L("existing", "Code signing"),
                L("external", "Publishing to the App Store"),
                L("existing", "Monetizing your app"),
                L("existing", "Release automation"),
                L("existing", "Maintainer responsibilities"),
                L("existing", "Upgrade guide", [
                    e("Upgrade to NC 32"), e("Upgrade to NC 31"),
                    e("Upgrade to NC 30"), e("Upgrade to NC 29"),
                    e("Upgrade to NC 28"), e("… back to NC 14"),
                ]),
            ]),
        ]),
        ("leaves", "ExApp Development (Docker-based)", "existing", [
            L("existing", "Introduction"),
            L("existing", "Setting up dev environment"),
            L("existing", "Development overview"),
            L("existing", "Technical details"),
            L("existing", "FAQ & troubleshooting"),
        ]),
        ("leaves", "Release Notes", "existing", [
            L("existing", "Critical changes"),
            L("existing", "New in this release"),
            L("existing", "Deprecations"),
            L("existing", "Previous release notes"),
        ]),
    ]),

    ("4. API Reference", [
        ("bare", [
            L("new", "API Overview"),
        ]),
        ("leaves", "OCP: PHP Public API", "existing", [
            L("existing", "Stable API (OCP namespace)", [
                e("Consumable & Listenable contracts"),
                e("Implementable & Dispatchable contracts"),
            ]),
            L("existing", "Unstable API (NCU namespace)"),
            L("external", "Generated reference (Netlify)"),
        ]),
        ("leaves", "OCS: REST API", "existing", [
            L("existing", "OCS overview & conventions"),
            L("existing", "OpenAPI specification tutorial"),
            G("Core APIs", [
                e("Share API"), e("Sharee API"), e("Status API"),
                e("User Preferences API"), e("Out-of-office API"),
            ]),
            G("AI & Processing APIs", [
                e("TaskProcessing API"), e("Translation API"),
                e("TextProcessing API"), e("Text-To-Image API"),
            ]),
            G("Search APIs", [
                e("FullTextSearch Collections API"),
                e("Recommendations API"),
            ]),
        ]),
        ("leaves", "WebDAV API", "existing", [
            L("existing", "Basic operations"),
            L("existing", "File search (REPORT)"),
            L("existing", "Trashbin"),
            L("existing", "File versions"),
            L("existing", "Chunked upload"),
            L("existing", "Bulk upload"),
            L("existing", "Comments"),
            L("existing", "Collection preload events"),
        ]),
        ("leaves", "REST API Development", "existing", [
            L("existing", "Creating endpoints (ApiController)"),
            L("existing", "CORS configuration"),
            L("existing", "REST vs OCS: when to use which"),
            L("existing", "External API (OCS endpoint creation)"),
        ]),
    ]),

    ("5. Extending Nextcloud", [
        ("leaves", "AI & Machine Learning", "existing", [
            L("existing", "Task Processing (recommended)"),
            L("existing", "Context Chat providers"),
            L("existing", "Machine Translation providers"),
            L("existing", "Speech-To-Text (deprecated)"),
            L("existing", "Text Processing (deprecated)"),
            L("existing", "Text-To-Image (deprecated)"),
        ]),
        ("leaves", "Files & Storage", "existing", [
            L("existing", "Files metadata"),
            L("existing", "Filesystem API"),
            L("existing", "Public share templates"),
        ]),
        ("leaves", "Groupware & Workflows", "existing", [
            L("existing", "Calendar integration"),
            L("existing", "Custom calendar providers"),
            L("existing", "Contacts menu"),
            L("existing", "Mail provider interface"),
            L("existing", "Nextcloud Flow"),
            L("existing", "Projects"),
        ]),
        ("leaves", "Users & Authentication", "existing", [
            L("existing", "User management"),
            L("existing", "User migration"),
            L("existing", "Profile"),
            L("existing", "User status"),
            L("existing", "Out-of-office periods"),
            L("existing", "OpenID Connect (OIDC)"),
            L("existing", "Two-factor auth providers"),
        ]),
        ("leaves", "Search & Discovery", "existing", [
            L("existing", "Unified search providers"),
            L("existing", "Reference providers (Smart Picker)"),
        ]),
        ("leaves", "Communication", "existing", [
            L("existing", "Talk integration"),
            L("existing", "Email"),
            L("existing", "Notifications"),
        ]),
        ("leaves", "Dashboard & UI Extensions", "existing", [
            L("existing", "Dashboard widgets"),
            L("existing", "Public pages"),
        ]),
        ("leaves", "Server Internals", "existing", [
            L("existing", "Classloader"),
            L("existing", "PSR standards"),
            L("existing", "Deadlocks & concurrency"),
            L("existing", "Snowflake IDs"),
            L("existing", "Working with time"),
            L("existing", "Open Metrics exporter"),
            L("existing", "Phone number util"),
            L("existing", "HTTP Client"),
            L("existing", "Web Host Metadata"),
            L("existing", "Setup checks"),
            L("existing", "Repair steps"),
        ]),
    ]),

    ("6. Client Development", [
        ("bare", [
            L("existing", "Overview & general guidelines"),
            L("existing", "Activity API"),
            L("existing", "Files API (client-facing)"),
            L("existing", "Android library"),
            L("existing", "Desktop client (build from source)"),
            L("existing", "Client integration"),
        ]),
        ("leaves", "Authentication", "existing", [
            L("existing", "Login Flow (v1 & v2)"),
            L("existing", "Remote wipe"),
        ]),
    ]),

    ("7. Contribute", [
        ("bare", [
            L("existing", "Code of conduct"),
            L("existing", "Help & communication"),
            L("existing", "Bugtracker"),
            L("existing", "Development process"),
            L("existing", "Development environment setup"),
            L("existing", "Coding standards & guidelines"),
        ]),
        ("leaves", "Server Core Development", "existing", [
            L("existing", "Front-end code"),
            L("existing", "Back-end code"),
            L("existing", "Static analysis"),
            L("existing", "Unit testing"),
            L("existing", "How to test ...", [
                e("Email sending"), e("Redis / Redis Cluster"),
                e("S3 object storage"), e("SMB external storage"),
                e("SAML with OneLogin"), e("Collabora without SSL"),
                e("OnlyOffice"), e("WebAuthn without SSL"),
            ]),
        ]),
    ]),
]


# ===== Helpers =====
def escape(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def kind_colors(kind, leaf=True):
    if kind == "new":
        return NEW_FILL, NEW_BORDER
    if kind == "external":
        return EXT_FILL, EXT_BORDER
    return (LEAF_FILL, LEAF_BORDER) if leaf else (CHILD_FILL, CHILD_BORDER)


def col_body_height(entries):
    """Height of a column's body (entries area, excluding sub/sub-sub headers)."""
    h = 0
    for e_ in entries:
        if e_[0] == "leaf":
            _, kind, label, children = e_
            h += LEAF_H + GAP
            if children:
                h += len(children) * (CHILD_H + 2) + 2
        else:  # subgroup
            _, label, children = e_
            h += GRP_H + 2
            h += len(children) * (CHILD_H + 2) + 4
    return h


def subsection_cols(sub):
    return len(sub[3]) if sub[0] == "groups" else 1


def section_cols(subs):
    return sum(subsection_cols(s) for s in subs)


# ===== Renderer =====
def emit():
    out = []

    sections = []
    x_cur = LEFT_PAD
    for title, subs in structure:
        n_cols = section_cols(subs)
        sec_x = x_cur
        sec_w = n_cols * COL_W + (n_cols - 1) * COL_GAP
        sections.append((title, subs, sec_x, sec_w))
        x_cur += sec_w + SEC_GAP
    total_w = x_cur - SEC_GAP + LEFT_PAD

    y_sec = TOP
    y_sub = y_sec + SEC_H + 14
    y_ssub = y_sub + SUB_H + 4
    y_body_groups = y_ssub + SSUB_H + 4
    y_body_leaves = y_ssub               # subsection-only
    y_body_bare = y_sub                  # no sub header

    # max body bottom
    bottoms = []
    for title, subs, *_ in sections:
        for sub in subs:
            kind = sub[0]
            if kind == "bare":
                bottoms.append(y_body_bare + col_body_height(sub[1]))
            elif kind == "leaves":
                bottoms.append(y_body_leaves + col_body_height(sub[3]))
            else:  # groups
                for g in sub[3]:
                    bottoms.append(y_body_groups + col_body_height(g[2]))
    max_bottom = max(bottoms)
    total_h = max_bottom + 60

    out.append('<?xml version="1.0" encoding="UTF-8"?>')
    out.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_w}" height="{total_h}" viewBox="0 0 {total_w} {total_h}">')
    out.append(f'  <rect width="{total_w}" height="{total_h}" fill="{BG}"/>')

    def render_column(cx_left, entries, y_start):
        """Render the body entries of one column starting at x=cx_left, y=y_start.
        Returns y_end."""
        cx = cx_left
        ccx = cx + COL_W / 2
        yy = y_start
        for entry in entries:
            if entry[0] == "leaf":
                _, kind, label, children = entry
                fill, border = kind_colors(kind, leaf=True)
                lx = cx + (COL_W - LEAF_W) / 2
                out.append(f'  <rect x="{lx}" y="{yy}" width="{LEAF_W}" height="{LEAF_H}" rx="3" fill="{fill}" stroke="{border}" stroke-width="0.9"/>')
                weight = "600" if children else "400"
                out.append(f'  <text x="{ccx}" y="{yy+16}" text-anchor="middle" font-family="{FONT}" font-size="9.5" font-weight="{weight}" fill="{LEAF_TEXT}">{escape(label)}</text>')
                yy += LEAF_H + GAP
                if children:
                    cyy = yy
                    for ck, clabel in children:
                        cfill, cborder = kind_colors(ck, leaf=False)
                        cx_box = cx + CHILD_INDENT
                        out.append(f'  <rect x="{cx_box}" y="{cyy}" width="{CHILD_W}" height="{CHILD_H}" rx="2" fill="{cfill}" stroke="{cborder}" stroke-width="0.7"/>')
                        out.append(f'  <text x="{cx_box+6}" y="{cyy+12}" text-anchor="start" font-family="{FONT}" font-size="8.5" fill="{CHILD_TEXT}">{escape(clabel)}</text>')
                        cyy += CHILD_H + 2
                    yy = cyy + 2
            else:  # subgroup
                _, label, children = entry
                gx = cx + 4
                gw = COL_W - 8
                out.append(f'  <rect x="{gx}" y="{yy}" width="{gw}" height="{GRP_H}" rx="3" fill="{GRP_FILL}" stroke="{GRP_BORDER}" stroke-width="0.9"/>')
                out.append(f'  <text x="{ccx}" y="{yy+15}" text-anchor="middle" font-family="{FONT}" font-size="9" font-weight="700" fill="{GRP_TEXT}">{escape(label)}</text>')
                yy += GRP_H + 2
                for ck, clabel in children:
                    cfill, cborder = kind_colors(ck, leaf=False)
                    cx_box = cx + CHILD_INDENT
                    out.append(f'  <rect x="{cx_box}" y="{yy}" width="{CHILD_W}" height="{CHILD_H}" rx="2" fill="{cfill}" stroke="{cborder}" stroke-width="0.7"/>')
                    out.append(f'  <text x="{cx_box+6}" y="{yy+12}" text-anchor="start" font-family="{FONT}" font-size="8.5" fill="{CHILD_TEXT}">{escape(clabel)}</text>')
                    yy += CHILD_H + 2
                yy += 4
        return yy

    for title, subs, sec_x, sec_w in sections:
        sec_cx = sec_x + sec_w / 2
        out.append(f'  <rect x="{sec_x}" y="{y_sec}" width="{sec_w}" height="{SEC_H}" rx="5" fill="{SEC_FILL}" stroke="{SEC_BORDER}" stroke-width="1.2"/>')
        out.append(f'  <text x="{sec_cx}" y="{y_sec+22}" text-anchor="middle" font-family="{FONT}" font-size="11.5" font-weight="700" fill="{SEC_TEXT}">{escape(title)}</text>')

        col_cursor = 0
        for sub in subs:
            n_ = subsection_cols(sub)
            sub_x = sec_x + col_cursor * COL_STRIDE
            sub_w = n_ * COL_W + (n_ - 1) * COL_GAP
            sub_cx = sub_x + sub_w / 2
            kind = sub[0]

            if kind == "bare":
                cx = sub_x
                ccx = cx + COL_W / 2
                out.append(f'  <line x1="{ccx}" y1="{y_sec+SEC_H}" x2="{ccx}" y2="{y_body_bare-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                render_column(cx, sub[1], y_body_bare)

            elif kind == "leaves":
                _, header, hkind, entries = sub
                fill, border = (NEW_FILL, NEW_BORDER) if hkind == "new" else (SUB_FILL, SUB_BORDER)
                out.append(f'  <line x1="{sub_cx}" y1="{y_sec+SEC_H}" x2="{sub_cx}" y2="{y_sub-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                out.append(f'  <rect x="{sub_x}" y="{y_sub}" width="{COL_W}" height="{SUB_H}" rx="4" fill="{fill}" stroke="{border}" stroke-width="1"/>')
                out.append(f'  <text x="{sub_cx}" y="{y_sub+17}" text-anchor="middle" font-family="{FONT}" font-size="10.5" font-weight="700" fill="{SUB_TEXT}">{escape(header)}</text>')
                render_column(sub_x, entries, y_body_leaves)

            else:  # groups
                _, header, hkind, groups = sub
                fill, border = (NEW_FILL, NEW_BORDER) if hkind == "new" else (SUB_FILL, SUB_BORDER)
                out.append(f'  <line x1="{sub_cx}" y1="{y_sec+SEC_H}" x2="{sub_cx}" y2="{y_sub-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                out.append(f'  <rect x="{sub_x}" y="{y_sub}" width="{sub_w}" height="{SUB_H}" rx="4" fill="{fill}" stroke="{border}" stroke-width="1"/>')
                out.append(f'  <text x="{sub_cx}" y="{y_sub+17}" text-anchor="middle" font-family="{FONT}" font-size="10.5" font-weight="700" fill="{SUB_TEXT}">{escape(header)}</text>')
                for gi, (g_title, g_kind, entries) in enumerate(groups):
                    gx = sub_x + gi * COL_STRIDE
                    gcx = gx + COL_W / 2
                    g_fill, g_border = (NEW_FILL, NEW_BORDER) if g_kind == "new" else (SSUB_FILL, SSUB_BORDER)
                    out.append(f'  <line x1="{gcx}" y1="{y_sub+SUB_H}" x2="{gcx}" y2="{y_ssub-2}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')
                    out.append(f'  <rect x="{gx+6}" y="{y_ssub}" width="{COL_W-12}" height="{SSUB_H}" rx="3" fill="{g_fill}" stroke="{g_border}" stroke-width="1"/>')
                    out.append(f'  <text x="{gcx}" y="{y_ssub+16}" text-anchor="middle" font-family="{FONT}" font-size="10" font-weight="700" fill="{SSUB_TEXT}">{escape(g_title)}</text>')
                    render_column(gx, entries, y_body_groups)

            col_cursor += n_

    # Legend
    ly = total_h - 38
    out.append(f'  <rect x="{LEFT_PAD}" y="{ly}" width="14" height="14" rx="2" fill="{NEW_FILL}" stroke="{NEW_BORDER}" stroke-width="1"/>')
    out.append(f'  <text x="{LEFT_PAD+22}" y="{ly+11}" font-family="{FONT}" font-size="10" fill="{LEAF_TEXT}">[NEW] page (to be created)</text>')
    out.append(f'  <rect x="{LEFT_PAD+260}" y="{ly}" width="14" height="14" rx="2" fill="{LEAF_FILL}" stroke="{LEAF_BORDER}" stroke-width="1"/>')
    out.append(f'  <text x="{LEFT_PAD+282}" y="{ly+11}" font-family="{FONT}" font-size="10" fill="{LEAF_TEXT}">Existing page (moved from old structure)</text>')
    out.append(f'  <rect x="{LEFT_PAD+580}" y="{ly}" width="14" height="14" rx="2" fill="{EXT_FILL}" stroke="{EXT_BORDER}" stroke-width="1"/>')
    out.append(f'  <text x="{LEFT_PAD+602}" y="{ly+11}" font-family="{FONT}" font-size="10" fill="{LEAF_TEXT}">External link</text>')

    out.append('</svg>')
    return "\n".join(out)


if __name__ == "__main__":
    print(emit())
