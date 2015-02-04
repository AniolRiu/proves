var adresa;
var h = ['res/ops_h.png'];
var v = ['res/ops_v.png'];
var orientacio = (window.screen.availWidth > window.screen.availHeight ? "h" : "v" );
var num_imatges_h=h.length;
var num_imatges_v=v.length;
var periode = 15;
var interval;

$(document).ready(function() {
	carregaImatge();
	$("#div_missatge").hide();
	interval=setInterval(function() {carregaImatge();}, periode * 1000);
	$('html').click(function() {carregaImatge();});
	descarregaLlista();
	
	
	if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
		document.addEventListener('deviceready', initApp, false);
	} else {
		document.addEventListener('keydown', function(event) {
			if(event.keyCode == 37) {
				desaccelera();
			}
			else if(event.keyCode == 39) {
				accelera();
			}
		});
		initApp();
	}
});

function desaccelera() {
	/*
	 * El periode minim son 5 segons
	 * De 5 a 15 augmenta de 5 en 5
	 * de 15 a 60 augmenta de 15 en 15
	 * a partir de 60 augmenta de 60 en 60
	 */
	var missatge;
	if (periode == 5 ) {
		missatge = "Minimum refresh time is 5 secs";
	}
	else if (periode < 16) {
		periode -= 5;
		missatge = "Refresh time: " + periode + " secs";
	}
	else if (periode < 61) {
		periode -= 15;
		missatge = "Refresh time: " + periode + " secs";
	}
	else {
		periode -= 60;
		missatge = "Refresh time: " + periode / 60 + " mins";
	}
	$("#missatge").html(missatge);
	$("#div_missatge").show();
	setTimeout(function() {$("#div_missatge").hide();},5000);
	clearInterval(interval);
	interval = setInterval(function() {carregaImatge();}, periode * 1000);
}

function accelera() {
	/*
	 * El periode minim son 5 segons
	 * De 5 a 15 augmenta de 5 en 5
	 * de 15 a 60 augmenta de 15 en 15
	 * a partir de 60 augmenta de 60 en 60
	 */
	var missatge;
	if (periode < 14) {
		periode += 5;
		missatge = "Refresh time: " + periode + " secs";
	}
	else if (periode < 59) {
		periode += 15;
		missatge = "Refresh time: " + periode + " secs";
	}
	else {
		periode += 60;
		missatge = "Refresh time: " + periode / 60 + " mins";
	}
	$("#missatge").html(missatge);
	$("#div_missatge").show();
	setTimeout(function() {$("#div_missatge").hide();},5000);
	clearInterval(interval);
	interval = setInterval(function() {carregaImatge();}, periode * 1000);
}

function getAdresa(num) {
	adresa=(orientacio == "h" ? h[num] : v[num]);
}

function descarregaLlista() {
	$.getJSON(
		"http://randomframe.tk/repo.php?jsoncallback=?",
		{
			num:"l"	//llista
		}, 
		function(resposta) {
			console.log(resposta);
			h=resposta.horitzontals;
			v=resposta.verticals;
			num_imatges_h=h.length; 
			num_imatges_v=v.length;
		}
	);
}

function carregaImatge() {
	var num_imatges = (orientacio == "h" ? num_imatges_h : num_imatges_v);
	getAdresa(Math.floor(Math.random() * num_imatges));
	document.body.style.backgroundImage="url(" + adresa + ")";
}

function createSelectedBanner() {
	AdMob.createBanner( {adId:admobid.banner} );
}
		
var ad_units = {
	ios : {
		banner: 'ca-app-pub-5785179440070320/2064822897'
	},
	android : {
		banner: 'ca-app-pub-5785179440070320/7600312495'
	}
};
var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

function initApp() {
	// Les dues comandes següents s'han de cridar un cop s'ha fet el fire de deviceready
	document.addEventListener("volumedownbutton", desaccelera, false);
	document.addEventListener("volumeupbutton", accelera, false);
	
	// A partir daki, publicitat
	if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
	initAd();
	// display the banner at startup
	
	window.onclick = carregaImatge;
	createSelectedBanner();
}

function initAd(){
	var defaultOptions = {
		bannerId: admobid.banner,
		adSize: 'SMART_BANNER',
		position: AdMob.AD_POSITION.BOTTOM_CENTER,
		offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
		bgColor: 'black', // color name, or '#RRGGBB'
		isTesting: false, // set to true, to receiving test ad for testing purpose
		autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
	};
	AdMob.setOptions( defaultOptions );
	registerAdEvents();
}
// optional, in case respond to events or handle error
function registerAdEvents() {
	// new events, with variable to differentiate: adNetwork, adType, adEvent
	document.addEventListener('onAdFailLoad', function(data){ 
		alert('error: ' + data.error + 
				', reason: ' + data.reason + 
				', adNetwork:' + data.adNetwork + 
				', adType:' + data.adType + 
				', adEvent:' + data.adEvent); // adType: 'banner' or 'interstitial'
	});
	document.addEventListener('onAdLoaded', function(data){});
	document.addEventListener('onAdPresent', function(data){});
	document.addEventListener('onAdLeaveApp', function(data){});
	document.addEventListener('onAdDismiss', function(data){});
}

function onResize() {
	var or_antic = orientacio;
	orientacio = ($( window ).width() > $( window ).height() ? "h" : "v" );
	if (or_antic != orientacio) {carregaImatge();}
	
	//var s = document.getElementById('sizeinfo');
	//s.innerHTML = "web view: " + window.innerWidth + " x " + window.innerHeight;
}
