/*eslint no-console: "warn"*/

const simpleGit = require('simple-git/promise')
const shell     = require('shelljs')

class LastCommit {

	constructor(workingDirPath) {
		this.git = simpleGit(workingDirPath)
		this.pastCommit = null
	}

	// make stash and change to last commit
	past () {
		// TODO if dirty then HEAD(added behaviour) else previous commit(current behaviour)
		return this.git.stash(['--all']).then(() => {
			return new Promise(function(resolve, reject) {
				// there is a bug with simple-git in the integration.
				// check prior state of this file for the simple-git implementation
				shell.exec('git log --branches -1 --skip 1 --pretty="%H"', function(code, stdout, stderr) {
					if (stderr) {
						return reject(new Error(code + ' ' + stderr))
					}
					resolve(stdout)
				})
			})
		})
			.then(commit => {
				this.pastCommit = commit
				return new Promise(function(resolve, reject) {
					shell.exec('git checkout ' + commit, function(code, stdout, stderr) {
						if (stderr) {
							console.log(code, stderr, reject)
							// return reject(new Error(code + ' ' + stderr))
						}
						resolve()
					})
				})

				// return this.git.checkout(commit)
			})
	}

	// change to head and apply stash
	now () {
		return new Promise(function(resolve, reject) {
			shell.exec('git checkout . && git checkout - && git stash pop', function(code, stdout, stderr) {
				if (stderr) {
					console.log(code, stderr, reject)
					// return reject(new Error(code + ' ' + stderr))
				}
				resolve()
			})
		})
		// return this.git.checkout('-').then(() => this.git.stash(['pop']))
	}
}

module.exports = LastCommit

