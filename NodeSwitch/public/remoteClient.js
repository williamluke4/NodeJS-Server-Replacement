window.onload = function() {
	var messages = [];
	//onload this function will initialize a connection and privide communication between server and client
 	var socket = io.connect(document.domain);
	var switches = $('.switches').find('input');

	function setState(itemID, state){
		itemField.value = state == 1 ? "true" : "false";		
		if(state == 1) {
			$(itemID).bootstrapToggle('on');
			console.log("Switch: "+ itemID + "| Switched On");
		}
		else{
			$(itemID).bootstrapToggle('off');
			console.log("Switch: "+ itemID + " | Switched Off");
		}
	}

	function checkState(id , dataID){
		var messageState = dataID+''+2;
			socket.emit('send', { message: messageState });
			socket.on("callbackButton", function(data){
				if(data.message.indexOf("received") > -1 ){		

					setState(id, data.state); 
				}
			}); 
	}


	switches.each(function() {

		// Initial Setup
		var switchid = '#'+ $(this).attr('id');
		$(switchid).bootstrapToggle();
		var dataID = $(this).attr('dataID')
		checkState(switchid, dataID);
		console.log("State Checked");


		$(function() {


		    $(switchid).change(function() {
		      	console.log('Toggle: ' + $(this).prop('checked'));

		      	var id = $(this).attr('dataID');
		      	var toggleState = $(this).prop('checked');
		      	var toggleAction = toggleState == "true" ? 1 : 0 ;	
				var action = id+''+toggleAction;
				console.log("Onclick function and action is: " + action);
				socket.emit('send', { message: action });

				socket.on("callbackButton", function(data){
					if(data.message.indexOf("received") > -1 ){					
						setState(id, data.state);	

						setTimeout(function(){resetBackground(item) }, 500);
					}
				});

				socket.on("callbackError", function(data){
					console.log(data.error);
					
				});		

				console.log("message now sent "+ action);

		    })
		})
	})
}
