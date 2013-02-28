App.Router =  Em.Router.extend({
	enableLogging: true,
	location: 'hash',
	verSesion: Em.Router.transitionTo('recinto.oradores.sesionConsulta.indexSubRoute'),
	mostrarTurnos: Em.Router.transitionTo('recinto.oradores.sesionConsulta.tema'),
	
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
		index: Em.Route.extend({
			route: "/",
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('main', 'inicio');
				
				App.get('menuController').seleccionar(0);
				App.get('breadCumbController').set('content', [
					{titulo: 'Inicio', url: '#/'}
				]);				
			},		
		}),
		
		expedientes: Em.Route.extend({
			route: "/expedientes",
			
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
				
				return deferred.promise();
			},	
				
			connectOutlets: function(router, context) {
			
				var appController = router.get('applicationController');	
				appController.connectOutlet('main', 'expedientes');

				App.get('menuController').seleccionar(1);
				
				App.get('breadCumbController').set('content', [
					{titulo: 'Expedientes', url: '#/expedientes'}
				]);				
							
			},
		}),
		
		comisiones: Em.Route.extend({
			route: "/comisiones",
			
			index: Ember.Route.extend({
				route: "/",
				
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
						
						App.get('breadCumbController').set('content', [
							{titulo: 'Agenda de comisiones', url: '#/comisiones/citaciones'}
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
								
							};
							fn2 = function() {
								App.get('comisionesController').removeObserver('loaded', this, fn2);
								App.set('citacionConsultaController.isEdit', false);
								deferred.resolve(null);	
							}

							App.get('citacionSalasController').addObserver('loaded', this, fn);
							App.get('citacionSalasController').load();
							
							return deferred.promise();
						},
						
						connectOutlets: function(router, context) {							
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'citacionCrear');
							
							App.get('menuController').seleccionar(2);
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de comisiones', url: '#/comisiones/citaciones'},
								{titulo: 'Nueva'},
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
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de comisiones', url: '#/comisiones/citaciones'},
								{titulo: App.get('citacionConsultaController.content').get('start')},
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
											proyecto.set('tema', t.get('descripcion'));
										});									
									});
									
									citacion.set('estado', App.CitacionEstado.create(citacion.get('estado')));
									
									App.get('citacionConsultaController.content').set('temas', temas);
									
									App.set('citacionConsultaController.isEdit', true);
									
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
							
							App.get('breadCumbController').set('content', [
								{titulo: 'Agenda de comisiones', url: '#/comisiones/citaciones'},
								{titulo: App.get('citacionConsultaController.content').get('start'), url: '#/comisiones/citaciones/citacion/' + App.get('citacionConsultaController.content').get('id') + '/ver'},
								{titulo: 'editar'}
							]);						
							App.get('menuController').seleccionar(2);					
						},
						
					}),	
				}),				
			}),
		}),
		
		
		expedienteConsulta: Ember.Route.extend({

			route: '/expedientes/expediente',

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
					
					App.get('breadCumbController').set('content', [
						{titulo: 'Expedientes', url: '#/expedientes'},
						{titulo: App.get('expedienteConsultaController.content').get('titulo')}
					]);					
					App.get('menuController').seleccionar(1);					
				},
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
						appController.connectOutlet('main', 'OradoresIndex');

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
							if(App.get('sesionesController.loaded')){
								return App.get('sesionesController.content').findProperty('id', parseInt(params.sesion));
							}else{
								var deferred = $.Deferred(),
								fn = function() {
									var sesion = App.get('sesionesController.content').findProperty('id', parseInt(params.sesion))
									deferred.resolve(sesion);
									App.get('sesionesController').removeObserver('loaded', this, fn);
								};

								App.get('sesionesController').addObserver('loaded', this, fn);
								App.get('sesionesController').load();
								return deferred.promise();
							}
						},

						serialize: function(router, context) {
							var sesionId = context.get('id');
							return {sesion: sesionId}
						},

						connectOutlets: function(router, context) {
							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'sesionConsulta');

							App.get('sesionController').set('content', context);
							App.get('temasController').set('url', '/sesion/%@/temas'.fmt(encodeURIComponent(context.get('id'))));
							App.get('temasController').load();
							
							appController.cargarSesiones(true);
							
							var sesion = App.get('sesionController.content');
							App.get('breadCumbController').set('content', [
								{titulo: 'Oradores', url: '#/recinto/oradores'},	
								{titulo: 'sesion ' + sesion.get('sesion') +' / Reunion: ' + sesion.get('reunion')}
							]);					
							App.get('menuController').seleccionar(3);					
						},
					}),
					
					tema: Em.Route.extend({
						route: "/:sesion/tema/:tema",

						deserialize: function(router, params) {
							var usePromise = false;

							if((App.get('sesionController.content.id') == params.sesion || App.get('sesionesController.loaded')) && App.get('temasController.loaded')){
								return App.get('temasController.content').findProperty('id', parseInt(params.tema))
							}else{
								usePromise = true;
							}

							if(usePromise){
								deferred = $.Deferred();

								var tema, sesion,
								fnTema = function() {
									tema = App.get('temasController.content').findProperty('id', parseInt(params.tema))
									if(tema){
										deferred.resolve(tema);
									}
									App.get('temasController').removeObserver('loaded', this, fnTema);
								},

								fnSesion = function() {
									sesion = App.get('sesionesController.content').findProperty('id', parseInt(params.sesion))
									App.get('sesionController').set('content', sesion);
									
									App.get('temasController').set('url', '/sesion/%@/temas'.fmt(encodeURIComponent(params.sesion)));
									App.get('temasController').addObserver('loaded', this, fnTema);
									App.get('temasController').load();

									App.get('sesionesController').removeObserver('loaded', this, fnSesion);
								}

								App.get('sesionesController').addObserver('loaded', this, fnSesion);
								
								App.get('sesionesController').load();

								return deferred.promise();
							}
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
							App.get('sesionController').set('content', App.get('sesionesController.content').findProperty('id', parseInt(context.get('sesionId'))));

							if(App.get('temaController.content.sesionId') != context.get('sesionId')){
								App.get('turnosController').set('url', '/sesion/%@/turnos'.fmt(encodeURIComponent(context.get('sesionId'))));
								App.get('turnosController').load();
							}

							App.get('temaController').set('content', context);

							var appController = router.get('applicationController');
							appController.connectOutlet('main', 'sesionConsulta');
							appController.connectOutlet('sesion', 'sesionTurnos');

							appController.cargarSesiones(true);
							
							var sesion = App.get('sesionController.content');
							var tema = App.get('temaController.content');
							App.get('breadCumbController').set('content', [
								{titulo: 'Oradores', url: '#/recinto/oradores'},	
								{titulo: 'sesion ' + sesion.get('sesion') +' / Reunion: ' + sesion.get('reunion'), url: '#/recinto/oradores/sesion/' +sesion.get('id') + '/ver'},
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