// JavaScript Document
/*function onLoad(){
	alert();
	var climberImage=new Image();
	climberImage.src = 'res/climber.png';
	var c = document.getElementById("canvas");
	var ctx = c.getContext("2d");
	ctx.drawImage(climberImage, 10, 10);
	alert();

}*/
/*window.addEventListener("load", init); 
	
	var logoImage = new Image(); 
	logoImage.src = 'climber.png';
	var canvas = document.createElement('canvas'); 
	canvas.width = 600; 
	canvas.height = 200; 
	var context = canvas.getContext('2d'); 
	document.body.appendChild(canvas); 

	function init() { 
		
		context.drawImage(logoImage, 50,35); 
	
	}*/


	window.addEventListener("load", init); 
	
	var logoImage = new Image(); 
	logoImage.src = "../res/climber.png";
	var canvas = document.getElementById('canvas'); 
	var context = canvas.getContext('2d'); 

	function init() { 
		alert();
		context.drawImage(logoImage, 10,10); 
	
	}
