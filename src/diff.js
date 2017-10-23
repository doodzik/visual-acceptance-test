const diffImage = require('./imageDiff')
const klaw = require('klaw')

function walk (dir) {
  const length = dir.length
  const items = new Set()
  return new Promise((resolve, reject) => {
    klaw(dir)
      .on('data', item => {
        items.add(item.path.slice(length)) 
      })
      .on('end', () => resolve(items)) 
  })
}

function diff ({destination, past, current, threshhold}) {
  return Promise.all([walk(past), walk(current)])
  .then(res => {
    const [pastFiles, currentFiles] = res
    const files = Array.from(new Set([...pastFiles, ...currentFiles]))
    return Promise.all(files.map(file => diffImage({destination, past, current, file, threshhold})))
  })
  // TODO nest results & add name and path key -> children
  .then(results => results)
}

module.exports = diff

