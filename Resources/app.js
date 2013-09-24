(function() {
	var masterWindow = Ti.UI.createWindow();
	
	// Global Constants
	var LATITUDE_BASE = -27.552359;
	var LONGITUDE_BASE = 153.053627;
	
	
	//Home screen
	var win1 = Titanium.UI.createWindow({
		title:"SkateMaps",
		backgroundImage: '/images/pushing_img1.jpg',
		backgroundColor: '#000000',
		navBarHidden: false
		
	});
	
	var nav = Ti.UI.iPhone.createNavigationGroup({
		window: win1,				
	});
		
	var win2 = Ti.UI.createWindow({
		title:"SkateMaps",
		backgroundColor:"#000000",
		navBarHidden: false
		
	});
	
	var win3 = Ti.UI.createWindow({
		title:"SkateMaps",
		backgroundColor: '#000000',
		navBarHidden: false
		
	});
	
	var win4 = Ti.UI.createWindow({
		title:"About",
		backgroundColor: '#000000',
		navBarHidden: false
		
	});
	
	var win5 = Ti.UI.createWindow({
		title:"Map",
		backgroundColor:"#FFFFFF",
		navBarHidden: false
		
	});
	
	// content for the About page
	var aboutLabel = Ti.UI.createLabel({
		color: '#900',
		text: 'Some info about the app \n-How to use it\n-The developer name\n-Contact email to report bugs',
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		top: 30,
		width: Ti.UI.SIZE, height: Ti.UI.SIZE
	});
	
	win4.add(aboutLabel);
	
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
	
		
	aboutButton.addEventListener('click', function(){
		win4.backButtonTitle = 'Back';
		nav.open(win4, {animated:true});
	});
	
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
		selectedColor: '#B200000',
		//backgroundSelectedImage: '/images/skate_silhouette.jpg'
			
		
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
		selectedColor: '#B200000'
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
			
		// 
		var droppinButton = Ti.UI.createButton({
			backgroundImage: '/images/google_pin.png',
			top: 5,
			right: 10,
			width: 20,
			height: 35,
		});
		
		var droppinButtonLabel = Titanium.UI.createLabel({	
			top:0,	
			right: 0,
			height:50,
			width:'100%',
			backgroundColor:"#363F45"
		});
		droppinButtonLabel.add(labelAddress);
		droppinButtonLabel.add(droppinButton);
		
		
		// star images used for the rating system
		var star1 = Ti.UI.createImageView({
			image: '/images/star_yellow1.png',
			top: 5,
			left:0,
			height:25,
			width:25,
			backgroundColor:"#363F45"
			
		});
		
		var star2 = Ti.UI.createImageView({
			image: '/images/star_yellow1.png',
			top: 5,
			left:25,
			height:25,
			width:25,
			backgroundColor:"#363F45"
			
		});
		
		var star3 = Ti.UI.createImageView({
			image: '/images/star_yellow1.png',
			top: 5,
			left:50,
			height:25,
			width:25,
			backgroundColor:"#363F45"
			
		});
		
		var star4 = Ti.UI.createImageView({
			image: '/images/star_yellow1.png',
			top: 5,
			left:75,
			height:25,
			width:25,
			backgroundColor:"#363F45"
			
		});
		
		var star5 = Ti.UI.createImageView({
			image: '/images/star_yellow1.png',
			top: 5,
			left:100,
			height:25,
			width:25,
			backgroundColor:"#363F45"
			
		});
			
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
	
			if (parksRS.fieldByName('Rating') === 1){
				labelRating.add(star1);	
			}
			else if (parksRS.fieldByName('Rating') === 2){
				labelRating.add(star1,star2);	
			}
			else if (parksRS.fieldByName('Rating') === 3){
				labelRating.add(star1,star2,star3);	
			}
			else if (parksRS.fieldByName('Rating') === 4){
				labelRating.add(star1,star2,star3,star4);	
			}
			else if (parksRS.fieldByName('Rating') === 5){
				labelRating.add(star1,star2,star3,star4,star5);
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
		
		// thumnbnail image of skatepark		
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
		
		// when image is clicked it opens a photoscroll of larger images
		imageThumb.addEventListener('click', function(e){
			var imagePath = new String(e.source.image);
			imagePath = imagePath.replace("1.jpg", "");
			Ti.API.info(imagePath);
							
			var img1 = Ti.UI.createImageView({
				image: imagePath + '1.jpg'		
			});
			
			var img1Wrapper = Ti.UI.createScrollView({
				contentWidth: 300,
				contentHeight: 150,
				backgroundColor: 'black',
				height: '100%',
				width: '100%',
				maxZoomScale:4.0
			});
			img1Wrapper.add(img1);
			
			var img2 = Ti.UI.createImageView({
				image: imagePath + '2.jpg'
			});
			
			var img2Wrapper = Ti.UI.createScrollView({
				contentWidth: 300,
				contentHeight: 150,
				backgroundColor: 'black',
				height: '100%',
				width: '100%',
				maxZoomScale:4.0
			});
			img2Wrapper.add(img2);
			
			var img3 = Ti.UI.createImageView({
				image: imagePath + '3.jpg'
			});
			
			var img3Wrapper = Ti.UI.createScrollView({
				contentWidth: 300,
				contentHeight: 150,
				backgroundColor: 'black',
				height: '100%',
				width: '100%',
				maxZoomScale:4.0
			});
			img3Wrapper.add(img3);
			
			var img4 = Ti.UI.createImageView({
				image: imagePath + '4.jpg'
			});
			
			var img4Wrapper = Ti.UI.createScrollView({
				contentWidth: 300,
				contentHeight: 150,
				backgroundColor: 'black',
				height: '100%',
				width: '100%',
				maxZoomScale:4.0
			});
			img4Wrapper.add(img4);
	
			var photosView = Ti.UI.createScrollableView({
				showPaggingControl: true,
				views: [img1Wrapper, img2Wrapper, img3Wrapper, img4Wrapper]
			});
			photosView.addEventListener('pinch', function(e){
				scale:2;
			});
			
			win3.add(photosView);
			win3.backButtonTitle = 'List';
			nav.open(win3, {animated:true});
		});
		
		nameAndAddressView.add(labelName);
		nameAndAddressView.add(droppinButtonLabel);
		//nameAndAddressView.add(labelAddress);
		
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
		Ti.API.info("Annotation " + e.title + " clicked, id: " + e.annotation.myid);
		
		if (e.clicksource == 'leftButton' || e.clicksource == 'leftPane' ||
		e.clicksource == 'leftView'){
			Ti.API.info("Annotation " + e.title + ", left button clicked.");
		}
		
	});
	
	
				
/////////////////////////////////////////////////////////////////////////////				
				
	
		
	win2.add(tv);
	win1.add(listButton);
	win1.add(mapButton);
	masterWindow.add(nav);
	masterWindow.open();

})();
