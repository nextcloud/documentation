# global configuration for every documentation added at the end

import os, sys, datetime
from subprocess import Popen, PIPE

import sphinx_rtd_theme

dir_path = os.path.dirname(os.path.realpath(__file__))
sys.path.insert(0, os.path.abspath(dir_path + '/_ext'))
now = datetime.datetime.now()

def get_version():

    pipe = Popen('git branch | grep \*', stdout=PIPE, shell=True, universal_newlines=True)
    version = pipe.stdout.read()

    null, version = version.split("*",1)
    version = version.strip()

    if version == "master":
	    return "upcoming"
    elif version[:6] == "stable":
        return version[-2:]
    else:
        return "%s" % (version)

extensions = ['sphinx_rtd_theme', 'sphinx_rtd_dark_mode']

# General information about the project.
copyright = str(now.year) + ' Nextcloud GmbH'

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.
#
# The short X.Y version.
version = get_version()
# The full version, including alpha/beta/rc tags.
release = version

# General information about the project.
project = u'Nextcloud Server (%s)' % (version)

# RTD theme options
html_theme_options = {
    'logo_only': True,
    'style_external_links': True,
    'display_version': False,
}

# relative path to subdirectories
html_logo = "../_shared_assets/static/logo-white.png"

# substitutions go here
#rst_epilog =  '.. |version| replace:: %s' % version

# building the versions list
version_start = 27		# THIS IS THE SUPPORTED VERSION NUMBER
version_stable = 29		# INCREASE THIS NUMBER TO THE LATEST STABLE VERSION NUMBER

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

# user starts in light mode
default_dark_mode = False

latex_engine = "xelatex"
