document.addEventListener("deviceready", onDeviceReady, false);
window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});

function onDeviceReady() {
	alert("ini");
	if(bluetoothSerial.isEnabled()){
		alert("bt enabled");
	}
	else {
		alert("bt not enabled");
	}
	//bluetoothSerial.disconnect(function() {alert("s");}, function() {alert("s");});
	bluetoothSerial.connectInsecure(
		"PROTESI", 
		onConnect, 
		onDisconnect	
		}
	);
	alert("ono");
}

function onConnect() {
	alert("success; let's send something!");
	bluetoothSerial.write("KJHG", function() {alert("writen")}, function() {alert("error")});
}

function onDisconnect() {
	alert("connection failed");
}