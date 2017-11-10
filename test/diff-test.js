let path   = require('path')
let assert = require('assert')
let fs     = require('fs-extra')

const {diff} = require('../src/diff')

let testDir = path.resolve('./test/diff-test-dir/')

describe('diff', function() {
  
	after(done => {
		Promise.all([
			fs.remove(path.resolve(testDir, 'diff')),
		]).then(() => done())
	})

	describe('diff', () => {
		it('computes the right results', done => {
			const diffPath = path.resolve(testDir, 'diff')
			const pastPath = path.resolve(testDir, 'past')
			const currentPath = path.resolve(testDir, 'current')
			diff({diffPath, pastPath, currentPath}).then(res => {

				const expected = [ 
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(pastPath, 'black.png'),
						actualPngPath:   path.resolve(currentPath, 'black.png'),
						diffPngPath:     path.resolve(diffPath, 'black.png'),
						children: [] },
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(pastPath, 'three/black.png'),
						actualPngPath:   path.resolve(currentPath, 'three/black.png'),
						diffPngPath:     path.resolve(diffPath, 'three/black.png'),
						children: [] },
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(pastPath, 'one/one-one/black.png'),
						actualPngPath:   path.resolve(currentPath, 'one/one-one/black.png'),
						diffPngPath:     path.resolve(diffPath, 'one/one-one/black.png'),
						children: [] },
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(pastPath, 'two/two-two/two-two-two/black.png'),
						actualPngPath:   path.resolve(currentPath, 'two/two-two/two-two-two/black.png'),
						diffPngPath:     path.resolve(diffPath, 'two/two-two/two-two-two/black.png'),
						children: [] },
					{ total: 40000,
						differences: 40000,
						delta: 100,
						isEqual: false,
						expectedPngPath: path.resolve(pastPath, 'one/black.png'),
						actualPngPath:   path.resolve(currentPath, 'one/black.png'),
						diffPngPath:     path.resolve(diffPath, 'one/black.png'),
						children: [] } 
				]

				assert.deepEqual(res, expected)
				done()
			})
		})
	})
})


