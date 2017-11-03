var assert     = require('assert')
let path       = require('path')
let FileServer = require('serve-dir')

let {constructURL, extractURLsfrom} = require('../src/url-extra')
let testDir    = path.resolve('./test/url-extra-test-dir/')

describe('url-extra', function() {
	let server = new FileServer({dir: testDir})
	let url = server.listen()

	after(done => {
		server.destroy().then(() => done())
	})

	describe('#constructURL', () => {
		it('should build url', done => {
			url.then(() => {
				let sitemap = constructURL({ hostname: server.host, port: server.port, path: 'sitemap.xml' })
				assert.equal(sitemap, `http://${server.host}:${server.port}/sitemap.xml`)
				done()
			})
		})
	})

	describe('#extractURLsfrom', () => {
		it('sitemap should urls from sitemap', done => {
			url.then(() => extractURLsfrom({sitemap: `http://${server.host}:${server.port}/sitemap.xml`}))
				.then(urls => {
					assert.equal(urls.size, 4)
					assert.ok(urls.has('https://dudzik.co/about:blank/index.html'))
					assert.ok(urls.has('https://dudzik.co/contact/index.html'))
					assert.ok(urls.has('https://dudzik.co/digress-into-development/index.html'))
					assert.ok(urls.has('https://dudzik.co/personal-blog/index.html'))
					done()
				})
		})
	})
})

