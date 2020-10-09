Vue.component('integrity-navbar', {
	data(){
		return {
			fullname: "",
			role: ""
		}
	},
	mounted(){
		// This is how the cookie would then be accessed to show the user in the page.
		// Note this is insecure and should not be trusted for privilege checks, display use only
		// Privilege checks happen at the API level automatically.
		this.fullname = ilib.getCookie("fullname")
		this.role = ilib.getCookie("role")
	},
	template: "#integrity-navbar"
})

