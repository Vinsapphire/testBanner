//Initialize banners in case if main page is fully loaded
function init(){
	//select all banners from current page
	//returns object with banner id as key and banner HTMLEl as value
	function getBanners(){
		var elementsArray = document.getElementsByTagName("div");
		var bannersArray = {};
		
		for(var i = 0, end = elementsArray.length; i < end; i++ ){
			if(elementsArray[i].hasAttribute("data-custom-id")){
				bannersArray[elementsArray[i].getAttribute("data-custom-id")] = elementsArray[i];
			}
		}

		return bannersArray;
	}

	//returns JSON info for current banner id
	function getBannerInfoFromServer(id){
		//server magic emulation
		var banners = {
			"123": {
				"src": "http://placehold.it/300x150",
				"height": 150,
				"width": 300,
				"link": "http://google.com",
				"self_closing": true
			},
			"42": {
				"src": "http://placehold.it/100x100/000000/ffffff",
				"active_src": "http://placehold.it/100x100/ffff00/ffffff",
				"height": 100,
				"width": 100,
				"link": "http://ya.ru"
			}
		}

		for(var i in banners){
			if(id === i){
				return JSON.stringify(banners[i]);
			}
		}
	}

	//bind events for simple banner
	function bindMouseEvents(id, infoObject){
		var newBannersArray = getBanners();
		var image = newBannersArray[id].childNodes[0].childNodes[0];

		image.addEventListener("mouseover", onMouseOver, false);
		image.addEventListener("mouseout", onMouseOut, false);

		//set new banner image in case of mouseover event
		function onMouseOver(){
			var source = image.src;
			if(source != infoObject.active_src){
				image.src = infoObject.active_src;
			}
		}

		//rollback to default image in case of mouseout event
		function onMouseOut(){
			image.src = infoObject.src;
		}
	}


	var bannersArray = getBanners();

	for( var i in bannersArray ){
		var result = JSON.parse(getBannerInfoFromServer(i));

		//generate template for banner(really it's better to use createElement instead of this spagetti code:))
		var childElement = "<a href='" + result.link 
			+ "' target='_blank'><img src='" + result.src 
			+ "' alt='' style='width: " + result.width 
			+ "; height: " + result.height + ";' /></a>";

		bannersArray[i].style.position = "relative";

		if( result.hasOwnProperty("self_closing") && result.self_closing ){
			//add div to allow user to close banner block;
			childElement = "<div style='position: absolute; top: 0; right: 0; width: auto;" 
				+ " height: 10px; font-size: 10px; cursor: default;'>close</div>" + childElement;
			
			var closableBanner = bannersArray[i];
			closableBanner.innerHTML = childElement;
			var closeHandler = closableBanner.childNodes[0];

			if(closeHandler.tagName.toUpperCase() === "DIV"){
				closeHandler.addEventListener("click", onCloseClick, false);
				
				//remove banner if user clicks on close button
				function onCloseClick(){
					//Maybe better to remove banner completely from the DOM
					//closableBanner.parentNode.removeChild(closableBanner);
					closableBanner.innerHTML = "";
				}
			}
		} else {
			bannersArray[i].innerHTML = childElement;
		}
		
		if(result.hasOwnProperty("active_src")){
			bindMouseEvents(i, result);
		}
	}
}