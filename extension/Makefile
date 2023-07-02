DATE := $(shell date +%Y-%m-%d)

build:
	@if [ ! -d "dist" ]; then mkdir dist; fi
	@echo "执行popup页面的编译:"
	cd popup && npm run build
	@echo "拷贝相关文件到dist:"
	cp -r images dist/images
	cp -r scripts dist/scripts
	cp background.js dist/background.js
	cp manifest.json dist/manifest.json


.PHONY: build