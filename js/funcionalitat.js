document.addEventListener("deviceready", onDeviceReady, false);
window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});

function connectSuccess(){
	
} 

function connectFailure() {
	alert("f");
}

function onDeviceReady() {
	alert("ini");
	bluetoothSerial.connectInsecure("PROTESI", function(connect) {alert("s");}, function() {alert("s");});
}