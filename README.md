# visual-acceptance-test

[![Build Status](https://travis-ci.org/doodzik/visual-acceptance-test.svg?branch=master)](https://travis-ci.org/doodzik/visual-acceptance-test) [![Greenkeeper badge](https://badges.greenkeeper.io/doodzik/visual-acceptance-test.svg)](https://greenkeeper.io/) [![Coverage Status](https://coveralls.io/repos/github/doodzik/javascript-html-tags/badge.svg?branch=master)](https://coveralls.io/github/doodzik/javascript-html-tags?branch=master)[![Maintainability](https://api.codeclimate.com/v1/badges/9cbe308f2317f1339bc6/maintainability)](https://codeclimate.com/github/doodzik/visual-acceptance-test/maintainability)

Create visual acceptance tests.

# Usage

Install visual-acceptance-test
```
$ npm install doodzik/visual-acceptance-test
```

Install visual-acceptance-test
```
$ npm install doodzik/visual-acceptance-test
```

Configure your Visual Accaptance Test
<details>
  <summary>Static Regression Test</summary>

Create a `vis.js` file in the project root
```javascript

const shell     = require('shelljs')
const path      = require('path')

const {
	VIS,
	Time,
  confirmation,
} = require('visual-acceptance-test')

const time = new Time.LastCommit(__dirname)

function build() {
	return new Promise(function(resolve, reject) {
		shell.exec('make install', function(code, stdout, stderr) {
      shell.exec('make build', function(code, stdout, stderr) {
        resolve()
      })
    })
  })
}

return new VIS(__dirname)
.static(path.resolve(__dirname, '.tmp'))
.time(time)
.dimensions([{width: 1080}, {width: 720}])
.actual(build)
.expected(build)
.compare(result => {
  return (process.env.CI) ? confirmation.cli({result}) : confirmation.browser({result})
})
.exec()
```
</details>

<details>
  <summary>Dynamic Regression Test</summary>

Create a `vis.js` file in the project root
```javascript 
const shell     = require('shelljs')
const path      = require('path')

const {
	VIS,
	Time,
  confirmation,
} = require('visual-acceptance-test')

const time = new Time.LastCommit(__dirname)

function build(pathToResultDir) {
	return new Promise(function(resolve, reject) {
		shell.exec('make install', function(code, stdout, stderr) {
      shell.exec(`VIS_DIR="${pathToResultDir}" make test`, function(code, stdout, stderr) {
        resolve()
      })
    })
  })
}

return new VIS(__dirname)
.time(time)
.dimensions([{width: 1080}, {width: 720}])
.actual(build)
.expected(build)
.compare(result => {
  return (process.env.CI) ? confirmation.cli({result}) : confirmation.browser({result})
})
.exec()
```

And then add the following helper in your tests where you want to test your website visuals.
``` javascript
// TODO
``` 
</details>

</details>
<summary>Visual Spec Testing</summary>
``` javascript
// TODO
``` 
</details>

Install visual-acceptance-test
```
$ npm install doodzik/visual-acceptance-test
```

# Examples

feel free to open a pr to add your project (only links to source code)

## Static Regression Tests
[dudzik.co](https://github.com/doodzik/dudzik.co)

## Dynamic Regression Tests
## Static Visual Spec Testing

# [Roadmap](https://github.com/doodzik/visual-acceptance-test/projects/1)

# API

## VIS
### # actual(pathToResultDir)

pathToResultDir is the path where the actual test results should be saved

If you have your deps already installed you can omit the installation step.
This is because the `actual` function is applied to the current state of your project.

# Author

[Frederik Dudzik](https://dudzik.co)

