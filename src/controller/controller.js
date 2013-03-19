App.Savable = Ember.Mixin.create({
	saveSuccess: '',
	
	save: function () {
	
		this.set('saveSuccess', '');
		var url = (this.get('url') + '/%@').fmt(encodeURIComponent(this.get('id')))
		
		if (this.get('useApi')) {
			url = App.get('apiController').get('url') + url;
		}
			
		$.ajax({
			url:  url,
			contentType: 'text/plain',
			dataType: 'JSON',
			type: 'PUT',
			crossDomain: 'true',
			context: this,
			data : this.getJson(),
			success: this.saveSucceeded,
			complete: this.saveCompleted,
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
			this.set('saveSuccess', true);
			if (this.get('notificationType'))
			{
				App.get('ioController').sendMessage(this.get('notificationType'), "modificado" , this.getJson());
			}
		}
	},
	
	saveCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('saveSuccess', false);
	},	
});


App.IoController = Em.Object.extend({
	MODIFICADO: "modificado",
	CREADO: "creado",
	BORRADO: "borrado",
	ORDENADO: "ordenado",

	socket: null,
	connected: false,
	
	init: function () {
		//if (this.get('connected') == false) 
		//	this.connect();
	},
	
	connect: function () {
		var self = this;
		this.set('socket', io.connect(App.nodeURL, {query: "token=" + App.token}));
		
		this.get('socket').on('connect', function (data) {
			self.set('connected', true);
		//	console.log('CONECTADO');
			self.recieveMessage();
			self.recieveNotification();
		});

		this.get('socket').on('disconnect', function (data) {
			self.set('connected', false);
		});
	},	
	
	sendNotification: function (notificacion) {
		this.get('socket').json.emit('notification', notificacion);
	},
	
	sendEmail: function (email) {
		if (this.get('connected')) {
			this.get('socket').json.emit('email', email);
		}
	},
	
	sendMessage: function (type, action, options) {
		if (this.get('connected')) {
			var data = {
				type : type,
				action: action,
				options: options,
			};
			this.get('socket').json.emit('message', data);
		} 
	},

	recieveNotification: function () {
		self = this;
		if (this.get('connected')) {		
			this.get('socket').on('notification', function (notificacion) {
				App.get('notificationController').enviarNotificacion(notificacion);
			});
		}
	},
	
	recieveMessage: function () {
		self = this;
				
		this.get('socket').on('message', function (data) {
			var type = data.type,
					action = data.action,
					options = JSON.parse(data.options);
			
			switch (action) {
				case self.get('MODIFICADO'):
					self.modificar(type, options);
					break;
				case self.get('CREADO'):			
					self.crear(type, options);
					break;
				case self.get('BORRADO'):
					self.borrar(type, options);
					break;
				case self.get('ORDENADO'):
					self.ordenar(type, options);
					break;
			}
		});
	},

	modificar : function (type, options) {
		switch (type) {
			case 'Turno' :
				var turno = App.get('turnosController').findProperty('id', options.id);
				if (turno)
				{		
					turno.setJson(options);
					if(turno.get('horaInicio') != undefined){
						if(turno.get('horaFin') == undefined){
							App.get('turnosController').startTimer(turno);
						}else{
							if(App.get('turnosController').turnoHablando == turno)
								App.get('turnosController').stopTimer(turno);
						}
					}

					App.get('turnosController').actualizarHora();
				}
				break;

			case "Tema" :
				var tema = App.get('temasController').findProperty('id', options.id);
				if (tema){
					tema.setJson(options);
				}
				break;

			case "Sesion" :
				var sesion = App.get('sesionesController').findProperty('id', options.id);
				if (sesion){
					sesion.setJson(options);

					if(App.get('sesionesController.sesionActual.id') == sesion.get('id')){
						if(sesion.get('horaInicio') != null && sesion.get('horaFin') != null){
							App.get('sesionesController').stopTimer(sesion);
						}
					}

					if(sesion.get('horaInicio') != null && sesion.get('horaFin') == null){
						App.get('sesionesController').startTimer(sesion);
					} 

				}
				break;
		}
	},

	crear : function (type, options) {
		switch (type) {
			case 'Turno' :
				var turno = App.Turno.extend(App.Savable).create(options);
				turno.set('tema', App.get('temasController').findProperty('id', options.temaId));
				App.get('turnosController').addObject(turno);
				break;

			case "Tema" :
				App.get('temasController').addObject(App.Tema.extend(App.Savable).create(options));
				break;

			case "Sesion" :
				App.get('sesionesController').addObject(App.Sesion.extend(App.Savable).create(options));
				break;
		}
	},

	borrar : function (type, options) {
		switch (type) {
			case 'Turno' :
				var turno = App.get('turnosController').findProperty('id', options);

				if (turno)
					App.get('turnosController').removeObject(turno);
				
				App.get('turnosController').actualizarHora();
				break;

			case 'Tema' :
				var tema = App.get('temasController').findProperty('id', options);

				if(tema){
					if(App.get('temaController.content') == tema){
						var sesion = App.get('sesionController.content');
						App.get('router').transitionTo('sesionConsulta.indexSubRoute', sesion);
					}
						
					App.get('temasController').removeObject(tema);
					App.get('turnosController').actualizarHora();
				}
				break;

			case "Sesion" :
				var sesion = App.get('sesionesController').findProperty('id', options);

				if (sesion)
					App.get('sesionesController').removeObject(sesion);

				break;
		}
	},

	ordenar : function (type, options) {
		switch (type) {
			case 'Turno' :
				var turno, ap;
				ap = Ember.ArrayProxy.create({
					content: Ember.A(options)
				});

				ap.forEach(function(item, index){
					turno = App.get('turnosController').findProperty('id', item);
					if (turno){
						turno.set('orden', index);
					}
				});

				App.get('turnosController').actualizarHora();
				break;

			case 'Tema' :
				var turno, ap;
				ap = Ember.ArrayProxy.create({
					content: Ember.A(options)
				});

				ap.forEach(function(item, index){
					tema = App.get('temasController').findProperty('id', item);
					if (tema)
						tema.set('orden', index);
				});

				App.get('turnosController').actualizarHora();
				break;
		}
	},	
});


