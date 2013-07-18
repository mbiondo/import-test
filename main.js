App.apiController = App.ApiController.create({
	url: 'http://10.185.204.12:8080/sparl/rest',
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

			subMenu: [
				App.MenuItem.create({
					titulo: 'Filtrar Novedades Por',
					url: '#',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Todas las Novedades',
							url: '#',
							id: 'news',
							clases: 'submenu-news',
						}),
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Movimientos de Expedientes',
							url: '#',
							id: 'news-expedientes',
							clases: 'submenu-news',
						}),
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Agenda Comisiones',
							url: '#',
							id: 'news-comisiones',
							clases: 'submenu-news',
						}),
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Dictamenes',
							url: '#',
							id: 'news-dictamenes',
							clases: 'submenu-news',
						}),								
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'OD',
							url: '#',
							id: 'news-od',
							clases: 'submenu-news',
						}),									
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Publicaciones',
							url: '#',
							id: 'news-publicaciones',
							clases: 'submenu-news',
						}),													
						App.MenuItem.create({
							roles: ['ROLE_USER'],
							titulo: 'Sesiones',
							url: '#',
							id: 'news-sesiones',
							clases: 'submenu-news',
						}),														
					],
				}),
			]
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
							titulo: 'Crear Citación',
							roles: ['ROLE_USER', 'ROLE_COMISIONES'],
							url: '#/comisiones/citaciones/citacion/crear',
						}),					
					]
				}),	
				App.MenuItem.create({
					titulo: 'Reuniones',
					url: '',
					roles: ['ROLE_USER', 'ROLE_COMISIONES'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_COMISIONES'],
							titulo: 'Reuniones sin Parte',
							url: '#/comisiones/reuniones/sin/parte',
						}),		
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_COMISIONES'],
							titulo: 'Reuniones con Parte',
							url: '#/comisiones/reuniones/con/parte',
						}),							
					]
				}),	

				App.MenuItem.create({
					titulo: 'Dictamenes',
					url: '#/comisiones/dictamenes',
					roles: ['ROLE_USER', 'ROLE_COMISIONES'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Dictamenes pendientes',
							url: '#/comisiones/dictamenes/pendientes',
							roles: ['ROLE_USER', 'ROLE_COMISIONES'],
						}),			
						App.MenuItem.create({
							titulo: 'Dictamenes',
							url: '#/comisiones/dictamenes/dictamenes',
							roles: ['ROLE_USER', 'ROLE_COMISIONES'],
						}),										
					],
				})			
			]			
		}),	
		App.MenuItem.create({
			id: 8,
			titulo: 'Orden Del Dia',
			url: '#/OD/listado',
			roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Orden Del Dia',
					url: '',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Listado',
							url: '#/OD/listado',
							roles: ['ROLE_USER'],
						}),	
						App.MenuItem.create({
							titulo: 'Dictamenes sin OD',
							url: '#/OD/dictamenes',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
						}),							
					],
				}),				
			]			
		}),	
		App.MenuItem.create({
			id: 4,
			titulo: 'Labor Parlamentaria',
			url: '#/plan/de/labor/listado',
			roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
			icono: 'bundles/main/images/icons/mainnav/messages.png',
			subMenu: [
				App.MenuItem.create({
					titulo: 'Labor Parlamentaria',
					url: '',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Planes de Labor',
							url: '#/plan/de/labor/listado',
							roles: ['ROLE_USER'],
						}),	
						App.MenuItem.create({
							titulo: 'Crear Plan de Labor',
							url: '#/secretaria/parlamentaria/labor/crear',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
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
			roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
			subMenu: [
				App.MenuItem.create({
					titulo: 'Administrar',
					url: '#/admin/roles',
					roles: ['ROLE_USER'],
					subMenu: [
						App.MenuItem.create({
							titulo: 'Acceso de usuarios',
							url: '#/admin/roles',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
						}),		
						App.MenuItem.create({
							titulo: 'Comisiones por usuarios',
							url: '#/admin/comisiones',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
						}),		
						App.MenuItem.create({
							titulo: 'Tipos de notificaciones',
							url: '#/admin/notificaciones',
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
						}),	
					],
				}),
			]			
		}),
                
		App.MenuItem.create({
			id: 6,
			roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
			titulo: 'Expedientes Archivados',
			url: '#/expedientesArchivados/envios/archivo',
			icono: 'bundles/main/images/icons/mainnav/forms.png',
			
			subMenu: [
				App.MenuItem.create({
					titulo: 'Expedientes Archivados',
					url: '#/expedientesArchivados/envios/crear',
					roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
							titulo: 'Env&iacute;os a archivo',
							url: '#/expedientesArchivados/envios/archivo',
						}),
						App.MenuItem.create({
							roles: ['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'],
							titulo: 'Crear env&iacute;o',
							url: '#/expedientesArchivados/envio/crear',
						}),
					],
				}),
			]
		}),

		App.MenuItem.create({
			id: 7,
			roles: ['ROLE_LABOR_PARLAMENTARIA'],
			titulo: 'Estadisticas',
			url: '#/estadisticas/oradores',
			icono: 'bundles/main/images/icons/mainnav/forms.png',
			
			subMenu: [
				App.MenuItem.create({
					titulo: 'Estadisticas',
					url: '#/estadisticas/oradores',
					roles: ['ROLE_LABOR_PARLAMENTARIA'],
					subMenu: [
						App.MenuItem.create({
							roles: ['ROLE_LABOR_PARLAMENTARIA'],
							titulo: 'Oradores',
							url: '#/estadisticas/oradores',
						}),
					],
				}),
			]
		})
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

App.expedientesArchivadosController = App.ExpedientesArchivadosController.create({
	content: []
});

App.envioArchivoController = App.EnvioArchivoController.create({
	content: []
});

App.envioArchivoConsultaController = App.EnvioArchivoConsultaController.create({
	content: []
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
			if (rol.nombre == "ROLE_LABOR_PARLAMENTARIA_EDIT")
				App.puedeEditar = true;
		});
	}

	usuario.set('roles', roles);
	
	//ONLY TESTING
	//usuario.set('nombre', 'MARA');
	//usuario.set('apellido', 'BRAWER');
	//usuario.set('estructuraReal', 'DIP ROSSI AGUSTIN OSCAR');
	
	App.userController.set('user', usuario);
}

$('#loadingScreen').remove();
App.advanceReadiness();

/*
var com = localStorage.getObject('comisiones');

if(!com){
	$.ajax({
		url:  App.get('apiController.url') + "/com/comisiones/CD/P/resumen",
		dataType: 'JSON',
		type: 'GET',

		success: function (data) {
			localStorage.setObject('comisiones', data);

			$('#loadingScreen').remove();

			App.advanceReadiness();				
		}
	});
}
*/

/*//var exp = localStorage.getObject('expedientes');
var exp = null;
if (exp) {
	$.ajax({
		url:  App.get('apiController.url') + "/exp/proyectos/2013",
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
}*/

