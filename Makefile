all: zips cazips
	
zips:
	./scripts/fetch.sh

cazips:
	./scripts/fetch_canada.sh

zip: zips

codes: zips

.PHONY: zips
