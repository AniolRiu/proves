var url_autenticacio = "http://queprefereixes.tk/app_connection/autenticacio.php";
var url_registre = "http://queprefereixes.tk/app_connection/registre.php";
var url_pregunta_random = "http://queprefereixes.tk/app_connection/get_random_question.php";
var url_pregunta = "http://queprefereixes.tk/app_connection/get_question.php";
var url_submit_question = "http://queprefereixes.tk/app_connection/submit_question.php";
var url_submit_answer = "http://queprefereixes.tk/app_connection/submit_answer.php";
var url_get_stats = "http://queprefereixes.tk/app_connection/get_stats.php";
var url_mark_as_inappropriate = "http://queprefereixes.tk/app_connection/mark_as_inappropriate.php";
var jsoncb = "?jsoncallback=?";
var usuari_activat = false;
var next_question_enabled = false;
var id_pregunta_actual, id_pregunta_futura, pregunta, resposta1, resposta2, n_resposta1, n_resposta2, primera_pregunta = 0;
var storage = window.localStorage;
var screen_w, screen_h;
var indexPregunta = 0; // Conta les preguntes per posar publicitat cada 5 preguntes
var admobid = {};	// Guarda els paràmetres de la publicitat
var lang = _("cat");
window.onload = onDeviceReady;

function onDeviceReady() {
	$(function() {
		FastClick.attach(document.body);
	});
	
	$("#formulari_signup").submit(function(e) {registre(e)});
	$("#formulari_login").submit(function(e) {autenticacio(e)});
	$("#formulari_pregunta").submit(function(e) {aporta_pregunta(e)});
	$("#formulari_filter_stats").submit(function(e) {get_stats(e)});
	$("#boto_filtrar").click(get_stats);
	$("#boto_mark_as_inappropriate").click(mark_as_inappropriate);
	$("#estadistiques").hide();
	
	$(".boto-resposta").button();	// Això és pq no falli a la primera iteració quan posem els botons en enable
	$("div[data-role='popup']").popup();	// Pq no falli a la 1a iteració quan tanquem els popups al mostrar el popup de benvinguda
	
	// Escoltem el swipe i cambiem de pregunta quan pertoqui
	$.extend($.event.special.swipe,{
	  scrollSupressionThreshold: 10, // More than this horizontal displacement, and we will suppress scrolling.
	  durationThreshold: 500, // More time than this, and it isn't a swipe.
	  horizontalDistanceThreshold: 30,  // Swipe horizontal displacement must be more than this.
	});
	jQuery( window ).on( "swipeleft", function( event ) {
		if(next_question_enabled){
			mostra_pregunta(1);
		}
	} )
	
	var AdHeight = 32;
	screen_w = window.innerWidth;
	screen_h = window.innerHeight - AdHeight;

	mida_popup = (screen_w < screen_h) ?  screen_w: screen_h;
	$("#popup_stats").css("height", (mida_popup*2/3) + 'px').css("width", (mida_popup*2/3) + 'px');
	ad();	// Cridem la generació de publicitat. Això s'hauria de treure en una hipotètica versió per ordinador
	if(window.localStorage.key(0)==null) {
		// Usuari no autèntic
		logout();
	}
	else {
		// Usuari autèntic
		login();
	}
}

$(document).ready(function(){ 
	// Aquesta funció es crida quan tots els objectes de la DOM estan carregats
	// Formulari aporta una pregunta
	$("#h_submit_question").text(_("Aporta una pregunta"));
	$("#formulari_pregunta #pregunta").attr("value", _("Què prefereixes?"));
	$("#r1").attr("placeholder", _("Opció A"));
	$("#r2").attr("placeholder", _("Opció B"));
	
	// Formulari inapropiat
	$("#h_inappropriate").text(_("Marca com a inapropiat"));
	$("#p_inappropriate").text(_("Voleu marcar aquesta pregunta com a inapropiada pel seu contingut?"));
	
	//Formulari LogIn
	$("#formulari_login #usuari").attr("placeholder", _("Nom d'usuari"));
	$("#formulari_login #password").attr("placeholder", _("Contrassenya"));
	
	//Formulari SignUp
	$("#signup_usuari").attr("placeholder", _("Nom d'usuari"));
	$("#signup_email").attr("placeholder", _("Email"));
	$("#signup_password").attr("placeholder", _("Contrassenya"));
	$("#signup_password_rep").attr("placeholder", _("Repeteix la contrassenya"));
	// Per cambiar el placeholder dels selects canviem el text de l'span creat per juqery
	$("#genere option:nth-child(2)").text(_("Home"));
	$("#genere option:nth-child(3)").text(_("Dona"));
	$("#generacio option:nth-child(2)").text(_("Anterior"));
});

