window.onload = function() {
	var messages = [];
	//onload this function will initialize a connection and privide communication between server and client
 	var socket = io.connect(document.domain);
	var switches = $('.switches').find('input');
	socket.on('connect', function () {});
	
	function setState(itemID, state){
		clientState = $(itemID).prop("checked")
		if(state ==1) {
			console.log("Switch: "+ itemID + "| Switched On");
		}
		
		else if(state ==0){
			console.log("Switch: "+ itemID + " | Switched Off");
		}
		else{
			console.log("WHAAAT");
		}

	}

	function checkState(id) {
			var switchid = $(id).attr('data-id');
			var checkaction = switchid +''+ 2
			socket.emit('send', 
						{ 
							message: checkaction, 
							switchID: id
						});
			console.log(checkaction);
	}



	switches.each(function() {

		// Initial Setup
		var switchid = '#'+ $(this).attr('id');
		$(switchid).bootstrapToggle();
		console.log("State Checked");
		var id = $(switchid).attr('data-id');
		    
	    $(switchid).parent().on('click', function() {
	      	var toggleState = $(switchid).prop('checked');
	      	var toggleAction = (toggleState == true) ? 0 : 1 ;	
			var action = id+''+toggleAction;

			console.log("Sending: " + action);
			socket.emit('send', 
						{ 
							message: action, 
							switchID: switchid
						});
			
			console.log("message now sent "+ action);
	    });

		

		socket.on("callbackError", function(data){
			console.log(data.error);
			
		});	

			
			  	
	});

	socket.on("callbackButton", function(data){
				if(data.message.indexOf("received") > -1 ){	
					console.log("Data State is: " + data.state)				
					setState(data.switchID, data.state);	
				}
			
			});
	socket.on("failed", function(data){

				console.log("NO REPLY: "+ data.switchID);
				$(data.switchID).bootstrapToggle("toggle");
				
			});	  
}
