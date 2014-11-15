var canvas;

function mida_canvas(){
	canvas.width=window.innerWidth;
	alert("aveeeerrraaaaaa" +  document.getElementById("header_canvas").offsetHeight);
	canvas.height=window.innerHeight - document.getElementById("header_canvas").offsetHeight;
	alert(canvas.width + " " + canvas.height);
	alert("final_midacanva");
}
		
function init() {
	canvas = document.getElementById("canvas");
	alert("coco");
	mida_canvas();
	canvas.clearCanvas();
	canvas.drawRect({fillStyle:"#fff",x:0,y:0,width:$canvas.width(),height:$canvas.height(),fromCenter:!1});
}

//$(document).on("pageinit","#fes_dibuix", init);
//window.onload=init;
$(document).on("pageload", function() {
	canvas = document.getElementById("canvas");
	alert("coco");
	mida_canvas();
	canvas.clearCanvas();
	canvas.drawRect({fillStyle:"#fff",x:0,y:0,width:$canvas.width(),height:$canvas.height(),fromCenter:!1});
});