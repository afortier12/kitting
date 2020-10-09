Vue.component('integrity-drawer', {
	props: ['show'],
	methods: {
		backgroundClicked(){
			if(this.$parent.closeDrawer){
				this.$parent.closeDrawer()
			} else {
				toastr.error("Page needs to define closeDrawer method callback for integrity-drawer component to use")
			}
		}
	},
	template: "#integrity-drawer"
})


