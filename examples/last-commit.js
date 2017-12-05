/*eslint no-console: "warn"*/

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
			if (stderr) {
				console.log(code, stdout, stderr)
				return reject()
			}
			shell.exec('make build', function(code, stdout, stderr) {
				if (stderr) {
					console.log(code, stdout, stderr)
					return reject()
				}
				resolve()
			})
		})
	})
}

Promise.all([
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
			persistDiff: false
		})
	})
	.then(result => {
		// return (process.env.CI) ? confirmation.cli({result}) : confirmation.browser({result})
		return confirmation.cli({result})
	})
	.then(exitCode => {
		return server.destroy().then(() => process.exit(exitCode))
	})
	.catch(console.log)


