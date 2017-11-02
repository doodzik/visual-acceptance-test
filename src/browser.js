const { URL }   = require('url') 
const Nightmare = require('nightmare')
const path      = require('path')
const Promise   = require('bluebird')
const fs        = require('fs-extra')

const {extractURLsfrom, constructURL} = require('./url-extra')

// expected dimensions, can be different when rendered [{height: 600, width: 800}]
function take({dir, urls, dimensions = [{}]}) {
	var nightmare = new Nightmare({ show: false })

	return Promise.each(dimensions, dimension => {
		const { width, height } = dimension
		return Promise.each(urls, url => {
			return screenshot({nightmare, dir, url, width, height})
		})
	}).then(() => nightmare.end())
}

function screenshot({nightmare, url, dir, width, height}) {
	const hasHeight = Number.isInteger(height)
	const hasWidth  = Number.isInteger(width)

	const height2 = hasHeight ? height : 600
	const width2  = hasWidth  ? width  : 800

	return nightmare.viewport(width2, height2).goto(url).wait('body').evaluate(() => {
		const body = document.querySelector('body')
		const html = document.documentElement

		let height = Math.max( body.scrollHeight, body.offsetHeight,
			html.clientHeight, html.scrollHeight, html.offsetHeight )

		let width  = Math.max( body.scrollWidth, body.offsetWidth,
			html.clientWidth, html.scrollWidth, html.offsetWidth )
		return { height, width }
	})
		.then(dimension => {
			const objURL  = new URL(url)
			const urlPathname = objURL.pathname
			const urlHostname = objURL.hostname

			var prefix  = hasWidth  ? width2.toString()  : 'AUTO'
			prefix     += 'x'
			prefix     += hasHeight ? height2.toString() : 'AUTO'

			const filename = urlPathname.length == 0 ? urlHostname + '.png' : urlPathname + '.png' 
			const filepath = path.join(dir, prefix)
			const fullpath = path.join(filepath, filename)

			return fs.ensureDir(filepath).then(() => {
				return nightmare.viewport(dimension.width, dimension.height)
					.wait(1000)
					.screenshot(fullpath)
			})
		})
}

function screenshotSitemap({server, dir, dimensions}) {
	let sitemap = constructURL({ host: server.host, port: server.port, path: 'sitemap.xml' })

	return extractURLsfrom({sitemap}).then(urls => {
		return take({dir, urls, dimensions})
	})
}

module.exports = {take, screenshotSitemap, screenshot}

