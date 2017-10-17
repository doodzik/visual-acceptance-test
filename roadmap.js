// TODO to async/await

const Browser   = require('./src/browser')
const browser   = new Browser()
const staticDir = path.resolve('./to-build-dir')
const server    = new FileServer({dir: staticDir})

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


Promise.all([server.listen(), build()])
.then(() => screenshot({server, dir: oldDir}))
// TODO
.then(time.past)
.then(build)
.then(() => screenshot({server, dir: newDir}))
// TODO
.then(time.now)
.then(() => image.diff({destination: diffDir, old: oldDir, new: newDir}))
.then(() => confirmation.browser({dir: diffDir}))
// END TODO
.then(server.destroy)

