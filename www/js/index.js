/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var expresscaredomain = "ndhsguam.com";
var app_version="1.0.4";
var baseUrl = "http://ndhsguam.com/index_mobile";
var googleanalyticsid = 'UA-57301113-38';
var google_project_id = "973344420171";
var pushapi_domain = "http://getsetpush.com/dev1/";
var pushapi_appcode = "GSP-052616-9";
var ref;
var urlParam = "";

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		document.addEventListener("offline", this.onOffline, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("resume", this.onResume, false);
    },
	onOffline: function() {	
		window.location  = "park.html";
		//alert('Cannot connect to server!');
		//navigator.app.exitApp();		
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		
        app.receivedEvent('deviceready');
		sessionStorage.openedIAB = 1;	
		sessionStorage.page= undefined;		
    },
	onResume: function() {
		//setTimeout(function(){execcssinsideiap1('body{display:none;}');},100);
		//execinsideiap1('location.reload();');
		execinsideiap1('location.href=location.href');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		var isIABLoaded=0;
		window.plugins.uniqueDeviceID.get(success, fail);
		var udid;
		function success(uuid)
		{
			//alert(uuid);
			udid = uuid;
		};
		function fail()
		{
			alert("fail");
		};	
			
		var push = PushNotification.init({
            "android": {
                "senderID": google_project_id
            },
            "ios": {"alert": "true", "badge": "true", "sound": "true"}, 
            "windows": {} 
        });
		
		push.on('registration', function(data) {
            console.log("registration event");
			var regID = data.registrationId;
            console.log(JSON.stringify(data));
			
			var d = new Date();
			var randomtime = d.getTime();
			
			urlParam = "?device="+device.model+"&device_id="+udid+"&device_version="+device.version+"&device_os="+device.platform+"&device_notification_id="+regID+"&app_version="+app_version+"&randomier="+randomtime+"&jump_to=";
		
			var networkState = checkConnection();		
			if (networkState == Connection.NONE) {				
					setTimeout(function(){ window.location  = "park.html"; //alert('Cannot connect to server!');
					}, 5000);
			}
			else{		
				$.post( pushapi_domain+"device_register", {
					'code' : pushapi_appcode
					,'os' : device.platform
					,'identifier' : udid
					,'push_identifier' : regID
					,'ok' : 1
				}, function(data) {
					//alert(data);
				  //console.log( data.name ); // John
				  //console.log( data.time ); // 2pm
				});
				
				ref = cordova.InAppBrowser.open(baseUrl+urlParam, '_blank', 'location=no,hidden=yes,zoom=no,toolbar=no,suppressesIncrementalRendering=yes,disallowoverscroll=yes');
				
				ref.addEventListener("loadstop", function() {
					if(isIABLoaded==0){
						setTimeout(function(){ ;ref.show(); 
							}, 5000);						
						isIABLoaded=1;
					}
						//alert("loading stop");
						 //navigator.notification.activityStop();				
				});
				

				ref.addEventListener("loadstart", closeInAppBrowser);
				
				ref.addEventListener("loaderror", loaderrorcheck);
				ref.addEventListener('exit', function(event) {			
					if (sessionStorage.openedIAB &&  sessionStorage.openedIAB == 1) {
						sessionStorage.openedIAB = 0;
						//navigator.app.exitApp(); 
						if(navigator.app){
							navigator.app.exitApp();
						}else if(navigator.device){
							navigator.device.exitApp();
							
						}
					}
				});
				ref.addEventListener('exit', function(event) {			
					if (sessionStorage.openedIAB &&  sessionStorage.openedIAB == 1) {
						sessionStorage.openedIAB = 0;
						navigator.app.exitApp(); 
					}
				});
			}	 		
						
		});
		
		push.on('notification', function(data) {
        	console.log("notification event");
            console.log(JSON.stringify(data));
			var regID = "";
			window.plugins.uniqueDeviceID.get(success, fail);
			var udid;
			var allegatourl = encodeURIComponent(data.additionalData.allegato);
			function success(uuid)
			{
				udid = uuid;
			};
			function fail()
			{
				alert("fail");
			};	
			var push = PushNotification.init({
				"android": {
					"senderID": google_project_id
				},
				"ios": {"alert": "true", "badge": "true", "sound": "true"}, 
				"windows": {} 
			});
           push.on('registration', function(data) {
				var regID = data.registrationId;	
				
				var d = new Date();
				var randomtime = d.getTime();	
				
				var param_url = "?device="+device.model+"&device_id="+udid+"&device_version="+device.version+"&device_os="+device.platform+"&device_notification_id="+regID+"&app_version="+app_version+"&randomier="+randomtime+"&jump_to=";	
							
				var jumptourl = baseUrl+param_url+allegatourl;
			
				var networkState = checkConnection();		
				if (networkState == Connection.NONE) {				
						setTimeout(function(){ window.location  = "park.html"; //alert('Cannot connect to server!');
						}, 5000);
				}
				else{
					
					$.post( pushapi_domain+"device_register", {
						'code' : pushapi_appcode
						,'os' : device.platform
						,'identifier' : udid
						,'push_identifier' : regID
						,'ok' : 1
					}, function(data) {
						//alert(data);
					  //console.log( data.name ); // John
					  //console.log( data.time ); // 2pm
					});
					
					ref = cordova.InAppBrowser.open(jumptourl, '_blank', 'location=no,hidden=yes,zoom=no,toolbar=no,suppressesIncrementalRendering=yes,disallowoverscroll=yes');
								   
					ref.addEventListener("loadstop", function() {
							ref.show();		
							
					}); 
					
					ref.addEventListener("loadstart", closeInAppBrowser);
			
					ref.addEventListener("loaderror", loaderrorcheck);
					
					ref.addEventListener('exit', function(event) {			
						if (sessionStorage.openedIAB &&  sessionStorage.openedIAB == 1) {
							sessionStorage.openedIAB = 0;
							//navigator.app.exitApp(); 
							if(navigator.app){
								navigator.app.exitApp();
							}else if(navigator.device){
								navigator.device.exitApp();
								
							}
						}
					});
					ref.addEventListener('exit', function(event) {			
						if (sessionStorage.openedIAB &&  sessionStorage.openedIAB == 1) {
							sessionStorage.openedIAB = 0;
							navigator.app.exitApp(); 
						}
					});
				}				
			});
		});
		
		push.on('error', function(e) {
            console.log("push error");
        });	
		
		window.analytics.startTrackerWithId(googleanalyticsid);
		window.analytics.trackView('Home Screen');
		window.analytics.trackEvent('Home', 'DeviceReady', 'Hits', 1); 
    }	
};

