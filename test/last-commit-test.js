const assert     = require('assert')
const path       = require('path')
const fs         = require('fs-extra')
const Time       = require('../src/time/last-commit')

const testDir    = path.resolve('./test/time-test-dir-last-commit/')

var time       
var git

describe('Time', function() {
	// This works in integration but not in this test anymore
	// the reason is the usage of the shell directly
	xdescribe('Last Commit', function() {

		const first  = path.resolve(testDir,  'first.md')
		const second = path.resolve(testDir,  'second.md')
		const third  = path.resolve(testDir,  'third.md')
		const fourth = path.resolve(testDir,  'fourth.md')
		const fifth  = path.resolve(testDir,  'fifth.md')

		before(done => {
			fs.mkdir(testDir)
				.then(() => {
					git  = require('simple-git/promise')(testDir)
					time = new Time(testDir) 
					return git.init()
				})
				.then(() => fs.writeFile(first, 'test1'))
				.then(() => git.add(['--all'])) 
				.then(() => git.commit('first commit')) 

				.then(() => fs.writeFile(second, 'test2'))
				.then(() => git.add(['--all'])) 
				.then(() => git.commit('second commit')) 

				.then(() => fs.writeFile(third, 'test3'))
				.then(() => git.add(['--all'])) 
				.then(() => git.commit('third commit')) 
				.then(() => {
					return Promise.all([
						fs.writeFile(second, 'test22'),
						fs.writeFile(third,  'test33'),
						fs.writeFile(fourth, 'test44'),
						fs.writeFile(fifth,  'test55'),
					])
				})
				.then(() => done())
		})

		after(done => {
			fs.remove(testDir).then(() => done())
		})

		describe('#past & #now', () => {
			it('test', done => {
				git.add([second, fourth])
					.then(() => {
						return time.past()
					})
					.then(() => {
						function exists (pathh) {
							return fs.stat(pathh)
								.then(() => assert.ok(false))
								.catch(() => assert.ok(true))
						}
						const foo1 = fs.readFile(second).then(data => assert.equal(data.toString('utf8'), 'test2'))
						return Promise.all([exists(fifth), exists(fourth), exists(third), foo1])
					})
					.then(() => time.now())
					.then(() => {
						return Promise.all([
							fs.readFile(second).then(data => assert.equal(data.toString('utf8'), 'test22')),
							fs.readFile(third).then(data => assert.equal(data.toString('utf8'), 'test33')),
							fs.readFile(fourth).then(data => assert.equal(data.toString('utf8'), 'test44')),
							fs.readFile(fifth).then(data => assert.equal(data.toString('utf8'), 'test55')),
						])
					})
					.then(() => done())
					.catch(done)
			})
		})
	})
})


