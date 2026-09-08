# global configuration for every documentation added at the end

import os, sys, datetime

import sphinx_rtd_theme

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.abspath(dir_path + '/_ext'))
now = datetime.datetime.now()

os.environ["READTHEDOCS"] = "True"

extensions = [
    'sphinx_rtd_theme',
    'sphinx_rtd_dark_mode',
    'sphinx_copybutton',
    'sphinxcontrib.mermaid',
    'notfound.extension',
]

# General information about the project.
copyright = '2016-' + str(now.year) + ' Nextcloud GmbH and Nextcloud contributors'

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = 'latest'
# The full version, including alpha/beta/rc tags.
# Can be overridden via DOCS_RELEASE env var (used for PDF builds to show the actual version number)
release = os.environ.get('DOCS_RELEASE', version)

# Ensure release is either "latest", or a digit (for stable versions)
if not (release == 'latest' or release.isdigit()):
	raise ValueError("Invalid release version: %s. Must be 'latest' or a digit." % release)

# Print the version being built in a clear way in the logs
width = 60
msg = " Building documentation for version: %s " % release
print("\n\n" + "#" * width)
print("#" + msg.center(width - 2, "#") + "#")
print("#" * width + "\n\n")

# RTD theme options
html_theme_options = {
	'logo_only': True,
	'navigation_with_keys': True,
	'style_external_links': True,
	'version_selector': False,
}

# relative path to subdirectories
html_logo = "../_shared_assets/static/logo-white.png"

# disable including the reST sources in HTML builds (in _sources/) (default is True)
html_copy_source = False

# building the versions list
# In CI: DOCS_VERSION_STABLE and DOCS_VERSION_START are injected by sphinxbuild.yml
# via detect-versions.php so these values are always current without manual updates.
# Fallbacks here are used for local builds only.
version_start  = int(os.environ.get('DOCS_VERSION_START',  32))
version_stable = int(os.environ.get('DOCS_VERSION_STABLE', 34))  # CHANGING IT MUST RESULT IN A CHANGE OF THE SYMLINK ON THE LIVE SERVER
# In CI: DOCS_DISPLAY_VERSION is injected by sphinxbuild.yml.
# Fallback: PDF/ePub builds use release (DOCS_RELEASE); local master builds use version_stable+1.
display_version = os.environ.get('DOCS_DISPLAY_VERSION') or (
    release if release != 'latest' else str(version_stable + 1)
)

# Also search for "TODO ON RELEASE" in the rst files

# substitutions go here
rst_epilog = """
.. |version| replace:: %s
""" % (display_version)

# Replace hardcoded /latest/ URLs in all .rst source files with the actual release
def replace_latest(app, docname, source):
    if release != 'latest':
        source[0] = source[0].replace('/server/latest/', '/server/%s/' % release)

def setup(app):
    app.connect('source-read', replace_latest)

def generateVersionsDocs(current_docs):
	versions_doc = []

	# If viewing an unsupported (older than version_start) branch, prepend it so it
	# appears last after the template's |reverse — e.g. "26 (unsupported)" at the bottom.
	if display_version.isdigit() and int(display_version) < version_start:
		branch_ver = int(display_version)
		url = 'https://docs.nextcloud.com/server/%s/%s' % (display_version, current_docs)
		versions_doc.append((branch_ver, url, '%s (unsupported)' % branch_ver))

	for v in range(version_start, version_stable):
		url = 'https://docs.nextcloud.com/server/%s/%s' % (str(v), current_docs)
		versions_doc.append((v, url, '%s (stable)' % v))
	versions_doc.append(('stable', 'https://docs.nextcloud.com/server/stable/%s' % current_docs, '%s (latest)' % version_stable))
	versions_doc.append(('latest', 'https://docs.nextcloud.com/server/latest/%s' % current_docs, '%s (upcoming)' % str(version_stable + 1)))
	return versions_doc

if version.isdigit():
	github_branch = 'stable%s' % version
else:
	github_branch = 'master'

html_context = {
	'current_version': int(display_version) if display_version.isdigit() else version,
	'display_version': display_version,
	'READTHEDOCS': True,

	# force github plugin
	'display_github': True,
	'github_user': 'nextcloud',
	'github_repo': 'documentation',
	# If current version is an int, use the stablexxx branches, otherwise, edit on master
	'theme_vcs_pageview_mode': 'edit/%s/' % github_branch, # to be completed by each individual conf.py
}

html_static_path = ['_static']
# Extra CSS relative to html_static_path
html_css_files = [
	'custom.css'
]

edit_on_github_project = 'nextcloud/documentation'
edit_on_github_branch = 'master'

# Automatically add EoL warning banner to docs for unsupported releases
if (version.isdigit() and version < version_start):
    rst_prolog = """.. danger::
        **OUTDATED DOCUMENTATION**
    
        *You are viewing documentation for a retired version of Nextcloud.
        Do not follow these instructions for current releases.*

        **To ensure you have the most reliable and up-to-date guidance,
        please visit the** `Nextcloud Documentation homepage
        <https://docs.nextcloud.com/>`_.
    """

# user starts in light mode
default_dark_mode = False

latex_engine = "xelatex"

# -- Options for sphinx-notfound-page extension -----------------------------------
# https://github.com/readthedocs/sphinx-notfound-page

# content context passed to the 404 template
notfound_context = {
    "title": "404 Page Not Found",
    "body": """
<h1>Page Not Found</h1>
<h2>Sorry, we can't seem to find the page you're looking for.</h2>
<h6>Error code: 404</h6>

<h3>Here are some alternatives:</h3>
<ol>
  <li>Try using the search box.</li>
  <li>Check the content menu on the side of this page.</li>
  <li>Regroup at our <a href="/">documentation homepage.</a></p></li>
</ol>
""",
}

notfound_urls_prefix = None
