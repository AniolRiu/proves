function onLoad() {
	if(( /(ipad|iphone|ipod|android)/i.test(navigator.userAgent) )) {
		document.addEventListener('deviceready', initApp, false);
	} else {
		initApp();
	}
}
/*var ad_units = {
	ios : {
		banner: 'ca-app-pub-6869992474017983/4806197152',
		interstitial: 'ca-app-pub-6869992474017983/7563979554'
	},
	android : {
		banner: 'ca-app-pub-5785179440070320/7600312495',
		interstitial: 'ca-app-pub-6869992474017983/1657046752'
	}
};*/
//var admobid = ( /(android)/i.test(navigator.userAgent) ) ? ad_units.android : ad_units.ios;

var temes = new Array("abstract","animals","business","cats","city","food","nightlife","fashion","people","nature","sports","technics","transport");

function carregaImatge() {
	alert("cuco tio");
	var tema = temes[Math.floor(Math.random() * temes.length)];
	document.body.style.backgroundImage='url("http://lorempixel.com/' + window.screen.availWidth + '/' + window.screen.availHeight + '/' + tema + '")';
}

function initApp() {
	setInterval(function(){
					carregaImatge();
				}, 3000);
	carregaImatge();
	//if (! AdMob ) { alert( 'admob plugin not ready' ); return; }
	
	//initAd();
	
	// display the banner at startup
	//createSelectedBanner();
	//AdMob.createBanner( {adId:admobid.banner, overlap:false, offsetTopBar:false, adSize: 'SMART_BANNER', position:AdMob.AD_POSITION.BOTTOM_CENTER} );
}

function initAd(){
	var defaultOptions = {
		bannerId: admobid.banner,
		interstitialId: admobid.interstitial,
		adSize: 'SMART_BANNER',
		//width: integer, // valid when set adSize 'CUSTOM'
		//height: integer, // valid when set adSize 'CUSTOM'
		position: AdMob.AD_POSITION.BOTTOM_CENTER,
		offsetTopBar: false, // avoid overlapped by status bar, for iOS7+
		bgColor: 'black', // color name, or '#RRGGBB'
		//x: integer,		// valid when set position to 0 / POS_XY
		//y: integer,		// valid when set position to 0 / POS_XY
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
/*
// click button to call following functions
function getSelectedAdSize() {
	var i = document.getElementById("adSize").selectedIndex;
	var items = document.getElementById("adSize").options;
	return items[i].value;
}
function getSelectedPosition() {
	var i = document.getElementById("adPosition").selectedIndex;
	var items = document.getElementById("adPosition").options;
	return parseInt( items[i].value );
}
function createSelectedBanner() {
	var overlap = document.getElementById('overlap').checked;
	var offsetTopBar = document.getElementById('offsetTopBar').checked;
	AdMob.createBanner( {adId:admobid.banner, overlap:overlap, offsetTopBar:offsetTopBar, adSize: getSelectedAdSize(), position:getSelectedPosition()} );
}
function createBannerOfGivenSize() {
	var w = document.getElementById('w').value;
	var h = document.getElementById('h').value;
	
	AdMob.createBanner( {adId:admobid.banner,
					   adSize:'CUSTOM', width:w, height:h,
					   position:getSelectedPosition()} );
}
function showBannerAtSelectedPosition() {
	AdMob.showBanner( getSelectedPosition() );
}
function showBannerAtGivenXY() {
	var x = document.getElementById('x').value;
	var y = document.getElementById('y').value;
	AdMob.showBannerAtXY(x, y);
}
function prepareInterstitial() {
	var autoshow = document.getElementById('autoshow').checked;
	AdMob.prepareInterstitial({adId:admobid.interstitial, autoShow:autoshow});
}
function onResize(){
	var s = document.getElementById('sizeinfo');
	s.innerHTML = "web view: " + window.innerWidth + " x " + window.innerHeight;
}*/