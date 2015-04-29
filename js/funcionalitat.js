var url_autenticacio = "http://queprefereixes.tk/app_connection/autenticacio.php";
var url_registre = "http://queprefereixes.tk/app_connection/registre.php";
var url_pregunta_random = "http://queprefereixes.tk/app_connection/get_random_question.php";
var url_pregunta = "http://queprefereixes.tk/app_connection/get_question.php";
var url_submit_question = "http://queprefereixes.tk/app_connection/submit_question.php";
var url_submit_answer = "http://queprefereixes.tk/app_connection/submit_answer.php";
var jsoncb = "?jsoncallback=?";
var usuari_activat=false;
var pregunta_actual;
var storage = window.localStorage;

window.onload = onDeviceReady;

function onDeviceReady() {
	document.getElementById("boto_login").onclick = autenticacio;
	$("#formulari_signup").submit(function(event) {registre(event)});
	document.getElementById("boto_logout").onclick = logout;
	$("#formulari_pregunta").submit(function(event) {aporta_pregunta(event)});
	$("#estadistiques").hide();
	
	if(window.localStorage.key(0)==null) {
		// Usuari no autèntic
		carregaPreguntaRandom();
	}
	else {
		// Usuari autèntic
		usuari_activat=true;
		$('#boto_usuari .ui-btn-text').text(window.localStorage.getItem("nick"));
		$('#boto_usuari').attr("href","#panel_usuari_autentic");
		carregaPregunta();
	}
}

function carregaPregunta() {
	$("#coll_stats").collapsible("option","collapsed",true);
	var id_usuari = window.localStorage.getItem("id_usuari");
	var pwd = window.localStorage.getItem("pwd");
	$.getJSON( 
		url_pregunta.concat(jsoncb), 
		{
			id_usuari: id_usuari,
			pwd: pwd
		},
		function(resposta) {
			if (resposta.success == 1) {
				mostra_pregunta(resposta.Pregunta, resposta.Resposta1, resposta.Resposta2);
				pregunta_actual = resposta.Id_Pregunta;
			} else {
				//TODO: Deal with
				alert(resposta.message);
			}
		}
	);
}

function carregaPreguntaRandom() {
	$.getJSON( 
		url_pregunta_random.concat(jsoncb), 
		{}, // No te parametres
		function(resposta) {
			if (resposta.success == 1) {
				mostra_pregunta(resposta.Pregunta, resposta.Resposta1, resposta.Resposta2);
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
			if (resposta.success == 1) {
				// Autenticació correcta
				usuari_activat=true;
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
	usuri_activat = false;
	window.localStorage.clear();
	$('#boto_usuari .ui-btn-text').text("Identifica't");
	$('#boto_usuari').attr("href","#panel_usuari_no_autentic");
	$('#panel_usuari_autentic').panel('close');
	carregaPreguntaRandom();
	$("#estadistiques").hide();
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

function aporta_resposta(resposta) {
	if (usuari_activat) {
		var id_usuari = window.localStorage.getItem("id_usuari");
		var pwd = window.localStorage.getItem("pwd");
		$.getJSON( 
			url_submit_answer.concat(jsoncb), 
			{
				id_usuari:id_usuari, 
				pwd:pwd,
				id_pregunta:pregunta_actual,
				resposta: resposta
			}, 
			function(resposta) {
				if (resposta.success == 1) {
					$("#estadistiques").show();
					var total = resposta.NResposta1 + resposta.NResposta2;
					$(".boto-resposta").button("disable");
					var data = [
						['opció B', resposta.NResposta2 / total],['opció A', resposta.NResposta1 / total]
					  ];
					mostra_grafica($('#chart'),data,'Titol');
					mostra_grafica($('#chart2'),data,'Titol');
					mostra_grafica($('#chart3'),data,'Titol');
					mostra_grafica($('#chart4'),data,'Titol');
				} else {
					// TODO: Deal with
					alert("no yeah" + resposta.message);
				}
			}
		);
	}
	else {
		carregaPreguntaRandom();
	}
	return false;
}

function mostra_grafica(element, data, title) {
	/*jQuery.jqplot (element, [data], 
		{
			grid: {
				borderColor: 'transparent',
				shadow: false,
				background: 'transparent'
			},
			seriesDefaults: {
				// Make this a pie chart.
				renderer: jQuery.jqplot.PieRenderer, 
				rendererOptions: {
					// Put data labels on the pie slices.
					// By default, labels show the percentage of the slice.
					showDataLabels: true,
					seriesColors: [ "#1C86EE", "#FF8C00"]
				}
			}
		}
	);*/
	//TODO: L'anterior és per mostrar la grafica amb jqPlot. Si no ho fax servir s'haurien de borrar els fitxers corresponents de la carpeta js i els links de les capsaleres
	
	element.highcharts({
		chart: {
			type: 'pie',
			options3d: {
				enabled: true,
				alpha: 45,
				beta: 0
			},
			backgroundColor: 'transparent'
		},
		credits: {
			enabled: false
		},
		exporting: {
			enabled: false	// Es poden exportar gràfiques, però molaria que es pogués afegir info abans (pregunta i opcions A i B). TODO: Mirar-ho per més endavant
		},
		colors: [ "#FF8C00", "#1C86EE"],
		title: {
			text: title
		},
		tooltip: {
			pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				cursor: 'pointer',
				depth: 35,
				dataLabels: {
					enabled: true,
					format: '{point.percentage:.1f}%</b>'
				}
			}
		},
		series: [{
			type: 'pie',
			name: 'percentatge',
			data: data
		}]
	});
}

function exit() {
	navigator.app.exitApp();
}

function mostra_pregunta(p,r1,r2) {
	$(".boto-resposta").button("enable");
	$("#estadistiques").hide();
	$('#pregunta').text(p);
	$("#resposta1").siblings("span").remove();
	$("#resposta2").siblings("span").remove();
	$("#resposta1").parent().append("<span>A) " + r1 + "</span>");
	$("#resposta2").parent().append("<span>B) " + r2 + "</span>");
	return false;
}