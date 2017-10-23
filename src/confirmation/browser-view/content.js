const {ul, div, img, xid, li, input} = require('javascript-html-tags')

const hashCode = function(str) {
  var hash = 0, i, chr, len;
  if (str.length === 0) return hash;
  for (i = 0, len = str.length; i < len; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

function testCases(elements, index = '') {
  return (typeof elements === 'undefined' || elements.length === 0) ?
    '' : ul({class: 'center'}, ...elements.map((elm, _i) => testCase(elm, index + '-' +_i)))
}

function testCase(element, index) {
  function contentOpts() {
    const id = +hashCode(element.path)
    const contentOpts = {id}
    if (element.isEqual) {
      contentOpts.class = `container success-content body${index}`
    }
    else {
      contentOpts.class = `container body${index}`
    }
    return contentOpts
  }

  function container() {
    return xid(div(contentOpts(element),
               div(element.path),
               images(element)),
               testCases(element.children, index))
  }

  function displayName() {
    return `${element.name} - ${element.delta}%`
  }

  function display() {
    const klass = (element.isEqual) ? 'success' : 'failure'
    return div({
      class : klass + ` header${index}`,
      onclick : `toggleVisibility('${+hashCode(element.path)}')`
    },
                displayName(element)
            )
  }

  function imageOpt(alt, src) {
    return {class : 'small-img', onclick : 'toggleMaxWidth(this)', alt, src}
  }

  function images() {
    return xid(img(imageOpt('diff', element.diffPngPath)),
               img(imageOpt('expected', element.expectedPngPath)),
               img(imageOpt('actual', element.actualPngPath))
            )
  }

  return li({class: `case${index}`},
            display(),
            container())
}

const actions = div(input({type: "button", value:"reject", onclick: "reject();"}),
                    input({type: "button", value:"reject", onclick: "reject();"}))

module.exports = {
  testCase,
  testCases,
  actions,
}
