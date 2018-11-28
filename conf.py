# global configuration for every documentation added at the end

import os, sys, datetime

import sphinx_rtd_theme

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.abspath(dir_path + '/_ext'))
now = datetime.datetime.now()

extensions = ['edit_on_github']

# General information about the project.
copyright = str(now.year) + ' Nextcloud GmbH'

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = '13'
# The full version, including alpha/beta/rc tags.
release = version

# RTD theme options
html_theme_options = {
    'logo_only': True,
    'style_external_links': True,
    'display_version': False,
}

 # relative path to subdirectories
html_logo = "../_shared_assets/static/logo-white.png"

# substitutions go here
rst_epilog =  '.. |version| replace:: %s' % version

# building the versions list
def generateVersionsDocs(current_docs):
	version_start = 13		# THIS IS THE SUPPORTED VERSION NUMBER
	version_stable = 15		# INCREASE THIS NUMBER TO THE LATEST STABLE VERSION NUMBER
	versions_doc = []
	for v in range(version_start, version_stable + 1):
		url = 'https://docs.nextcloud.com/server/%s/%s' % (str(v), current_docs)
		versions_doc.append(tuple((v, url)))
	versions_doc.append(tuple(('stable', 'https://docs.nextcloud.com/server/%s/%s' % ('stable', current_docs))))
	versions_doc.append(tuple(('latest', 'https://docs.nextcloud.com/server/%s/%s' % ('latest', current_docs))))
	return versions_doc

html_context = {
	'current_version': version,
	'READTHEDOCS': True,
	'extra_css_files': ['_static/custom.css']
}

edit_on_github_project = 'nextcloud/documentation'
edit_on_github_branch = 'master'
