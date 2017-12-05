const { URL }   = require('url') 
const Nightmare = require('nightmare')
const path      = require('path')
const Promise   = require('bluebird')
const fs        = require('fs-extra')

const {extractURLsfrom, constructURL} = require('./url-extra')

function _defaultIntValue (value, valueToAssign) {
	const hasValue    = Number.isInteger(value)
	const returnValue = hasValue ? value : valueToAssign
	const prefix      = hasValue ? returnValue.toString() : 'AUTO'

	return { 
		value: returnValue, 
		isDefault: !hasValue, 
		toString() { 
			return prefix 
		} 
	}
}

function _point({height, width}) {
	const x = _defaultIntValue(width, 800)
	const y = _defaultIntValue(height, 600)
	const prefix = `[${x.toString()} ${y.toString()}]`

	return { x, y, toString() { return prefix } }
}

function _toPNGFilename (dir, point, objURL, detail='') {
	// remove first char "/" as it makes path.resolve trip over
	const urlPathname = objURL.pathname.slice(1)
	const urlHostname = objURL.hostname

	const detail2 = (detail.length > 0) ? ' - ' + detail : detail
	const filename = urlPathname.length == 0 ? urlHostname + detail2 + '.png' : urlPathname + '.png'
	const normalizedFilename = path.normalize(filename)

	const filepath = path.resolve(dir, point.toString())
	const fullpath = path.resolve(filepath, normalizedFilename)
  
	return { 
		dir: path.dirname(fullpath), 
		file: fullpath
	}
}

function getActualWebsiteDimensions () {
	const body = document.querySelector('body')
	const html = document.documentElement

	let height = Math.max( body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight )

	let width  = Math.max( body.scrollWidth, body.offsetWidth,
		html.clientWidth, html.scrollWidth, html.offsetWidth )
	return { height, width }
}

function screenshot({nightmare, url, dir, width, height}) {
	// This should probably called dimension and not point
	const point = _point({height, width})

	return nightmare.viewport(point.x.value, point.y.value)
		.goto(url)
		.wait('body')
		.evaluate(getActualWebsiteDimensions)
		.then(dimension => {
			const file = _toPNGFilename(dir, point, new URL(url))

			return fs.ensureDir(file.dir).then(() => {
				return nightmare.viewport(dimension.width, dimension.height)
					.wait(1000)
					.screenshot(file.file)
			})
		})
}

// pass Nightmare
function dynamicScreenshot(nightmare) {
// {detail: String = '', migrateFrom: {url: String, detail: String =""} = {} ignore }
	nightmare.action('vatScreenshot', function({detail, migrateFrom = {}} , done) {
		const dimensions = JSON.parse(process.env.DIMENSIONS)
		this.evaluate_now(() => {
			dimensions.reduce((self, dim) => {
				return self.dynamicScreenshotSingle({detail, migrateFrom, height: dim.height, width: dim.width})
			}, this)
		}, done)
	})
}


// pass Nightmare
function dynamicScreenshotSingle(nightmare) {
// {detail: String = '', migrateFrom: {url: String, detail: String =""} = {} ignore }
	nightmare.action('vatScreenshotDimensions', function({detail, migrateFrom = {}, height, width} , done) {

		const point = _point({height, width})

		this.wait('body')
			.evaluate(getActualWebsiteDimensions)
			.evaluate(function(dimension) {
				const url = migrateFrom.url || document.querySelector('#url').href
				const detail2 = migrateFrom.detail || detail
				return {url, detail: detail2, dimension}
			})
			.then(data => {
				const file = _toPNGFilename(process.env.VAT_DIR, point, new URL(data.url), data.detail)
				fs.ensureDir(file.dir).then(() => {
					return this.viewport(data.dimension.width, data.dimension.height)
						.wait(1000)
						.screenshot(file.file)
						.evaluate_now(() => {
						}, done)
				})
			})
	})
}

// expected dimensions, can be different when rendered [{height: 600, width: 800}]
function take({dir, urls, dimensions = [{}], 
	screenshotFn=screenshot, nightmare=new Nightmare({ show: false, frame: false, useContentSize: true})}) {
	return Promise.each(dimensions, dimension => {
		const { width, height } = dimension
		return Promise.each(urls, url => screenshotFn({dir, url, width, height, nightmare}))
	}).then(() => nightmare.end())
}

function screenshotSitemap({server, dir, dimensions, takeFn=take}) {
	let sitemap = constructURL({ hostname: server.host, port: server.port, path: 'sitemap.xml' })
	return extractURLsfrom({sitemap}).then(urls => {
		return takeFn({dir, urls, dimensions})
	})
}

module.exports = {take, screenshotSitemap, screenshot, _defaultIntValue, getActualWebsiteDimensions, _point, _toPNGFilename, dynamicScreenshot, dynamicScreenshotSingle}

