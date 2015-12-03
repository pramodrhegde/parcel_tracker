$(document).ready(function(){

	//parcel details
	$.ajax({
		type:"GET",
		url:"http://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel",
		cache:false,
		dataType:"json",
		success:function(data){
			$('span.parcel-count').text(data.parcels.length);
			var parcelTemplateScript = $('#parcel-template').html();
			var parcelTemplate = Handlebars.compile(parcelTemplateScript);
			var parcelHtml = parcelTemplate(data);
			$('section > .row').html(parcelHtml).find('div').last();

			// Instantiate MixItUp:
			$('#parcel-item-container').mixItUp();

			$('.parcel-item a').on('click',function(){

				var modalTemplateScript = $('#modal-template').html();
				var modalTemplate = Handlebars.compile(modalTemplateScript);
				
				var $this = $(this),
				    data = $this.parents('.parcel-item'),
					templateData = {
					    name : data.find('h2[data-name]').data('name'),
					    date : data.find('p[data-date]').data('date'),
					    type : data.find('p[data-type]').data('type'),
					    weight : data.find('p[data-weight]').data('weight'),
					    price : data.find('p[data-price]').data('price'),
					    quantity : data.find('p[data-qty]').data('qty'),
					    image : data.find('.parcel-image[data-image]').data('image'),
					    color : data.find('p[data-color]').data('color'),
					    phone : data.find('p[data-phone]').data('phone')
					};

				var modalHtml = modalTemplate(templateData);
				$('.product-info').remove();
				$('#parcel-window > .fake-modal-wrapper').prepend(modalHtml);

				//Like button click - Local Storage
				$('.like-button').on('click',function(){
					var $this = $(this);
					var count=1;
					var key = $this.parents('#parcel-window').find('.product-info').data('uid');
					if(localStorage[key]){
						count += parseInt(localStorage[key]);
						localStorage[key] = count;
					}else{
						localStorage[key] = count;
					}
					$this.find('span.like-count').text(count);
				});

				//Map Refresh button click
				$('.map-refresh-button').on('click',function(){
					var $this = $(this);
					var uid = $this.parents('#parcel-window').find('.product-info').data('uid');
					getCoordinates(uid);
				});

				//$('#map_canvas').empty();
				getCoordinates($this.parents('.parcel-item').data('uid'));
				
				//Like Count Init
				var likes = getLikeCount($this.parents('.parcel-item').data('uid'));
				if(likes){
					$('#parcel-window span.like-count').text(likes);
				}else{
					$('#parcel-window span.like-count').text(0);
				}
				
				$('#parcel-window').toggleClass('hidden');
				$('html').toggleClass('noscroll');
			});
		},
		error:function(xhr,status,error){
			alert('error');
		}
	});
	
	$('.dropdown a').on('click',function(e){
		$(this).next('ul').slideToggle();
		e.stopPropagation();
	});
	$('html').on('click',function(){
		if($('.dropdown ul').is(':visible')){
			$('.dropdown ul').slideToggle();
		}
	});

	$('#search-input').on('keyup',function(e){
		var $this = $(this);
		var query = $this.val();

		searchParcels(query.toLowerCase());
	});	
	//sort asc desc switch pending
	/*var sortHistory;
	$('button.sort').on('click',function(){
		var $this = $(this);
		var sort= $this.data('sort').split(':');
		if(sortHistory === sort[0]){
			if(sort[1]==="asc"){
				$this.data('sort',sort[0]+':desc');
			}else{
				$this.data('sort',sort[0]+':asc');
			}
		}else{
			sortHistory = sort[0];
		}
	});
	
	$('button.sort-type').on('click',function(){
		var $this = $(this);
		var type = $this.data('type');
		$('button.sort').each(function(){
			$(this).data('sort',$(this).data('sort').split(':')[0]+':'+type);
		});
		$this.siblings().prop('disabled',false);
		$this.prop('disabled',true);
	});	*/
	
	$('#parcel-window').on('click',function(){
		if($(this).is(':visible')){
			$(this).toggleClass('hidden');
			$('html').toggleClass('noscroll');
		}
	});
	$('a.close-window').on('click',function(){
		$(this).parents('#parcel-window').toggleClass('hidden');
		$('html').toggleClass('noscroll');
	});
	$('.fake-modal-wrapper').on('click',function(e){
		e.stopPropagation();
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
	$('.map-loader').css({'display':'table'});
	$.ajax({
		type:"GET",
		url:"http://zoomcar-ui.0x10.info/api/courier?type=json&query=list_parcel",
		cache:false,
		dataType:"json",
		success:function(data){
			$('.map-loader').css({'display':'none'});
			for(var i=0;i<data.parcels.length;i++){
				if(data.parcels[i].color===uid){
					createMap(data.parcels[i].live_location.latitude,data.parcels[i].live_location.longitude);
					return;
				}
			}
		},
		error:function(xhr,status,error){
			$('.map-loader').css({'display':'none'});
		}
	});
}

function createMap(lat,lng){
	var latlng = new google.maps.LatLng(lat, lng),
        image = 'http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png',
        mapOptions = {
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
         };
        map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions),
        marker = new google.maps.Marker({
                 position: latlng,
                 map: map,
                 icon: image
             });

        
        //marker.setIcon(image);
		//marker.setPosition(latlng);
	    //infowindow.setContent(placeName);
	var infowindow = new google.maps.InfoWindow();

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

                 marker.setIcon(image);
			     marker.setPosition(latlng);
			     infowindow.setContent(placeName);
             }
         });
    });
}

function moveMarker(placeName, latlng) {
     
     //infowindow.open(map, marker);
 }

 function getLikeCount(uid){
 	if(localStorage[uid]){
 		return localStorage[uid];
 	}else{
 		return null;
 	}
 }

 function searchParcels(query){
 	var searchSet = $('#parcel-item-container .parcel-item');

 	searchSet.each(function(index){
 		var name = $(this).data('name').toLowerCase();
 		var weight = $(this).data('weight').toString();
 		var price = $(this).data('price').toString();

 		if(name.indexOf(query) != -1 || weight.indexOf(query) != -1 || price.indexOf(query) != -1 ){
 			$(this).fadeIn(400);
 		}else{
 			$(this).fadeOut(400);
 		}
 	});
 }