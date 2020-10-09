### Concept

This is a WIP demo to showcase the desired new client build to be used by the front end development team.

This repo contains the template assets, build, and output such that it can be reviewed and better understood. In the real example the output would not be commited, but generated on deploy.

JS build, server, and watcher scripts are provided as a MVP candidate for local development build environment. These scripts only make use of native node packages, ie no NPM modules, and are intentionally kept quite simple. These could be rewritten in whatever build framework the client team decides to use long term.

### Structure

- **./\_output**          The generated output of running a build
- **./component**         Component X-templates injected before body element
- **./css**               Any style assets written directly by team
- **./js**                Any script assets written directly by team
- **./lib/css**           Style assets as included from an external library
- **./lib/js**            Script assets as included from an external library
- **./page_modules**      Page templates in the structure: page_modules/module_name/page_name.vue
- **./style_reference**   Visual guideline for appearance of elements on pages
- **./app.vue**           Special template, style and script for standard header on each page
- **./build.js**          Simple build script written in node as proof of concept
- **./linter.js**         Demo linter to find minor code style issues in project files
- **./server.js**         Demo server to demonstrate content
- **./watch.js**          Demo hotreloading with hotswap_poll.js

### Quick Walkthrough

```bash

# Page modules must be built if created / modified, one of the following will work as needed.

# Building all pages in dev mode
node build.js

# Building all pages in prod mode
node build.js prod

# Building a single page in dev mode
node build.js dev module/page.vue

# Building a single page in prod mode
node build.js prod module/page.vue


# Then you can use the provided server to test the generated assets

# You can serve the generated files:
node server.js


# You can try out the page watcher, which accepts a single file to watch and hotreload (Note: this requires server.js to also be running)

# You can watch the provided file:
node watch.js demo/list.vue

# And visit a generated page in browser
# Ex http://127.0.0.1:9090/demo/list.html

# While watcher is running edits to demo/list.vue will update to the browser within 2 seconds upon save.

# A linter is provided to help find common code formatting / styling issues
node linter.js

# Optionally provide the linter the nag option if you want to be warned about unnecessary semicolons
node linter.js nag

```


### Potential Improvements

This is a quick and dirty list of open todos, they will be added to the official project issues page where they can be organized, assigned/requested and tracked to completion. Discussion is welcome in the issue page to help define scope and plan courses of action.

- [ ] Build     : Minification; likely unnecessary but a potential future optimization
- [ ] Build     : Useful Aliases
- [ ] Linter    : Improve detection of lint issues, and better prevention of false hits
- [ ] Linter    : Autofix simple lint issues? Might be nice to be able to call this functionality on save if this can be done safely
- [ ] Component : Better filter UI for integrity-table, possibly using integrity-drawer component
- [ ] Style     : Better mobile resolution rendering for table / other components
- [ ] Style     : Recreate style guide inside build integrating any necessary components and style to accomodate this in an organized way
- [ ] Watch     : Watch all files, only reload page that was edited when no command line argument passed
- [ ] Watch     : Use sockets or SSE instead of polling for hotreload
- [ ] Git       : Post-Merge, Post-Rebase hooks to production build when host = production (once merged to mainline repo)
- [ ] Tools     : Stub server which mimics the API server, providing local stubs for all available APIs for local dev testing and reference


### Coding Style Guide

These guidelines strive to enforce some consistency between our client side pages and usage. The Vue style guidelines are a useful reference though they often are more stringent than our guidelines. https://vuejs.org/v2/style-guide/ for more information. Important rules and exceptions to the standard guides are listed below.

1. Custom element names should have two words seperated by a hyphen, it is required by the DOM so lets keep it consistent everywhere:
```html
<custom-element></custom-element>
```
2. Component data must always be a function, not a simple object:
```js
let vm = new Vue({
	data(){
		return {}
	}
})
```
3. Avoid the use of self-closing elements for custom elements. The dom requires non self closing so lets be consistent everywhere:
```html
<!-- Good -->
<custom-element></custom-element>

<!-- Bad -->
<custom-element/>
```
4. For css ids and class names, prefer kebab-case-names-like-this. While some 3rd party components may use different styles and you may be forced to reference them, when making our own ids and classes always use kebab-case.
```css
.some-class-you-want {}
#some-id-of-an-element {}
```
5. For data, methods, computeds, props, and functions prefer camelCase. Some callbacks may expose a different style, however all exposed methods in the root vm and home grown components should have camelCaseIdentifiers.
```js
addTwoValues(){}
let thisData = { someField: 'Data', value: 6 }
let moreData = { anotherField: 'More Data', anotherValue: 8 }
addTwoValues(thisData.value, moreData.anotherValue)
```
6. There is a preferred order for fields inside the vm and components, you don't need them all everytime but where appropriate try to organize them in a consistent and logical fashion:
```js
let vm = new Vue({
	el: "#app",
	// Props and watchers
	props: [],
	watch: {},
	// Reactive data and methods
	data(){return {}},
	computed: {},
	methods: {},
	// Lifecycle events
	beforeCreate(){},
	created(){},
	beforeMount(){},
	mounted(){},
	beforeUpdate(){},
	updated(){},
	beforeDestroy(){},
	destroyed(){},
})
```
7. Tabs are preferable to spaces for the purposes of indentation. Tabs can be set to any size in any editor but spaces are spaces... Spaces are not necessarily evil, but consistency is prefered and mixed spaces and tabs look particularly bad depending on tab size setting so this should be avoided as much as possible. Often when we copy code samples from the internet they will be space indented. This can cause good code to look ugly. Hopefully we can automate this at the linting stage.
```text
good
\t\thello there

bad
    hello there
```
8. Unix style line endings are prefered to windows style line endings. If your editor lets you configure them, its recommended to switch them on save to avoid accidentally commiting the wrong style. Unix style is less characters and more simple to work with.
```text
good
\n

bad
\r\n
```
9. In javascript there a few cases where ; is required as a line terminator and that is before lines that begin with a ( or [ and inside c style for loop conditions. Therefore while they are not required, they are not strictly disallowed either.
```js
// Avoid starting lines with ( or [

(function(){})()

['a'].forEach()

// If you must, its recommended to start these lines with a semicolon:

;(function(){})()

;['a'].forEach()


```
10. If you would like to use newer features of html5+, css3+, es6+, etc that are not already employed in this repo, please consult Can I Use? caniuse.com to ensure our primary web browsers are supported. Minimally Chrome, Firefox, and Safari should support the feature, and ideally Edge, and Mobile browsers should as well. If polyfills are required, they should be well documented so they can be removed once native support is available.