App.ApiController = Em.Controller.extend({
	url: '',
	key: '',
	secret: '',
});

App.NotificationController = Em.Controller.extend({
	estado: '',
	
	habilitado: function () {
		return this.get('estado') == 0 || !window.webkitNotifications;
	}.property('estado'),
	
	enviarNotificacion: function (notificacion) {
		var havePermission = this.get('estado');
		
		if (havePermission == 0 && window.webkitNotifications) {
			var notification = window.webkitNotifications.createNotification(
			  notificacion.icono,
			  notificacion.titulo,
			  notificacion.mensaje
			);
			notification.onclick = function () {
			  window.location = notificacion.url;
			  notification.close();
			}
			notification.show();
		}
		else
		{
			$.jGrowl('<a href="' + notificacion.url + '" >' + notificacion.mensaje + '</a>', {header: notificacion.titulo , life: 5000 });
		}
	},
});

App.ApplicationController = Em.Controller.extend({
	loading : false,
	
	socket: null,
	connected: false,
	
	init: function () {
		//this.connect();
		if (window.webkitNotifications){
			App.get('notificationController').set('estado', window.webkitNotifications.checkPermission());
		}
	},

	cargarSesiones : function () {
		var sesionesController = App.get('sesionesController');

		sesionesController.addObserver('loaded', this, this.sesionesControllerLoaded);

		sesionesController.load();
	},

	sesionesControllerLoaded : function () {
		var sesion,
			sesionesController = App.get('sesionesController');
		
		sesionesController.removeObserver('loaded', this, this.sesionesControllerLoaded);

		sesion = sesionesController.get('arrangedContent').objectAt(0);

		this.seleccionarSesion(sesion);
	},

	seleccionarSesion : function (sesion) {
		if(!sesion)
			return;

		var sesion,
			sesionController = App.get('sesionController'),
			temaController = App.get('temasController'),
			turnosController = App.get('turnosController');		

		sesionController.set('content', sesion);
		temaController.set('content', []);
		turnosController.set('content', []);
		
		temaController.set('url', '/sesion/%@/temas'.fmt(encodeURIComponent(sesion.get('id'))));
		temaController.load();

		turnosController.set('url', '/app_dev.php/sesion/%@/turnos'.fmt(encodeURIComponent(sesion.get('id'))));
		turnosController.load();
	},
});

App.RestController = Em.ArrayController.extend({
	url: '',
	sortUrl: '',
	type: null,
	loaded : false,
	useAPi: true,

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
		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
			
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

	createObject: function (data, save) {
		save = save || false;
		
		if(this.get('type')){
			item = this.get('type').extend(App.Savable).create(data);
			item.setProperties(data);
			item.set('url', this.get('url'));
		}else{
			item = Em.Object.create(data);	
		}

		if(save){
			var url = this.get('url');
			if (this.get('useApi'))
				url = App.get('apiController').get('url') + url;		
			$.ajax({
				url: url,
				contentType: 'text/plain',
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}
	},

	deleteObject: function (object) {
		var url = (this.get('url') + '/%@').fmt(encodeURIComponent(object.get('id')));
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;	
		$.ajax({
			url: url,
			dataType: 'JSON',
			type: 'DELETE',
			context : {controller: this, model : object },
			success: this.deleteSucceeded,
		});
	},

	deleteSucceeded: function (data) {
		if (data.success == true) {
			this.controller.removeObject(this.model);
			this.model.destroy();
		}
	},        

	createSucceeded: function (data) {
		if (data.success == true) {
			this.model.set('id', data.id);
			this.controller.addObject(this.model);
		}
	},

	saveSort : function(ids) {
		var url = this.get('sortUrl');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;	
		$.ajax({
			url: url,
			dataType: 'JSON',
			type: 'POST',
			context : this,
			data : {sort: JSON.stringify(ids)},
			success: this.sortSucceeded,
		});
	},

	sortSucceeded : function(data) {
		App.get('ioController').sendMessage(this.get('notificationType'), "ordenado", JSON.stringify(data.orden));
	}
});


App.ExpedientesController = App.RestController.extend({
	url: '/exp/proyectos/2012/detalle',
	type: App.Expediente,
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Expediente.extend(App.Savable).create(data);
		item.setProperties(data);
		
		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}
	},	
});

App.CitacionesController = App.RestController.extend({
	url: '/cit/citaciones/%@/detalle',
	type: App.Citacion,
	anio: '',
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	load: function() {
		var url = (App.get('apiController').get('url') + this.get('url')).fmt(encodeURIComponent(this.get('anio')));
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
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Citacion.extend(App.Savable).create(data);
		item.setProperties(data);
		
		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}		
	},	
});

App.CitacionEstadosController = App.RestController.extend({
	url: '/citEst/estados',
	type: App.CitacionEstado,
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		save = save || false;
		
		item = App.CitacionEstado.create(data);
		item.setProperties(data);
		
		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}			
	},	
});

