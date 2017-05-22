var domini = 'https://test2.aim-solo.com/';
var user_name;
var user_id;
var project_id;
var project_name;
var student_id;
var student_name;
var comps_masc;
var comps_fem;
var list_masc;
var list_fem;

$( "#login-page" ).on( "pageshow", function( e ) {
	{ // Carreguem variables de la memòria local
		user_id = localStorage.getItem('user_id');
		user_name = localStorage.getItem('user_name');
		project_id = localStorage.getItem('project_id');
		project_name = localStorage.getItem('project_name');
		comps_masc = JSON.parse(localStorage.getItem('comps_masc'));
		comps_fem = JSON.parse(localStorage.getItem('comps_fem'));
	}
	
	if ((user_id != null) && (user_name != null)) {
		console.log(user_id);
		console.log(user_name);
		$.mobile.navigate( "#projects-page" );
	}
});

$('.login-form').submit(function(e) {
	e.preventDefault();
    e.stopPropagation();
	var username = $('#username').val();
	var pwd = $('#pwd').val();
	$.ajax({
		url: domini + "ajax/APPLogin?username=" + username + "&password=" + pwd,
		success: function(data) {
			// Arriba la resposta
			data = JSON.parse(data);
			console.log(data);
			if (data.success) {
				user_name = data.name;
				user_id = data.user_id;
				localStorage.setItem('user_id', user_id);
				localStorage.setItem('user_name', user_name);
				$.mobile.navigate( "#projects-page" );
			}
			else { alert(data.msg); }
		}
	});
});

$( "#projects-page" ).on( "pageshow", function( e ) {
	$(this).find('h1').text("Projectes de " + user_name);
	{ // Demanem la llista de competències
		if ((comps_masc == null) || (comps_fem == null)) {
			$.ajax({
				// TODO: Enviar l'idioma en funció del particular
				url: "https://intra.aim-solo.com/schools/assets/php/ajax/ajax_return_competences.php?lang=cat",
				success: function(data) {
					// Arriba la resposta
					data = JSON.parse(data);
					console.log('yeye1' + data['success']);
					if (data.success) {
						comps_masc = data['comps_masc'];
						comps_fem = data['comps_fem'];
						localStorage.setItem('comps_masc', JSON.stringify(comps_masc));
						localStorage.setItem('comps_fem', JSON.stringify(comps_fem));
						build_comp_list();
					}
					else { alert(data.msg + 'yeye'); }
				}
			});
		}
		else {
			build_comp_list();
		}
	}

	$.ajax({
		url: domini + "ajax/getProjectsByTutor?tutor_id=" + user_id,
		success: function(data) {
			// Arriba la resposta
			data = JSON.parse(data);
			console.log(data);
			if (data.success) {
				list = $("#project-list");
				list.empty();
				data.projects.forEach(function (project, index) {
					var list_item = $('<li><a data-id="' + project.id + '">' + project.name + '</a></li>');
					list.append(list_item).listview('refresh');
				});
			}
			else { alert(data.msg); }
		}
	});
});

$(document).on('click', "#project-list li a",function () {
	project_id = $(this).data('id');
	project_name = $(this).text();
	$.mobile.navigate("#students-page");
});

$("#students-page").on( "pageshow", function( e ) {
	$(this).find('h1').text("Estudiants de " + project_name);
	$.ajax({
		url: domini + "ajax/getUsersByProjectNTutor?tutor_id=" + user_id + "&project_id=" + project_id,
		success: function(data) {
			// Arriba la resposta
			data = JSON.parse(data);
			console.log(data);
			if (data.success) {
				list = $("#student-list");
				list.empty();
				data.projects.forEach(function (user, index) {
					var list_item = $('<li><a data-id="' + user.id + '">' + user.name + ' ' + user.lastname + '</a></li>');
					list.append(list_item).listview('refresh');
				});
			}
			else { alert(data.msg); }
		}
	});
});

$(document).on('click', "#student-list li a",function () {
	student_id = $(this).data('id');
	student_name = $(this).text();
	$.mobile.navigate("#comps-page");
});

$("#comps-page").on( "pageshow", function( e ) {
	$(this).find('h1').text("Competències de " + student_name);
	
	// TODO: Mirar gènere de l'estudiant
	$("#comps-list").append(list_masc).listview('refresh');
	
	// var myElement = document.getElementById('#comps-list');

	// create a simple instance
	// by default, it only adds horizontal recognizers
	// var mc = new Hammer(myElement);

	// listen to events...
	// mc.on("panleft panright tap press", function(ev) {
	//	console.log(ev.type +" gesture detected.");
	// });
	
});

$(document).on('swipeleft swiperight', "#comps-list li", function (e) {
	e.stopPropagation();
	e.preventDefault();
	comp_id = $(this).data('id');
	comp_name = $(this).text();
	console.log(e.type);
	console.log(e);
	if(e.type == "swipeleft") {
		console.log(e.swipestart);
	}
	else if (e.type == "swiperight") {
		console.log(e.swipestop.coords[0] - e.swipestart.coords[0]);
	}
	
});

function build_comp_list() {
	list_masc = "";
	list_fem = "";
	comps_masc.forEach(function (comp, index) {
		list_masc = list_masc + '<li><a data-id="' + comp.id + '">' + comp.name + '</a></li>';
	});
	comps_fem.forEach(function (comp, index) {
		list_fem = list_fem + '<li><a data-id="' + comp.id + '">' + comp.name + '</a></li>';
	});
}