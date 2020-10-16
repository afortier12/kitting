<head>
	<!-- All stylesheets and scripts injected into each page -->
	<link rel="stylesheet" href="">
	<link rel="stylesheet" href="/lib/css/bootstrap.min.css">
	<link rel="stylesheet" href="/lib/css/fontawesome.min.css">
	<link rel="stylesheet" href="/lib/css/roboto.min.css">
	<link rel="stylesheet" href="/lib/css/toastr.min.css">
	<link rel="stylesheet" href="/lib/css/vue-autocomplete.min.css">
	<link rel="stylesheet" href="/lib/css/vue-multiselect.min.css">
	<link rel="stylesheet" href="/lib/css/vue-tour.min.css">
	<link rel="stylesheet" href="/css/integrity-table.css">
	<link rel="stylesheet" href="/css/integrity-navbar.css">
	<link rel="stylesheet" href="/css/integrity-drawer.css">
	<link rel="stylesheet" href="/css/overrides.css">
	<script src="/lib/js/socket.io.js"></script>
	<script src="/lib/js/jquery.min.js"></script>
	<script src="/lib/js/vue.min.js"></script>
	<script src="/lib/js/lodash.min.js"></script>
	<script src="/lib/js/moment.min.js"></script>
	<script src="/lib/js/toastr.min.js"></script>
	<script src="/lib/js/chart.min.js"></script>
	<script src="/lib/js/bootstrap.min.js"></script>
	<script src="/lib/js/vue-multiselect.min.js"></script>
	<script src="/lib/js/vue-autocomplete.min.js"></script>
	<script src="/lib/js/vue-tour.min.js"></script>
	<script src="/lib/js/vue-router.min.js"></script>  <!-- added for node-red -->
	<script src="/lib/js/uibuilderfe.min.js"></script>  <!-- added for node-red -->
	<script src="/lib/js/httpVueLoader.js"></script>  <!-- added for node-red -->
	<script src="/js/index.js" type ="module"></script>  <!-- added for node-red -->
	<script src="/js/integrity.js"></script>
	<script src="/js/integrity-table.js"></script>
	<script src="/js/integrity-navbar.js"></script>
	<script src="/js/integrity-drawer.js"></script>
</head>
<style>
/* This is the last style tag linked into every page */
html {
	padding: 0;
}
html, body, #app {
	height: 100%;
	overflow: hidden;
}
.app-container {
	height: calc(100% - 40px);
	padding: 10px;
}

[v-cloak] {visibility: hidden;}
</style>
<template>
	<!-- This is injected as the first child to #app in each page -->
	<integrity-navbar></integrity-navbar>
</template>
<script>
	/* This is injected right before every pages view model is initialized */
	Vue.mixin({
		// Global mixin standard components
		components: {
			"vue-autocomplete": Autocomplete,
			"vue-multiselect": window.VueMultiselect.default,
			"vue-tour": window["vue-tour"].default,
		},
		// Provide sensible callback defaults in the event they are not defined in the page module
		methods: {
			// Default limit text function for multiselect
			limitText(count){
				return "(" + count + ") selected"
			},
			// Default drawer closer, assumes presence of drawerShow data var
			closeDrawer(){
				this.drawerShow = false
			},
			// No style class if one not defined
			cellStyleClass(item, field){
				return ""
			},
			// Standard col width if one not defined
			colWidthClass(field){
				return "int-table-width-1"
			},
			
		}
	})
	// This simulates a user having securely logged in
	ilib.setCookie("fullname", "Demo User")
	ilib.setCookie("role", "Admin")
</script>