App.CitacionSalasController = App.RestController.extend({
	url: '/sal/salas',
	type: App.CitacionSala,
	selected: '',
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.CitacionSala.create(data);
		item.setProperties(data);
		
		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}		
	},	
});

App.ComisionesController = App.RestController.extend({
	url: '/com/comisiones/CD/P/resumen',
	type: App.Comision,
	selected: '',
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Comision.create(data);
		item.setProperties(data);
		
		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}		
	},	
});


App.ExpedienteController = Ember.Object.extend({
	content: null,
});

App.ExpedienteConsultaController = Ember.Object.extend({
	content: null,
	url: "/exp/proyecto/%@",
	loaded : false,
	useApi: true,
	
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


App.ParteConsultaController = Ember.Object.extend({
	content: '',
});

App.ParteCrearController = Ember.Object.extend({
	content: '',
});

App.PartesController = App.RestController.extend({
	url: '/parte/partes',
	type: App.Parte,
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Parte.create(data);
		item.setProperties(data);
		
		this.addObject(item);	
	},		
});

App.ReunionesSinParteController = App.RestController.extend({
	url: '/com/reun/sp',
	type: App.Reunion,
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Reunion.create(data);
		item.setProperties(data);
		
		this.addObject(item);	
	},	
});

App.ReunionesConParteController = App.RestController.extend({
	url: '/com/reun/cp/' + moment().format('DD/MM/YYYY'),
	type: App.Reunion,
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Reunion.create(data);
		item.setProperties(data);
		
		this.addObject(item);	
	},	
});



App.ReunionConsultaController = Ember.Object.extend({
	content: null,
	url: "/com/reun/reunion/%@",
	loaded : false,
	useApi: true,
	
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
		item = App.Reunion.extend(App.Savable).create();
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);
	},	
});

