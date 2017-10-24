const url       = require("url")
const { URL }   = url
const cheerio   = require('cheerio')
const fetch     = require('node-fetch')
const Nightmare = require('nightmare')
const path      = require('path')
const Promise   = require('bluebird')
const fs        = require('fs-extra')

class Browser {

  href({protocol = 'http', username = '', password = '', hostname = '', port = '80', path = [], search = [], hash = '' }) {
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

  urlsFrom({sitemap}) {
    return fetch(sitemap).then(res => res.text()).then(xml => this.extractUrlsFrom({xml}))
  }

  extractUrlsFrom({xml}) {
    const urls = new Set()
    const $ = cheerio.load(xml, {xmlMode: true})

    $('loc').each(function () {
      const url = $(this).text()
      urls.add(url)
    })

    return urls
  }

  // expected dimensions, can be different when rendered [{height: 600, width: 800}]
  take({dir, urls, dimensions = [{}]}) {
    var nightmare = new Nightmare({ show: false })

    return Promise.each(dimensions, dimension => {
        const { width, height } = dimension
        return Promise.each(urls, url => {
            return this.screenshot({nightmare, dir, url, width, height})
        })
      }).then(() => nightmare.end())
  }

  screenshot({nightmare, url, dir, width, height}) {
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

  screenshotSitemap({server, dir, dimensions}) {
    let sitemap = this.href({ host: server.host, port: server.port, path: 'sitemap.xml' })

    return this.urlsFrom({sitemap}).then(urls => {
      return this.take({dir, urls, dimensions})
    })
  }

}

module.exports = Browser
