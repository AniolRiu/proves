var h = ['res/ops_h.png'];
var v = ['res/ops_v.png'];
var orientacio = (window.screen.availWidth > window.screen.availHeight ? "h" : "v" );
var num_imatges_h=h.length;
var num_imatges_v=v.length;
var periode = 15;
var interval;
var img = new Image();
var new_image = new Image();
var frame;
document.addEventListener("deviceready", onDeviceReady, false);

/*$( document ).ready(function() {
    onDeviceReady();
});*/

function onDeviceReady() {
	// push notification
	
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