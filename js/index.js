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
var app_version="1.0.8";
var baseUrl = "https://ndhsguam.com/index_mobile";
var googleanalyticsid = 'UA-57301113-38';
var google_project_id = "973344420171";
var pushapi_domain = "https://getsetpush.com/dev1/";
var ref;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
		document.addEventListener("offline", this.onOffline, false);
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("resume", this.onResume, false);
		
    },	

    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onOffline: function() {	
		window.location  = "park.html";
		e.preventDefault();
		var src = 'park.html';
		var target = '_blank';
		var option = "loaction=no, toolbar=no, zoom=no, hidden=yes, hardwareback=no";
		var ref = cordova.InAppBrowser.open(src, target, option);
		alert('Your device is Offline. Please check your connection and try again.');
    },
	onDeviceReady: function() {
		console.log(device.cordova);
        app.receivedEvent('deviceready');
		sessionStorage.openedIAB = 1;	
		console.log('ok device ready');	
    },
	onResume: function() {
		execinsideiap1('location.href=location.href');
    },	
    // Update DOM on a Received Event
    receivedEvent: function(id) {		
		
		var isIABLoaded=0;
		var udid;

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
			
			var urlpath = "?device="+device.model+"&device_id="+device.uuid+"&device_version="+device.version+"&device_os="+device.platform+"&device_notification_id="+regID+"&app_version="+app_version+"&jump_to=";
		
			var networkState = checkConnection();
			if (networkState == Connection.NONE) {
				 setTimeout(function(){ window.location  = "park.html";}, 5000);
		
			}
			else{
				$.post( pushapi_domain+"device_register", {
					'code' : pushapi_appcode
					,'os' : device.platform
					,'identifier' : device.uuid
					,'push_identifier' : regID
					,'ok' : 1
				}, function(data) {
					//alert(data);
				  //console.log( data.name ); // John
				  //console.log( data.time ); // 2pm
				});					
				
				//alert(baseUrl+urlpath);
				var ref = cordova.InAppBrowser.open(baseUrl+urlpath, '_blank', 'location=no,hidden=yes,zoom=no,toolbar=no,suppressesIncrementalRendering=yes,disallowoverscroll=yes');
				
			}	   
			ref.addEventListener("loadstop", function(event) {
				if(isIABLoaded==0){
					setTimeout(function(){ ;ref.show(); 
						}, 100);						
					isIABLoaded=1;
				}
				else{
					ref.show();
				}
			}); 			

			ref.addEventListener("loadstart", closeInAppBrowser);
			ref.addEventListener("loaderror", loaderrorcheck);
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
				var extension = event.url.substr(event.url.lastIndexOf('.')+1);
				execinsideiap1("document.getElementById('preloader').style.display = 'block';document.getElementById('status').style.display = 'block';");
				
				if (event.url.match("/closeapp")) {
					ref.close();
				}
				else if(extension=="pdf" || extension=="docx" || extension=="xlsx"){
					var iab = cordova.InAppBrowser;
					iap1 = iab.open(event.url, '_system');
					//execinsideiap1('history.back();location.reload(true);');
					iap1.addEventListener('loadstart', closeInAppBrowser);
					iap1.addEventListener('loaderror', loaderrorcheck);
				}
				else if(event.url =='https://www.ndhsguam.com/?mainsite') {
					var iab = cordova.InAppBrowser;
					iap1 = iab.open(event.url, '_system');
					//execinsideiap1('history.back();location.reload();');
					iap1.addEventListener('loadstart', closeInAppBrowser);
					iap1.addEventListener('loaderror', loaderrorcheck);
				}				
				else if (!event.url.match(expresscaredomain) && event.url!="" && !event.url.match("tel:")) {
					var iab = cordova.InAppBrowser;
					iap1 = iab.open(event.url, '_system');
					//execinsideiap1('history.back();location.reload();');
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
			ref.addEventListener('exit', function(event) {			
				if (sessionStorage.openedIAB &&  sessionStorage.openedIAB == 1) {
					sessionStorage.openedIAB = 0;
					navigator.app.exitApp(); 
				}
			});
        });

        push.on('notification', function(data) {
        	console.log("notification event");
            console.log(JSON.stringify(data));
			var regID = "";
			var udid;
			var allegatourl = encodeURIComponent(data.additionalData.allegato);
			var push = PushNotification.init({
				"android": {
					"senderID": google_project_id
				},
				"ios": {"alert": "true", "badge": "true", "sound": "true"}, 
				"windows": {} 
			});
           push.on('registration', function(data) {
				var regID = data.registrationId;			
				var param_url = "?device="+device.model+"&device_id="+device.uuid+"&device_version="+device.version+"&device_os="+device.platform+"&device_notification_id="+regID+"&app_version="+app_version+"&randomier="+$.now()+"&jump_to=";				
							
				var jumptourl = notifyUrl+''+(decodeURIComponent(allegatourl))+'/'+param_url;
							   
				var networkState = checkConnection();
				if (networkState == Connection.NONE) {
					 setTimeout(function(){ window.location  = "park.html";}, 2000);
			
				}
				else{
					//alert(baseUrl+urlpath);
					var ref = cordova.InAppBrowser.open(jumptourl, '_blank', 'location=no,hidden=yes,zoom=no,toolbar=no,suppressesIncrementalRendering=yes,disallowoverscroll=yes');
				}	
				ref.addEventListener("loadstop", function(event) {
					if(isIABLoaded==0){
						setTimeout(function(){ ;ref.show(); 
							}, 10);						
						isIABLoaded=1;
					}
					else{
						ref.show();
					}
				}); 				

				ref.addEventListener("loadstart", closeInAppBrowser);
				ref.addEventListener("loaderror", loaderrorcheck);
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
					var extension = event.url.substr(event.url.lastIndexOf('.')+1);
					if (event.url.match("/closeapp")) {
						ref.close();
					}
					else if(extension=="pdf" || extension=="docx" || extension=="xlsx"){
						var iab = cordova.InAppBrowser;
						iap1 = iab.open(event.url, '_system');
						//execinsideiap1('history.back();location.reload(true);');
						iap1.addEventListener('loadstart', closeInAppBrowser);
						iap1.addEventListener('loaderror', loaderrorcheck);
					}
					else if(event.url =='https://www.ndhsguam.com/?mainsite') {
						var iab = cordova.InAppBrowser;
						iap1 = iab.open(event.url, '_system');
						//execinsideiap1('history.back();location.reload();');
						iap1.addEventListener('loadstart', closeInAppBrowser);
						iap1.addEventListener('loaderror', loaderrorcheck);
					}					
					else if (!event.url.match(expresscaredomain) && event.url!="" && !event.url.match("tel:")) {
						var iab = cordova.InAppBrowser;
						iap1 = iab.open(event.url, '_system');
						//execinsideiap1('history.back();location.reload();');
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
				
				ref.addEventListener('exit', function(event) {			
					if (sessionStorage.openedIAB &&  sessionStorage.openedIAB == 1) {
						sessionStorage.openedIAB = 0;
						navigator.app.exitApp(); 
					}
				});
			});
			
        });

		push.on('error', function(e) {
            console.log("push error");
        });	
	
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
		  
	return networkState          
}
