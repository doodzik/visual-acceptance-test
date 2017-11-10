let path   = require('path')
let assert = require('assert')
let fs     = require('fs-extra')

const {diffImageStat, diffImage} = require('../src/imageDiff')

let testDir = path.resolve('./test/imageDiff-test-dir/')

describe('diffImage', function() {
  
	after(done => {
		Promise.all([
			fs.remove(path.resolve(testDir, 'diffImage', 'diff', 'base.png')),
		]).then(() => done())
	})

	describe('#diffImage', () => {
		it('test', done => {
			const pastPath    = path.resolve(testDir, 'diffImage', 'past')
			const currentPath = path.resolve(testDir, 'diffImage', 'current')
			const diffPath = path.resolve(testDir,    'diffImage', 'diff')
			const filename = 'base.png'
			diffImage({diffPath, pastPath, currentPath, filename, threshhold: 5}).then(stat => {
				assert.deepEqual({ 
					total: 40000, differences: 22500, delta: 56.25, isEqual: false,
					expectedPngPath: path.resolve(pastPath, 'base.png'),
					actualPngPath: path.resolve(currentPath,'base.png'),
					diffPngPath: path.resolve(diffPath, 'base.png'),
					children: [],
				}, stat)

				diffImageStat({
					pastPath:    path.resolve(testDir, 'diffImage', 'result.png'), 
					currentPath: path.resolve(testDir, 'diffImage', 'diff', 'base.png'), threshhold: 0.01
				}).then(stat => {
					assert.deepEqual({ total: 40000, differences: 0, delta: 0, isEqual: true }, stat)
					done()
				})
			})
		})
	})

	describe('#diffImageStat', () => {
		it('is different', done => {
			const pastPath = path.resolve(testDir, 'black.png')
			const currentPath = path.resolve(testDir, 'white-black.png')
			diffImageStat({pastPath, currentPath, threshhold: 0.01})
				.then(stat => {
					assert.deepEqual({ total: 40000, differences: 22500, delta: 56.25, isEqual: false }, stat)
					done()
				})
		})
	})
})



