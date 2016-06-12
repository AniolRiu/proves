var userData;
var userId = 55;
//var socket = io();
var socket = io('http://aniol.ddns.net:5397'); // Per si ens volem connectar a partir de ip:port

var currentLoc;

const GET_ALL_PARAMETERS = "GAP";
const PING = "PNG";

const SET_ALARM_LOCATION = "SAL";
const GET_ALARM_LOCATION = "GAL";
const DATA_ALARM_LOCATION = "DAL";
const GET_DATA_LOCATION = "GDL";
const DATA_LOCATION = "DLO";
const ALARM_LOCATION = "ALO";

const SET_ALARM_TEMPERATURE = "SAT";
const GET_ALARM_TEMPERATURE = "GAT";
const DATA_ALARM_TEMPERATURE = "DAT";
const GET_DATA_TEMPERATURE = "GDT";
const DATA_TEMPERATURE = "DTE";
const ALARM_TEMPERATURE = "ATE";

const SET_ALARM_MOVEMENT = "SAM";
const GET_ALARM_MOVEMENT = "GAM";
const DATA_ALARM_MOVEMENT = "DAM";
const ALARM_MOVEMENT = "AMO";

function auth() {
	ref.authWithOAuthPopup("google", function(error, authData) {
		if (error) {
			console.log("Login Failed!", error);
		} 
		else {
			console.log("Authenticated successfully with payload:", authData);
			userData = authData;
			$.mobile.changePage( "#user-page", { transition: "slideup", changeHash: false });
		}
	}, 
	{
	  scope: "email"
	});
}

function findCamper() {
	socket.emit('message',{user:userId, msg: GET_DATA_LOCATION});
    return false;
}

function setAlarm(alarm, active) {
	var act = (active? "1" : "0");
	alert(alarm + act);
	socket.emit('message',{user:userId, msg: alarm + act});
}

socket.on(DATA_LOCATION, function(location){
	var lat = parseFloat(location.split(",")[0]);
	var lng = parseFloat(location.split(",")[1]);
	currentLoc = new google.maps.LatLng(lat, lng);  // Default to Hollywood, CA when no geolocation support
	$.mobile.changePage($('#map-page'), 'pop'); 
});

socket.on(DATA_ALARM_LOCATION, function(state){
	
});

socket.on('DTE', function(temp){
    var tem = parseFloat(temp.split(",")[0]);
	var hum = parseFloat(temp.split(",")[1]);
	$("#p_temp").text("La temperatura a l'interior de la furgoneta és de " + tem + "ºC. La humitat és del " + hum + "%.");
});

/*
 * Google Maps documentation: http://code.google.com/apis/maps/documentation/javascript/basics.html
 * Geolocation documentation: http://dev.w3.org/geo/api/spec-source.html
 */
$( document ).on( "pagecreate", "#map-page", function() {
	setTimeout(function(){drawMap(currentLoc)}, 1000);
    function drawMap(latlng) {
        var myOptions = {
            zoom: 10,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
        // Add an overlay to the map of current lat/lng
        var marker = new google.maps.Marker({
            position: latlng,
            map: map
        });
    }
});



$( document ).on( 'change', '#flip_alarm_mov', function( e ) {
	var active = $("#flip_alarm_mov").prop("checked") ? "1" : "0";
	sendMessage(SET_ALARM_MOVEMENT + active);
});

document.addEventListener("deviceready", onDeviceReady, false);

$( document ).ready(function() {
	// Aixo funciona a l'explorador d'Internet
    onDeviceReady();
});

function login() {
	alert("login");
	if( Backendless.LocalCache.get("current-user") ) { 
		onceLogged();
	}
	else {
		alert("login in");
		Backendless.UserService.login("artic.vb@gmail.com", "tbesfalsa", true, new Backendless.Async( onceLogged, gotErrorOnLogin ) );
	}
}

function onceLogged() {
	alert("logged!");
}

function gotErrorOnLogin() {
	alert("error on login");
}

function onDeviceReady() {
	setInterval(refreshValues, 10000); // TODO: Passar els segons a variable apart
	refreshAlarms();
	
	// push notification
	var APPLICATION_ID = '317BE8D4-2830-EB68-FFC2-71A214A06600',
    SECRET_KEY = '21174A36-55C9-3D7D-FFA2-78AE4D9DD100',
    VERSION = 'v1'; //default application version;
	Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
	
	login();
	pushNotification = window.plugins.pushNotification;
	
	var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	alert(deviceType);
	if ( deviceType == 'android' || deviceType == 'Android' || deviceType == "amazon-fireos" ){
		pushNotification.register(
			successHandler,
			errorHandler,
			{
				"senderID":"967628965937",
				"ecb":"onNotification"
			}
		);
	} else if ( deviceType == 'blackberry10'){
		pushNotification.register(
			successHandler,
			errorHandler,
			{
				invokeTargetId : "replace_with_invoke_target_id",
				appId: "replace_with_app_id",
				ppgUrl:"replace_with_ppg_url", //remove for BES pushes
				ecb: "pushNotificationHandler",
				simChangeCallback: replace_with_simChange_callback,
				pushTransportReadyCallback: replace_with_pushTransportReady_callback,
				launchApplicationOnPush: true
			}
		);
	} else {
		pushNotification.register(
			tokenHandler,
			errorHandler,
			{
				"badge":"true",
				"sound":"true",
				"alert":"true",
				"ecb":"onNotificationAPN"
			}
		);
	}
	//-------------
}



// result contains any message sent from the plugin call
function successHandler (result) {
    alert('result = ' + result);
}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    alert('error = ' + error);
}

// Android and Amazon Fire OS
function onNotification(e) {
    switch( e.event )
    {
    case 'registered':
        if ( e.regid.length > 0 )
        {
            // Your GCM push server needs to know the regID before it can push to this device
            // here is where you might want to send it the regID for later use.
            console.log("regID = " + e.regid);
			alert(e.regid);
			var currentUser = Backendless.UserService.getCurrentUser();
			currentUser.GCM_id=e.regid;
			Backendless.UserService.update( currentUser, function() {alert("user GCM id updated");} );
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if ( e.foreground )
        {
            $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

            // on Android soundname is outside the payload.
            // On Amazon FireOS all custom attributes are contained within payload
            var soundfile = e.soundname || e.payload.sound;
            // if the notification contains a soundname, play it.
            var my_media = new Media("/android_asset/www/"+ soundfile);
            my_media.play();
        }
        else
        {  // otherwise we were launched because the user touched a notification in the notification tray.
            if ( e.coldstart )
            {
                $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
            }
            else
            {
                $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
            }
        }

       $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
           //Only works for GCM
       $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
       //Only works on Amazon Fire OS
       $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
    break;

    case 'error':
        $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
    break;

    default:
        $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
    break;
  }
}

function refreshAlarms() {
	socket.emit('message',{user:userId, msg: GET_ALARM_LOCATION + ";"});
	socket.emit('message',{user:userId, msg: GET_ALARM_TEMPERATURE + ";"});
	socket.emit('message',{user:userId, msg: GET_ALARM_MOVEMENT + ";"});
}

function refreshValues() {
	//socket.emit('message',{user:userId, msg: GET_DATA_LOCATION + ";"});
	socket.emit('message',{user:userId, msg: GET_DATA_TEMPERATURE + ";"});
}

function sendMessage(message) {
	socket.emit('message',{user:userId, msg: message + ";"});
}