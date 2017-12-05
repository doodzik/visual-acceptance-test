/*eslint no-console: "warn"*/

const simpleGit = require('simple-git/promise')
const shell     = require('shelljs')

// there is a bug with simple-git in the integration.
// check prior state of this file for the simple-git implementation
class LastCommit {

	constructor(workingDirPath) {
		this.git = simpleGit(workingDirPath)
		this.pastCommit = null
		this.checkout = true
	}

	// make stash and change to last commit
	past () {
		return new Promise((resolve, reject) => {
			shell.exec('git status -s', (_code, stdout) => {
				this.checkout = stdout.length == 0
				return this.git.stash(['--all']).then(() => {
					if (!this.checkout) {
						shell.exec('git rev-parse HEAD', function(_code, stdout) {
							resolve(stdout.replace(/(\r\n|\n|\r)/gm,''))
						})
					} else {
						shell.exec('git log --branches -1 --skip 1 --pretty="%H"', function(code, stdout, stderr) {
							if (stderr) {
								return reject(new Error(code + ' ' + stderr))
							}
							resolve(stdout.replace(/(\r\n|\n|\r)/gm,''))
						})
					}
				})
			})
		})
			.then(commit => {
				this.pastCommit = commit
				return new Promise((resolve, reject) => {
					if (!this.checkout) {
						return resolve()
					}
					shell.exec('git checkout ' + commit, function(code, stdout, stderr) {
						if (stderr) {
							console.log(code, stderr, reject)
							// return reject(new Error(code + ' ' + stderr))
						}
						resolve()
					})
				})
			})
	}

	// change to head and apply stash
	now () {
		const cmd = (this.checkout) ? 'git clean -fdx -e .visual-acceptance-test && git checkout . && git checkout - && git stash pop' : 'git reset --hard && git clean -fdx -e .visual-acceptance-test && git stash pop'

		return new Promise(function(resolve, reject) {
			shell.exec(cmd, function(code, stdout, stderr) {
				if (stderr) {
					console.log(code, stderr, reject)
					// return reject(new Error(code + ' ' + stderr))
				}
				resolve()
			})
		})
	}
}

module.exports = LastCommit