function checkConnection() {
	var networkState = navigator.network.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = 'No network connection';
						  
	return networkState;
			  
}

function loaderrorcheck(event) {
	if(event.url.match("tel:") || event.url.match("mailto:"))
	{	
		setTimeout(function(){execcssinsideiap1('body{display:none;}');},100);
		execinsideiap1('history.back();');
		setTimeout(function(){execcssinsideiap1('body{display:none;}');},100);
		setTimeout(function(){execinsideiap1('location.reload(true);');},500);
	}
	else{
		//alert('error: ' + event.url);	
	}
}

function closeInAppBrowser(event) {
	alert(event.url);
	//setTimeout(function(){execcssinsideiap1('body{background:#BBB;}');},100);
	
	//execcssinsideiap1('body{background:#BBB;}');
	//execinsideiap1('document.body.innerHTML = "";');
	//document.getElementById('div1').style.display = 'block';
	//#preloader, #status
	execinsideiap1("document.getElementById('preloader').style.display = 'block';document.getElementById('status').style.display = 'block';");
	
	var extension = event.url.substr(event.url.lastIndexOf('.')+1);
	if (event.url.match("/closeapp")) {
		//alert(event.url.match("/closeapp"));
		ref.close();
	}
	else if(extension=="pdf" || extension=="docx" || extension=="xlsx"){
		var openpdf = confirm("Clicking this link will download the document to your device. You will need to re-enter the app by clicking the app icon on your device.");
		if(openpdf==true){
			iap1 = window.open(event.url, "_system",null);
		}
		execinsideiap1('history.back();location.reload(true);');
		iap1.addEventListener('loadstart', closeInAppBrowser);
		iap1.addEventListener('loaderror', loaderrorcheck);
	}
	else if(event.url =='http://www.ndhsguam.com/?mainsite') {alert("I'm inside.");
		iap1 = window.open(event.url, "_system",null);
		execinsideiap1('history.back();location.reload();');
		iap1.addEventListener('loadstart', closeInAppBrowser);
		iap1.addEventListener('loaderror', loaderrorcheck);
	}
	else if (!event.url.match(expresscaredomain) && event.url!="" && !event.url.match("tel:")) {
		iap1 = window.open(event.url, "_system",null);
		execinsideiap1('history.back();location.reload();');
		iap1.addEventListener('loadstart', closeInAppBrowser);
		iap1.addEventListener('loaderror', loaderrorcheck);
	}
};
function execinsideiap1(pcode) {
	ref.executeScript({
		code: pcode
	}, function() {});
}
function execcssinsideiap1(pcode) {
		ref.insertCSS({
			code: pcode
		}, function(
		) {});
}

function handleOpenURL(url) {
  setTimeout(function() {
	//alert("received url: " + url);
	ref = cordova.InAppBrowser.open(baseUrl, '_blank', 'location=no,hidden=yes,zoom=no,toolbar=no');
  }, 0);
}

function execcssinsideiap1(pcode) {
	ref.insertCSS({
		code: pcode
	}, function(
	) {});
}