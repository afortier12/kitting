// This is a quick demo to show how one might watch a file for changes and run the build on that file automatically

const fs = require('fs')
const path = require('path')
const { exec } = require("child_process")
var http = require('http')
var reset = false


http.createServer(function (request, response) {
	response.setHeader('Access-Control-Allow-Origin', '*')
	response.writeHead(200, { 'Content-Type': 'text/html' })
	response.end(reset ? 'yes' : 'no', 'utf-8')
	if(reset){
		reset = false
	}
}).listen(9091)
console.log('Server running at http://127.0.0.1:9091/')

var args = process.argv.slice(2)

if(args[0]){
	const watchedFile = args[0]
	const lookupPath = path.join('page_modules', watchedFile)

	console.log(`Watching: ${watchedFile}`)
	executeBuild(watchedFile)
	let fsSpinLock = false
	fs.watch(lookupPath, (event, filename) => {
		if (filename) {
			if (fsSpinLock) return
			fsSpinLock = setTimeout(() => {
				fsSpinLock = false
			}, 100)
			executeBuild(watchedFile)
			console.log(`${filename} updated`)
			reset = true
		}
	})
	fs.watch("app.vue", (event, filename) => {
		if (filename) {
			if (fsSpinLock) return
			fsSpinLock = setTimeout(() => {
				fsSpinLock = false
			}, 100)
			executeBuild(watchedFile)
			console.log(`${filename} updated`)
			reset = true
		}
	})
} else {
	throw "You must provide a module page in the format: modulename/pagename.vue as the first argument"
}

function executeBuild(name){
	exec(`node build.js dev ${name}`, (error, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`)
			return
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`)
			return
		}
	})
}
