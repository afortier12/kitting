// This is a demo to showcase desired linting abilities in any framework we may merge later.
// Currently simplicity and performance are strong design goals with this utility.
// Currently all this does is send warnings on the console...
// ... however it would be awesome if some of this could be safely automated to make our lives easier.
let fs = require('fs')
let path = require('path')


// Files to be linted
let cssFiles = fs.readdirSync('css')
let jsFiles = fs.readdirSync('js')
let modules = fs.readdirSync('page_modules')
let vueFiles = []
for(var i in modules){
	let files = fs.readdirSync(path.join('page_modules', modules[i]))
	vueFiles.push(...files.map((file) => { return path.join(modules[i], file)}))
}

var args = process.argv.slice(2)
let nag = false
if(args[0] == "nag"){
	nag = true
}


for(var i in cssFiles){
	let file = path.join('css', cssFiles[i])
	fs.readFile(file, (err, data)=>{
		if(err){
			console.log(err)
			process.exit(1)
		}
		lintCSS(file, data)
		lintAll(file, data)
	})
}

for(var i in jsFiles){
	let file = path.join('js', jsFiles[i])
	fs.readFile(file, (err, data)=>{
		if(err){
			console.log(err)
			process.exit(1)
		}
		if(nag){
			lintNag(file, data)
		}
		lintJS(file, data)
		lintAll(file, data)
	})
}

for(var i in vueFiles){
	let file = path.join('page_modules', vueFiles[i])
	fs.readFile(file, (err, data)=>{
		if(err){
			console.log(err)
			process.exit(1)
		}
		if(nag){
			lintNag(file, data)
		}
		lintAll(file, data)
	})
}

fs.readFile('app.vue', (err, data)=>{
	if(err){
		console.log(err)
		process.exit(1)
	}
	lintAll('app.vue', data)
})

function logRed(string){
	console.log('\x1b[31m', string, '\x1b[0m')
}

function lintCSS(file, data){
	// fail conditions
	// CSS files should not have a need for capital letters.
	// This guards against camelCase in css ids and classes,
	// by finding all lines containing capital letters
	let failure = /^.*?[A-Z].*?{/gm
	let str = data.toString()
	while((matches = failure.exec(str)) !== null) {
		if (matches){
			let [line, number] = getLineAndNumber(matches)
			console.log("CSS file contains a capital letter. This may be a sign that camelCase was used on an id or classname by mistake")
			logRed(file + " : " + number)
			console.log(line)
			console.log()
		}
	}
}

function lintJS(file, data){
	// fail conditions
	// JS files should not have a need for underscores in identifiers.
	// This guards against snake_case in js files
	// by finding all lines containing _ surrounded by a-z A-Z and 0-9
	// Note this may produce false hits in comments or strings however this
	// is desirable is many cases and is likely faster than parsing the source to find all identifiers
	let failure = /^.*?[a-zA-Z0-9]_[a-zA-Z0-9].*?$/gm
	let str = data.toString()
	while((matches = failure.exec(str)) !== null) {
		if (matches){
			let [line, number] = getLineAndNumber(matches)
			console.log("JS file MAY contain underscore in identifier. This may be a sign that snake_case was used in an identifier by mistake")
			logRed(file + " : " + number)
			console.log(line)
			console.log()
		}
	}
}

function lintAll(file, data){
	// fail conditions
	// No file should have mix indentation at the start of a line
	let failure = /^(\t+ | +\t)\s*/gm
	let str = data.toString()
	while((matches = failure.exec(str)) !== null) {
		if (matches){
			let [line, number] = getLineAndNumber(matches)
			console.log("A file MAY contain mixed indentation.")
			logRed(file + " : " + number)
			console.log(line)
			console.log()
		}
	}
}

function lintNag(file, data){
	// fail conditions
	// No unnecessary semicolons in js file, this is optionally enabled behind nag flag
	let failure = /;\s*\n\s*([^\(\[]|\Z)/gm
	let str = data.toString()
	while((matches = failure.exec(str)) !== null) {
		if (matches){
			let [line, number] = getLineAndNumber(matches)
			console.log("A file MAY contain unnecessary semicolons.")
			logRed(file + " : " + number)
			console.log(line)
			console.log()
		}
	}
}

function getLineAndNumber(matches){
	let number = 1
	let line = ""
	let hit = false
	for(var i in matches.input){
		line += matches.input[i]
		if(i == matches.index){
			hit = true
		}
		if(matches.input[i] == "\n"){
			if(hit){
				return [line, number]
			} else {
				line = ""
			}
			number += 1
		}
	}
	return ["", 0]
}