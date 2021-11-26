ICON_BUILDER_DOCKER_NAME=icon-docs-builder

all: html pdf

html: admin-manual-html user-manual-html developer-manual-html
pdf: admin-manual-pdf user-manual-pdf

admin-manual-html:
	rm -rf admin_manual/_build/html/com
	cd admin_manual && make html
	@echo "Admin manual build finished; HTML is updated"

user-manual-html:
	rm -rf user_manual/_build/html/com
	cd user_manual && make html
	@echo "User manual build finished; HTML is updated"

developer-manual-html: icons-docs
	rm -rf developer_manual/_build/html/com
	cd developer_manual && make html
	@echo "Developer manual build finished; HTML is updated"

admin-manual-pdf:
	cd admin_manual && make latexpdf
	@echo "Admin manual build finished; PDF is updated"

user-manual-pdf:
	cd user_manual && make latexpdf
	@echo "User manual build finished; PDF is updated"

icons-docs: icons-docs-prepare
	$(MAKE) icons-doc-run

icons-docs-prepare: clean-icons-docs
	cd build && sh get-server-sources.sh $(DRONE_BRANCH)

icons-docs-run:
	cd build && composer install && composer update
	cd build && php generateIconsDoc.php

icons-docs-docker:
	docker build -t $(ICON_BUILDER_DOCKER_NAME) build/icon-builder
	docker run --rm -i -v $(shell pwd):/work $(ICON_BUILDER_DOCKER_NAME)

clean: clean-icons-docs
	rm -r admin_manual/_build developer_manual/_build user_manual/_build user_manual_de_/_build

clean-icons-docs:
	rm -rf developer_manual/html_css_design/img/
