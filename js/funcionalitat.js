//Documentacio a https://github.com/don/BluetoothSerial/blob/17425bd/README.md

const protesi_MAC = "98:D3:32:20:44:E1";
const HANDSHAKE = "HDS";
const CALIBRATE = "CAL";
const CHANGE_MOV = "MOV";

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart','bar']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {

// Create the data table.
var data = google.visualization.arrayToDataTable([
	['Element', 'Value', { role: 'annotation' }],
	['', 666,'666'],
	['', 555,'555'],
	['', 444,'444']
]);
//var data = new google.visualization.DataTable();
//data.addColumn('string', 'Topping');
//data.addColumn('number', 'Slices');
/*data.arrayToDataTable([
  ['Element', 'Value', { role: 'annotation' }],
  ['', 666,'666'],
  ['', 555,'666'],
  ['', 444,'666']
]);*/

// Set chart options
var options = {title:'Valors mesurats',
			   width:400,
			   height:300,
			   is3D:true,
			   legend:{position: 'none'}
			   };

// Instantiate and draw our chart, passing in some options.
var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));

google.visualization.events.addListener(chart, 'select', function() {
	var selectedItem = chart.getSelection()[0];
    if (selectedItem) {
      var value = data.getValue(selectedItem.row, selectedItem.column);
      alert('The user selected ' + value);
    }
});

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