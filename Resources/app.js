(function() {
	var masterWindow = Ti.UI.createWindow();
	
	(function(){ Titanium.UI.createAlertDialog({
	 	title: 'SkateMaps', 
	 	message: 'This app uses your current location. Please enable location services in settings'});
	 })();	
	// Global Constants with default values
	var CURRENT_LOCATION = "";
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
	 
	  	//LONGITUDE_BASE = e.coords.longitude;
	    //LATITUDE_BASE = e.coords.latitude;
	    
	    // now convert the coordinates into a street address 
	    var addrUrl = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng="+ LATITUDE_BASE +","+ LONGITUDE_BASE;
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
		                   // Ti.API.info("street number : "+response.results[0].address_components[i].long_name);
		                    break;
		                case "route":
		                	CURRENT_LOCATION += ' ' + response.results[0].address_components[i].long_name;
		                   // Ti.API.info("street name : "+response.results[0].address_components[i].long_name);
		                    break;
		                case "locality":
		                	CURRENT_LOCATION += ', ' +response.results[0].address_components[i].long_name;
		                   // Ti.API.info("city name : "+response.results[0].address_components[i].long_name);
		                    break;
		                case "administrative_area_level_1":
		                	CURRENT_LOCATION += ', ' +response.results[0].address_components[i].long_name;
		                  //  Ti.API.info("state name : "+response.results[0].address_components[i].long_name);
		                    break;	  
		                }
		        }
		    }else{
		    	Titanium.UI.createAlertDialog({title: 'Error', message: 'Unable to find Address'});
		    }
	  
		};    
	});

	//Home screen
	var win1 = Titanium.UI.createWindow({
		title:"SkateMaps",
		backgroundImage: '/images/pushing_img1.jpg',
		backgroundColor: '#000000',
		navBarHidden: false,
		barColor: '#363F45'		
	});
	
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: win1				
	});
		
	var win2 = Ti.UI.createWindow({
		title:"SkateMaps",
		backgroundColor:"#000000",
		navBarHidden: false,
		barColor: '#363F45'		
	});
	
	var win3 = Ti.UI.createWindow({
		title:"SkateMaps",
		backgroundColor: '#000000',
		navBarHidden: false,
		barColor: '#363F45'		
	});
	
	var win4 = Ti.UI.createWindow({
		title:"SkateMaps",
		backgroundColor: '#000000',
		navBarHidden: false,
		barColor: '#363F45'	
	});
	
	var win5 = Ti.UI.createWindow({
		title:"SkateMap",
		backgroundColor:"#FFFFFF",
		navBarHidden: false,
		barColor: '#363F45'	
	});
	
	var win6 = Ti.UI.createWindow({
		title:"SkateMap",
		backgroundColor:"#FFFFFF",
		navBarHidden: false,
		barColor: '#363F45'
	});
	
	var win7 = Ti.UI.createWindow({
		title:"SkateMaps",
		backgroundColor:"#000000",
		navBarHidden: false,
		barColor: '#363F45'		
	});

	var actInd = Ti.UI.createActivityIndicator({
			width: 50, height: 50, message: 'loading...',color: '#ff0000'
	});
	
	// about button in nav bar available from all windows
	var aboutButton = Titanium.UI.createButton({
		title:'About',
		height:33,
		width:33,	
	});
	win1.rightNavButton = aboutButton;
	win2.rightNavButton = aboutButton;
	win3.rightNavButton = aboutButton;
	win5.rightNavButton = aboutButton;
	win6.rightNavButton = aboutButton;
	win7.rightNavButton = aboutButton;
	
	var aboutWebView = Ti.UI.createWebView({
		url:'about.html',
		backgroundColor: '#000000'			
	});
	win4.add(aboutWebView);

	aboutButton.addEventListener('click', function(){
		win4.backButtonTitle = 'Back';		
		nav.open(win4, {animated:true});
	});
	
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


	// takes a resultSet and returns the address as a string
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
		
	
	// create the table view for the list of parks	
	var tv = Ti.UI.createTableView({backgroundColor: '#000000'});
	var data = [];
	// adds a park to the tableView
	var fillTableViewRow = function(resultSet){
		
		var row = Ti.UI.createTableViewRow({
			
			height: Titanium.UI.SIZE,
			className:"row",
			backgroundColor: '#000000'			
		});

		var nameAndAddressView = Ti.UI.createView({
			height: Titanium.UI.SIZE,
			layout:'vertical',
			left:100,
			top:10,
			bottom:10,
			right:10
		});	
		
		var descriptionView = Ti.UI.createView({
			height:Titanium.UI.SIZE,
			layout:'vertical',
			left:10,
			top:85,
			bottom:10,
			right:10
		});	
		
		var labelName = Titanium.UI.createLabel({
			text: resultSet.fieldByName('Name'),
			font: {
				fontSize: '16dp',
				fontWeight: 'bold'	
			},
			left:0,
			height:40,
			width:"100%",
			textAlign:"center",
			color:"#FFFFFF",
			backgroundColor:"#363F45"
		});
		

		var labelAddress = Titanium.UI.createLabel({
			text: parkAddress(resultSet),
			font: {
				fontSize: '12dp',	
			},
			left:5,
			height:50,
			width:180,
			textAlign:"left",
			color:"#FFFFFF",
			backgroundColor:"#363F45",
			
		});
			
		// google droppin icon 
		var droppin = Ti.UI.createImageView({
			image: '/images/google_pin.png',
			top: 5,
			right: 10,
			width: 20,
			height: 35,
			zindex: 1
		});
		
		// blank label which I added the address and droppin icon to, to help with layout
		var droppinLabel = Titanium.UI.createLabel({	
			top:0,	
			right: 0,
			height:50,
			width:'100%',
			backgroundColor:"#363F45",
					
		});
		droppinLabel.add(labelAddress);
		droppinLabel.add(droppin);
		
		// this opens google maps in a new window and passes it the park address
		// and the mock current location
		// -note: the user can click on the address or droppin icon to get directions
		droppinLabel.addEventListener('click',function(e){
			var json = JSON.stringify(e.source);
			var start = json.indexOf(':');
			var end = json.indexOf('left');
			end -= 5;
			var address = json.substr(start + 2, end - start);
	
			var str = 'http://maps.google.com.au/?daddr='+
					address + '&saddr='+ CURRENT_LOCATION;
				
			var webview = Ti.UI.createWebView({url:str});	
			win6.add(webview);
			win6.backButtonTitle = 'back';
			nav.open(win6, {animated:true});		
		});
	
		
		// creates a image view with one star and takes the position of the star as an argument
		var star = function(leftPosition){
			var star = Ti.UI.createImageView({
				image: '/images/star_yellow1.png',
				top: 5,
				left:leftPosition,
				height:25,
				width:25,
				backgroundColor:"#363F45"});			
			return star;		
		};
		
		var labelRating = Titanium.UI.createLabel({
			top: 15,
			left:0,
			height:40,
			width:"100%",
			color:"#FFFFFF",
			backgroundColor:"#363F45"
		});		
		
		// determines how many stars for each skatepark and adds them 
		// to the ratings label
		(function (){			
			var pos1 = 0; var pos2 = 25; var pos3 = 50; var pos4 = 75; var pos5 = 100;
			if (resultSet.fieldByName('Star_Rating') === '1 stars'){
				labelRating.add(star(pos1));	
			}
			else if (resultSet.fieldByName('Star_Rating') === '2 stars'){
				labelRating.add(star(pos1),star(pos2));	
			}
			else if (resultSet.fieldByName('Star_Rating') === '3 stars'){
				labelRating.add(star(pos1),star(pos2),star(pos3));	
			}
			else if (resultSet.fieldByName('Star_Rating') === '4 stars'){
				labelRating.add(star(pos1),star(pos2),star(pos3),star(pos4));	
			}
			else if (resultSet.fieldByName('Star_Rating') === '5 stars'){
				labelRating.add(star(pos1),star(pos2),star(pos3),star(pos4),star(pos5));
			}		
		})();
			
		// grey label behind description text
		var labelDesc = Titanium.UI.createLabel({	
			height: Titanium.UI.SIZE,
			width:'100%',
			backgroundColor:"#363F45"
		});
		
		// description text on top of above lableDesc
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
			color:"#FFFFFF",
			backgroundColor:"#363F45"
		});			
		labelDesc.add(descText);	
		
	
		// thumnbnail image of skatepark in list		
		var imageThumb = Ti.UI.createImageView({
			image: resultSet.fieldByName('Image_1'),
			left:10,
			top:10,
			height:80,
			width:80,
			borderWidth:2,
			borderRadius: 3,
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
			
			win3.add(photosView);
			win3.backButtonTitle = 'List';
			nav.open(win3, {animated:true});
		});

		nameAndAddressView.add(labelName);
		nameAndAddressView.add(droppinLabel);	
		descriptionView.add(labelRating, labelDesc);
		row.add(nameAndAddressView, descriptionView);
		row.add(imageThumb);		
		data.push(row);
		tv.setData(data);	
	};
	
	// builds the initial list of parks and sorts them in ascending order by distance from current location 
	var buildList = function(){
	
		// clear the tableView data before adding search results
		data = [];
		tv.setData(data);
		// install and open the skateMaps database	
		var db = Ti.Database.install('/mydata/skateMapsDB.sqlite', 'skateMapsDB.sqlite');	
		
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
	
				fillTableViewRow(rowsRS);	
			} 
		    db.close();
				   
		};
		xhr.open('GET', url);
		xhr.send();					
	};
	
	function wait (milis){
		var date = new Date();
		var curDate = null;
		
		do{
			curDate = Date();
		} while(curDate-date < millis);
	}
	
	listButton.addEventListener('click', function(){
		win2.backButtonTitle = 'Home';
		buildList();
		
		if(win2.children){
			while (win2.children.length != 0){
				var len = win2.children.length;
				try{
						win2.remove(win2.children[0]);
						wait(10);
				}catch(e){
					
				}
			}		
		}
		
		
		win2.add(actInd);
		actInd.show();
		nav.open(win2, {animated:true});	
		setTimeout(function(){
			win2.add(tv);
			nav.open(win2, {animated:true});
			actInd.hide();
		}, 900);
		
	});
	
	
	mapButton.addEventListener('click', function(){
		win5.backButtonTitle = 'Home';
		
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
			myid: 0	//unique identifyer for this annotation
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
			nav.open(win5, {animated:true});
		}	
			
	});
	
	win5.add(mapview);
	
	mapview.addEventListener('click', function(e){
	
		var str = 'http://maps.google.com.au/?daddr='+
					 e.annotation.subtitle + '&saddr='+ CURRENT_LOCATION;
				
	 	if (e.clicksource == 'leftButton'){
			
			Ti.API.info(e.annotation.title);
			db = Ti.Database.open('skateMapsDB.sqlite');		
			var searchTerm = "'%" + e.annotation.title + "%'";
			var searchQuery = "SELECT * FROM parks WHERE name LIKE"+ searchTerm;	
			var results = db.execute(searchQuery);
				
			if (results.rowCount > 0){
				// clear the tableView data before adding search results
				data = [];
				tv.setData(data);						
				fillTableViewRow(results);						
				win7.add(tv);
				win7.backButtonTitle = 'Home';
				nav.open(win7, {animated:true});
			}
			else{
				Titanium.UI.createAlertDialog({
					title:'Search Results', 
					message:'Sorry your search \"' + e.value + '\" returned no results. Please check your spelling and try again.'}).show();
			}
			db.close();				
		}
		
	});
