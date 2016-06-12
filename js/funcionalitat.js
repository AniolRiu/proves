//Documentacio a https://github.com/don/BluetoothSerial/blob/17425bd/README.md

const protesi_MAC = "98:D3:32:20:44:E1";
const HANDSHAKE = "HDS";
const CALIBRATE = "CAL";
const CHANGE_MOV = "MOV";

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

// Create the data table.
var data = new google.visualization.DataTable();
data.addColumn('string', 'Topping');
data.addColumn('number', 'Slices');
data.addRows([
  ['Mushrooms', 3],
  ['Onions', 1],
  ['Olives', 1],
  ['Zucchini', 1],
  ['Pepperoni', 2]
]);

// Set chart options
var options = {'title':'How Much Pizza I Ate Last Night',
			   'width':400,
			   'height':300};

// Instantiate and draw our chart, passing in some options.
var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
chart.draw(data, options);
}


var connected = false;
//document.addEventListener("deviceready", onDeviceReady, false);
window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});

function onDeviceReady() {
	onDisconnect();
	setInterval(checkBTCom, 1000);
}

function connect() {
	bluetoothSerial.connect(protesi_MAC, onConnect, onDisconnect);
}

function onConnect() {
	inform("Pròtesi connectada.");
	send(HANDSHAKE);
}

function onDisconnect() {
	inform("Pròtesi desconnectada. Connectant...");
	connect();
}

function disconnect() {
	bluetoothSerial.disconnect(onConnect, onDisconnect);
}

function calibrate() {
	send(CALIBRATE);
}

function changeMove() {
	send(CHANGE_MOVE);
}

function send(msg) {
	inform("Enviant missatge...");
	bluetoothSerial.write(msg + ";", function() {inform("Missatge enviat!");}, function() {inform("Error al enviar el missatge.")});
}

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

function inform(msg) {
	$("#p_connection_status").text(msg);
}