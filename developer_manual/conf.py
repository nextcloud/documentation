## These are the configuration elements for the Nextcloud Developer Manual documentation
#
# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html
#
## Note that additional configuration elements shared by all Nextcloud docs
## are loaded from `../conf.py`.

# -- Path setup --------------------------------------------------------------

import os
import sys

# Import Nextcloud's shared global documentation configuration (from parent)
sys.path.insert(0, os.path.abspath("../"))
from conf import *

from sphinx.builders.html import StandaloneHTMLBuilder

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = "Nextcloud %s Developer Manual" % (version)

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

# Note: `+=` must be used here because we're extending the inherited list of extensions from our global docs config
extensions += [
    "sphinx.ext.todo",
    "rst2pdf.pdfbuilder",
    "sphinx.ext.intersphinx",
    "sphinxcontrib.phpdomain",
    "sphinx_toolbox.collapse",
    "sphinx_reredirects",
]

templates_path = [
    "../_shared_assets/templates",
    "_templates",
]

exclude_patterns = [
    "_build",
]

highlight_options = {
    "php": {"startinline": True},
}

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme_path = ["../_shared_assets/themes"]
html_static_path = [
    "../_shared_assets/static",
    "_static",
]
# prefer a shorter title for the navigation bar.
html_short_title = "Developer Manual"
# disable "Created using Sphinx" in the HTML footer (default is True)
html_show_sphinx = False

# Add canonical link in all generated pages linking to their respective equivalent
# in `stable` (regardless of which version of the docs someone lands in).
# Note, there is an argument to be made for having this link to `latest` instead,
# but this is likely good enough and the most conservative for now.
html_baseurl = "https://docs.nextcloud.com/server/stable/developer_manual/"

html_last_updated_fmt = "%b %d, %Y"

# -- Options for HTML help output --------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-help-output

# output file base name for HTML help builder.
htmlhelp_basename = "NextcloudDeveloperManual"

# -- Options for HTML builder image support ----------------------------------
# https://www.sphinx-doc.org/en/master/usage/builders/index.html#sphinx.builders.html.StandaloneHTMLBuilder

# prefer gif over png (when both are found); useful for animated gifs
StandaloneHTMLBuilder.supported_image_types = [
    "image/svg+xml",
    "image/gif",
    "image/png",
    "image/jpeg",
]

# -- Options for EPUB output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-epub-output

epub_title = "Nextcloud Developer Manual"
epub_author = "The Nextcloud developers"
epub_publisher = "The Nextcloud developers"
epub_copyright = "2012-2024, The Nextcloud developers"

# -- Options for LaTeX output ------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-latex-output

latex_elements = {
    "preamble": "\\extrafloats{100}\\maxdeadcycles=500\\DeclareUnicodeCharacter{274C}{\\sffamily X}",
}
latex_documents = [
    (
        "index",
        "NextcloudDeveloperManual.tex",
        "Nextcloud Developer Manual",
        "The Nextcloud developers",
        "manual",
    ),
]
latex_logo = "../_shared_assets/static/logo-blue.pdf"

# -- Options for manual page output ------------------------------------------

man_pages = [
    (
        "index",
        "NextcloudDeveloperManual",
        "Nextcloud Developer Manual",
        ["The Nextcloud developers"],
        1,
    )
]

# -- Options for Texinfo output ----------------------------------------------

texinfo_documents = [
    (
        "index",
        "NextcloudDeveloperManual",
        "Nextcloud Developer Manual",
        "The Nextcloud developers",
        "Nextcloud",
        "The Nextcloud Developer Manual.",
        "Miscellaneous",
    ),
]

# -- Options for todo extension ----------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/extensions/todo.html#configuration

todo_include_todos = True

# -- Options for PDF page output ---------------------------------------------
# https://rst2pdf.org/manual.html#sphinx

pdf_documents = [
    (
        "index",
        "NextcloudDeveloperManual",
        "Nextcloud Developer Manual",
        "The Nextcloud developers",
    ),
]

# -- Custom Nextcloud docs context -------------------------------------------
# Generate the versions list for inclusion into all HTML pages
current_docs = "developer_manual"
html_context["versions"] = generateVersionsDocs(current_docs)
html_context["theme_vcs_pageview_mode"] += current_docs

# -- URL redirects -----------------------------------------------------------
# https://documatt.gitlab.io/sphinx-reredirects/usage.html

redirects = {
    # Removed 2023
    "core/index": "../server",
    "core/code-back-end": "../server/code-back-end.html",
    "core/code-front-end": "../server/code-front-end.html",
    "core/externalapi": "../server/externalapi.html",
    "core/static-analysis": "../server/static-analysis.html",
    "core/unit-testing": "../server/unit-testing.html",
    # Removed 2024-09
    "digging_deeper/changelog": "../app_publishing_maintenance/app_upgrade_guide/index.html",
    # Removed 2025-04
    "basics/front-end/l10n": "../translations.html",
}
