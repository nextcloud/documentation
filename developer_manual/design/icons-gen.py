#! /bin/env python
# Generate the icon part of the design documentation
# coding=utf8
# the above tag defines encoding for this document and is for Python 2.x compatibility

import re
import os

iconregex = re.compile("(\.icon-[a-z-]*)")
pathregex = r"url\(\"([a-z0-9-./]+)"

os.system('rm -R ./img/')
os.system('rm icons.txt')
os.system('wget https://github.com/nextcloud/server/archive/master.zip')
os.system("unzip -p master.zip 'server-master/core/css/icons.scss' > icons.scss")
os.system("unzip -p master.zip 'server-master/core/css/functions.scss' > functions.scss")
os.system("unzip -p master.zip 'server-master/core/css/variables.scss' > variables.scss")
os.system("unzip -u master.zip 'server-master/core/img/*'")
os.system('echo \'$webroot:"";@import "functions";@import "variables";@import "icons";\' | sass --scss -s > icons.css')
os.system('mv ./server-master/core/img .')
os.system('rm master.zip')
os.system('rm *.scss')
os.system('rm -R ./.sass-cache/')
os.system('rm -R ./server-master/')

icons = {}

scss = open('icons.css')
lines = scss.readlines()

for i, line in enumerate(lines):
    for match in re.finditer(pathregex, line):
    	iconclass = iconregex.match(lines[i-1])
    	if iconclass:
	    	icons[iconclass.groups()[0]] = match.groups()[0]

result = ""
for icon, path in sorted(icons.items()):
	path = path.split('/')
	localpath = '/'.join(path[3:5])
	result += ".. figure:: img/" + localpath + "*\n   :height: 32\n   :width: 32\n\n   " + icon[1:] + "\n\n"
	os.system('inkscape -z img/' + localpath + '.svg -e img/' + localpath + '.png')

f = open('icons.txt', 'w')
f.write(result);
f.close()
os.system('rm *.css')