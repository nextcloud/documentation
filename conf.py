# global configuration for every documentation added at the end

import os, sys, datetime

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
version = '14'
# The full version, including alpha/beta/rc tags.
release = '14'

# substitutions go here
rst_epilog =  '.. |version| replace:: %s' % version

html_context = {
	'doc_versions': ['11', '12', '13', '14'],
	'current_doc': os.path.basename(os.getcwd()),
}

edit_on_github_project = 'nextcloud/documentation'
edit_on_github_branch = 'master'
