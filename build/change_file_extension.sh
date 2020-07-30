#!/bin/bash

find ./locale -name '*.pot' -exec sh -c 'mv "$0" "${0%.pot}.po"' {} \;
