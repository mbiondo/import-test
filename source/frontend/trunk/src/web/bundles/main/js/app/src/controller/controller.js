App.ApplicationController = Em.Controller.extend({
	loading : false,
	init: function () {
	},

	cargarExpedientes : function () {
		var expedientesController = App.get('expedientesController');

		expedientesController.addObserver('loaded', this, this.expedientesControllerLoaded);

		expedientesController.load();
	},

	cargarCitaciones: function () {
		var citacionesController = App.get('citacionesController');

		citacionesController.addObserver('loaded', this, this.citacionesControllerLoaded);

		citacionesController.load();	

		
	},
	
	citacionesControllerLoaded : function () {
        $('#mycalendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay '
            },
            editable: false,
            events: App.get('citacionesController').get('content').toArray(),
            eventRender: function(event, element, view) {
				element.bind('click', function() {
					App.get('router').transitionTo('citacionesConsulta.indexSubRoute', App.Citacion.create(event));
				});
            },            
        });
	},	
	
	expedientesControllerLoaded : function () {
	
	},
});


App.RestController = Em.ArrayController.extend({
	url: '',
	sortUrl: '',
	type: null,
	loaded : false,

	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);
	},

	loadSucceeded: function(data){
		var item, items = this.parse(data);		
		
		if(!data || !items){
			this.set('loaded', true);
			return;
		}
		this.set('content', []);
		items.forEach(function(i){
			this.createObject(i);
		}, this);
		
		this.set('loaded', true);
	},

	load: function() {
		this.set('loaded', false);
		var url = this.get('url');
		if ( url ) {
			$.ajax({
				url: url,
				dataType: 'JSON',
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});

		}
	},

	parse : function (data) {
		return data;
	},	
});

App.ExpedientesController = App.RestController.extend({
	url: 'http://10.105.5.134:8080/sparl/rest/exp/proyectos/2012',
	type: App.Expediente,

	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		item = App.Expediente.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.CitacionesController = App.RestController.extend({
	url: 'http://10.105.5.134:8080/sparl/rest/cit/citaciones/1/1/2013',
	type: App.Citacion,

	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		item = App.Citacion.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});


App.ExpedienteController = Ember.Object.extend({
	content: null,
});

App.ExpedienteConsultaController = Ember.Object.extend({
	content: null,
});

App.CitacionConsultaController = Ember.Object.extend({
	content: null,
});

App.MenuController = Em.ArrayController.extend({

});
