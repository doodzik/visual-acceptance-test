// TODO to async/await

function build() {
  // TODO build
}

const staticDir = path.resolve("./to-build-dir")
let server = new FileServer({dir: staticDir})
server.listen().then(() => {


  build()
  // TODO
  let sitemap = browser.url({ host: server.host, port: server.port, path: "sitemap.xml" })

  let urls = await browser.urlsFromSitemap({sitemap: sitemap})
  await browser.take({dir: oldDir, urls})

  time.past()
  build()
  let urls = await browser.sitemap({url}).urls
  await browser.take({dir: newDir, urls})

  time.now()
  await snapshot.diff({destination: diffDir, old: oldDir, new: newDir})
  confirmation.browser({dir: result})

  server.destroy()

})
