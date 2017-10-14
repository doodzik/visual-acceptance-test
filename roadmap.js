// TODO to async/await

function build() {
  // TODO build
}

const staticDir = path.resolve('./to-build-dir')
let server = new FileServer({dir: staticDir})
server.listen().then(() => {

  build()
  let sitemap = browser.href({ host: server.host, port: server.port, path: 'sitemap.xml' })

  let urls = await browser.urlsFrom({sitemap})
  // TODO
  await browser.take({dir: oldDir, urls, dimensions: ['1080w', '720w']})

  time.past()
  build()
  let urls = await browser.urlsFrom({sitemap})
  await browser.take({dir: newDir, urls, dimensions: ['1080w', '720w']})

  time.now()
  await snapshot.diff({destination: diffDir, old: oldDir, new: newDir})
  confirmation.browser({dir: result})

  server.destroy()

})
