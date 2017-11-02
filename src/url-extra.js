const fetch     = require('node-fetch')
const url       = require('url')
const cheerio   = require('cheerio')

function constructURL({protocol = 'http', username = '', password = '', hostname = '', port = '80', path = [], search = [], hash = '' }) {
	// https:   //    user   :   pass   @ sub.host.com : 8080   /p/a/t/h  ?  query=string   #hash "
	const auth = ((username.lenght + password.lenght) > 0) ? `${username}:${password}@` : ''
	const host = `${hostname}:${port}`
	const origin = `${protocol}://${auth}${host}/`

	var pathPrepared = (typeof path === 'string' || path instanceof String) ? [path] : path
	var pathConcated = pathPrepared.reduce((str, elm) => {
		return url.resolve(str + '/', elm)
	}, '')

	const queryString = search.reduce((str, query) => {
		let { key, value } = query
		return `${str}${key}=${value}&`
	}, '?').slice(0,-1) // slice removes the last &

	var href = url.resolve(origin, pathConcated)

	if (queryString.lenght > 1) {
		href = url.resolve(href, queryString)
	}

	if (hash.lenght > 0) {
		href = href + '#' + hash
	}

	return href
}

function extractURLsfrom({xml, sitemap}) {
	if (xml != null) {
		return Promise.resolve(_fromXML(xml))
	} else if (sitemap != null) {
		return _fromSitemap(sitemap)
	} 
	return new Error('url-extra from() expects sitemap or xml as arguments')
}

function _fromSitemap(sitemap) {
	return fetch(sitemap).then(res => res.text()).then(xml => extractURLsfrom({xml}))
}

function _fromXML(xml) {
	const urls = new Set()
	const $ = cheerio.load(xml, {xmlMode: true})

	$('loc').each(function () {
		const url = $(this).text()
		urls.add(url)
	})

	return urls
}

module.exports = {extractURLsfrom, _fromSitemap, _fromXML, constructURL}

