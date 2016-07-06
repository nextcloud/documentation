all: admin-manual user-manual developer-manual

admin-manual:
	cd admin_manual && make latexpdf
	rm -rf admin_manual/_build/html/com
	cd admin_manual && make html
	@echo "Admin manual build finished; PDF and HTML is updated"

user-manual:
	cd user_manual && make latexpdf
	rm -rf user_manual/_build/html/org
	cd user_manual && make html
	@echo "User manual build finished; PDF and HTML is updated"

developer-manual:
	cd developer_manual && make latexpdf
	rm -rf developer_manual/_build/html/com
	cd developer_manual && make html
	@echo "Developer manual build finished; PDF and HTML is updated"
