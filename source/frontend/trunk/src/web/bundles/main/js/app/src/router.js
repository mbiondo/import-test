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

var get = Ember.get, set = Ember.set;

Em.Route.reopen({
	roles: null,
	enter: function () {
		if (Ember.isArray(this.get('roles'))) 
		{
			var userRoles = App.get('userController.roles');
			var roles = this.get('roles');
			var router = this.get('router');
			roles.forEach(function (rolRequiered) {
			 if (!userRoles.contains(rolRequiered)) {
				router.goto403();
			 }
			});
		}
	},
});

Em.Router.reopen({
	goto403: function () {
		this.transitionTo('page403');
	},
});

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

			deserialize: function () {
				
				if (!App.get('notificacionesController'))
					App.notificacionesController = App.NotificacionesController.create({content: []});
				
				var deferred = $.Deferred(),
				
				fn = function() {
						App.get('notificacionesController').removeObserver('loaded', this, fn);	
						deferred.resolve(null);	
				};					

				App.get('notificacionesController').addObserver('loaded', this, fn);
				App.get('notificacionesController').load();
				
				return deferred.promise();				
			},
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('menu', 'subMenu');

				Ember.run.next(function () {
					appController.connectOutlet('main', 'inicio');
				});
				
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
							App.get('estadisticasController').set('sesiones', sesionesController.get('arrangedContent'));
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
				route: '/listado/:estado',

				deserialize: function(router, params) {

					App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: [], estado: params.estado});
					
					var deferred = $.Deferred(),
					
					fn = function() {
						if (App.get('planDeLaborListadoController.loaded')) {
							App.get('planDeLaborListadoController').removeObserver('loaded', this, fn);	
							deferred.resolve(params);	
						}
					};

					App.get('planDeLaborListadoController').addObserver('loaded', this, fn);
					App.get('planDeLaborListadoController').load();
					
					return deferred.promise();
				},	

				serialize: function (router, context) {
					this._super();
					return {estado: context.estado};
				},

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'PlanDeLaborListado');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Labor Parlamentaria', url: '#/plan/de/labor'},
						{titulo: 'Planes de Labor', url: '#/plan/de/labor/listado'}
					]);				

					App.get('menuController').seleccionar(4);							
				},					
			}),

			planDeLabor: Em.Route.extend({ 
				route: '/plan/de/labor',
				crear: Ember.Route.extend({
					route: '/crear',

					deserialize: function(router, params) {
						 var deferred = $.Deferred();

						 var crearPlanDeLaborLoaded = function () {
						 	deferred.resolve(null);
						 };

						 App.crearPlanDeLaborController = App.CrearPlanDeLaborController.create();
						 
						 App.get('crearPlanDeLaborController').addObserver('loaded', this, crearPlanDeLaborLoaded)
						 App.get('crearPlanDeLaborController').load();

						 return deferred.promise();
					},	

					connectOutlets: function(router, context) {

						App.expedientesArchivablesController = App.ExpedientesArchivablesController.create();
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'CrearPlanDeLabor', "saraza", "sadasdasd", "asdasdsad");
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Labor Parlamentaria', url: '#/plan/de/labor'},
							{titulo: "Crear"}
						]);				

						App.get('menuController').seleccionar(4);						
					},
				}),

				ver: Ember.Route.extend({
					route: '/:plan/ver',

					deserialize: function(router, params) {

 					 	 App.planDeLaborController = App.PlanDeLaborController.create();
						
						 App.get('planDeLaborController').set('content', App.PlanDeLabor.create({id: params.plan}));
						 var deferred = $.Deferred(),

						 fn = function() {
						 	if ( App.get('crearPlanDeLaborController.loaded') &&  App.get('planDeLaborController.loaded'))
							App.get('planDeLaborController').removeObserver('loaded', this, fn);	
							var plan = App.get('planDeLaborController.content');
							deferred.resolve(plan);				
						 };

						 App.get('planDeLaborController').addObserver('loaded', this, fn);
						 App.get('planDeLaborController').load();

						 App.crearPlanDeLaborController = App.CrearPlanDeLaborController.create();
						 App.expedientesArchivablesController = App.ExpedientesArchivablesController.create();
						 
						 App.get('crearPlanDeLaborController').addObserver('loaded', this, fn)
						 App.get('crearPlanDeLaborController').load();						 
						
						 return deferred.promise();
					},	

					serialize: function(router, context) {
						return {plan: context.get('id')};
					},

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');

						switch (App.get('planDeLaborController.content.estado')) {
							case "Tentativo":
								if (hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT'))
									appController.connectOutlet('main', 'PlanDeLaborBorradorEdit');
								else
									appController.connectOutlet('main', 'PlanDeLaborBorrador');
								break;
							case "Confirmado":
								appController.connectOutlet('main', 'PlanDeLaborTentativo');
								break;
							case "Definitivo":
								appController.connectOutlet('main', 'PlanDeLaborEfectivo');
								break;
						}

						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Labor Parlamentaria', url: '#/plan/de/labor'},
							{titulo: App.get('planDeLaborController.content.observaciones')}
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
			
			notificaciones: Em.Route.extend({
				route: "/notificaciones",
				indexSubRoute: Em.Route.extend({
					route:'/',
					deserialize: function(router, params) {
						 App.notificacionTiposController = App.NotificacionTiposController.create();

						 var deferred = $.Deferred(),
						
						 fn = function() {
						 	 if (App.get('notificacionTiposController.loaded')) {
								deferred.resolve(null);
						 	 }					
						 };

						 App.get('notificacionTiposController').addObserver('loaded', this, fn);
						 App.get('notificacionTiposController').load();

						
						 return deferred.promise();
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('main', 'notificacionesAdmin');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Administrar Notificaciones', url: '#/admin/notificaciones'},
						]);					
						App.get('menuController').seleccionar(5);							
					},								
				}),

				crear: Em.Route.extend({
					route: '/tipo/crear',

					deserialize: function(router, params) {
						
						 App.comisionesController = App.ComisionesController.create();
						 App.funcionesController = App.FuncionesController.create();
						 App.estructurasController = App.EstructurasController.create();
						 App.rolesController = App.RolesController.create();

						 var deferred = $.Deferred(),
						
						 fn = function() {
						 	 if (App.get('comisionesController.loaded') && App.get('funcionesController.loaded') && App.get('estructurasController.loaded') && App.get('rolesController.loaded')) {
								deferred.resolve(null);
						 	 }					
						 };

						 App.get('comisionesController').addObserver('loaded', this, fn);
						 App.get('funcionesController').addObserver('loaded', this, fn);
						 App.get('estructurasController').addObserver('loaded', this, fn);
						 App.get('rolesController').addObserver('loaded', this, fn);

						 App.get('comisionesController').load();
						 App.get('funcionesController').load();
						 App.get('estructurasController').load();
						 App.get('rolesController').load();
						
						 return deferred.promise();
					},
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'notificacionTipoCrear');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Administrar Notificaciones', url: '#/admin/notificaciones'},
						]);					
						App.get('menuController').seleccionar(5);							
					},								
				})
			}),
		}),
		
		expedientes: Em.Route.extend({
			route: "/expedientes",
			
			index: Em.Route.extend({
				route: '/',

				deserialize: function(router, params) {
				
					
					var deferred = $.Deferred();

					App.get('expedientesController').set('loaded', false);
					App.get('expedientesController').set('loaded', false);

					fn = function() {
						if (App.get('expedientesController.loaded') && App.get('comisionesController.loaded'))
						{
							App.get('expedientesController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						}
					};

					App.get('expedientesController').addObserver('loaded', this, fn);
					App.get('comisionesController').addObserver('loaded', this, fn);

					App.get('expedientesController').load();
					App.get('comisionesController').load();

									
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

			index: Em.Route.extend({
				route: "/envios/archivo",

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
                                {titulo: 'Envíos a Archivo', url: '#/expedientesArchivados/envios/archivo'},
	                        ]);				
	                },
	        	}),

				ver: Ember.Route.extend({
					route: '/:envio/ver',

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
							{titulo: 'Envíos a Archivo', url: '#/expedientesArchivados/envios/archivo'},							
							{titulo: 'Envío del ' + moment(App.get('envioArchivoConsultaController.content.fecha'), 'YYYY-MM-DD').format('LL'), url: '#/expedientesArchivados/envios/archivo/'+App.get('envioArchivoConsultaController.content').get('id')+'/ver'}
						]);
						App.get('menuController').seleccionar(6);					
					},
				}),
			}), 
			crear: Em.Route.extend({
				route: "/envio/crear",


                connectOutlets: function(router, context) {

 					App.expedientesArchivablesController = App.ExpedientesArchivablesController.create();

                    var appController = router.get('applicationController');	
                    appController.connectOutlet('main', 'expedientesArchivados');
                    appController.connectOutlet('menu', 'subMenu');

                    App.get('menuController').seleccionar(6);

                    App.get('breadCumbController').set('content', [
                        {titulo: 'Envíos a Archivo', url: '#/expedientesArchivados/envio/crear'},
                        {titulo: 'Crear Envío', url: '#/expedientesArchivados/envio/crear'},
                    ]);	
                    			
                },
			}),
		}), 
                        
		comisiones: Em.Route.extend({
			route: "/comisiones",
			roles: ["PEDRO"],
			
			index: Ember.Route.extend({
				route: "/",	
			}),

			dictamenes: Em.Route.extend({
				route: "/dictamenes",

				dictamenes: Ember.Route.extend({
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
						appController.connectOutlet('main', 'Dictamenes');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Dictámenes', url: '#/comisiones/dictamenes/dictamenes'},
							{titulo: 'Dictámenes'},
						]);					
						App.get('menuController').seleccionar(2);					
					},						
				}),	

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
							{titulo: 'Dictámenes', url: '#/comisiones/dictamenes/pendientes'},
							{titulo: 'Pendientes'},
						]);					

						App.get('menuController').seleccionar(2);					
					},						
				}),

                crear: Em.Route.extend({
                    route: '/crear',

                    deserialize: function(router, params) {

                        if (!App.get('dictamenCrearController')) { 
                            App.dictamenCrearController = App.DictamenCrearController.create();
                        }

                        App.get('dictamenCrearController').set('content', App.Dictamen.create());
                     
                
                        if (!App.get('expedientesArchivablesController')) {
                            App.expedientesArchivablesController = App.ExpedientesArchivablesController.create();
						}
                        
                        App.firmantesController = App.FirmantesController.create();

                        
                        var deferred = $.Deferred();

                        cargarFirmantesSuccess = function () {
                                if (App.get('firmantesController.loaded')) {
                                        var dictamen = App.get('dictamenCrearController.content');	
                                        deferred.resolve(dictamen);
                                }
                        }

                        cargarDictamenSuccess = function () {
                                if (App.get('dictamenCrearController.loaded') && App.get('expedientesArchivablesController.loaded')) {
                                        App.get('firmantesController').addObserver('loaded', this, cargarFirmantesSuccess);
                                        App.get('firmantesController').load();			
                                }
                        }

                        App.get('dictamenCrearController').addObserver('loaded', this, cargarDictamenSuccess);
                        App.get('expedientesArchivablesController').addObserver('loaded', this, cargarDictamenSuccess);

                        App.get('dictamenCrearController').load();

						App.get('expedientesArchivablesController').load();

                        return deferred.promise();
                     },

                    connectOutlets: function(router, context) {
                            var appController = router.get('applicationController');
                            appController.connectOutlet('main', 'crearDictamen');
                            appController.connectOutlet('menu', 'subMenu');

                            App.get('breadCumbController').set('content', [
                                    {titulo: 'Dictamenes', url: '#/comisiones/dictamenes/pendientes'},
                                    {titulo: 'Crear Dictamen' }
                            ]);							

                            App.get('menuController').seleccionar(2);					
                    },						

                }),

				dictamen: Ember.Route.extend({
					route: '/dictamen',
					dictamenConsulta: Ember.Route.extend({
						route: '/:reunion/ver',

						deserialize: function(router, params) {
							if (!App.get('dictamenConsultaController'))
							 	App.dictamenConsultaController = App.DictamenConsultaController.create();
							App.set('dictamenConsultaController.loaded', false);
							App.set('dictamenConsultaController.content', App.Dictamen.create({id: params.reunion}));

							 var deferred = $.Deferred(),
							 fn = function() {
								var dictamen = App.get('dictamenConsultaController.content');

								deferred.resolve(dictamen);				
								App.get('dictamenConsultaController').removeObserver('loaded', this, fn);
							 };

							 App.get('dictamenConsultaController').addObserver('loaded', this, fn);
							 App.get('dictamenConsultaController').load();

							 return deferred.promise();							
						},	

						serialize: function (router, context) {
							return {reunion: context.get('id')};
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'DictamenConsulta');
							appController.connectOutlet('menu', 'subMenu');

							var copete = App.get('dictamenConsultaController.content.copete');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Dictámenes', url: '#/comisiones/dictamenes/dictamenes'},
								{titulo: 'Dictamen', url: '#/comisiones/dictamenes/dictamenes'},
								{titulo: copete.substr(0,1).toUpperCase() + copete.substr(1, 60).toLowerCase()+'...', url: '#/comisiones/dictamenes/dictamen/'+App.get('dictamenConsultaController.content.id') +'/ver'},								
							//	{titulo: moment(App.get('ordenDelDiaController.content').get('fechaImpresion'), 'YYYY-MM-DD').format('LL')},
							]);				

							App.get('menuController').seleccionar(2);					
						},
						
					}),	
					cargar: Ember.Route.extend({
						route: '/:dictamen/cargar',

						deserialize: function(router, params){

						 	App.dictamenController = App.DictamenController.create({content: {id: params.dictamen }});
						
							if (!App.get('expedientesArchivablesController'))
						 		App.expedientesArchivablesController = App.ExpedientesArchivablesController.create({content: []});

							if (!App.get('reunionConsultaController'))
						 		App.reunionConsultaController = App.ReunionConsultaController.create();						 	


							App.firmantesController = App.FirmantesController.create();

							var deferred = $.Deferred();
							
							cargarFirmantesSuccess = function () {
								if (App.get('firmantesController.loaded')) {
									var dictamen = App.get('dictamenController.content');	
									deferred.resolve(dictamen);
								}
							}

							cargarReunionSuccess = function () {
								if (App.get('reunionConsultaController.loaded')) {
									var reunion = App.get('reunionConsultaController.content');
									var comision_id = reunion.citacion.comisiones[0].id;
									App.get('firmantesController').set('comision_id', comision_id);
									App.get('firmantesController').addObserver('loaded', this, cargarFirmantesSuccess);
									App.get('firmantesController').load();			
								}							
							}

							cargarDictamenSuccess = function () {
								if (App.get('dictamenController.loaded') && App.get('expedientesArchivablesController.loaded')) {
									var dictamen = App.get('dictamenController.content');

									App.get('reunionConsultaController').set('content', App.Reunion.create({id: dictamen.get('id_reunion')}));
									App.get('reunionConsultaController').addObserver('loaded', this, cargarReunionSuccess);
									App.get('reunionConsultaController').load();	
								}
							}

	 						App.get('dictamenController').addObserver('loaded', this, cargarDictamenSuccess);
							App.get('expedientesArchivablesController').addObserver('loaded', this, cargarDictamenSuccess);
							App.get('dictamenController').load();
							App.get('expedientesArchivablesController').load();
							return deferred.promise();
						},

						serialize: function(router, context) {
							return {dictamen: context.get('id')};		
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'cargarDictamen');
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
					route: '/parte',
					/*
					crearParte: Ember.Route.extend({
						route: '/crear',
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'crearParte');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
								{titulo: 'Reunión'},
								{titulo: moment(App.get('reunionConsultaController.content').get('fecha'), 'YYYY-MM-DD HH:mm').format('LLL') + ' - Sala ' + App.get('reunionConsultaController.content.citacion.sala.numero'), url:'#/comisiones/reuniones/reunion/' + App.get('reunionConsultaController.content').get('id') + '/ver'},
								{titulo: 'Crear Parte' }
							]);
							
							App.get('menuController').seleccionar(2);					
						},						
					}),			
					*/	
					editarParte: Ember.Route.extend({
						route: '/editar',
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'crearParte');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
								{titulo: 'Reunión'},
								{titulo: moment(App.get('reunionConsultaController.content').get('fecha'), 'YYYY-MM-DD HH:ss').format('LLL')},
								{titulo: 'Editar Parte' }
							]);
							
							App.get('menuController').seleccionar(2);		
							App.set('reunionConsultaController.isEdit', true);			
						},						
					}),		
				}),	
			}),
			
			reuniones: Em.Route.extend({
				route: "/reuniones",
				index: Ember.Route.extend({
					route: "/sin/parte",
					roles: ['MIRANDA', 'PEDRO'],

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
							
							var conOsinParte;

							 if(App.get('reunionConsultaController.content.parte').length > 0)
							{
								conOsinParte = ' con Parte';
								conOsinParteLink = 'con';
							}
							else
							{
								conOsinParte = ' sin Parte';
								conOsinParteLink = 'sin';
							}

							App.get('breadCumbController').set('content', [
								{titulo: 'Reuniones'},
								{titulo: conOsinParte, url: '#/comisiones/reuniones/'+ conOsinParteLink +'/parte'},
								{titulo: 'Reunión'},
								{titulo: moment(App.get('reunionConsultaController.content').get('fecha'), 'YYYY-MM-DD HH:mm').format('LLL') + ' - Sala ' + App.get('reunionConsultaController.content.citacion.sala.numero')},
							]);					
							App.get('menuController').seleccionar(2);
						},

					}),	
					parte: Em.Route.extend({
						route: '/',

						crear: Ember.Route.extend({
							route: '/:reunion/parte/crear',

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
								appController.connectOutlet('main', 'crearParte');
								appController.connectOutlet('menu', 'subMenu');
								
								App.get('breadCumbController').set('content', [
									{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
									{titulo: 'Reunión'},
									{titulo: moment(App.get('reunionConsultaController.content').get('fecha'), 'YYYY-MM-DD HH:mm').format('LLL') + ' - Sala ' + App.get('reunionConsultaController.content.citacion.sala.numero'), url:'#/comisiones/reuniones/reunion/' + App.get('reunionConsultaController.content').get('id') + '/ver'},
									{titulo: 'Parte' },
									{titulo: 'Crear' }
								]);
								
								App.get('menuController').seleccionar(2);					
							},						
						}),
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
							{titulo: 'Citaciones', url: '#/comisiones/citaciones'},
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
								App.get('citacionSalasController').removeObserver('loaded', this, fn);
								var sala = App.get('citacionSalasController.content').objectAt(0);
								App.set('citacionCrearController.content', App.Citacion.extend(App.Savable).create({sala: sala, comisiones: [], temas: [], invitados: []}));
								App.get('comisionesController').addObserver('loaded', this, fn2);
								App.get('comisionesController').load();				

								App.get('citacionConsultaController').set('content', null);
								App.get('citacionCrearController').set('expedientes', null);

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
								{titulo: 'Citaciones', url: '#/comisiones/citaciones'},
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

								/*
								var citacion = App.get('citacionConsultaController.content');
								var invitados = [];
								citacion.get('invitados').forEach(function (invitado) {
									invitados.addObject(App.CitacionInvitado.create(invitado));
								});
								citacion.set('invitados', invitados);
								*/
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

							App.get('citacionCrearController').set('content', null);
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
								{titulo: 'Citación'},
								{titulo: moment(App.get('citacionConsultaController.content').get('start'), 'YYYY-MM-DD HH:mm').format('LLL') + ' - Sala ' + App.get('citacionConsultaController.content.sala.numero')},
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
								{titulo: moment(App.get('citacionConsultaController.content').get('start'), 'YYYY-MM-DD HH:mm').format('LLL') + ' - Sala ' + App.get('citacionConsultaController.content.sala.numero'), url: '#/comisiones/citaciones/citacion/' + App.get('citacionConsultaController.content').get('id') + '/ver'},
								{titulo: 'Editar'}
							]);						
							App.get('menuController').seleccionar(2);					
						},
						
					}),	
				}),				
			}),
		}),
				
		ordenDelDia: Em.Route.extend({
			route: "/OD",

			listadoDictamenes: Ember.Route.extend({
				route: "/dictamenes",
				
				deserialize: function(router, params) {
					if (!App.get('dictamenesSinOdController'))
						App.dictamenesSinOdController = App.DictamenesSinOdController.create();

					var deferred = $.Deferred(),
					fn = function() {
						 App.get('dictamenesSinOdController').removeObserver('loaded', this, fn);	
						deferred.resolve(null);					
					};

					App.get('dictamenesSinOdController').addObserver('loaded', this, fn);
					App.get('dictamenesSinOdController').load();

					return deferred.promise();
				},
				
				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'DictamenesSinOrdenDelDia');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Orden del Día', url: '#/comisiones/OD/dictamenes'},
						{titulo: 'Dictámenes sin OD'},
					]);					
					App.get('menuController').seleccionar(8);					
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
					appController.connectOutlet('menu', 'subMenu');					
					appController.connectOutlet('main', 'OrdenesDelDiaList');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Orden del Día', url: '#/OD/listado'},
						{titulo: 'Listado de OD'},
					]);			

					App.get('menuController').seleccionar(8);					
				},						
			}),	

			ordenDelDia: Em.Route.extend({ 
				route: '/orden',

				crear: Ember.Route.extend({
					route: '/:id/crear',

					deserialize: function(router, params) {

						 console.log(params.id);
						 	 App.dictamenController = App.DictamenController.create({content: App.Dictamen.create({id: params.id})});

						 var deferred = $.Deferred(),
						 fn = function() {
							App.get('dictamenController').removeObserver('loaded', this, fn);	
							var dictamen = App.get('dictamenController.content');
							deferred.resolve(dictamen);					
						 };

						 App.get('dictamenController').addObserver('loaded', this, fn);
						 App.get('dictamenController').load();
						
						 return deferred.promise();
					},			

					serialize: function (router, params) {
						return {id: params.get('id')};
					},

					connectOutlets: function(router, context) {							
						var appController = router.get('applicationController');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'OrdenDelDiaCrear');
						
						App.get('menuController').seleccionar(8);
						App.get('breadCumbController').set('content', [
							{titulo: 'OD', url: '#/OD/listado'},
							{titulo: 'Nueva Orden Del Día'},
						]);					
						
					},				
				}),		
				
				ordenConsulta: Ember.Route.extend({
					route: '/',
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
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'ordenDelDiaDetalle');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'OD', url: '#/OD/listado'},
								{titulo: 'Orden Del Día Nro '+ App.get('ordenDelDiaController.content').get('numero')},
								{titulo: moment(App.get('ordenDelDiaController.content').get('fechaImpresion'), 'YYYY-MM-DD').format('LL')},
							]);				

							App.get('menuController').seleccionar(8);					
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
							{titulo: 'Recinto', url: '#/recinto/oradores'},	
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
							
							App.set('planDeLaborController.content', App.PlanDeLabor.create({id: context.get('idPl')}));
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
								{titulo: 'Recinto', url: '#/recinto/oradores'},	
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