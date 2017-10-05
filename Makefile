all: html pdf

html: admin-manual-html user-manual-html user-manual-de-html developer-manual-html
pdf: admin-manual-pdf user-manual-pdf user-manual-de-pdf developer-manual-pdf

admin-manual-html:
	rm -rf admin_manual/_build/html/com
	cd admin_manual && make html
	@echo "Admin manual build finished; HTML is updated"

user-manual-html:
	rm -rf user_manual/_build/html/com
	cd user_manual && make html
	@echo "User manual build finished; HTML is updated"

user-manual-de-html:
	rm -rf user_manual_de/_build/html/com
	cd user_manual_de && make html
	@echo "User manual de build finished; HTML is updated"

developer-manual-html:
	rm -rf developer_manual/_build/html/com
	cd developer_manual && make html
	@echo "Developer manual build finished; HTML is updated"

admin-manual-pdf:
	cd admin_manual && make latexpdf
	@echo "Admin manual build finished; PDF is updated"

user-manual-pdf:
	cd user_manual && make latexpdf
	@echo "User manual build finished; PDF is updated"

user-manual-de-pdf:
	cd user_manual_de && make latexpdf
	@echo "User manual de build finished; PDF is updated"

developer-manual-pdf:
	cd developer_manual && make latexpdf
	@echo "Developer manual build finished; PDF is updated"

api-docs: clean-api-docs
	mkdir -p developer_manual/api/
	sh get-server-sources.sh master
	composer install
	php generateApiDoc.php
	
clean: clean-api-docs
	rm -r admin_manual/_build developer_manual/_build developer_manual/api user_manual/_build user_manual_de_/_build

clean-api-docs:
	rm -fr developer_manual/api/
