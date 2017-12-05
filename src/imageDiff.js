const path    = require('path')
const PNG     = require('pngjs').PNG
const fs      = require('fs-extra')
const Promise = require('bluebird')

function diffImageNoPersist ({past, current, filename, threshhold = 5}) {
	const pastPath   = path.resolve(past, filename)
	const currentPath = path.resolve(current, filename)
	return diffImageStat({pastPath, currentPath, threshhold}).then(stat => {
		stat.expectedPngPath = pastPath
		stat.actualPngPath   = currentPath
		stat.filename        = filename
		stat.children        = []
		return stat
	})
}

function diffImageStat ({pastPath, currentPath, threshhold = 5}) {
	return evalPNGs(pastPath, currentPath)
		.spread((png1, png2) => diffAnalyze(png1, png2, threshhold))
}

function diffImagePersist ({diffPath, pastPath, currentPath, filename, threshhold = 5}) {
	const diff    = path.resolve(diffPath, filename)
	const past    = path.resolve(pastPath, filename)
	const current = path.resolve(currentPath, filename)

	return evalPNGs(past, current)
		.spread((png1, png2) => analyzePNGs(png1, png2, threshhold))
		.then(data => {
			const {stat} = data
			stat.expectedPngPath = past
			stat.actualPngPath   = current
			stat.diffPngPath     = diff
			stat.path            = diff
			stat.filename        = filename
			stat.children        = []
			data.diffPath = diff
			return data
		})
		.then(writeResult)
}

function readPNG(path) {
	return new Promise((resolve, reject) => {
		fs.createReadStream(path)
			.on('error', reject)
			.pipe(new PNG({
				filterType: 4
			}))
			.on('parsed', function() {
				resolve(this)
			})
	})
		.catch(() => { return false })
}

function emptyPNG ({height, width}) {
	return  new PNG({
		filterType: 4,
		width:  width,
		height: height
	})
}

function evalPNGs (pathA, pathB) {
	return Promise.all([
		readPNG(pathA),
		readPNG(pathB),
	]).spread((png1, png2) => {
		if (png1 === false) {
			const p1 = emptyPNG(png2)
			return [p1, png2]
		}
		else if (png2 === false) {
			const p2 = emptyPNG(png1)
			return [png1, p2]
		}
		return [png1, png2]
	})
}

function analyzePNGs (png1, png2, threshhold) {
	const stat = diffAnalyze(png1, png2, threshhold)
	const png = evalImages(png1, png2)

	return {png, stat}
}

function writeResult({png, stat, diffPath}) {
	const diffDir = path.dirname(diffPath)
	return fs.ensureDir(diffDir).then(() => {
		return writePNG(png, diffPath)
	}).then(() => stat)
}

function diffAnalyze(imgA, imgB, threshhold) {
	var stats = { total: 0, differences: 0 }
	for (var i = 0; i < imgA.data.length; i++) {
		stats.total++
		if (imgA.data[i] !== imgB.data[i]) stats.differences++
	}
	stats.delta   = 100 * (stats.differences/stats.total)
	stats.isEqual = stats.delta < threshhold
	return stats
}

function evalImages (imgA, imgB) {
	const height = imgA.height > imgB.height ? imgA.height : imgB.height
	const width  = imgA.width > imgB.width   ? imgA.width  : imgB.width
	var png = emptyPNG({width, height})

	for (var y = 0; y < png.height; y++) {
		for (var x = 0; x < png.width; x++) {
			var idx = (png.width * y + x) << 2

			if (
				imgA.data[idx  ] !== imgB.data[idx  ] ||
        imgA.data[idx+1] !== imgB.data[idx+1] ||
        imgA.data[idx+2] !== imgB.data[idx+2] ||
        imgA.data[idx+3] !== imgB.data[idx+3]
			) {
				// color
				png.data[idx  ] = 0xff
				png.data[idx+1] = (imgA.data[idx+1] + imgB.data[idx+1])/5
				png.data[idx+2] = (imgA.data[idx+2] + imgB.data[idx+2])/5

				// opacity
				png.data[idx+3] = 0xff
			}
			else {
				// color
				png.data[idx  ] = imgA.data[idx  ]
				png.data[idx+1] = imgA.data[idx+1]
				png.data[idx+2] = imgA.data[idx+2]

				// opacity
				png.data[idx+3] = imgA.data[idx+3]/3
			}
		}
	}
	return png
}

function writePNG(png, path) {
	let file = fs.createWriteStream(path)
	let stream = png.pack().pipe(file)
	return new Promise((resolve, reject) => {
		stream.on('error', reject)
		stream.on('finish', resolve)
	})
}

module.exports = { diffImagePersist, diffImageStat, diffImageNoPersist }

