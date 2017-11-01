const {
	browser, 
	FileServer, 
	Time, 
	diff, 
	confirmation
} = require('../index')

const fs        = require('fs-extra')
const path      = require('path')
const time      = new Time.LastCommit(__dirname)
const staticDir = path.resolve('./to-build-dir')
const server    = new FileServer({dir: staticDir})

const dimensions = [{width: 1080}, {width: 720}]

function pathTo(dir) {
	return path.resolve(__dirname, '.visual-acceptance-test', dir)
}

function build() {
	// TODO build
	return Promise.resolve()
}

Promise.all([
	server.listen(),
	build(),
	fs.remove(pathTo('HEAD')),
	fs.remove(pathTo('DIFF')),
])
	.then(() => browser.screenshotSitemap({server, dir: pathTo('HEAD'), dimensions}))
	.then(time.past)
	.then(build)
	.then(() => browser.screenshotSitemap({server, dir: pathTo(time.pastCommit), dimensions}))
	.then(time.now)
	.then(() => {
		return diff({
			destination: pathTo('DIFF'),
			past:        pathTo(time.pastCommit),
			current:     pathTo('HEAD'),
			threshhold:  5,
		})
	})
	.then(result => confirmation.browser({result}))
	.then(server.destroy)

