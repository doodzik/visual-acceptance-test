let http          = require("http")
let enableDestroy = require('server-destroy')
let listen        = require('listen-random-port')
let express       = require('express')
let openurl       = require("openurl").open

function destroy (server) {
  return new Promise((resolve, reject) => {
    server.destroy((err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve()
    })
  })
}

function confirmationBrowser({result, from = 1000, to = 9000, host = '127.0.0.1'}) {
  return new Promise((resolve, reject) => {
    const app = express()
    var server

    app.get('/', (req, res) => {
      // TODO create webpage
    })

    app.post('/reject', (req, res) => {
      res.send('reject')
      destroy(server).then(reject)
    })

    app.post('/accept', (req, res) => {
      res.send('accept')
      destroy(server).then(resolve)
    })

    server = http.createServer(app)
    enableDestroy(server)

    listen(server, { from, to, host }, (err, port) => {
      if (err) { console.log(err) }
      let url = "http://" + host + ":" + port
      console.log("Confirmation Page at " + url)
      openurl(url)
    })
  })
}

module.exports = confirmationBrowser

