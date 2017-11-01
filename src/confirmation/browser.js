/*eslint no-console: "warn"*/

const http          = require('http')
const enableDestroy = require('server-destroy')
const listen        = require('listen-random-port')
const express       = require('express')
const openurl       = require('openurl').open
const {template}    = require('./browser-view/index')

function destroy (server) {
	return new Promise((resolve, reject) => {
		server.destroy(err => {
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
			const html = template(result)
			res.send(html)
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
			let url = 'http://' + host + ':' + port
			console.log('Confirmation Page at ' + url)
			openurl(url)
		})
	})
}

module.exports = confirmationBrowser

