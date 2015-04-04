window.onload = function() {
	var messages = [];
	//onload this function will initialize a connection and privide communication between server and client
 	var socket = io.connect(document.domain);
	var switches = $('.switches').find('input');
	socket.on('connect', function () {});
	
	function setState(itemID, state){
		clientState = $(itemID).prop("checked")
		if(state ==1 || state == '1') {
			console.log("Switch: "+ itemID + "| Switched On");
			$(itemID).bootstrapToggle("on");
		}
		
		else if(state ==0 || state == '0'){
			console.log("Switch: "+ itemID + " | Switched Off");
			$(itemID).bootstrapToggle("off");
		}
		else{
			console.log("WHAAAT");
		}}

	function checkState(id) {
			var switchid = $(id).attr('data-id');
			var checkaction = switchid +''+ 2;
			var state = $(switchid).prop('checked');
			socket.emit('send', 
						{ 
							webstate: state,
							message: checkaction, 
							switchID: id
						});
			console.log(checkaction);}



	switches.each(function() {
		

		// Initial Setup
		var switchid = '#'+ $(this).attr('id');
		$(switchid).bootstrapToggle();
		checkState(switchid);
		console.log("State Checked");
		var id = $(switchid).attr('data-id');
		
		// On Switch Click    
	    $(switchid).parent().on('click', function() {
	      	var toggleState = $(switchid).prop('checked');
	      	var toggleAction = (toggleState == true) ? 0 : 1 ;	
			var action = id+''+toggleAction;

			console.log("Sending: " + action);
			socket.emit('send', 
						{ 		
							webstate: toggleState,
							message: action, 
							switchID: switchid
						});
			
			console.log("message now sent "+ action);
	    });

		
	    //On Sending Error
		socket.on("callbackError", function(data){
			console.log(data.error);
			
		});		  	});


	// Message Recived
	socket.on("callbackButton", function(data){
				$(data.switchID).siblings('div').children('.toggle-on').css("background-color", "#337ab7");
				$(data.switchID).siblings('div').children('.toggle-off').css("background-color", "#e6e6e6");
				if(data.message.indexOf("received") > -1 ){	
					console.log("Data State is: " + data.state)				
					setState(data.switchID, data.state);	
				}});

	// Message Failed
	socket.on("failed", function(data){
				$(data.switchID).siblings('div').children('.toggle-on').css("background-color", "red");
				$(data.switchID).siblings('div').children('.toggle-off').css("background-color", "red");
				console.log("NO REPLY: "+ data.switchID);
				if (data.webstate){
					$(data.switchID).bootstrapToggle("on");
				}
				else {
					$(data.switchID).bootstrapToggle("off");
				}});

	// Onclick Of Refresh Button
	$('.refresh').on('click', function() {
		var switches = $('.switches').find('input');
		switches.each(function() {
			var switchid = '#'+ $(this).attr('id');
			var checkaction = switchid +''+ 2;
			var state = $(switchid).prop('checked');
			socket.emit('send', 
						{ 
							webstate: state,
							message: checkaction, 
							switchID: switchid
						});
			console.log(checkaction);});
}






