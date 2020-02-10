all: html pdf upload-user-manual-strings-transifex

html: admin-manual-html user-manual-html developer-manual-html
pdf: admin-manual-pdf user-manual-pdf user-manual-de-pdf

admin-manual-html:
	rm -rf admin_manual/_build/html/com
	cd admin_manual && make html
	@echo "Admin manual build finished; HTML is updated"

user-manual-html:
	rm -rf user_manual/_build/html
	cd user_manual && make html
	@echo "User manual build finished; HTML is updated"

developer-manual-html: api-docs icons-docs
	rm -rf developer_manual/_build/html/com
	cd developer_manual && make html
	@echo "Developer manual build finished; HTML is updated"

admin-manual-pdf:
	cd admin_manual && make latexpdf
	@echo "Admin manual build finished; PDF is updated"

user-manual-pdf:
	cd user_manual && make latexpdf
	@echo "User manual build finished; PDF is updated"

upload-user-manual-strings-transifex:
	cd user_manual && make gettext && tx push --source
	@echo "English Strings for user manual have been uploaded to transifex, ready to be translated!"

icons-docs: clean-icons-docs
	cd build && sh get-server-sources.sh $(DRONE_BRANCH)
	cd build && composer install && composer update
	cd build && php generateIconsDoc.php

clean: clean-icons-docs
	rm -r admin_manual/_build developer_manual/_build user_manual/_build user_manual_de_/_build

clean-icons-docs:
	rm -rf developer_manual/design/img/
