App.apiController = App.ApiController.create({
	url: 'http://10.185.204.13:8080/sparl/rest',
	//url: '',	
	key: '',
	secret: '',
});

App.menuController = App.MenuController.create({
	content: [
		App.MenuItem.create({
			id: 0,
			roles: ['ROLE_USER'],
			titulo: 'Inicio',
			url: '#',
			icono: 'bundles/main/images/icons/mainnav/forms.png',
		}),
		App.MenuItem.create({
			id: 1,
			roles: ['ROLE_USER'],
			titulo: 'Expedientes',
			url: '#/expedientes',
			icono: 'bundles/main/images/icons/mainnav/forms.png',
			
			subMenu: [
				App.MenuItem.create({
					titulo: 'Expedientes',
					url: '#/expedientes',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Buscador de expedientes',
							url: '#/expedientes',
						}),
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
							titulo: 'Vigentes',
							url: '#/expedientes',
						}),
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
							titulo: 'Con dictamen',
							url: '#/expedientes',
						}),								
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
							titulo: 'Con orden del día',
							url: '#/expedientes',
						}),									
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
							titulo: 'Archivados',
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
			roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
			subMenu: [
				App.MenuItem.create({
					titulo: 'Citaciones',
					url: '#/comisiones/citaciones',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Agenda de Comisiones',
							url: '#/comisiones/citaciones',
						}),
						App.MenuItem.create({
							titulo: 'Crear Citacion',
							roles: ['ROLE_USER'],
							url: '#/comisiones/citaciones/citacion/crear',
						}),					
					]
				}),	
				App.MenuItem.create({
					titulo: 'Reuniones',
					url: '',
					roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
							titulo: 'Reuniones sin parte',
							url: '#/comisiones/reuniones',
						}),		
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
							titulo: 'Reuniones con parte',
							url: '#/comisiones/reuniones/con/parte',
						}),							
					]
				}),	

				App.MenuItem.create({
					titulo: 'Ordenes del dia',
					url: '#/comisiones/OD/dictamenes',
					roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Dictamenes sin OD',
							url: '#/comisiones/OD/dictamenes',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
						}),	
						App.MenuItem.create({
							titulo: 'Listado de OD',
							url: '#/comisiones/OD/listado',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
						}),							
					],
				}),							
			]			
		}),	

		App.MenuItem.create({
			id: 4,
			titulo: 'Labor Parlamentaria',
			url: '#/plan/de/labor/listado',
			roles: ['ROLE_USER'],
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Labor',
					url: '',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Planes de labor',
							url: '#/plan/de/labor/listado',
							roles: ['ROLE_USER'],
						}),	
						App.MenuItem.create({
							titulo: 'Crear Plan de labor',
							url: '#/secretaria/parlamentaria/labor/crear',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIR'],
						}),							
					],
				}),				
			]			
		}),		
		App.MenuItem.create({
			id: 3,
			titulo: 'Recinto',
			url: '#/recinto/oradores',
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			roles: ['ROLE_USER'],
			subMenu: [
				App.MenuItem.create({
					titulo: 'Recinto',
					url: '#/recinto/oradores',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Oradores',
							url: '#/recinto/oradores',
							roles: ['ROLE_USER'],
						}),					
					],
				}),
			]			
		}),	

		App.MenuItem.create({
			id: 5,
			titulo: 'Administrar Accessos',
			url: '#/admin/roles',
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			roles: ['ROLE_USER'],
			subMenu: [
				App.MenuItem.create({
					titulo: 'Administrar',
					url: '#/admin/roles',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Acceso de usuarios',
							url: '#/admin/roles',
							roles: ['ROLE_USER'],
						}),		
						App.MenuItem.create({
							titulo: 'Comisiones por usuarios',
							url: '#/admin/comisiones',
							roles: ['ROLE_USER'],
						}),										
					],
				}),
			]			
		}),				
	]
});

App.notificationController = App.NotificationController.create({
	estado: '',
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

App.reunionesSinParteController = App.ReunionesSinParteController.create({
	content: [],
});

App.reunionConsultaController = App.ReunionConsultaController.create();

App.reunionesConParteController = App.ReunionesConParteController.create({
	content: [],
});

App.crearParteController = App.CrearParteController.create();

App.userController = App.UserController.create();

//App.initialize();
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

App.deferReadiness();

App.puedeEditar = false;
var user = localStorage.getObject('user');

if (user) {
	var usuario = App.Usuario.create(JSON.parse(user));

	var roles = [];
	
	if (usuario.get('roles')) {
		usuario.get('roles').forEach(function (rol) {
			roles.addObject(App.Rol.create(rol));
			if (rol.nombre == "ROLE_LABOR_PARLAMENTARIA")
				App.puedeEditar = true;
		});
	}

	usuario.set('roles', roles);

	App.userController.set('user', usuario);
}

var exp = localStorage.getObject('expedientes');


//var exp = null;
if (!exp) {
	$.ajax({
		url:  App.get('apiController.url') + "/exp/proyectos/2013/detalle",
		dataType: 'JSON',
		type: 'GET',

		success: function (data) {
		    localStorage.setObject('expedientes', data);

		    $('#loadingScreen').remove();

		  	App.advanceReadiness();				
		}
	});
} else {
	 $('#loadingScreen').remove();
	 App.advanceReadiness();
}