App.CitacionConsultaController = Ember.Object.extend({
	content: null,
	url: "/cit/citacion/%@",
	loaded : false,
	useApi: true,
	
	editURL: function () {
		return "#/comisiones/citaciones/citacion/" + this.get('content.id') + "/editar";
	}.property('content'),
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);
	},
	
	loadReuionCompleted: function(xhr){
		if(xhr.status == 204) {
			
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
		item.set('useApi', true);
		this.set('content', item);
		
		$.ajax({
			url:  (App.get('apiController').get('url') + '/com/reun/reunionPorCitacion' + '/%@').fmt(encodeURIComponent(this.get('content').get('id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadReunionSucceded,
			complete: this.loadReuionCompleted
		});		
	},
	
	
	
	loadReunionSucceded: function (data) {
		if (data) {
			var reunion = App.Reunion.extend(App.Savable).create(data);
			reunion.setProperties(data);
			this.set('content.reunion', reunion);
			this.set('loaded', true);		
		}
	},
	
});

App.MenuController = Em.ArrayController.extend({
	content: '',
	
	seleccionar : function (id) {
		this.get('content').forEach(function (menuItem) {
			menuItem.set('seleccionado', false);
		});
		
		var sel = this.get('content').findProperty('id', id);
		
		if (sel)
		{
			App.get('tituloController').set('titulo', sel.get('titulo'));
			App.get('tituloController').set('fecha', moment().format('LL'));
			this.set('seleccionado', sel);
			sel.set('seleccionado', true);
		}
	},
});

App.TituloController = Em.Object.extend({
	titulo: '',
	fecha: '',
});

App.BreadCumbController = Em.ArrayController.extend({
	content: '',
});


App.CrearParteController = Em.Object.extend({
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
	
	crearReunion: function (reunion) {
	
		$.ajax({
			url: App.get('apiController').get('url') + "/com/reun/reunion",
			contentType: 'text/plain',
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'POST',
			context: this,
			complete: this.crearReunionCompleted,
			data : reunion.getJson()
		});			
		
	},
	
	crearReunionCompleted: function (data) {
		//TO-DO Revisar que devuelva OK
		
		if (data.responseText)
		{
			var obj = JSON.parse(data.responseText);
			
			App.set('reunionConsultaController.loaded', false);
			App.set('reunionConsultaController.content', App.Citacion.create(obj));

			fn = function() {
				var reunion = App.get('reunionConsultaController.content');
				App.get('reunionConsultaController').removeObserver('loaded', this, fn);
				App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', reunion);
			};

			App.get('reunionConsultaController').addObserver('loaded', this, fn);
			App.get('reunionConsultaController').load();
			
			$.jGrowl('Reunion creada con Exito!', { life: 5000 });
		}
	},	
	
	confirmar: function () {

		$.ajax({
			url: App.get('apiController').get('url') + "/cit/citacion/" + this.get('content.id') + "/estado/" + 2,
			contentType: 'text/plain',
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'PUT',
			context: this,
			success: this.confirmarSuccess,
			complete: this.confirmarCompleted,
			data : this.get('content').getJson()
		});			
		
	},
	
	confirmarSuccess: function (data) {
		this.get('content').set('estado', App.CitacionEstado.create({id: 2}));
		$.jGrowl('Se ha cambiado el estado de la sitacion a Convocada!', { life: 5000 });
	},
	
	confirmarCompleted: function (xhr) {
		if(xhr.status == 200) {
			this.get('content').set('estado', App.CitacionEstado.create({id: 2}));
			$.jGrowl('Se ha cambiado el estado de la sitacion a Convocada!', { life: 5000 });

			var emailList = [];
			var comisionCabecera = this.get('content.comisiones.firstObject');
			
			this.get('content.comisiones').forEach(function (comision) {
				comision.integrantes.forEach(function(integrante) {
					emailList.addObject(integrante.diputado.datosPersonales.email + ".dip@hcdn.gov.ar");			
				});
			});
			
			emailList = ['mbiondo@omcmedios.com.ar'];
			
			var notificacion = {
				titulo: 'Citacion Convocada',
				mensaje: 'Se ha convocado a una citacion para ' + this.get('content.start'),
				emailList: emailList,
				objeto: this.get('content'),
				url: "#/comisiones/citaciones/citacion/" + this.get('content.id') + "/ver",
				icono: "http://files.softicons.com/download/web-icons/large-calendar-icons-by-aha-soft/png/256x256/calendar.png"
			}
			
			var email = notificacion;
			email.url = document.location.origin + '/' + email.url;
			
			App.get('ioController').sendNotification(notificacion);
			App.get('ioController').sendEmail(email);
		
		} else {
			$.jGrowl('Ocurrio un error al intentar confirmar la citacion!', { life: 5000 });
		}
	},
	
	cancelar: function () {
		$.ajax({
			url: App.get('apiController').get('url') + "/cit/citacion/" + this.get('content.id') + "/estado/" + 3,
			contentType: 'text/plain',
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'PUT',
			context: this,
			success: this.cancelarSuccess,
			complete: this.cancelarCompleted,
			data : this.get('content').getJson()
		});			
	},
	
	cancelarSuccess: function (data) {
		this.get('content').set('estado', App.CitacionEstado.create({id: 3}));
		$.jGrowl('Se ha cambiado el estado de la sitacion a suspendida!', { life: 5000 });
	},

	cancelarCompleted: function (xhr) {
		if(xhr.status == 200) {
			this.get('content').set('estado', App.CitacionEstado.create({id: 3}));
			$.jGrowl('Se ha cambiado el estado de la sitacion a suspendida!', { life: 5000 });		
		} else {
			$.jGrowl('Ocurrio un error al intentar cancelar la citacion!', { life: 5000 });
		}
	},

	create: function () {

		$.ajax({
			url: App.get('apiController').get('url') + this.get('url'),
			contentType: 'text/plain',
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'POST',
			success: this.createCompleted,
			complete: this.createCompleted,
			data : this.get('content').getJson()
		});	
	},
	
	createCompleted: function (data) {
		//TO-DO Revisar que devuelva OK
		
		if (data.responseText)
		{

			var obj = JSON.parse(data.responseText);
			
			App.set('citacionConsultaController.loaded', false);
			App.set('citacionConsultaController.content', App.Citacion.create(obj));

			fn = function() {
				var citacion = App.get('citacionConsultaController.content');
				App.get('citacionConsultaController').removeObserver('loaded', this, fn);
				App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', citacion);
			};

			App.get('citacionConsultaController').addObserver('loaded', this, fn);
			App.get('citacionConsultaController').load();
			
			$.jGrowl('Citacion creada con Exito!', { life: 5000 });
		}
	},
	
	save: function () {
		fn = function () {
			this.get('content').removeObserver('saveSuccess', this, fn);
			if (this.get('content.saveSuccess') == true)
			{
				App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', this.get('content'));
				$.jGrowl('Citacion editada con Exito!', { life: 5000 });				
			}
			else
			{
				$.jGrowl('Ocurrio un error al intentar guardar los cambios en la citacion!', { life: 5000 });
			}
		}
		this.get('content').save();
		this.get('content').addObserver('saveSuccess', this, fn);
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


/*
* Oradores
*/

App.DiputadosController  = App.RestController.extend({
	url: '/lista-diputados',
	type: App.User,
	useAPi: false,
	filtro : true,

	init : function(){
		this.load();
	},

	parse: function (data) {
		return data.diputados;
	},
	
	createObject: function (data, save) {
		save = save || false;
		
		var item = App.User.extend(App.Savable).create(data);
		item.setProperties(data);
		item.set('url', this.get('url'));

		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}
	},	
});


App.SesionesController  = App.RestController.extend({
	notificationType: "Sesion",
	useAPi: false,
	url: '/sesiones',
	type: App.Sesion,
	sortProperties: ['sortValue'],
	sortAscending: false,
	tipoSesiones: [{titulo: "Sesion Ordinaria De Tablas", id: "SesionOrdinariaDeTablas"}, {titulo: "Sesion Informativa", id: "SesionInformativa"}, {titulo: "Sesion Ordinaria Especial", id: "SesionOrdinariaEspecial"}],
	timer : null,
	sesionActual : null,

	init : function () {
		this._super();
		this.set('timer', App.Timer.create());
	},

	loadSucceeded: function(data){
		this._super(data);

		var sesion = this.find(function (item) {
			if(item.get('horaInicio') != null && item.get('horaFin') == null)
				return true;
			
			return false;
		}, this);

		if(sesion)
			this.startTimer(sesion);
		
	},

	startTimer : function (sesion) {
		if(this.get('sesionActual'))
			this.stopTimer(this.get('sesionActual'))

		timer = this.get('timer');

		if(timer.get('isRunning'))
			return;

		if(sesion.get('horaInicio'))
			timer.start(sesion.get('horaInicio')*1000);
		else
			timer.start();

		if(!sesion.get('horaInicio')){
			sesion.set('horaInicio', Math.round(timer.get('startTime')/1000));
			sesion.save();
		}

		sesion.set('timer', timer);

		this.set('sesionActual', sesion);
	},

	stopTimer : function (sesion) {
		this.get('timer').stop();
		this.set('sesionActual', null);

		sesion.set('horaFin', Math.round(this.get('timer.endTime')/1000));
		sesion.set('timer', null);
		sesion.set('completa', true);
		sesion.save();
	},

	parse : function (data) {
		console.log(data);
		var sesiones = data.sesiones;
		return this.setListas(sesiones);
	},

	setListas : function (sesiones) {
		var listas, listasController, self = this,
		sesiones = Ember.ArrayProxy.create({ content: Ember.A(sesiones) });

		sesiones.forEach(function(sesion){
			listasController = App.ListasController.create({
				content : [],
			});
			listas = Ember.ArrayProxy.create({ content: Ember.A(sesion.listas) });
			listas.forEach(function(lista, index){
				listasController.pushObject(App.Lista.extend(App.Savable).create(lista));
			}, this);
			sesion.listas = listasController;
		}, this);

		return sesiones.toArray();
	},
	
	createObject: function (data, save) {
		save = save || false;
		
		item = App.Sesion.extend(App.Savable).create(data);
		item.setProperties(data);
		item.set('url', this.get('url'));

		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}
	},		

	createSucceeded: function (data) {
		this._super(data);
		if (data.success == true) {
			this.model.set('tipo', data.sesionTipo);
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "creado" , this.model.getJson());
		}
	},

	deleteSucceeded: function (data) {
		this._super(data);

		if (data.success == true) {
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "borrado", this.model.get('id'));
		}
	},
	
});


App.SesionController = Ember.Object.extend({
	content: null,
	
	contentChange : function () {
		var lista, listas = this.get('content.listas');
		if(listas){
			lista = listas.objectAt(0)
			App.get('listaController').set('content', lista);
		}
	}.observes('content')
}),

App.TurnosController = App.RestController.extend({
	notificationType : 'Turno',
	sortUrl: '/turnos/ordenar',
	type : App.Turno,
	sortProperties: ['sortValue'],
	timer : null,
	useAPi: false,

	turnoHablandoBinding : null,

	init : function () {
		this._super();
		this.set('timer', App.Timer.create());
	},

	startTimer : function (turno) {
		timer = this.get('timer');

		if(timer.get('isRunning'))
			return;

		this.set('turnoHablando', turno);

		if(turno.get('horaInicio'))
			timer.start(turno.get('horaInicio')*1000);
		else
			timer.start();

		if(!turno.get('horaInicio')){
			turno.set('horaInicio', Math.round(timer.get('startTime')/1000));
			turno.save();
		}

		turno.set('timer', timer);
		this.actualizarHora(0);
	},

	stopTimer : function (turno) {
		this.get('timer').stop();

		turno.set('horaFin', Math.round(this.get('timer.endTime')/1000));
		turno.set('timer', null);
		turno.save();

		this.set('turnoHablando', null);

		this.actualizarHora();
	},

	parse : function (data) {
		var turnos = data.turnos;
		turnos = this.setTema(turnos);
		return this.setLista(turnos);
	},

	loadSucceeded: function(data){
		this._super(data);

		var turnoHablando = this.get('turnoHablando');

		if(turnoHablando){
			var turno = this.findProperty('id', turnoHablando.id);
			var index = this.indexOf(turno);
			this.removeObject(turno);
			this.insertAt(index, turnoHablando);
		}else{
			var turno = this.find(function (item) {
				if(item.get('horaInicio') != null && item.get('horaFin') == null)
					return true;
				
				return false;
			}, this);

			if(turno)
				this.startTimer(turno);
		}

		if(this.get('content') && this.get('content').length)
			this.actualizarHora(0);
	},

	setTema : function (turnos) {
		if(!turnos || !App.get('temasController.content'))
			return [];
			
		var self = this, items = Ember.ArrayProxy.create({ content: Ember.A(turnos) });

		items.forEach(function(item){
			item.tema = App.get('temasController.content').findProperty('id', item.temaId);
		})
		return items.toArray();
	},

	setLista : function (turnos) {
		if(!turnos || !App.get('sesionesController.content'))
			return [];
			
		var lista, listas, sesion, self = this, items = Ember.ArrayProxy.create({ content: Ember.A(turnos) });

		items.forEach(function(item){
			if(item.tema)
				sesion = App.get('sesionesController.content').findProperty('id', item.tema.get('sesionId'));

			if(sesion){
				listas = sesion.get('listas')
				lista = listas.findProperty('id', item.listaId)
				if(lista)
					item.lista = lista;
			}
		}, this)
		return items.toArray();
	},

	actualizarHora : function (fromIndex) {
		fromIndex = fromIndex || 0;

		var turnoAnterior, ultimaHora, turno, tiempo, hora
				length = this.get('length'),
				sesionFecha = parseInt(App.get('sesionController.content.fecha'));

		turnoAnterior = this.objectAt(fromIndex-1);

		if(turnoAnterior === undefined){
			turno = this.get('arrangedContent').objectAt(fromIndex);
			if(turno.get('horaInicio')){
				turno.set('hora', turno.get('horaInicio'));
				turno.set('horaEstimada', false);
			}else{
				turno.set('hora', sesionFecha);
				turno.set('horaEstimada', true);
			}

			turnoAnterior = turno;
			fromIndex++;
		}

		while(turnoAnterior != undefined && fromIndex < length){
			if(turnoAnterior.get('horaFin')){
				hora = turnoAnterior.get('horaFin');
			}else{
				if(turnoAnterior.get('horaInicio')){
					ultimaHora = moment.unix(turnoAnterior.get('horaInicio'));
				}else{
					ultimaHora = moment.unix(turnoAnterior.get('hora'));
				}
				tiempo = turnoAnterior.get('tiempo') * 60 * 1000;
				ultimaHora.add('milliseconds', tiempo);
				hora = ultimaHora.unix();
			}
			turno = this.get('arrangedContent').objectAt(fromIndex);

			if(turno.get('horaInicio')){
				turno.set('hora', turno.get('horaInicio'));
				turno.set('horaEstimada', false);
			}else{
				turno.set('hora',  hora);
				turno.set('horaEstimada', true);
			}

			turnoAnterior = turno;
			fromIndex++;
		}
	},

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Turno.extend(App.Savable).create(data);
		item.setProperties(data);
		item.set('url', this.get('url'));

		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}
	},	
	
	createSucceeded: function (data) {
		this._super(data);
		if (data.success == true) {
			var turnosController = App.get('turnosController');
			turnosController.actualizarHora();
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "creado", this.model.getJson());
			
			var temaController = App.get('temaController');
			var turnos = App.get('turnosController.arrangedContent').filter(function(item){
				if(item.get('temaId') == temaController.get('content.id')){
					if(item.get('listaId') == this.get('listaId')){
						return !item.get('bloqueado');
					}else{
						return false;
					}
				}else{
					return false;
				}
			}, this.model);
			
			turnos.forEach(function(item, index){
				item.set('orden', index);
			}, this.model);
			
			App.get('turnosController').saveSort(turnos.mapProperty('id'));
		}
	},

	deleteSucceeded: function (data) {
		this._super(data);

		if (data.success == true) {
			var turnosController = App.get('turnosController');
			if(turnosController.length)
				turnosController.actualizarHora();
				
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "borrado", this.model.get('id'));
		}
	},
	
	horaInicio : function() {
		var primerTurno;

		if(this.get('arrangedContent') && this.get('arrangedContent').length)
			primerTurno = this.get('arrangedContent').objectAt(0);

		if(primerTurno)
			return primerTurno.get('hora');
		
		return null
	}.property('arrangedContent.@each.hora').cacheable(),

	horaFin : function() {
		var ultimoTurno;

		if(this.get('arrangedContent') && this.get('arrangedContent').length)
			ultimoTurno = this.get('arrangedContent').objectAt(this.get('arrangedContent').length-1);

		if(ultimoTurno)
			return ultimoTurno.get('horaFinEstimada');

		return null
	}.property('arrangedContent.@each.hora').cacheable(),

	tiempoTranscurrido : function() {
		var tiempoTranscurrido = 0;
		this.get('content').forEach(function(item){
			
			tiempoTranscurrido += item.get('tiempoTranscurrido');
		
		}, this);
		return tiempoTranscurrido;
	}.property('content.@each.tiempoTranscurrido', 'content.@each.horaFin').cacheable(),

	duracionTotal : function() {
		var f = this.get('horaFin'),
				i = this.get('horaInicio');

		return (f - i) * 1000;
	}.property('horaInicio', 'horaFin'),

	sHoraInicio: function () {
		return moment.unix(this.get('horaInicio')).format('HH:mm [hs]');
	}.property('horaInicio'),

	sHoraFin: function () {
		return moment.unix(this.get('horaFin')).format('HH:mm [hs]');
	}.property('horaFin'),

	sDuracionTotal: function () {
		return moment.cronometro(this.get('duracionTotal'));
	}.property('duracionTotal'),

	sTiempoTranscurrido: function () {
		return moment.cronometro(this.get('tiempoTranscurrido'));
	}.property('tiempoTranscurrido'),	
});

