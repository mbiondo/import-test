function mapObjectsInArrays(ar1, ar2) {
	var arr = [];
	
	for (var i = 0; i < ar2.length; i++) {
		var c = ar1.findProperty("id", ar2[i].id);
		if (c)
			arr[i] = c;
	}
	
	return arr;
}

App.Savable = Ember.Mixin.create({
	save: function () {
		$.ajax({
			url:  (App.get('apiController').get('url') + this.get('restUrl') + '/%@').fmt(encodeURIComponent(this.get('id'))),
			contentType: 'text/plain',
			crossDomain: 'true',			
			dataType: 'JSON',
			type: 'PUT',
			context: this,
			data : this.getJson(),
			success: this.saveSucceeded,
		});
	},

	getJson: function() {
		return JSON.stringify(this.serialize());
	},

	serialize : function () {
		var o = {};
		var serializable = this.get('serializable') || []
		var ap = Ember.ArrayProxy.create({ content: Ember.A(serializable) });
			
		ap.forEach(function(item){
			o[item] = this.get(item);
		},this);

		return o;
	},

	setJson : function (json) {
		var serializable = this.get('serializable') || []

		var ap = Ember.ArrayProxy.create({ content: Ember.A(serializable) });
			
			ap.forEach(function(item){
				this.set(item, json[item]);
			},this);
	},

	saveSucceeded: function (data) {
		if (data.success == true) {
			if(data.id)
				this.set('id', data.id);
		}
	},
});


App.ApiController = Em.Controller.extend({
	url: '',
	key: '',
	secret: '',
});
App.ApplicationController = Em.Controller.extend({
	loading : false,
	tituli: '',
	
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
					App.set('citacionConsultaController.content', App.Citacion.create({id: event.id}));
					App.get('router').transitionTo('loading');
					fn = function() {
						App.get('citacionConsultaController').removeObserver('loaded', this, fn);
						App.get('router').transitionTo('citacionesConsulta.indexSubRoute', App.Citacion.create(event));
					};
					
					App.get('citacionConsultaController').addObserver('loaded', this, fn);			
					App.get('citacionConsultaController').load();
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
				url: App.get('apiController').get('url') + url,
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
	url: '/exp/proyectos/2012/detalle',
	type: App.Expediente,

	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		item = App.Expediente.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.CitacionesController = App.RestController.extend({
	url: '/cit/citaciones/' + moment().format("DD/MM/YYYY") + '/detalle',
	type: App.Citacion,

	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		item = App.Citacion.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.CitacionEstadosController = App.RestController.extend({
	url: '/citEst/estados',
	type: App.CitacionEstado,

	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		item = App.CitacionEstado.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.CitacionSalasController = App.RestController.extend({
	url: '/sal/salas',
	type: App.CitacionSala,
	selected: '',
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		item = App.CitacionSala.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.ComisionesController = App.RestController.extend({
	url: '/com/comisiones/CD/P/resumen',
	type: App.Comision,
	selected: '',
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		item = App.Comision.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});


App.ExpedienteController = Ember.Object.extend({
	content: null,
});

App.ExpedienteConsultaController = Ember.Object.extend({
	content: null,
	url: "/exp/proyecto/%@",
	loaded : false,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);

		
	},
	
	load: function () {
		this.set('loaded', false);
		$.ajax({
			url:  (App.get('apiController').get('url') + this.get('url') + '/%@').fmt(encodeURIComponent(this.get('content').get('id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},
	
	loadSucceeded: function(data) {
		item = App.Expediente.create();
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);
	},	
});

App.CitacionConsultaController = Ember.Object.extend({
	content: null,
	url: "/cit/citacion/%@",
	loaded : false,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);
	},
	
	load: function () {
		this.set('loaded', false);
		$.ajax({
			url:  (App.get('apiController').get('url') + this.get('url') + '/%@').fmt(encodeURIComponent(this.get('content').get('id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},
	
	loadSucceeded: function(data) {
		item = App.Citacion.extend(App.Savable).create();
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);
	},
});

App.MenuController = Em.ArrayController.extend({
	content: '',
	
	seleccionar : function (titulo) {
	
		if (this.get('seleccionado'))
		{
			this.get('seleccionado').set('seleccionado', false);
		}
		
		var sel = this.get('content').findProperty('titulo', titulo);
		
		if (sel)
		{
			App.get('tituloController').set('titulo', titulo);
			this.set('seleccionado', sel);
			sel.set('seleccionado', true);
		}
	},
});

App.TituloController = Em.Object.extend({
	titulo: '',
});

App.BreadCumbController = Em.ArrayController.extend({
	content: '',
});


App.CitacionCrearController = Em.Object.extend({
	content: '',
	expedientes: '',
	
	isEdit: false,
	
	url: '/cit/citacion',
	
	urlExpedientes: '/com/%@/proyectos/2012',
	//urlExpedientes: '/expedientes-listar',
	
	loading: false,
	loaded: false,
		
	create: function () {
		$.ajax({
			url: App.get('apiController').get('url') + this.get('url'),
			contentType: 'text/plain',
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'POST',
			context : {controller: this, model : this.get('content') },
			data : this.get('content').getJson(),
			success: this.createSucceeded,
		});	
	},
	
	save: function () {
		this.get('content').save();
	},
	
	createSucceeded: function (data) {
		
	},
	
	saveSucceeded: function (data) {

	},
	
	cargarExpedientes: function () {
		$.ajax({
			url: (App.get('apiController').get('url') + this.get('urlExpedientes')).fmt(encodeURIComponent(this.get('content.comisiones').objectAt(0).get('id'))),
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'GET',
			context: this,
			success: this.cargarExpedientesSucceeded,
			beforeSend: function () {		
				this.set('loaded', false);
				this.set('loading', true);
			}
		});			
	},

	cargarExpedientesSucceeded: function (data) {
		var exp = [];
		data.forEach(function(i){
			exp.addObject(App.Expediente.extend(App.Savable).create(i));
		}, this);
		this.set('expedientes', exp);
		this.set('loading', false);
		this.set('loaded', true);
	},
});



