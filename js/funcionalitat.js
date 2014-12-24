var adresa;
var num_imatges_h=1;
var num_imatges_v=1;
var orientacio = (window.screen.availWidth > window.screen.availHeight ? "h" : "v" );

function httpGetAdresa(num){
	var xmlhttp = new XMLHttpRequest();
	var url = " http://www.corsproxy.com/randomframe.tk/repo.php?num=" + num + "&orientacio=" + orientacio;
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			myFunction(myArr);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	
	function myFunction(arr) {
		adresa=arr.adresa;
	}
}

function carregaImatge() {
	var num_imatges = (orientacio == "h" ? num_imatges_h : num_imatges_v);
	httpGetAdresa(Math.floor(Math.random() * num_imatges));
	document.body.style.backgroundImage="url(" + adresa + ")";
}

function httpGetNumImatges(){
	var xmlhttp = new XMLHttpRequest();
	var url = " http://www.corsproxy.com/randomframe.tk/repo.php?num=x";
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			myFunction(myArr);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	
	function myFunction(arr) {
		num_imatges_h=arr.num_imatges_h;
		num_imatges_v=arr.num_imatges_v;
		carregaImatge();
	}
}

function createSelectedBanner() {
	AdMob.createBanner( {adId:admobid.banner} );
}

function onLoad() {
	httpGetNumImatges();
	setInterval(function() {carregaImatge();}, 15000);
	if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
		document.addEventListener('deviceready', initApp, false);
	} else {
		initApp();
	}
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
	if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
	initAd();
	// display the banner at startup
	
	window.onclick = carregaImatge;
	createSelectedBanner();
	carregaImatge();
}
function initAd(){
	var defaultOptions = {
		bannerId: admobid.banner,
		adSize: 'SMART_BANNER',
		position: AdMob.AD_POSITION.BOTTOM_CENTER,
		offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
		bgColor: 'black', // color name, or '#RRGGBB'
		isTesting: true, // set to true, to receiving test ad for testing purpose
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

function onResize(){
	var or_antic = orientacio;
	orientacio = (window.screen.availWidth > window.screen.availHeight ? "h" : "v" );
	if (or_antic != orientacio) {carregaImatge();}
	
	var s = document.getElementById('sizeinfo');
	s.innerHTML = "web view: " + window.innerWidth + " x " + window.innerHeight;
}
