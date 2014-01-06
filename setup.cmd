@echo off
set WIN32PATH=%CD%\win32
set PATH=%PATH%;%WIN32PATH%
set OLDDIR=%CD%
set TMPDIR=%TEMP%\sphinx-install

if defined ProgramFiles(x86) (
  set msi="python-2.7.6.amd64.msi"
) else (
  set msi="python-2.7.6.msi"
)

set PYTHONURL="http://www.python.org/ftp/python/2.7.6/%msi%"
set EZSETUPURL="http://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py"

set EASY_INSTALL="C:\Python27\Scripts\easy_install"

rmdir /s /q %TMPDIR%
mkdir %TMPDIR%
cd %TMPDIR%

echo Fetching Python...
wget %PYTHONURL%
echo Fetching Python Easy Setup...
wget --ca-certificate=%WIN32PATH%\ca-bundle.crt %EZSETUPURL%
echo Fetching RST2PDF...
wget --ca-certificate=%WIN32PATH%\ca-bundle.crt %RST2PDFURL%

echo Installing Python...
msiexec /i %msi% /qb ADDLOCAL="Extensions" ADDLOCAL="Tools" ALLUSERS=1

echo Installing Python Easy Setup...
C:\Python27\python.exe ez_setup.py

echo Installing Sphinx...
%EASY_INSTALL% -U sphinx
echo Installing RST2PDF...
%EASY_INSTALL% -U rst2pdf
echo Installing Sphinx PHP Domain...
%EASY_INSTALL% -U sphinxcontrib-phpdomain

echo Setting SPHINXBUILD variable...
setx SPHINXBUILD C:\Python27\Scripts\sphinx-build.exe

echo Removing temporary directory...
cd %OLDDIR%
rmdir /s /q %TMPDIR%
echo Done!
pause
 