var url_editorials = "http://solucionsdemates.tk/android_connect/get_editorials.php";
var url_cursos = "http://solucionsdemates.tk/android_connect/get_cursos.php";
var url_llibres = "http://solucionsdemates.tk/android_connect/get_llibres.php";
var url_exercicis = "http://solucionsdemates.tk/android_connect/get_exercicis.php";
var url_autenticacio = "http://solucionsdemates.tk/android_connect/autenticacio.php";
var url_solucions = "http://solucionsdemates.tk/android_connect/get_solucions.php";
var jsoncb = "?jsoncallback=?";

var xmlhttp = new XMLHttpRequest();
var llibre_nom;
var id_usuari_global;
var password_global;
var llibre_id = -1;

// Wait for device API libraries to load
window.onload = onDeviceReady;

// handling document ready and phonegap deviceready
/*window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
}, false);*/

function onDeviceReady() {
	document.getElementById("boto_login").onclick = autenticacio;
	document.getElementById("selecciona_editorial").onchange = carregaCursos;
	document.getElementById("selecciona_curs").onchange = carregaLlibres;
	document.getElementById("selecciona_llibre").onchange = actualitza_info_llibre;
	document.getElementById("num_pag").onchange = carregaExercicis;
	
	$('#coll_llibre').bind('collapse', function() {
		$('#coll_llibre h1 #text_coll_llibre').text("Libro seleccionado: " + llibre_nom);
		$('#coll_exercici').trigger("expand");
	});
	$('#coll_llibre').bind('expand', function() {
		$('#coll_llibre h1 #text_coll_llibre').text("Seleccionar libro");
	});
	
	if (llibre_id == -1) {
		$('#coll_llibre').trigger("expand");
	}
	else {
		$('#coll_llibre').trigger("collapse");
	}
	
	//El que ve es pot borrar, es per fer proves
	window.location.href = "#autenticacio";
	//window.location.href = "#selecciona_exercici";
	//carregaEditorials();
	//---------
}

function autenticacio() { 
	$.getJSON( 
		url_autenticacio.concat(jsoncb), 
		{
			usuari:document.getElementById("usuari").value, 
			password:document.getElementById("password").value
		}, 
		function(resposta) {
			if (resposta.success == 1) {
				// Validació correcta
				alert("Punts " + resposta.punts);
				id_usuari_global = resposta.id_usuari;
				password_global = resposta.password;
				//$.mobile.changePage( "#selecciona_exercici", { transition: "flip"} );
				window.location.href = "#selecciona_exercici";
				carregaEditorials();
			} else {
				$('#capsa_login').shake();
				$('#error_login').html("<span style='color:#cc0000'>Error:</span> Nombre de usuario o contraseña incorrectos.");
			}
		}
	);
	return false;
}

function carregaEditorials() {
	document.getElementById("selecciona_editorial").options.length = 0;
	$('#llista_exercicis').empty();
	
	$.getJSON( 
		url_editorials.concat(jsoncb),
		function(resposta) {
    		editorials = resposta.editorials;
        	var out = "";
			var opcions_select = '';
        	var i;
        	for(i = 0; i < editorials.length; i++) {
				opcions_select+= '<option value ="' + editorials[i].Id_Editorial + '">' + editorials[i].Name + '</option>';
        	}
			
			$("#selecciona_editorial").append(opcions_select);
			document.getElementById("selecciona_editorial").selectedIndex = 0;
			$("#selecciona_editorial").selectmenu('refresh');
			carregaCursos();
    	}
	);
}

function carregaCursos() {
	document.getElementById("selecciona_curs").options.length = 0;
	$.getJSON( 
		url_cursos.concat(jsoncb),
		{
			editorial:document.getElementById("selecciona_editorial").value
		},
		function(resposta) {
    		cursos = resposta.cursos;
        	var out = "";
			var opcions_select = '';
        	var i;
        	for(i = 0; i < cursos.length; i++) {
				opcions_select += '<option value ="' + cursos[i].Id_Curs + '">' + cursos[i].Nom + '</option>';
        	}
			$("#selecciona_curs").append(opcions_select);
			document.getElementById("selecciona_curs").selectedIndex = 0;
			$("#selecciona_curs").selectmenu('refresh');
			carregaLlibres();
    	}
	);
}

