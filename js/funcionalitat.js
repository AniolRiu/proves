var protesi_MAC = "98:D3:32:20:44:E1";
const HANDSHAKE = 0;
//document.addEventListener("deviceready", onDeviceReady, false);
window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});

function onDeviceReady() {

	//bluetoothSerial.disconnect(function() {alert("s");}, function() {alert("s");});
	bluetoothSerial.connect(protesi_MAC, onConnect, onDisconnect);
	alert("ono");
}

function onConnect() {
	alert("Protesi connectada");
	bluetoothSerial.write("hola", function() {alert("writen")}, function() {alert("error")});
}

function onDisconnect() {
	alert("connection failed");
}

function calibrate() {
	bluetoothSerial.write("message sent from APP", function() {alert("writen")}, function() {alert("error")});
}