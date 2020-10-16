<template>
	<div>
		<div class="btn-toolbar">
			<button type="button" class="btn btn-primary mb-3 mr-5">Pick Kit</button>
			<button type="button" class="btn btn-primary mb-3">Put Kit</button>
		</div>
		<integrity-table :name="pageName" :collection="kit_list" :columns="columns">
			<template v-slot="{ item }"></template>
		</integrity-table>
	</div>
</template>

<script>
// While the browser ES6 modules use `export default`, for http-vue-loader to work `module.exports = ...` has to be used
module.exports = {
    props:{
			'kit_list': {type: Array, default:()=>[]}
		},
    data() {
        return {
			pageName: 'Kitting Inventory',	  
			columns: ["Detail", "Part Number", "Description", "Material", " Quantity"],
        };
    },
    computed: {
    },// --- End of computed --- //
		methods: {
			cellStyleClass(item, field){
				if(field == "column2" && item.column2 % 2 == 0){
					return 'int-table-cell-pink'
				}
				return ""
			},
			colWidthClass(field){

				if(field == "column1"){
					return 'int-table-width-2'
				}
				return "int-table-width-1"
			},
			successClicked(){
				toastr.success("Success")
			},
			primaryClicked(){
				toastr.info("Primary")
			},
		}, // --- End of methods --- //
        watch: {

		},  // --- End of watch --- //
        // Available hooks: init,mounted,created,updated,destroyed
		mounted: function(){

        } // --- End of mounted hook --- //
}
</script>