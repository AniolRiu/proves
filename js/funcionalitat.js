var url_editorials = "http://solucionsdemates.tk/android_connect/get_editorials.php";
var url_cursos = "http://solucionsdemates.tk/android_connect/get_cursos.php";
var url_llibres = "http://solucionsdemates.tk/android_connect/get_llibres.php";
var url_exercicis = "http://solucionsdemates.tk/android_connect/get_exercicis.php";
var url_autenticacio = "http://solucionsdemates.tk/android_connect/autenticacio.php";
var url_registre = "http://solucionsdemates.tk/android_connect/registre.php";
var url_solucions = "http://solucionsdemates.tk/android_connect/get_solucions.php";
var url_vot_pos = "http://solucionsdemates.tk/android_connect/post_vot_positiu.php";
var url_vot_neg = "http://solucionsdemates.tk/android_connect/post_vot_negatiu.php";
var jsoncb = "?jsoncallback=?";

var xmlhttp = new XMLHttpRequest();
var llibre_nom;
var id_usuari_global;
var password_global;
var id_exercici_global;
var llibre_id = -1;

// Wait for device API libraries to load
window.onload = onDeviceReady;

// handling document ready and phonegap deviceready
/*window.addEventListener('load', function () {
    document.addEventListener('deviceready', onDeviceReady, false);
}, false);*/

function onDeviceReady() {
	document.getElementById("boto_login").onclick = autenticacio;
	//document.getElementById("boto_signup").onclick = registre;
	$("#formulari_signup").submit(function(event) {registre(event)});
	document.getElementById("selecciona_editorial").onchange = carregaCursos;
	document.getElementById("selecciona_curs").onchange = carregaLlibres;
	document.getElementById("selecciona_llibre").onchange = actualitza_info_llibre;
	document.getElementById("num_pag").onchange = carregaExercicis;
	document.getElementById("boto_mostra_solucions").onclick = carregaSolucions;
	
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
	/*window.location.href = "#selecciona_exercici";
	carregaEditorials();
	id_usuari_global = Aniol;
	password_global = club9305;*/
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
			console.log(resposta);
			if (resposta.success == 1) {
				// Autenticació correcta
				id_usuari_global = resposta.id_usuari;
				password_global = resposta.password;
				$.mobile.changePage($('#selecciona_exercici')/*, { transition: "flip"}*/ );
				//$("#autenticacio").trigger("pagecreate");
				//window.location.replace = "#selecciona_exercici";
				carregaEditorials();
			} else {
				$('#capsa_login').shake();
				$('#error_login').html("<span style='color:#cc0000'>Error:</span> Nombre de usuario o contraseña incorrectos.");
			}
		}
	);
	return false;
}

function validateEmail(email) { 
  // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function registre(e) {
	e.preventDefault();
	var nom = $("#signup_usuari").val();
	var email = $("#signup_email").val();
	var password = $("#signup_password").val();
	var password_rep = $("#signup_password_rep").val();
	
	
	if (nom == '' || email == '' || password == '' || password_rep == '') {
		//$("#popup_signup").shake();
		//$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Todos los campos son obligatorios.");
		alert("Camps vuits");
	} 
	else if ((password.length) < 4) {
		$("#popup_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> La contraseña debe tener una longitud mínima de 4 caracteres.");
	}
	else if (!validateEmail(email)) {
		$("#popup_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> El formato del correo electrónico no es correcto.");
	}
	else if (!(password).match(password_rep)) {
		$("#popup_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Las contraseñas no coinciden.");
	} 
	else {
		$.getJSON(
		url_registre.concat(jsoncb), 
		{
			usuari: nom,
			password: password,
			email: email
		}, 
		function(resposta) {
			if (resposta.success == 1) {
				$("#popup_signup").popup("close");
				id_usuari_global = resposta.Id_Usuari;
				password_global = password;
				$.mobile.changePage($('#selecciona_exercici')/*, { transition: "flip"}*/ );
				//$("#autenticacio").trigger("pagecreate");
				//window.location.replace = "#selecciona_exercici";
				carregaEditorials();
			}
			else if (resposta.success == '2') {
				$("#popup_signup").shake();
				$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Ya existe un usuario con este nombre o email.");
			}
			else {
				$("#popup_signup").shake();
				$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Se ha producido algún error durante el proceso de registro.");
			}
			
		});
	}
	alert("final");
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
			console.log(resposta);
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
				opcions_llista += '\
				<li>\
					<a href="#" onclick="triaExercici(' + exercicis[i].Id_Exercici + ');">Ejercicio ' + exercicis[i].Numero + '\
						<span class="ui-li-count">' + exercicis[i].NSolucions + '</span>\
						<p class="ui-li-aside">Respuestas</p>\
					</a>\
					<a data-ajax="false" href="aportar.html?id_exercici=' + exercicis[i].Id_Exercici + '&id_usuari=' + id_usuari_global + '&password=' + password_global + '">\
					Aportar solución\
					</a>';
        	}
			$("#llista_exercicis").append(opcions_llista);
			$("#llista_exercicis").listview('refresh');
    	}
	);
}

