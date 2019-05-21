const fs = require('fs')
const { execSync } = require('child_process')

module.exports = async function(source,data) {
	fs.writeFileSync(`./${data.sourceRoot}/${data.file}.kt`, source)
	execSync(`kotlinc-js ${data.sourceRoot}/${data.file}.kt ./src/com -output ${data.sourceRoot}/${data.file}.kt.js -main call -module-kind commonjs`)
	const compiled = fs.readFileSync(`./${data.sourceRoot}/${data.file}.kt.js`, 'utf8')
	fs.unlinkSync(`./${data.sourceRoot}/${data.file}.kt`)
	fs.unlinkSync(`./${data.sourceRoot}/${data.file}.kt.js`)
	this.callback(null, `${compiled}
		module.exports = module.exports.export
	`)
}
