## These are the configuration elements for the Nextcloud Admin Manual documentation
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
sys.path.insert(0, os.path.abspath('../'))
from conf import *

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = u'Nextcloud %s Administration Manual' % (version)

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

# Note: `+=` must be used here because we're extending the inherited list of extensions from our global docs config
extensions += [
    'sphinx.ext.todo',
    'rst2pdf.pdfbuilder',
    'sphinx.ext.intersphinx',
    'sphinx_toolbox.sidebar_links',
]

templates_path = [
    '../_shared_assets/templates',
    '_templates',
]

exclude_patterns = [
    '_build','_shared_assets',
    'scripts/*',
]

# use a dedicated file for our main (root) toctree.
root_doc = 'contents'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme_path = ['../_shared_assets/themes']
html_static_path = ['../_shared_assets/static']
# prefer a shorter title for the navigation bar.
html_short_title = "Server Admin Manual"
# disable "Created using Sphinx" in the HTML footer (default is True)
html_show_sphinx = False

# Add canonical link in all generated pages linking to their respective equivalent
# in `stable` (regardless of which version of the docs someone lands in).
# Note, there is an argument to be made for having this link to `latest` instead,
# but this is likely good enough and the most conservative for now.
html_baseurl = "https://docs.nextcloud.com/server/stable/admin_manual/"

# -- Options for HTML help output --------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-help-output

# output file base name for HTML help builder.
htmlhelp_basename = 'NextcloudServerAdminManual'

# -- Options for EPUB output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-epub-output

epub_title = u'Nextcloud Server Administration Manual'
epub_author = u'The Nextcloud developers'
epub_publisher = u'The Nextcloud developers'
epub_copyright = u'2012-2025, The Nextcloud developers'

# -- Options for LaTeX output ------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-latex-output

latex_elements = {
    'preamble': '\\usepackage{morefloats}',
    'figure_align': 'H',
}
latex_documents = [
    (
        'contents',
         'Nextcloud_Server_Administration_Manual.tex',
         u'Nextcloud Server Administration Manual',
         u'The Nextcloud developers',
         'manual',
    ),
]
latex_logo = '../_shared_assets/static/logo-blue.pdf'

# -- Options for manual page output ------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-manual-page-output

man_pages = [
    (
        'contents',
         'nextcloudserveradminmanual',
         u'Nextcloud Server Administration Manual',
         [u'The Nextcloud developers'],
         1,
    ),
]

# -- Options for Texinfo output ----------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-texinfo-output

texinfo_documents = [
    (
        'contents',
        'Nextcloud Server Admin Manual',
         u'Nextcloud Server Administration Manual',
        u'The Nextcloud developers',
        'Nextcloud',
        'The Nextcloud Server Administration Manual.',
        'Miscellaneous',
    ), 
]

# -- Options for todo extension ----------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/extensions/todo.html#configuration

todo_include_todos = True

# -- Options for PDF page output ---------------------------------------------
# https://rst2pdf.org/manual.html#sphinx

pdf_documents = [
    (
        'contents',
         u'Nextcloud Server Administration Manual',
         u'Nextcloud Server Administration Manual',
         u'The Nextcloud developers',
    ),
]

# Generate the versions list for inclusion into all HTML pages
current_docs = 'admin_manual'
html_context['versions'] = generateVersionsDocs(current_docs)
html_context['theme_vcs_pageview_mode'] += current_docs
