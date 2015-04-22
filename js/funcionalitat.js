var url_autenticacio = "http://queprefereixes.tk/app_connection/autenticacio.php";
var url_registre = "http://queprefereixes.tk/app_connection/registre.php";
url_pregunta_random = "http://queprefereixes.tk/app_connection/get_random_question.php";
var jsoncb = "?jsoncallback=?";

var id_usuari_global;
var password_global;

// Wait for device API libraries to load
window.onload = onDeviceReady;

function onDeviceReady() {
	document.getElementById("boto_login").onclick = autenticacio;
	$("#formulari_signup").submit(function(event) {registre(event)});
	carregaPreguntaRandom();
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
				
				jQuery(function ($) {
            /**
             * A jQuery plugin that loads data from HTML tables, Google Sheets and data arrays and draws charts using Google Charts.
             *
             * Using HTML Tables
             * HTML tables can help make the chart data accessible.
             * You can either display the table with the chart or accessibly hide the table
             *
             * Suggested HTML Table setup
             * Create an HTML table with a caption and 'th' elements in the first row
             * For each 'th' element apply one of the following
             * 'data-type' attribute: 'string' 'number' 'boolean' 'date' 'datetime' 'timeofday'
             * or 'data-role' attribute:  'tooltip','annotation'
             * The caption element's text is used as a title for the chart by default.
             *
             * Apply the jQuery Chartinator plugin to the chart canvas(es)
             * or select the table(s) and Chartinator will insert a new chart canvas(es) after the table
             * or create js data arrays
             * See examples below and the readme file for more info
             */

            
            //  Pie Chart Example
            var chart2 = $('#pieChart').chartinator({

                // Custom Options ------------------------------------------------------
                // Note: This example appends data from a data array
                // to the data extracted from an HTML table
                // Google Charts does not support custom tooltips or annotations on Pie Charts

                // Append the following rows of data to the data extracted from the table
                rows: [
                    ['France', 5],
                    ['Mexico', 2]],

                // The chart type - String
                // Derived from the Google Charts visualization class name
                // Default: 'BarChart'
                // Use TitleCase names. eg. BarChart, PieChart, ColumnChart, Calendar, GeoChart, Table.
                // See Google Charts Gallery for a complete list of Chart types
                // https://developers.google.com/chart/interactive/docs/gallery
                chartType: 'PieChart',

                // The chart aspect ratio custom option - width/height
                // Used to calculate the chart dimensions relative to the width or height
                // this is overridden if the Google Chart's height and width options have values
                // Suggested value: 1.25
                // Default: false - not used
                chartAspectRatio: 1.25,

                // Google Pie Chart Options
                pieChart: {

                    // Width of chart in pixels - Number
                    // Default: automatic (unspecified)
                    width: null,

                    // Height of chart in pixels - Number
                    // Default: automatic (unspecified)
                    //height: 400,

                    chartArea: {
                        left: "25%",
                        top: "0%",
                        width: "50%",
                        height: "50%"
                    },

                    // The font size in pixels - Number
                    // Or use css selectors as keywords to assign font sizes from the page
                    // For example: 'body'
                    // Default: false - Use Google Charts defaults
                    fontSize: 'body',

                    // Font-family name - String
                    // Default: 'Arial'
                    //fontName: 'Roboto',

                    // Chart Title - String
                    // Default: Table caption.
                    //title: 'Pie Chart Sample',

                    titleTextStyle: {

                        // The font size in pixels - Number
                        // Or use css selectors as keywords to assign font sizes from the page
                        // For example: 'body'
                        // Default: false - Use Google Charts defaults
                        fontSize: 'h3'
                    },
                    legend: {

                        // Legend position - String
                        // Options: bottom, top, left, right, in, none.
                        // Default: right
                        position: 'none'
                    },

                    // Array of colours
                    colors: ['#94ac27', '#3691ff', '#e248b3', '#f58327', '#bf5cff'],

                    // Make chart 3D - Boolean
                    // Default: false.
                    is3D: true,

                    tooltip: {

                        // Shows tooltip with values on hover - String
                        // Options: focus, none.
                        // Default: focus
                        trigger: 'focus'
                    }
                }
            });

        });
				
			} else {
				//TODO: Deal with
			}
		}
	);
}

function autenticacio() {
	$.getJSON( 
		url_autenticacio.concat(jsoncb), 
		{
			nick:document.getElementById("usuari").value, 
			pwd:document.getElementById("password").value
		}, 
		function(resposta) {
			console.log(resposta);
			if (resposta.success == 1) {
				// Autenticació correcta
				id_usuari_global = resposta.id_usuari;
				password_global = resposta.password;
				$.mobile.changePage($('#main'), { transition: "flip"});
				carregaPregunta();
			} else {
				$('#capsa_login').shake();
				$('#error_login').html("<span style='color:#cc0000'>Error:</span> Nick d'usuari o contrassenya incorrectes.");
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
	var nick = $("#signup_usuari").val();
	var email = $("#signup_email").val();
	var password = $("#signup_password").val();
	var password_rep = $("#signup_password_rep").val();
	
	
	if (nick == '' || email == '' || password == '' || password_rep == '') {
		//$("#popup_signup").shake();
		//$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Tots els camps són obligatoris.");
		alert("Camps vuits");
	} 
	else if ((password.length) < 4) {
		$("#popup_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> La contrassenya ha de tenir una longitud mínima de 4 caràcters.");
	}
	else if (!validateEmail(email)) {
		$("#popup_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> El format del correu electrónic no és correcte.");
	}
	else if (!(password).match(password_rep)) {
		$("#popup_signup").shake();
		$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Les contrassenyes no coincideixen.");
	} 
	else {
		$.getJSON(
		url_registre.concat(jsoncb), 
		{
			nick: nick,
			pwd: password,
			email: email
		}, 
		function(resposta) {
			$('#error_signup').html("Processant...");
			if (resposta.success == 1) {
				$("#popup_signup").popup("close");
				id_usuari_global = resposta.Id_Usuari;
				password_global = pwd;
				$.mobile.changePage($('#main'), { transition: "flip"});
				carregaPregunta();
			}
			else if (resposta.success == '2') {
				$("#popup_signup").shake();
				$('#error_signup').html("<span style='color:#cc0000'>Error:</span> Ja existeix un usuari amb aquest nick o email.");
			}
			else {
				$("#popup_signup").shake();
				$('#error_signup').html("<span style='color:#cc0000'>Error:</span> S'ha produït un error durant el procés de registre.");
			}
			
		});
	}
}