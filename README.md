# visual-acceptance-test

[![Build Status](https://travis-ci.org/doodzik/visual-acceptance-test.svg?branch=master)](https://travis-ci.org/doodzik/visual-acceptance-test) [![Greenkeeper badge](https://badges.greenkeeper.io/doodzik/visual-acceptance-test.svg)](https://greenkeeper.io/) [![Coverage Status](https://coveralls.io/repos/github/doodzik/javascript-html-tags/badge.svg?branch=master)](https://coveralls.io/github/doodzik/javascript-html-tags?branch=master)[![Maintainability](https://api.codeclimate.com/v1/badges/9cbe308f2317f1339bc6/maintainability)](https://codeclimate.com/github/doodzik/visual-acceptance-test/maintainability)

Create visual acceptance tests.

# Usage

Install visual-acceptance-test
```
$ npm install doodzik/visual-acceptance-test
```

Configure your Visual Accaptance Test
<details>
  <summary>Static Regression Test</summary>

Create a `vis.js` file in the project root
```javascript
const {
	browser,
	FileServer,
	Time,
	diff,
	confirmation
} = require('visual-acceptance-test')

const fs        = require('fs-extra')
const path      = require('path')
const time      = new Time.LastCommit(__dirname)
const staticDir = path.resolve(__dirname, '.tmp')
const server    = new FileServer({dir: staticDir})

const dimensions = [{width: 1080}, {width: 720}]

function pathTo(dir) {
	return path.resolve(__dirname, '.visual-acceptance-test', dir)
}

var shell = require('shelljs')

function build() {
	return new Promise(function(resolve, reject) {
		shell.exec('npm install', function(code, stdout, stderr) {
			shell.exec('make build', function(code, stdout, stderr) {
				resolve()
			})
		})
	})
}


return Promise.all([
	server.listen(),
	build(),
	fs.remove(pathTo('HEAD')),
	fs.remove(pathTo('DIFF')),
])
	.then(() => browser.screenshotSitemap({server, dir: pathTo('HEAD'), dimensions}))
	.then(() => time.past())
	.then(build)
	.then(() => browser.screenshotSitemap({server, dir: pathTo(time.pastCommit), dimensions}))
	.then(() => time.now())
	.then(() => {
		return diff({
			actual:      pathTo(time.pastCommit),
			expected:    pathTo('HEAD'),
			diff:        pathTo('DIFF'),
			persistDiff: true
		})
	})
	.then(result => {
    // TODO fix browser displaying
	  // return (process.env.CI) ? confirmation.cli({result}) : confirmation.browser({result})
		return confirmation.cli({result})
	})
	.then(exitCode => {
		return server.destroy().then(() => process.exit(exitCode))
	})
  .catch(console.log)
```
</details>

<details>
  <summary>Dynamic Regression Test</summary>
Create a `vis.js` file in the project root

```javascript
const {
	browser,
	FileServer,
	Time,
	diff,
	confirmation
} = require('visual-acceptance-test')

const fs        = require('fs-extra')
const path      = require('path')
const time      = new Time.LastCommit(__dirname)
const staticDir = path.resolve(__dirname, '.tmp')
const server    = new FileServer({dir: staticDir})

const dimensions = [{width: 1080}, {width: 720}]

function pathTo(dir) {
	return path.resolve(__dirname, '.visual-acceptance-test', dir)
}

var shell = require('shelljs')

function build(pathToResults) {
	return new Promise(function(resolve, reject) {
		shell.exec('npm install', function(code, stdout, stderr) {
			shell.exec(`VIS_DIR=${pathToResults} make test`, function(code, stdout, stderr) {
				resolve()
			})
		})
	})
}


return Promise.all([
	server.listen(),
	fs.remove(pathTo('HEAD')),
	fs.remove(pathTo('DIFF')),
])
	.then(() => build(pathTo('HEAD')))
	.then(() => time.past())
	.then(() => build(pathTo(time.pastCommit)))
	.then(() => time.now())
	.then(() => {
		return diff({
			actual:      pathTo(time.pastCommit),
			expected:    pathTo('HEAD'),
			diff:        pathTo('DIFF'),
			persistDiff: true
		})
	})
	.then(result => {
	  return (process.env.CI) ? confirmation.cli({result}) : confirmation.browser({result})
		return confirmation.cli({result})
	})
	.then(exitCode => {
		return server.destroy().then(() => process.exit(exitCode))
	})
  .catch(console.log)
```

And then add the following helper in your tests where you want to test your website visuals.
``` javascript
// TODO
``` 
</details>

<details>
<summary>Visual Spec Testing</summary>
``` javascript
// TODO
``` 
</details>

# Projects

feel free to open a pr to add your project (only links to source code)

<details>
<summary>Static Regression Tests</summary>

[dudzik.co](https://github.com/doodzik/dudzik.co)

</details>

<details>
<summary>Dynamic Regression Tests</summary>
</details>

<details>
<summary>Visual Spec Testing</summary>
</details>

# [Roadmap](https://github.com/doodzik/visual-acceptance-test/projects/1)

# API

# Author

[Frederik Dudzik](https://dudzik.co)

