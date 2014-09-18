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
	/*
	enter: function () {
		if (Ember.isArray(this.get('roles'))) 
		{
			var userRoles = App.get('userController.roles');
			var roles = this.get('roles');
			var _self = this;
			roles.forEach(function (rolRequiered) {
				 if (!userRoles.contains(rolRequiered)) {
					App.router.transitionTo("novedades", {id: 2});
					return;
				 }
			});
		}
	},
	*/
});


App.Router =  Em.Router.extend({
	enableLogging: true,
	location: 'hash',
	verSesion: Em.Router.transitionTo('recinto.oradores.sesionConsulta.indexSubRoute'),
	mostrarTurnos: Em.Router.transitionTo('recinto.oradores.sesionConsulta.tema'),
		
	route: function(path) {
	  this._super(path);

	  
	  /*if (!App.get('userController.user'))
	  {
	  		//console.log(path);
	  		//App.userController.set('transitionTo', path);
	  		//this.transitionTo("index");
	  		//return;
	  }
	  */

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
	  // roles.forEach(function (rolRequiered) {

		var tienePermisos = roles.length > 0 ? false : true;

		roles.forEach(function (rolesRequiered_value, rolesRequiered_index){
		    var groupIsValid = true;
			rolesRequiered_value.forEach(function(rolRequiered_value, rolRequiered_index){
				if (!userRoles.contains(rolRequiered_value))
				{
					groupIsValid = false;
				}
			});
	    	if (groupIsValid) {
	        	tienePermisos = true;
	      	}
		});

		if (!tienePermisos)
		{
			_self.transitionTo("page403");
		}
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

		//WIDGETS
		widgets: Em.Route.extend({
			route: '/widgets/test',
			
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('help', 'Help');
				appController.connectOutlet('main', 'Test', context);
				appController.connectOutlet('menu', 'subMenu');
				
				App.get('breadCumbController').set('content', [
					{titulo: 'Página no encontrada', url: '#'}
				]);				
			},			
		}),		
		//
		page404: Em.Route.extend({
			route: '/404',
			
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('help', 'Help');
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
				appController.connectOutlet('help', 'Help');
				appController.connectOutlet('main', 'page403');
				appController.connectOutlet('menu', 'subMenu');
				
				App.get('breadCumbController').set('content', [
					{titulo: 'No dispone de los permisos necesarios para acceder', url: '#'}
				]);				
			},			
		}),		
		



		index: Em.Route.extend({
			route: "/",
			roles: ['pepe'],

			deserialize: function () {

				if (!App.notificacionesFiltradasController) 
					App.notificacionesFiltradasController = App.NotificacionesController.create({content: []});
				App.notificacionesFiltradasController.set('url', "notification/all");
				App.diputadosVigentesController = App.DiputadosVigentesController.create({content: []});

				if (App.get('userController').get('isLogin'))
				{
					var deferred = $.Deferred(),

					fn = function() {
						if (App.get('notificacionesFiltradasController.loaded')) {
							App.get('notificacionesFiltradasController').removeObserver('loaded', this, fn);
							deferred.resolve(null);	
						}
					};					

					App.get('notificacionesFiltradasController').addObserver('loaded', this, fn);
					App.get('notificacionesFiltradasController').load();		
					
					return deferred.promise();				
				} else {
					return null;
				}
			},

			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('help', 'Help');
				appController.connectOutlet('menu', 'subMenu');

				Ember.run.next(function () {
					appController.connectOutlet('main', 'inicio');
				});
				
				// App.get('menuController').seleccionar(0);
				App.get('menuController').seleccionar(0,0,0);
				App.get('tituloController').set('titulo', App.get('menuController.titulo'));
				App.get('tituloController').set('titulo', App.get('menuController.titulo'));
				App.get('breadCumbController').set('content', [
					{titulo: 'Inicio', url: '#'},
					{titulo: 'Novedades', url: '#'},
				]);				
			},		
		}),
		
		cambiarPassword: Em.Route.extend({
			route: "/cambiarPassword?token=:token",
			roles: ['pepe'],

			deserialize: function (router, params) {								
				App.userController = App.UserController.create();
				App.get('userController').set('changePassword', true);
				App.get('userController').set('access_token', params.token);
				
			},

			connectOutlets: function(router, context) {


				var appController = router.get('applicationController');
				appController.connectOutlet('help', 'Help');
				appController.connectOutlet('menu', 'subMenu');

				Ember.run.next(function () {
					appController.connectOutlet('main', 'inicio');
				});				
			},		

		}),

		perfil: Em.Route.extend({
			route: '/perfil',

			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('help', 'Help');
				appController.connectOutlet('menu', 'subMenu');

				Ember.run.next(function () {
					appController.connectOutlet('main', 'perfil');
				});

				App.get('tituloController').set('titulo', "Perfil");
				App.get('breadCumbController').set('content', [
					{titulo: 'Perfil'}
				]);					
						
			},			

		}),

		direccionSecretaria: Em.Route.extend({
			route: '/direccionsecretaria',

			mesaDeEntrada: Em.Route.extend({
				route: '/mesadeentrada',

				proyecto: Em.Route.extend({
					route: '/proyecto',

					crear: Em.Route.extend({
						route: '/crear',
						
						deserialize: function(router, params) {
							App.firmantesController = App.FirmantesController.create();
							App.comisionesController = App.ComisionesController.create();

							 if (!App.get('tpsController') || !App.get('tpsController.periodo'))
							 	App.tpsController = App.TPsController.create({periodo: 132});

							var deferred = $.Deferred(),


							fn2 = function() {
	                            if (App.get('tpsController.loaded')) {
									App.get('tpsController').removeObserver('loaded', this, fn2);	
	                                deferred.resolve(null);	
	                            }
							}

							App.get('tpsController').addObserver('loaded', this, fn2);
							App.get('tpsController').load();

						
							return deferred.promise();
						},
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');

							Ember.run.next(function () {
								appController.connectOutlet('main', 'CrearExpediente');
							});
							
							App.get('menuController').seleccionar(9, 2, 0);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
							App.get('breadCumbController').set('content', [
								{titulo: 'Dirección Secretaría'},
								{titulo: 'Mesa de entrada'},
								{titulo: 'Crear Proyecto'}
							]);								
						},
					}),

					movimiento: Em.Route.extend({
						route: '/:id/movimiento',

						deserialize: function(router, params) {

							var ex = App.Expediente.extend(App.Savable).create({id: params.id})
							ex.set('loaded', false);
							 var deferred = $.Deferred(),
							
							fn2 = function () {
								if (App.get('tpsController.loaded') == true) {
								 	App.get('tpsController').removeObserver('loaded', this, fn2);
									deferred.resolve(ex);
								}
							};

							fn = function() {
								if (ex.get('loadError'))
								{
									App.get('router').transitionTo('page404');
								}
								ex.removeObserver('loaded', this, fn);
	                            ex.desNormalize(); 

								App.tpsController = App.TPsController.create({periodo: 132});
								App.get('tpsController').addObserver('loaded', this, fn2);
								App.get('tpsController').load();	
							};

										

							ex.addObserver('loaded', this, fn);
							ex.load();


							return deferred.promise();
						},	

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');

							appController.connectOutlet('main', 'mEExpedienteMovimiento', context);
							
	                        App.get('menuController').seleccionar(9, 2, 3);
//							App.get('menuController').seleccionar(9, 0, 0);	

							App.get('tituloController').set('titulo', App.get('menuController.titulo'));

							App.get('breadCumbController').set('content', [
								{ titulo: 'Dirección Secretaría' },
								{ titulo: 'Mesa de entrada' },
                                { titulo: 'Proyectos', url: '#/direccionsecretaria/mesadeentrada/proyectos' },
								{ titulo: context.expdip },
								{ titulo: 'Solicitar Movimiento' }
							]);								
						},						
					}),	

					ver: Em.Route.extend({
						route: '/:id/ver',
						deserialize: function(router, params) {

							var ex = App.Expediente.extend(App.Savable).create({id: params.id})
							ex.set('loaded', false);
							 var deferred = $.Deferred(),
							 fn = function() {
								ex.removeObserver('loaded', this, fn);
								if (ex.get('loadError'))
								{
									App.get('router').transitionTo('page404');
								}
																
								deferred.resolve(ex);				
							 };

							 ex.addObserver('loaded', this, fn);
							 ex.load();
							
							 return deferred.promise();
						},	

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'mEExpedienteConsulta', context);

							App.get('breadCumbController').set('content', [
								{titulo: 'Dirección Secretaría'},
								{titulo: 'Mesa de entrada'},
                                {titulo: 'Proyectos', url: '#/direccionsecretaria/mesadeentrada/proyectos'},
								{titulo: context.tipo + ' ' + context.expdip},
								{titulo: 'Ver'},
							]);		

							App.get('menuController').seleccionar(9, 2, 3);	

							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},					
					}),

					editar: Em.Route.extend({
						route: '/:id/editar',
						deserialize: function(router, params) {

                            App.firmantesController = App.FirmantesController.create();



							var ex = App.Expediente.extend(App.Savable).create({id: params.id})
							ex.set('loaded', false);

							var deferred = $.Deferred(),


							fn2 = function() {
	                            if (App.get('comisionesController.loaded')) {
	                                App.get('comisionesController').removeObserver('loaded', this, fn2);
		                           	ex.addObserver('loaded', this, fn);
                            		ex.load();
	                            }
							}

							App.get('comisionesController').addObserver('loaded', this, fn2);
							App.get('comisionesController').load();				




							fn3 = function () {
								if (App.get('tpsController.loaded') && App.get('firmantesController.loaded')) {
									App.get('tpsController').removeObserver('loaded', this, fn3);
									App.get('firmantesController').removeObserver('loaded', this, fn3);
									ex.desNormalize(); 
									ex.set('autoridades', []);
									var orden = 1;

									ex.get('firmantes').forEach(function (firmante) {
										var f = App.get('firmantesController').findProperty('label', firmante.nombre);
										if (f) {
											f.set('orden', ++orden);
											ex.get('autoridades').addObject(f);
										}
									}, this);

									deferred.resolve(ex);			
								}
							};

							fn = function() {
							   if (ex.get('loaded')) {
	                               ex.removeObserver('loaded', this, fn);
									if (ex.get('loadError'))
									{
										App.get('router').transitionTo('page404');
									}
							 	    if (!App.get('tpsController')) {
							 			App.tpsController = App.TPsController.create({periodo: ex.get('periodo')});
							 	    } else {
							 	    	App.tpsController.set('periodo', ex.get('periodo'));
							 	    }

									App.get('firmantesController').addObserver('loaded', this, fn3);
									App.get('firmantesController').set('url', moment(ex.get('pubFecha'), 'YYYY-MM-DD hh:ss').format('DD/MM/YYYY') + '/resumen');

								    var tipo = '';

									if(ex.get('expdipT') == 'PE' || ex.get('expdipT') == 'JGM')
									{
										tipo = 'func/funcionarios';
									}
									
									else if(ex.get('expdipT') == 'D')
									{
										tipo = 'dip/diputados';
									} 	

									if (tipo == '') {
										App.get('firmantesController').set('content', []);
										App.get('firmantesController').set('loaded', true);
									} else {
										if(App.get('firmantesController.tipo') != tipo)
										{
											App.get('firmantesController').set('tipo', 'pap/' + tipo);
											App.get('firmantesController').load();					
										}
									}

									var regex = new RegExp('MENSAJE');

									if (regex.test(ex.get('tipo'))) {
										regex = new RegExp('LEY');
										if (regex.test(ex.get('tipo'))) {
											ex.set('conLey', true);
										}
										ex.set('tipo', 'MENSAJE');
									}

								    App.get('tpsController').addObserver('loaded', this, fn3);
								    App.get('tpsController').load();	

							   }
                            };                                                                             
						
							return deferred.promise();
						},	

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'mEExpedienteEditar', context);

							App.get('breadCumbController').set('content', [
								{titulo: 'Dirección Secretaría'},
								{titulo: 'Mesa de entrada'},
                                {titulo: 'Proyectos', url: '#/direccionsecretaria/mesadeentrada/proyectos'},
                                {titulo: context.tipo + ' ' + context.expdip},
								{titulo: 'Editar'},
							]);		

							App.get('menuController').seleccionar(9, 2, 0);	
							
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},						
					}),
				}),
				bloques: Em.Route.extend({
					route: "/bloques",
					index: Ember.Route.extend({
						route: "/listado",
						
						deserialize: function(router, params) {

							var deferred = $.Deferred(),
							fn = function() {
								if (App.interBloquesController.get('loaded') && App.bloquesController.get('loaded')) {
									deferred.resolve(null);				
								}
							};
							
							App.bloquesController = App.BloquesController.create({url:'bloques/all'});
							App.interBloquesController = App.InterBloquesController.create({url:'interbloques/all'});
							App.bloquesController.load();
							App.bloquesController.addObserver('loaded', this, fn);
							App.interBloquesController.load();
							App.interBloquesController.addObserver('loaded', this, fn);
							
						 	return deferred.promise();							
						},
						
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');					
							appController.connectOutlet('main', 'bloquesList');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Dirección Secretaría'},
								{titulo: 'Mesa de Entrada'},
								{titulo: 'Bloques'},
								{titulo: 'Listado', url: '#/direccionsecretaria/mesadeentrada/bloques/listado'},
							]);			

							App.get('menuController').seleccionar(9, 2, 2);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},						
					}),						
				}),

				diputados: Em.Route.extend({
					route: "/legisladores",

					index: Ember.Route.extend({
						route: "/listado",
						
						deserialize: function(router, params) {
							 if (!App.get('diputadosController'))
							 	App.diputadosController = App.DiputadosController.create();

							 var deferred = $.Deferred(),
							 fn = function() {
								 App.get('diputadosController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);					
							 };

							 App.get('diputadosController').addObserver('loaded', this, fn);
							 App.get('diputadosController').load();
							
							 return deferred.promise();
						},
						
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');					
							appController.connectOutlet('main', 'diputadosLista');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Dirección Secretaría'},
								{titulo: 'Mesa de Entrada'},
								{titulo: 'Legisladores'},
								{titulo: 'Listado', url: '#/direccionsecretaria/mesadeentrada/legisladores/listado'},
							]);			

							App.get('menuController').seleccionar(9, 2, 1);								
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},						
					}),	

					ver: Ember.Route.extend({
						route: '/:id/ver',

						deserialize: function(router, params) {

							var diputado = App.User.extend(App.Savable).create({id: params.id})
							diputado.set('loaded', false);

							var deferred = $.Deferred(),
							fn = function() {
								diputado.removeObserver('loaded', this, fn);
								deferred.resolve(diputado);				
							};
							
							diputado.addObserver('loaded', this, fn);
							diputado.load();

						 	return deferred.promise();

						},	

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'diputadoConsulta', context);
							appController.connectOutlet('help', 'Help');

							App.get('breadCumbController').set('content', [
								{titulo: 'Dirección Secretaría'},
								{titulo: 'Mesa de Entrada'},
								{titulo: 'Legisladores', url: '#/direccionsecretaria/mesadeentrada/legisladores/listado'},
								{titulo: 'Ver'},
							]);		

							App.get('menuController').seleccionar(9, 2, 1);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},
					}),

					editar: Ember.Route.extend({
						route: '/:id/editar',

						deserialize: function(router, params) {

							App.diputadoEditController = App.DiputadoEditController.create({content: []});
							var diputado = App.User.extend(App.Savable).create({id: params.id})
							diputado.set('loaded', false);

							var deferred = $.Deferred(),
							fn = function() {
								if (App.interBloquesController.get('loaded') && App.bloquesController.get('loaded') && diputado.get('loaded')) {
									diputado.removeObserver('loaded', this, fn);
									var bloque = App.bloquesController.findProperty('id', diputado.get('bloque.id'));
									var interBloque = App.interBloquesController.findProperty('id', diputado.get('interBloque.id'));
									diputado.set('bloque', bloque);
									diputado.set('interBloque', interBloque);
									
									App.set('diputadoEditController.content', diputado);

									deferred.resolve(diputado);				
								}
							};
							
							diputado.addObserver('loaded', this, fn);
							diputado.load();

							App.bloquesController = App.BloquesController.create();
							App.interBloquesController = App.InterBloquesController.create();
							App.bloquesController.load();
							App.bloquesController.addObserver('loaded', this, fn);
							App.interBloquesController.load();
							App.interBloquesController.addObserver('loaded', this, fn);
							
						 	return deferred.promise();

						},	

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'diputadoEdit', context);
							appController.connectOutlet('help', 'Help');

							App.get('breadCumbController').set('content', [
								{titulo: 'Dirección Secretaría'},
								{titulo: 'Mesa de Entrada'},
								{titulo: 'Legisladores'},
								{titulo: 'Listado', url: '#/direccionsecretaria/mesadeentrada/legisladores/listado'},
								{titulo: 'Editar'}
							]);		

							App.get('menuController').seleccionar(9, 2, 1);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},
					}),							
				}),	
				proyectos: Em.Route.extend({
					route: '/proyectos',

	                deserialize: function(router, params) {
						var deferred = $.Deferred();
						
						App.firmantesController = App.FirmantesController.create();		
						App.tpsController = App.TPsController.create({periodo: 132});		
						App.proyectosController = App.ProyectosController.create({ content: []});
						App.get('proyectosController').set('loaded', false);
						App.get('proyectosController').set('query', App.ProyectoQuery.extend(App.Savable).create({tipo: null, comision: null, dirty: true, pubtipo: 'TP', pubper: 132}));

						fn = function() {
							if (App.get('proyectosController.loaded'))
							{
								App.get('tpsController').removeObserver('loaded', this, fn);	
								App.get('comisionesController').removeObserver('loaded', this, fn);	
								App.get('proyectosController').removeObserver('loaded', this, fn);	
								App.get('firmantesController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);					
							}
						};

						App.get('tpsController').addObserver('loaded', this, fn);
						App.get('comisionesController').addObserver('loaded', this, fn);
						App.get('proyectosController').addObserver('loaded', this, fn);
						App.get('firmantesController').addObserver('loaded', this, fn);

						App.get('tpsController').load();
						App.get('comisionesController').load();
						App.get('proyectosController').load();
						App.get('firmantesController').load();	
										
						return deferred.promise();
	                },

	                connectOutlets: function(router, context) {
                        var appController = router.get('applicationController');
                        appController.connectOutlet('help', 'Help');	
                        appController.connectOutlet('main', 'proyectos');
                        appController.connectOutlet('menu', 'subMenu');

                        App.get('menuController').seleccionar(9, 2, 3);
                        App.get('tituloController').set('titulo', App.get('menuController.titulo'));

						App.get('breadCumbController').set('content', [
							{titulo: 'Dirección Secretaría'},
							{titulo: 'Mesa de Entrada'},
							{titulo: 'Listado de Proyectos', url: '#/direccionsecretaria/mesadeentrada/proyectos'},
						]);			
	                },
				}),
			}),


			autoridades: Em.Route.extend({
				route: '/autoridades',

				alta: Em.Route.extend({
					route: '/alta',

					deserialize: function(router, params) {

						App.diputadosPartidosController = App.DiputadosPartidosController.create();
						App.distritosController = App.DistritosController.create({content: []});
						App.diputadosVigentesController = App.DiputadosVigentesController.create();
						
						var deferred = $.Deferred(),
						
						fn = function() {
							if (App.get('distritosController.loaded')) {
								App.get('distritosController').removeObserver('loaded', this, fn);	
								deferred.resolve(params);	
							}
						};

						App.get('distritosController').addObserver('loaded', this, fn);
						App.get('distritosController').load();
						
						App.get('diputadosPartidosController').addObserver('loaded', this, fn);
						App.get('diputadosPartidosController').load();

						App.get('diputadosVigentesController').addObserver('loaded', this, fn);
						App.get('diputadosVigentesController').load();
						
						return deferred.promise();
					},	

					connectOutlets: function(router, context) {

						App.autoridadesController = App.AutoridadesController.create({content: []});

						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');

						Ember.run.next(function () {
							appController.connectOutlet('main', 'CrearDiputado');
						});
						
						App.get('menuController').seleccionar(9, 0, 1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						App.get('breadCumbController').set('content', [
							{titulo: 'Dirección de Secretaría'},
							{titulo: 'Autoridades'},
							{titulo: 'Alta'}
						]);									
					},
				}),

				listado: Em.Route.extend({
					route: '/listado',

					deserialize: function(router, params) {

						App.diputadosVigentesController = App.DiputadosVigentesController.create({content: []});
						
						var deferred = $.Deferred(),
						
						fn = function() {
							if (App.get('diputadosVigentesController.loaded')) {
								App.get('diputadosVigentesController').removeObserver('loaded', this, fn);	
								deferred.resolve(params);	
							}
						};

						App.get('diputadosVigentesController').addObserver('loaded', this, fn);
						App.get('diputadosVigentesController').load();
						
						return deferred.promise();
					},	

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');

						Ember.run.next(function () {
							appController.connectOutlet('main', 'ListaDiputados');
						});
						
						App.get('menuController').seleccionar(9, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						App.get('breadCumbController').set('content', [
							{titulo: 'Dirección de Secretaría'},
							{titulo: 'Autoridades'},
							{titulo: 'Listado'}
						]);								
					},
				}),			

			}),


			enviosArchivados: Em.Route.extend({
				route: "/envios",

					listado: Em.Route.extend({
						route: '/listado',

		                deserialize: function(router, params) {
	                        var deferred = $.Deferred(),

	                        fn = function() {
	                            App.get('envioArchivoController').removeObserver('loaded', this, fn);	
	                            deferred.resolve(null);					
	                        };

	                        App.get('envioArchivoController').addObserver('loaded', this, fn);
	                        App.get('envioArchivoController').loadByComisionesUser();

	                        return deferred.promise();
		                },	

		                connectOutlets: function(router, context) {
		                        var appController = router.get('applicationController');
		                        appController.connectOutlet('help', 'Help');	
		                        appController.connectOutlet('main', 'enviosArchivados');
		                        appController.connectOutlet('menu', 'subMenu');

		                        App.get('menuController').seleccionar(9, 1, 0);
		                        App.get('tituloController').set('titulo', App.get('menuController.titulo'));

		                        App.get('breadCumbController').set('content', [
									{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
	                                {titulo: 'Envíos a Archivo', url: '#/comisiones/envios/listado'},
		                        ]);				
		                },
		        	}),
			}),
		}),

		novedades: Em.Route.extend({
			route: '/novedades/:id',
			deserialize: function(router, params) {
				App.notificacionesFiltradasController = App.NotificacionesController.create({content: [], url: "/notification/grupo/" + params.id});
				App.notificacionesFiltradasController.set('url', "notification/grupo/" + params.id);

				if (App.get('userController').get('isLogin'))
				{
					var deferred = $.Deferred(),
					
					fn = function() {
						if (App.get('notificacionesFiltradasController.loaded')) {
							App.get('notificacionesFiltradasController').removeObserver('loaded', this, fn);	
							deferred.resolve(params);	
						}
					};					

					App.get('notificacionesFiltradasController').addObserver('loaded', this, fn);
					App.get('notificacionesFiltradasController').load();		

					
					return deferred.promise();				
				} else {
					return null;
				}
			},	

			serialize: function (router, context) {
				this._super();
				return {id: context.id};
			},

			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('help', 'Help');
				appController.connectOutlet('menu', 'subMenu');

				Ember.run.next(function () {
					appController.connectOutlet('main', 'inicio');
				});
				
				var tituloNovedades;
				var getId = parseInt(context.id);
				//tituloNovedades = ['Todas las Novedades','Movimientos de expedientes', 'Agenda de Comisiones', ' Dictámenes', 'Orden del Día', 'Publicaciones', 'Sesiones', 'Plan de Labor'];
				
				tituloNovedades = [
					'Todas las Novedades',
					'Movimientos de expedientes',
					'Publicaciones', 
					'Agenda de Comisiones',
					'Dictámenes', 
					'Orden del Día',
					'Plan de Labor',
					'Sesiones', 
					'Agenda de Comisiones', 
				];
				
				// App.get('menuController').seleccionar(0);

				if(context.id)
				{
					App.get('menuController').seleccionar(0, 0, getId);				
				}
				else
				{
					App.get('menuController').seleccionar(0);									
				}

				App.get('tituloController').set('titulo', App.get('menuController.titulo'));
				App.get('breadCumbController').set('content', [
					{titulo: 'Inicio', url: '#'},
					{titulo: 'Novedades', url: '#'},
					{titulo: tituloNovedades[context.id], url: '#/1'}
				]);								
			},							
		}),

		estadisticas: Em.Route.extend({
			route: '/estadisticas',
			visitas: Ember.Route.extend({
				route: '/visitasguiadas',

				deserialize: function(){
					var deferred = $.Deferred();				
					
					App.visitasGuiadasController = App.VisitasGuiadasController.create();
					App.visitasGuiadasEstadisticasController = App.VisitasGuiadasEstadisticasController.create();

					fn = function() {
						if(App.get('visitasGuiadasController.loaded'))
						{
							App.get('visitasGuiadasController').removeObserver('loaded', this, fn);	
							App.get('visitasGuiadasEstadisticasController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);
						}
					};
					
					App.get('visitasGuiadasController').addObserver('loaded', this, fn);
					App.get('visitasGuiadasEstadisticasController').addObserver('loaded', this, fn);

					App.get('visitasGuiadasController').load();	
					App.get('visitasGuiadasEstadisticasController').load();	

					return deferred.promise();	
				},
				connectOutlets: function(router, context){
					var appController = router.get('applicationController');
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'VisitasGuiadasEstadisticas');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Estadísticas', url: '#/estadisticas'},
						{titulo: 'Visitas Guiadas', url: '#/estadisticas/visitasguiadas'}
					]);				

					App.get('menuController').seleccionar(7, 0, 1);
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
				},					
			}),

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
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'estadisticas');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Estadísticas', url: '#/estadisticas'},
						{titulo: 'Oradores', url: '#/estadisticas/oradores'}
					]);				

					App.get('menuController').seleccionar(7, 0, 0);
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));							
				},				
			})
		}),

		planDeLabor: Em.Route.extend({
			route: '/laborparlamentaria',

			index: Ember.Route.extend({
				route: '/planesdelabor',

					index: Ember.Route.extend({
						route: '/tentativos',

						deserialize: function(router, params) {

							App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: [], estado: 0});
							
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
							return {estado: 0};
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'PlanDeLaborListado');
							appController.connectOutlet('menu', 'subMenu');
							
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Labor Parlamentaria'},
								{titulo: 'Planes de Labor Tentativos', url: '#/laborparlamentaria/planesdelabor/tentativos'}
							]);				

							App.get('menuController').seleccionar(4, 0, 0);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
						},					
					}),	

					planesDeLaborConfirmados: Ember.Route.extend({
						route: '/confirmados',

						deserialize: function(router, params) {

							App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: [], estado: 1});
							
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
							return {estado: 1};
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'PlanDeLaborListado');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Labor Parlamentaria'},
								{titulo: 'Planes de Labor Confirmados', url: '#/laborparlamentaria/planesdelabor/confirmados'}
							]);				

							App.get('menuController').seleccionar(4, 0, 1);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));							
						},					
					}),	
					planesDeLaborDefinitivos: Ember.Route.extend({
						route: '/definitivos',

						deserialize: function(router, params) {

							App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: [], estado: 2});
							
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
							return {estado: 2};
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'PlanDeLaborListado');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Labor Parlamentaria'},
								{titulo: 'Planes de Labor Definitivos', url: '#/laborparlamentaria/planesdelabor/definitivos'}
							]);				

							App.get('menuController').seleccionar(4, 0, 2);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));							
						},					
					}),	

			}),

			planDeLabor: Em.Route.extend({ 
				route: '/plandelabor',
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
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'CrearPlanDeLabor', "saraza", "sadasdasd", "asdasdsad");
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Labor Parlamentaria'},
							{titulo: "Plan de Labor"},
							{titulo: "Crear", url:'#/laborparlamentaria/plandelabor/crear'}
						]);				

						App.get('menuController').seleccionar(4, 0, 3);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));					
					},
				}),

				ver: Ember.Route.extend({
					route: '/:plan/ver',

					enter: function () {
						App.get('ioController').joinRoom('planDeLabor');
					},

					exit: function () {
						App.get('ioController').leaveRoom('planDeLabor');
					},

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
						appController.connectOutlet('help', 'Help');

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
							{titulo: 'Labor Parlamentaria'},
							{titulo: 'Plan de Labor'},
							{titulo: moment(App.get('planDeLaborController.content.fechaEstimada'), 'DD/MM/YYYY').format('LL'), url:'#/laborparlamentaria/plandelabor/' + App.get('planDeLaborController.content.id') + '/ver/'}
						]);				

						App.get('menuController').seleccionar(4);		
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},
				}),						
			}),

			recinto: Em.Route.extend({
				route: "/recinto",
				
				index: Em.Route.extend({
					route: "/",		
				}),
				
				asistencias: Em.Route.extend({
					route: "/asistencias",

						enter: function () {
							App.get('ioController').joinRoom('asistencias');
							App.get('menuController').seleccionar(4);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						},

						exit: function () {
							App.get('ioController').leaveRoom('asistencias');
						},

						deserialize: function(router, params){
							if (!App.get('diputadosController')){
								App.diputadosController = App.DiputadosController.create();
							}

							var deferred = $.Deferred(),
							fn = function() {
							 	App.get('diputadosController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);					
							};
							
							App.get('diputadosController').addObserver('loaded', this, fn);
							App.get('diputadosController').load();
			
							return deferred.promise();
						},
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');


							App.asistenciasController = App.AsistenciasController.create();
							
							appController.connectOutlet('main', 'OradoresAsistencias');
							
							appController.connectOutlet('menu', 'SubMenu');
							
							App.get('temaController').set('content', null);						
							appController.cargarSesiones(true);


							App.get('breadCumbController').set('content', [
								{titulo: 'Labor Parlamentaria'},
								{titulo: 'Recinto', url: '#/laborparlamentaria/recinto/asistencias'},	
								{titulo: 'Asistencias', url: '#/laborparlamentaria/recinto/asistencias'},	
							]);					
							App.get('menuController').seleccionar(4, 1, 1);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						},

				}),
				oradores: Em.Route.extend({
					route: "/oradores",
					
					index: Em.Route.extend({
						route: '/',
						
						enter: function () {
							App.get('ioController').joinRoom('oradores');
							App.get('menuController').seleccionar(4);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));

						},

						exit: function () {
							App.get('ioController').leaveRoom('oradores');
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');

							appController.connectOutlet('main', 'OradoresIndex');
							
							appController.connectOutlet('menu', 'SubMenu');
							
							App.get('temaController').set('content', null);						
							appController.cargarSesiones(true);


							App.get('breadCumbController').set('content', [
								{titulo: 'Labor Parlamentaria'},
								{titulo: 'Recinto', url: '#/laborparlamentaria/recinto/oradores'},	
								{titulo: 'Oradores', url: '#/laborparlamentaria/recinto/oradores'},	
							]);					
							App.get('menuController').seleccionar(4, 1, 0);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						},
					}),
					
					sesionConsulta: Ember.Route.extend({

						route: '/sesion',

						indexSubRoute: Ember.Route.extend({
							route: '/:sesion/ver',

							enter: function () {
								App.get('ioController').joinRoom('oradores');
								App.get('menuController').seleccionar(4, 1, 0);
								App.get('tituloController').set('titulo', App.get('menuController.titulo'));
							},

							exit: function () {
								App.get('ioController').leaveRoom('oradores');
							},

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
								App.get('diputadosController').load();

								return deferred.promise();
							},

							serialize: function(router, context) {
								var sesionId = context.get('id');
								return {sesion: sesionId}
							},

							connectOutlets: function(router, context) {
								var sesion = App.get('sesionesController.content').findProperty('id', parseInt(context.get('id')));

								if (!App.get('planDeLaborController')) {
									App.planDeLaborController = App.PlanDeLaborController.create();
								}
								
								if (!App.get('diputadosController.loaded')) {
									App.get('diputadosController').load();
								}

								App.set('planDeLaborController.content', App.PlanDeLabor.create({id: context.get('idPl')}));
								App.get('planDeLaborController').load();							
															
								var appController = router.get('applicationController');
								
								if (hasRole('ROLE_LABOR_PARLAMENTARIA')) {
									//appController.connectOutlet('menu', 'subMenu');
									if (hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT')) {
										appController.connectOutlet('main', 'oradoresEditorSesionConsulta');
										App.puedeEditar = true;
										//appController.connectOutlet('help', 'crearTurnoInline');
									}
								 	else
										appController.connectOutlet('main', 'sesionConsulta');
								}
								else 
								{
									appController.connectOutlet('main', 'OradoresDiputadoSesionConsulta');
								}
								
								appController.connectOutlet('menu', 'subMenuOradores');
								

								App.get('sesionController').set('content', context);
								App.get('temasController').set('url', 'sesion/%@/temas'.fmt(encodeURIComponent(context.get('id'))));
								App.get('temasController').load();
								
								//appController.cargarSesiones(true);
								
								var sesion = App.get('sesionController.content');
								App.get('breadCumbController').set('content', [
									{titulo: 'Labor Parlamentaria'},
									{titulo: 'Recinto', url: '#/laborparlamentaria/recinto/oradores'},
									{titulo: 'Oradores', url: '#/laborparlamentaria/recinto/oradores'},	
									{titulo: 'Sesión ' + sesion.get('sesion') +' / Reunión: ' + sesion.get('reunion')}
								]);					
								App.get('menuController').seleccionar(4);	
								App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
							},
						}),
						
						tema: Em.Route.extend({
							route: "/:sesion/tema/:tema",

							enter: function () {
								this._super();
								App.get('ioController').joinRoom('oradores');
								var appController = App.get('router.applicationController');
								appController.setLayout(3, 6, 3);
								App.get('menuController').seleccionar(4, 1, 0);
								App.get('tituloController').set('titulo', App.get('menuController.titulo'));
							},

							exit: function () {
								this._super();
								App.get('ioController').leaveRoom('oradores');
								var appController = App.get('router.applicationController');
								appController.setLayout(3, 7, 2);							
							},
							
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
									if (App.get('sesionesController.loaded') && App.get('diputadosController.loaded')) {
										sesion = App.get('sesionesController.content').findProperty('id', parseInt(params.sesion))
										App.get('sesionController').set('content', sesion);
										
										App.get('temasController').set('url', 'sesion/%@/temas'.fmt(encodeURIComponent(params.sesion)));
										App.get('temasController').addObserver('loaded', this, fnTema);
										App.get('temasController').load();

										App.get('turnosController').set('url', 'sesion/%@/turnos'.fmt(encodeURIComponent(params.sesion)));
										App.get('turnosController').addObserver('loaded', this, fnTema);
										App.get('turnosController').load();		
										
										App.set('planDeLaborController.content', App.PlanDeLabor.create({id: sesion.get('idPl')}));
										App.get('planDeLaborController').addObserver('loaded', this, fnTema);
										App.get('planDeLaborController').load();
										
										App.get('sesionesController').removeObserver('loaded', this, fnSesion);
										
									}
								}


								App.get('sesionesController').addObserver('loaded', this, fnSesion);
								App.get('diputadosController').addObserver('loaded', this, fnSesion);
								
								App.get('sesionesController').load();
								App.get('diputadosController').load();

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
									App.get('turnosController').set('url', 'sesion/%@/turnos'.fmt(encodeURIComponent(context.get('sesionId'))));
									App.get('turnosController').load();
								}

								if (!App.get('diputadosController.loaded')) {
									App.get('diputadosController').load();
								}

								App.get('temaController').set('content', context);

								var appController = router.get('applicationController');

								var tema = App.get('temaController.content');
								

								if (hasRole('ROLE_LABOR_PARLAMENTARIA')) {
									//appController.connectOutlet('menu', 'subMenu');
									if (hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT')) {
										//appController.connectOutlet('help', 'crearTurnoInline');
										appController.connectOutlet('main', 'oradoresEditorSesionConsulta');
										App.puedeEditar = true;
									}
								 	else
										appController.connectOutlet('main', 'sesionConsulta');
								}
								else {
									
									appController.connectOutlet('main', 'OradoresDiputadoSesionConsulta');
								}							
								
								appController.connectOutlet('sesion', 'sesionTurnos');
								appController.connectOutlet('menu', 'subMenuOradores');

								//appController.cargarSesiones(true);
								
								
								App.get('breadCumbController').set('content', [
									{titulo: 'Labor Parlamentaria'},
									{titulo: 'Recinto', url: '#/laborparlamentaria/recinto/oradores'},	
									{titulo: 'Oradores', url: '#/laborparlamentaria/recinto/oradores'},	
									{titulo: 'Sesión ' + sesion.get('sesion') +' / Reunión: ' + sesion.get('reunion'), url: '#/laborparlamentaria/recinto/oradores/sesion/' +sesion.get('id') + '/ver'},
									{titulo: tema.get('titulo')}
								]);					
							},
						}),
					}),					
				}),
			}),	

		}),

		admin: Em.Route.extend({
			route: '/admin',

			index: Ember.Route.extend({
							
			}),	


			bloques: Em.Route.extend({
				route: "/bloques",
				index: Ember.Route.extend({
					route: "/listado",
					
					deserialize: function(router, params) {

						var deferred = $.Deferred(),
						fn = function() {
							if (App.interBloquesController.get('loaded') && App.bloquesController.get('loaded')) {
								deferred.resolve(null);				
							}
						};
						
						App.bloquesController = App.BloquesController.create({url:'bloques/all'});
						App.interBloquesController = App.InterBloquesController.create({url:'interbloques/all'});
						App.bloquesController.load();
						App.bloquesController.addObserver('loaded', this, fn);
						App.interBloquesController.load();
						App.interBloquesController.addObserver('loaded', this, fn);
						
					 	return deferred.promise();							
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');					
						appController.connectOutlet('main', 'bloquesList');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Administrar'},
							{titulo: 'Bloques'},
							{titulo: 'Listado', url: '#/admin/bloques/listado'},
						]);			

						App.get('menuController').seleccionar(5, 1, 2);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},						
				}),						
			}),

			diputados: Em.Route.extend({
				route: "/legisladores",

				index: Ember.Route.extend({
					route: "/listado",
					
					deserialize: function(router, params) {
						 if (!App.get('diputadosController'))
						 	App.diputadosController = App.DiputadosController.create();

						 var deferred = $.Deferred(),
						 fn = function() {
							 App.get('diputadosController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						 };

						 App.get('diputadosController').addObserver('loaded', this, fn);
						 App.get('diputadosController').load();
						
						 return deferred.promise();
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');					
						appController.connectOutlet('main', 'diputadosLista');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Administrar'},
							{titulo: 'Legisladores'},
							{titulo: 'Listado', url: '#/admin/legisladores/listado'},
						]);			

						//App.get('menuController').seleccionar(9, 2, 1);	
						App.get('menuController').seleccionar(5, 1, 1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},						
				}),	

				ver: Ember.Route.extend({
					route: '/:id/ver',

					deserialize: function(router, params) {

						var diputado = App.User.extend(App.Savable).create({id: params.id})
						diputado.set('loaded', false);

						var deferred = $.Deferred(),
						fn = function() {
							diputado.removeObserver('loaded', this, fn);
							deferred.resolve(diputado);				
						};
						
						diputado.addObserver('loaded', this, fn);
						diputado.load();

					 	return deferred.promise();

					},	

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'diputadoConsulta', context);
						appController.connectOutlet('help', 'Help');

						App.get('breadCumbController').set('content', [
							{titulo: 'Administrar'},
							{titulo: 'Legisladores', url: '#/admin/legisladores/listado'},
							{titulo: 'Ver'},
						]);		

						//App.get('menuController').seleccionar(9, 2, 1);	
						App.get('menuController').seleccionar(5, 1, 1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},
				}),

				editar: Ember.Route.extend({
					route: '/:id/editar',

					deserialize: function(router, params) {

						App.diputadoEditController = App.DiputadoEditController.create({content: []});
						var diputado = App.User.extend(App.Savable).create({id: params.id})
						diputado.set('loaded', false);

						var deferred = $.Deferred(),
						fn = function() {
							if (App.interBloquesController.get('loaded') && App.bloquesController.get('loaded') && diputado.get('loaded')) {
								diputado.removeObserver('loaded', this, fn);
								var bloque = App.bloquesController.findProperty('id', diputado.get('bloque.id'));
								var interBloque = App.interBloquesController.findProperty('id', diputado.get('interBloque.id'));
								diputado.set('bloque', bloque);
								diputado.set('interBloque', interBloque);
								
								App.set('diputadoEditController.content', diputado);

								deferred.resolve(diputado);				
							}
						};
						
						diputado.addObserver('loaded', this, fn);
						diputado.load();

						App.bloquesController = App.BloquesController.create();
						App.interBloquesController = App.InterBloquesController.create();
						App.bloquesController.load();
						App.bloquesController.addObserver('loaded', this, fn);
						App.interBloquesController.load();
						App.interBloquesController.addObserver('loaded', this, fn);
						
					 	return deferred.promise();

					},	

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'diputadoEdit', context);
						appController.connectOutlet('help', 'Help');

						App.get('breadCumbController').set('content', [
							{titulo: 'Administrar'},
							{titulo: 'Legisladores'},
							{titulo: 'Listado', url: '#/admin/legisladores/listado'},
							{titulo: 'Editar'}
						]);		

						//App.get('menuController').seleccionar(9, 2, 1);	
						App.get('menuController').seleccionar(5, 1, 1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},
				}),							
			}),				
			roles: Ember.Route.extend({
				route: "/roles",
				
				deserialize: function(router, params) {
					 App.usuariosController = App.UsuariosController.create();
					
					 App.rolesController = App.RolesController.create();
					 App.departamentosController = App.DepartamentosController.create();

					 var deferred = $.Deferred(),
					
					 fn = function() {
					 	 if (App.get('usuariosController.loaded')  && App.get('departamentosController.loaded') && App.get('rolesController.loaded')) {
							deferred.resolve(null);
					 	 }					
					 };

					 App.get('usuariosController').addObserver('loaded', this, fn);
					
					 App.get('rolesController').addObserver('loaded', this, fn);
					 
					 App.get('departamentosController').addObserver('loaded', this, fn);

					 App.get('departamentosController').load();

					 App.get('usuariosController').load();
					 
					 App.get('rolesController').load();
					
					 return deferred.promise();
				},
				
				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'rolesAdmin');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Administrar'},
						{titulo: 'Usuarios y Roles', url: '#/admin/roles'},
					]);					
					App.get('menuController').seleccionar(5, 0, 0);
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));							
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
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'comisionesAdmin');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Administrar'},
						{titulo: 'Usuarios y Comisiones', url: '#/admin/comisiones'},
					]);					
					App.get('menuController').seleccionar(5, 0, 1);	
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
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
						appController.connectOutlet('help', 'Help');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Administrar'},
							{titulo: 'Tipos de Notificaciones', url: '#/admin/notificaciones'},
						]);					
						App.get('menuController').seleccionar(5, 0, 2);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));							
					},								
				}),
				notificacionConsulta: Em.Route.extend({
					route:'/tipo',

					editar: Em.Route.extend({
						route:'/:notificacion/editar',
						deserialize: function(router, params){
							App.notificacionTipoController = App.NotificacionTipoController.create();
							App.set('notificacionTipoController.loaded', false);
							App.set('notificacionTipoController.content', App.NotificacionTipo.create({id: params.notificacion}));

							App.comisionesController = App.ComisionesController.create();
							App.funcionesController = App.FuncionesController.create();
							App.estructurasController = App.EstructurasController.create();
							App.rolesController = App.RolesController.create();
							App.notificacionesGruposController = App.NotificacionesGruposController.create();

							var deferred = $.Deferred(),
							fn = function() {
								if (App.get('notificacionTipoController.loaded')) {
									var notificacion = App.get('notificacionTipoController.content');
									deferred.resolve(notificacion);
									App.get('notificacionTipoController').removeObserver('loaded', this, fn);							
								}
							};
							

							 fn2 = function() {
							 	 if (App.get('notificacionesGruposController.loaded') && App.get('comisionesController.loaded') && App.get('funcionesController.loaded') && App.get('estructurasController.loaded') && App.get('rolesController.loaded')) {
									App.get('notificacionTipoController').addObserver('loaded', this, fn);
									App.get('notificacionTipoController').load();	
							 	 }					
							 };

							 App.get('comisionesController').addObserver('loaded', this, fn2);
							 App.get('funcionesController').addObserver('loaded', this, fn2);
							 App.get('estructurasController').addObserver('loaded', this, fn2);
							 App.get('rolesController').addObserver('loaded', this, fn2);
							 App.get('notificacionesGruposController').addObserver('loaded', this, fn2);

							 App.get('comisionesController').load();
							 App.get('funcionesController').load();
							 App.get('estructurasController').load();
							 App.get('rolesController').load();
							 App.get('notificacionesGruposController').load();

							return deferred.promise();
						},
						serialize: function(router, context) {
							return {notificacion: context.get('id')}
						},
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'notificacionTipoEditar');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Administrar'},
								{titulo: 'Editar Tipo de Notificación', url: '#/admin/notificaciones'},
							]);					
							App.get('menuController').seleccionar(5);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
						}
					}),
					ver: Em.Route.extend({
						route: '/:notificacion/ver',

						deserialize: function(router, params){
							
							var notificacionTipo = App.NotificacionTipo.extend(App.Savable).create({id: params.notificacion});

							var deferred = $.Deferred(),
							fn = function() {
								if (notificacionTipo.get('loaded')) {
									notificacionTipo.removeObserver('loaded', this, fn);							
									deferred.resolve(notificacionTipo);
								}
							};
							
							notificacionTipo.addObserver('loaded', this, fn);
							notificacionTipo.load();	

							return deferred.promise();
						},
						serialize: function(router, context) {
							return {notificacion: context.get('id')}
						},
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'notificacionTipoConsulta', context);
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Administrar', url: '#/admin/notificaciones'},
								{titulo: 'Tipo de Notificación', url: '#/admin/notificaciones/tipo/'+ App.get('notificacionTipoController.content.id') +'/ver'},
							]);					
							App.get('menuController').seleccionar(5);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
						},	
					}),

					crear: Em.Route.extend({
						route: '/crear',

						deserialize: function(router, params) {
							App.notificacionTipoController = App.NotificacionTipoController.create();
							 App.comisionesController = App.ComisionesController.create();
							 App.funcionesController = App.FuncionesController.create();
							 App.estructurasController = App.EstructurasController.create();
							 App.rolesController = App.RolesController.create();
							 App.notificacionesGruposController = App.NotificacionesGruposController.create();
							 App.notificacionTipoController = App.NotificacionTipoController.create();
							 

							 var deferred = $.Deferred(),
							
							 fn = function() {
							 	 if (App.get('notificacionesGruposController.loaded') && App.get('comisionesController.loaded') && App.get('funcionesController.loaded') && App.get('estructurasController.loaded') && App.get('rolesController.loaded')) {
									deferred.resolve(null);
							 	 }					
							 };

							 App.get('comisionesController').addObserver('loaded', this, fn);
							 App.get('funcionesController').addObserver('loaded', this, fn);
							 App.get('estructurasController').addObserver('loaded', this, fn);
							 App.get('rolesController').addObserver('loaded', this, fn);
							 App.get('notificacionesGruposController').addObserver('loaded', this, fn);
							 App.get('notificacionTipoController').addObserver('loaded', this, fn);

							 App.get('comisionesController').load();
							 App.get('funcionesController').load();
							 App.get('estructurasController').load();
							 App.get('rolesController').load();
							 App.get('notificacionesGruposController').load();
							
							 return deferred.promise();
						},
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'notificacionTipoCrear');

							
							App.get('breadCumbController').set('content', [
								{titulo: 'Administrar'},
								{titulo: 'Crear Tipo de Notificación', url: '#/admin/notificaciones/tipo/crear'},
							]);					
							App.get('menuController').seleccionar(5, 0, 3);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
						},								
					})
				}),
			}),
			usuariosLegisladores: Em.Route.extend({
				route: "/usuarios-legisladores",

		                deserialize: function(router, params) {
							App.firmantesarhaController = App.FirmantesarhaController.create();
							App.firmantesController = App.FirmantesController.create();

	                        var deferred = $.Deferred(),


	                        fn = function() {
	                            App.get('firmantesController').removeObserver('loaded', this, fn);	
	                            App.get('firmantesarhaController').removeObserver('loaded', this, fn);	
	                            deferred.resolve(App.get('firmantesarhaController'));					
	                        };

	                        App.get('firmantesarhaController').addObserver('loaded', this, fn);
	                        App.get('firmantesarhaController').load();

	                        App.get('firmantesController').addObserver('loaded', this, fn);
	                        App.get('firmantesController').load();

	                        return deferred.promise();
		                },	

		                connectOutlets: function(router, context) {
	                        var appController = router.get('applicationController');
	                        appController.connectOutlet('help', 'Help');	
	                        appController.connectOutlet('main', 'Firmantesarha');
	                        appController.connectOutlet('menu', 'subMenu');

	                        App.get('menuController').seleccionar(5, 0, 4);
	                        App.get('tituloController').set('titulo', App.get('menuController.titulo'));

							App.get('breadCumbController').set('content', [
								{titulo: 'Administrar'},
								{titulo: 'Usuarios y Legisladores', url: '#/admin/usuarios-legisladores'},
							]);			
		                },
			}),
		}),

		visitasGuiadas: Ember.Route.extend({
			route: '/visitas-guiadas',

				index: Ember.Route.extend({
					route: '/listado',

					deserialize: function(router, params){
						var deferred = $.Deferred();				
						
						App.visitasGuiadasController = App.VisitasGuiadasController.create();

						fn = function() {
							if(App.get('visitasGuiadasController.loaded'))
							{
								App.get('visitasGuiadasController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);
							}
						};
						
						App.get('visitasGuiadasController').addObserver('loaded', this, fn);

						App.get('visitasGuiadasController').load();	

						return deferred.promise();	
					},
					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'VisitasGuiadas');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Visitas Guiadas'},
							{titulo: 'Listado', url: '#/visitas-guiadas/listado'}
						]);					
						App.get('menuController').seleccionar(11, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),
				
				visitaConsulta: Ember.Route.extend({
					route: '/visita/:visita/ver',

					deserialize: function(router, params){
						App.visitaGuiadaConsultaController = App.VisitaGuiadaConsultaController.create();

						App.set('visitaGuiadaConsultaController.content', App.VisitaGuiada.extend(App.Savable).create({id: params.visita}));

						var deferred = $.Deferred(),

						fn = function() {
							var visita = App.get('visitaGuiadaConsultaController.content');

							if(App.get('visitaGuiadaConsultaController.loaded'))
							{							
								App.get('visitaGuiadaConsultaController').removeObserver('loaded', this, fn);
								deferred.resolve(visita);
							}
						};

						App.get('visitaGuiadaConsultaController').addObserver('loaded', this, fn);

						App.get('visitaGuiadaConsultaController').load();

						return deferred.promise();
					},
					serialize: function(router, context){
						return {visita: context.get('id')}
					},
					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'VisitaGuiadaConsulta');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Visitas Guiadas', url: '#/visitas-guiadas/listado'},
							{titulo: 'Visita', url: '#/visitas-guiada/visita/'}
						]);					
						App.get('menuController').seleccionar(11, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),
				
				estadisticas: Ember.Route.extend({
				route: '/estadisticas',

				deserialize: function(){
					var deferred = $.Deferred();				
					
					App.visitasGuiadasController = App.VisitasGuiadasController.create();
					App.visitasGuiadasEstadisticasController = App.VisitasGuiadasEstadisticasController.create();

					fn = function() {
						if(App.get('visitasGuiadasController.loaded'))
						{
							App.get('visitasGuiadasController').removeObserver('loaded', this, fn);	
							App.get('visitasGuiadasEstadisticasController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);
						}
					};
					
					App.get('visitasGuiadasController').addObserver('loaded', this, fn);
					App.get('visitasGuiadasEstadisticasController').addObserver('loaded', this, fn);

					App.get('visitasGuiadasController').load();	
					App.get('visitasGuiadasEstadisticasController').load();	

					return deferred.promise();	
				},
				connectOutlets: function(router, context){
					var appController = router.get('applicationController');
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'VisitasGuiadasEstadisticas');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Visitas Guiadas', url: '#/visitas-guiadas/listado'},
						{titulo: 'Estadisticas', url: '#/visitas-guiadas/estadisticas'}
					]);				

					App.get('menuController').seleccionar(11, 0, 1);
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
				},					
			}),
				misVisitasGuiadas: Ember.Route.extend({
					route: '/mis-visitas',

					deserialize: function(router, params){

						var deferred = $.Deferred();				
						
						App.misVisitasGuiadasController = App.MisVisitasGuiadasController.create({cuil: App.get('userController.user.cuil')});

						fn = function() {
							if(App.get('misVisitasGuiadasController.loaded'))
							{
								App.get('misVisitasGuiadasController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);
							}
						};
						
						App.get('misVisitasGuiadasController').addObserver('loaded', this, fn);

						App.get('misVisitasGuiadasController').load();	

						return deferred.promise();	
					},

					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'MisVisitasGuiadas');
						appController.connectOutlet('menu', 'subMenu');

						App.get('breadCumbController').set('content', [
							{titulo: 'Visitas Guiadas', url: ''},
							{titulo: 'Ingresadas por mi', url: ''}
						]);				

						App.get('menuController').seleccionar(11, 0, 3);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),

				miVisitaGuiada: Ember.Route.extend({
					route: '/visita/mias/:visita/ver',

					deserialize: function(router, params){
						
						App.visitaGuiadaConsultaController = App.VisitaGuiadaConsultaController.create();

						App.set('visitaGuiadaConsultaController.content', App.VisitaGuiada.extend(App.Savable).create({id: params.visita}));

						var deferred = $.Deferred(),

						fn = function() {
							var visita = App.get('visitaGuiadaConsultaController.content');

							if(App.get('visitaGuiadaConsultaController.loaded'))
							{							
								App.get('visitaGuiadaConsultaController').removeObserver('loaded', this, fn);
								deferred.resolve(visita);
							}
						};

						App.get('visitaGuiadaConsultaController').addObserver('loaded', this, fn);

						App.get('visitaGuiadaConsultaController').load();

						return deferred.promise();
						
					},

					serialize: function(router, context){
						return {visita: context.get('id')}
					},

					connectOutlets: function(router, context){

						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						if (App.get('userController').hasRole('ROLE_VISITAS_GUIADAS') || App.get('userController').hasRole('ROLE_VISITAS_GUIADAS_EDIT'))
							appController.connectOutlet('main', 'VisitaGuiadaConsulta');
						else
							appController.connectOutlet('main', 'MisVisitasGuiadasConsulta');
						appController.connectOutlet('menu', 'subMenu');

						App.get('breadCumbController').set('content', [
							{titulo: 'Visitas Guiadas', url: '#/visitas-guiadas/mias/listado'},
							{titulo: 'Ingresadas por mi', url: '#/visitas-guiadas/mias/listado'},
							{titulo: 'Visita', url: ''}
						]);					

						App.get('menuController').seleccionar(11, 0, 3);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),


			visitaCrear: Ember.Route.extend({
				route: '/visita/nueva',

				deserialize: function(router, params){
//					App.visitaGuiadaCrearController = App.VisitaGuiadaCrearController.create();
//					App.set('visitaGuiadaConsultaController.content', App.VisitaGuiada.extend(App.Savable).create({id: params.visita}));

				},
				connectOutlets: function(router, context){
					var appController = router.get('applicationController');
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'VisitaGuiadaCrear');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Visitas Guiadas', url: '#/visitas-guiadas/listado'},
						{titulo: 'Visita'},
						{titulo: 'Nueva', url: '#/visitas-guiada/visita/nueva'}
					]);					
					App.get('menuController').seleccionar(11, 0, 2);
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));
				},
			}),
				
		}),	

		informacionparlamentaria: Ember.Route.extend({
			route: '/informacionparlamentaria',
			pedidos: Ember.Route.extend({
				route: '/solicitudes',

				listado: Ember.Route.extend({
					route: '/listado',

					deserialize: function(router, params){
						var deferred = $.Deferred();				
						
						App.pedidosController = App.PedidosController.create();

						if (App.get('userController').hasRole('ROLE_IP_DEPARTAMENTO') || App.get('userController').hasRole('ROLE_IP_DEPARTAMENTO_EDIT')) {
							if (!App.get('userController').hasRole('ROLE_INFORMACION_PARLAMENTARIA_EDIT')) {
								if (App.get('userController').get('user.departamento')) {
									App.pedidosController.set('url', 'pedidos/departamento/' + App.get('userController').get('user.departamento.id'))
								}
							}
						} else {
							if (!App.get('userController').hasRole('ROLE_INFORMACION_PARLAMENTARIA_EDIT')) {
								App.pedidosController.set('url', 'pedidos/' + App.get('userController').get('user.cuil'));
							}
						}

						fn = function() {
							if(App.get('pedidosController.loaded'))
							{
								App.get('pedidosController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);
							}
						};
						
						App.get('pedidosController').addObserver('loaded', this, fn);

						App.get('pedidosController').load();	

						return deferred.promise();	
					},
					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'Pedidos');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Informacion Parlamentaria'},
							{titulo: 'Solicitudes'},
							{titulo: 'Listado', url: '#/informacionparlamentaria/solicitudes/listado'}
						]);					

						App.get('menuController').seleccionar(13, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),

				misPedidos: Ember.Route.extend({
					route: '/mis-pedidos',

					deserialize: function(router, params){
						var deferred = $.Deferred();				
						
						App.misPedidosController = App.MisPedidosController.create({cuil: App.get('userController.user.cuil')});

						fn = function() {
							if(App.get('misPedidosController.loaded'))
							{
								App.get('misPedidosController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);
							}
						};
						
						App.get('misPedidosController').addObserver('loaded', this, fn);

						App.get('misPedidosController').load();	

						return deferred.promise();	
					},

					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'MisPedidos');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Informacion Parlamentaria'},
							{titulo: 'Solicitudes'},
							{titulo: 'Ingreasadas por mi', url: '#/informacionparlamentaria/solicitudes/mis-pedidos'}
						]);					

						App.get('menuController').seleccionar(13, 0, 1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),

				miPedido: Ember.Route.extend({
					route: '/solicitud/mias/:pedido/ver',

					deserialize: function(router, params){
						App.pedidoConsultaController = App.PedidoConsultaController.create();
						App.departamentosController = App.DepartamentosController.create();
						App.departamentosController.load();

						App.set('pedidoConsultaController.content', App.Pedido.extend(App.Savable).create({id: params.pedido}));

						var deferred = $.Deferred(),

						fn = function() {
							var pedido = App.get('pedidoConsultaController.content');

							if(App.get('pedidoConsultaController.loaded'))
							{							
								App.get('pedidoConsultaController').removeObserver('loaded', this, fn);
								deferred.resolve(pedido);
							}
						};

						App.get('pedidoConsultaController').addObserver('loaded', this, fn);

						App.get('pedidoConsultaController').load();

						return deferred.promise();
					},

					serialize: function(router, context){
						return {pedido: context.get('id')}
					},

					connectOutlets: function(router, context){

						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						if (App.get('userController').hasRole('ROLE_IP_DEPARTAMENTO_EDIT') || App.get('userController').hasRole('ROLE_IP_EDITOR'))
							appController.connectOutlet('main', 'PedidoConsulta');
						else
							appController.connectOutlet('main', 'MiPedidoConsulta');
						appController.connectOutlet('menu', 'subMenu');
						

						App.get('breadCumbController').set('content', [
							{titulo: 'Informacion Parlamentaria'},
							{titulo: 'Solicitudes' , url: '#/informacionparlamentaria/solicitudes/mis-pedidos'},
							{titulo: 'Ingreasadas por mi', url: '#/informacionparlamentaria/solicitudes/mis-pedidos'}
						]);					

						App.get('menuController').seleccionar(13, 0, 1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),
				
				consulta: Ember.Route.extend({
					route: '/solicitud/:pedido/ver',

					deserialize: function(router, params){
						App.pedidoConsultaController = App.PedidoConsultaController.create();

						App.departamentosController = App.DepartamentosController.create();
						App.set('pedidoConsultaController.content', App.Pedido.extend(App.Savable).create({id: params.pedido}));

						var deferred = $.Deferred(),

						fn = function() {
							var pedido = App.get('pedidoConsultaController.content');

							if(App.get('pedidoConsultaController.loaded') && App.get('departamentosController.loaded'))
							{							
								App.get('pedidoConsultaController').removeObserver('loaded', this, fn);
								deferred.resolve(pedido);
							}
						};

						App.get('pedidoConsultaController').addObserver('loaded', this, fn);
						App.get('departamentosController').addObserver('loaded', this, fn);
						App.get('departamentosController').load();
						App.get('pedidoConsultaController').load();

						return deferred.promise();
					},

					serialize: function(router, context){
						return {pedido: context.get('id')}
					},

					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'PedidoConsulta');
						appController.connectOutlet('menu', 'subMenu');
						

						App.get('breadCumbController').set('content', [
							{titulo: 'Informacion Parlamentaria'},
							{titulo: 'Solicitudes' , url: '#/informacionparlamentaria/solicitudes/listado'},
							{titulo: 'Listado', url: '#/informacionparlamentaria/solicitudes/listado'}
						]);					

						App.get('menuController').seleccionar(13, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),
				
				crear: Ember.Route.extend({
					route: '/nueva',

					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'CrearPedido');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Informacion Parlamentaria'},
							{titulo: 'Solicitudes', url: '#/informacionparlamentaria/solicitudes/listado'},
							{titulo: 'Nueva'}
						]);	

						App.get('menuController').seleccionar(13, 0, 2);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
					},					
				}),

				estadisticas: Ember.Route.extend({
					route: '/estadisticas',

					deserialize: function(router, params){
						var deferred = $.Deferred();				
						
						App.pedidosController = App.PedidosController.create();

						fn = function() {
							if(App.get('pedidosController.loaded'))
							{
								App.get('pedidosController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);
							}
						};
						
						App.get('pedidosController').addObserver('loaded', this, fn);

						App.get('pedidosController').load();	

						return deferred.promise();	
					},

					connectOutlets: function(router, context){
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'PedidosEstadisticas');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Informacion Parlamentaria'},
							{titulo: 'Pedidos', url: '#/informacionparlamentaria/pedidos/estadisticas'},
							{titulo: 'Estadisticas'}
						]);	

						App.get('menuController').seleccionar(13, 0, 2);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
					},					
				}),				
			}),
		}),	
		expedientes: Em.Route.extend({
			route: "/expedientes",
			
			index: Em.Route.extend({
				route: '/',

				enter: function () {
					this._super();
					var appController = App.get('router.applicationController');
					appController.setLayout(3, 6, 3);
				},

				exit: function () {
					this._super();
					var appController = App.get('router.applicationController');
					appController.setLayout(3, 7, 2);							
				},

				deserialize: function(router, params) {					
					var deferred = $.Deferred();
					

					App.get('expedientesController').set('loaded', false);
					App.get('expedientesController').set('query', App.ExpedienteQuery.extend(App.Savable).create({tipo: null, comision: null, dirty: true}));

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
					App.get('searchController').load();

									
					return deferred.promise();

				},	
					
				connectOutlets: function(router, context) {
				
					var appController = router.get('applicationController');	
					appController.connectOutlet('help', 'help');
					appController.connectOutlet('main', 'expedientes');
					appController.connectOutlet('menu', 'subMenuExpedientes');

					App.get('menuController').seleccionar(1, 0, 0);
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Expedientes', url: '#/expedientes'}
					]);				
								
				},
			}),

			biografia: Ember.Route.extend({
				route: '/alerta-temprana',

				index: Em.Route.extend({	
					route : '/', 				
					enter: function () {
						App.get('ioController').joinRoom('biographys');
					},

					exit: function () {
						App.get('ioController').leaveRoom('biographys');
					},

					deserialize: function(router, params) {					
						var deferred = $.Deferred();

					 	App.tpsController = App.TPsController.create();						
						App.bloquesController = App.BloquesController.create();
						App.interBloquesController = App.InterBloquesController.create();
						App.proyectosController = App.ProyectosController.create({ content: []});

						App.get('proyectosController').set('loaded', false);
						//App.get('proyectosController').set('query', App.ExpedienteQuery.extend(App.Savable).create({tipo: null, comision: null, dirty: true}));
						App.get('proyectosController').set('query', App.ProyectoQuery.extend(App.Savable).create({tipo: null, comision: null, dirty: true}));
						fn = function() {
							if (App.get('proyectosController.loaded') && App.get('bloquesController.loaded') && App.get('interBloquesController.loaded') && App.get('tpsController.loaded'))
							{
								App.get('proyectosController').removeObserver('loaded', this, fn);	
								App.get('bloquesController').removeObserver('loaded', this, fn);	
								App.get('tpsController').removeObserver('loaded', this, fn);	
								deferred.resolve(null);					
							}
						};

						App.get('proyectosController').addObserver('loaded', this, fn);
						App.get('bloquesController').addObserver('loaded', this, fn);
						App.get('interBloquesController').addObserver('loaded', this, fn);
						App.get('tpsController').addObserver('loaded', this, fn);

						App.get('proyectosController').load();
						App.get('bloquesController').load();
						App.get('interBloquesController').load();
						App.get('tpsController').load();

										
						return deferred.promise();

					},	
						

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'ExpedientesBiography');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Alerta Temprana', url: '#/expedientes/alerta-temprana'}
						]);					
						App.get('menuController').seleccionar(10, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),

				expedienteConsulta: Ember.Route.extend({
					route: '/expediente/:expediente/ver',

					deserialize: function(router, params) {
						//App.proyectoConsultaController = App.ProyectoConsultaController.create();
						App.set('expedienteConsultaController.content', App.Expediente.create({id: params.expediente}));
						App.bloquesController = App.BloquesController.create();
						App.interBloquesController = App.InterBloquesController.create();
						
						var deferred = $.Deferred(),
						fn = function() {
							if (App.get('expedienteConsultaController.loaded')) {
								var expediente = App.get('expedienteConsultaController.content');
								deferred.resolve(expediente);
								App.get('expedienteConsultaController').removeObserver('loaded', this, fn);							
							}
						};

						
						App.set('expedienteConsultaController.url', 'ME/exp/proyecto/%@');
						App.get('expedienteConsultaController').addObserver('loaded', this, fn);
						App.get('expedienteConsultaController').load();		
						App.set('expedienteConsultaController.url', 'exp/proyecto/%@');


						App.get('bloquesController').addObserver('loaded', this, fn);
						App.get('interBloquesController').addObserver('loaded', this, fn);

						App.get('bloquesController').load();
						App.get('interBloquesController').load();

						return deferred.promise();
					},

					serialize: function(router, context) {
						var expedienteId = context.get('id');
						return {expediente: expedienteId}
					},

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'expedienteConsulta');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Expedientes', url: '#/expedientes'},
							{titulo: App.get('expedienteConsultaController.content').get('expdip')}
						]);					

						App.get('breadCumbController').set('content', [
							{titulo: 'Alerta Temprana', url: '#/expedientes/alerta-temprana'},
							{titulo: App.get('expedienteConsultaController.content').get('expdip')}
						]);					
						App.get('menuController').seleccionar(10, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));					
					},
				}),
			}),

			expedienteConsulta: Ember.Route.extend({

				route: '/expediente',

				indexSubRoute: Ember.Route.extend({
					route: '/:expediente/ver',

					deserialize: function(router, params) {
						App.set('expedienteConsultaController.content', App.Expediente.create({id: params.expediente}));
						App.bloquesController = App.BloquesController.create();
						App.interBloquesController = App.InterBloquesController.create();
						
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



						App.get('bloquesController').addObserver('loaded', this, fn);
						App.get('interBloquesController').addObserver('loaded', this, fn);

						App.get('bloquesController').load();
						App.get('interBloquesController').load();

						return deferred.promise();
					},

					serialize: function(router, context) {
						// console.log('serialize');
						var expedienteId = context.get('id');
						return {expediente: expedienteId}
					},

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'expedienteConsulta');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Expedientes', url: '#/expedientes'},
							{titulo: App.get('expedienteConsultaController.content').get('expdip')}
						]);					
						App.get('menuController').seleccionar(1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));					
					},
				}),
			}),			
		}),