function triaExercici(id_exercici) {
	id_exercici_global = id_exercici;
	$("#popup_consulta").popup('open');
}

function carregaSolucions() {
	alert(id_exercici_global);
	$.getJSON( 
		url_solucions.concat(jsoncb),
		{
			exercici:id_exercici_global,
			id_usuari:id_usuari_global,
			password:password_global
		},
		function(resposta) {
			alert("resposta");
			console.log(resposta);
			if (resposta.success == 1) {
				alert("success1");
				$.mobile.changePage( "#mostra_solucions", { transition: "slide"} );
				alert("success2");
				$("#boto_aporta_solucions").attr('href','aportar.html?id_exercici=' + id_exercici_global + '&id_usuari=' + id_usuari_global + '&password=' + password_global);
				alert("success");
				solucions = resposta.solucions;
				alert(solucions.length);
				var solucions_llista = '';
				var i;
				var j;
				for(i = 0; i < solucions.length; i++) {
					alert(solucions[i].Id_Solucio);
					var idSolucio = solucions[i].Id_Solucio;
					solucions_llista += '\
					<div class="solucio" data-id="' + solucions[i].Id_Solucio + '" class="ui-body ui-body-a">\
						<p>' + solucions[i].Solucio + '</p>';
						for(j = 0; j < solucions[i].NImatges; j++) {
							solucions_llista += '\
							<p>Figura ' + (j+1) + '</p>\
							<img src=\'http://solucionsdemates.tk/android_connect/get_imatge_solucio.php?id_solucio=' + idSolucio + '&id_usuari=' + id_usuari_global + '&password="' + password_global + '"&nimatge=' + j + '\'>';
						}
					solucions_llista += '\
						<div class="botons_vot">\
							<a data-role="button" type="button ui-btn" class="boto_vot_pos" data-icon="check">' +solucions[i].Vots_Pos + '</a>\
							<a data-role="button" type="button ui-btn" class="boto_vot_neg" data-icon="delete">' +solucions[i].Vots_Neg + '</a>\
						</div>\
					</div>\
					<hr>';	
        		} 
				$('#solucions_detall').html(solucions_llista);
				$(".boto_vot_pos, .boto_vot_neg").button();
				$(".botons_vot").controlgroup("option", "type", ("horizontal"));
			}
			else {
				$("#popup_consulta").popup('close');
				alert(resposta.message);
			}
    	}
	);
}

$(document).on('click','.boto_vot_pos',function(){
	var boto = $(this);
	$.getJSON(
		url_vot_pos.concat(jsoncb),
		{
			id_solucio:$(this).closest(".solucio").attr("data-id"),
			id_usuari:id_usuari_global,
			password:password_global
		},
		function(resposta) {
			boto.find("span .ui-btn-text").text(resposta.vots_positius);
			boto.siblings(".boto_vot_neg").find("span .ui-btn-text").text(resposta.vots_negatius);
			$("#popup_vot").children('p').remove();
			$("#popup_vot").append('<p>' + resposta.missatge + '</p>')
			$("#popup_vot").popup('open');
		}
	)					
});

$(document).on('click','.boto_vot_neg',function(){
	var boto = $(this);
	$.getJSON(
		url_vot_neg.concat(jsoncb),
		{
			id_solucio:$(this).closest(".solucio").attr("data-id"),
			id_usuari:id_usuari_global,
			password:password_global
		},
		function(resposta) {
			boto.find("span .ui-btn-text").text(resposta.vots_negatius);
			boto.siblings(".boto_vot_pos").find("span .ui-btn-text").text(resposta.vots_positius);
			
			$("#popup_vot").children('p').remove();
			$("#popup_vot").append('<p>' + resposta.missatge + '</p>')
			$("#popup_vot").popup('open');
		}
	)			
});

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

/*function obre_foto() {
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
}*/