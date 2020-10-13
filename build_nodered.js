let fs = require("fs")
let path = require('path')

let state = {
	"env": "dev",
	"mode": "nodered",
	"file": "",
	"htmlTemplate": "",
	"cssTemplate": "",
	"jsTemplate": "",
	"linkTemplate": "",
	"xTemplates": ""
}


const ModuleDir   = "page_modules",
	//OutputDir should be set to "dist" for mode = "nodered"; "_output" for all other modes
	OutputDir 	= "src",
	CSSReplace  = "/* APP-STYLE */",
	CSSRegex    = RegExp("<style>(.*?)<\/style>", 's'),
	JSReplace   = "/* APP-SCRIPT */",
	JSRegex     = RegExp("<script>(.*?)<\/script>", 's'),
	HTMLReplace = "<!-- APP-TEMPLATE -->",
	HTMLRegex   = RegExp("<template>(.*?)<\/template>", 's'),
	LinkReplace = "<!-- APP-LINKS -->",
	LinkRegex   = RegExp("<head>(.*?)<\/head>", 's'),
	XTemplateReplace = "<!-- XTEMPLATES -->"

var args = process.argv.slice(2)

if(args[0]){
	state["env"] = args[0]
}

if(args[1]){
	state["mode"] = "single"
	state["file"] = args[1]
}


if (state["env"] != "dev" && state["env"] != "prod") {
	console.log("Format of command requires second param is either dev or prod")
	process.exit()
}

parseAppTemplate(state)

build()

function parseAppTemplate(state){
	const data = fs.readFileSync("app.vue", {encoding:'utf8', flag:'r'})

	state["htmlTemplate"] = HTMLRegex.exec(data)[1]
	state["cssTemplate"] = CSSRegex.exec(data)[1]
	state["jsTemplate"] = JSRegex.exec(data)[1]
	state["linkTemplate"] = LinkRegex.exec(data)[1]

	xtemplates = fs.readdirSync("component")
	for(var i in xtemplates){
		state["xTemplates"] += fs.readFileSync(path.join("component", xtemplates[i]), {encoding:'utf8', flag:'r'}) + "\n"
	}

	if(state["env"] == "dev"){
		state["linkTemplate"] += `<script src="/js/hotswap_poll.js"></script>`
	}
}

function build() {
	if(state["mode"] == "all" || state["mode"] == "nodered"){
		fs.readdir(ModuleDir, function(err, modules){
			if(err !== null){
				console.log(err)
			} else {
				for(var i in modules){
					try {
						var pos = modules[i].lastIndexOf(".")
						if (pos == -1)
							fs.mkdirSync(path.join(__dirname, OutputDir, modules[i]))
					} catch (err) {
						if (err.code === 'EEXIST') {
						} else {
							throw err
						}
					}
					if (pos == -1) 
						try{
							files = fs.readdirSync(path.join(__dirname, ModuleDir, modules[i]))
							for(var k in files){
								runBuild(path.join(__dirname, ModuleDir, modules[i], files[k]))
							}
						} catch (err) {
							console.log(err)
						}
					else
						//no subdirectory
						runBuild(path.join(__dirname, ModuleDir, modules[i]))
				}	
			}
		})
	} else {
		try {
			fs.mkdirSync(path.join(__dirname, OutputDir, path.dirname(state["file"])))
		} catch (err) {
			if (err.code === 'EEXIST') {
			} else {
				throw err
			}
		}
		runBuild(path.join(__dirname, ModuleDir, state["file"]))
	}
}

function runBuild(name) {
	let data = fs.readFileSync(name, {encoding:'utf8', flag:'r'})

	if (state["env"] == "dev") {
		// Opt into dev version when in dev mode
		state["linkTemplate"] = state["linkTemplate"].replace("js/vue.min.js", "js/vue.js")
	}

	data = data.replace(CSSReplace, state["cssTemplate"])
	data = data.replace(JSReplace, state["jsTemplate"])
	data = data.replace(HTMLReplace, state["htmlTemplate"])
	if (state["mode"]=="nodered"){
		state["linkTemplate"] = state["linkTemplate"].replace(/\"\//g, "\"./")
		state["linkTemplate"] = state["linkTemplate"].replace("<script src=\"./js/hotswap_poll.js\"></script>", "")
	}
	data = data.replace(LinkReplace, state["linkTemplate"])
	data = data.replace(XTemplateReplace, state["xTemplates"])

	name = name.replace(ModuleDir, OutputDir)
	if (state["mode"]== "all"){
		name = name.replace(".vue", ".html")
	} else {
		var pos1 = name.lastIndexOf("\\")
		if (pos1 > 0)
			var filename =  name.substring(pos1+1, name.length);
		name = name.replace(filename,"index.html")
	}

	if (state["mode"]=="nodered"){
		copyDir(path.join(__dirname, "css"), path.join(__dirname, "src", "css"))
		copyDir(path.join(__dirname, "js"), path.join(__dirname, "src", "js"))
		copyDir(path.join(__dirname, "lib"), path.join(__dirname, "src", "lib"))
	}

	fs.writeFileSync(name, data)
}




var copyDir = function(src, dest) {
	try {
		fs.mkdirSync(dest);
	} catch(e) {
		if(e.code != "EEXIST") {
			throw e;
		} else {
		}
	}
	var files = fs.readdirSync(src);
	for(var i = 0; i < files.length; i++) {
		var current = fs.lstatSync(path.join(src, files[i]));
		if(current.isDirectory()) {
			copyDir(path.join(src, files[i]), path.join(dest, files[i]));
		} else if(current.isSymbolicLink()) {
			var symlink = fs.readlinkSync(path.join(src, files[i]));
			fs.symlinkSync(symlink, path.join(dest, files[i]));
		} else {
			copy(path.join(src, files[i]), path.join(dest, files[i]));
		}
	}
};

var copy = function(src, dest) {
	var oldFile = fs.createReadStream(src);
	var newFile = fs.createWriteStream(dest);
	oldFile.pipe(newFile);
};
