const {
	Browser, 
	FileServer, 
	diff, 
	confirmation,
	psd,
} = require('../index')

const fs        = require('fs-extra')
const path      = require('path')
const browser   = new Browser()
const server    = new FileServer({dir: staticDir})
const staticDir = path.resolve('./to-build-dir')

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
	fs.remove(pathTo('PSD')),
	fs.remove(pathTo('DIFF')),
])
	.then(() => psd.toPNG({from: path.resolve(__dirname, 'visual-spec'), to: pathTo('SPEC')}))
	.then(dimensions => {
		let sitemap = browser.href({ host: server.host, port: server.port, path: 'sitemap.xml' })
		let dir = pathTo('HEAD')
		return browser.urlsFrom({sitemap}).then(urls => browser.take({dir, urls, dimensions}))
	})
	.then(() => {
		return diff({
			destination: pathTo('DIFF'),
			past:        pathTo('SPEC'),
			current:     pathTo('HEAD'),
		})
	})
	.then(result => confirmation.browser({result}))
	.then(server.destroy)

