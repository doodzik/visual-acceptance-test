// TODO to async/await http://coffeescript.org/#async-functions

const Browser   = require('./src/browser')
const browser   = new Browser()

const FileServer = require('./src/file-server')
const staticDir = path.resolve('./to-build-dir')
const server    = new FileServer({dir: staticDir})

const diff      = require('./src/diff')

const Time      = require('./src/last-commit')
const time      = new Time(__dirname)

const confirmation = require('./src/confirmation')

const fs = require('fs-extra')
const path = require('path')

function pathTo(dir) {
  return path.resolve(__dirname, '.visual-acceptance-test', dir)
}

function build() {
  // TODO build
  return Promise.resolve()
}

function screenshot({server, dir}) {
  let sitemap = browser.href({ host: server.host, port: server.port, path: 'sitemap.xml' })

  return browser.urlsFrom({sitemap}).then(urls => {
    return browser.take({dir, urls, dimensions: [{width: 1080}, {width: 720}]})
  })
}

Promise.all([
             server.listen(),
             build(),
             fs.remove(pathTo('HEAD'),
             fs.remove(pathTo('DIFF')
            ])
.then(() => screenshot({server, dir: pathTo('HEAD')}))
.then(time.past)
.then(build)
.then(() => screenshot({server, dir: pathTo(time.pastCommit)}))
.then(time.now)
.then(() => {
  return diff({
                destination: pathTo('DIFF'),
                past: pathTo(time.pastCommit),
                current: pathTo('HEAD'),
                threshhold: 5,
              })
})
// TODO
.then(result => confirmation.browser({result}))
.then(server.destroy)