App.TemasController = App.RestController.extend({
	notificationType : 'Tema',
	type: App.Tema,
	sortUrl: '/temas/ordenar',
	sortProperties: ['orden'],
	useAPi: false,
	parse : function (data) {
		return data.temas;
	},
	
	createObject: function (data, save) {
		save = save || false;
		
		item = App.Tema.extend(App.Savable).create(data);
		item.setProperties(data);
		item.set('url', this.get('url'));

		if(save){
			$.ajax({
				url: this.get('url'),
				dataType: 'JSON',
				type: 'POST',
				context : {controller: this, model : item },
				data : item.getJson(),
				success: this.createSucceeded,
			});
		}else{
			this.addObject(item);
		}
	},		
	
	createSucceeded: function (data) {
		this._super(data);
		if (data.success == true) {
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "creado" , this.model.getJson());
		}
	},	
	deleteSucceeded: function (data) {
		this._super(data);

		if (data.success == true) {
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "borrado", this.model.get('id'));
		}
	},

	sortEnabled : function () {
		if(App.get('puedeEditar') && !App.get('turnosController').get('turnoHablando'))
			return true;

		return false;
	}.property('App.turnosController.turnoHablando', 'App.puedeEditar')
});

App.TemaController = Em.Object.extend({
	content: null,
	borrarTema : false,

	horaInicio : function() {
		var turnosController = App.get('turnosController');
		var primerTurno;

		if(turnosController.get('arrangedContent') && turnosController.get('arrangedContent').length)
			primerTurno = turnosController.get('arrangedContent').findProperty('temaId', this.get('content.id'));

		if(primerTurno)
			return primerTurno.get('hora');
		
		return null
	}.property('content', 'App.turnosController.@each.hora').cacheable(),

	horaFin : function() {
		var turnosController = App.get('turnosController');
		var ultimoTurno;

		if(turnosController.get('arrangedContent') && turnosController.get('arrangedContent').length){
			var turnosTema = turnosController.get('arrangedContent').filterProperty('temaId', this.get('content.id'));
			ultimoTurno = turnosTema.objectAt(turnosTema.length-1);
		}
			//ultimoTurno = turnosController.get('arrangedContent').objectAt(turnosController.get('arrangedContent').length-1);

		if(ultimoTurno)
			return ultimoTurno.get('horaFinEstimada');

		return null
	}.property('content', 'App.turnosController.@each.hora').cacheable(),

	duracionTotal : function() {
		var f = this.get('horaFin'),
				i = this.get('horaInicio');

		return (f - i) * 1000;
	}.property('horaInicio', 'horaFin'),
	
	sHoraInicio: function () {
		return moment.unix(this.get('horaInicio')).format('HH:mm [hs]');
	}.property('horaInicio'),

	sHoraFin: function () {
		return moment.unix(this.get('horaFin')).format('HH:mm [hs]');
	}.property('horaFin'),

	sDuracionTotal: function () {
		return moment.cronometro(this.get('duracionTotal'));
	}.property('duracionTotal'),

	listasUrl : function () {
		return "listas-imprimir/%@".fmt(encodeURIComponent(App.get('temaController.content.id')));
	}.property('content'),

	turnoHablandoEnTemaSeleccionado : function () {
		var turnoHablando = App.get('turnosController.turnoHablando');

		if(!turnoHablando || !this.get('content'))
			return false;

		if(turnoHablando.get('temaId') == this.get('content.id')){
			return true;
		}else{
			return false;
		}
	}.property('content', 'App.turnosController.turnoHablando'),


	totalTurnos : function() {
		var turnosController = App.get('turnosController');

		if(turnosController.get('arrangedContent') && turnosController.get('arrangedContent').length){
			var turnosTema = turnosController.get('arrangedContent').filterProperty('temaId', this.get('content.id'));
			return turnosTema.length;
		}

		return null
	}.property('content', 'App.turnosController.length').cacheable(),
	
	turnosPendientes : function() {
		var turnosController = App.get('turnosController');

		if(turnosController.get('arrangedContent') && turnosController.get('arrangedContent').length){
			var turnosTema = turnosController.get('arrangedContent').filterProperty('temaId', this.get('content.id'));
			var filtered = turnosTema.filter(function(turno) {
				return turno.get('bloqueado') == false;
			});
			return filtered.length;
		}
		return null
	}.property('content', 'App.turnosController.length').cacheable(),
});

