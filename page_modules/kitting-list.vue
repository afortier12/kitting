<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Demo - List</title>
	<!-- APP-LINKS -->
</head>
<style>
/* APP-STYLE */
</style>
<!-- XTEMPLATES -->
<body>
	<div id="app" v-cloak>
		<!-- APP-TEMPLATE -->
		<div class="app-container">
			<integrity-table :name="pageName" :collection="mainCollection" :columns="columns">
				<template v-slot:column6="item">
					<div class='btn btn-success' @click="successClicked()" v-if="item.item.column2 % 2 == 0"><i class="fas fa-save"></i></div>
					<div class='btn btn-primary' @click="primaryClicked()" v-else><i class="fas fa-save"></i></div>
				</template>
			</integrity-table>
		</div>
	</div>

<script>
	/* APP-SCRIPT */
	let vm = new Vue({
		el: "#app",
		props:{
			'kitting_list': {type: Array, default:()=>[]}
		},
		components: {
        	/* APP-COMPONENTS */
    	}, // --- End of components --- //
		data:{
			startMsg    : 'Vue has started, waiting for messages',
			feVersion   : '',
			socketConnectedState : false,
			serverTimeOffset     : '[unknown]',
			msgRecvd    : '[Nothing]',
			pageName: 'Kitting Inventory',
			mainCollection: [],			  
			columns: ["Kit", "In-stock", "Required", " Status"],
		}, // --- End of data --- //
		computed: { 
			
        }, // --- End of computed --- //
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
			//console.debug('[indexjs:Vue.mounted] app mounted - setting up uibuilder watchers')

			/** **REQUIRED** Start uibuilder comms with Node-RED @since v2.0.0-dev3
			* Pass the namespace and ioPath variables if hosting page is not in the instance root folder
			* The namespace is the "url" you put in uibuilder's configuration in the Editor.
			* e.g. If you get continual `uibuilderfe:ioSetup: SOCKET CONNECT ERROR` error messages.
			* e.g. uibuilder.start('uib', '/nr/uibuilder/vendor/socket.io') // change to use your paths/names
			*/
			uibuilder.start()

			var vueApp = this

			// Example of retrieving data from uibuilder
			vueApp.feVersion = uibuilder.get('version')

			/** You can use the following to help trace how messages flow back and forth.
			* You can then amend this processing to suite your requirements.
			*/

			//#region ---- Trace Received Messages ---- //
			// If msg changes - msg is updated when a standard msg is received from Node-RED over Socket.IO
			// newVal relates to the attribute being listened to.
			uibuilder.onChange('msg', function(newVal){
				//console.info('[indexjs:uibuilder.onChange] msg received from Node-RED server:', newVal)
				if (msg.hasOwnProperty('kit_summary')){
					vueApp.mainCollection = msg.kit_summary
				}
			})
			// As we receive new messages, we get an updated count as well
			uibuilder.onChange('msgsReceived', function(newVal){
				//console.info('[indexjs:uibuilder.onChange] Updated count of received msgs:', newVal)
			
			})

			// If we receive a control message from Node-RED, we can get the new data here - we pass it to a Vue variable
			uibuilder.onChange('ctrlMsg', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:ctrlMsg] CONTROL msg received from Node-RED server:', newVal)
				
			})
			// Updated count of control messages received
			uibuilder.onChange('msgsCtrl', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:msgsCtrl] Updated count of received CONTROL msgs:', newVal)
				
			})
			//#endregion ---- End of Trace Received Messages ---- //

			//#region ---- Trace Sent Messages ---- //
			// You probably only need these to help you understand the order of processing //
			// If a message is sent back to Node-RED, we can grab a copy here if we want to
			uibuilder.onChange('sentMsg', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:sentMsg] msg sent to Node-RED server:', newVal)
				
			})
			// Updated count of sent messages
			uibuilder.onChange('msgsSent', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:msgsSent] Updated count of msgs sent:', newVal)
		
			})

			// If we send a control message to Node-RED, we can get a copy of it here
			uibuilder.onChange('sentCtrlMsg', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:sentCtrlMsg] Control message sent to Node-RED server:', newVal)
		
			})
			// And we can get an updated count
			uibuilder.onChange('msgsSentCtrl', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:msgsSentCtrl] Updated count of CONTROL msgs sent:', newVal)
	
			})
			//#endregion ---- End of Trace Sent Messages ---- //

			// If Socket.IO connects/disconnects, we get true/false here
			uibuilder.onChange('ioConnected', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:ioConnected] Socket.IO Connection Status Changed to:', newVal)

			})
			// If Server Time Offset changes
			uibuilder.onChange('serverTimeOffset', function(newVal){
				//console.info('[indexjs:uibuilder.onChange:serverTimeOffset] Offset of time between the browser and the server has changed to:', newVal)

			})

		} // --- End of mounted hook --- //

	})
</script>

</body>
</html>