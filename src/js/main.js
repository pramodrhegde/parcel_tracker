var parcelItemList = [];

$(document).ready(function(){

	//parcel details
	$.ajax({
		type:"GET",
		url:"http://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel",
		cache:false,
		dataType:"json",
		success:function(data){
			var parcelItemMarkup = '<div class="col-lg-3 col-md-4 col-sm-6 col-xs-12">';
			parcelItemList = data.parcels;
		},
		error:function(xhr,status,error){
			alert('error');
		}
	});

	//api hits
	$.ajax({
		type:"GET",
		url:"http://zoomcar-ui.0x10.info/api/courier?type=json&query=api_hits",
		cache:false,
		dataType:"json",
		success:function(data){
			console.log(data);
		},
		error:function(xhr,status,error){
			alert('error');
		}
	});
});