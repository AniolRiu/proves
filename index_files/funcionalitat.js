
/* ######################## FILE: /home/v-s-bde/public_html/frontend/javascript/core.mobile.js ######################## */

$(document).on("pagecreate", function(event){
    $( document ).on( "swipeleft swiperight", function( e ) {
        // We check if there is no open panel on the page because otherwise
        // a swipe to close the left panel would also open the right panel (and v.v.).
        // We do this by checking the data that the framework stores on the page element (panel: open).
        if ( $.mobile.activePage.jqmData( "panel" ) !== "open" && !$(e.target).hasClass('preventNavigationSwipe')) {
            if ( e.type === "swiperight" ) {
                $( "#navigation" ).panel( "open" );
            }
        }
    });

});



$(document).on("pagecreate", function(event){
	
	/* La manipulació de la imatge en funció de la detecció de gestos es fa amb l'exemple següent 
	http://stackoverflow.com/questions/24839531/scale-div-using-hammer-js
	Sense can.js
	*/
	
	
	var img = $('#map');
	var imgContainer = $('#imgContainer');
	var imgSize = {
		height: img.height(),
		width: img.width()
	};
	console.log(imgSize);
	var borders = {
		minusY: -(imgSize.height/1.5),
		plusY: (imgSize.height/1.5),
		minusX: -(imgSize.width/2),
		plusX: (imgSize.width/2)
	};
	console.log(borders);

	var scale = 1, maxScale = 4, minScale = 1, last_scale;
	var posX = 0, posY = 0, last_posX=0, last_posY= 0, max_pos_x = 200, max_pos_y = 200;
	onWindowResize();
	// http://stackoverflow.com/questions/7768269/ipad-safari-disable-scrolling-and-bounce-effect
	document.ontouchmove = function(event){
		event.preventDefault();
	}

	$( '#map' ).hammer().on( "touch pinch drag dragend", function( e ) {

		switch(e.type) {
			case 'touch':
				last_scale = scale;
			break;

			case 'pinch':
				scale = last_scale * e.gesture.scale;

				if(scale < minScale) scale = last_scale = minScale;

				if(scale > maxScale) scale = last_scale = maxScale;



				break;

			case 'drag':
				if(posY < borders.minusY){
					posY = borders.minusY-2;
				}else if(posY > borders.plusY){
					posY = borders.plusY+2;
				}else{
					posY = last_posY + parseFloat(e.gesture.deltaY/scale);
				}

				if(posX < borders.minusX){
					posX = borders.minusX-2;
				}else if(posX > borders.plusX){
					posX = borders.plusX+2;
				}else{
					posX = last_posX + parseFloat(e.gesture.deltaX/scale);
				}

				break;

			case 'dragend':
				if(posY < borders.minusY){
					posY = last_posY = borders.minusY;
				}else if(posY > borders.plusY){
					posY = last_posY = borders.plusY;
				}else{
					last_posY = posY;
				}

				if(posX < borders.minusX){

					posX = last_posX = borders.minusX;
				}else if(posX > borders.plusX){
					posX = last_posX = borders.plusX;
				}else{
					last_posX = posX;
				}

				break;
		}

		if(scale < minScale){
			scale = minScale;
		}else if(scale > maxScale){
			scale = maxScale;
		}


		borders.minusY = parseFloat(-(imgSize.height/Math.sqrt(1.5*scale)));
		borders.plusY = parseFloat((imgSize.height/Math.sqrt(1.5*scale)));

		borders.minusX = parseFloat(-(imgSize.width/2)/scale);
		borders.plusX = parseFloat((imgSize.width/2)/scale);


		// $(this).css('transform','scale(' + scale + ') translate('+posX+'px, '+posY+'px)');
		drawImage();
	});
	
	$( window ).resize(onWindowResize);
	
	function drawImage(){
		img.css('transform','scale(' + scale + ') translate('+posX+'px, '+posY+'px)');
	}
	
	function onWindowResize() {
		imgContainer.height(($(window).height() - 16) + 'px');
		alert("imgcontainer height:" + imgContainer.height());
		
		var cX = imgContainer.width();
		var cY = imgContainer.height();
		var cRatio = cX/ cY;
		var iX = img.width();
		var iY = img.height();
		var iRatio = iX / iY;
		if (cRatio > iRatio) {
			// Sobra pels costats
			img.css('height','100%');
			img.css('width','auto');
		}
		else {
			// Sobre per dalt i per sota
			img.css('width','100%');
			img.css('height','auto');
			posY = last_posY = (cY - iY) / 2;
			scale = 1;
			posX = 0;
			alert("container height: " + cY + ". image height: " + iY + ". desplaçament vertical de la imattge: " + posY);
			drawImage();
		}
	}

});



