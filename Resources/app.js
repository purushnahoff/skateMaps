(function() {
	var masterWindow = Ti.UI.createWindow({
		orientationModes:[Ti.UI.PORTRAIT, Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT]	
	});
	
	var db = Ti.Database.install('/mydata/skateMapsDB.sqlite', 'skateMapsDB.sqlite');
	db.close();
	
	(function(){ Titanium.UI.createAlertDialog({
	 	title: 'SkateMaps', 
	 	message: 'This app uses your current location. Please enable location services in settings'});
	 })();	
	 
	 
	// GLOBAL VARIABLES WITH DEFAULT VALUES AS THE SIMULATOR DOESN'T HAVE GPS
	var CURRENT_LOCATION = "170 Kessels Rd, Nathan QLD 4111";
	var LATITUDE_BASE = -27.552359;
	var LONGITUDE_BASE = 153.053627;
	
	Ti.Geolocation.purpose = 'Recieve User Location';
	Ti.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 10;
	Ti.Geolocation.getCurrentPosition(function(e)
	{
	    if (e.error)
	    {
	        alert('SkateMaps cannot get your current location');
	        return;
	    }
	    ////////////////////////////////////////////////////////////////////
	 	// UNCOMMENT THE FOLLOWING TWO LINES TO USE GPS CURRENT LOCATION
	  	// LONGITUDE_BASE = e.coords.longitude;
	    // LATITUDE_BASE = e.coords.latitude;
	    
	    // convert the current location coordinates into a readable street address 
	    var addrUrl = "http://maps.googleapis.com.au/maps/api/geocode/json?sensor=true&latlng="+ LATITUDE_BASE +","+ LONGITUDE_BASE;
		var addrReq = Titanium.Network.createHTTPClient();
		addrReq.open("GET",addrUrl);
		addrReq.send(null);
		  
		addrReq.onload = function()
		{
		    var response = JSON.parse(this.responseText);
		  
		    if(response.status == "OK"){
		        var resLen = response.results[0].address_components.length;
		        for(var i=0; i < resLen; i++) {
		            switch (response.results[0].address_components[i].types[0])
		            {
		                case "street_number":
		                	CURRENT_LOCATION = response.results[0].address_components[i].long_name; 
		                    break;
		                case "route": //Street Name
		                	CURRENT_LOCATION += ' ' + response.results[0].address_components[i].long_name;
		                    break;
		                case "locality"://city name
		                	CURRENT_LOCATION += ', ' +response.results[0].address_components[i].long_name;
		                    break;
		                case "administrative_area_level_1": //state name 
		                	CURRENT_LOCATION += ', ' + response.results[0].address_components[i].long_name;	        
		                    break;	  
		                }
		        }
		    }else{
		    	Titanium.UI.createAlertDialog({title: 'Error', message: 'Unable to find Address'});
		    }
	  
		};    
	});


	// About button for nav bar available from all windows
	var aboutButton = Titanium.UI.createButton({
		title:'About',
		height:33,
		width:33,	
	});


	var win = function(){		
		var win = Titanium.UI.createWindow({
			title:"SkateMaps",
			backgroundColor: '#000000',
			navBarHidden: false,
			barColor: '#363F45',
			rightNavButton: aboutButton
		});			
		return win;
	};
	
	
	// home page list parks button
	var listButton = Ti.UI.createButton({
		title: 'List Parks',
		height: 60,
		width: 145,
		top: 350,
		left: 10,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius: 10,
		font:{fontSize:16,fontFamily:'default',fontWeight:'bold'},
		backgroundGradient: {type: 'linear',
			colors: [ '#000001', '#666666'],
			startPoint: {x:0, y:0},
			endPoint: {x:5, y:80},
			backFillStart: false},
		borderWidth:1,
		borderColor:'#666',
		selectedColor: '#FF00000',	
	});
	
	// homw page map view button
	var mapButton = Ti.UI.createButton({
		title: 'Map View',
		height: 60,
		width: 145,
		top: 350,
		right: 10,
		style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,
		borderRadius: 10,
		font:{fontSize:16,fontFamily:'default',fontWeight:'bold'},
		backgroundGradient: {type: 'linear',
			colors: [ '#000001', '#666666'],
			startPoint: {x:0, y:0},
			endPoint: {x:5, y:80},
			backFillStart: false},
		borderWidth:1,
		borderColor:'#666',
		selectedColor: '#FF00000'
	});
		
	var homeView = function(){
		var view = Ti.UI.createView({backgroundImage: '/images/pushing_img1.jpg'});
		
		Ti.App.addEventListener('orient', function(evt){
				if (evt.portrait===true) {
					view.backgroundImage = '/images/pushing_img1.jpg';
					listButton.height = 60; listButton.width = 145;
					listButton.top = 350; mapButton.top = 350; 
					mapButton.height = 60; mapButton.width = 145;
					Ti.App.Properties.setInt('labelAddressWidth', 165);
						
				}else{
					view.backgroundImage = '/images/pushing_h.png';
					listButton.height = 40; listButton.width = 220;
					listButton.top = 220; mapButton.top = 220; 
					mapButton.height = 40; mapButton.width = 220;	
					Ti.App.Properties.setInt('labelAddressWidth', 340);	
				}				
		});		
		view.add(listButton, mapButton);	
		return view;		
	};
	
	var homeWindow = win();
	homeWindow.add(homeView());
	
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: homeWindow			
	});
				
	var listWindow = win();			
	var photoWindow = win();
	var aboutWindow = win();
	aboutWindow.rightNavButton = null;
	var mapWindow = win();
	var directionsWindow = win();
	var searchResultWindow = win();


	var aboutWebView = Ti.UI.createWebView({
		url:'about.html',
		backgroundColor: '#000000'			
	});
	aboutWindow.add(aboutWebView);

	aboutButton.addEventListener('click', function(){
		aboutWindow.backButtonTitle = 'Back';		
		nav.open(aboutWindow, {animated:true});
	});
	
	var mapview = Ti.Map.createView({
		mapType: Ti.Map.STANDARD_TYPE,
		region: {
	    	latitude: LATITUDE_BASE, 
	    	longitude: LONGITUDE_BASE,
		    latitudeDelta: 0.3, 
		    longitudeDelta: 0.3
	    },
	    animate:true,
	    regionFit:true,
	    userLocation:false   
	});

	Ti.Gesture.addEventListener('orientationchange', function(e){
		Ti.App.fireEvent('orient', {portrait:e.source.isPortrait()});
	});

	// takes a resultSet from DB and returns the address as a formated string
	var parkAddress = function(resultSet){
		var address = '';
		if(resultSet.fieldByName('suburb') === null){
			address = resultSet.fieldByName('street_address') + ', ' +
					  resultSet.fieldByName('city') + ', ' +
					  resultSet.fieldByName('state');
		}else{
			address = resultSet.fieldByName('street_address') + ', ' +
					  resultSet.fieldByName('suburb') + ', ' +
					  resultSet.fieldByName('city') + ', ' +
					  resultSet.fieldByName('state');
		}
		return address;	
	};
	

	// used for the initial list which is populated when the app is loaded
	// to reduce any lag for the user	
	var tv = Ti.UI.createTableView({backgroundColor: '#000000'});
	
	// used for the search results and detail view from the info button on the mapview
	var tv2 = Ti.UI.createTableView({backgroundColor: '#000000'});
	
	var data = [];
	// adds a park to a row then to the tableView
	var fillTableViewRow = function(resultSet, tableView){
		
		var row = Ti.UI.createTableViewRow({		
			height: Titanium.UI.SIZE,
			className:"row",
			backgroundColor: '#000000'			
		});

		var labelName = Titanium.UI.createLabel({
			text: resultSet.fieldByName('Name'),
			font: {  fontSize: '16dp', fontWeight: 'bold'},
			left:100,
			top:10,
			right:10,
			height:40,
			width:Titanium.UI.FILL,
			textAlign:"center",
			color:"#FFFFFF",
			backgroundColor:"#363F45"
		});
		
		var addressView = Ti.UI.createView({
			height: 50,
			width:Titanium.UI.FILL,
			layout:'horizontal',
			left:100,
			top:50,
			right:10,
			backgroundColor: "#363F45"
		});	
			
		var labelAddress = Titanium.UI.createLabel({
			text: parkAddress(resultSet),
			font: { fontSize: '12dp'},
			left:5,
			height:50,
			width: '80%',
			textAlign:"left",
			color:"#FFFFFF",	
		});	

		var droppin = Ti.UI.createButton({
			image: '/images/google_pin.png',
			color: "#363F45",
			style: Ti.UI.iPhone.SystemButtonStyle.PLAIN,	
			width: 30,
			height: 40,	
		});
		
		// label which I add droppin button to, so i can call it as the parent to get the address text in 
		var droppinLabel = Titanium.UI.createLabel({	
			text: parkAddress(resultSet),
			font: {fontSize: '4dp'},
			color: "#363F45",
			top:10,	
			right: 5,
			height:40,
			width:30,			
		});
		
		droppinLabel.add(droppin);		
		addressView.add(labelAddress, droppinLabel);
		row.add(labelName, addressView);


		droppinLabel.addEventListener('click',function(e){
			var str = 'http://maps.google.com.au/?daddr='+
					e.source.parent.text + '&saddr='+ CURRENT_LOCATION;
				
			var webview = Ti.UI.createWebView({url:str});	
			directionsWindow.add(webview);
			directionsWindow.backButtonTitle = 'Back';
			nav.open(directionsWindow, {animated:true});			
		});

		var descriptionView = Ti.UI.createView({
			height:Titanium.UI.SIZE,
			layout:'vertical',
			left:10,
			top:100,
			bottom:10,
			right:10,
			backgroundColor:"#363F45"
		});	

	
		// creates a image view with one star and takes the position of the star as an argument
		var star = function(leftPosition, imgPath){
			var star = Ti.UI.createImageView({
				image: imgPath,
				top: 5,
				left:leftPosition,
				height:25,
				width:25});			
			return star;		
		};
		
		var labelRating = Titanium.UI.createLabel({
			top: 5,
			left:5,
			height:40,
			width: Ti.UI.SIZE,
			color:"#FFFFFF"
		});		
		
		// determines how many stars for each skatepark and adds them to the ratings label
		(function (){			
			var pos1 = 0, pos2 = 25, pos3 = 50, pos4 = 75, pos5 = 100;
			var yel = '/images/star_yellow1.png', grey = '/images/star_grey.png';
			
			if (resultSet.fieldByName('Star_Rating') === '1 stars'){
				labelRating.add(star(pos1,yel),star(pos2,gery),star(pos3,grey),star(pos4,grey),star(pos5,grey));
			}
			else if (resultSet.fieldByName('Star_Rating') === '2 stars'){
				labelRating.add(star(pos1,yel),star(pos2,yel),star(pos3,grey),star(pos4,grey),star(pos5,grey));
			}
			else if (resultSet.fieldByName('Star_Rating') === '3 stars'){
				labelRating.add(star(pos1,yel),star(pos2,yel),star(pos3,yel),star(pos4,grey),star(pos5,grey));	
			}
			else if (resultSet.fieldByName('Star_Rating') === '4 stars'){
				labelRating.add(star(pos1,yel),star(pos2,yel),star(pos3,yel),star(pos4,yel),star(pos5,grey));	
			}
			else if (resultSet.fieldByName('Star_Rating') === '5 stars'){
				labelRating.add(star(pos1,yel),star(pos2,yel),star(pos3,yel),star(pos4,yel),star(pos5,yel));
			}		
		})();
			
	
		var descText = Titanium.UI.createLabel({
			text: resultSet.fieldByName('Description'),
			font: { fontSize: '12dp'},
			top:0,
			left:5,
			right:5,
			bottom:5,
			height: Titanium.UI.SIZE,
			width:Titanium.UI.SIZE,
			textAlign:"left",
			color:"#FFFFFF"
		});			
		descriptionView.add(labelRating, descText);
	
		// thumnbnail image of skatepark in list		
		var imageThumb = Ti.UI.createImageView({
			image: resultSet.fieldByName('Image_1'),
			left:10,
			top:10,
			height:80,
			width:80,
			borderWidth:2,
			borderColor: "#FFFFFF"		
		});
		
		// when image is clicked it opens a photoScroll of larger images
		imageThumb.addEventListener('click', function(e){
			var imagePath = new String(e.source.image);
			imagePath = imagePath.replace("1.jpg", "");
			
			var imageWrapper = function(_imagePath){
				var img = Ti.UI.createImageView({
					image: _imagePath	
				});		
							
				var imgWrapper = Ti.UI.createScrollView({
					contentWidth: 300,
					contentHeight: 150,
					backgroundColor: 'black',
					height: '100%',
					width: '100%',
					maxZoomScale:4.0
				});
				imgWrapper.add(img);
				
				
				Ti.App.addEventListener('orient', function(evt){
					if (evt.portrait===true) {
						imgWrapper.contentWidth = 300;
						imgWrapper.contentHeight = 150;
					}else{
						imgWrapper.contentWidth = Ti.UI.FILL;
						imgWrapper.contentHeight = Ti.UI.FILL;
					}			
				});
			
				return imgWrapper;
			};
				
			var photosView = Ti.UI.createScrollableView({
				showPaggingControl: true,
				views: [imageWrapper(imagePath + '1.jpg'), 
						imageWrapper(imagePath + '2.jpg'),
				 		imageWrapper(imagePath + '3.jpg'),
				 		imageWrapper(imagePath + '4.jpg')]
			});
			
			photosView.addEventListener('pinch', function(e){
				scale:2;	
			});
			
			photoWindow.add(photosView);
			photoWindow.backButtonTitle = 'List';
			nav.open(photoWindow, {animated:true});
		});

		row.add(descriptionView);
		row.add(imageThumb);		
		data.push(row);		
		tableView.setData(data);
	};
	

	// builds the initial list of parks and sorts them in ascending order by distance from current location 
	(function(){

		db = Ti.Database.open('skateMapsDB.sqlite');	
		
		// pull out all latitudes and logitudes to create one string to use with google maps
		var parksRS = db.execute('SELECT Latitude, Longitude FROM parks');
		var kmsArray = [];
		var destinationsStr = function(){
			var locStr = '';
			for (var i = 0; i < parksRS.getRowCount() - 1; i++)
			{	
				locStr += parksRS.getFieldByName('Latitude')  + ',' +
						  parksRS.getFieldByName('Longitude')  + '|';
				parksRS.next();		
			}
			locStr += parksRS.getFieldByName('Latitude')  + ',' +
						  parksRS.getFieldByName('Longitude');
			
			return locStr;
		};
	
		var url = 'http://maps.googleapis.com/maps/api/distancematrix/json?origins='+
				CURRENT_LOCATION + '&destinations='+ destinationsStr() + '&sensor=false';
						
		db.close();
		
		var element, dist;
		var xhr = Ti.Network.createHTTPClient();
		
		xhr.onload = function() 
		{
		    var mydata = JSON.parse(this.responseText);  
		    
		    for(var i = 0; i < mydata.rows.length; i++)
		    {
		    	element = mydata.rows[i];
		    
		        for(var i = 0, j = 1; i < element.elements.length; i++, j++)
		   		{
		   			dist = element.elements[i];	 
		   			// add .0j to the end of each Km value to later identify against park id
		   			// in the db (.01 should not largely reduce accuracy)  			
		   			kmsArray[i] = dist.distance.value + ('.' + 0 + j);
		    	}
		    }
		    
		    // sorts the array of distances in accending order	    
		 	kmsArray.sort(function(a,b){return a-b;});
		 		 	
			for (var i = 0; i < kmsArray.length; i++)
			{
				var pos = kmsArray[i].indexOf(".");
				var str = kmsArray[i].substr(pos + 2);
	
				db = Ti.Database.open('skateMapsDB.sqlite');
				var queryStr = 'SELECT * FROM parks WHERE id = ' + str;
				var rowsRS = db.execute(queryStr);
	
				fillTableViewRow(rowsRS, tv);	
			} 
		    db.close();				   
		};
		xhr.open('GET', url);
		xhr.send();					
	})();
	
	listWindow.add(tv);
	
	listButton.addEventListener('click', function(){
		listWindow.backButtonTitle = 'Home';	
		nav.open(listWindow, {animated:true});	
	});
	
	mapButton.addEventListener('click', function(){
		mapWindow.backButtonTitle = 'Home';
		
		db = Ti.Database.open('skateMapsDB.sqlite');
		var locRS = db.execute('SELECT * FROM parks');
		
		// add all park annotations to mapview
		for (var i = 0; i < locRS.getRowCount(); i++)
		{
			mapview.addAnnotation(Ti.Map.createAnnotation({	
				latitude: locRS.fieldByName('Latitude'),
				longitude: locRS.fieldByName('Longitude'),
				title: locRS.fieldByName('Name'),
				subtitle: parkAddress(locRS),
				pincolor: Ti.Map.ANNOTATION_RED,
				animate: true,
				leftButton: Ti.UI.iPhone.SystemButton.INFO_LIGHT,
				myid: i + 1	//unique identifyer for this annotation
			}));
			locRS.next();
		}
			
		// add current location to map
		mapview.addAnnotation(Ti.Map.createAnnotation({
			latitude: LATITUDE_BASE,
			longitude: LONGITUDE_BASE,
			title: 'You are here!',
			subtitle: CURRENT_LOCATION,
			pincolor: Ti.Map.ANNOTATION_GREEN,
			animate: true,
			myid: 0	
		}));
			
		if(mapview !== undefined)
		{
			mapview.addEventListener('complete', function(e)
			{
				mapview.region = {
			    	latitude: LATITUDE_BASE, 
			    	longitude: LONGITUDE_BASE,
				    latitudeDelta: 0.3, 
				    longitudeDelta: 0.1
	  			  };
			});
			nav.open(mapWindow, {animated:true});
		}	
			
	});
	
	mapWindow.add(mapview);
	
	mapview.addEventListener('click', function(e){
	
		var str = 'http://maps.google.com.au/?daddr='+
					 e.annotation.subtitle + '&saddr='+ CURRENT_LOCATION;
				
	 	if (e.clicksource == 'leftButton'){
			
			//Ti.API.info(e.annotation.title);
			db = Ti.Database.open('skateMapsDB.sqlite');		
			var searchTerm = "'%" + e.annotation.title + "%'";
			var searchQuery = "SELECT * FROM parks WHERE name LIKE"+ searchTerm;	
			var results = db.execute(searchQuery);
				
			if (results.rowCount > 0){
				// clear the tableView data before adding search results
				data = [];
				tv2.setData(data);						
				fillTableViewRow(results,tv2);						
				searchResultWindow.add(tv2);
				searchResultWindow.backButtonTitle = 'Back';
				nav.open(searchResultWindow, {animated:true});
			}
			else{
				Titanium.UI.createAlertDialog({
					title:'Search Results', 
					message:'Sorry your search \"' + e.value + '\" returned no results. Please check your spelling and try again.'}).show();
			}
			db.close();				
		}
		
	});


	var searchBar = Titanium.UI.createSearchBar({
		barColor: "#363F45",
		showCancel:true,
		height:43,
		hintText: 'Park Name, City, Rating, State',
		top:0
	});
	searchBar.hide();
	
	homeWindow.add(searchBar);
	
	var search = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.SEARCH
	});
	search.addEventListener('click', function(){		
		searchBar.show();
		searchBar.focus();
	});
	
	homeWindow.leftNavButton = search;
	
	// SEARCH BAR EVENTS
	searchBar.addEventListener('cancel', function(e){
		searchBar.blur();
		searchBar.hide();
	});
	searchBar.addEventListener('return', function(e)
	{		
		db = Ti.Database.open('skateMapsDB.sqlite');		
		var searchTerm = "'%" + e.value + "%'";
		var searchQuery = "SELECT * FROM parks WHERE name LIKE "+ searchTerm +
						  "OR city LIKE" + searchTerm +
						  "OR suburb LIKE" + searchTerm +
						  "OR state LIKE" + searchTerm +
						  "OR star_rating LIKE" + searchTerm;
		
		var results = db.execute(searchQuery);
			
		if (results.rowCount > 0){
			// clear the tableView data before adding the new search results
			data = [];
			tv2.setData(data);
			
			for (var i = 0; i < results.getRowCount(); i++)
			{							
				fillTableViewRow(results,tv2);				
				results.next();
			}
			searchResultWindow.add(tv2);
			searchResultWindow.backButtonTitle = 'Home';
			nav.open(searchResultWindow, {animated:true});
		}
		else{
			Titanium.UI.createAlertDialog({
				title:'Search Results', 
				message:'Sorry your search \"' + e.value + '\" returned no results. Please check your spelling and try again.'}).show();
		}
					
		searchBar.blur();
		db.close();
	});
	
	masterWindow.add(nav);
	masterWindow.open();

})();
// END APPLICATION