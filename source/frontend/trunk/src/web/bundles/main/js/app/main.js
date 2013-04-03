App.apiController = App.ApiController.create({
	url: 'http://10.0.1.7:8080/sparl/rest/',
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
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 2,
			titulo: 'Comisiones',
			url: '#/comisiones/citaciones',
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			roles: ['ROLE_USER'],
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
							roles: ['ROLE_USER', 'ROLE_ADMIN'],
							url: '#/comisiones/citaciones/citacion/crear',
						}),					
					]
				}),	
				App.MenuItem.create({
					titulo: 'Reuniones',
					url: '',
					roles: ['ROLE_USER', 'ROLE_ADMIN'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_ADMIN'],
							titulo: 'Reuniones sin parte',
							url: '#/comisiones/reuniones',
						}),		
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_ADMIN'],
							titulo: 'Reuniones con parte',
							url: '#/comisiones/reuniones/con/parte',
						}),							
					]
				}),				
			]			
		}),	
		App.MenuItem.create({
			id: 4,
			titulo: 'Secretaria Parlamentaria',
			url: '#/secretaria/parlamentaria',
			roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Ordenes del dia',
					url: '',
					roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Dictamenes sin OD',
							url: '#/secretaria/parlamentaria/OD/Dictamenes',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
						}),	
						App.MenuItem.create({
							titulo: 'Listado de OD',
							url: '#/secretaria/parlamentaria/OD/listado',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
						}),							
					],
				}),
				App.MenuItem.create({
					titulo: 'Labor',
					url: '',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Planes de labor',
							url: '#/secretaria/parlamentaria/labor/listado',
							roles: ['ROLE_USER'],
						}),	
						App.MenuItem.create({
							titulo: 'Crear Plan de labor',
							url: '#/secretaria/parlamentaria/labor/crear',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
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
			roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
			subMenu: [
				App.MenuItem.create({
					titulo: 'Recinto',
					url: '#/recinto/oradores',
					roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Oradores',
							url: '#/recinto/oradores',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'],
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

var user = localStorage.getObject('user');

if (user) {
	var usuario = App.Usuario.create(JSON.parse(user));

	var roles = [];
	usuario.get('roles').forEach(function (rol) {
		roles.addObject(App.Rol.create(rol));
	});

	usuario.set('roles', roles);

	App.userController.set('user', usuario);
	console.log(App.userController.get('user'));
}

var exp = localStorage.getObject('expedientes');
if (!exp) {
	console.log('CARGANDO');
	jQuery.getJSON("/exp/proyectos/2012/detalle", function(data) {
   
	    localStorage.setObject('expedientes', data);

	    $('#loadingScreen').remove();

	  	App.advanceReadiness();
	});
} else {
	 $('#loadingScreen').remove();
	 App.advanceReadiness();
}

