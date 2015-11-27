$(document).ready(function(){
	//parcel details
	$.ajax({
		type:"GET",
		url:"http://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel",
		cache:false,
		dataType:"json",
		success:function(data){
			console.log('success');
			var parcelTemplateScript = $('#parcel-template').html();
			var parcelTemplate = Handlebars.compile(parcelTemplateScript);
			var parcelHtml = parcelTemplate(data);
			$('.main > .row').html(parcelHtml).find('div').last().addClass('end');

			$('.parcel-item a').on('click',function(){

				var modalTemplateScript = $('#modal-template').html();
				var modalTemplate = Handlebars.compile(modalTemplateScript);
				
				var $this = $(this),
				    data = $this.parent('.parcel-item'),
					templateData = {
					    name : data.find('p[data-name]').data('name'),
					    date : data.find('p[data-date]').data('date'),
					    type : data.find('p[data-type]').data('type'),
					    weight : data.find('p[data-weight]').data('weight'),
					    price : data.find('p[data-price]').data('price'),
					    quantity : data.find('p[data-qty]').data('qty'),
					    image : data.find('p[data-image]').data('image'),
					    color : data.find('p[data-color]').data('color'),
					    phone : data.find('p[data-phone]').data('phone')
					};

				var modalHtml = modalTemplate(templateData);
				$('.product-info').remove();
				$('#exampleModal1').prepend(modalHtml);
				//$('#exampleModal1').foundation('reveal','open');
				$('#map_canvas').empty();
				getCoordinates($this.parent('.parcel-item').data('uid'));
				
			});
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

function getCoordinates(uid){
	$.ajax({
		type:"GET",
		url:"http://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel",
		cache:false,
		dataType:"json",
		success:function(data){
			for(var i=0;i<data.parcels.length;i++){
				if(data.parcels[i].color===uid){
					createMap(data.parcels[i].live_location.latitude,data.parcels[i].live_location.longitude);
					return;
				}
			}
		},
		error:function(xhr,status,error){
		}
	});
}

function createMap(lat,lng){
	latlng = new google.maps.LatLng(lat, lng),
    image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png';
    
    var mapOptions = {
             center: new google.maps.LatLng(lat, lng),
             zoom: 13,
             mapTypeId: google.maps.MapTypeId.ROADMAP,
             panControl: true,
             panControlOptions: {
                 position: google.maps.ControlPosition.TOP_RIGHT
             },
             zoomControl: true,
             zoomControlOptions: {
                 style: google.maps.ZoomControlStyle.LARGE,
                 position: google.maps.ControlPosition.TOP_left
             }
         },
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions),
        marker = new google.maps.Marker({
                 position: latlng,
                 map: map,
                 icon: image
             });

    google.maps.event.addListener(map, 'click', function (event) {
         infowindow.close();
         var geocoder = new google.maps.Geocoder();
         geocoder.geocode({
             "latLng":event.latLng
         }, function (results, status) {
             console.log(results, status);
             if (status == google.maps.GeocoderStatus.OK) {
                 console.log(results);
                 var lat = results[0].geometry.location.lat(),
                     lng = results[0].geometry.location.lng(),
                     placeName = results[0].address_components[0].long_name,
                     latlng = new google.maps.LatLng(lat, lng);

                 moveMarker(placeName, latlng);
             }
         });
    });
}

function moveMarker(placeName, latlng) {
     marker.setIcon(image);
     marker.setPosition(latlng);
     infowindow.setContent(placeName);
     //infowindow.open(map, marker);
 }