App.Router =  Em.Router.extend({
	enableLogging: true,
	location: 'hash',
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
			},		
		}),
		
		expedientes: Em.Route.extend({
			route: "/expedientes",
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('main', 'expedientes');
				appController.cargarExpedientes();
			},
		}),
		
		citaciones: Em.Route.extend({
			route: "/citaciones",
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('main', 'citaciones');
				appController.cargarCitaciones();
			},			
		}),

		citacionesConsulta: Ember.Route.extend({
			route: '/citacion',
			
			indexSubRoute: Ember.Route.extend({
				route: '/:citacion/ver',

				deserialize: function(router, params) {
					App.set('citacionConsultaController.content', App.Citacion.create({id: params.citacion}));
					if(App.get('citacionConsultaController.loaded')){
						return App.get('citacionConsultaController.content');
					}else{
						var deferred = $.Deferred(),
						fn = function() {
							var citacion = App.get('citacionConsultaController.content');
							deferred.resolve(citacion);
							App.get('citacionConsultaController').removeObserver('loaded', this, fn);
						};

						App.get('citacionConsultaController').addObserver('loaded', this, fn);
						App.get('citacionConsultaController').load();
						return deferred.promise();
					}
				},

				serialize: function(router, context) {
					return {citacion: context.get('id')};			
				},

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'citacionConsulta');
				},
			}),	
			
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
						deferred.resolve(null);	
					}

					App.get('citacionSalasController').addObserver('loaded', this, fn);
					App.get('citacionSalasController').load();
					
					return deferred.promise();
				},
				
				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'citacionCrear');
					
				},				
			}),
			
			editarCitacion: Ember.Route.extend({
				route: '/:citacion/editar',
				
				deserialize: function(router, params) {
					App.set('citacionConsultaController.content', App.Citacion.create({id: params.citacion}));
					if(App.get('citacionConsultaController.loaded')){
						return App.get('citacionConsultaController.content');
					}else{
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
								
								App.get('citacionConsultaController.content').set('temas', temas);
								
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
					}
				},

				serialize: function(router, context) {
					return {citacion: context.get('id')};			
				},			

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'citacionCrear');
				},
				
			}),			
			
		
		}),
		
		expedienteConsulta: Ember.Route.extend({

			route: '/expediente',

			indexSubRoute: Ember.Route.extend({
				route: '/:expediente/ver',

				deserialize: function(router, params) {
					App.set('expedienteConsultaController.content', App.Expediente.create({id: params.expediente}));
					
					if(App.get('expedienteConsultaController.loaded')){
						return App.get('expedienteConsultaController.content');
					}else{
						var deferred = $.Deferred(),
						fn = function() {
							var expediente = App.get('expedienteConsultaController.content');
							deferred.resolve(expediente);
							App.get('expedienteConsultaController').removeObserver('loaded', this, fn);
						};

						App.get('expedienteConsultaController').addObserver('loaded', this, fn);
						App.get('expedienteConsultaController').load();
						return deferred.promise();
					}
				},

				serialize: function(router, context) {
					var expedienteId = context.get('id');
					return {expediente: expedienteId}
				},

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'expedienteConsulta');
				},
			}),
		}),
	}),
});