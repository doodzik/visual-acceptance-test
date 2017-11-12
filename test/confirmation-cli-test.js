let assert = require('assert')

const confirmation = require('../src/confirmation/cli')

describe('confirmation', function() {
	describe('cli', () => {
		it('when unequal returns false', () => {
			const result = [
				{ delta: 0,
					isEqual: true,
					path:     'black.png',
					children: [] },
				{ delta: 0,
					isEqual: true,
					path:     'three/black.png',
					children: [] },
				{ delta: 0,
					isEqual: true,
					path:     'one/black.png',
					children: [
						{ delta: 100,
							isEqual: false,
							path:     'one/one-one/black.png',
							children: [] },
					]
				},
				{ delta: 0,
					isEqual: true,
					path:     'two/two-two/two-two-two/black.png',
					children: [] },
			]

			assert.equal(confirmation({result}), 1)
		})

		it('when unequal returns true', () => {
			const result = [
				{ delta: 0,
					isEqual: true,
					path:     'black.png',
					children: [] },
				{ delta: 0,
					isEqual: true,
					path:     'three/black.png',
					children: [] },
				{ delta: 0,
					isEqual: true,
					path:     'one/black.png',
					children: [
						{ delta: 0,
							isEqual: true,
							path:     'one/one-one/black.png',
							children: [] },
					]
				},
				{ delta: 0,
					isEqual: true,
					path:     'two/two-two/two-two-two/black.png',
					children: [] },
			]

			assert.equal(confirmation({result}), 0)
		})
	})
})

