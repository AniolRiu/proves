document.addEventListener("deviceready", onDeviceReady, false);
window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});

function connectSuccess(){
	alert("s");
} 

function connectFailure() {
	alert("f");
}

function onDeviceReady() {
	alert("ini");
	bluetoothSerial.connect("PROTESI", connectSuccess, connectFailure);
}