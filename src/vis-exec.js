const FileServer = require('serve-dir')
const fs         = require('fs-extra')
const path       = require('path')

const browser = require('./browser')
const {diff}  = require('./diff')

class ServerStub {
	listen() { return Promise.resolve() }
	destroy() { return Promise.resolve() }
}

function exec (vis) {
	const server = (vis.staticDir) ? new FileServer({dir: vis.staticDir}) : new ServerStub()
	const screenshotSitemap = (vis.staticDir) ? browser.screenshotSitemap : () => Promise.resolve()

	function pathTo(dir) {
		return path.resolve(vis.dir, '.visual-acceptance-test', dir)
	}

	return Promise.all([
		server.listen(),
		vis.actualFn(),
		fs.remove(pathTo('HEAD')),
		fs.remove(pathTo('DIFF')),
	])
		.then(() => screenshotSitemap({server, dir: pathTo('HEAD'), dimensions: vis.dimensionsArray}))
		.then(() => vis.timeProtocol.past())
		.then(vis.expectedFn)
		.then(() => screenshotSitemap({server, dir: pathTo(vis.timeProtocol.pastCommit), dimensions: vis.dimensionsArray}))
		.then(() => vis.timeProtocol.now())
		.then(() => {
			return diff({
				actual:      pathTo('HEAD'),
				expected:    pathTo(vis.time.pastCommit),
				diff:        pathTo('DIFF'),
				persistDiff: vis.compareConf.persistDiff || true
			})
		})
		.then(vis.compareFn)
		.then(exitCode => {
			return server.destroy().then(() => process.exit(exitCode))
		})
		.catch(console.log)
}

module.exports = {
	exec,
}

