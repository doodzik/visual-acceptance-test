let path   = require('path')
let assert = require('assert')
let fs     = require('fs-extra')

const diffFn = require('../src/diff').diff

let testDir = path.resolve('./test/diff-test-dir/')

describe('diff', function() {
  
	after(done => {
		Promise.all([
			fs.remove(path.resolve(testDir, 'diff')),
		]).then(() => done())
	})

	describe('diff', () => {
		it('computes the right results', done => {
			const diff = path.resolve(testDir, 'diff')
			const expected = path.resolve(testDir, 'past')
			const actual = path.resolve(testDir, 'current')
			diffFn({diff, expected, actual}).then(res => {

				const expectedRes = [ 
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(expected, 'black.png'),
						actualPngPath:   path.resolve(actual, 'black.png'),
						diffPngPath:     path.resolve(diff, 'black.png'),
						path:            path.resolve(diff, 'black.png'),
						name:            path.resolve(diff, 'black.png'),
						filename:     'black.png',
						children: [] },
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(expected, 'three/black.png'),
						actualPngPath:   path.resolve(actual, 'three/black.png'),
						diffPngPath:     path.resolve(diff, 'three/black.png'),
						path:            path.resolve(diff, 'three/black.png'),
						name:            path.resolve(diff, 'three/black.png'),
						filename:     'three/black.png',
						children: [] },
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(expected, 'one/one-one/black.png'),
						actualPngPath:   path.resolve(actual, 'one/one-one/black.png'),
						diffPngPath:     path.resolve(diff, 'one/one-one/black.png'),
						path:            path.resolve(diff, 'one/one-one/black.png'),
						name:            path.resolve(diff, 'one/one-one/black.png'),
						filename:     'one/one-one/black.png',
						children: [] },
					{ total: 40000,
						differences: 0,
						delta: 0,
						isEqual: true,
						expectedPngPath: path.resolve(expected, 'two/two-two/two-two-two/black.png'),
						actualPngPath:   path.resolve(actual, 'two/two-two/two-two-two/black.png'),
						diffPngPath:     path.resolve(diff, 'two/two-two/two-two-two/black.png'),
						path:            path.resolve(diff, 'two/two-two/two-two-two/black.png'),
						name:            path.resolve(diff, 'two/two-two/two-two-two/black.png'),
						filename:     'two/two-two/two-two-two/black.png',
						children: [] },
					{ total: 40000,
						differences: 40000,
						delta: 100,
						isEqual: false,
						expectedPngPath: path.resolve(expected, 'one/black.png'),
						actualPngPath:   path.resolve(actual, 'one/black.png'),
						diffPngPath:     path.resolve(diff, 'one/black.png'),
						path:            path.resolve(diff, 'one/black.png'),
						name:            path.resolve(diff, 'one/black.png'),
						filename:     'one/black.png',
						children: [] } 
				]

				assert.deepEqual(res, expectedRes)
				done()
			}).catch(done)
		})
	})
})


