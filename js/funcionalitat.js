// Wait for Cordova to load
document.addEventListener("deviceready", onDeviceReady, false);

var adresa;
var h = [	'https://lh3.googleusercontent.com/-vxO4nCqXadI/UhYeWzx7BMI/AAAAAAAAMao/cV_gqRsMO8U/w900-h547-no/Ken13sam1DX_6059.jpg',
		    'https://lh4.googleusercontent.com/-rl0r8ue0hPY/UdqPTC2BlsI/AAAAAAAARfA/hgw4N-qVwKU/w871-h577-no/7_8_Tokyo%252520Midsummer%252520Night.JPG',
		    'https://lh3.googleusercontent.com/-K_vstjDtYsc/Ucig426hBqI/AAAAAAAAB4E/Dn_xbQo3RhE/w800-h533-no/FB%2BCorn.jpg'];
var v = [	'https://lh6.googleusercontent.com/-Fo1kY7PE5Fk/UfiYPx6GrDI/AAAAAAAAGBI/ZNmv9SPDeBM/w433-h577-no/Polyommatus%2Bi.MAX%2BDODEMA.jpg',
		    'https://lh6.googleusercontent.com/-lnAc8fP_kKo/UfXipOpWqCI/AAAAAAAAdB4/LVMmxINZS1U/w390-h577-no/Process.jpg',
		    'https://lh4.googleusercontent.com/-Q9Ftx8X-57U/Udsw7b3EzdI/AAAAAAAABz0/L8au7Qed9O4/w393-h577-no/Calla%2BLilies%2Band%2BSunset.jpg',
		    'https://lh3.googleusercontent.com/-uMtehU6YicI/UcoFIv7-ebI/AAAAAAAASNY/4EwcuR5PieI/w385-h577-no/SAM_1194-Edit-Edit-2-Edit-Edit.JPG',
		    'https://lh6.googleusercontent.com/-By3XzX720XY/Ua7usetqgUI/AAAAAAAAArY/eNXtiqkYrOQ/w384-h576-no/Starling_800.jpg',
		    'https://lh4.googleusercontent.com/-LZga6TWyifE/UTL7bxZKttI/AAAAAAAAADo/tIUs5S05bYU/w433-h577-no/13%2B-%2B6',
		    'https://lh6.googleusercontent.com/-ZNqXPWxQToQ/UKI4-E9jqoI/AAAAAAAANmY/ZsK9Jde-Kg4/w385-h577-no/DSC08533.JPG',
		    'https://lh3.googleusercontent.com/-v2h92yqYsLo/UOeVPk3Z3tI/AAAAAAAAP8Y/kcSIQm0ougc/w385-h577-no/JMCG4751.jpg',
		    'https://lh6.googleusercontent.com/-fnQaWMDZ3kc/UIsuoxX6TFI/AAAAAAAABVA/p1qFcvT7FVM/w384-h577-no/cultural_123.jpg',
		    'https://lh4.googleusercontent.com/-iRK2jPKyOBA/UJpQOmRwuZI/AAAAAAAAFj8/GMpmmkapXUc/w384-h577-no/Horses%2Bon%2BThe%2BFaroe%2BIslands.jpg',
		    'https://lh3.googleusercontent.com/-E4xk_cd7Mf0/T4ub0gzcJzI/AAAAAAABCTQ/NjF1na1N-yE/w356-h534-no/20120413-_DSC0555-Edit.jpg',
		    'https://lh5.googleusercontent.com/-RJjbrXm-xYg/T54_4OmF7QI/AAAAAAAD6nM/u3CLa5Tb0kg/w356-h534-no/P3300759.jpg',
		    'https://lh3.googleusercontent.com/-TvFv5486OmI/TwtBZogXM7I/AAAAAAAABDg/5c80jqtsU3Q/w353-h533-no/tenaya-lake-frozen-sunset-yosemite-g%2B-500px.jpg',
			'https://lh6.googleusercontent.com/-DtOYXpXYXaM/U3Z9XWiMufI/AAAAAAAAOh4/-973XIhtVCo/w408-h593-no/The%2BRoad%2Bby%2BDerek%2BKind.jpg',
			'https://lh3.googleusercontent.com/-JLJhedC8y74/VEc89SKdYnI/AAAAAAAApA0/Rlam47OF18E/w394-h593-no/Golden%2BMists%2B-%2BIguazu%2BFalls%2C%2BArgentina.jpg',
			'https://lh4.googleusercontent.com/-mXyGfViFkXI/VLPiVILDZGI/AAAAAAAAte0/5yEDix8jNAw/w395-h593-no/Somewhere-in-Romania%5B1%5D.jpg',
			'https://lh4.googleusercontent.com/-Wo8-kzQdIKk/VLQOvL-hQeI/AAAAAAAB7Nc/hiAoNAz9KJM/w396-h593-no/Natureza.png',
			'https://lh6.googleusercontent.com/-NBzmsxCMKx4/VLPdy2DEM7I/AAAAAAAAKQs/7LA2jIPv6FM/w420-h592-no/pics.png',
			'https://lh4.googleusercontent.com/-qvHTMCTgwLk/VLQm6eWZ0DI/AAAAAAAAEsE/u7LkxWAwh7E/w378-h567-no/15%2B-%2B1.jpg'];
var orientacio = (window.screen.availWidth > window.screen.availHeight ? "h" : "v" );
var num_imatges_h=h.length; //deixar a 1
var num_imatges_v=v.length; //deixar a 1

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
	
}

function getAdresa(num) {
	adresa=(orientacio == "h" ? h[num] : v[num]);
}

function descarregaLlista() {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://www.corsproxy.com/randomframe.tk/repo.php?num=l";
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			myFunction(myArr);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	console.log("hem demanat cosetessss");
	
	function myFunction(arr) {
		h=arr.horitzontals;
		v=arr.verticals;
		num_imatges_h=h.length; 
		num_imatges_v=v.length;
		//document.body.style.backgroundImage="url(" + h[0] + ")";
	}
}

function carregaImatge() {
	var num_imatges = (orientacio == "h" ? num_imatges_h : num_imatges_v);
	getAdresa(Math.floor(Math.random() * num_imatges));
	console.log(adresa);
	document.body.style.backgroundImage="url(" + adresa + ")";
}

/*function httpGetNumImatges() {
	var xmlhttp = new XMLHttpRequest();
	var url = "http://www.corsproxy.com/randomframe.tk/repo.php?num=x";
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var myArr = JSON.parse(xmlhttp.responseText);
			myFunction(myArr);
		}
	}
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
	carregaImatge();
	function myFunction(arr) {
		num_imatges_h=arr.num_imatges_h;
		num_imatges_v=arr.num_imatges_v;
		carregaImatge();
	}
}*/

function createSelectedBanner() {
	AdMob.createBanner( {adId:admobid.banner} );
}

function onLoad() {
	alert();
	carregaImatge();
	descarregaLlista();
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
