const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')
const groupMatch = /@Export(\("([\w]+)"\))?\n.?(class|object|var|val|fun) ([^\s\(\)]+)/g

function processExports(input) {
	var entries = []

	for (;;) {
  	var match = groupMatch.exec(input)
  	if (!match) break		
		entries[match[2] || match[4]] = `module.exports.${match[4]}`
	}

	// If only one item and it's default, make it the root export
	if (Object.keys(entries).length === 1 && entries['default']) {
		return `module.exports = ${entries['default']}`
	}

	// If @Export is not used, do nothing, otherwise map our entries
	if (Object.keys(entries).length > 0) {
		let body = Object.keys(entries)
			.map( key => `${key}: ${entries[key]}\n` )
			.join(', ')
		return `module.exports = {${body}}`
	}
}

module.exports = async function(source,data) {
	const bridge = path.resolve(__dirname,'bridge.kt')
	fs.writeFileSync(`./${data.sourceRoot}/${data.file}.kt`, `import kloader.bridge.*\n${source}`)
	execSync(`kotlinc-js ${data.sourceRoot}/${data.file}.kt ${bridge} ./src/com -output ${data.sourceRoot}/${data.file}.kt.js -main call -module-kind commonjs`)
	const compiled = fs.readFileSync(`./${data.sourceRoot}/${data.file}.kt.js`, 'utf8')
	fs.unlinkSync(`./${data.sourceRoot}/${data.file}.kt`)
	fs.unlinkSync(`./${data.sourceRoot}/${data.file}.kt.js`)
	this.callback(null, `${compiled}
		${processExports(source)}
	`)
}
