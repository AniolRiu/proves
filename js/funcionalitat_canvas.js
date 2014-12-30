$(document).ready(function() {
	var can = document.getElementById("canvas");
	var canv = $("#canvas");
	var context = can.getContext("2d");
	
	var paint;
	
	var colorBlack = "#000";
	var colorBlue = "#00C";
	var colorRed = "#F00";
	var colorGreen = "#0F0";
	var colorWhite = "#FFF";
	
	var curColor = colorBlack;	// Guarda el color del llapis 
	
	var curSize = 20; // Guarda la mida del llapis 
	
	$(document).on("pageshow","#fes_dibuix", function() {
		inicia_canvas();
		$('#div_punta .ui-slider-track .ui-btn.ui-slider-handle').css({"height":curSize, "width":curSize});
		$('#div_punta .ui-btn-up-c, .ui-btn-hover-c').css({"background":curColor});
		
		$('#color_negre').css({"background":colorBlack});
		$('#color_blau').css({"background":colorBlue});
		$('#color_vermell').css({"background":colorRed});
		$('#color_verd').css({"background":colorGreen});
		$('#color_blanc').css({"background":colorWhite});
		
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
		
		//---- BOTONS----
		//---------------
		$('#clear').bind('click',function(){
			netejaCanvas();
		});
		
		$('#save').bind('click',function(){
			var img=can.toDataURL("image/png");
			
			// A continuacio cridem el plugin necessari pq toDataURL no funciona en Android < 4.0
			if (img === 'data:,' || img.length < 10) {
				alert("yeye1");
				var offset = {
					left: 0,
					top: document.getElementById("header_canvas").offsetHeight,
					width: canvas.width,
					height: canvas.height
				};
				alert("yeye2");
				window.canvasplugin(canvas, offset, 'image/png', function(val) {
					alert("yeye3");
					alert(val);
					alert("yeye4");
					img = val;
					alert("yeye5");
				});
			}
			// Fins aqui el pluguin
			alert(img);
			$("#text_solucio").val(img);
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
		//--------------
		//--------------
		
		window.onresize = inicia_canvas;
	});
	
	function inicia_canvas() {
		canvas.width=window.innerWidth;
		canvas.height=window.innerHeight - document.getElementById("header_canvas").offsetHeight;
		netejaCanvas();
		//redraw();
	}
	
	function netejaCanvas() {
		context.fillStyle=colorWhite;
	  	context.fillRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	}
	
	var click_antic_X;
	var click_antic_Y;
	
	function draw(click_X, click_Y, drag){
		context.beginPath();
		context.lineJoin = "round";
		if(drag){
			context.moveTo(click_antic_X, click_antic_Y);
		}else{
			context.moveTo(click_X - 1, click_Y);
		}
		context.lineTo(click_X, click_Y);
		context.closePath();
		context.strokeStyle = curColor;
		context.lineWidth = curSize;
		context.stroke();
		click_antic_X = click_X;
		click_antic_Y = click_Y;
	}
	
	// inici_dibuix ---------
	canv.mousedown(function(e){
		paint = true;
	  	draw(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, false);
	});
	
	can.addEventListener('touchstart', function(e) {
		e.stopPropagation(); // Evitem que la senyal es propagui a mousedown
		e.preventDefault();
		paint = true;
		toc = e.changedTouches[0];
	  	draw(toc.pageX - this.offsetLeft, toc.pageY - this.offsetTop,false);
	}, false);
	
	// fent_dibuix ---------
	canv.mousemove(function(e){
	  	if(paint){
			draw(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
	  	}
	});
	
	can.addEventListener('touchmove', function(e) {
		e.stopPropagation(); // Evitem que la senyal es propagui a mousemove
		e.preventDefault();
		if(paint){
			toc = e.changedTouches[0];
			draw(toc.pageX - this.offsetLeft, toc.pageY - this.offsetTop, true);
	  	}
	}, false);
	
	
	// final_dibuix ---------
	canv.mouseup(function(e){
	  paint = false;
	});
	
	can.addEventListener('touchend', function(e) {
		e.stopPropagation(); // Evitem que la senyal es propagui a mouseup
		e.preventDefault();
		paint = false;
	}, false);
	
	// fora_del_canvas -------
	canv.mouseleave(function(e){
	  paint = false;
	});
	
	can.addEventListener('touchcancel', function(e) {
		e.stopPropagation();// Evitem que la senyal es propagui a mouseleave
		e.preventDefault();
		paint = false;
	}, false);
	
	//-------------------------
});