/*
		enviosArchivados: Em.Route.extend({
			route: "/envios",

				index: Em.Route.extend({
					route: '/',

	                deserialize: function(router, params) {
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
	                        appController.connectOutlet('help', 'Help');	
	                        appController.connectOutlet('main', 'enviosArchivados');
	                        appController.connectOutlet('menu', 'subMenu');

	                        App.get('menuController').seleccionar(6, 0, 0);
	                        App.get('tituloController').set('titulo', App.get('menuController.titulo'));

	                        App.get('breadCumbController').set('content', [
                                {titulo: 'Envíos a Archivo', url: '#/envios'},
	                        ]);				
	                },
	        	}),

				enviosArchivadosConsulta: Ember.Route.extend({
					route: '/envio',

					verEnvio: Ember.Route.extend({				
						route: '/:envio/ver',

						deserialize: function(router, params) {
						// if (!App.get('envioArchivoConsultaController'))
						//  	App.envioArchivoConsultaController = App.EnvioArchivoConsultaController.create();
						// App.set('envioArchivoConsultaController.loaded', false);

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
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'expedientesEnvioConsulta');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Envíos a Archivo', url: '#/envios'},
								{titulo: 'Envío del ' + moment(App.get('envioArchivoConsultaController.content.fecha'), 'YYYY-MM-DD').format('LL'), url: '#/envios/envio/'+App.get('envioArchivoConsultaController.content').get('id')+'/ver'}
							]);
							App.get('menuController').seleccionar(6);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));					
						},
					}),

					crear: Em.Route.extend({
						route: "/crear",
		                connectOutlets: function(router, context) {
		 					App.expedientesArchivablesController = App.ExpedientesArchivablesController.create();

		                    var appController = router.get('applicationController');	
		                    appController.connectOutlet('help', 'Help');
		                    appController.connectOutlet('main', 'expedientesArchivados');
		                    appController.connectOutlet('menu', 'subMenu');

		                    App.get('menuController').seleccionar(6, 0, 1);
		                    App.get('tituloController').set('titulo', App.get('menuController.titulo'));

		                    App.get('breadCumbController').set('content', [
		                        {titulo: 'Envíos a Archivo', url: '#/envios'},
		                        {titulo: 'Crear Envío a Archivo', url: '#/envios/envio/crear'},
		                    ]);	
		                    			
		                },
					}),
				}),

		}), 
*/                        
		comisiones: Em.Route.extend({
			route: "/comisiones",

			ver: Ember.Route.extend({
				route: '/comision/:id/ver',

				deserialize: function(router, params) {

					var comision = App.ComisionListado.extend(App.Savable).create({id: params.id})
					comision.set('loaded', false);
					 var deferred = $.Deferred(),
					 fn = function() {
						comision.removeObserver('loaded', this, fn);
						deferred.resolve(comision);				
					 };

					 comision.addObserver('loaded', this, fn);
					 comision.load();
					
					 return deferred.promise();
				},	

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('menu', 'subMenu');
					appController.connectOutlet('main', 'comisionesConsulta', context);

					App.get('breadCumbController').set('content', [
						{titulo: 'Comisiones'},
						{titulo: 'Listado', url: '#/comisiones/listado'},
						{titulo: 'Ver'},
					]);		

					App.get('menuController').seleccionar(2, 4, 0);	
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
				},
			}),	

	        listado: Ember.Route.extend({
				route: '/listado',
				deserialize: function(router, params){
					var deferred = $.Deferred();				
					
					App.comisionesListadoController = App.ComisionesListadoController.create();

					fn = function() {
						if(App.get('comisionesListadoController.loaded'))
						{
							App.get('comisionesListadoController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);
						}
					};
					
					App.get('comisionesListadoController').addObserver('loaded', this, fn);

					App.get('comisionesListadoController').load();	

					return deferred.promise();	
				},
				connectOutlets: function(router, context){
					var appController = router.get('applicationController');
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'ComisionesListado');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Comisiones'},
						{titulo: 'Listado', url: '#/comisiones/listado'}
					]);					
					App.get('menuController').seleccionar(2, 4, 0);
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));
				},
			}),			
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
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'Dictamenes');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Dictámenes', url: '#/comisiones/dictamenes/dictamenes'},
							{titulo: 'Dictámenes'},
						]);					
						App.get('menuController').seleccionar(2, 2, 1);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));					
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
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'dictamenesPendientes');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Dictámenes', url: '#/comisiones/dictamenes/pendientes'},
							{titulo: 'Pendientes'},
						]);					

						App.get('menuController').seleccionar(2, 2, 0);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},						
				}),

                crear: Em.Route.extend({
                    route: '/crear',

                    deserialize: function(router, params) {

                        App.dictamenCrearController = App.DictamenCrearController.create();

                        App.get('dictamenCrearController').set('content', App.Dictamen.create());
                     

                        App.expedientesArchivablesController = App.ExpedientesArchivablesController.create();
                        
                        App.firmantesController = App.FirmantesController.create();

                        
                        var deferred = $.Deferred();

                        cargarFirmantesSuccess = function () {
                                if (App.get('firmantesController.loaded')) {
                                        var dictamen = App.get('dictamenCrearController.content');	
                                        deferred.resolve(dictamen);
                                }
                        }

                        cargarDictamenSuccess = function () {
                                if (App.get('dictamenCrearController.loaded')) {
                                        App.get('firmantesController').addObserver('loaded', this, cargarFirmantesSuccess);
                                        App.get('firmantesController').load();			
                                }
                        }

                        App.get('dictamenCrearController').addObserver('loaded', this, cargarDictamenSuccess);
                        App.get('dictamenCrearController').load();

                        return deferred.promise();
                     },

                    connectOutlets: function(router, context) {
                            var appController = router.get('applicationController');

                            // App.get('dictamenCrearController').set('content', App.Dictamen.create());
							App.set('dictamenCrearController.content', App.Dictamen.extend(App.Savable).create({proyectos: [], proyectosVistos: [], textos: []}));
                            
                            appController.connectOutlet('help', 'Help');
                            appController.connectOutlet('main', 'crearDictamen');
                            appController.connectOutlet('menu', 'subMenu');

                            App.get('breadCumbController').set('content', [
                                    {titulo: 'Dictámenes', url: '#/comisiones/dictamenes/pendientes'},
                                    {titulo: 'Crear Dictamen' }
                            ]);							

                            App.get('menuController').seleccionar(2, 2, 2);		
                            App.get('tituloController').set('titulo', App.get('menuController.titulo'));			
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
							appController.connectOutlet('help', 'Help');
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
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));			
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
								if (App.get('dictamenController.loaded')) {
									var dictamen = App.get('dictamenController.content');

									App.get('reunionConsultaController').set('content', App.Reunion.create({id: dictamen.get('id_reunion')}));
									App.get('reunionConsultaController').addObserver('loaded', this, cargarReunionSuccess);
									App.get('reunionConsultaController').load();	
								}
							}

	 						App.get('dictamenController').addObserver('loaded', this, cargarDictamenSuccess);
							//App.get('expedientesArchivablesController').addObserver('loaded', this, cargarDictamenSuccess);
							App.get('dictamenController').load();
							//App.get('expedientesArchivablesController').load();
							return deferred.promise();
						},

						serialize: function(router, context) {
							return {dictamen: context.get('id')};		
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'cargarDictamen');
							appController.connectOutlet('menu', 'subMenu');

							App.get('breadCumbController').set('content', [
								{titulo: 'Dictámenes', url: '#/comisiones/dictamenes/pendientes'},
								{titulo: 'Pendientes', url: '#/comisiones/dictamenes/pendientes'},
								{titulo: 'Cargar Dictamen' }
							]);							
							
							App.get('menuController').seleccionar(2);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
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
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},						
					}),			
					*/	
					editarParte: Ember.Route.extend({
						route: '/editar',
						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'crearParte');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
								{titulo: 'Reunión'},
								{titulo: moment(App.get('reunionConsultaController.content').get('fecha'), 'YYYY-MM-DD HH:ss').format('LLL')},
								{titulo: 'Editar Parte' }
							]);
							
							App.get('menuController').seleccionar(2);		
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
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
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'reunionesSinParte');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
							{titulo: 'sin Parte'},
						]);					
						App.get('menuController').seleccionar(2, 1, 0);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
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
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'reunionesConParte');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Reuniones', url: '#/comisiones/reuniones'},
							{titulo: 'con Parte'},
						]);					
						App.get('menuController').seleccionar(2, 1, 1);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));						
					},						
				}),				
				
				reunionesConsulta: Ember.Route.extend({
					route: '/reunion',
						
					verReunion: Ember.Route.extend({
						route: '/:reunion/ver',

						deserialize: function(router, params) {
							if (!App.get('expedientesArchivablesController'))
						 		App.expedientesArchivablesController = App.ExpedientesArchivablesController.create({content: []});


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
										if(tema)
										{
											temas.addObject(App.CitacionTema.create(tema));
										}
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
							appController.connectOutlet('help', 'Help');
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
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
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
											if(tema)
											{
												temas.addObject(App.CitacionTema.create(tema));											
											}
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
								appController.connectOutlet('help', 'Help');
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
								App.get('tituloController').set('titulo', App.get('menuController.titulo'));			
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
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('main', 'citaciones');
						appController.connectOutlet('menu', 'subMenu');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Citaciones', url: '#/comisiones/citaciones'},
							{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'}
						]);					
						App.get('menuController').seleccionar(2, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},					
				}),

				citacionesConsulta: Ember.Route.extend({
					route: '/citacion',
					
					crearCitacion: Ember.Route.extend({
						route: '/crear',
						deserialize: function(router, params) {
							if (!App.get('expedientesArchivablesController'))
						 		App.expedientesArchivablesController = App.ExpedientesArchivablesController.create({content: []});

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
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'citacionCrear');
							appController.connectOutlet('menu', 'subMenu');
							
							App.set('citacionCrearController.isEdit', false);
							App.get('menuController').seleccionar(2, 0, 1);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
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
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'citacionConsulta');
							appController.connectOutlet('menu', 'subMenu');

							App.get('citacionCrearController').set('content', null);
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
								{titulo: 'Citación'},
								{titulo: moment(App.get('citacionConsultaController.content').get('start'), 'YYYY-MM-DD HH:mm').format('LLL') + ' - Sala ' + App.get('citacionConsultaController.content.sala.numero')},
							]);					
							App.get('menuController').seleccionar(2);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));					
						},
					}),	
					
					editarCitacion: Ember.Route.extend({
						route: '/:citacion/editar',
						
						deserialize: function(router, params) {
							if (!App.get('expedientesArchivablesController'))
						 		App.expedientesArchivablesController = App.ExpedientesArchivablesController.create({content: []});

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
										//t.set('proyectos', mapObjectsInArrays(App.get('citacionCrearController.expedientes'), t.get('proyectos')));
										var proyectos = [];
										t.get('proyectos').forEach(function (p) {
											var proyecto = App.Expediente.create(p);
											if (t.get('grupo')) {
												proyecto.tema = t.get('descripcion');
											}
											proyectos.addObject(proyecto);
										});									
										t.set('proyectos', proyectos)
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
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('main', 'citacionCrear');
							appController.connectOutlet('menu', 'subMenu');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
								{titulo: 'Citación'},
								{titulo: moment(App.get('citacionConsultaController.content').get('start'), 'YYYY-MM-DD HH:mm').format('LLL') + ' - Sala ' + App.get('citacionConsultaController.content.sala.numero'), url: '#/comisiones/citaciones/citacion/' + App.get('citacionConsultaController.content').get('id') + '/ver'},
								{titulo: 'Editar'}
							]);						
							App.get('menuController').seleccionar(2);		
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));			
						},
						
					}),	
				}),				
			}),

			enviosArchivados: Em.Route.extend({
				route: "/envios",

					index: Em.Route.extend({
						route: '/',

		                deserialize: function(router, params) {
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
		                        appController.connectOutlet('help', 'Help');	
		                        appController.connectOutlet('main', 'enviosArchivados');
		                        appController.connectOutlet('menu', 'subMenu');

		                        App.get('menuController').seleccionar(2, 5, 0);
		                        App.get('tituloController').set('titulo', App.get('menuController.titulo'));

		                        App.get('breadCumbController').set('content', [
									{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
	                                {titulo: 'Envíos a Archivo', url: '#/comisiones/envios'},
		                        ]);				
		                },
		        	}),

					enviosArchivadosConsulta: Ember.Route.extend({
						route: '/envio',

						verEnvio: Ember.Route.extend({				
							route: '/:envio/ver',

							deserialize: function(router, params) {
							// if (!App.get('envioArchivoConsultaController'))
							//  	App.envioArchivoConsultaController = App.EnvioArchivoConsultaController.create();
							// App.set('envioArchivoConsultaController.loaded', false);

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
								appController.connectOutlet('help', 'Help');
								appController.connectOutlet('main', 'expedientesEnvioConsulta');
								appController.connectOutlet('menu', 'subMenu');
								
								App.get('breadCumbController').set('content', [
									{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
									{titulo: 'Envíos a Archivo', url: '#/comisiones/envios'},
									{titulo: 'Envío del ' + moment(App.get('envioArchivoConsultaController.content.fecha'), 'YYYY-MM-DD').format('LL'), url: '#/envios/envio/'+App.get('envioArchivoConsultaController.content').get('id')+'/ver'}
								]);
		                        App.get('menuController').seleccionar(2, 5, 0);
								App.get('tituloController').set('titulo', App.get('menuController.titulo'));					
							},
						}),

						crear: Em.Route.extend({
							route: "/crear",
			                connectOutlets: function(router, context) {
			 					App.expedientesArchivablesController = App.ExpedientesArchivablesController.create();

			                    var appController = router.get('applicationController');	
			                    appController.connectOutlet('help', 'Help');
			                    appController.connectOutlet('main', 'expedientesArchivados');
			                    appController.connectOutlet('menu', 'subMenu');

		                        App.get('menuController').seleccionar(2, 5, 1);
			                    App.get('tituloController').set('titulo', App.get('menuController.titulo'));

			                    App.get('breadCumbController').set('content', [
									{titulo: 'Agenda de Comisiones', url: '#/comisiones/citaciones'},
				                        {titulo: 'Envíos a Archivo', url: '#/comisiones/envios'},
			                        {titulo: 'Crear Envío a Archivo', url: '#/comisiones/envios/envio/crear'},
			                    ]);	
			                    			
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
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('main', 'DictamenesSinOrdenDelDia');
					appController.connectOutlet('menu', 'subMenu');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Orden del Día', url: '#/comisiones/OD/dictamenes'},
						{titulo: 'Dictámenes sin OD'},
					]);					
					App.get('menuController').seleccionar(8, 0, 1);	
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
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
					appController.connectOutlet('help', 'Help');
					appController.connectOutlet('menu', 'subMenu');					
					appController.connectOutlet('main', 'OrdenesDelDiaList');
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Orden del Día', url: '#/OD/listado'},
						{titulo: 'Listado de OD'},
					]);			

					App.get('menuController').seleccionar(8, 0, 0);	
					App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
				},						
			}),	

			ordenDelDia: Em.Route.extend({ 
				route: '/orden',

				crear: Ember.Route.extend({
					route: '/:id/crear',

					deserialize: function(router, params) {

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
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'OrdenDelDiaCrear');
						
						App.get('menuController').seleccionar(8);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						App.get('breadCumbController').set('content', [
							{titulo: 'Orden del Día', url: '#/OD/listado'},
							{titulo: 'Crear'},
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
							appController.connectOutlet('help', 'Help');
							appController.connectOutlet('menu', 'subMenu');
							appController.connectOutlet('main', 'ordenDelDiaDetalle');
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Orden del Día', url: '#/OD/listado'},
								{titulo: 'Número '+ App.get('ordenDelDiaController.content').get('numero')},
								{titulo: moment(App.get('ordenDelDiaController.content').get('fechaImpresion'), 'YYYY-MM-DD').format('LL')},
							]);				

							App.get('menuController').seleccionar(8);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},
					}),	
				}),							
			}),
		}),
