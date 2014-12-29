$(document).ready(function() {
	var can = document.getElementById("canvas");
	var canv = $("#canvas");
	var context = can.getContext("2d");
	
	var clickX = new Array();
	var clickY = new Array();
	var clickDrag = new Array();
	var paint;
	
	var colorBlack = "#000";
	var colorBlue = "#00C";
	var colorRed = "#F00";
	var colorGreen = "#0F0";
	var colorWhite = "#FFF";
	
	var curColor = colorBlack;	// Guarda el color del llapis 
	var clickColor = new Array();
	
	var curSize = 20; // Guarda la mida del llapis 
	var clickSize = new Array();
	
	function init() {
		canvas.width=window.innerWidth;
		canvas.height=window.innerHeight - document.getElementById("header_canvas").offsetHeight;
		redraw();
	}
	
	function netejaCanvas() {
		context.fillStyle=colorWhite;
	  	context.fillRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
		
		clickX = [];
		clickY = [];
		clickDrag = [];
		clickColor = [];
		clickSize = [];
	}
	
	$('#div_punta .ui-slider-track .ui-btn.ui-slider-handle').css({"height":curSize, "width":curSize});
	$('#color_negre').css({"background":colorBlack});
	$('#color_blau').css({"background":colorBlue});
	$('#color_vermell').css({"background":colorRed});
	$('#color_verd').css({"background":colorGreen});
	$('#color_blanc').css({"background":colorWhite});
	
	function addClick(x, y, dragging){
	  clickX.push(x);
	  clickY.push(y);
	  clickDrag.push(dragging);
	  clickColor.push(curColor);  
	  clickSize.push(curSize);
	}
	
	function redraw(){
	  context.fillStyle=colorWhite;
	  context.fillRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	  context.lineJoin = "round";
				
	  for(var i=0; i < clickX.length; i++) {		
		context.beginPath();
		if(clickDrag[i] && i){
		  context.moveTo(clickX[i-1], clickY[i-1]);
		 }else{
		   context.moveTo(clickX[i]-1, clickY[i]);
		 }
		 context.lineTo(clickX[i], clickY[i]);
		 context.closePath();
		 context.strokeStyle = clickColor[i];
		 context.lineWidth = clickSize[i];
		 context.stroke();
	  }
	}
	
	// inici_dibuix ---------
	canv.mousedown(function(e){
	  	var mouseX = e.pageX - this.offsetLeft;
	   	var mouseY = e.pageY - this.offsetTop;
			
		paint = true;
	  	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	  	redraw();
	});
	
	can.addEventListener('touchstart', function(e) {
		var mouseX = e.pageX - this.offsetLeft;
	   	var mouseY = e.pageY - this.offsetTop;
			
		paint = true;
	  	addClick(e.changedTouches[0].pageX - this.offsetLeft, e.changedTouches[0].pageY - this.offsetTop);
	  	redraw();
	}, false);
	
	/*function onTouchStart(e) {
		var mouseX = e.pageX - this.offsetLeft;
	   	var mouseY = e.pageY - this.offsetTop;
			
		paint = true;
	  	addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
	  	redraw();
	}*/
	
	// fent_dibuix ---------
	canv.mousemove(function(e){
	  	if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
	  	}
	});
	
	can.addEventListener('touchmove', function(e) {
		if(paint){
			addClick(e.changedTouches[0].pageX - this.offsetLeft, e.changedTouches[0].pageY - this.offsetTop, true);
			redraw();
	  	}
	}, false);
	
	/*function onTouchMove(e) {
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
	  	}
	}*/
	
	// final_dibuix ---------
	canv.mouseup(function(e){
	  paint = false;
	});
	
	can.addEventListener('touchend', function(e) {
		paint = false;
	}, false);
	
	/*function onTouchEnd(e) {
		paint = false;
	}*/
	
	// fora_del_canvas -------
	canv.mouseleave(function(e){
	  paint = false;
	});
	
	can.addEventListener('touchend', function(e) {
		paint = false;
	}, false);
	
	//-------------------------
	
	$('#cancel').bind('click',function(){
		curColor = colorGreen;
		$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
	});
	
	$('#clear').bind('click',function(){
		netejaCanvas();
	});
	
	$('#save').bind('click',function(){
		var img=canvas.toDataURL("image/jpg");
		//$canvas.mouseup();
		$('#solucio_detall').append('\
			<div class="imatge">\
				<p class="index_figura"></p>\
				<div class="contenidor_imatge">\
					<img class="imatge_solucio" src="' + img + '"/>\
					<a data-role="button" class="eliminar_imatge"  data-icon="delete" data-iconpos="notext" class="ui-btn-right"></a>\
				</div>\
			</div>'
		);
		$(".eliminar_imatge").button();
		netejaCanvas();
		$.mobile.changePage( "#aporta_solucio", { transition: "slide"} );
	});
	
	$('#cancel').bind('click',function(){
		$.mobile.changePage( "#aporta_solucio", { transition: "slide"} );
		netejaCanvas();
	});
	
	$(document).on("pageshow","#fes_dibuix", function() {
		init();
		curColor=colorBlack;
		curSize=20;
		$('#div_punta .ui-slider-track .ui-btn.ui-slider-handle').css({"height":curSize, "width":curSize});
		$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
		
		$('#color_blanc').bind('click',function(){
			curColor = colorWhite;
			$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
		});
		
		$('#color_blau').bind('click',function(){
			curColor = colorBlue;
			$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
		});
		
		$('#color_negre').bind('click',function(){
			curColor = colorBlack;
			$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
		});
		
		$('#color_vermell').bind('click',function(){
			curColor = colorRed;
			$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
		});
		
		$('#color_verd').bind('click',function(){
			curColor = colorGreen;
			$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
		});
		
		$('#slider').change(function() {
			curSize = $('#slider').val();
			$('#div_punta .ui-slider-track .ui-btn.ui-slider-handle').css({"height":curSize, "width":curSize});
		});
		
	});
	window.onresize = init;
});

