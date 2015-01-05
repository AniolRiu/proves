// JavaScript Document
document.addEventListener('deviceready', function () {

    // have to call initialize function with canvas object
    var objCanvas = document.getElementById("canvas");
    window.plugin.CanvasCamera.initialize(objCanvas);

    // window.plugin.CanvasCamera is now available
	var options = {
        quality: 75,
        destinationType: CanvasCamera.DestinationType.DATA_URL,
        encodingType: CanvasCamera.EncodingType.JPEG,
        width: 640,
        height: 480
    };
    window.plugin.CanvasCamera.start(options);
}, false);