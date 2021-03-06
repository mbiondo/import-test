App.apiController = App.ApiController.create({
	url: 'http://sparl-desa.hcdn.gob.ar:9090/sparl2/rest/',
	//url: 'http://10.102.13.15:9090/rest/',
	//url: 'http://10.102.13.4:8080/sparl/rest/',
	tomcat: 'http://sparl-desa.hcdn.gob.ar:9090',
	existURL: 'http://sparl-desa.hcdn.gob.ar:8080/exist/rest/',
	authURL: 'http://10.105.5.55:9000/o/',
	//authURL: 'http://10.102.13.3:8000/o/',
	client: '5FbzJ9oU=9Db0y7s92SvuhSixxfU3Ajcwly2jNbb',
	secret: '3KJtUIRd7=SgzpdTA?aeC5r9a8GkoF7rwCWufg5BXYTb9Pwlx_ef6NXbo.A3Fwn.1ok_8L8gSe_WDGJq_ZKn.D5y9MLAr9.T1j.IjT=exFT6q.3ox42g2RAjHle-KrHv',
	use_auth: true,
});

App.menuController = App.MenuController.create({
	content: [
		App.MenuItem.create({
			id: 0,
			roles: [['ROLE_INICIO']],
			titulo: 'Inicio',
			url: '#',
			icono: 'ic-novedades',


			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Filtrar novedades por',
					url: '#',
					roles: [[]],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [[]],
							titulo: 'Todas las novedades',
							url: '#',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_MESA_DE_ENTRADA']],
							titulo: 'Movimientos de Expedientes',
							url: '#/novedades/1',
						}),
						App.MenuItem.create({
							id: 5,
							roles: [['ROLE_PUBLICACIONES']],
							titulo: 'Publicaciones',
							url: '#/novedades/5',
						}),													
						App.MenuItem.create({
							id: 2,
							roles: [['ROLE_COMISIONES'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
							titulo: 'Agenda Comisiones',
							url: '#/novedades/2',
						}),
						App.MenuItem.create({
							id: 3,
							roles: [['ROLE_COMISIONES'], ['ROLE_ORDEN_DEL_DIA']],
							titulo: 'Dictámenes',
							url: '#/novedades/3',
						}),								
						App.MenuItem.create({
							id: 4,
							roles: [['ROLE_ORDEN_DEL_DIA'], ['ROLE_LABOR_PARLAMENTARIA']],
							titulo: 'Orden del Día',
							url: '#/novedades/4',
						}),									
						App.MenuItem.create({
							id: 7,
							roles: [['ROLE_LABOR_PARLAMENTARIA']],
							titulo: 'Plan de Labor',
							url: '#/novedades/7',
						}),
						App.MenuItem.create({
							id: 6,
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
							titulo: 'Sesiones',
							url: '#/novedades/6',
						}),			
						App.MenuItem.create({
							id: 8,
							roles: [['ROLE_INFORMACION_PARLAMENTARIA']],
							titulo: 'Solicitudes IP',
							url: '#/novedades/8',
						}),																			
					],
				}),
			]
			
		}),
		App.MenuItem.create({
			id: 9,
			roles: [['ROLE_DIRECCION_SECRETARIA'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Dirección Secretaría',
			icono: 'ic-pen',
			
			subMenu: [

				App.MenuItem.create({
					id: 2,
					titulo: 'Mesa de Entrada',
					url: '',
					roles: [['ROLE_MESA_DE_ENTRADA'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 3,
							roles: [['ROLE_MESA_DE_ENTRADA'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Listado de proyectos',
							url: '#/direccionsecretaria/mesadeentrada/proyectos',
						}),						
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_MESA_DE_ENTRADA_EDIT']],
							titulo: 'Crear proyecto',
							url: '#/direccionsecretaria/mesadeentrada/proyecto/crear',
						}),
					],
				}),
				App.MenuItem.create({
					id: 1,
					roles: [],
					titulo: 'Envíos a Archivo',
					url: '#/direccionsecretaria/envios/listado',
					icono: 'ic-archivados',
					
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [],
							titulo: 'Listado',
							url: '#/direccionsecretaria/envios/listado',
						}),
					]
				}),								
			]
		}),
		App.MenuItem.create({
			id: 12,
			roles: [['ROLE_PUBLICACIONES'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Publicaciones',
			icono: 'ic-publicaciones',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Trámite Parlamentario',
					url: '#/publicaciones/TP/listado',
					roles: [['ROLE_PUBLICACIONES'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_PUBLICACIONES'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Listado TPs',
							url: '#/publicaciones/TP/listado',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_PUBLICACIONES_EDIT']],
							titulo: 'Crear Trámite Parlamentario',
							url: '#/publicaciones/TP/crear',
						}),
					],
				}),
			]			
		}),
		App.MenuItem.create({
			id: 1,
			roles: [['ROLE_PROYECTOS'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']], 
			titulo: 'Proyectos',
			icono: 'ic-expedientes',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Proyectos',
					url: '#/proyectos',
					roles: [['ROLE_PROYECTOS'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_PROYECTOS'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
							titulo: 'Buscador de proyectos',
							url: '#/proyectos',
						}),													
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 10,
			roles: [['ROLE_ALERTA_TEMPRANA'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Alerta Temprana',
			icono: 'ic-biografia',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Alerta Temprana',
					url: '#/proyectos/alerta-temprana',
					roles: [['ROLE_ALERTA_TEMPRANA'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_ALERTA_TEMPRANA'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Alerta Temprana',
							url: '#/proyectos/alerta-temprana',
						}),
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 2,
			titulo: 'Comisiones',
			icono: 'ic-comisiones',
			roles: [['ROLE_COMISIONES'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Citaciones',
					roles: [['ROLE_COMISIONES'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_COMISIONES'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
							titulo: 'Agenda de Comisiones',
							url: '#/comisiones/citaciones',
						}),
						App.MenuItem.create({
							id: 1,
							titulo: 'Crear Citación',
							roles: [['ROLE_DIRECCION_COMISIONES']],
							url: '#/comisiones/citaciones/citacion/crear',
						}),					
					]
				}),	
				App.MenuItem.create({
					id: 1,
					titulo: 'Reuniones',
					roles: [['ROLE_COMISIONES'], ['ROLE_SEC_PARL_VIEW'] ],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_COMISIONES'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Reuniones sin Parte',
							url: '#/comisiones/reuniones/sin/parte',
						}),		
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_COMISIONES'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Reuniones con Parte',
							url: '#/comisiones/reuniones/con/parte',
						}),							
					]
				}),	

				App.MenuItem.create({
					id: 2,
					titulo: 'Dictámenes',
					roles: [['ROLE_COMISIONES'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Dictámenes pendientes',
							url: '#/comisiones/dictamenes/pendientes',
							roles: [['ROLE_DIRECCION_COMISIONES']],
						}),			
						App.MenuItem.create({
							id: 1,
							titulo: 'Dictámenes',
							url: '#/comisiones/dictamenes/dictamenes',
							roles: [['ROLE_COMISIONES'], ['ROLE_SEC_PARL_VIEW']],
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
					id: 4,
					titulo: 'Constitución de las Comisiones',
					url: '',
					roles: [['ROLE_COMISIONES'], ['ROLE_DIPUTADO'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_COMISIONES'], ['ROLE_DIPUTADO'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Listado de Comisiones',
							url: '#/comisiones/listado',
						}),		
					],
				}),				
				App.MenuItem.create({
					id: 5,
					roles: [],
					titulo: 'Envíos a Archivo',
					url: '#/comisiones/envios',
					icono: 'ic-archivados',
					
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [],
							titulo: 'Envíos a Archivo',
							url: '#/comisiones/envios',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [],
							titulo: 'Crear Envío a Archivo',
							url: '#/comisiones/envios/envio/crear',
						}),
					]
				}),
			]			
		}),	
		App.MenuItem.create({
			id: 8,
			titulo: 'Orden Del Día',
			roles: [['ROLE_ORDEN_DEL_DIA'],['ROLE_SEC_PARL_VIEW']],
			icono: 'ic-od',
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Orden Del Día',
					url: '',
					roles: [['ROLE_ORDEN_DEL_DIA'],['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Listado de OD',
							url: '#/OD/listado',
							roles: [['ROLE_ORDEN_DEL_DIA'],['ROLE_SEC_PARL_VIEW']],
						}),	
						App.MenuItem.create({
							id: 1,
							titulo: 'Dictámenes sin OD',
							url: '#/OD/dictamenes',
							roles: [['ROLE_ORDEN_DEL_DIA_EDIT']]
						}),	
						App.MenuItem.create({
							id: 2,
							titulo: 'Crear Orden del Día',
							url: '#/OD/crear',
							roles: [['ROLE_ORDEN_DEL_DIA_EDIT']]
						}),												
					],
				}),				
			]			
		}),	
		App.MenuItem.create({
			id: 4,
			titulo: 'Labor Parlamentaria',
			roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
			icono: 'ic-labor',
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Labor Parlamentaria',
					url: '',
					roles: [['ROLE_LABOR_PARLAMENTARIA']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Planes de Labor Tentativos',
							url: '#/laborparlamentaria/planesdelabor/tentativos',
							// url: '#/plan/de/labor/listado/0',
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
						}),						
						App.MenuItem.create({
							id: 1,
							titulo: 'Planes de Labor Confirmados',
							url: '#/laborparlamentaria/planesdelabor/confirmados',
							// url: '#/plan/de/labor/listado/1',
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
						}),	
						App.MenuItem.create({
							id: 2,
							titulo: 'Planes de Labor Definitivos',
							url: '#/laborparlamentaria/planesdelabor/definitivos',
							// url: '#/plan/de/labor/listado/2',
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
						}),							
						App.MenuItem.create({
							id: 3,
							titulo: 'Crear Plan de Labor',
							url: '#/laborparlamentaria/plandelabor/crear',
							roles: [['ROLE_LABOR_PARLAMENTARIA_EDIT']],
						}),							
					],
				}),				
				App.MenuItem.create({
					id: 1,
					titulo: 'Recinto',
					url: '#/laborparlamentaria/recinto/oradores',
					icono: 'ic-recinto',
					roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Oradores',
							url: '#/laborparlamentaria/recinto/oradores',
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
						}),					
						App.MenuItem.create({
							id: 1,
							titulo: 'Asistencias',
							url: '#/laborparlamentaria/recinto/asistencias',
							roles: [['ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']],
						})
					]			
				}),

			]			
		}),		
		App.MenuItem.create({
			id: 13,
			titulo: 'Información Parlamentaria',
			icono: 'ic-tickets',
			roles: [['ROLE_INFORMACION_PARLAMENTARIA'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Solicitudes',
					url: '#/informacionparlamentaria/solicitudes/mis-pedidos',
					roles: [['ROLE_INFORMACION_PARLAMENTARIA'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Listado',
							url: '#/informacionparlamentaria/solicitudes/listado',
							roles: [['ROLE_INFORMACION_PARLAMENTARIA', 'ROLE_IP_EDITOR'], ['ROLE_INFORMACION_PARLAMENTARIA', 'ROLE_IP_DEPARTAMENTO'], ['ROLE_INFORMACION_PARLAMENTARIA_EDIT']], 
						}),
						App.MenuItem.create({
							id: 1,
							titulo: 'Ingresadas por mi',
							url: '#/informacionparlamentaria/solicitudes/mis-pedidos',
							roles: [['ROLE_INFORMACION_PARLAMENTARIA'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
						}),	
						App.MenuItem.create({
							id: 2,
							titulo: 'Nueva solicitud',
							url: '#/informacionparlamentaria/solicitudes/nueva',
							roles: [['ROLE_INFORMACION_PARLAMENTARIA','ROLE_IP_EDITOR'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR'], ['ROLE_INFORMACION_PARLAMENTARIA_EDIT']],
						}),
					],
				}),
			]			
		}),
		App.MenuItem.create({
			id: 11,
			roles: [['ROLE_VISITAS_GUIADAS'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
			titulo: 'Visitas Guiadas',
			icono: 'ic-visitas-guiadas',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Visitas Guiadas',
					url: '',
					roles: [['ROLE_VISITAS_GUIADAS'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_VISITAS_GUIADAS']],
							titulo: 'Listado',
							url: '#/visitas-guiadas/listado',
						}),
						App.MenuItem.create({
							id: 3,
							titulo: 'Ingresadas por mi',
							url: '#/visitas-guiadas/mis-visitas',
							roles: [['ROLE_VISITAS_GUIADAS'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
						}),	
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_VISITAS_GUIADAS_EDIT']],
							titulo: 'Estadísticas',
							url: '#/visitas-guiadas/estadisticas',
						}),	
						App.MenuItem.create({
							id: 2,
							roles: [['ROLE_VISITAS_GUIADAS_EDIT'], ['ROLE_DIPUTADO'], ['ROLE_ASESOR']],
							titulo: 'Nueva visita',
							url: '#/visitas-guiadas/visita/nueva',
						}),	
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 7,
			roles: [['ROLE_ESTADISTICAS']],
			titulo: 'Estadísticas',
			icono: 'ic-estadisticas',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Estadísticas',
					url: '',
					roles: [['ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW'], ['ROLE_VISITAS_GUIADAS_EDIT']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Oradores',
							url: '#/estadisticas/oradores',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_VISITAS_GUIADAS_EDIT']],
							titulo: 'Visitas Guiadas',
							url: '#/estadisticas/visitasguiadas',
						}),		
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 5,
			titulo: 'Administrar Accesos',
			icono: 'ic-accesos',
			roles: [['ROLE_SITE_ADMIN']],
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Administrar',
					url: '#/admin/roles',
					roles: [['ROLE_SITE_ADMIN']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Usuarios y Roles',
							url: '#/admin/roles',
							roles: [['ROLE_SITE_ADMIN']],
						}),		
						App.MenuItem.create({
							id: 1,
							titulo: 'Usuarios y Comisiones',
							url: '#/admin/comisiones',
							roles: [['ROLE_SITE_ADMIN']],
						}),		
						App.MenuItem.create({
							id: 2,
							titulo: 'Tipos de Notificaciones',
							url: '#/admin/notificaciones',
							roles: [['ROLE_SITE_ADMIN']],
						}),	
						App.MenuItem.create({
							id: 3,
							titulo: 'Crear Tipo de Notificación',
							url: '#/admin/notificaciones/tipo/crear',
							roles: [['ROLE_SITE_ADMIN']],
						}),	
						App.MenuItem.create({
							id: 4,
							titulo: 'Usuarios y Legisladores',
							roles: [['ROLE_SITE_ADMIN']],
							url: '#/admin/usuarios-legisladores',
						}),
						App.MenuItem.create({
							id: 5,
							titulo: 'Menus',
							roles: [['ROLE_SITE_ADMIN']],
							url: '#/admin/menus',
						}),

					],
				}),
				
				App.MenuItem.create({
					id: 1,
					titulo: 'Legisladores',
					url: '#/admin/legisladores/listado',
					roles: [['ROLE_SITE_ADMIN']],
					subMenu: [
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_SITE_ADMIN']],
							titulo: 'Legisladores Vigentes',
							url: '#/admin/legisladores/listado',
						}),

						App.MenuItem.create({
							id: 2,
							roles: [['ROLE_SITE_ADMIN']],
							titulo: 'Bloques',
							url: '#/admin/bloques/listado',
						}),						
					],
				})
			]			
		}),
	]
});

