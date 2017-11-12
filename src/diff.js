const {diffImagePersist, diffImageNoPersist} = require('./imageDiff')
const klaw = require('klaw')

function walk (dir) {
	const length = dir.length
	const items = new Set()
	return new Promise((resolve, reject) => {
		klaw(dir)
			.on('data', item => {
				if (item.path.endsWith('.png')) {
					// + 1 so we get rid of the / which causes issues with path.resolve
					items.add(item.path.slice(length + 1)) 
				}
			})
			.on('error', reject)
			.on('end', () => resolve(items)) 
	})
}

function diff ({diff, expected, actual, persistDiff = true, threshhold = 5}) {
	return Promise.all([walk(expected), walk(actual)])
		.then(res => {
			const [pastFiles, currentFiles] = res
			const files = Array.from(new Set([...pastFiles, ...currentFiles]))
			return Promise.all(files.map(filename => {
				if (persistDiff) {
					return diffImagePersist({diffPath: diff, pastPath: expected, currentPath: actual, filename, threshhold})
				} else {
					return diffImageNoPersist({pastPath: expected, currentPath: actual, filename, threshhold})
				}
			}))
		})
	// TODO nest results & add name and path key -> children
	// .then(results => results)
}

module.exports = {
	diff,
}

