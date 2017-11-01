const FileServer   = require('serve-dir')
const browser      = require('./src/browser')
const Time         = require('./src/time/index')
const diff         = require('./src/diff')
const confirmation = require('./src/confirmation/index')

module.exports = {
	FileServer,
	browser,
	Time,
	diff,
	confirmation,
}