///////////////////////////////////////////////////////////////////////////////////////////		
///////////////////////////////////////////////////////////////////////////////////////////

	
	var searchBar = Titanium.UI.createSearchBar({
		barColor: "#363F45",
		showCancel:true,
		height:43,
		hintText: 'Park Name, City, Rating, State',
		top:0
	});
	searchBar.hide();
	win1.add(searchBar);
	
	var search = Titanium.UI.createButton({
		systemButton:Titanium.UI.iPhone.SystemButton.SEARCH
	});
	search.addEventListener('click', function(){		
		searchBar.show();
		searchBar.focus();
	});
	
	win1.leftNavButton = search;
	
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
			// clear the tableView data before adding search results
			data = [];
			tv.setData(data);
			
			for (var i = 0; i < results.getRowCount(); i++)
			{							
				fillTableViewRow(results);				
				results.next();
			}
			win7.add(tv);
			win7.backButtonTitle = 'Home';
			nav.open(win7, {animated:true});
		}
		else{
			Titanium.UI.createAlertDialog({
				title:'Search Results', 
				message:'Sorry your search \"' + e.value + '\" returned no results. Please check your spelling and try again.'}).show();
		}
					
		searchBar.blur();
		db.close();
	});
	
///////////////////////////////////////////////////////////////////////////////////////////	
///////////////////////////////////////////////////////////////////////////////////////////		
	win1.add(listButton);
	win1.add(mapButton);
	masterWindow.add(nav);
	masterWindow.open();

})();