App.notificationController = App.NotificationController.create({
	estado: '',
});

App.notificacionesController = App.NotificacionesController.create({
	content: [],
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

App.tituloController = App.TituloController.create({});

App.breadCumbController = App.BreadCumbController.create({
	content: [],
});

App.expedientesController = App.ExpedientesNewController.create({
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


$( document ).ajaxComplete(function( event, xhr, settings ) {
	if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 432)  {
		if (App.userController.user) {
			
			App.userController.set('user', null);
			localStorage.setObject('user', null);

			App.get('router').transitionTo('loading');
			App.get('router').transitionTo('index');

			$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente!', { life: 5000, theme: 'jGrowl-icon-warning jGrowl-warning'});
		}
	}
});


App.deferReadiness();

App.puedeEditar = false;



if (localStorage.getItem('user') == "undefined") {
	localStorage.setObject('user', null);	
}

var user = localStorage.getObject('user');

if (user) {
	var usuario = App.Usuario.extend(App.Savable).create(JSON.parse(user));
	if (usuario.expires_in) {
		if (usuario.expires_in > moment().unix()) {
			var delay = (usuario.expires_in - moment().unix()) * 1000;

			setInterval(function () {

				clearInterval(this);

				App.userController.set('user', null);
				localStorage.setObject('user', null);

				App.get('router').transitionTo('loading');
				App.get('router').transitionTo('index');

				$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente!', { life: 5000, theme: 'jGrowl-icon-warning jGrowl-warning'});
			}, delay);

			if (App.apiController.get('use_auth')) {
				$.ajaxSetup({
			    	headers: { 'Authorization': usuario.get('token_type') + ' ' +  usuario.get('access_token') }
				});				
			}
			App.userController.loginoAuth(usuario.get('cuil'), usuario.get('access_token'), usuario.get('token_type'));
		} else {
			$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente!', { life: 5000, theme: 'jGrowl-icon-warning jGrowl-warning'});
			App.userController.set('user', null);
			localStorage.setObject('user', null);		
			App.advanceReadiness();
		}
	} else {
		App.userController.set('user', null);
		localStorage.setObject('user', null);		
		$('#bcLoader').remove();
		App.advanceReadiness();	
	}
} else {
	$('#bcLoader').remove();
	App.advanceReadiness();	
}



function isOnline () {
	$('#application').addClass('con-conexion');
}

function isOffline () {
	$('#application').addClass('sin-conexion');
	$('#offline').addClass('sin-conexion');
}

window.addEventListener("online", isOnline, false);
window.addEventListener("offline", isOffline, false);

