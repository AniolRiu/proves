//document.addEventListener("deviceready", onDeviceReady, false);
window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});


var watermark;
var canvasDom;
var canvas;

function init() {
	document.addEventListener("deviceready", startUp, false);
}
function onDeviceReady() {
    canvasDom = $("#myCanvas")[0];
    canvas = canvasDom.getContext("2d");
    //Create a watermark image object
    watermark = new Image();
    watermark.src = "http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg";
    watermark.onload = function(e) {
        //you can only take pictures once this is loaded...
        $("#takePictureButton").removeAttr("disabled");
    }
    
	$("#takePictureButton").on("touchstart", function(e) {
		navigator.camera.getPicture(camSuccess, camError, {quality: 75, targetWidth: 400, targetHeight: 400, destinationType: Camera.DestinationType.FILE_URI});
	});	
	function camError(e) {
		console.log("Camera Error");
		console.log(JSON.stringify(e));
	}
	function camSuccess(picuri) {
		console.log("Camera Success");
        var img = new Image();
        img.src=picuri;
        img.onload = function(e) {
            canvas.drawImage(img, 0, 0);
            canvas.drawImage(watermark, canvasDom.width-watermark.width, canvasDom.height - watermark.height);
        }
        
	}
}