function carregaLlibres() {
	document.getElementById("selecciona_llibre").options.length = 0;
	
	$.getJSON( 
		url_llibres.concat(jsoncb),
		{
			editorial:document.getElementById("selecciona_editorial").value,
			curs:document.getElementById("selecciona_curs").value
		},
		function(resposta) {
    		llibres = resposta.llibres;
        	var out = "";
			var opcions_select = '';
        	var i;
        	for(i = 0; i < llibres.length; i++) {
				opcions_select += '<option value ="' + llibres[i].Id_Llibre + '">' + llibres[i].Nom + '</option>';
        	}
			$("#selecciona_llibre").append(opcions_select);
			document.getElementById("selecciona_llibre").selectedIndex = 0;
			$("#selecciona_llibre").selectmenu('refresh');
			actualitza_info_llibre();
    	}
	);
}

function carregaExercicis() {
	$('#llista_exercicis').empty();
	$.getJSON( 
		url_exercicis.concat(jsoncb),
		{
			llibre:llibre_id,
			pagina:document.getElementById("num_pag").value
		},
		function(resposta) {
			exercicis = resposta.exercicis;
        	var out = "";
			var opcions_llista = '';
        	var i;
        	for(i = 0; i < exercicis.length; i++) {
				opcions_llista += '<li><a href="#" onclick="carregaSolucions(' + exercicis[i].Id_Exercici + ');">Ejercicio ' + exercicis[i].Numero + '<span class="ui-li-count">' + exercicis[i].NSolucions + '</span><p class="ui-li-aside">Respuestas</p></a><a href="#aporta_solucio">Aportar solución</a>';
        	}

			$("#llista_exercicis").append(opcions_llista);
			$("#llista_exercicis").listview('refresh');
    	}
	);
}

function carregaSolucions(id_exercici) {
	$.getJSON( 
		url_solucions.concat(jsoncb),
		{
			exercici:id_exercici
		},
		function(resposta) {
			if (resposta.success == 1) {
				$.mobile.changePage( "#mostra_solucions", { transition: "slide"} );
				solucions = resposta.solucions;
				var solucions_llista = '';
				var i;
				var j;
				for(i = 0; i < solucions.length; i++) {
					var idSolucio = solucions[i].Id_Solucio;
					solucions_llista += '\
					<div class="ui-body ui-body-a">\
						<div data-role="controlgroup" data-type="horizontal">\
							<button data-icon="camera">' + solucions[i].Vots_Pos + '</button>\
							<button data-icon="delete">' + solucions[i].Vots_Neg + '</button>\
						</div>\
						<p>' + solucions[i].Solucio + '</p>';
						for(j = 0; j < solucions[i].NImatges; j++) {
							solucions_llista += '\
							<p>Figura ' + (j+1) + '</p>\
							<img src=\'http://solucionsdemates.tk/android_connect/get_imatge_solucio.php?id_solucio=6&id_usuari=1&password="club9305"&nimatge=' + j + '\'>';
						}
					solucions_llista += '</div>\
					<hr>';
        		} 
				$('#solucions_detall').html(solucions_llista);
			}
			else {
				// No hi ha solucions
			}
    	}
	);
}

function actualitza_info_llibre() {
	llibre_nom = $("#selecciona_llibre option:selected").text();
	llibre_id = document.getElementById("selecciona_llibre").value;
}

/*function carregaSolucions() {
	window.location.href = "#mostra_solucions";
	img = document.createElement('img');
	img.src = "http://solucionsdemates.tk/android_connect/get_imatge_prova.php";
	//img.src = "http://www.frikipedia.es/images/thumb/7/7e/Caca.jpg/200px-Caca.jpg";
	document.getElementById("contingut_solucio").appendChild(img);
}*/

function obre_foto() {
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){ // success get file system
        var sdcard = fileSystem.root;
        sdcard.getDirectory('dcim',{create:false}, function(dcim){
            var gallery = $('#gallery');
            listDir(dcim, gallery);
        }, function(error){
            alert(error.code);
        })
    }, function(evt){ // error get file system
        console.log(evt.target.error.code);
    });
}