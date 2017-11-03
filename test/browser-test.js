const { URL }   = require('url') 
var assert      = require('assert')
let path        = require('path')
// let FileServer  = require('serve-dir')
// const Nightmare = require('nightmare')

const {
	// take, screenshotSitemap, screenshot, getActualWebsiteDimensions,
	_defaultIntValue, _point, _toPNGFilename 
} = require('../src/browser')

// let testDir = path.resolve('./test/browser-test-dir/')

describe('Browser', function() {
	// let server = new FileServer({dir: testDir})
	// let url = server.listen().then(port => {
	// 	return `http://${server.host}:${port}/`
	// })

	// after(done => {
	// 	server.destroy().then(() => done())
	// })

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
		xit('', done => {
			done()
		})
	})

	describe('#screenshot', () => {
		xit('scales the website to the right height', done => {
			// let nightmare = new Nightmare({ show: false })
			// url.then(href => {
			// 	return screenshot({nightmare, url: url.resolve(href, 'scales/index.html'), width, height})
			// })
			done()
		})

		xit('marks if the width/height has overflown its boundry', done => {
			done()
		})
	})

	xdescribe('#take', () => {
		it('', done => {
			done()
		})
	})

	xdescribe('#screenshotSitemap', () => {
		it('', done => {
			done()
		})
	})
})

