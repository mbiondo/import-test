jQuery(function($){
	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '&#x3C;Ant',
		nextText: 'Sig&#x3E;',
		currentText: 'Hoy',
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
		'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
		'Jul','Ago','Sep','Oct','Nov','Dic'],
		dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
		dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['es']);
});


App.menuController = App.MenuController.create({
	content: [
		App.MenuItem.create({
			id: 0,
			titulo: 'Inicio',
			url: '#/',
			icono: 'bundles/main/images/icons/mainnav/forms.png',
		}),
		App.MenuItem.create({
			id: 1,
			titulo: 'Expedientes',
			url: '#/expedientes',
			icono: 'bundles/main/images/icons/mainnav/forms.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Buscar Expedientes',
					url: '#/expedientes',
				}),
			]
		}),
		App.MenuItem.create({
			id: 2,
			titulo: 'Comisiones',
			url: '#/citaciones',
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Agenda de Comisiones',
					url: '#/citaciones',
				}),
				App.MenuItem.create({
					titulo: 'Crear Citacion',
					url: '#/citacion/crear',
				}),				
			]			
		}),		
	]
});
App.tituloController = App.TituloController.create({});

App.breadCumbController = App.BreadCumbController.create({
	content: [],
});

App.expedientesController = App.ExpedientesController.create({
	content: [],
});

App.citacionesController = App.CitacionesController.create({
	content: [],
});

App.citacionConsultaController = App.CitacionConsultaController.create();


App.expedienteController = App.ExpedienteController.create();
App.expedienteConsultaController = App.ExpedienteConsultaController.create();

App.citacionCrearController = App.CitacionCrearController.create({
	expedientes: null,
});

App.citacionSalasController = App.CitacionSalasController.create({
	selected: null,
	content: [],
});
App.citacionEstadosController = App.CitacionEstadosController.create({
	content: [],
});
App.comisionesController = App.ComisionesController.create({
	content: [],
});

App.apiController = App.ApiController.create({
	url: 'http://10.0.1.7:8080/sparl/rest',
	key: '',
	secret: '',
});



//App.initialize();