var p = '';
var rolesRequiered = [];

function checkPath (menuItem){
	if (menuItem.get('subMenu'))
		menuItem.get('subMenu').forEach(checkPath);
	
	if (menuItem.get('url') == p)
		rolesRequiered = menuItem.get('roles');
}

function getRolesByPath(path) {
	p = '#' + path;
	
	var menu = App.get('menuController.content');
	
	menu.forEach(checkPath);
	
	return rolesRequiered;
}

function hasRole(role) {
	var userRoles = App.get('userController.roles');
	var _self = this;

	if (userRoles.contains(role)){
		return true;
	}
	return false;	 
}

App.Router =  Em.Router.extend({
	enableLogging: true,
	location: 'hash',
	verSesion: Em.Router.transitionTo('recinto.oradores.sesionConsulta.indexSubRoute'),
	mostrarTurnos: Em.Router.transitionTo('recinto.oradores.sesionConsulta.tema'),
		
	route: function(path) {
	  this._super(path);
	  
	  if (!App.get('userController.user'))
	  {
	  		this.transitionTo("index");
	  		return;
	  }

	  //Aca agregar logica si tiene o no permisos... 
	  var userRoles = App.get('userController.roles');
	  var roles = getRolesByPath(path);
	  var _self = this;
	  
	  if (this.get("currentState").absoluteRoute)
	  {
		  var actualPath = this.get("currentState").absoluteRoute(this);
		  if (path !== actualPath) {
			this.transitionTo("page404");
		  }
	   }
	   
	  roles.forEach(function (rolRequiered) {
		 if (!userRoles.contains(rolRequiered)){
			_self.transitionTo("page403");
		 }
			 
	  });
	 
	},	
	
	root: Em.Route.extend({
		// STATES
		loading: Em.State.extend({
			enter : function (router, context) {
				var appController = router.get('applicationController');
				appController.set('loading', true);
			},
			exit : function (router, context) {
				var appController = router.get('applicationController');
				appController.set('loading', false);
			},
		}),
		//
		page404: Em.Route.extend({
			route: '/404',
			
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('main', 'page404');
				appController.connectOutlet('menu', 'subMenu');
				
				App.get('breadCumbController').set('content', [
					{titulo: 'Página no encontrada', url: '#'}
				]);				
			},			
		}),
		
		page403: Em.Route.extend({
			route: '/403',
				
			connectOutlets: function(router, context) {
			
				var appController = router.get('applicationController');
				appController.connectOutlet('main', 'page403');
				appController.connectOutlet('menu', 'subMenu');
				
				App.get('breadCumbController').set('content', [
					{titulo: 'No Dispone de los Permisos Necesarios para Acceder', url: '#'}
				]);				
			},			
		}),		
		
		index: Em.Route.extend({
			route: "/",
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('main', 'inicio');
				appController.connectOutlet('menu', 'subMenu');
				
				App.get('menuController').seleccionar(0);
				App.get('breadCumbController').set('content', [
					{titulo: 'Inicio', url: '#'}
				]);				
			},		
		}),

		estadisticas: Em.Route.extend({
			route: '/estadisticas',
			index: Ember.Route.extend({
				route: '/oradores',

				deserialize: function(router, params) {
					if (!App.get('estadisticasController'))
						App.estadisticasController = App.EstadisticasController.create({content: []});
					
					var deferred = $.Deferred(),
					
					fn = function() {
						if (App.get('estadisticasController.loaded') && App.get('sesionesController.loaded')) {
							App.get('estadisticasController').removeObserver('loaded', this, fn);	
							App.get('estadisticasController').set('sesiones', sesionesController.get('content'));
							deferred.resolve(null);	
						}
					};

					var sesionesController = App.get('sesionesController');
					sesionesController.set('loaded', false);
					sesionesController.addObserver('loaded', this, fn);
					sesionesController.load();							

					App.get('estadisticasController').addObserver('loaded', this, fn);
					App.get('estadisticasController').load();
					
					return deferred.promise();
				},	

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'estadisticas');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Estadisticas', url: '#/estadisticas'},
						{titulo: 'Oradores', url: '#/estadisticas/oradores'}
					]);				

					App.get('menuController').seleccionar(7);							
				},				
			})
		}),

		planDeLabor: Em.Route.extend({
			route: '/plan/de/labor',

			index: Ember.Route.extend({
				route: '/listado',

				deserialize: function(router, params) {
					if (!App.get('planDeLaborListadoController'))
						App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: []});
					
					var deferred = $.Deferred(),
					
					fn = function() {
						if (App.get('planDeLaborListadoController.loaded')) {
							App.get('planDeLaborListadoController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);	
						}
					};

					App.get('planDeLaborListadoController').addObserver('loaded', this, fn);
					App.get('planDeLaborListadoController').load();
					
					return deferred.promise();
				},	

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'PlanDeLaborListado');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Labor Parlamentaria', url: '#/plan/de/labor'},
						{titulo: 'Listado', url: '#/plan/de/labor/listado'}
					]);				

					App.get('menuController').seleccionar(4);							
				},					
			}),

			planDeLabor: Em.Route.extend({ 
				route: '/plan/de/labor',

				ver: Ember.Route.extend({
					route: '/:plan/ver',

					deserialize: function(router, params) {
						 if (!App.get('planDeLaborController'))
						 	App.planDeLaborController = App.PlanDeLaborController.create();
						
						 App.get('planDeLaborController').set('content', App.PlanDeLabor.create({id: params.plan}));
						 var deferred = $.Deferred(),
						 fn = function() {
							 App.get('planDeLaborController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						 };

						 App.get('planDeLaborController').addObserver('loaded', this, fn);
						 App.get('planDeLaborController').load();
						
						 return deferred.promise();
					},	

					serialize: function(router, context) {
						return {plan: context.get('id')};
					},

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'PlanDeLabor');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Labor Parlamentaria', url: '#/plan/de/labor'},
							{titulo: App.get('planDeLaborController.content.sumario')}
						]);				

						App.get('menuController').seleccionar(4);						
					},
				}),						
			}),
		}),

		admin: Em.Route.extend({
			route: '/admin',

			index: Ember.Route.extend({
							
			}),	

			roles: Ember.Route.extend({
				route: "/roles",
				
				deserialize: function(router, params) {
					 App.usuariosController = App.UsuariosController.create();
					 App.funcionesController = App.FuncionesController.create();
					 App.estructurasController = App.EstructurasController.create();
					 App.rolesController = App.RolesController.create();

					 var deferred = $.Deferred(),
					
					 fn = function() {
					 	 if (App.get('usuariosController.loaded') && App.get('funcionesController.loaded') && App.get('estructurasController.loaded') && App.get('rolesController.loaded')) {
							deferred.resolve(null);
					 	 }					
					 };

					 App.get('usuariosController').addObserver('loaded', this, fn);
					 App.get('funcionesController').addObserver('loaded', this, fn);
					 App.get('estructurasController').addObserver('loaded', this, fn);
					 App.get('rolesController').addObserver('loaded', this, fn);

					 App.get('usuariosController').load();
					 App.get('funcionesController').load();
					 App.get('estructurasController').load();
					 App.get('rolesController').load();
					
					 return deferred.promise();
				},
				
				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'rolesAdmin');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Administrar Roles', url: '#/admin/roles'},
					]);					
					App.get('menuController').seleccionar(5);							
				},									
			}),	

			comisiones: Ember.Route.extend({
				route: "/comisiones",
				
				deserialize: function(router, params) {
					 App.usuariosController = App.UsuariosController.create();

					 var deferred = $.Deferred(),
					
					 fn = function() {
					 	 if (App.get('usuariosController.loaded') && App.get('comisionesController.loaded')) {
					 	 	App.get('comisionesController.content').insertAt(0, App.Comision.create({id: -1, nombre: 'Seleccione una Comision'}));
							deferred.resolve(null);
					 	 }					
					 };

					 App.get('usuariosController').addObserver('loaded', this, fn);
					 App.get('comisionesController').addObserver('loaded', this, fn);

					 App.get('usuariosController').load();
					 App.get('comisionesController').load();

					
					 return deferred.promise();
				},
				
				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'comisionesAdmin');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Administrar Roles', url: '#/admin/roles'},
					]);					
					App.get('menuController').seleccionar(5);							
				},									
			}),	

		}),
		
		expedientes: Em.Route.extend({
			route: "/expedientes",
			
			index: Em.Route.extend({
				route: '/',

				deserialize: function(router, params) {
				
					if (App.get('expedientesController.loaded'))
						return null;
					
					var deferred = $.Deferred(),
					
					fn = function() {
						App.get('expedientesController').removeObserver('loaded', this, fn);	
						deferred.resolve(null);					
					};

					App.get('expedientesController').addObserver('loaded', this, fn);
					App.get('expedientesController').load();

					App.get('comisionesController').load();
					App.get('comisionesController').addObserver('loaded', this, fn);
									
					return deferred.promise();

					return null;
				},	
					
				connectOutlets: function(router, context) {
				
					var appController = router.get('applicationController');	
					appController.connectOutlet('main', 'expedientes');
					appController.connectOutlet('menu', 'subMenu');

					App.get('menuController').seleccionar(1);
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Expedientes', url: '#/expedientes'}
					]);				
								
				},
			}),


			expedienteConsulta: Ember.Route.extend({

				route: '/expediente',

				indexSubRoute: Ember.Route.extend({
					route: '/:expediente/ver',

					deserialize: function(router, params) {
						App.set('expedienteConsultaController.content', App.Expediente.create({id: params.expediente}));
						
						var deferred = $.Deferred(),
						fn = function() {
							if (App.get('expedienteConsultaController.loaded')) {
								var expediente = App.get('expedienteConsultaController.content');
								deferred.resolve(expediente);
								App.get('expedienteConsultaController').removeObserver('loaded', this, fn);							
							}
						};
						
						App.get('expedienteConsultaController').addObserver('loaded', this, fn);
						App.get('expedienteConsultaController').load();				
						return deferred.promise();
					},

					serialize: function(router, context) {
						var expedienteId = context.get('id');
						return {expediente: expedienteId}
					},

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'expedienteConsulta');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Expedientes', url: '#/expedientes'},
							{titulo: App.get('expedienteConsultaController.content').get('expdip')}
						]);					
						App.get('menuController').seleccionar(1);					
					},
				}),
			}),			
		}),

		expedientesArchivados: Em.Route.extend({
			route: "/expedientesArchivados",
                        
                        deserialize: function(router, params) {

                            if (App.get('expedientesArchivadosController.loaded'))
                                    return null;

                            var deferred = $.Deferred(),

                            fn = function() {
                                    App.get('expedientesArchivadosController').removeObserver('loaded', this, fn);	
                                    deferred.resolve(null);					
                            };

                            App.get('expedientesArchivadosController').addObserver('loaded', this, fn);
                            App.get('expedientesArchivadosController').load();

                            return deferred.promise();
                        },	


                    connectOutlets: function(router, context) {

                            var appController = router.get('applicationController');	
                            appController.connectOutlet('main', 'expedientesArchivados');
                            appController.connectOutlet('menu', 'subMenu');

                            App.get('menuController').seleccionar(6);

                            App.get('breadCumbController').set('content', [
                                    {titulo: 'Expedientes Archivados', url: '#/expedientesArchivados'}
                            ]);				
                    },
		}), 
        
		enviosArchivo: Em.Route.extend({
			route: "/enviosArchivo",
                        
			index: Em.Route.extend({
				route: '/',	
                                        
                                deserialize: function(router, params) {

                                        if (App.get('envioArchivoController.loaded'))
                                                return null;

                                        var deferred = $.Deferred(),

                                        fn = function() {
                                                App.get('envioArchivoController').removeObserver('loaded', this, fn);	
                                                deferred.resolve(null);					
                                        };

                                        App.get('envioArchivoController').addObserver('loaded', this, fn);
                                        App.get('envioArchivoController').load();

                                        return deferred.promise();
                                },	

                                connectOutlets: function(router, context) {

                                        var appController = router.get('applicationController');	
                                        appController.connectOutlet('main', 'enviosArchivados');
                                        appController.connectOutlet('menu', 'subMenu');

                                        App.get('menuController').seleccionar(6);

                                        App.get('breadCumbController').set('content', [
                                                {titulo: 'Env&iacute;os a Archivo', url: '#/enviosArchivo'}
                                        ]);				

                                },
                        }),
                
			envioConsulta: Ember.Route.extend({

				route: '/envio',

				indexSubRoute: Ember.Route.extend({
					route: '/ver/:envio',

					deserialize: function(router, params) {
						App.set('envioArchivoConsultaController.content', App.Envio.create({id: params.envio}));
						
						var deferred = $.Deferred(),
						fn = function() {
							if (App.get('envioArchivoConsultaController.loaded')) {
								var envio = App.get('envioArchivoConsultaController.content');
								deferred.resolve(envio);
                                                                App.get('envioArchivoConsultaController').removeObserver('loaded', this, fn);							
							}
						};
						
						App.get('envioArchivoConsultaController').addObserver('loaded', this, fn);
						App.get('envioArchivoConsultaController').load();				
						return deferred.promise();
					},

					serialize: function(router, context) {
						var envioId = context.get('id');
						return {envio: envioId}
					},

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'expedientesEnvioConsulta');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Env&iacute;os a Archivo', url: '#/enviosArchivo'},
							{titulo: 'Env&iacute;o ' + App.get('envioArchivoConsultaController.content').get('id'), url: '#/enviosArchivo/envio/ver/'+App.get('envioArchivoConsultaController.content').get('id')}
						]);
						App.get('menuController').seleccionar(6);					
					},
				}),
			}),	                                
		}), 
        
        
		comisiones: Em.Route.extend({
			route: "/comisiones",
			
			index: Ember.Route.extend({
				route: "/",	
			}),

			dictamenes: Em.Route.extend({
				route: "/dictamenes",

				pendientes: Em.Route.extend({
					route: "/pendientes",

					deserialize: function(router, params) {
						 if (!App.get('dictamenesPendientesController'))
						 	App.dictamenesPendientesController = App.DictamenesPendientesController.create();

						 var deferred = $.Deferred(),
						 fn = function() {
							 App.get('dictamenesPendientesController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						 };

						 App.get('dictamenesPendientesController').addObserver('loaded', this, fn);
						 App.get('dictamenesPendientesController').load();
						
						 return deferred.promise();
					},
					
					connectOutlets: function(router, context) {

						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'dictamenesPendientes');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Dictamenes', url: '#/comisiones/dictamenes/pendientes'},
							{titulo: 'Pendientes'},
						]);					

						App.get('menuController').seleccionar(2);					
					},						
				}),

				dictamen: Ember.Route.extend({
					route: '/dictamen',

					cargar: Ember.Route.extend({
						route: '/:dictamen/cargar',
						deserialize: function(router, params) {

							if (!App.get('dictamenController'))
								App.dictamenController = App.DictamenController.create();

							if (!App.get('dictamenesPendientesController'))
						 		App.dictamenesPendientesController = App.DictamenesPendientesController.create();							

							//App.dictamenController.set('content', App.Dictamen.create({id: params.dictamen}))

							App.caracterDespachoController = App.CaracterDespachoController.create();
							App.firmantesController = App.FirmantesController.create();
							App.eventosParteController = App.EventosParteController.create();

							var deferred = $.Deferred();
							
							fn = function () {
								if (App.get('dictamenesPendientesController.loaded') && App.get('firmantesController.loaded') && App.get('expedientesController.loaded')) {
									var dictamen = App.get('dictamenesPendientesController.content').findProperty('id', parseInt(params.dictamen));
									App.set('dictamenController.content', dictamen);
									deferred.resolve(dictamen);									
								}
							}	

	 						App.get('dictamenesPendientesController').addObserver('loaded', this, fn);
							App.get('firmantesController').addObserver('loaded', this, fn);
							App.get('expedientesController').addObserver('loaded', this, fn);
							App.get('dictamenesPendientesController').load();
							App.get('firmantesController').load();
							App.get('expedientesController').load();

							return deferred.promise();
						},

						serialize: function(router, context) {
							return {dictamen: context.get('id')};		
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'crearDictamen');
							appController.connectOutlet('menu', 'subMenu');

							App.get('breadCumbController').set('content', [
								{titulo: 'Dictamenes', url: '#/comisiones/dictamenes/pendientes'},
								{titulo: 'Pendientes', url: '#/comisiones/dictamenes/pendientes'},
								{titulo: 'Cargar Dictamen' }
							]);							
							
							App.get('menuController').seleccionar(2);					
						},						

					}),
				}),			

			}),
			
			partes: Em.Route.extend({
				route: "/partes",
				
				parteConsulta: Em.Route.extend({
					route: '/crear/parte',
					
					crearParte: Ember.Route.extend({
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'crearParte');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
								{titulo: 'Reunión'},
								{titulo: moment(App.get('reunionConsultaController.content').get('fecha'), 'YYYY-MM-DD HH:ss').format('LLL')},
								{titulo: 'Crear Parte' }
							]);
							
							App.get('menuController').seleccionar(2);					
						},						
					}),				
				}),		
			}),

			ordenesDelDia: Em.Route.extend({
				route: "/OD",

				listadoDictamenes: Ember.Route.extend({
					route: "/dictamenes",
					
					deserialize: function(router, params) {
						if (!App.get('dictamenesController'))
							App.dictamenesController = App.DictamenesController.create();

						var deferred = $.Deferred(),
						fn = function() {
							 App.get('dictamenesController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						};

						App.get('dictamenesController').addObserver('loaded', this, fn);
						App.get('dictamenesController').load();

						return deferred.promise();
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'OrdenesDelDiaDictamenesList');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'OD', url: '#/comisiones/OD/dictamenes'},
							{titulo: 'Dictámenes sin OD'},
						]);					
						App.get('menuController').seleccionar(2);					
					},						
				}),	

				listadoOD: Ember.Route.extend({
					route: "/listado",
					
					deserialize: function(router, params) {
						 if (!App.get('ordenesDelDiaController'))
						 	App.ordenesDelDiaController = App.OrdenesDelDiaController.create();

						 var deferred = $.Deferred(),
						 fn = function() {
							 App.get('ordenesDelDiaController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						 };

						 App.get('ordenesDelDiaController').addObserver('loaded', this, fn);
						 App.get('ordenesDelDiaController').load();
						
						 return deferred.promise();
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'OrdenesDelDiaList');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'OD', url: '#/comisiones/OD/listado'},
							{titulo: 'Listado de OD'},
						]);			

						App.get('menuController').seleccionar(2);					
					},						
				}),	

				ordenDelDia: Em.Route.extend({ 
					route: '/orden-del-dia',

					crear: Ember.Route.extend({
						route: '/crear',

						deserialize: function(router, params) {
							 if (!App.get('dictamenController'))
							 	App.dictamenController = App.DictamenController.create();

							 var deferred = $.Deferred(),
							 fn = function() {
								 App.get('dictamenController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);					
							 };

							 App.get('dictamenController').addObserver('loaded', this, fn);
							 App.get('dictamenController').load();
							
							 return deferred.promise();
						},			

						connectOutlets: function(router, context) {							
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'crearOD');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('menuController').seleccionar(2);
							App.get('breadCumbController').set('content', [
								{titulo: 'OD', url: '#/comisiones/OD/listado'},
								{titulo: 'Nueva Orden Del Día'},
							]);					
							
						},				
					}),		
					
					ordenConsulta: Ember.Route.extend({
					route: '/orden',
						verOrden: Ember.Route.extend({
							route: '/:orden/ver',

							deserialize: function(router, params) {
								 if (!App.get('ordenDelDiaController'))
								 	App.ordenDelDiaController = App.OrdenDelDiaController.create();
								 App.set('ordenDelDiaController.loaded', false);
								 App.set('ordenDelDiaController.content', App.OrdenDelDiaController.create({id: params.orden}));

								 var deferred = $.Deferred(),
								 fn = function() {
									App.get('ordenDelDiaController').removeObserver('loaded', this, fn);
									var od = App.get('ordenDelDiaController.content');
									deferred.resolve(od);				
								 };

								 App.get('ordenDelDiaController').addObserver('loaded', this, fn);
								 App.get('ordenDelDiaController').load();
								
								 return deferred.promise();
							},	

							serialize: function (router, context) {
								return {orden: context.get('id')};
							},

							connectOutlets: function(router, context) {
								var appController = router.get('applicationController');
								appController.connectOutlet('main', 'ordenDelDiaDetalle');
								appController.connectOutlet('menu', 'subMenu');
								
								App.get('breadCumbController').set('content', [
									{titulo: 'OD', url: '#/comisiones/OD/listado'},
									{titulo: 'Orden Del Día Nro'+ App.get('ordenDelDiaController.content').get('numero')},
									{titulo: moment(App.get('ordenDelDiaController.content').get('fechaImpresion'), 'YYYY-MM-DD').format('LL')},
								]);				

								App.get('menuController').seleccionar(2);					
							},
						}),	
					}),							
				}),
			}),
			
			reuniones: Em.Route.extend({
				route: "/reuniones",
				index: Ember.Route.extend({
					route: "/sin/parte",
					
					deserialize: function(router, params) {
						 var deferred = $.Deferred(),
						
						 fn = function() {
							 App.get('reunionesSinParteController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						 };

						 App.get('reunionesSinParteController').addObserver('loaded', this, fn);
						 App.get('reunionesSinParteController').load();
						
						 return deferred.promise();
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'reunionesSinParte');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
							{titulo: 'sin Parte'},
						]);					
						App.get('menuController').seleccionar(2);							
					},						
				}),
				
				reunionesConparte: Ember.Route.extend({
					route: "/con/parte",
					
					deserialize: function(router, params) {
						 var deferred = $.Deferred(),
						
						 fn = function() {
							 App.get('reunionesConParteController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						 };

						 App.get('reunionesConParteController').addObserver('loaded', this, fn);
						 App.get('reunionesConParteController').load();
						
						 return deferred.promise();
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'reunionesConParte');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
							{titulo: 'con Parte'},
						]);					
						App.get('menuController').seleccionar(2);							
					},						
				}),				
				
				reunionesConsulta: Ember.Route.extend({
					route: '/reunion',
						
					verReunion: Ember.Route.extend({
						route: '/:reunion/ver',

						deserialize: function(router, params) {

							App.eventosParteController = App.EventosParteController.create();
							App.reunionConsultaController = App.ReunionConsultaController.create();

							App.set('reunionConsultaController.loaded', false);
							App.set('eventosParteController.loaded', false);

							App.set('reunionConsultaController.content', App.Citacion.create({id: params.reunion}));

							var deferred = $.Deferred();
							
							fn2 = function () {
								if (App.get('citacionConsultaController.loaded') && App.get('eventosParteController.loaded')) {
									var reunion = App.get('reunionConsultaController.content');
									var citacion = App.get('citacionConsultaController.content');
									var temas = [];
									citacion.get('temas').forEach(function (tema) {
										temas.addObject(App.CitacionTema.create(tema));
									});
									citacion.set('temas', temas);
									
									deferred.resolve(reunion);										
								}
				
							}
							
							fn = function() {
								App.get('reunionConsultaController').removeObserver('loaded', this, fn);
								var reunion = App.get('reunionConsultaController.content');
								App.set('citacionConsultaController.loaded', false);
								App.set('citacionConsultaController.content', App.Citacion.create({id: reunion.citacion.id}));
								App.get('citacionConsultaController').addObserver('loaded', this, fn2);
								App.get('citacionConsultaController').load();
								App.get('eventosParteController').addObserver('loaded', this, fn2);
								App.get('eventosParteController').load();
							}							
							
							App.get('reunionConsultaController').addObserver('loaded', this, fn);
							App.get('reunionConsultaController').load();
							return deferred.promise();
						},

						serialize: function(router, context) {
							return {reunion: context.get('id')};			
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'reunionConsulta');
							appController.connectOutlet('menu', 'subMenu');

							App.get('breadCumbController').set('content', [
								{titulo: 'Reuniones', url: '#/comisiones/reuniones/sin/parte'},
								{titulo: 'Reunión'},
								{titulo: moment(App.get('reunionConsultaController.content').get('fecha'), 'YYYY-MM-DD HH:mm').format('LLL')},
							]);					
							App.get('menuController').seleccionar(2);
						},
					}),	
				}),
			}),
			
			citaciones: Em.Route.extend({
				route: "/citaciones",
				index: Ember.Route.extend({
					route: "/",
					// deserialize: function(router, params) {
						// var deferred = $.Deferred(),
						
						// fn = function() {
							// App.get('citacionesController').removeObserver('loaded', this, fn);	
							// deferred.resolve(null);					
						// };

						// App.get('citacionesController').addObserver('loaded', this, fn);
						// App.get('citacionesController').load();
						
						// return deferred.promise();
					// },		
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'citaciones');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'}
						]);					
						App.get('menuController').seleccionar(2);
					},					
				}),

				citacionesConsulta: Ember.Route.extend({
					route: '/citacion',
					
					crearCitacion: Ember.Route.extend({
						route: '/crear',
						deserialize: function(router, params) {
							var deferred = $.Deferred(),		
							fn = function() {
								App.get('citacionConsultaController').set('content', '');		
								App.get('citacionSalasController').removeObserver('loaded', this, fn);
								var sala = App.get('citacionSalasController.content').objectAt(0);
								App.set('citacionCrearController.content', App.Citacion.extend(App.Savable).create({sala: sala, comisiones: [], temas: [], invitados: []}));
								App.get('comisionesController').addObserver('loaded', this, fn2);
								App.get('comisionesController').load();				

							};
							fn2 = function() {
								App.get('comisionesController').removeObserver('loaded', this, fn2);
								App.set('citacionCrearController.isEdit', false);
								deferred.resolve(null);	
							}

							App.get('citacionSalasController').addObserver('loaded', this, fn);
							App.get('citacionSalasController').load();
							
							return deferred.promise();
						},
						
						connectOutlets: function(router, context) {							
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'citacionCrear');
							appController.connectOutlet('menu', 'subMenu');
							
							App.set('citacionCrearController.isEdit', false);
							
							App.get('menuController').seleccionar(2);
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
								{titulo: 'Citación'},
								{titulo: 'Crear', url: '#/comisiones/citaciones/citacion/crear'}
							]);					
							
						},				
					}),		
					
					verCitacion: Ember.Route.extend({
						route: '/:citacion/ver',

						deserialize: function(router, params) {
							App.set('citacionConsultaController.loaded', false);
							App.set('citacionConsultaController.content', App.Citacion.create({id: params.citacion}));

							var deferred = $.Deferred(),
							fn = function() {
								var citacion = App.get('citacionConsultaController.content');
								deferred.resolve(citacion);
								App.get('citacionConsultaController').removeObserver('loaded', this, fn);
							};

							App.get('citacionConsultaController').addObserver('loaded', this, fn);
							App.get('citacionConsultaController').load();
							return deferred.promise();
						},

						serialize: function(router, context) {
							return {citacion: context.get('id')};			
						},


						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'citacionConsulta');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
								{titulo: 'Citación'},
								{titulo: moment(App.get('citacionConsultaController.content').get('start'), 'YYYY-MM-DD HH:mm').format('LLL')},
							]);					
							App.get('menuController').seleccionar(2);					
						},
					}),	
					
					editarCitacion: Ember.Route.extend({
						route: '/:citacion/editar',
						
						deserialize: function(router, params) {
						
							App.set('citacionConsultaController.loaded', false);
							App.set('citacionCrearController.loaded', false);
							App.set('comisionesController.loaded', false);
							App.set('citacionSalasController.loaded', false);
							
							App.set('citacionConsultaController.content', App.Citacion.create({id: params.citacion}));
							
							var deferred = $.Deferred(),
							
							fn = function() {
								App.get('citacionConsultaController').removeObserver('loaded', this, fn);						
								var citacion = App.get('citacionConsultaController.content');				
								App.set('citacionCrearController.content', citacion);
								App.set('citacionCrearController.isEdit', true);
								
								citacion.set('comisiones', mapObjectsInArrays(App.get('comisionesController').get('content'), citacion.get('comisiones')));
								citacion.set('sala', App.get('citacionSalasController').get('content').findProperty('id', citacion.get('sala').id));
								
								App.get('citacionCrearController').addObserver('loaded', this, fn1);
								App.get('citacionCrearController').cargarExpedientes();
								
							};
							
							fn1 = function () {
								if (App.get('citacionCrearController').get('loaded'))
								{
									App.get('citacionCrearController').removeObserver('loaded', this, fn1);
									var citacion = App.get('citacionConsultaController.content');
									var temas = citacion.get('temas');
									var temas = [];
									citacion.get('temas').forEach(function (tema) {
										var t = App.CitacionTema.create(tema);
										temas.addObject(t);
										t.set('proyectos', mapObjectsInArrays(App.get('citacionCrearController.expedientes'), t.get('proyectos')));
										var proyectos = t.get('proyectos');
										proyectos.forEach(function (proyecto) {
											if (t.get('grupo')) {
												proyecto.set('tema', t.get('descripcion'));
											}
										});									
									});
									
									citacion.set('estado', App.CitacionEstado.create(citacion.get('estado')));
									
									App.get('citacionConsultaController.content').set('temas', temas);
									
									App.set('citacionCrearController.isEdit', true);
									
									deferred.resolve(citacion);							
								}
							}
							
							fn2 = function () {
								App.get('comisionesController').removeObserver('loaded', this, fn2);								
								App.get('citacionConsultaController').addObserver('loaded', this, fn);
								App.get('citacionConsultaController').load();							
							}
							
							fn3 = function () {
								App.get('citacionSalasController').removeObserver('loaded', this, fn3);
								App.get('comisionesController').addObserver('loaded', this, fn2);
								App.get('comisionesController').load();		
								
							}
							
							App.get('citacionSalasController').addObserver('loaded', this, fn3);
							App.get('citacionSalasController').load();														

							return deferred.promise();
						},

						serialize: function(router, context) {
							return {citacion: context.get('id')};			
						},			

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'citacionCrear');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
								{titulo: 'Citación'},
								{titulo: moment(App.get('citacionConsultaController.content').get('start'), 'YYYY-MM-DD HH:ss').format('LLL'), url: '#/comisiones/citaciones/citacion/' + App.get('citacionConsultaController.content').get('id') + '/ver'},
								{titulo: 'Editar'}
							]);						
							App.get('menuController').seleccionar(2);					
						},
						
					}),	
				}),				
			}),
		}),
		
		
		
		
		recinto: Em.Route.extend({
			route: "/recinto",
			
			index: Em.Route.extend({
				route: "/",		
			}),
				
			oradores: Em.Route.extend({
				route: "/oradores",
				
				index: Em.Route.extend({
					route: '/',
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');

						if (hasRole('ROLE_LABOR_PARLAMENTARIA'))
							appController.connectOutlet('main', 'OradoresIndex');
						else
							appController.connectOutlet('main', 'OradoresDiputadoIndex');

						appController.connectOutlet('menu', 'SubMenu');
						
						App.get('temaController').set('content', null);						
						appController.cargarSesiones(true);


						App.get('breadCumbController').set('content', [
							{titulo: 'Oradores', url: '#/recinto/oradores'},	
						]);					
						App.get('menuController').seleccionar(3);
					},
				}),
				
				sesionConsulta: Ember.Route.extend({

					route: '/sesion',

					indexSubRoute: Ember.Route.extend({
						route: '/:sesion/ver',

						deserialize: function(router, params) {

							if (!App.get('planDeLaborController'))
								App.planDeLaborController = App.PlanDeLaborController.create();
							
							var sesion;
							var deferred = $.Deferred(),
							fn = function() {
								if (App.get('sesionesController.loaded')) {
									sesion = App.get('sesionesController.content').findProperty('id', parseInt(params.sesion))
									App.get('sesionesController').removeObserver('loaded', this, fn);
									App.set('planDeLaborController.content', App.PlanDeLabor.create({id: sesion.get('idPl')}));
									App.get('planDeLaborController').addObserver('loaded', this, fn2);
									App.get('planDeLaborController').load();									
								}
							};
							var fn2 = function () {
								if (App.get('planDeLaborController.loaded')) {
									deferred.resolve(sesion);
								}
							}

							App.get('sesionesController').addObserver('loaded', this, fn);
							App.get('sesionesController').load();

							return deferred.promise();
						},

						serialize: function(router, context) {
							var sesionId = context.get('id');
							return {sesion: sesionId}
						},

						connectOutlets: function(router, context) {

							var sesion = App.get('sesionesController.content').findProperty('id', parseInt(context.get('id')))
							if (!App.get('planDeLaborController')) {
								App.planDeLaborController = App.PlanDeLaborController.create();
							}
							
							App.set('planDeLaborController.content', App.PlanDeLabor.create({id: sesion.get('idPl')}));
							App.get('planDeLaborController').load();							
														
							var appController = router.get('applicationController');
							
							if (hasRole('ROLE_LABOR_PARLAMENTARIA')) {
								//appController.connectOutlet('menu', 'subMenu');
								if (hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT'))
									appController.connectOutlet('main', 'oradoresEditorSesionConsulta');
							 	else
									appController.connectOutlet('main', 'sesionConsulta');
							}
							else {
								appController.connectOutlet('main', 'OradoresDiputadoSesionConsulta');
							}
							
							appController.connectOutlet('menu', 'subMenuOradores');
							

							App.get('sesionController').set('content', context);
							App.get('temasController').set('url', '/sesion/%@/temas'.fmt(encodeURIComponent(context.get('id'))));
							App.get('temasController').load();
							
							//appController.cargarSesiones(true);
							
							var sesion = App.get('sesionController.content');
							App.get('breadCumbController').set('content', [
								{titulo: 'Oradores', url: '#/recinto/oradores'},	
								{titulo: 'Sesión ' + sesion.get('sesion') +' / Reunión: ' + sesion.get('reunion')}
							]);					
							App.get('menuController').seleccionar(3);					
						},
					}),
					
					tema: Em.Route.extend({
						route: "/:sesion/tema/:tema",

						deserialize: function(router, params) {
							if (!App.get('planDeLaborController'))
								App.planDeLaborController = App.PlanDeLaborController.create();
								
							

							deferred = $.Deferred();

							var tema, sesion,
							fnTema = function() {
								if (App.get('temasController.loaded') && App.get('turnosController.loaded') && App.get('planDeLaborController.loaded')) {
									tema = App.get('temasController.content').findProperty('id', parseInt(params.tema))
									if(tema){
										deferred.resolve(tema);
									}
									App.get('temasController').removeObserver('loaded', this, fnTema);
								}
							},

							fnSesion = function() {
								if (App.get('sesionesController.loaded')) {
									sesion = App.get('sesionesController.content').findProperty('id', parseInt(params.sesion))
									App.get('sesionController').set('content', sesion);
									
									App.get('temasController').set('url', '/sesion/%@/temas'.fmt(encodeURIComponent(params.sesion)));
									App.get('temasController').addObserver('loaded', this, fnTema);
									App.get('temasController').load();

									App.get('turnosController').set('url', '/sesion/%@/turnos'.fmt(encodeURIComponent(params.sesion)));
									App.get('turnosController').addObserver('loaded', this, fnTema);
									App.get('turnosController').load();		
									
									App.set('planDeLaborController.content', App.PlanDeLabor.create({id: sesion.get('idPl')}));
									App.get('planDeLaborController').addObserver('loaded', this, fnTema);
									App.get('planDeLaborController').load();
									
									App.get('sesionesController').removeObserver('loaded', this, fnSesion);
									
								}
							}


							App.get('sesionesController').addObserver('loaded', this, fnSesion);
							
							App.get('sesionesController').load();

							return deferred.promise();
						},

						serialize: function(router, context) {
							var id = context.get('id');
							var sesionId = context.get('sesionId');
							return {
								sesion: sesionId,
								tema: id,
							}
						},

						connectOutlets: function(router, context) {

							var sesion = App.get('sesionController.content');
							
							if (!App.get('planDeLaborController')) {
								App.planDeLaborController = App.PlanDeLaborController.create();
							}
							App.set('planDeLaborController.content', App.PlanDeLabor.create({id: sesion.get('idPl')}));
							App.get('planDeLaborController').load();
							

							App.get('sesionController').set('content', App.get('sesionesController.content').findProperty('id', parseInt(context.get('sesionId'))));

							if(App.get('temaController.content.sesionId') != context.get('sesionId')){
								App.get('turnosController').set('url', '/sesion/%@/turnos'.fmt(encodeURIComponent(context.get('sesionId'))));
								App.get('turnosController').load();
							}

							App.get('temaController').set('content', context);

							var appController = router.get('applicationController');
							
							if (hasRole('ROLE_LABOR_PARLAMENTARIA')) {
								//appController.connectOutlet('menu', 'subMenu');
								if (hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT'))
									appController.connectOutlet('main', 'oradoresEditorSesionConsulta');
							 	else
									appController.connectOutlet('main', 'sesionConsulta');

								appController.connectOutlet('sesion', 'sesionTurnos');
							}
							else {
								
								appController.connectOutlet('main', 'OradoresDiputadoSesionConsulta');
							}							
							appController.connectOutlet('menu', 'subMenuOradores');

							//appController.cargarSesiones(true);
							
							
							var tema = App.get('temaController.content');
							App.get('breadCumbController').set('content', [
								{titulo: 'Oradores', url: '#/recinto/oradores'},	
								{titulo: 'Sesión ' + sesion.get('sesion') +' / Reunión: ' + sesion.get('reunion'), url: '#/recinto/oradores/sesion/' +sesion.get('id') + '/ver'},
								{titulo: tema.get('titulo')}
							]);					
							App.get('menuController').seleccionar(3);					
						},
					}),
				}),					
			}),
		}),		
	}),	
});