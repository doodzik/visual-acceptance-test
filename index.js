const Time         = require('./src/time/index')
const confirmation = require('./src/confirmation/index')
const browser = require('./src/browser.js')
const FileServer = require('serve-dir')
const diff = require('./src/diff.js').diff

module.exports = {
	Time,
	confirmation,
	browser,
	FileServer,
	diff,
}

