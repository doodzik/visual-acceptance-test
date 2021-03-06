const {html, head, style, body, script} = require('javascript-html-tags')
const cssRules = require('./css')
const {testCases, actions}  = require('./content')
const {toggleMaxWidth, toggleVisibility, accept, reject} = require('./js')

function layout(testCases) {
	return html(head(style(cssRules)),
		body(testCases,
			actions,
			script(toggleMaxWidth, toggleVisibility, accept, reject)
		)
	)
}

function template(elements) {
	return layout(testCases(elements))
}

module.exports = {
	layout,
	template
}

