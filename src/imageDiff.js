const path      = require('path')
const PNG = require('pngjs').PNG
const fs = require('fs-extra')
const Promise = require('bluebird')

function diffImage ({destination, past, current, file, threshhold = 5}) {
  const diffPath    = path.resolve(destination, file)
  const pastPath    = path.resolve(past, file)
  const currentPath = path.resolve(current, file)

  return evalPNGs(pastPath, currentPath, diffPath)
          .spread((png1, png2) => analyzePNGs(png1, png2, threshhold))
          .then(stat => {
            stat.expectedPngPath = pastPath
            stat.actualPngPath   = currentPath
            stat.diffPngPath     = diffPath
            return stat
          })
          .then(writeResult)
}

function readPNG(path) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path)
      .pipe(new PNG({
        filterType: 4
      }))
      .on('error', function(){ 
        reject()
      })
      .on('parsed', function() {
        resolve(this)
      })
  })
  .catch(() => { return {} })
}

function emptyPNG ({height, width}) {
  return  new PNG({
    filterType: 4,
    width:  width,
    height: height
  })
}

function evalPNGs (pathA, pathB, destination) {
  return Promise.all([readPNG(pathA), readPNG(pathB)]).spread((png1, png2) => {
    if (Object.keys(png1).length === 0 && obj.constructor === Object) {
      const p1 = emptyPNG(png2)
      return [p1, png2]
    }
    else if (Object.keys(png2).length === 0 && obj.constructor === Object) {
      const p2 = emptyPNG(png1)
      return [png1, p2]
    }
    return [p1, png2]
  })
}

function analyzePNGs (png1, png2, threshhold) {
    const stat = diffAnalyze(png1, png2, threshhold)
    const png = evalImages(png1, png2)

    return {png, stat}
}

function writeResult({png, stat}){
    writePNG(png, destination).then(() => stat)
}

function diffAnalyze(imgA, imgB, threshhold) {
  var stats = { total: 0, differences: 0 }
  for (var i = 0; i < imgA.data.length; i++) {
    stats.total++
    if (imgA.data[i] !== imgB.data[i]) stats.differences++
  }
  stats.delta = 100 * (1 - (stats.differences/stats.total))
  stats.isEqual = stats.delta < threshhold
  return stats
}

function evalImages (imgA, imgB) {
  const height = imgA.height > imgB.height ? imgA.height : imgB.height
  const width  = imgA.width > imgB.width   ? imgA.width  : imgB.width
  var png = emptyPNG({width, height})

  for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
      var idx = (png.width * y + x) << 2;

      if (
        imgA.data[idx  ] !== imgB.data[idx  ] ||
        imgA.data[idx+1] !== imgB.data[idx+1] ||
        imgA.data[idx+2] !== imgB.data[idx+2] ||
        imgA.data[idx+3] !== imgB.data[idx+3]
      ) {
        // color
        png.data[idx  ] = 0xff;
        png.data[idx+1] = (imgA.data[idx+1] + imgB.data[idx+1])/5;
        png.data[idx+2] = (imgA.data[idx+2] + imgB.data[idx+2])/5;

        // opacity
        png.data[idx+3] = 0xff;
      }
      else {
        // color
        png.data[idx  ] = imgA.data[idx  ];
        png.data[idx+1] = imgA.data[idx+1];
        png.data[idx+2] = imgA.data[idx+2];

        // opacity
        png.data[idx+3] = imgA.data[idx+3]/3;
      }
    }
  }
  return png
}

function writePNG(png, path) {
  let file = fs.createWriteStream(path)
  let stream = png.pack().pipe()
  return new Promise((resolve, reject) => stream.on('finish', resolve))
}

module.exports = diffImage