/*
		recinto: Em.Route.extend({
			route: "/recinto",
			
			index: Em.Route.extend({
				route: "/",		
			}),
				
			oradores: Em.Route.extend({
				route: "/oradores",
				
				index: Em.Route.extend({
					route: '/',
					
					enter: function () {
						App.get('ioController').joinRoom('oradores');
						App.get('menuController').seleccionar(3);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},

					exit: function () {
						App.get('ioController').leaveRoom('oradores');
					},

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');

						appController.connectOutlet('main', 'OradoresIndex');
						
						appController.connectOutlet('menu', 'SubMenu');
						
						App.get('temaController').set('content', null);						
						appController.cargarSesiones(true);


						App.get('breadCumbController').set('content', [
							{titulo: 'Recinto', url: '#/recinto/oradores'},	
							{titulo: 'Oradores', url: '#/recinto/oradores'},	
						]);					
						App.get('menuController').seleccionar(3, 0, 0);
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));
					},
				}),
				
				sesionConsulta: Ember.Route.extend({

					route: '/sesion',

					indexSubRoute: Ember.Route.extend({
						route: '/:sesion/ver',

						enter: function () {
							App.get('ioController').joinRoom('oradores');
							App.get('menuController').seleccionar(3);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						},

						exit: function () {
							App.get('ioController').leaveRoom('oradores');
						},

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
							App.get('diputadosController').load();

							return deferred.promise();
						},

						serialize: function(router, context) {
							var sesionId = context.get('id');
							return {sesion: sesionId}
						},

						connectOutlets: function(router, context) {

							var sesion = App.get('sesionesController.content').findProperty('id', parseInt(context.get('id')));

							if (!App.get('planDeLaborController')) {
								App.planDeLaborController = App.PlanDeLaborController.create();
							}
							
							if (!App.get('diputadosController.loaded')) {
								App.get('diputadosController').load();
							}

							App.set('planDeLaborController.content', App.PlanDeLabor.create({id: context.get('idPl')}));
							App.get('planDeLaborController').load();							
														
							var appController = router.get('applicationController');
							
							if (hasRole('ROLE_LABOR_PARLAMENTARIA')) {
								//appController.connectOutlet('menu', 'subMenu');
								if (hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT')) {
									appController.connectOutlet('main', 'oradoresEditorSesionConsulta');
									//appController.connectOutlet('help', 'crearTurnoInline');
								}
							 	else
									appController.connectOutlet('main', 'sesionConsulta');
							}
							else 
							{
								appController.connectOutlet('main', 'OradoresDiputadoSesionConsulta');
							}
							
							appController.connectOutlet('menu', 'subMenuOradores');
							

							App.get('sesionController').set('content', context);
							App.get('temasController').set('url', 'sesion/%@/temas'.fmt(encodeURIComponent(context.get('id'))));
							App.get('temasController').load();
							
							//appController.cargarSesiones(true);
							
							var sesion = App.get('sesionController.content');
							App.get('breadCumbController').set('content', [
								{titulo: 'Oradores', url: '#/recinto/oradores'},	
								{titulo: 'Sesión ' + sesion.get('sesion') +' / Reunión: ' + sesion.get('reunion')}
							]);					
							App.get('menuController').seleccionar(3);	
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						},
					}),
					
					tema: Em.Route.extend({
						route: "/:sesion/tema/:tema",

						enter: function () {
							this._super();
							App.get('ioController').joinRoom('oradores');
							var appController = App.get('router.applicationController');
							appController.setLayout(3, 6, 3);
							App.get('menuController').seleccionar(3);
							App.get('tituloController').set('titulo', App.get('menuController.titulo'));
						},

						exit: function () {
							this._super();
							App.get('ioController').leaveRoom('oradores');
							var appController = App.get('router.applicationController');
							appController.setLayout(3, 7, 2);							
						},
						
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
								if (App.get('sesionesController.loaded') && App.get('diputadosController.loaded')) {
									sesion = App.get('sesionesController.content').findProperty('id', parseInt(params.sesion))
									App.get('sesionController').set('content', sesion);
									
									App.get('temasController').set('url', 'sesion/%@/temas'.fmt(encodeURIComponent(params.sesion)));
									App.get('temasController').addObserver('loaded', this, fnTema);
									App.get('temasController').load();

									App.get('turnosController').set('url', 'sesion/%@/turnos'.fmt(encodeURIComponent(params.sesion)));
									App.get('turnosController').addObserver('loaded', this, fnTema);
									App.get('turnosController').load();		
									
									App.set('planDeLaborController.content', App.PlanDeLabor.create({id: sesion.get('idPl')}));
									App.get('planDeLaborController').addObserver('loaded', this, fnTema);
									App.get('planDeLaborController').load();
									
									App.get('sesionesController').removeObserver('loaded', this, fnSesion);
									
								}
							}


							App.get('sesionesController').addObserver('loaded', this, fnSesion);
							App.get('diputadosController').addObserver('loaded', this, fnSesion);
							
							App.get('sesionesController').load();
							App.get('diputadosController').load();

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
								App.get('turnosController').set('url', 'sesion/%@/turnos'.fmt(encodeURIComponent(context.get('sesionId'))));
								App.get('turnosController').load();
							}

							if (!App.get('diputadosController.loaded')) {
								App.get('diputadosController').load();
							}

							App.get('temaController').set('content', context);

							var appController = router.get('applicationController');

							var tema = App.get('temaController.content');
							

							if (hasRole('ROLE_LABOR_PARLAMENTARIA')) {
								//appController.connectOutlet('menu', 'subMenu');
								if (hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT')) {
									appController.connectOutlet('help', 'crearTurnoInline');
									appController.connectOutlet('main', 'oradoresEditorSesionConsulta');
								}
							 	else
									appController.connectOutlet('main', 'sesionConsulta');
							}
							else {
								
								appController.connectOutlet('main', 'OradoresDiputadoSesionConsulta');
							}							
							
							appController.connectOutlet('sesion', 'sesionTurnos');
							appController.connectOutlet('menu', 'subMenuOradores');

							//appController.cargarSesiones(true);
							
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Recinto', url: '#/recinto/oradores'},	
								{titulo: 'Oradores', url: '#/recinto/oradores'},	
								{titulo: 'Sesión ' + sesion.get('sesion') +' / Reunión: ' + sesion.get('reunion'), url: '#/recinto/oradores/sesion/' +sesion.get('id') + '/ver'},
								{titulo: tema.get('titulo')}
							]);					
						},
					}),
				}),					
			}),
		}),	
*/
		publicaciones: Em.Route.extend({
			route: "/publicaciones",

			tp: Em.Route.extend({
				route: "/TP",

				listado: Ember.Route.extend({
					route: "/listado",
					
					deserialize: function(router, params) {
						 if (!App.get('tpsController'))
						 	App.tpsController = App.TPsController.create();

						 var deferred = $.Deferred(),
						 fn = function() {
							 App.get('tpsController').removeObserver('loaded', this, fn);	
							deferred.resolve(null);					
						 };

						 App.get('tpsController').addObserver('loaded', this, fn);
						 App.get('tpsController').load();
						
						 return deferred.promise();
					},
					
					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');					
						appController.connectOutlet('main', 'TPs');
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Publicaciones'},
							{titulo: 'Trámite Parlamentario', url: '#/publicaciones/TP/listado'},
							{titulo: 'Listado'},
						]);			

						App.get('menuController').seleccionar(12, 0, 0);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},						
				}),	

				crear: Ember.Route.extend({
					route: '/crear',
					model: null,


					connectOutlets: function(router, context) {		
						var tp = App.TP.extend(App.Savable).create();				
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'tPCrear', tp);
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Publicaciones'},
							{titulo: 'Trámite Parlamentario', url: '#/publicaciones/TP/listado'},
							{titulo: 'Crear'},
						]);			

						App.get('menuController').seleccionar(12, 0, 1);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
						
					},				
				}),		
				ver: Ember.Route.extend({
					route: '/:id/ver',

					deserialize: function(router, params) {

						var tp = App.TP.extend(App.Savable).create({id: params.id})
						tp.set('loaded', false);
						 var deferred = $.Deferred(),
						 fn = function() {
							tp.removeObserver('loaded', this, fn);
							deferred.resolve(tp);				
						 };

						 tp.addObserver('loaded', this, fn);
						 tp.load();
						
						 return deferred.promise();
					},	

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'tPConsulta', context);

						App.get('breadCumbController').set('content', [
							{titulo: 'Publicaciones'},
							{titulo: 'Trámite Parlamentario'},
							{titulo: moment(context.get('fecha'), 'YYYY-MM-DD').format('LL') + ' - N° ' + context.get('numero')},
							{titulo: 'Ver'},
						]);		

						App.get('menuController').seleccionar(12, 0, 0);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},
				}),	

				editar: Ember.Route.extend({
					route: '/:id/editar',

					deserialize: function(router, params) {

						var tp = App.TP.extend(App.Savable).create({id: params.id})
						tp.set('loaded', false);
						 var deferred = $.Deferred(),
						 fn = function() {
							tp.removeObserver('loaded', this, fn);
							deferred.resolve(tp);				
						 };

						 tp.addObserver('loaded', this, fn);
						 tp.load();
						
						 return deferred.promise();
					},	

					connectOutlets: function(router, context) {
						var appController = router.get('applicationController');
						appController.connectOutlet('help', 'Help');
						appController.connectOutlet('menu', 'subMenu');
						appController.connectOutlet('main', 'tPEditar', context);

						App.get('breadCumbController').set('content', [
							{titulo: 'Publicaciones'},
							{titulo: 'Trámite Parlamentario'},
							{titulo: moment(context.get('fecha'), 'YYYY-MM-DD').format('LL') + ' - N° ' + context.get('numero')},
							{titulo: 'Editar'},
						]);		

						App.get('menuController').seleccionar(12, 0, 0);	
						App.get('tituloController').set('titulo', App.get('menuController.titulo'));				
					},
				}),	

			}),
		}),        
	}),	
});