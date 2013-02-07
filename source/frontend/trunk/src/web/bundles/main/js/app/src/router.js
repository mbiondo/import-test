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
				appController.cargarExpedientes(true);
			},
		}),
		
		citaciones: Em.Route.extend({
			route: "/citaciones",
			connectOutlets: function(router, context) {
				var appController = router.get('applicationController');
				appController.connectOutlet('main', 'citaciones');
				appController.cargarCitaciones(true);
			},			
		}),

		citacionesConsulta: Ember.Route.extend({
			route: '/citacion',
			
			indexSubRoute: Ember.Route.extend({
				route: '/:citacion/ver',

				deserialize: function(router, params) {
					if(App.get('citacionesController.loaded')){
						return App.get('citacionesController.content').findProperty('id', params.citacion);
					}else{
						var deferred = $.Deferred(),
						fn = function() {
							var citacion = App.get('citacionesController.content').findProperty('id', params.citacion);
							deferred.resolve(citacion);
							App.get('citacionesController').removeObserver('loaded', this, fn);
						};

						App.get('citacionesController').addObserver('loaded', this, fn);
						App.get('citacionesController').load();
						return deferred.promise();
					}
				},

				serialize: function(router, context) {
					var id = context.get('id');
					return {citacion: id}
				},

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'citacionConsulta');
					App.get('citacionConsultaController').set('content', context);
				},
			}),			
		}),
		
		expedienteConsulta: Ember.Route.extend({

			route: '/expediente',

			indexSubRoute: Ember.Route.extend({
				route: '/:expediente/ver',

				deserialize: function(router, params) {
					if(App.get('expedientesController.loaded')){
						return App.get('expedientesController.content').findProperty('expdip', params.expediente);
					}else{
						var deferred = $.Deferred(),
						fn = function() {
							var expediente = App.get('expedientesController.content').findProperty('expdip', params.expediente);
							deferred.resolve(expediente);
							App.get('expedientesController').removeObserver('loaded', this, fn);
						};

						App.get('expedientesController').addObserver('loaded', this, fn);
						App.get('expedientesController').load();
						return deferred.promise();
					}
				},

				serialize: function(router, context) {
					var expedienteId = context.get('expdip');
					return {expediente: expedienteId}
				},

				connectOutlets: function(router, context) {
					var appController = router.get('applicationController');
					appController.connectOutlet('main', 'expedienteConsulta');
					App.get('expedienteConsultaController').set('content', context);
				},
			}),
		}),
	}),
});