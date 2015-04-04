function page1() {	
	$(".page").addClass("hidden");
  	$("#page1").removeClass("hidden");
  	$("li").removeClass("active");
  	$("#page1btn").addClass("active");

} 
function page2() {	
	$(".page").addClass("hidden");
  	$("#page2").removeClass("hidden");
  	$("li").removeClass("active");
  	$("#page2btn").addClass("active");
}

function checkAll() {
	switches.each(function() {
		var switchid = '#'+ $(this).attr('id');
		var checkaction = switchid +''+ 2;
		var state = $(switchid).prop('checked');
		socket.emit('send', 
					{ 
						webstate: state,
						message: checkaction, 
						switchID: switchidid
					});
		console.log(checkaction);
	}
}