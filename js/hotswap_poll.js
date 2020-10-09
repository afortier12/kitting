// Poll every 2 seconds for an update, if updated, refresh page
setInterval(() => {
	$.ajax({
		url: "http://localhost:9091",
		success(data){
			if(data == "yes"){
				location.reload()
			}
		},
		error(err){
			console.log(err.responseText)
		}
	})
}, 2000)

