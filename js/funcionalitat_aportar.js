$(document).ready(function (e) {
	function getUrlVars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++)
		{
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}
	
	var id_exercici = /*getUrlVars()["id_exercici"]*/6;
	var id_usuari = /*getUrlVars()["id_usuari"]*/1;
	var password = /*getUrlVars()["password"]*/"club9305";
	alert(id_exercici + " " + id_usuari + " " + password);
	
	$(function() {
		$("#imatge_arxiu").change(function() {
			var file = this.files[0];
			var imagefile = file.type;
			var match= ["image/jpeg","image/png","image/jpg"];	
			if(!((imagefile==match[0]) || (imagefile==match[1]) || (imagefile==match[2]))) {
				$("#missatge_imatge").html("<p>Por favor selecciona un formato de imagen válido. Solamente los formatos .jpeg, .jpg and .png están permitidos</p>");
				return false;
			}
			else {
				var reader = new FileReader();	
				reader.onload = imatge_carregada;
				reader.readAsDataURL(this.files[0]);
			}		
		});
	});
	
	function imatge_carregada(e) {		
		var img = e.target.result;
		
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
	}
	
	function indexaFigures() {
		$(".index_figura").each(function(index){
			$(this).text("Figura " + (index + 1));
		});
	}
	
	$('#solucio_detall').alertaInsercioNodes(indexaFigures);
	
	// La funció següent agafa la senyal d'el·liminar imatge i elimina la imatge
	$(document).on('click','.eliminar_imatge', function(){
		$(this).closest('.imatge').remove();
	});
	
	$(function() {
		$("#submit_solucio").click(function() {
			// PUJEM SOLUCIÓ
			var fd = new FormData();
			fd.append("id_usuari",id_usuari);
			fd.append("password",password);
			fd.append("id_exercici",id_exercici);
			alert($("#text_solucio").val());
			fd.append("text_solucio",$("#text_solucio").val())
			$("img").each(function(index){
				// Create new form data
				var data = this.src;
				fd.append("index" + index, data);
			});
			// And send it
			$.ajax({
				url: "http://solucionsdemates.tk/android_connect/post_solucio.php?jsoncallback=?",
				type: "POST",
				data: fd,
				processData: false,
				contentType: false,
				success: function(resposta) {
					//resposta=JSON.parse(dades);
					console.log(resposta);
					alert("ziii");
					alert(resposta.caca);
				},
				error: function(e) {
					alert("noooooooo");
					alert(e);
				}
			});			
		});
	});
});



