App.apiController = App.ApiController.create({
	url: 'http://10.0.1.7:8080/sparl/rest',
	key: '',
	secret: '',
});App.menuController = App.MenuController.create({
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
					titulo: 'Expedientes',
					url: '#/expedientes',
					subMenu: [
						App.MenuItem.create({
							titulo: 'Buscador de expedientes',
							url: '#/expedientes',
						}),
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 2,
			titulo: 'Comisiones',
			url: '#/comisiones/citaciones',
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Citaciones',
					url: '#/comisiones/citaciones',
					subMenu: [
						App.MenuItem.create({
							titulo: 'Agenda de Comisiones',
							url: '#/comisiones/citaciones',
						}),
						App.MenuItem.create({
							titulo: 'Crear Citacion',
							url: '#/comisiones/citaciones/citacion/crear',
						}),					
					]
				}),	
				App.MenuItem.create({
					titulo: 'Reuniones',
					url: '',
					subMenu: [
						App.MenuItem.create({
							titulo: 'Reuniones sin parte',
							url: '',
						}),				
					]
				}),				
			]			
		}),		
		App.MenuItem.create({
			id: 3,
			titulo: 'Recinto',
			url: '#/recinto/oradores',
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Recinto',
					url: '#/recinto/oradores',
					subMenu: [
						App.MenuItem.create({
							titulo: 'Oradores',
							url: '#/recinto/oradores',
						}),					
					],
				}),
			]			
		}),		
	]
});

App.listaController = App.ListaController.create({
	content: [],
});

App.sesionesController = App.SesionesController.create({
	content: [],
});

App.sesionController = App.SesionController.create();

App.turnosController = App.TurnosController.create({
	content: [],
});

App.temasController = App.TemasController.create({
	content: [],
});

App.diputadosController = App.DiputadosController.create({
	content: [],
});

App.temaController = App.TemaController.create();

App.crearTurnoController = App.CrearTurnoController.create();
App.crearTemaController = App.CrearTemaController.create();
App.crearSesionController = App.CrearSesionController.create();

App.ioController = App.IoController.create();

App.ioController.connect();

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



//App.initialize();