App.ListasController = Em.ArrayController.extend({
});

App.ListaController = Em.Object.extend({
	content: null,

	turnoHablandoEnListaSeleccionada : function () {
		var turnoHablando = App.get('turnosController.turnoHablando');

		if(!turnoHablando || !this.get('content'))
			return false;

		if(turnoHablando.get('listaId') == this.get('content.id')){
			return true;
		}else{
			return false;
		}
	}.property('content', 'App.turnosController.turnoHablando'),
	
	turnosDesbloqueados : function () {
		var temaController = App.get('temaController');

		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('temaId') == temaController.get('content.id')){
				if(item.get('listaId') == this.get('content.id')){
					return !item.get('bloqueado');
				}else{
					return false;
				}
			}else{
				return false;
			}
		}, this);

		return turnos;
	}.property('content', 'App.temaController.content', 'App.turnosController.arrangedContent.@each.bloqueado').cacheable(),

	turnosBloqueados : function () {
		var temaController = App.get('temaController');

		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('temaId') == temaController.get('content.id')){
				if(item.get('listaId') == this.get('content.id')){
					return item.get('bloqueado');
				}else{
					return false;
				}
			}else{
				return false;
			}
		}, this);

		return turnos;
	}.property('content', 'App.temaController.content', 'App.turnosController.arrangedContent.@each.bloqueado').cacheable(),

	ordenarPorBloque : function (sortAscending) {
		sortAscending = sortAscending | false;

		var bloquesCantidad = Ember.ArrayController.create({
			content: App.bloques,
			sortProperties: ['afiliados'],
			sortAscending: sortAscending
		});

		var ultimoIndice, offset = 0, turnos = this.get('turnosDesbloqueados');

		if(sortAscending)
			offset = (bloquesCantidad.get('length') - turnos.get('length'))

		turnos.forEach(function(turno, index){
			App.get('turnosController').removeObject(turno);

			bloqueCantidad = bloquesCantidad.get('arrangedContent').find(function(bloqueCantidad, index) {
				ultimoIndice = index;
				return bloqueCantidad['id'] == turno.get('propietario.bloque.id');
			}, this);

			turno.set('orden', ultimoIndice - offset);

			App.get('turnosController').addObject(turno);
		}, this);

		App.get('turnosController').actualizarHora();

		App.get('turnosController').saveSort(this.get('turnosDesbloqueados').mapProperty('id'));
	},

	modificarTiempos : function (tiempo) {
		if(!tiempo)
			return false;

		tiempo = parseInt(tiempo);

		this.get('turnosDesbloqueados').setEach('tiempo', tiempo);
		this.get('turnosDesbloqueados').invoke('save');
	},

	imprimir : function() {
		var turnosBloqueados = this.get('turnosBloqueados'),
		turnosDesbloqueados = this.get('turnosDesbloqueados');

		var turnos = [];

		turnosBloqueados.forEach(function(item, index){
			var t = item.serialize();
			t['hablando'] = item.get('hablando');
			turnos.push(t);
		}, this);

		turnosDesbloqueados.forEach(function(item, index){
			var t = item.serialize();
			t['hablando'] = item.get('hablando');
			turnos.push(t);
		}, this);

		var sesion = App.get('sesionController.content').serialize();
		var tema = App.get('temaController.content').serialize();

		var lista = this.get('content').serialize();

		lista['turnos'] = turnos;

		listas = [lista];
		sesion['listas'] = listas;
		sesion['tema'] = tema;

		$.download('listas-imprimir', "&data=" + JSON.stringify(sesion));
	},
	
	imprimirPendientes : function() {
		var sesion = App.get('sesionController.content').serialize();
		var tema = App.get('temaController.content').serialize();
		var listasSerialized = [];

		var turnos = this.get('content').get('turnosPendientes');
		var turnosSerialized = [];
		turnos.forEach(function(turno, index){
			var t = turno.serialize();
			t['hablando'] = turno.get('hablando');
			turnosSerialized.push(t);
		}, item);
		
		var lista = this.get('content').serialize();
		lista['turnos'] = turnosSerialized;
		listasSerialized.push(lista);
		
		sesion['listas'] = listasSerialized;
		sesion['tema'] = tema;
		$.download('listas-imprimir', "&data=" + JSON.stringify(sesion));
	},	

	totalTurnos : function() {
		var temaController = App.get('temaController');
		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('temaId') == temaController.get('content.id')){
				if(item.get('listaId') == this.get('content.id')){
					return true;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}, this);

		return turnos.length;
	}.property('content', 'App.turnosController.length').cacheable(),

	turnosPendientes: function() {
		return this.get('totalTurnos') - this.get('turnosBloqueados').length;
	}.property('content', 'totalTurnos', 'turnosBloqueados'),
	
	listaVacia : function () {
		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('listaId') == this.get('content.id') &&
					item.get('temaId') == App.get('temaController.content.id')){
				return true;
			}else{
				return false;
			}
		}, this);

		return !turnos.length;

	}.property('content', 'App.temaController.content', 'App.turnosController.content.length'),

	horaInicio : function() {
		var primerTurno;

		if(this.get('turnosBloqueados').length){
			primerTurno = this.get('turnosBloqueados').objectAt(0);
		}else{
			if(this.get('turnosDesbloqueados').length){
				primerTurno = this.get('turnosDesbloqueados').objectAt(0);
			}
		}

		if(primerTurno){
			return primerTurno.get('hora');
		}

		return null
	}.property('turnosDesbloqueados', 'turnosBloqueados', 'turnos.@each.hora').cacheable(),

	horaFin : function() {
		var ultimoTurno;

		if(this.get('turnosDesbloqueados').length)
			ultimoTurno = this.get('turnosDesbloqueados').objectAt(this.get('turnosDesbloqueados').length-1);
		else
		{
			if(this.get('turnosBloqueados').length)
				ultimoTurno = this.get('turnosBloqueados').objectAt(this.get('turnosBloqueados').length-1);
		}

		if(ultimoTurno)
			return ultimoTurno.get('horaFinEstimada');

		return null;
	}.property('turnosDesbloqueados', 'turnosBloqueados', 'turnos.@each.hora').cacheable(),

	duracionTotal : function() {
		var f = this.get('horaFin'),
				i = this.get('horaInicio');

		return (f - i) * 1000;
	}.property('horaInicio', 'horaFin'),

	sHoraInicio: function () {
		if(!this.get('horaInicio'))
			return '';

		return moment.unix(this.get('horaInicio')).format('HH:mm [hs]');
	}.property('horaInicio'),

	sHoraFin: function () {
		if(!this.get('horaFin'))
			return '';

		return moment.unix(this.get('horaFin')).format('HH:mm [hs]');
	}.property('horaFin'),

	sDuracionTotal: function () {
		if(!this.get('duracionTotal'))
			return '';

		return moment.cronometro(this.get('duracionTotal'));
	}.property('duracionTotal'),
});

