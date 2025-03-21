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

developer-manual-html: openapi-spec
	rm -rf developer_manual/_build/html/com
	cd developer_manual && make html
	@echo "Developer manual build finished; HTML is updated"

admin-manual-pdf:
	cd admin_manual && make latexpdf
	@echo "Admin manual build finished; PDF is updated"

user-manual-pdf:
	cd user_manual && make latexpdf
	@echo "User manual build finished; PDF is updated"

get-server-sources:
	cd build && sh get-server-sources.sh $(DRONE_BRANCH)

openapi-spec: get-server-sources
	git submodule update --init
	cd build/openapi-extractor && composer install
	cd build && ./openapi-extractor/merge-specs \
		--core server/core/openapi.json \
		--merged ../developer_manual/_static/openapi.json \
		$$(ls server/apps/*/openapi.json)
	cd developer_manual/_static && \
		wget https://unpkg.com/@stoplight/elements@8.1.0/web-components.min.js -O stoplight-elements.js && \
		wget https://unpkg.com/@stoplight/elements@8.1.0/styles.min.css -O stoplight-elements.css


clean:
	rm -vrf admin_manual/_build developer_manual/_build user_manual/_build user_manual_de_/_build
