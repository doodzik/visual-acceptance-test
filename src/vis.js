/*eslint no-console: "warn"*/

const {exec} = require('./vis-exec')

class VIS {

	constructor(dir) {
		if (dir == null || dir.length == 0) {
			return new Error('vis dir has to be set')
		}
		this.dir          = dir
		this.staticDir    = ''
		this.dimensionsArray = []
	}

	static(staticDir) {
		this.staticDir = staticDir
		return this
	}

	dimensions(dimensions) {
		this.dimensionsArray = dimensions
		return this
	}

	time(timeProtocol) {
		this.timeProtocol = timeProtocol
		return this
	}

	actual(fn) {
		this.actualFn = fn
		return this
	}

	expected(fn) {
		this.expectedFn = fn
		return this
	}

	compare(fn) {
		this.compareFn = fn
		return this
	}

	exec() {
		if (this.dimensionsArray.length == 0) {
			return new Error('vis dimensions has not been set')
		}
		if (this.timeProtocol == null) {
			return new Error('vis time has not been set')
		}
		if (this.actualFn == null) {
			return new Error('vis actual has not been set')
		}
		if (this.expectedFn == null) {
			return new Error('vis expected has not been set')
		}
		if (this.compareFn == null) {
			return new Error('vis compare has not been set')
		}
		return exec(this)
	}
}

module.exports = VIS
