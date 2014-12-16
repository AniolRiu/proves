var temes = new Array("abstract","animals","business","cats","city","food","nightlife","fashion","people","nature","sports","technics","transport");

function carregaImatge() {
	var tema = temes[Math.floor(Math.random() * temes.length)];
	document.body.style.backgroundImage='url("http://lorempixel.com/' + window.screen.availWidth + '/' + window.screen.availHeight + '/' + tema + '")';
}
function createSelectedBanner() {
	AdMob.createBanner( {adId:admobid.banner} );
}
function onLoad() {
	setInterval(function() {carregaImatge();}, 15000);
	carregaImatge();
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
	createSelectedBanner();
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
	carregaImatge();
	var s = document.getElementById('sizeinfo');
	s.innerHTML = "web view: " + window.innerWidth + " x " + window.innerHeight;
}
