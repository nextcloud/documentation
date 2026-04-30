#!/usr/bin/env python3
"""Generate a horizontal-top flowchart SVG of the Nextcloud Developer Manual.

Layout: Root at top -> section nodes horizontally -> subsections flow down as columns.
Style: Clean nodes + arrows, neutral colors, Figma-compatible.
"""

# Complete structure from docs.nextcloud.com/server/latest/developer_manual
SECTIONS = [
    ("Prologue", [
        ("Code of Conduct", []),
        ("Help & Communication", []),
        ("Bugtracker", [
            "Code Reviews on GitHub",
            "Bug Triaging",
        ]),
        ("Security Guidelines", []),
        ("App Ecosystem Compatibility", []),
    ]),
    ("Release Notes", []),
    ("Getting Started", [
        ("Development Process", []),
        ("Development Environment", []),
        ("Coding Style & Guidelines", []),
    ]),
    ("Basic Concepts", [
        ("Request Lifecycle", []),
        ("Routing", []),
        ("Dependency Injection", []),
        ("Controllers", []),
        ("Middlewares", []),
        ("Events", []),
        ("Front-end", [
            "Templates",
            "JavaScript",
            "CSS",
            "Theming Support",
        ]),
        ("Translations", []),
        ("Background Jobs", []),
        ("Caching", []),
        ("Logging", []),
        ("Settings", []),
        ("Storage & Database", [
            "Migrations",
            "Database Access",
            "Configuration",
            "Filesystem API",
            "AppData",
        ]),
        ("Public Share Template", []),
        ("Testing", []),
    ]),
    ("App Development", [
        ("Introduction", []),
        ("Tutorial", []),
        ("Bootstrapping", []),
        ("App Metadata", []),
        ("Navigation & Config", []),
        ("Dependency Management", []),
        ("DAV Extension", []),
        ("Translation", []),
    ]),
    ("ExApp Development", [
        ("Introduction", []),
        ("Dev Environment Setup", []),
        ("Development Overview", [
            "ExApp Dev Steps",
            "ExApp Overview",
            "ExApp Lifecycle",
            "HaRP Integration",
        ]),
        ("Technical Details", [
            "Installation Flow",
            "Deployment",
            "Authentication",
            "Translations",
            "AppAPI APIs",
        ]),
        ("FAQ", [
            "Docker Registry",
            "Docker Socket Proxy",
            "GPU Support",
            "Scaling",
            "Corporate Proxy",
            "Troubleshooting",
        ]),
    ]),
    ("Server Development", [
        ("Front-end Code", []),
        ("Back-end Code", []),
        ("Static Analysis", []),
        ("Unit-Testing", []),
        ("External API", []),
        ("Architecture", []),
        ("How to Test", [
            "Email Sending",
            "Redis / Cluster",
            "S3 Object Store",
            "S3 / SMB Storage",
            "SAML",
            "Collabora",
            "OnlyOffice",
            "WebAuthn",
        ]),
    ]),
    ("Digging Deeper", [
        ("AI & Machine Learning", [
            "Context Chat",
            "Task Processing",
            "Machine Translation",
            "Speech-To-Text",
            "Text Processing",
            "Text-To-Image",
        ]),
        ("APIs & Integration", [
            "API Reference",
            "REST APIs",
            "HTTP Client",
            "JavaScript APIs",
            "Dashboard",
            "Email",
            "Notifications",
            "Public Pages",
            "Talk Integration",
            "Web Host Metadata",
        ]),
        ("Users & Authentication", [
            "User Management",
            "User Migration",
            "Profile",
            "User Status",
            "Out-of-office",
            "OpenID Connect",
            "Two-factor Providers",
        ]),
        ("Groupware & Workflows", [
            "Calendar",
            "Calendar Providers",
            "Contacts Menu",
            "Mail Provider",
            "Nextcloud Flow",
            "Projects",
        ]),
        ("Search & Discovery", [
            "Search",
            "Reference Providers",
            "Files Metadata",
        ]),
        ("Development Tools", [
            "Debugging",
            "Profiler",
            "Continuous Integration",
            "NPM",
            "Performance",
        ]),
        ("Server Internals", [
            "Config & Preferences",
            "Settings",
            "Declarative Settings",
            "Security",
            "Setup Checks",
            "Repair Steps",
            "Deadlocks",
            "Snowflake IDs",
            "Working with Time",
            "Classloader",
            "PSR",
            "Open Metrics",
            "WebDAV Preload",
            "Phone Number Util",
        ]),
    ]),
    ("App Publishing", [
        ("Maintainers", []),
        ("Release Process", []),
        ("App Store Publishing", []),
        ("Monetizing", []),
        ("App Store Rules", []),
        ("Code Signing", []),
        ("Release Automation", []),
    ]),
    ("Design", [
        ("Introduction", []),
        ("Foundations", [
            "Color",
            "Typography",
            "Icons",
            "Naming",
            "Wording",
        ]),
        ("Layout", []),
        ("Layout Components", [
            "Navigation",
            "List Item",
            "Content",
            "Sidebar",
        ]),
        ("Atomic Components", [
            "Buttons",
            "Action Menu",
            "Input Fields",
            "Pickers",
            "Tags",
            "Modal",
            "Avatar",
            "Progress Bars",
            "User Bubbles",
            "Counter Bubbles",
            "Empty Content",
            "Skeleton Screens",
        ]),
    ]),
    ("HTML/CSS Guidelines", [
        ("Navigation", []),
        ("New Button", []),
        ("App Navigation Menu", []),
        ("Settings", []),
        ("Main Content", []),
        ("Content List", []),
        ("Popover Menu", []),
        ("HTML Elements", []),
        ("CSS", []),
        ("Icons", []),
    ]),
    ("Client APIs", [
        ("General", []),
        ("Activity API", []),
        ("Android Library", []),
        ("Files", []),
        ("Login Flow", []),
        ("OCS API", [
            "OCS OpenAPI Tutorial",
            "OCS APIs Overview",
            "OCS Share API",
            "OCS Sharee API",
            "OCS Status API",
            "OCS Recommendations",
            "OCS User Prefs",
            "OCS Translation",
            "OCS TextProcessing",
            "OCS Text-To-Image",
            "OCS TaskProcessing",
            "OCS Out-of-office",
            "OCS FullTextSearch",
        ]),
        ("Remote Wipe", []),
        ("WebDAV", [
            "Basic Operations",
            "Chunked Upload",
            "Bulk Upload",
            "Trashbin",
            "Versions",
            "Search",
            "Comments",
        ]),
        ("Client Integration", []),
    ]),
    ("Desktop Clients", [
        ("Building the Client", []),
    ]),
]

