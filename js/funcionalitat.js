document.addEventListener("deviceready", onDeviceReady, false);

/*$( document ).ready(function() {
    onDeviceReady();
});*/

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