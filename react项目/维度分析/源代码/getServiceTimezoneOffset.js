window.serviceTimezoneOffset = -120;
function getServiceTimezoneOffset(url){
	$.ajax({
		async:false,
		url: url ,
		timeout:1200,
		type: 'POST',
		dataType: 'json'
	})
	.done(function(res) {
		window.serviceTimezoneOffset = res.offset;
	})
	.fail(function() {
		console.log("fail to get service timezoneOffset, timezoneOffset set default -120")
	})
	.always(function() {
		
	});
};
getServiceTimezoneOffset('localhost:3000/multiAnalysis/getServiceTimezoneOffset.action');