# --- Layout ---
COL_WIDTH = 180      # width of each section column
COL_GAP = 20         # horizontal gap between columns
NODE_H = 30          # height of sub-nodes
NODE_PAD = 4         # vertical gap between sub-nodes
SEC_NODE_H = 34      # section node height
ROOT_H = 40          # root node height
SUBSUB_H = 22        # sub-sub node height
SUBSUB_PAD = 3

TOP_MARGIN = 30
ROOT_TO_SEC = 60     # vertical space from root to section row
SEC_TO_SUBS = 50     # vertical space from section row to first sub

FONT = "Inter, -apple-system, BlinkMacSystemFont, sans-serif"

# Neutral palette
BG = "#fafafa"
ROOT_FILL = "#1f2937"
ROOT_TEXT = "#ffffff"
SEC_FILL = "#f3f4f6"
SEC_STROKE = "#6b7280"
SEC_TEXT = "#111827"
SUB_FILL = "#ffffff"
SUB_STROKE = "#d1d5db"
SUB_TEXT = "#374151"
SUBSUB_FILL = "#f9fafb"
SUBSUB_STROKE = "#e5e7eb"
SUBSUB_TEXT = "#6b7280"
ARROW = "#9ca3af"


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def calc_col_height(subs):
    """Calculate total height needed for a column of subs."""
    h = 0
    for sub_name, sub_subs in subs:
        h += NODE_H + NODE_PAD
        if sub_subs:
            h += len(sub_subs) * (SUBSUB_H + SUBSUB_PAD)
    return h