function carregaPregunta() {
	var id_usuari = window.localStorage.getItem("id_usuari");
	var pwd = window.localStorage.getItem("pwd");
	$.getJSON( 
		url_pregunta.concat(jsoncb), 
		{
			lang: lang,
			id_usuari: id_usuari,
			pwd: pwd,
			n_pregunta: primera_pregunta
		},
		function(resposta) {
			if (resposta.success == 1) {
				id_pregunta_futura = resposta.Id_Pregunta;
				pregunta = resposta.Pregunta;
				resposta1 = resposta.Resposta1;
				resposta2 = resposta.Resposta2;
				n_resposta1 = resposta.NResposta1;
				n_resposta2 = resposta.NResposta2;
				if (primera_pregunta == 0) {
					primera_pregunta = 1;
					mostra_pregunta(0);
				}
			} else {
				//TODO: Deal with
				show_message(_(resposta.message));
			}
		}
	);
}

function carregaPreguntaRandom() {
	$.getJSON( 
		url_pregunta_random.concat(jsoncb), 
		{
			lang: lang
		},
		function(resposta) {
			if (resposta.success == 1) {
				pregunta = resposta.Pregunta;
				resposta1 = resposta.Resposta1;
				resposta2 = resposta.Resposta2;
				if(primera_pregunta == 0) {
					primera_pregunta = 1;
					mostra_pregunta(0);
				}
			} else {
				//TODO: Deal with
				show_message(_(resposta.message));
			}
		}
	);
}

function mostra_pregunta(primera_pregunta) {
	if(1==primera_pregunta)$.mobile.changePage( "#main", {allowSamePageTransition:"true", transition: "slide"})
	
	// TODO: Descomentar al compilar
	if(indexPregunta==5) {
		indexPregunta=0;
		// show the interstitial later, e.g. at end of game level
		if(AdMob) AdMob.showInterstitial();
	}
	if(indexPregunta==1){
		// preppare and load ad resource in background, e.g. at begining of game level
		if(AdMob) AdMob.prepareInterstitial( {
			adId:admobid.interstitial, 
			autoShow:false,
			isTesting: false
		} );
	}
	indexPregunta++;

	$('#h_pregunta').text(pregunta);
	$("#resposta1").siblings("span").remove();
	$("#resposta2").siblings("span").remove();
	$("#resposta1").parent().append("<span>A) " + resposta1 + "</span>");
	$("#resposta2").parent().append("<span>B) " + resposta2 + "</span>");
	
	if(usuari_activat){
		next_question_enabled = false;
		$(".boto-resposta").button("enable");
		$("#estadistiques").hide();
		id_pregunta_actual = id_pregunta_futura;
		carregaPregunta();
		$("#popup_stats").popup("close");
	}
	else {
		carregaPreguntaRandom();
	}
	
	return false;
}

function aporta_resposta(resposta) {
	if (usuari_activat) {
		next_question_enabled = true;
		$("#estadistiques").show();
		var total = n_resposta1 + n_resposta2;
		$(".boto-resposta").button("disable");
		var data = [
			['opció B', n_resposta2 / total],['opció A', n_resposta1 / total]
		];
		mostra_grafica($('#chart'),data,'Respostes');
		
		var id_usuari = window.localStorage.getItem("id_usuari");
		var pwd = window.localStorage.getItem("pwd");
		$.getJSON( 
			url_submit_answer.concat(jsoncb), 
			{
				lang: lang,
				id_usuari: id_usuari,
				pwd: pwd,
				id_pregunta: id_pregunta_actual,
				resposta: resposta
			},
			function(resposta) {
				if (resposta.success != 1) {
					show_message(_(resposta.message));
				}
			}
		);
	}
	else {
		mostra_pregunta(1);
	}
	return false;
}

function autenticacio(e) {
	e.preventDefault();
	var nick = document.getElementById("usuari").value;
	var pwd = document.getElementById("password").value;
	$.getJSON( 
		url_autenticacio.concat(jsoncb), 
		{
			lang: lang,
			nick:nick, 
			pwd:pwd
		}, 
		function(resposta) {
			if (resposta.success == 1) {
				// Autenticació correcta
				window.localStorage.setItem("id_usuari", resposta.id_usuari);
				window.localStorage.setItem("pwd", pwd);
				window.localStorage.setItem("nick",nick);
				login();
			} else {
				$('#formulari_login').shake();
				$('#error_login').html("<span style='color:#cc0000'>Error:</span> " + _(resposta.message));
			}
		}
	);
	return false;
}

function login() {
	$("#header_no_autentic").hide();
	$("#header_autentic").show();
	usuari_activat = true;
	primera_pregunta = 0;
	carregaPregunta();
	show_message(_("Encantats de tornar-te a veure, ") + window.localStorage.getItem("nick"));
}

