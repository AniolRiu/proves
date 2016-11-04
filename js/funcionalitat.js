//document.addEventListener("deviceready", onDeviceReady, false);
//window.onload = onDeviceReady;
$( document ).ready(function() {
    onDeviceReady();
});

function onDeviceReady() {
	var canvas = document.getElementById('blocEditCanvas');
    var context = canvas.getContext('2d');
	var imageObj = new Image();

	imageObj.onload = function() {
	context.drawImage(imageObj, 0, 0);
	};
	imageObj.src = 'http://www.html5canvastutorials.com/demos/assets/darth-vader.jpg';
	$("#capture").click(function() {camera();});
}

// Note: have not tested this - but I think it should work!

function cameraWin(picture){
    var theCanvas = document.getElementById('theCanvas');
    var ctx = theCanvas.getContext('2d');

    var theImage = new Image();

    theImage.src = "data:image/jpeg;base64,"+picture;
    ctx.drawImage(theImage, 0, 0);
}


function cameraFail(){
    alert('camera dead');
}

function takePicture(){
    navigator.camera.getPicture(cameraWin, cameraFail, {quality: 50, destinationType: Camera.DestinationType.DATA_URL});
}



var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

function camera() {
	alert(8);
    function onSuccess(imageData) {
        var image = new Image();
        image.src = "data:image/jpeg;base64," + imageData;
        image.onload = function () {
            var height = 100;
            var width = 100;
            context.drawImage(image, width, height);
        }
    }

    function onFail(message) {
        console.log('Failed because: ' + message);
    }

    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
}
