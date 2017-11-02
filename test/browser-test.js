// var assert     = require('assert')
let path       = require('path')
let FileServer = require('serve-dir')

// let {take, screenshotSitemap, screenshot} = require('../src/browser')
let testDir    = path.resolve('./test/browser-test-dir/')

describe('Browser', function() {
	let server = new FileServer({dir: testDir})
	server.listen()
	// let url = server.listen()

	after(done => {
		server.destroy().then(() => done())
	})

	xdescribe('#screenshot', () => {
		// it('', done => {
		// })
	})

	xdescribe('#screenshotSitemap', () => {
		// it('', done => {
		// })
	})

	xdescribe('#take', () => {
		// it('', done => {
		// })
	})
})