function logout() {
	$("#header_autentic").hide();
	$("#header_no_autentic").show();
	
	$(".boto-resposta").button("enable");
	$("#estadistiques").hide();
	
	usuari_activat = false;
	window.localStorage.clear();
	primera_pregunta = 0;
	carregaPreguntaRandom();
}

function registre(e) {
	
	function validateEmail(email) { 
		// http://stackoverflow.com/a/46181/11236
	  
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
	
	e.preventDefault();
	$('#error_signup').html();
	var nick = $("#signup_usuari").val();
	var email = $("#signup_email").val();
	var password = $("#signup_password").val();
	var password_rep = $("#signup_password_rep").val();
	var genere = $("#formulari_signup #genere").val();
	var generacio = $("#generacio").val();
	
	if (nick == '' || email == '' || password == '' || password_rep == '') {
		//$("#popup_signup").shake();
		//$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Tots els camps són obligatoris.");
		$("#formulari_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> " + _("Camps obligatoris buits."));
	} 
	else if ((password.length) < 4) {
		$("#formulari_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> " + _("La contrassenya ha de tenir una longitud mínima de 4 caràcters."));
	}
	else if (!validateEmail(email)) {
		$("#formulari_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> " + _("El format del correu electrónic no és correcte."));
	}
	else if (!(password).match(password_rep)) {
		$("#formulari_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> " + _("Les contrassenyes no coincideixen."));
	} 
	else {
		$('#error_signup').html(_("Processant..."));
		$.getJSON(
		url_registre.concat(jsoncb), 
		{
			lang: lang,
			nick: nick,
			pwd: password,
			email: email,
			genere: genere,
			generacio: generacio
		}, 
		function(resposta) {
			if (resposta.success == 1) {
				// TODO: Instar l'usuari perquè s'autentiqui
				//$("#panel_usuari_no_autentic").panel("close");
				$('#error_signup').html("");
				show_message(_("S'ha enviat un mail de verificació a ") + email + _(". Per completar el registre cal verificar el mail. Mentrestant, diverteix-te amb unes quantes preguntes aleatòries!"));
			}
			else {
				$("#formulari_signup").shake();
				$('#error_signup').html("<span style='color:#cc0000'>Error:</span> " + _(resposta.message));
			}
		});
	}
}

function aporta_pregunta(e) {
	e.preventDefault()
	$('#error_submit_question').html(_("Processant..."));
	var id_usuari = window.localStorage.getItem("id_usuari");
	var pwd = window.localStorage.getItem("pwd");
	var pregunta = $('#formulari_pregunta #pregunta').val();
	var r1 = $('#formulari_pregunta #r1').val();
	var r2 = $('#formulari_pregunta #r2').val();
	if (pregunta == '' || r1 == '' || r2 == '') {
		$("#formulari_pregunta").shake();
		$('#error_submit_question').html("<span style='color:#cc0000'>Error:</span> " + _("Camps obligatoris buits."));
	}
	else if (r1 == r2) {
		$("#formulari_pregunta").shake();
		$('#error_submit_question').html("<span style='color:#cc0000'>Error:</span> " + _("Les respostes han de ser diferents, evidentment") + " ;)");
	}
	else {
		$.getJSON( 
			url_submit_question.concat(jsoncb), 
			{
				lang: lang,
				id_usuari:id_usuari, 
				pwd:pwd,
				pregunta:pregunta,
				r1:r1,
				r2:r2
			}, 
			function(resposta) {
				if (resposta.success == 1) {
					show_message(_("La pregunta s'ha penjat correctament. Gràcies per aportar!"));
					$('#formulari_pregunta #pregunta').val(_("Què prefereixes?"));
					$('#formulari_pregunta #r1').val('');
					$('#formulari_pregunta #r2').val('');
					$('#error_submit_question').html('');
				} else {
					$("#formulari_pregunta").shake();
					/* Error messages
					"No s'ha pogut afegir la pregunta."
					"No s'ha trobat l'usuari de la sessió actual"
					*/
					$('#error_submit_question').html("<span style='color:#cc0000'>Error: </span>" + _(resposta.message));
				}
			}
		);
	}
	return false;
}

function mark_as_inappropriate(e) {
	e.preventDefault()
	$('#error_mark_as_inappropriate').html("Processant...");
	var id_usuari = window.localStorage.getItem("id_usuari");
	var pwd = window.localStorage.getItem("pwd");
	var pregunta = id_pregunta_actual;
	next_question_enabled = true;
	$.getJSON( 
		url_mark_as_inappropriate.concat(jsoncb), 
		{
			lang: lang,
			id_usuari:id_usuari, 
			pwd:pwd,
			id_pregunta:pregunta
		}, 
		function(resposta) {
			$('#error_mark_as_inappropriate').html("");
			show_message(_(resposta.message));
		}
	);
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
			backgroundColor: 'transparent',
			height: (mida_popup*2/3) - 10,
			width: (mida_popup*2/3) - 10
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
	$("#popup_stats").popup('open');
}

function get_stats(e) {
	e.preventDefault()
	var id_usuari = window.localStorage.getItem("id_usuari");
	var pwd = window.localStorage.getItem("pwd");
	var pregunta = id_pregunta_actual;
	var genere = $('#formulari_filter_stats #genere').val();
	var generacio = $('#formulari_filter_stats #generacio').val();
	$.getJSON( 
		url_get_stats.concat(jsoncb), 
		{
			lang: lang,
			id_usuari:id_usuari, 
			pwd:pwd,
			pregunta:pregunta,
			genere:genere,
			generacio:generacio
		}, 
		function(resposta) {
			if (resposta.success == 1) {
				var total = resposta.NResposta1 + resposta.NResposta2;
				$(".boto-resposta").button("disable");
				var data = [
					[_("opció") + ' B', resposta.NResposta2 / total],[_("opció") + ' A', resposta.NResposta1 / total]
				  ];
				var titol_genere = "";
				if(genere == '0')titol_genere=_("dels homes ");
				if(genere == '1')titol_genere=_("de les dones ");
				var titol_generacio = "";
				if(generacio != 'nul')titol_generacio=_("de la generacio dels ") + generacio + _("'s");
				mostra_grafica($('#chart'),data,_('Respostes ') + titol_genere + titol_generacio);
			} else {
				show_message(_(resposta.message));
			}
		}
	);
	return false;
}

function show_message(text) {
	$("div[data-role='popup']").popup("close");
	alert(text);
	/*$("#text_message").text(text);
	$("#popup_message").popup("open");
	$(document).on("pagecontainershow", function (e, ui) {
	   setTimeout(function () {
			$("#popup_message", ui.toPage).popup("open");
		}, 0);
	});
	setTimeout(function() {
		$("#popup_message").popup("close");
	}, 4000);*/
}

function ad() {
	// select the right Ad Id according to platform
    if( /(android)/i.test(navigator.userAgent) ) { // for android
        admobid = {
            banner: 'ca-app-pub-5785179440070320/5496156892', // or DFP format "/6253334/dfp_example_ad"
            interstitial: 'ca-app-pub-5785179440070320/6972890093'
        };
    } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
        admobid = {
            banner: 'ca-app-pub-xxx/zzz', // or DFP format "/6253334/dfp_example_ad"
            interstitial: 'ca-app-pub-xxx/kkk'
        };
    } else { // for windows phone
        admobid = {
            banner: 'ca-app-pub-xxx/zzz', // or DFP format "/6253334/dfp_example_ad"
            interstitial: 'ca-app-pub-xxx/kkk'
        };
    }
	
	// it will display smart banner at top center, using the default options
	if(AdMob) AdMob.createBanner( {
		adId: admobid.banner, 
		position: AdMob.AD_POSITION.BOTTOM_CENTER, 
		autoShow: true,
		isTesting: false
	} );
}

