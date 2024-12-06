# global configuration for every documentation added at the end

import os, sys, datetime

import sphinx_rtd_theme

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.abspath(dir_path + '/_ext'))
now = datetime.datetime.now()

extensions = ['sphinx_rtd_theme', 'sphinx_rtd_dark_mode', 'sphinx_copybutton', 'sphinxcontrib.mermaid']

# General information about the project.
copyright = str(now.year) + ' Nextcloud GmbH'

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = 'latest'
# The full version, including alpha/beta/rc tags.
release = version

# RTD theme options
html_theme_options = {
	'logo_only': True,
	'navigation_with_keys': True,
	'style_external_links': True,
	'version_selector': False,
}

# relative path to subdirectories
html_logo = "../_shared_assets/static/logo-white.png"

# substitutions go here
rst_epilog =  '.. |version| replace:: %s' % version

# building the versions list
version_start = 28		# THIS IS THE OLDEST SUPPORTED VERSION NUMBER

						# THIS IS THE VERSION THAT IS MAPPED TO https://docs.nextcloud.com/server/stable/
version_stable = 30		# CHANGING IT MUST RESULT IN A CHANGE OF THE SYMLINK ON THE LIVE SERVER

# Also search for "TODO ON RELEASE" in the rst files

def generateVersionsDocs(current_docs):
	versions_doc = []
	for v in range(version_start, version_stable + 1):
		url = 'https://docs.nextcloud.com/server/%s/%s' % (str(v), current_docs)
		versions_doc.append(tuple((v, url)))
	versions_doc.append(tuple(('stable', 'https://docs.nextcloud.com/server/%s/%s' % ('stable', current_docs))))
	versions_doc.append(tuple(('latest', 'https://docs.nextcloud.com/server/%s/%s' % ('latest', current_docs))))
	return versions_doc

if version.isdigit():
	github_branch = 'stable%s' % version
else:
	github_branch = 'master'

html_context = {
	'current_version': version,
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

# user starts in light mode
default_dark_mode = False

latex_engine = "xelatex"
