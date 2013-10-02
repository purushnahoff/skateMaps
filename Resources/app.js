(function() {
	var masterWindow = Ti.UI.createWindow();
	
	// Global Constants
	var CURRENT_LOCATION = "170 Kessles road, Nathan QLD 4111";
	var LATITUDE_BASE = -27.552359;
	var LONGITUDE_BASE = 153.053627;
	
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
		backgroundImage:'/images/purush_fs_crook.jpg',
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
	
		
	aboutButton.addEventListener('click', function(){
		win4.backButtonTitle = 'Back';
		
		var aboutText = 
		Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, 'about.txt');
		if(aboutText.exists())
		{
			var textFromFile = aboutText.read().text;
				// content for the About page
			var aboutLabel = Ti.UI.createLabel({
				color: '#FF0000',
				text: textFromFile,
				font:{fontSize:12,fontFamily:'default'},
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				top: 30,
				width: Ti.UI.SIZE, height: Ti.UI.SIZE
			});
			win4.add(aboutLabel);
		}
		
		
		nav.open(win4, {animated:true});
	});
	
	// home page list button
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
	
	listButton.addEventListener('click', function(){
		win2.backButtonTitle = 'Home';
		nav.open(win2, {animated:true});
	});
	
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
	
	// install and open the skateMaps database	
	var db = Ti.Database.install('/mydata/skateMapsDB.sqlite', 'skateMapsDB.sqlite');	
	var tv = Ti.UI.createTableView({minRowHeight:50});
	var data = [];
	var parksRS = db.execute('SELECT Id, Name, Address, Rating, Description, Latitude, \
	 			Longitude, Image_thumb, Image_1, Image_2, Image_3, Image_4 FROM parks');
		
	
	//////////////////////////////////////////////////////////////////////
	// set the list view with data from DB
	for (var i = 0; i < parksRS.getRowCount(); i++)
	{

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
			text: parksRS.fieldByName('Name'),
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
			text: parksRS.fieldByName('Address'),
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
		//	color:"#363F45",
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
			
			db = Ti.Database.open('skateMapsDB.sqlite');
			var queryStr = "SELECT address FROM parks WHERE id =" + (e.index + 1);
			var addressRS = db.execute(queryStr);
			var str = 'http://maps.google.com.au/?daddr='+
					addressRS.getFieldByName('address') + '&saddr='+ CURRENT_LOCATION;
				
			var webview = Ti.UI.createWebView({url:str});	
			win6.add(webview);
			win6.backButtonTitle = 'back';
			nav.open(win6, {animated:true});

			db.close();
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
			if (parksRS.fieldByName('Rating') === 1){
				labelRating.add(star(pos1));	
			}
			else if (parksRS.fieldByName('Rating') === 2){
				labelRating.add(star(pos1),star(pos2));	
			}
			else if (parksRS.fieldByName('Rating') === 3){
				labelRating.add(star(pos1),star(pos2),star(pos3));	
			}
			else if (parksRS.fieldByName('Rating') === 4){
				labelRating.add(star(pos1),star(pos2),star(pos3),star(pos4));	
			}
			else if (parksRS.fieldByName('Rating') === 5){
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
			text: parksRS.fieldByName('Description'),
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
			image: parksRS.fieldByName('Image_1'),
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
		parksRS.next();		
	}	
		
	parksRS.close();
	db.close();
	tv.setData(data);

	// 
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
				subtitle: locRS.fieldByName('Address'),
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
			subtitle: "Mt Gravatt",
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
	db.close();
	win5.add(mapview);
	
	mapview.addEventListener('click', function(e){
	
		var str = 'http://maps.google.com.au/?daddr='+
					 e.annotation.subtitle + '&saddr='+ CURRENT_LOCATION;
				
		if (e.clicksource == 'leftButton'){
			//	Ti.API.info("Annotation " + e.title + ", left button clicked.");
				var webview = Ti.UI.createWebView({url:str});	
				win6.add(webview);
				win6.backButtonTitle = 'back';
				nav.open(win6, {animated:true});

		}
		else if (e.clicksource == 'leftPane'){
			Ti.API.info("Annotation " + e.title + ", leftPane clicked.");
		}
		else if (e.clicksource == 'leftView'){
			Ti.API.info("Annotation " + e.title + ", leftView clicked.");			
		}
		
	});
		
	win2.add(tv);
	win1.add(listButton);
	win1.add(mapButton);
	masterWindow.add(nav);
	masterWindow.open();

})();
