// TODO to async/await

const Browser   = require('./src/browser')
const browser   = new Browser()

const PSD       = require('./src/psd')
const psd       = new PSD()

const FileServer = require('./src/file-server')
const staticDir = path.resolve('./to-build-dir')
const server    = new FileServer({dir: staticDir})

const Time      = require('./src/last-commit')
const time      = new Time(__dirname)

const fs = require('fs-extra')
const path = require('path')

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
             fs.remove(pathTo('HEAD'),
             fs.remove(pathTo('PSD'),
             fs.remove(pathTo('DIFF'),
            ])
.then(() => psd.toPNG({psdPath, dir: pathTo('PSD')}))
.then(dimensions => {
  let sitemap = browser.href({ host: server.host, port: server.port, path: 'sitemap.xml' })
  let dir = pathTo('HEAD')
  return browser.urlsFrom({sitemap}).then(urls => browser.take({dir, urls, dimensions}))
})
// TODO
.then(() => {
  return image.diff({
                      destination: pathTo('DIFF'),
                      past:        pathTo(time.pastCommit),
                      current:     pathTo('HEAD'),
                   })
})
// TODO
.then(() => confirmation.browser({dir: pathTo('DIFF')}))
.then(server.destroy)

