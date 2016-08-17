var World = {

	PATH_INDICATOR : "assets/directionIndicator.png",
	PATH_MODEL_WT3 : "assets/arrow.wt3",
	MSG_MODEL_VISIBLE : "Thread Ahead!",
	MSG_MODEL_NOTVISIBLE : "Invisible Thread!",

	init: function initFn() {
		
		// wait for first location signal before creating the experience to ensure you know user's location during setup process
		AR.context.onLocationChanged = function(latitude, longitude, altitude, accuracy){

			// store user's location so you have access to it at any time
			World.myLocation = {"latitude": latitude, "longitude" : longitude, "altitude" : altitude };

			// create model around the user on very first location update
			if (!World.created) {
				document.getElementById('loadingMessage').innerHTML = 'Loading...';
				World.created = true;
				World.createModelAtLocation(World.myLocation);
			}
		};

		
	},

	createModelAtLocation: function createModelAtLocationFn(location) {

        var myHouse = new AR.GeoLocation(37.784277, -122.403224)
        var distance = myHouse.distanceToUser();

		// place object around the user, in this case just a few meters next to the user. Note that the object will stay where it is, so user can move around it.
		World.modelGeoLocation = new AR.GeoLocation(myHouse.latitude, myHouse.longitude, AR.CONST.UNKNOWN_ALTITUDE);
		
		// load model
        
		World.model = new AR.Model(World.PATH_MODEL_WT3, {

			// trigger animation once asset was loaded
			onLoaded: function() {

				// trigger loading of directin indicator
		        World.indicatorImage = new AR.ImageResource(World.PATH_INDICATOR);
                                   
		        // create indicator drawable using the image resource
		        World.indicatorDrawable = new AR.ImageDrawable(World.indicatorImage,0.5, {
		            verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
		        });

                World.indicatorDrawable2 = new AR.ImageDrawable(World.indicatorImage,5, {
                    verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP
                });

		        // define model as geoObject, including its direction indicator
				World.modelGeoObject = new AR.GeoObject(World.modelGeoLocation, {
                                        
		            drawables: {
                                                        
//		               cam: [World.model],
//                     cam is now blue arrow instead of 3d obj
                                                        
		               indicator: [World.indicatorDrawable],
                       cam : [World.indicatorDrawable2]
		            },
		            onEnterFieldOfVision: function() {
		            	World.modelVisible = true;
		            	document.getElementById('loadingMessage').innerHTML = "Distance to thread: " + Math.round((distance/1609.34)*100)/100 + " mi";
		            },
		            onExitFieldOfVision: function() {
		            	World.modelVisible = false;
		            	document.getElementById('loadingMessage').innerHTML = World.MSG_MODEL_NOTVISIBLE;
                                                        

		            },
		            onClick: function() {
		            	console.log('clicked the model');
		            }
		        });

			    World.worldLoaded();

			},
			onError: function(err) {
				World.worldError('Could not load model file.');
			},
			scale: {
				x: 3.3,
				y: 3.3,
				z: 3.3
			},
			translate: {
				x: 0,
				y: 0,
				z: 0
			},
			rotate: {
                roll:-25, //z
				heading: 90, //x
				tilt: 180 //y
			}
		});
	},

	worldLoaded: function worldLoadedFn() {
		World.loaded = true;
		document.getElementById('loadingMessage').innerHTML = World.modelVisible ? World.MSG_MODEL_VISIBLE : World.MSG_MODEL_NOTVISIBLE;
	},

	worldError: function worldErrorFn(msg) {
		document.getElementById('loadingMessage').innerHTML = msg ? msg : 'unexpected error';
	},

  showLocation: function showLocationFn() {
    document.getElementById('loc').innerHTML = "Current location: " + World.myLocation.latitude + ", " + World.myLocation.longitude;
	}
};

World.init();

var current_location = new AR.Geolocation(World.myLocation.latitude,World.myLocation.longitude);
var model_location = new AR.Geolocation(37.780694, -122.403704);
var distance = model_location.distanceTo(current_location);
console.log(distance);

