const url       = require('url') 
const { URL }   = url
var assert      = require('assert')
let path        = require('path')
let FileServer  = require('serve-dir')
const Nightmare = require('nightmare')
const fs        = require('fs-extra')

const {diffImageStat} = require('../src/imageDiff')

const {
	take, screenshotSitemap, screenshot, getActualWebsiteDimensions,
	_defaultIntValue, _point, _toPNGFilename 
} = require('../src/browser')

let testDir = path.resolve('./test/browser-test-dir/')

describe('Browser', function() {
	const server = new FileServer({dir: testDir})
	const href   = server.listen().then(port => `http://${server.host}:${port}/`)

	after(done => {
		Promise.all([
			server.destroy(),
			fs.remove(path.resolve(testDir, '[1000 AUTO]', 'screenshot', 'index.html.png')),
		]).then(() => done())
	})

	describe('#_defaultIntValue', () => {
		context('when value is undefined', () => {
			const obj = (undefinedVar => _defaultIntValue (undefinedVar, 800))()

			it('toString returns \'AUTO\'', () => {
				const res = obj.toString()
				assert.equal('AUTO', res)
			})

			it('isDefault is true', () => {
				const res = obj.isDefault
				assert.equal(true, res)
			})

			it('default value should be applied', () => {
				const res = obj.value
				assert.equal(800, res)
			})
		})

		context('when value is defined', () => {
			const obj = _defaultIntValue (600, 800)

			it('toString returns \'AUTO\'', () => {
				const res = obj.toString()
				assert.equal('600', res)
			})

			it('isDefault is false', () => {
				const res = obj.isDefault
				assert.equal(false, res)
			})

			it('default value should not be applied', () => {
				const res = obj.value
				assert.equal(600, res)
			})
		})
	})

	describe('#_point', () => {
		it('has default values', () => {
			const point = _point({})
			assert.equal(point.x.value, 800)
			assert.equal(point.y.value, 600)
		})

		it('constructs string representation', () => {
			const point = _point({width: 100, height: 200})
			assert.equal(point.toString(), '[100 200]')
		})
	})

	describe('#_toPNGFilename', () => {
		const dir = __dirname
		context('with pathname', () => {
			it('filename is pathname', () => {
				const point = { toString() { return 'STUB' } }
				const url   = new URL('http://localhost:80/path/to/index')

				const file  = _toPNGFilename (dir, point, url)
				const p = path.resolve(dir, 'STUB', 'path', 'to')
				assert.equal(file.dir, p) 
				assert.equal(file.file, path.resolve(p, 'index.png'))
			})
		})

		context('without pathname', () => {
			it('filename is hostname', () => {
				const point = { toString() { return 'STUB' } }
				const url   = new URL('http://localhost:80/')

				const file = _toPNGFilename (dir, point, url)

				const p = path.resolve(dir, 'STUB')
				assert.equal(file.dir, p) 
				assert.equal(file.file, path.resolve(p, 'localhost.png'))
			})
		})
	})

	describe('#getActualWebsiteDimensions', () => {
		context('when viewport smaller than size', () => {
			it('get the fitting dimensions', done => {
				const nightmare = new Nightmare({ show: false })
				href.then(basehref => {
					nightmare.viewport(600, 800)
						.goto(url.resolve(basehref, 'actual-dimension.html'))
						.wait('body')
						.evaluate(getActualWebsiteDimensions)
						.then(dimension => {
							assert.equal(dimension.width, 1000)
							assert.equal(dimension.height, 1000)
							done()
						})
				})
			})
		})

		context('when viewport bigger than size', () => {
			it('get the initial dimensions', done => {
				const nightmare = new Nightmare({ show: false })
				href.then(basehref => {
					nightmare.viewport(2000, 2000)
						.goto(url.resolve(basehref, 'actual-dimension.html'))
						.wait('body')
						.evaluate(getActualWebsiteDimensions)
						.then(dimension => {
							assert.equal(dimension.width, 2000)
							assert.ok(dimension.height > 1000)
							done()
						})
				})
			})
		})
	})

	describe('#screenshot', function() {
		this.timeout(3000)
		it('takes a screenshot', done => {
			const nightmare = new Nightmare({ show: false })
			href.then(basehref => {
				return screenshot({url: url.resolve(basehref, 'screenshot/index.html'), nightmare: nightmare, width: 1000, dir: testDir})
			}).then(() => {
				const pastPath = path.resolve(testDir, 'screenshot', 'result.png')
				const currentPath = path.resolve(testDir, '[1000 AUTO]', 'screenshot', 'index.html.png')
				return diffImageStat({pastPath, currentPath, threshhold: 0.01})
			}).then(stat => assert.ok(stat.isEqual))
				.then(() => nightmare.end())
				.then(() => done())
		})

		xit('marks if the width/height has overflown its boundry', done => {
			done()
		})
	})

	describe('#take', () => {
		it('applies all combinations to screenshot', done => {
			const dir = 'nonExistingDir'
			const urls = ['1', '2', '3', '4']
			const dimensions = [{width: 1000}, {width:600, height: 700}]
			let set = new Set(urls.map(u => dimensions.map(d => `${dir} ${u} ${d.width} ${d.height}`)).reduce((a, b) => a.concat(b), []))

			const screenshotStub = function ({dir, url, width, height}) {
				const str = `${dir} ${url} ${width} ${height}`
				const res = set.delete(str)
				assert.ok(res)
			}

			take({dir, urls, dimensions, screenshot: screenshotStub}).then(() => done())
		})
	})

	describe('#screenshotSitemap', () => {
		it('applies all urls from sitemap to take', done => {
			href.then(() => {
				const dims = [{width: 100}, {height:500}]
				const set = new Set([
					'https://dudzik.co/about:blank/index.html',
					'https://dudzik.co/contact/index.html',
					'https://dudzik.co/about:blank/index.html',
					'https://dudzik.co/digress-into-development/index.html',
					'https://dudzik.co/personal-blog/index.html',
					'https://dudzik.co/about:blank/index.html',
					'https://dudzik.co/about:blank/index.html',
				])

				const takeStub = function ({dir, urls, dimensions}) {
					const newSet = new Set(urls)
					const diff = new Set([...newSet].filter(x => !set.has(x)))
					assert.ok(diff.size == 0)
					assert.equal(dir, 'dir')
					assert.deepEqual(dimensions, dims)
				}

				return screenshotSitemap({server, dir: 'dir', dimensions: dims, take: takeStub})
			}).then(() => done())
		})
	})
})

