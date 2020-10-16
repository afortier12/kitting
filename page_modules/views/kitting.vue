<template>
    <integrity-table :name="pageName" :collection="main_collection" :columns="columns" @select="onSelect">
        <template v-slot="{ item }"></template>
    </integrity-table>
</template>

<script>
// While the browser ES6 modules use `export default`, for http-vue-loader to work `module.exports = ...` has to be used
module.exports = {
    props:{
			'main_collection': {type: Array, default:()=>[]}
		},
    data() {
        return {
			pageName: 'Kitting Inventory',
			columns: ["Kit", "In-stock", "Required", " Status", "Select"],
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
			onSelect(item){
				//add call to to redirect to kit page
                var topic = 'kit_req';
                uibuilder.send( {
                'topic': topic,
                'payload': {
                    'name': item.kit,
                }
            })
			}
		}, // --- End of methods --- //
        watch: {

		},  // --- End of watch --- //
        // Available hooks: init,mounted,created,updated,destroyed
		mounted: function(){

        } // --- End of mounted hook --- //
}
</script>