function share(expr){
	var pregunta_actual = $("#h_pregunta").text();
	var resposta1_actual = $("#resposta1").siblings("span").text();
	var resposta2_actual = $("#resposta2").siblings("span").text();
	var missatge = pregunta_actual + "\n" + resposta1_actual + "\n" + resposta2_actual + _("\nMés preguntes estúpides a l'app QuèPrefereixes?\n");
	var url = "https://play.google.com/store/apps/details?id=com.articapps." + _("queprefereixes");
	var img = "http://queprefereixes.tk/favicon.png";
    switch (expr) { 
      case "Twitter": 
        window.plugins.socialsharing.shareViaTwitter(missatge, img, url); 
        $("#popup_share").popup('close');
        break; 
      case "Facebook": 
		window.plugins.socialsharing.shareViaFacebook(missatge, img, url); 
		$("#popup_share").popup('close');
        break; 
      case "WhatsApp": 
		window.plugins.socialsharing.shareViaWhatsApp(missatge, img, url); 
		$("#popup_share").popup('close');
        break;
      //default: 
        //TODO: Deal with
    } 
}

/* Amb aquesta funcio substiutim els strings en funcio de l'idioma que hi hagi carregat */
function _(s) {
   if (typeof(i18n)!='undefined' && i18n[s]) {
      return i18n[s];
   }
   return s;
}

function sortOnKeys(dict) {

    var sorted = [];
    for(var key in dict) {
        sorted[sorted.length] = key;
    }
    sorted.sort();

    var tempDict = {};
    for(var i = 0; i < sorted.length; i++) {
        tempDict[sorted[i]] = dict[sorted[i]];
    }

    return tempDict;
}
