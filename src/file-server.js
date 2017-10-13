let http          = require("http")
let url           = require("url")
let path          = require("path")
let fs            = require("fs")
let enableDestroy = require('server-destroy')
let listen        = require('listen-random-port')
let staticFiles   = require('node-static')

class FileServer {
  constructor({dir, from = 1000, to = 9000, host = '127.0.0.1'}) {
    this.dir = dir
    this.from = from
    this.to = to
    this.host = host
    var fileServer = new staticFiles.Server(dir)

    this.server = http.createServer(function(request, response) {
      request.addListener('end', function () {
          fileServer.serve(request, response)
      }).resume()
    })

    enableDestroy(this.server)
  }


  listen() {
    return new Promise((resolve, reject) => {
      listen(this.server, { from: this.from, to: this.to, host: this.host }, (err, port) => {
        if (err) {
          return reject(err)
        }
        this.port = port
        return resolve(port)
      })
    })
  }

  destroy() {
    return new Promise((resolve, reject) => {
      this.server.destroy((err, res) => {
        if (err) {
          return reject(err)
        }
        return resolve()
      })
    })
  }
}

module.exports = FileServer

