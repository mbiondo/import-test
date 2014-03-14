App.apiController = App.ApiController.create({
	url: 'http://10.105.5.63:9090/sparl/rest/',

	productionURL: 'http://10.185.204.12:9090/sparl/rest/',
	//url: 'http://10.185.204.6:9090/sparl/rest/',
	//url: 'http://10.185.204.12:8080/sparl/rest/',
	//url: 'http://186.23.200.128:8080/sparl/rest',
	// url: 'http://201.250.82.9:9009/sparl/rest/',
	existURL: 'http://sparl-desa.hcdn.gob.ar:8080/exist/rest/',
	//url: '',	
	key: '',
	secret: '',
});

App.menuController = App.MenuController.create({
	content: [
		App.MenuItem.create({
			id: 0,
			roles: [['ROLE_USER']],
			titulo: 'Inicio',
			url: '#',
			icono: 'ic ic-novedades',

			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Filtrar Novedades Por',
					url: '#',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER']],
							titulo: 'Todas las Novedades',
							url: '#',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_SITE_ADMIN']],
							titulo: 'Movimientos de Expedientes',
							url: '#/novedades/1',
						}),
						App.MenuItem.create({
							id: 2,
							roles: [['ROLE_USER']],
							titulo: 'Agenda Comisiones',
							url: '#/novedades/2',
						}),
						App.MenuItem.create({
							id: 3,
							roles: [['ROLE_SITE_ADMIN']],
							titulo: 'Dictámenes',
							url: '#/novedades/3',
						}),								
						App.MenuItem.create({
							id: 4,
							roles: [['ROLE_USER']],
							titulo: 'OD',
							url: '#/novedades/4',
						}),									
						App.MenuItem.create({
							id: 5,
							roles: [['ROLE_SITE_ADMIN']],
							titulo: 'Publicaciones',
							url: '#/novedades/5',
						}),													
						App.MenuItem.create({
							id: 7,
							roles: [['ROLE_USER']],
							titulo: 'Plan de Labor',
							url: '#/novedades/7',
						}),
						App.MenuItem.create({
							id: 6,
							roles: [['ROLE_USER']],
							titulo: 'Sesiones',
							url: '#/novedades/6',
						}),														
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 9,
			roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Dirección Secretaría',
			url: '#/direccion/secretaria/diputados/listado',
			icono: 'ic ic-pen',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Movimiento Diputados',
					url: '',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER']],
							titulo: 'Consulta',
							url: '#/direccion/secretaria/diputados/listado',
						}),

						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
							titulo: 'Alta',
							url: '#/direccion/secretaria/diputados/alta',
						}),	
					],
				}),
				App.MenuItem.create({
					id: 1,
					titulo: 'Expedientes',
					url: '',
					roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER']],
							titulo: 'Crear proyecto',
							url: '#/mesa/de/entrada/proyecto/crear',
						}),
					],
				}),
				App.MenuItem.create({
					id: 2,
					titulo: 'Giros',
					url: '',
					roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER']],
							titulo: 'Listado',
							url: '#/mesa/de/entrada/giros/listado',
						}),					
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
							titulo: 'Girar proyecto',
							url: '#/mesa/de/entrada/proyecto/girar',
						}),
					],
				}),											
			]
		}),
		App.MenuItem.create({
			id: 1,
			roles: [['ROLE_USER']], 
			titulo: 'Expedientes',
			url: '#/expedientes',
			icono: 'ic ic-expedientes',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Expedientes',
					url: '#/expedientes',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER']],
							titulo: 'Buscador de expedientes',
							url: '#/expedientes',
						}),													
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 10,
			roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Biografia',
			url: '#/expedientes/biograofia',
			icono: 'ic ic-biografia',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Biografia',
					url: '#/expedientes/biografia',
					roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Biografia',
							url: '#/expedientes/biografia',
						}),
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 2,
			titulo: 'Comisiones',
			url: '#/comisiones/citaciones',
			icono: 'ic ic-comisiones',
			roles: [['ROLE_USER']],
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Citaciones',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER']],
							titulo: 'Agenda de Comisiones',
							url: '#/comisiones/citaciones',
						}),
						App.MenuItem.create({
							id: 1,
							titulo: 'Crear Citación',
							roles: [['ROLE_USER', 'ROLE_COMISIONES']],
							url: '#/comisiones/citaciones/citacion/crear',
						}),					
					]
				}),	
				App.MenuItem.create({
					id: 1,
					titulo: 'Reuniones',
					roles: [['ROLE_USER', 'ROLE_COMISIONES'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER', 'ROLE_COMISIONES'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
							titulo: 'Reuniones sin Parte',
							url: '#/comisiones/reuniones/sin/parte',
						}),		
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_USER', 'ROLE_COMISIONES'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
							titulo: 'Reuniones con Parte',
							url: '#/comisiones/reuniones/con/parte',
						}),							
					]
				}),	

				App.MenuItem.create({
					id: 2,
					titulo: 'Dictámenes',
					roles: [['ROLE_USER', 'ROLE_COMISIONES'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Dictámenes pendientes',
							url: '#/comisiones/dictamenes/pendientes',
							roles: [['ROLE_USER', 'ROLE_COMISIONES'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
						}),			
						App.MenuItem.create({
							id: 1,
							titulo: 'Dictámenes',
							url: '#/comisiones/dictamenes/dictamenes',
							roles: [['ROLE_USER', 'ROLE_COMISIONES'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
						}),
						App.MenuItem.create({
							id: 2,
							titulo: 'Crear Dictamen',
							url: '#/comisiones/dictamenes/crear',
							roles: [['ROLE_DIRECCION_COMISIONES']],
						}),
					],
				}),
				App.MenuItem.create({
					id: 3,
					titulo: 'Análisis de Competencia Mixta',
					roles: [['ROLE_USER', 'ROLE_COMISIONES']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Análisis de Competencia Mixta pendientes',
							url: '#/comisiones/mixta/pendientes',
							roles: [['ROLE_USER', 'ROLE_COMISIONES']],
						}),			
					],
				})
			]			
		}),	
		App.MenuItem.create({
			id: 8,
			titulo: 'Orden Del Día',
			url: '#/OD/listado',
			roles: [['ROLE_USER']],
			icono: 'ic ic-od',
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Orden Del Día',
					url: '',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Listado de OD',
							url: '#/OD/listado',
							roles: [['ROLE_USER']],
						}),	
						App.MenuItem.create({
							id: 1,
							titulo: 'Dictámenes sin OD',
							url: '#/OD/dictamenes',
//							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']]
						}),							
					],
				}),				
			]			
		}),	
                
		App.MenuItem.create({
			id: 6,
			roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Envíos a Archivo',
			url: '#/envios',
			icono: 'ic ic-archivados',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Envíos a Archivo',
					url: '#/envios',
					roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Envios a Archivo',
							url: '#/envios',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
							titulo: 'Crear Envío a Archivo',
							url: '#/envios/envio/crear',
						}),
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 4,
			titulo: 'Labor Parlamentaria',
			url: '#/laborparlamentaria/planesdelabor/definitivos',
			roles: [['ROLE_USER']],
			icono: 'ic ic-labor',
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Labor Parlamentaria',
					url: '',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Planes de Labor Tentativos',
							url: '#/laborparlamentaria/planesdelabor/tentativos',
							// url: '#/plan/de/labor/listado/0',
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
						}),						
						App.MenuItem.create({
							id: 1,
							titulo: 'Planes de Labor Confirmados',
							url: '#/laborparlamentaria/planesdelabor/confirmados',
							// url: '#/plan/de/labor/listado/1',
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
						}),	

						App.MenuItem.create({
							id: 2,
							titulo: 'Planes de Labor Definitivos',
							url: '#/laborparlamentaria/planesdelabor/definitivos',
							// url: '#/plan/de/labor/listado/2',
							roles: [['ROLE_USER']],
						}),							
						App.MenuItem.create({
							id: 3,
							titulo: 'Crear Plan de Labor',
							url: '#/laborparlamentaria/plandelabor/crear',
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
						}),							
					],
				}),				
			]			
		}),		
		
		App.MenuItem.create({
			id: 3,
			titulo: 'Recinto',
			url: '#/recinto/oradores',
			icono: 'ic ic-recinto',
			roles: [['ROLE_USER']],
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Recinto',
					url: '#/recinto/oradores',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Oradores',
							url: '#/recinto/oradores',
							roles: [['ROLE_USER']],
						}),					
					],
				}),
			]			
		}),
		App.MenuItem.create({
			id: 7,
			roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Estadisticas',
			url: '#/estadisticas/oradores',
			icono: 'ic ic-estadisticas',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Estadisticas',
					url: '#/estadisticas/oradores',
					roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Oradores',
							url: '#/estadisticas/oradores',
						}),
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 11,
			roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_VISITAS_GUIADAS']],
			titulo: 'Visitas Guiadas',
			url: '#/visitas-guiadas',
			icono: 'ic ic-visitas-guiadas',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Visitas Guiadas',
					url: '',
					roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_VISITAS_GUIADAS']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_VISITAS_GUIADAS']],
							titulo: 'Listado',
							url: '#/visitas-guiadas/listado',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_VISITAS_GUIADAS']],
							titulo: 'Estadisticas',
							url: '#/visitas-guiadas/estadisticas',
						}),		
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 5,
			titulo: 'Administrar Accesos',
			url: '#/admin/roles',
			icono: 'ic ic-accesos',
			roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Administrar',
					url: '#/admin/roles',
					roles: [['ROLE_USER']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Usuarios y Roles',
							url: '#/admin/roles',
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
						}),		
						App.MenuItem.create({
							id: 1,
							titulo: 'Usuarios y Comisiones',
							url: '#/admin/comisiones',
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
						}),		
						App.MenuItem.create({
							id: 2,
							titulo: 'Tipos de Notificaciones',
							url: '#/admin/notificaciones',
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
						}),	
						App.MenuItem.create({
							id: 3,
							titulo: 'Crear Tipo de Notificación',
							url: '#/admin/notificaciones/tipo/crear',
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
						}),	
					],
				}),
			]			
		}),
		App.MenuItem.create({
			id: 12,
			roles: [['ROLE_LABOR_PARLAMENTARIA']],
			titulo: 'Publicaciones',
			url: '#/publicaciones/TP/listado',
			icono: 'ic ic-publicaciones',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'TP',
					url: '#/publicaciones/TP/listado',
					roles: [['ROLE_LABOR_PARLAMENTARIA']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_LABOR_PARLAMENTARIA']],
							titulo: 'Listado',
							url: '#/publicaciones/TP/listado',
						}),

						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_LABOR_PARLAMENTARIA']],
							titulo: 'Confeccionar TP',
							url: '#/publicaciones/TP/crear',
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

App.notificacionesController = App.NotificacionesController.create({
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

App.confirmActionController = App.ConfirmActionController.create();
App.searchController = App.SearchController.create({content: []});

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
	var usuario = App.Usuario.extend(App.Savable).create(JSON.parse(user));

	var roles = [];
	
	if (usuario.get('roles')) {
		usuario.get('roles').forEach(function (rol) {
			roles.addObject(App.Rol.create(rol));
			if (rol.nombre == "ROLE_LABOR_PARLAMENTARIA_EDIT")
				App.puedeEditar = true;
		});
	}

	var rolesmerged = [];
	
	if (usuario.get('rolesmerged')) {
		usuario.get('rolesmerged').forEach(function (rol) {
			rolesmerged.addObject(App.Rol.create(rol));
			if (rol.nombre == "ROLE_LABOR_PARLAMENTARIA_EDIT")
				App.puedeEditar = true;
		});
	}

	usuario.set('rolesmerged', rolesmerged);
	usuario.set('roles', roles);
	App.userController.set('user', usuario);
	
	App.get('searchController').load();
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

