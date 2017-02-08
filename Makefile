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

publish: build
	@echo "You will need to have a $NODE_GITHUB_ISSUE_BOT GitHub access token set in your environment"
	npm run publish

clean:
	rm -rf dist/
	rm -rf node_modules/
