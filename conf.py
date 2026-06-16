# global configuration for every documentation added at the end

import os, sys, datetime

import sphinx_rtd_theme

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.abspath(dir_path + '/_ext'))
now = datetime.datetime.now()

os.environ["READTHEDOCS"] = "True"

extensions = ['sphinx_rtd_theme', 'sphinx_rtd_dark_mode', 'sphinx_copybutton']

# General information about the project.
copyright = str(now.year) + ' Nextcloud GmbH'

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = 'latest'
# The full version, including alpha/beta/rc tags.
# Can be overridden via DOCS_RELEASE env var (used for PDF builds to show the actual version number)
release = os.environ.get('DOCS_RELEASE', version)

# RTD theme options
html_theme_options = {
    'logo_only': True,
    'style_external_links': True,
    'display_version': False,
}

# relative path to subdirectories
html_logo = "../_shared_assets/static/logo-white.png"

# substitutions go here
display_version = '30'
rst_epilog =  '.. |version| replace:: %s' % display_version

# building the versions list
version_start = 32		# oldest documented version
version_stable = 34		# latest released stable

# Also search for "TODO ON RELEASE" in the rst files

def generateVersionsDocs(current_docs):
	versions_doc = []
	# Prepend this unsupported branch so it appears last after |reverse
	branch_ver = int(display_version)
	if branch_ver < version_start:
		url = 'https://docs.nextcloud.com/server/%s/%s' % (display_version, current_docs)
		versions_doc.append((branch_ver, url, '%s (unsupported)' % display_version))
	for v in range(version_start, version_stable):
		url = 'https://docs.nextcloud.com/server/%s/%s' % (str(v), current_docs)
		versions_doc.append((v, url, str(v)))
	versions_doc.append(('stable', 'https://docs.nextcloud.com/server/stable/%s' % current_docs, '%s (stable)' % version_stable))
	versions_doc.append(('latest', 'https://docs.nextcloud.com/server/latest/%s' % current_docs, '%s (latest)' % str(version_stable + 1)))
	return versions_doc

if version.isdigit():
	github_branch = 'stable%s' % version
else:
	github_branch = 'master'

html_context = {
	'current_version': branch_ver,
	'display_version': display_version,
	'READTHEDOCS': True,
	'extra_css_files': ['_static/custom.css'],

	# force github plugin
	'display_github': True,
	'github_user': 'nextcloud',
	'github_repo': 'documentation',
	# If current version is an int, use the stablexxx branches, otherwise, edit on master
	'theme_vcs_pageview_mode': 'edit/%s/' % github_branch, # to be completed by each individual conf.py
}

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
