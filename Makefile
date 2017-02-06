all: build

deps:
	npm install

build: deps
	npm run build
	@echo ""
	@echo "Build is in 'dist/'"
	@echo "Run 'npm start' to run the build"

start: build
	npm run start

dist: build
	npm run dist

clean:
	rm -rf dist/
	rm -rf node_modules/
