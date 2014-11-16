function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

function inita() {
	alert("cuco");
	var id_exercici = getUrlVars()["id_exercici"];
	alert("caca2" + id_exercici)
};

$(document).on("pageshow","#aporta_solucio", inita);
	