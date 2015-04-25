var url_autenticacio = "http://queprefereixes.tk/app_connection/autenticacio.php";
var url_registre = "http://queprefereixes.tk/app_connection/registre.php";
var url_pregunta_random = "http://queprefereixes.tk/app_connection/get_random_question.php";
var url_submit_question = "http://queprefereixes.tk/app_connection/submit_question.php";
var jsoncb = "?jsoncallback=?";

var storage = window.localStorage;

// Wait for device API libraries to load
window.onload = onDeviceReady;

function onDeviceReady() {
	document.getElementById("boto_login").onclick = autenticacio;
	$("#formulari_signup").submit(function(event) {registre(event)});
	document.getElementById("boto_logout").onclick = logout;
	$("#formulari_pregunta").submit(function(event) {aporta_pregunta(event)});
	
	if(window.localStorage.key(0)==null) {
		// Usuari no autèntic
		carregaPreguntaRandom();
	}
	else {
		// Usuari autèntic
		$('#boto_usuari .ui-btn-text').text(window.localStorage.getItem("nick"));
		$('#boto_usuari').attr("href","#panel_usuari_autentic");
	}
}

function carregaPregunta() {
	alert("carrega prgunta");
}

function carregaPreguntaRandom() {
	$.getJSON( 
		url_pregunta_random.concat(jsoncb), 
		{}, // No te parametres
		function(resposta) {
			if (resposta.success == 1) {
				$('#pregunta').text(resposta.Pregunta);
				$("#resposta1").prev('span').find('span.ui-btn-text').text(resposta.Resposta1);
				$("#resposta2").prev('span').find('span.ui-btn-text').text(resposta.Resposta2);
				var data = [
					['Heavy Industry', 12],['Retail', 9], ['Light Industry', 14], 
					['Out of home', 16],['Commuting', 7], ['Orientation', 9]
				  ];
				var plot1 = jQuery.jqplot ('chart', [data], 
					{ 
					  seriesDefaults: {
						// Make this a pie chart.
						renderer: jQuery.jqplot.PieRenderer, 
						rendererOptions: {
						  // Put data labels on the pie slices.
						  // By default, labels show the percentage of the slice.
						  showDataLabels: true
						}
					  }, 
					  legend: { show:true, location: 'e' }
					}
				);
			} else {
				//TODO: Deal with
			}
		}
	);
}

function autenticacio() {
	var nick = document.getElementById("usuari").value;
	var pwd = document.getElementById("password").value;
	$.getJSON( 
		url_autenticacio.concat(jsoncb), 
		{
			nick:nick, 
			pwd:pwd
		}, 
		function(resposta) {
			alert(resposta);
			if (resposta.success == 1) {
				// Autenticació correcta
				window.localStorage.setItem("id_usuari", resposta.id_usuari);
				window.localStorage.setItem("pwd", pwd);
				window.localStorage.setItem("nick",nick);
				$('#boto_usuari .ui-btn-text').text(nick);
				$('#boto_usuari').attr("href","#panel_usuari_autentic");
				$('#panel_usuari_no_autentic').panel('close');
				carregaPregunta();
			} else {
				$('#capsa_login').shake();
				$('#error_login').html("<span style='color:#cc0000'>Error:</span> " + resposta.message);
			}
		}
	);
	return false;
}

function logout() {
	window.localStorage.clear();
	$('#boto_usuari .ui-btn-text').text("Identifica't");
	$('#boto_usuari').attr("href","#panel_usuari_no_autentic");
	$('#panel_usuari_autentic').panel('close');
	carregaPreguntaRandom();
}

function validateEmail(email) { 
  // http://stackoverflow.com/a/46181/11236
  
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function registre(e) {
	$('#error_signup').html();
	e.preventDefault();
	var nick = $("#signup_usuari").val();
	var email = $("#signup_email").val();
	var password = $("#signup_password").val();
	var password_rep = $("#signup_password_rep").val();
	var genere = $("#genere").val();
	var generacio = $("#generacio").val();
	
	if (nick == '' || email == '' || password == '' || password_rep == '') {
		//$("#popup_signup").shake();
		//$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Tots els camps són obligatoris.");
		alert("Camps vuits");
	} 
	else if ((password.length) < 4) {
		$("#capsa_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> La contrassenya ha de tenir una longitud mínima de 4 caràcters.");
	}
	else if (!validateEmail(email)) {
		$("#capsa_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> El format del correu electrónic no és correcte.");
	}
	else if (!(password).match(password_rep)) {
		$("#capsa_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Les contrassenyes no coincideixen.");
	} 
	else {
		$('#error_signup').html("Processant...");
		$.getJSON(
		url_registre.concat(jsoncb), 
		{
			nick: nick,
			pwd: password,
			email: email,
			genere: genere,
			generacio: generacio
		}, 
		function(resposta) {
			if (resposta.success == 1) {
				// TODO: Instar l'usuari perquè s'autentiqui
				$("#panel_usuari_no_autentic").panel("close");
			}
			else if (resposta.success == 2) {
				$("#capsa_signup").shake();
				$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Ja existeix un usuari amb aquest nick o email.");
			}
			else {
				$("#capsa_signup").shake();
				$('#error_signup').html("<span style='color:#cc0000'>Error:</span> S'ha produït un error durant el procés de registre.");
			}
		});
	}
}

function aporta_pregunta() {
	var id_usuari = window.localStorage.getItem("id_usuari");
	var pwd = window.localStorage.getItem("pwd");
	alert(id_usuari + pwd);
	var pregunta = $('#formulari_pregunta #pregunta').val();
	var r1 = $('#formulari_pregunta #r1').val();
	var r2 = $('#formulari_pregunta #r2').val();
	$.getJSON( 
		url_submit_question.concat(jsoncb), 
		{
			id_usuari:id_usuari, 
			pwd:pwd,
			pregunta:pregunta,
			r1:r1,
			r2:r2
		}, 
		function(resposta) {
			if (resposta.success == 1) {
				alert("yeah");
			} else {
				alert("no yeah" + resposta.message);
			}
		}
	);
	return false;
}
