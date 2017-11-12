/*eslint no-console: "warn"*/

function confirmationCli({result}) {
	return testCase({ isEqual: true, children: result})
}

function testCase(element) {
	const error = element.children.map(testCase).reduce((a, b) => { return a+b }, 0)
	if (!element.isEqual) {
		console.log(`${element.delta}% ${element.path}`)
		return error + 1
	}
	return error 
}

module.exports = confirmationCli

