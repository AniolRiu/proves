//Documentacio a https://github.com/don/BluetoothSerial/blob/17425bd/README.md

const protesi_MAC = "98:D3:32:20:44:E1";
const HANDSHAKE = "HDS";
const CALIBRATE = "CAL";

var connected = false;
//document.addEventListener("deviceready", onDeviceReady, false);
window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});

function onDeviceReady() {
	connect();
	setInterval(checkBTCom, 1000);
}

function connect() {
	bluetoothSerial.connect(protesi_MAC, onConnect, onDisconnect);
}

function onConnect() {
	alert ("Pròtesi connectada");
	send(HANDSHAKE);
}

function onDisconnect() {
	alert("Pròtesi desconnectada");
}

function disconnect() {
	bluetoothSerial.disconnect(onConnect, onDisconnect);
}

function calibrate() {
	send(CALIBRATE);
}

function send(msg) {
	bluetoothSerial.write(msg + ";", function() {}, function() {alert("Error al enviar el missatge " + msg)});
}

$( document ).on( 'change', '#flip_connection', function( e ) {
	var connect = $("#flip_alarm_mov").prop("checked");
	if(connect){ 
		connect();
	}
	else {
		disconnect();
	}
});

function checkBTCom() {
	bluetoothSerial.available(
		function(nBytes) {
			if(nBytes > 0) {
				readBytes();
			}
		}, 
		function() {alert("failure on reading BTcom");}
	);
}

function readBytes() {
	bluetoothSerial.read(
		function(data) {alert(data)},
		function() {alert("Fail when reading");}
	);

}