App.CrearTurnoController = Em.Object.extend({
	turno : null,
});

App.CrearTemaController = Em.Object.extend({
	tema : null,
});

App.CrearSesionController = Em.Object.extend({
	sesion : null,
});


App.Timer = Em.Object.extend({
	runLater: null,
	interval : 1000,
	startTime : null,
	lastTime : null,
	endTime : null,
	isRunning : false,

	reset : function(startTime) {
		startTime = startTime || null;

		var d = new Date();
		var currentTime = d.getTime();

		if(startTime){
			this.set('startTime', startTime);
			this.set('lastTime', startTime);
		}else{
			this.set('startTime', currentTime);
			this.set('lastTime', currentTime);
		}

		this.set('endTime', null);
	},

	start : function(startTime) {
		startTime = startTime || null;

		var runLater, timer = this;

		this.reset(startTime);

		this.set('isRunning', true);
		
		runLater = Ember.run.later(this, 'update', this.get('interval'));
		this.set('runLater', runLater);
	},

	stop : function() {
		if(!this.get('runLater'))
			return;

		var d = new Date();
		this.set('endTime', d.getTime());
		this.set('isRunning', false);

		Ember.run.cancel(this.get('runLater'));

		this.set('runLater', null);
	},

	update: function() {
		var runLater, d = new Date();

		this.set('lastTime', (d.getTime()/1000)*1000);

		runLater = Ember.run.later(this, 'update', this.get('interval'));

		this.set('runLater', runLater);
	},

	elapsedTime : function() {
		var lastTime,
			startTime = this.get('startTime');

		if(this.get('endTime') == null){
			lastTime = this.get('lastTime');
		}else{
			lastTime = this.get('endTime');
		}

		return lastTime - startTime;
	}.property('lastTime', 'endTime')
});