def generate():
    n_cols = len(SECTIONS)
    total_width = n_cols * COL_WIDTH + (n_cols - 1) * COL_GAP + 60  # 30px margin each side

    # Calculate max column height
    max_col_h = 0
    for _, subs in SECTIONS:
        ch = calc_col_height(subs)
        if ch > max_col_h:
            max_col_h = ch

    sec_row_y = TOP_MARGIN + ROOT_H + ROOT_TO_SEC
    subs_start_y = sec_row_y + SEC_NODE_H + SEC_TO_SUBS
    total_height = subs_start_y + max_col_h + 40

    lines = []
    lines.append(f'<?xml version="1.0" encoding="UTF-8"?>')
    lines.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{total_width}" height="{total_height}" viewBox="0 0 {total_width} {total_height}">')
    lines.append(f'''  <defs>
    <marker id="ah" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
      <polygon points="0 0, 6 2, 0 4" fill="{ARROW}"/>
    </marker>
  </defs>''')

    # Background
    lines.append(f'  <rect width="{total_width}" height="{total_height}" fill="{BG}"/>')

    # Root node
    root_w = 280
    root_x = total_width / 2 - root_w / 2
    root_y = TOP_MARGIN
    root_cx = total_width / 2
    root_cy = root_y + ROOT_H / 2
    lines.append(f'  <rect x="{root_x}" y="{root_y}" width="{root_w}" height="{ROOT_H}" rx="6" fill="{ROOT_FILL}"/>')
    lines.append(f'  <text x="{root_cx}" y="{root_cy + 5}" text-anchor="middle" font-family="{FONT}" font-size="13" font-weight="700" fill="{ROOT_TEXT}">Nextcloud Developer Manual (latest)</text>')

    # Section nodes - horizontal row
    left_margin = 30
    for i, (sec_name, subs) in enumerate(SECTIONS):
        col_x = left_margin + i * (COL_WIDTH + COL_GAP)
        sec_cx = col_x + COL_WIDTH / 2
        sec_cy = sec_row_y + SEC_NODE_H / 2

        # Arrow from root to section
        lines.append(f'  <path d="M{root_cx} {root_y + ROOT_H} L{root_cx} {root_y + ROOT_H + 15} L{sec_cx} {sec_row_y - 10} L{sec_cx} {sec_row_y}" fill="none" stroke="{ARROW}" stroke-width="1" marker-end="url(#ah)"/>')

        # Section node
        lines.append(f'  <rect x="{col_x}" y="{sec_row_y}" width="{COL_WIDTH}" height="{SEC_NODE_H}" rx="5" fill="{SEC_FILL}" stroke="{SEC_STROKE}" stroke-width="1.2"/>')
        # Truncate text if needed
        display_name = sec_name if len(sec_name) <= 18 else sec_name[:17] + "…"
        lines.append(f'  <text x="{sec_cx}" y="{sec_cy + 5}" text-anchor="middle" font-family="{FONT}" font-size="10.5" font-weight="600" fill="{SEC_TEXT}">{esc(display_name)}</text>')

        # Sub nodes - vertical column below section
        if subs:
            # Arrow from section to first sub
            sub_y = subs_start_y
            lines.append(f'  <line x1="{sec_cx}" y1="{sec_row_y + SEC_NODE_H}" x2="{sec_cx}" y2="{sub_y}" stroke="{ARROW}" stroke-width="1" marker-end="url(#ah)"/>')

            y_cursor = sub_y
            for sub_name, sub_subs in subs:
                # Sub node
                sub_w = COL_WIDTH - 10
                sub_x = col_x + 5
                sub_cx = sub_x + sub_w / 2

                lines.append(f'  <rect x="{sub_x}" y="{y_cursor}" width="{sub_w}" height="{NODE_H}" rx="4" fill="{SUB_FILL}" stroke="{SUB_STROKE}" stroke-width="1"/>')
                # Truncate
                sdisplay = sub_name if len(sub_name) <= 20 else sub_name[:19] + "…"
                lines.append(f'  <text x="{sub_cx}" y="{y_cursor + NODE_H/2 + 4}" text-anchor="middle" font-family="{FONT}" font-size="9.5" fill="{SUB_TEXT}">{esc(sdisplay)}</text>')

                prev_bottom = y_cursor + NODE_H
                y_cursor += NODE_H + NODE_PAD

                # Sub-sub items
                if sub_subs:
                    for ss_name in sub_subs:
                        ss_w = sub_w - 16
                        ss_x = sub_x + 16
                        ss_cx = ss_x + ss_w / 2

                        # Small connector line
                        lines.append(f'  <line x1="{sub_x + 10}" y1="{prev_bottom}" x2="{sub_x + 10}" y2="{y_cursor + SUBSUB_H/2}" stroke="{ARROW}" stroke-width="0.8"/>')
                        lines.append(f'  <line x1="{sub_x + 10}" y1="{y_cursor + SUBSUB_H/2}" x2="{ss_x}" y2="{y_cursor + SUBSUB_H/2}" stroke="{ARROW}" stroke-width="0.8"/>')

                        lines.append(f'  <rect x="{ss_x}" y="{y_cursor}" width="{ss_w}" height="{SUBSUB_H}" rx="3" fill="{SUBSUB_FILL}" stroke="{SUBSUB_STROKE}" stroke-width="0.8"/>')
                        ssdisplay = ss_name if len(ss_name) <= 18 else ss_name[:17] + "…"
                        lines.append(f'  <text x="{ss_cx}" y="{y_cursor + SUBSUB_H/2 + 3.5}" text-anchor="middle" font-family="{FONT}" font-size="8" fill="{SUBSUB_TEXT}">{esc(ssdisplay)}</text>')

                        prev_bottom = y_cursor + SUBSUB_H
                        y_cursor += SUBSUB_H + SUBSUB_PAD

                # Connector between sub nodes (vertical line)
                if sub_name != subs[-1][0]:
                    next_top = y_cursor
                    lines.append(f'  <line x1="{sub_cx}" y1="{prev_bottom}" x2="{sub_cx}" y2="{next_top}" stroke="{ARROW}" stroke-width="0.8" stroke-dasharray="3,2"/>')

    lines.append('</svg>')
    return '\n'.join(lines)


if __name__ == '__main__':
    svg = generate()
    out = '/workspaces/nc-documentation/nextcloud_dev_manual_structure.svg'
    with open(out, 'w') as f:
        f.write(svg)
    print(f"Done — {len(svg):,} bytes → {out}")
    # Print dimensions
    import re
    m = re.search(r'width="(\d+)" height="(\d+)"', svg)
    if m:
        print(f"Dimensions: {m.group(1)} x {m.group(2)} px")
