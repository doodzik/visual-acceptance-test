const simpleGit = require('simple-git/promise')

class LastCommit {

	constructor(workingDirPath) {
		this.git = simpleGit(workingDirPath)
		this.pastCommit = null
	}

	// make stash and change to last commit
	past () {
		return this.git.stash(['--all']).then(() => {
			return this.git.log([
				'--branches', '-1',
				'--skip', '1',
				'--pretty=format"%H"',
			])
		})
			.then(commit => {
				const commitHashPre = commit.latest.hash
				const commitHashPre2 = commitHashPre.substring(0, commitHashPre.length - 1)
				const commitHash = commitHashPre2.substring(commitHashPre2.indexOf('"') + 1) 
				this.pastCommit = commitHash
				return this.git.checkout(commitHash)
			})
	}

	// change to head and apply stash
	now () {
		return this.git.checkout('-').then(() => this.git.stash(['pop']))
	}
}

module.exports = LastCommit

