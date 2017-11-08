/*eslint no-console: "warn"*/

function confirmationCli({result}) {
	return testCase(result)
}

function testCase(element) {
	const error = element.children.map(testCase) || false
	if (!element.isEqual) {
		console.log(`${element.delta}% ${element.path} - ${element.name}`)
		return true
	}
	return error
}

module.exports = confirmationCli

