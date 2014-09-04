App.apiController = App.ApiController.create({
	//url: 'http://sparl-desa.hcdn.gob.ar:9090/sparl2/rest/',
	url: 'http://sparl-desa.hcdn.gob.ar:9090/sparl2/rest/',
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
			roles: [[]],
			titulo: 'Inicio',
			url: '#',
			icono: 'ic ic-novedades',

			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Filtrar Novedades Por',
					url: '#',
					roles: [[]],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [[]],
							titulo: 'Todas las Novedades',
							url: '#',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_MESA_DE_ENTRADA'], ['ROLE_DIPUTADO']],
							titulo: 'Movimientos de Expedientes',
							url: '#/novedades/1',
						}),
						App.MenuItem.create({
							id: 2,
							roles: [['ROLE_COMISIONES'], ['ROLE_DIPUTADO']],
							titulo: 'Agenda Comisiones',
							url: '#/novedades/2',
						}),
						App.MenuItem.create({
							id: 3,
							roles: [['ROLE_LABOR_PARLAMENTARIA']],
							titulo: 'Dictámenes',
							url: '#/novedades/3',
						}),								
						App.MenuItem.create({
							id: 4,
							roles: [['ROLE_OD']],
							titulo: 'Orden del Día',
							url: '#/novedades/4',
						}),									
						App.MenuItem.create({
							id: 5,
							roles: [['ROLE_PUBLICACIONES'], ['ROLE_DIPUTADO']],
							titulo: 'Publicaciones',
							url: '#/novedades/5',
						}),													
						App.MenuItem.create({
							id: 7,
							roles: [['ROLE_LABOR_PARLAMENTARIA']],
							titulo: 'Plan de Labor',
							url: '#/novedades/7',
						}),
						App.MenuItem.create({
							id: 6,
							roles: [['ROLE_USER'], , ['ROLE_DIPUTADO']],
							titulo: 'Sesiones',
							url: '#/novedades/6',
						}),														
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 9,
			roles: [['ROLE_DIRECCION_SECRETARIA'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Dirección Secretaría',
			url: '#/direccionsecretaria/mesadeentrada/proyecto/crear',
			icono: 'ic ic-pen',
			
			subMenu: [

				/*
				App.MenuItem.create({
					id: 0,
					titulo: 'Movimiento Autoridades',
					url: '',
					roles: [['ROLE_USER', 'ROLE_MESA_DE_ENTRADA_EDIT']],

					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
							titulo: 'Consulta',
							url: '#/direccionsecretaria/autoridades/listado',
						}),

						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT']],
							titulo: 'Alta',
							url: '#/direccionsecretaria/autoridades/alta',
						}),	
					],
				}),
				*/
			

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
					roles: [['ROLE_SEC_PARL_VIEW']],
					titulo: 'Envíos a Archivo',
					url: '#/direccionsecretaria/envios/listado',
					icono: 'ic ic-archivados',
					
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_SEC_PARL_VIEW']],
							titulo: 'Listado',
							url: '#/direccionsecretaria/envios/listado',
						}),
					]
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
			roles: [['ROLE_ALERTA_TEMPRANA'], ['ROLE_SEC_PARL_VIEW']],
			titulo: 'Alerta Temprana',
			url: '#/expedientes/alerta-temprana',
			icono: 'ic ic-biografia',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Alerta Temprana',
					url: '#/expedientes/alerta-temprana',
					roles: [['ROLE_ALERTA_TEMPRANA'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_ALERTA_TEMPRANA'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Alerta Temprana',
							url: '#/expedientes/alerta-temprana',
						}),
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 12,
			roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_PUBLICACIONES']],
			titulo: 'Publicaciones',
			url: '#/publicaciones/TP/listado',
			icono: 'ic ic-publicaciones',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Trámite Parlamentario',
					url: '#/publicaciones/TP/listado',
					roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_PUBLICACIONES']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_PUBLICACIONES']],
							titulo: 'Listado',
							url: '#/publicaciones/TP/listado',
						}),

						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_PUBLICACIONES_EDIT']],
							titulo: 'Crear',
							url: '#/publicaciones/TP/crear',
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
				/*
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
				}),
				*/
				App.MenuItem.create({
					id: 4,
					titulo: 'Comisiones',
					url: '',
					roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Listado',
							url: '#/comisiones/listado',
						}),		
					],
				}),				
				App.MenuItem.create({
					id: 5,
					roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW'], ['ROLE_MESA_DE_ENTRADA']],
					titulo: 'Envíos a Archivo',
					url: '#/comisiones/envios',
					icono: 'ic ic-archivados',
					
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_SEC_PARL_VIEW'], ['ROLE_MESA_DE_ENTRADA']],
							titulo: 'Envíos a Archivo',
							url: '#/comisiones/envios',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_MESA_DE_ENTRADA_EDIT']],
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
			url: '#/OD/listado',
			roles: [['ROLE_OD'],['ROLE_SEC_PARL_VIEW']],
			icono: 'ic ic-od',
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Orden Del Día',
					url: '',
					roles: [['ROLE_OD'],['ROLE_SEC_PARL_VIEW']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Listado de OD',
							url: '#/OD/listado',
							roles: [['ROLE_OD'],['ROLE_SEC_PARL_VIEW']],
						}),	
						App.MenuItem.create({
							id: 1,
							titulo: 'Dictámenes sin OD',
							url: '#/OD/dictamenes',
//							roles: [['ROLE_USER', 'ROLE_LABOR_PARLAMENTARIA', 'ROLE_LABOR_PARLAMENTARIA_EDIT'], ['ROLE_USER', 'ROLE_SEC_PARL_VIEW']],
							roles: [['ROLE_OD_EDIT'], ['ROLE_SEC_PARL_VIEW']]
						}),							
					],
				}),				
			]			
		}),	
        /*        
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
		*/
		App.MenuItem.create({
			id: 4,
			titulo: 'Labor Parlamentaria',
			url: '#/laborparlamentaria/recinto/oradores',
			roles: [['ROLE_USER'], ['ROLE_LABOR_PARLAMENTARIA']],
			icono: 'ic ic-labor',
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
							roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_LABOR_PARLAMENTARIA']],
						}),						
						App.MenuItem.create({
							id: 1,
							titulo: 'Planes de Labor Confirmados',
							url: '#/laborparlamentaria/planesdelabor/confirmados',
							// url: '#/plan/de/labor/listado/1',
							roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_LABOR_PARLAMENTARIA']],
						}),	

						App.MenuItem.create({
							id: 2,
							titulo: 'Planes de Labor Definitivos',
							url: '#/laborparlamentaria/planesdelabor/definitivos',
							// url: '#/plan/de/labor/listado/2',
							roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_LABOR_PARLAMENTARIA']],
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
					icono: 'ic ic-recinto',
					roles: [['ROLE_USER'], ['ROLE_LABOR_PARLAMENTARIA']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Oradores',
							url: '#/laborparlamentaria/recinto/oradores',
							roles: [['ROLE_USER'], ['ROLE_LABOR_PARLAMENTARIA']],
						}),					
						App.MenuItem.create({
							id: 1,
							titulo: 'Asistencias',
							url: '#/laborparlamentaria/recinto/asistencias',
							roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_LABOR_PARLAMENTARIA_EDIT']],
						})
					]			
				}),

			]			
		}),		
		
		App.MenuItem.create({
			id: 13,
			titulo: 'Información Parlamentaria',
			url: '#/informacionparlamentaria/solicitudes/listado',
			icono: 'ic ic-tickets',
			roles: [['ROLE_INFORMACION_PARLAMENTARIA'], ['ROLE_DIPUTADO']],
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Solicitudes',
					url: '#/informacionparlamentaria/solicitudes/listado',
					roles: [['ROLE_INFORMACION_PARLAMENTARIA'], ['ROLE_DIPUTADO']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							titulo: 'Listado',
							url: '#/informacionparlamentaria/solicitudes/listado',
							roles: [['ROLE_INFORMACION_PARLAMENTARIA']],
						}),
						App.MenuItem.create({
							id: 1,
							titulo: 'Ingresadas por mi',
							url: '#/informacionparlamentaria/solicitudes/mis-pedidos',
							roles: [['ROLE_USER']],
						}),	
						App.MenuItem.create({
							id: 2,
							titulo: 'Nueva solicitud',
							url: '#/informacionparlamentaria/solicitudes/nueva',
							roles: [['ROLE_INFORMACION_PARLAMENTARIA'], ['ROLE_DIPUTADO']],
						}),
					],
				}),
			]			
		}),
		
		App.MenuItem.create({
			id: 7,
			roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_VISITAS_GUIADAS'], ['ROLE_LABOR_PARLAMENTARIA']],
			titulo: 'Estadísticas',
			url: '#/estadisticas/oradores',
			icono: 'ic ic-estadisticas',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Estadísticas',
					url: '#/estadisticas/oradores',
					roles: [['ROLE_SEC_PARL_VIEW'], ['ROLE_VISITAS_GUIADAS'], ['ROLE_LABOR_PARLAMENTARIA']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_LABOR_PARLAMENTARIA'], ['ROLE_SEC_PARL_VIEW']],
							titulo: 'Oradores',
							url: '#/estadisticas/oradores',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_VISITAS_GUIADAS']],
							titulo: 'Visitas Guiadas',
							url: '#/estadisticas/visitasguiadas',
						}),		
					],
				}),
			]
		}),
		App.MenuItem.create({
			id: 11,
			roles: [['ROLE_VISITAS_GUIADAS']],
			titulo: 'Visitas Guiadas',
			url: '#/visitas-guiadas',
			icono: 'ic ic-visitas-guiadas',
			
			subMenu: [
				App.MenuItem.create({
					id: 0,
					titulo: 'Visitas Guiadas',
					url: '',
					roles: [['ROLE_VISITAS_GUIADAS']],
					subMenu: [
						App.MenuItem.create({
							id: 0,
							roles: [['ROLE_VISITAS_GUIADAS']],
							titulo: 'Listado',
							url: '#/visitas-guiadas/listado',
						}),
						App.MenuItem.create({
							id: 1,
							roles: [['ROLE_VISITAS_GUIADAS']],
							titulo: 'Estadísticas',
							url: '#/visitas-guiadas/estadisticas',
						}),	
						App.MenuItem.create({
							id: 2,
							roles: [['ROLE_VISITAS_GUIADAS_EDIT', 'ROLE_DIPUTADO']],
							//roles: [['ROLE_VISITAS_GUIADAS_EDIT']],
							titulo: 'Nueva visita',
							url: '#/visitas-guiadas/visita/nueva',
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

//App.ioController.connect();

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


$( document ).ajaxComplete(function( event, xhr, settings ) {
	if (xhr.status == 400 || xhr.status == 401 || xhr.status == 403 || xhr.status == 432)  {
		if (App.userController.user) {
			
			App.userController.set('user', null);
			localStorage.setObject('user', null);

			App.get('router').transitionTo('loading');
			App.get('router').transitionTo('index');

			$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente', { life: 5000 });
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

				$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente', { life: 5000 });
			}, delay);

			if (App.apiController.get('use_auth')) {
				$.ajaxSetup({
			    	headers: { 'Authorization': usuario.get('token_type') + ' ' +  usuario.get('access_token') }
				});				
			}
			App.userController.loginoAuth(usuario.get('cuil'), usuario.get('access_token'), usuario.get('token_type'));
		} else {
			$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente', { life: 5000 });
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

