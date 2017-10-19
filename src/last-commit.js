const simpleGit = require('simple-git')

class LastCommit {

  constructor(workingDirPath) {
    this.git = simpleGit(workingDirPath)
    this.pastCommit = null
  }

  // make stash and change to last commit
  past () {
    return this.git.stash(['--all'])
      .then(() => {
         return this.git.log([
                              '--branches -1',
                              '--skip 1',
                              '--pretty=format "%H"',
                             ])
      })
      .then(commit => {
        this.pastCommit = commit
        this.git.checkout(commit)
      })
  }

  // change to head and apply stash
  now () {
    return this.git.checkout('-')
      .then(() => this.git.stash(['pop "stash@{0}"']))
  }
}

module.exports = LastCommit

