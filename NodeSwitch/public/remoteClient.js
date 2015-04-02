window.onload = function() {
	var messages = [];
	//onload this function will initialize a connection and privide communication between server and client
 	var socket = io.connect(document.domain);
	var switches = $('.switches').find('input');

	function setState(itemID, state){
		clientState = $(itemID).prop("checked")
		if(state == clientState) {
			console.log("States are The Same")
		}
		else if(state ==1) {
			console.log("Switch: "+ itemID + "| Switched On");
		}
		
		else if(state ==0){
			console.log("Switch: "+ itemID + " | Switched Off");
		}
		else{
			console.log("WHAAAT");
		}

	}





	switches.each(function() {

		// Initial Setup
		var switchid = '#'+ $(this).attr('id');
		$(switchid).bootstrapToggle();
		console.log("State Checked");

		    $(switchid).parent().click(function() {
		      
		      	var id = $(switchid).attr('data-id');
		      	var toggleState = $(switchid).prop('checked');
		      	var toggleAction = (toggleState == true) ? 0 : 1 ;	
				var action = id+''+toggleAction;

				console.log("Sending: " + action);
				socket.emit('send', { message: action });

				socket.on("callbackButton", function(data){
					if(data.message.indexOf("received") > -1 ){	
						console.log("Data State is: " + data.state)				
						setState(id, data.state);	
					}
					else{
						console.log("NO REPLY")
						$("itemID").bootstrapToggle("toggle");
					}
				});

				socket.on("callbackError", function(data){
					console.log(data.error);
					
				});	

				socket.on("failed", function(data){
					console.log("NO REPLY");
					$(id).bootstrapToggle("toggle");
					
				});		

				console.log("message now sent "+ action);

		    });
	});
}
