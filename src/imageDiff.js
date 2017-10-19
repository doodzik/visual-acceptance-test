const path      = require('path')

function diffImage ({destination, past, current, file}) {
  const diffPath    = path.resolve(destination, file)
  const pastPath    = path.resolve(past, file)
  const currentPath = path.resolve(current, file)

  // TODO
}

module.exports = diffImage

