function onLoad() {
	setInterval(function() {carregaImatge();}, 10000);
	carregaImatge();
}

var temes = new Array("abstract","animals","business","cats","city","food","nightlife","fashion","people","nature","sports","technics","transport");

function carregaImatge() {
	var tema = temes[Math.floor(Math.random() * temes.length)];
	document.body.style.backgroundImage='url("http://lorempixel.com/' + window.screen.availWidth + '/' + window.screen.availHeight + '/' + tema + '")';
}
