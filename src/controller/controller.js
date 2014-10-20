App.Savable = Ember.Mixin.create({
	saveSuccess: '',
	createSuccess: '',
	creating: false,
	loadError: false,
	
	delete: function () {
		this.set('deleteSuccess', '');
		var url = (this.get('url') + '/%@').fmt(encodeURIComponent(this.get('id')))


		if (this.get('noConcatURL') == true)
		{
			url = this.get('url');
		}

		if (this.get('useApi')) {
			url = App.get('apiController').get('url') + url;
			$.ajax({
				url:  url,
				contentType: 'text/plain',
				dataType: 'JSON',
				type: 'DELETE',
				crossDomain: 'true',
				context: this,
				data : this.getJson(),
				success: this.deleteSucceeded,
				complete: this.deleteCompleted,
			});			
		}
		else 
		{
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'DELETE',
				context: this,
				data : this.getJson(),
				success: this.deleteSucceeded,
				complete: this.deleteCompleted,
			});			
		}		
	},

	deleteSucceeded: function (data) {
		if (this.get('useApi')) {
			this.set('deleteSuccess', true);
		}

		if (data && data.success == true) {
			this.set('deleteSuccess', true);
		}		

		if (this.get('deleteSuccess') == true) 
		{
			if (this.get('notificationType'))
			{
				App.get('ioController').sendMessage(this.get('notificationType'), "modificado" , this.getJson(), this.get('notificationRoom'));
			}

			if (this.get('auditable')) 
			{
				var audit = App.Audit.extend(App.Savable).create();
				audit.set('tipo', 'Test');
				audit.set('accion', 'BORRADO');
				audit.set('usuario', App.get('userController.user.cuil'));
				audit.set('objeto', this.constructor.toString());
				audit.set('objetoId', this.get('id'));
				audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
				audit.set('json', this.getJson().toString());
				audit.set('nombre', this.get('auditNombre'));
				audit.create();				
			}
		}
	},

	deleteCompleted: function (xhr) {

		if (this.get('useApi') && xhr.status == 200) {
			this.set('deleteSuccess', true);
		} 
		else
		{
			this.set('deleteSuccess', false);
		}
	},



	loadCompleted: function(xhr) {

		if(xhr.status == 400 || xhr.status == 420 || xhr.status != 200) {
			this.set('loadError',true);
			App.get('router').transitionTo('page404');
		}

		this.set('loaded', true);
		this.set('loading', false);
	},
	
	load: function () {
		if (!App.get('userController.user')) return;
		
		this.set('loaded', false);
		this.set('loading', true);
		var url = this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		$.ajax({
			url:  (url+ '/%@').fmt(encodeURIComponent(this.get('id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			crossDomain: 'true',
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},
	
	loadSucceeded: function(data) {
		this.setProperties(data);
		this.set('loading', false);
	},

	create: function () {
		this.set('createSuccess', '');
		this.set('creating', true);
		var url = this.get('url');

		if (this.get('useApi')) 
			url = App.get('apiController').get('url') + this.get('url');	

		$.ajax({
			url:  url,
			dataType: 'JSON',
			type: 'POST',
			context: this,
			contentType: 'text/plain',
			data : this.getJson(),
			success: this.createSucceded,
			crossDomain: 'true',
			complete: this.createCompleted,
		});
	},

	createSucceded: function (data) {
		this.set('creating', false);
		if (data) {
			if ((this.get('useApi') || this.get('absolutURL')) && data.id) {
				this.set('id', data.id);
				this.set('createSuccess', true);
			}

			if (data.success == true) {
				this.set('id', data.id);
				if (this.get('notificationType'))
				{
					App.get('ioController').sendMessage(this.get('notificationType'), "creado", this.getJson(), this.get('notificationRoom'));
				}
				this.set('createSuccess', true);
			}
		} else {
			this.set('createSuccess', false);
		}

		if (this.get('createSuccess') == true) 
		{
			if (this.get('auditable')) 
			{
				var audit = App.Audit.extend(App.Savable).create();
				audit.set('tipo', 'Test');
				audit.set('accion', 'Creado');
				audit.set('usuario', App.get('userController.user.cuil'));
				audit.set('objeto', this.constructor.toString());
				audit.set('objetoId', this.get('id'));
				audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
				audit.set('json', this.getJson().toString());
				audit.set('nombre', this.get('auditNombre'));
				audit.create();				
			}
		}	
		
	},

	createCompleted: function(xhr){

		if (this.get('useApi') && xhr.status == 200) {
			this.set('creating', false);
			this.set('createSuccess', true);
		} 
		else
		{
			this.set('creating', false);
			this.set('createSuccess', false);
		}
	},	

	save: function () {
	
		this.set('saveSuccess', '');
		var url = (this.get('url') + '/%@').fmt(encodeURIComponent(this.get('id')))

		if (this.get('noConcatURL') == true)
		{
			url = this.get('url');
		}
		
		if (this.get('useApi')) {
			url = App.get('apiController').get('url') + this.get('url');
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
		}
		else 
		{
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'PUT',
				context: this,
				data : this.getJson(),
				success: this.saveSucceeded,
				complete: this.saveCompleted,
			});			
		}
			

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

		if (this.get('useApi') && data.id) {
			this.set('saveSuccess', true);
		}

		if (data.success == true) {
			this.set('saveSuccess', true);
		}		

		if (this.get('saveSuccess') == true) 
		{
			if (this.get('notificationType'))
			{
				App.get('ioController').sendMessage(this.get('notificationType'), "modificado" , this.getJson(), this.get('notificationRoom'));
			}

			if (this.get('auditable')) 
			{
				var audit = App.Audit.extend(App.Savable).create();
				audit.set('tipo', 'Test');
				audit.set('accion', 'Modificado');
				audit.set('usuario', App.get('userController.user.cuil'));
				audit.set('objeto', this.constructor.toString());
				audit.set('objetoId', this.get('id'));
				audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
				audit.set('json', this.getJson().toString());
				audit.set('nombre', this.get('auditNombre'));
				audit.create();				
			}
		}			
	},
	
	saveCompleted: function(xhr){
		if (this.get('useApi') && xhr.status == 200) {
			this.set('saveSuccess', true);
		} 
		else
		{
			this.set('saveSuccess', false);
		}
	},	
});


App.IoController = Em.Object.extend({
	MODIFICADO: "modificado",
	CREADO: "creado",
	BORRADO: "borrado",
	ORDENADO: "ordenado",

	socket: null,
	connected: false,

	rooms: ['notificaciones'],

	init: function () {
		//if (this.get('connected') == false) 
		//	this.connect();
	},
	
	connect: function () {
		var self = this;

		this.set('socket', io.connect(App.nodeURL, {query: "token=" + App.token}));

		this.get('socket').on('connect', function (data) {
			self.set('connected', true);
			self.recieveMessage();
			self.recieveNotification();
			self.get('rooms').forEach(function (room) {
				self.joinRoom(room, false);
			});
		});

		this.get('socket').on('disconnect', function (data) {
			self.set('connected', false);
		});
	},	


	
	userHandler: function () {
		if (App.get('userController.user')) {
			if (App.get('ioController').get('socket')) {
				App.get('ioController').get('socket.socket').reconnect();
			}
			else {
				App.get('ioController').connect();
			}
		} else {
			if (App.get('ioController').get('socket')) {
				App.get('ioController').get('socket').disconnect();
			}
		}
	}.observes('App.userController.user'),
	

	joinRoom: function (room, addToArray) {
		if (this.get('socket')) {
			this.get('socket').emit('joinRoom', room);
		}

		if (addToArray != false) {
			this.get('rooms').pushObject(room);
		}
			
	},

	leaveRoom: function (room) {
		if (this.get('socket')) {
			this.get('socket').emit('leaveRoom', room);
		}
		else {
			this.get('rooms').removeObject(room);		
		}
	},	

	sendNotification: function (notificacion) {
		this.get('socket').json.emit('notification', notificacion);
	},
	
	sendEmail: function (email) {
		if (this.get('connected')) {
			this.get('socket').json.emit('email', email);
		}
	},
	
	sendMessage: function (type, action, options, room) {
		if (this.get('connected')) {
			var data = {
				type : type,
				action: action,
				options: options,
				room: room,
			};
			this.get('socket').json.emit('message', data);
		} 
	},

	recieveNotification: function () {
		self = this;
		if (this.get('connected')) {		
			this.get('socket').on('notification', function (notificacion) {
				//App.get('notificationController').enviarNotificacion(notificacion);
			});
		}
	},
	
	recieveMessage: function () {
		self = this;
				
		this.get('socket').on('message', function (data) {
			var type = data.type,
					action = data.action,
					options = JSON.parse(data.options),
					room = data.room;
			
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
			case 'Biography': 
				if (App.get('expedientesController')) {
					var exp = App.get('expedientesController.content').findProperty('id', options.idPoryecto);
					if (exp) {
						exp.biografia = App.Biography.extend(App.Savable).create(options);
					}
				}
				break;

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
								App.get('turnosController').stopTimer(turno, false);
						}
					} else {
						if(App.get('turnosController').turnoHablando == turno)
							App.get('turnosController').cancelTimer(turno, false);
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

			case "PlanDeLaborTentativo":
				if (App.get('planDeLaborController')) {
					if (App.get('planDeLaborController.content'))
					{
						if (App.get('planDeLaborController.content.id') == options.id) {
							var pl = App.PlanDeLaborTentativo.create(options);
							pl.desNormalize();
							App.get('planDeLaborController').set('content', pl);
						}
					}
				}
				break;
			case "Asistencia":
				if (App.get('asistenciasController')) {
					if (App.get('asistenciasController.sesion.id') == options.idSesion) {
						App.get('asistenciasController').refresh(options.idDiputados);
					}
				}
				break;
		}
	},

	crear : function (type, options) {
		switch (type) {
			case 'Biography': 
				var bio = App.Biography.extend(App.Savable).create(options);
				var exp = App.get('expedientesController.content').findProperty('id', bio.get('idPoryecto'));
				if (exp) {
					exp.set('biografia', bio);
				}
				break;
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

			case "Notificacion" :
				if (App.get('notificacionesController')) {
					if (App.get('userController.user'))
					{
						//App.get('notificacionesController').addObject(App.Notificacion.create(options));
						$.ajax({
							url: '/notification/' + options.id,
							dataType: 'JSON',
							type: 'POST',
							data : JSON.stringify({cuil: App.get('userController.user.cuil'), estructura: App.get('userController.user.estructura'), funcion: App.get('userController.user.funcion')}),
							context: this,
							success: function (data) {
								if (data.notificaciones) {
									data.notificaciones.forEach(function (notificacion) {
										App.get('notificacionesController').addObject(App.Notificacion.create(notificacion));

										if (App.get('notificacionesFiltradasController')) {
											App.get('notificacionesFiltradasController').addObject(App.Notificacion.create(notificacion));
										}

										App.get('notificationController').enviarNotificacion(notificacion);
									});
								}
							},
						});
					}
				}
				break;		

			case "Asistencia":
				if (App.get('asistenciasController')) {
					if (App.get('asistenciasController.sesion.id') == options.idSesion) {
						App.get('asistenciasController').refresh(options.idDiputados);
					}
				}
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

				App.get('turnosController').set('isUpdated', !App.get('turnosController').get('isUpdated'));

				App.get('turnosController').actualizarHora();
				
				break;

			case 'Tema' :
				var turno, ap;
				
				ap = Ember.ArrayProxy.create({
					content: Ember.A(options)
				});

				ap.forEach(function(item, index){
					tema = App.get('temasController').findProperty('id', item);
					//if (tema)
					//	tema.set('orden', index);
					if (tema) {
						if (tema.get('subTemas')) {
							tema.set('orden', index * 1000);
							tema.get('subTemas').forEach(function (subTema) {
								subTema.set('parentOrden', tema.get('orden'));
							});
						}
						else {
							tema.set('orden', index);
						}
					}					
				});

				App.get('temasController').set('refresh', true);

				App.get('turnosController').actualizarHora();
				break;
		}
	},	
});




App.UserController = Em.Controller.extend({
	user : undefined,
	loginError: false,
	loading: false,


	loginCheckoAuth: function(cuil, password){
		//var url = 'usr/autenticate';
		this.set('loading', true);
		var url = App.get('apiController.authURL') + 'token/';
		$.ajax({
			url:  url,
			type: 'POST',
			context: this,

			data : {grant_type: 'password', username: cuil, password: password, client_id: App.get('apiController.client'), client_secret: App.get('apiController.secret')},
//			data : {grant_type: 'password', username: cuil, password: password, client_id: 1, client_secret: 1},

			success: function( data ) 
			{
				if (data.access_token)
				{
					$.ajaxSetup({
				    	headers: { 'Authorization': data.token_type + ' ' +  data.access_token }
					});	

					App.get('router').transitionTo('loading');
					App.get('router').transitionTo('index');
					var audit = App.Audit.extend(App.Savable).create();

					audit.set('tipo', 'Test');
					audit.set('accion', 'Login');
					audit.set('usuario', cuil);
					audit.set('objeto', 'Login');
					audit.set('objetoId', '');
					audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
					audit.set('json', data.toString());
					audit.set('nombre', 'Login');
					audit.create();	

					this.loginoAuth(cuil, data.access_token, data.token_type);
					localStorage.setObject('user', JSON.stringify({cuil: cuil, access_token: data.access_token, token_type: data.token_type, expires_in: moment().unix() + data.expires_in }));
				}
				else
				{
					this.set('loginError', true);
				}
			},
			complete: function (xhr) {
				var xHRAuthURLController =  App.XHRAuthURLController.create({xhr: xhr});				
				
				if (xHRAuthURLController.hasError()){								
					var response = JSON.parse(xhr.responseText);
					
					this.set('loginError', true);
					this.set('loading', false);
					this.set('loginMessage', xHRAuthURLController.getShowMessage());
					
					_self = this;
					var interval = setInterval(function () {
						_self.set('loginError', false);
						_self.set('loginMessage', '');
						clearInterval(this);
					}, 5000);
					
				}
			},
		});			
	},

	loginoAuth: function (cuil, access_token, token_type) {

		//var urlUserData = 'usr/userdata';
		//var urlUserData = App.get('apiController.url') + 'usr/userdata';
		var urlUserData = App.get('apiController.authURL') + 'info_user/';
		
		var _self = this;
		_self.set('loading', true);

		$.ajax({
			url:  urlUserData,
			//contentType: 'text/plain',
			type: 'GET',
			//data: cuil,
			//dataType: 'JSON',
			context: this,

			complete: function (xhr) {
				var xHRAuthURLController =  App.XHRAuthURLController.create({xhr: xhr});				
				
				if (xHRAuthURLController.hasError()){								
					var response = JSON.parse(xhr.responseText);
					
					this.set('loginError', true);
					this.set('loading', false);
					this.set('loginMessage', xHRAuthURLController.getShowMessage());
					
					_self = this;
					var interval = setInterval(function () {
						_self.set('loginError', false);
						_self.set('loginMessage', '');
						clearInterval(this);
					}, 5000);
					
				}
			},

			success: function (data) {
				_self.set('loading', false);
				
				var tmpUser = App.Usuario.extend(App.Savable).create(data);

				var url = 'user/access';
				var posting = $.post( url, { cuil: tmpUser.get('cuil'), nombre: tmpUser.get('nombre'), apellido: tmpUser.get('apellido'), estructura: tmpUser.get('estructura'), funcion: tmpUser.get('funcion'), email: tmpUser.get('email') });
				posting.done(function( data ){
					data = JSON.parse(data);

					var userRoles = [];
					var roles = data.roles;
					roles.forEach(function (rol){
						userRoles.addObject(App.Rol.create(rol));
					});

					var userRolesMerged = [];
					var rolesmerged = data.rolesmerged;
					rolesmerged.forEach(function (rol){
						userRolesMerged.addObject(App.Rol.create(rol));
					});					

					var userComisiones = [];
					var comisiones = data.comisiones;

					if (comisiones) {
						comisiones.forEach(function (comision){
							userComisiones.addObject(App.Comision.create(comision));
						});
					}

					tmpUser.set('roles', userRoles);
					tmpUser.set('rolesmerged', userRolesMerged);
					tmpUser.set('comisiones', userComisiones);
					tmpUser.set('avatar', data.avatar);
					tmpUser.set('id', data.id);
					tmpUser.set('access_token', access_token);
					tmpUser.set('token_type', token_type);
					tmpUser.set('first_login', data.first_login);
					tmpUser.set('departamento', data.departamento);

					_self.set('user', tmpUser);				
					App.get('notificacionesController').set('content', []);
					App.get('notificacionesController').load();		
					App.get('searchController').load();

					App.notificacionesFiltradasController = App.NotificacionesController.create({content: []});
					App.get('notificacionesFiltradasController').load();
					
					App.advanceReadiness();	
					$('#loadingScreen').remove();		
					if (_self.get('transitionTo')) {
						window.location = '#/' + _self.get('transitionTo');	
					}
					//delete $.ajaxSettings.headers["Authorization"];
				});
			},
			error: function(data){
				App.userController.set('user', null);
				localStorage.setObject('user', null);

				App.get('router').transitionTo('loading');
				App.get('router').transitionTo('index');

				$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente', { life: 5000, theme: 'jGrowl-icon-warning jGrowl-warning'});
			}
		});			
	},

	loginCheck: function(cuil, password){
		//var url = 'usr/autenticate';

		if (App.get('apiController.use_auth')) {
			this.loginCheckoAuth(cuil, password);
		} else {
			var url = App.get('apiController.url') + 'usr/autenticate';
			$.ajax({
				url:  url,
				contentType: 'text/plain',
				type: 'POST',
				context: this,
				data : cuil + "," + password,
				success: function( data ) 
				{
					if (data == true || data == "true")
					{
						this.login(cuil);
					}
					else
					{
						this.set('loginError', true);
					}
				},
			});			
		}		
	},

	login: function (cuil) {

		//var urlUserData = 'usr/userdata';
		var urlUserData = App.get('apiController.url') + 'usr/userdata';
		var _self = this;

		$.ajax({
			url:  urlUserData,
			contentType: 'text/plain',
			type: 'POST',
			data: cuil,
			dataType: 'JSON',

			success: function (data) {
				var tmpUser = App.Usuario.extend(App.Savable).create(data);

				var url = 'user/access';
				var posting = $.post( url, { cuil: tmpUser.get('cuil'), nombre: tmpUser.get('nombre'), apellido: tmpUser.get('apellido'), estructura: tmpUser.get('estructura'), funcion: tmpUser.get('funcion') });
				posting.done(function( data ){
					data = JSON.parse(data);

					var userRoles = [];
					var roles = data.roles;
					roles.forEach(function (rol){
						userRoles.addObject(App.Rol.create(rol));
					});

					var userRolesMerged = [];
					var rolesmerged = data.rolesmerged;
					rolesmerged.forEach(function (rol){
						userRolesMerged.addObject(App.Rol.create(rol));
					});					

					var userComisiones = [];
					var comisiones = data.comisiones;

					if (comisiones) {
						comisiones.forEach(function (comision){
							userComisiones.addObject(App.Comision.create(comision));
						});
					}

					tmpUser.set('roles', userRoles);
					tmpUser.set('rolesmerged', userRolesMerged);
					tmpUser.set('comisiones', userComisiones);
					tmpUser.set('avatar', data.avatar);
					tmpUser.set('id', data.id);

					_self.set('user', tmpUser);


					localStorage.setObject('user', JSON.stringify(tmpUser));
										
					App.get('notificacionesController').load();		
					App.get('searchController').load();

					App.notificacionesFiltradasController = App.NotificacionesController.create({content: []});
					App.get('notificacionesFiltradasController').load();


					App.get('router').transitionTo('loading');
					App.get('router').transitionTo('index');					
				});
			},
		});			
	},

	roles: function () {
		if (this.get('user'))
			return $.map(this.get('user.rolesmerged'), function (value, key) { return value.get('nombre'); })
		else
			return [];
	}.property('user'),

	isLogin: function () {
		return this.get('user') != undefined;
	}.property('user'),

	isFirstLogin: function () {
		if (App.get('apiController.use_auth'))
			return this.get('user.first_login');
		else
			return false;
	}.property('user', 'user.first_login'),

	
	esDiputado: function () {
		if (this.get('roles'))
			return this.get('roles').contains('ROLE_DIPUTADO');
		else
			return false;
	}.property('roles'),

	comisionesQuery: function () {
		var cq = [];
		if (this.get('user.comisiones')) {
			this.get('user.comisiones').forEach(function (comision) {
				cq.pushObject(App.ProyectoQuery.extend(App.Savable).create({nombre: comision.nombre, comision: comision.nombre, editable: false}));
			});
		}
		return cq;
	}.property('user.comisiones.@each'),

	hasRole: function (role) {
		return this.get('roles').contains(role);
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
		
		if (havePermission == 0 && window.webkitNotifications && !App.get('userController').get('esDiputado')) {
			var notification = window.webkitNotifications.createNotification(
			  "bundles/main/beta/img/logoHCDNSmall.png",
			  notificacion.titulo,
			  notificacion.mensaje
			);
			notification.onclick = function () {
			  window.location = notificacion.link;
			  notification.close();
			}
			notification.show();
		}
		else
		{
			$.jGrowl('<a href="' + notificacion.link + '" >' + notificacion.mensaje + '</a>', {life: 5000});
		}
	},
});


App.ApplicationController = Em.Controller.extend({
	loading : false,
	
	socket: null,
	connected: false,
	columns: [3, 7, 2],
	debug: false,

	setLayout: function (left, middle, right) {
		this.set('columns', [left, middle, right]);
	},
	
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
		
		temaController.set('url', 'sesion/%@/temas'.fmt(encodeURIComponent(sesion.get('id'))));
		temaController.load();

		turnosController.set('url', 'sesion/%@/turnos'.fmt(encodeURIComponent(sesion.get('id'))));
		turnosController.load();
	},
});

App.RestController = Em.ArrayController.extend({
	url: '',
	sortUrl: '',
	type: null,
	loaded : false,
	useAPi: true,
	sortProperties: ['id'],
	oldFilterText: '',

	buildURL: function (filterText) {
		var url =  this.get('url');
		this.set('oldFilterText', filterText);
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		url += "?filter=" + filterText;
		return url;		
	},

	filter: function (filterText) {
		this.set('loaded', false);
		this.set('loading', true);

		var url = this.buildURL(filterText);

		if ( url ) {
			$.ajax({
				url: url,
				dataType: 'JSON',
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted,
				crossDomain: 'true',
			});

		}		
	},

	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);
		this.set('loading', false);
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
		this.set('loading', false);
	},

	load: function() {
		if (App.get('userController.user')) {
			this.set('loaded', false);
			this.set('loading', true);
			var url =  this.get('url');
			if (this.get('useApi'))
				url = App.get('apiController').get('url') + url;

				
			if ( url ) {
				$.ajax({
					url: url,
					dataType: 'json',
					context: this,
					success: this.loadSucceeded,
					complete: this.loadCompleted,
					crossDomain: 'true',
				});
			}
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

		if (this.get('useApi')) {
			url = App.get('apiController').get('url') + url;	
		}


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
		App.get('ioController').sendMessage(this.get('notificationType'), "ordenado", JSON.stringify(data.orden), this.get('notificationRoom'));

	}
});

App.ConfirmActionController = Ember.Object.extend({
	success: false,
	title: '',
	message: '',
	ok: 'Confirmar',
	cancel: 'Cancelar',

	show: function () {
		App.ConfirmActionPopupView.popup();
	},
});

App.UploaderController = Ember.Object.extend({
	content: null,
	folder: '',
	url: '',
	file:'',
	folder:'',
	view: '',
	formDataView:'',

	fileChange: function () {
		_self = this;
		var formData = this.formDataView;

		$.ajax({
			url: 'upload.php',  //server script to process data
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,      
			xhr: function() {  // custom xhr
				myXhr = $.ajaxSettings.xhr();			
				return myXhr;
			},
			beforeSend: function(){

			},
			success: function(payload)
			{
				data = JSON.parse(payload);
				if (data.result == "ok") {
					_self.set('file', data.file);
				} 
			}
		});
	},

});

App.PlanDeLaborController = Ember.Object.extend({
	content: null,
	url: "pdl/plan/%@",
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
			url: (App.get('apiController').get('url') + this.get('url')).fmt(encodeURIComponent(this.get('content.id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},
	
	loadSucceeded: function(data) {
		item = App.PlanDeLaborTentativo.extend(App.Savable).create();
		item.setProperties(data);
		item.desNormalize();
		this.set('content', item);
		this.set('loaded', true);
	},	

	plActual: function () {
		var tema = App.get('temaController.content');
		var obj = null;
		if (tema && App.get('planDeLaborController.content')) {
			switch (tema.get('plTipo')) {
				case "p": 
					if (App.get('planDeLaborController.content.items')) 
						obj = App.PlanDeLaborTentativoItem.create(App.get('planDeLaborController.content.items').findProperty('id', tema.get('plItemId')));
					break;
				case "d":
					if (App.get('planDeLaborController.content.items')) 
						var item = App.get('planDeLaborController.content.items').findProperty('id', tema.get('plItemId'));
						if (item) {
							obj = App.OrdeDelDia.create(item.get('dictamenes').findProperty('id', tema.get('plId')));
						}
					break;
				case "e":
					if (App.get('planDeLaborController.content.items')) 
						var item = App.get('planDeLaborController.content.items').findProperty('id', tema.get('plItemId'));
						if (item) {
							obj = App.Expediente.create(item.get('proyectos').findProperty('id', tema.get('plId')));
						}
					break;
				case "t":
					return null;
			}
		}
		return obj;
	}.property('App.temaController.content', 'App.planDeLaborController.content'),

	plEsPaquete: function () {
		var tema = App.get('temaController.content');
		return tema.get('plTipo') == 'p';
	}.property('App.temaController.content', 'App.planDeLaborController.content'),

	plEsDictamen: function () {
		var tema = App.get('temaController.content');
		return tema.get('plTipo') == 'd';
	}.property('App.temaController.content', 'App.planDeLaborController.content'),


	plEsProyecto: function () {
		var tema = App.get('temaController.content');
		return tema.get('plTipo') == 'e';
	}.property('App.temaController.content', 'App.planDeLaborController.content'),	
});

App.PlanDeLaborListadoController = App.RestController.extend({
	url: 'pdl/planesdelabor/estado/',
	sortProperties: ['fechaEstimada'],
	sortAscending: false,
	useApi: true,
	loaded: false,
	type: App.PlanDeLaborTentativo,

	load: function () {
		this.set('url', this.get('url') + this.get('estado'));
		this._super();
	},

	createObject: function (data, save) {
		save = save || false;
		
		item = App.PlanDeLaborTentativo.create(data);
		item.setProperties(data);
		this.addObject(item);
	},		
});


//Dictamenes

App.DictamenesPendientesController = App.RestController.extend({
	url: 'dic/dictamenes/pendientes/01/01/2014/31/12/2014',
	type: App.Dictamen,
	useApi: true,
	sortProperties: ['fechaReunion'],
	sortAscending: false,

	createObject: function (data, save) {
	
		save = save || false;
		var comision_id = null;

		if (data.reunion.comisiones) {
			comision_id = data.reunion.comisiones[0].comision.id;
		}

		item = App.Dictamen.extend(App.Savable).create(data.evento);
		item.setProperties(data.evento);
		item.set('fechaReunion', data.reunion.fecha);
		item.set('comision_id', comision_id);
		item.set('comisiones', data.reunion.comisiones);

		if (item.get('textos').length == 0)
			this.addObject(item);
	},	
});

//OD


// Visitas GUiadas
App.VisitasGuiadasEstadisticasController = App.RestController.extend({
	url: 'visitas-guiadas/estadisticas',
	useApi: false,
	loaded: false,
	type: App.VisitaGuiadaEstadistica,
	content: null,
	createObject: function (data, save) {
		save = save || false;
		
		item = App.VisitaGuiadaEstadistica.create(data);
		item.setProperties(data);
		this.addObject(item);
	},
	estadisticasPorDiaHorario: function(){
		var _self = this;
		var data = [];
		var dias = {'LUNES':[], 'MARTES':[], 'MIERCOLES':[], 'JUEVES':[], 'VIERNES':[]};
		var lista_dias = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
		var lista_horarios = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];

		if(this.get('content'))
		{		
			lista_dias.forEach(function(dia){
				lista_horarios.forEach(function(horario){
					var encontrado = false;
					
					_self.get('content').forEach(function(item){
						 if(dia == item.diaPreferencia && item.horario == horario)
						 {
							encontrado = true;
							dias[dia].push(parseInt(item.visitantes));						
						}
					});
				
					if(!encontrado) dias[dia].push(0);            
				});
			});

			$.map(dias, function(value, key){ data.push({"name":key, "data":value}); });
		}

		return data;
	}.property('content.@each'),

});

App.VisitasGuiadasController = App.RestController.extend({
	url: 'visitas-guiadas',
	useApi: false,
	loaded: false,
	type: App.VisitaGuiada,
	content: null,
	sortProperties: ['id'],
	sortAscending: false,

	createObject: function (data, save) {
		save = save || false;
		
		item = App.VisitaGuiada.create(data);
		item.setProperties(data);
		this.addObject(item);
	},
	estadisticasPorProvinciaTable: function(){
		var data = [];
		var provincias;
		var _self = this;

		if (this.get('content'))
		{
			provincias = $.map(this.get('content'), function(key){ return key.provincia; }).sort(); // Recorro cada item
			provincias_unique = provincias.uniq(); // Elimino repetidos

			provincias_unique.forEach(function(item){
				var cant = 0;
				provincia_list = _self.get('arrangedContent').filterProperty('provincia', item);			    
				provincia_list.forEach(function(item){
					if(item.visitantes){
						cant+=parseInt(item.visitantes);
					}
				});

				var fila = App.VisitaGuiadaEstadisticaTable.create({provincia: item, cantPersonas: cant});
				data.push(fila);
			});
		}

		return data;		
	}.property('content.@each'),

	estadisticasPorProvincia: function(){
		var data = [];
		var provincias;
		var _self = this;

		if (this.get('content'))
		{

			var total = 0;

			provincias = $.map(this.get('content'), function(key){ return key.provincia; }).sort(); // Recorro cada item
			provincias_unique = provincias.uniq(); // Elimino repetidos

			provincias_unique.forEach(function(item){
				var cant = 0;
				provincia_list = _self.get('arrangedContent').filterProperty('provincia', item);			    
				provincia_list.forEach(function(item){
					if(item.visitantes){
						cant+=parseInt(item.visitantes);
					}
				});

				data.push({name: item, y: cant});

				total += cant;
			});



			data.forEach(function(item){
				item.y = item.y * 100 / total;
			});

		}

		return data;

	}.property('content.@each'),

	estadisticasPorTipoInstitucion: function(){
		var data = [];		
		var tipoInstituciones;
		var _self = this;

		if (this.get('content'))
		{
			tipoInstituciones = $.map(this.get('content'), function(key){ return key.visitaPara; }).sort(); // Recorro cada item
			tipoInstituciones_unique = tipoInstituciones.uniq(); // Elimino repetidos

			tipoInstituciones_unique.forEach(function(item){
				var cant = 0;
				tipoInstituciones_list = _self.get('arrangedContent').filterProperty('visitaPara', item);			    
				tipoInstituciones_list.forEach(function(item){
					if(item.visitantes){
						cant+=parseInt(item.visitantes);
					}
				});

				data.push({name: item, y: cant});
			});
		}

		return data;
	}.property('content.@each'),

	estadisticasPorNivelAlumnos: function(){
		var data = [];				
		var nivelesAlumnos;
		var _self = this;

		if (this.get('content'))
		{
			nivelesAlumnos = $.map(this.get('content'), function(key){ return key.nivelAlumnos; }).sort(); // Recorro cada item
			nivelesAlumnos_unique = nivelesAlumnos.uniq(); // Elimino repetidos

			nivelesAlumnos_unique.forEach(function(item){
				var cant = 0;
				nivelesAlumnos_list = _self.get('arrangedContent').filterProperty('nivelAlumnos', item);			    
				nivelesAlumnos_list.forEach(function(item){
					if(item.visitantes){
						cant+=parseInt(item.visitantes);
					}
				});

				data.push({name: item, y: cant});
			});
		}

		return data;
	}.property('content.@each'),

	estadisticasPorMes: function(){			
		var meses = [{name:"Enero",y:0} ,{name:"Febrero",y:0} ,{name:"Marzo",y:0} ,{name:"Abril",y:0} ,{name:"Mayo",y:0} ,{name:"Junio",y:0} ,{name:"Julio",y:0} ,{name:"Agosto",y:0} ,{name:"Septiembre",y:0} ,{name:"Octubre",y:0} ,{name:"Noviembre",y:0} ,{name:"Diciembre",y:0}];
		var _self = this;
		var anioActual = new Date().getUTCFullYear();		
		if (this.get('content'))
		{
			this.get('content').forEach(function(item){
				if(item.fechaPreferencia){
					itemDate = new Date(item.fechaPreferencia);
					if(anioActual == itemDate.getUTCFullYear()){
						var index = itemDate.getMonth();
					
						if(index >= 0){
							if(item.visitantes){
								meses[index].y += parseInt(item.visitantes);
							}
						}
					}
				}
			});
		}

		return meses.map(function(e) { return e.y; });
	}.property('content.@each'),

});



App.VisitaGuiadaConsultaController = Ember.Object.extend({
	url: 'visitas-guiadas/visita/%@',
	type: App.VisitaGuiada,
	useApi: false,

	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420){ }
		this.set('loaded', true);		
	},
	
	load: function () {
		if (App.get('userController.user')) {
			this.set('loaded', false);

			$.ajax({
				url:  (this.get('url')).fmt(encodeURIComponent(this.get('content').get('id'))),
				type: 'GET',
				dataType: 'JSON',
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted
			});
		}
	},
				
	loadSucceeded: function(data) {
		item = App.VisitaGuiada.extend(App.Savable).create();		
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);

		App.auditController = App.AuditController.create();




        fn = function() {
            App.get('auditController').removeObserver('loaded', this, fn);	            			
        };

        App.get('auditController').addObserver('loaded', this, fn);


		App.auditController.loadByIdNameObject(this.get('content').id, this.get('content').constructor.toString());
		


		this.get('content').audits = App.get('auditController.content');

	},	
});


//Notificaciones

App.NotificacionesController = App.RestController.extend({
	url: 'notification/all',
	type: App.Notificacion,
	useApi: false,
	sortProperties: ['fecha'],
	sortAscending: false,
	oldUnreads: 0,

	load: function() {

		if (App.get('userController.user.roles.length') > 0) {
			this.set('loaded', false);
			var url =  this.get('url');
			
			if ( url ) {
				$.ajax({
					url: url,
					dataType: 'JSON',
					type: 'POST',
					data : JSON.stringify({cuil: App.get('userController.user.cuil'), estructura: App.get('userController.user.estructura'), funcion: App.get('userController.user.funcion')}),
					context: this,
					success: this.loadSucceeded,
					complete: this.loadCompleted,
				});
			}
		}
	},

	parse : function (data) {
		return data.notificaciones;
	},

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Notificacion.extend(App.Savable).create(data);
		item.setProperties(data);

		this.addObject(item);

	},	


	unreadCount: function () {
		var count = 0;
		if (this.get('content')) {
			var unreads = this.get('content').filterProperty('leida', false);
			if (unreads) {
				count = unreads.length;
			}
		}
		this.set('unreads', count);
	}.observes('content', 'content.@each.leida'),

	unreads: 0,

	checkUnreads: function () {
		this.set('oldUnreads', this.get('unreads'));
	},

	haveNews: function () {
		if (this.get('oldUnreads') == this.get('unreads'))
			return false;
		else
			if (this.get('unreads') >= this.get('oldUnreads'))
				return true;
			else
				return false;
	}.property('unreads', 'oldUnreads'),

	marcarTodas: function () {
		var unreads = this.get('content').filterProperty('leida', false);
		if (unreads) {
			unreads.forEach(function (notificacion) {
				notificacion.set('leida', true);
			});

			var ns = $.map(unreads, function(notificacion) { return notificacion.id; });
	        this.set('notificacionLeida', App.NotificacionLeida.extend(App.Savable).create({idNotificacion: this.get('content.id'), cuil:App.userController.user.cuil, duplicated: ns}));
	        this.get('notificacionLeida').addObserver('createSuccess', this, this.createSuccessed);
	        this.set('loading', true);
	        this.get('notificacionLeida').create();
		}
	},

	deleteByObjectId: function(id){
		var url =  'notification/' + id;

		$.ajax({
			url: url,
			dataType: 'JSON',
			type: 'DELETE',
			context: this,			
		});
	},

});


App.NotificacionesGruposController = App.RestController.extend({
	url: 'notification/gruops',
	type: App.NotificacionGrupo,
	useApi: false,

	load: function() {
		this.set('loaded', false);
		var url =  this.get('url');

		if ( url ) {
			$.ajax({
				url: url,
				dataType: 'JSON',
				type: 'POST',
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
		
		item = App.NotificacionGrupo.extend(App.Savable).create(data);
		item.setProperties(data);

		this.addObject(item);

	},	
});
//UserLogin
App.UsuariosController = App.RestController.extend({
	url: 'user/users',
	type: App.Usuario,
	useApi: false,
	sortProperties: ['nivel'],
	sortAscending: false,

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Usuario.extend(App.Savable).create(data);
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

App.EstructurasController = App.RestController.extend({
	url: 'user/estructuras',
	type: App.Estructura,
	useApi: false,
	sortProperties: ['nombre'],
	sortAscending: false,

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Estructura.extend(App.Savable).create(data);
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

App.FuncionesController = App.RestController.extend({
	url: 'user/funciones',
	type: App.Funcion,
	useApi: false,
	sortProperties: ['nombre'],
	sortAscending: false,

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Funcion.extend(App.Savable).create(data);
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

App.RolesController = App.RestController.extend({
	url: 'user/roles',
	type: App.Rol,
	useApi: false,
	sortProperties: ['nombre'],
	sortAscending: true,

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Rol.extend(App.Savable).create(data);
		item.setProperties(data);
		
		if(save){
			$.ajax({
				url: '/user/rol',
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

	loadSucceeded: function(data){
		var item, items = this.parse(data);		
		
		if(!data || !items){
			this.set('loaded', true);
			return;
		}

		// this.set('content', [App.Rol.create({id: -1, nombre: 'Seleccione un Rol'})]);
		this.set('content', []);
		items.forEach(function(i){
			this.createObject(i);
		}, this);
		
		this.set('loaded', true);
	},	
});

App.NotificacionTipoConsultaController = Ember.ObjectController.extend({

})

App.NotificacionTipoController = Ember.Object.extend({
	url: 'notification/types/%@',
	type: App.NotificacionTipo,
	useApi: false,

	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420){ }
		this.set('loaded', true);		
	},
	
	load: function () {
		if (App.get('userController.user')) {
			this.set('loaded', false);
			$.ajax({
				url:  (this.get('url')).fmt(encodeURIComponent(this.get('content').get('id'))),
				type: 'GET',
				dataType: 'JSON',
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted
			});
		}
	},
				
	loadSucceeded: function(data) {
		item = App.NotificacionTipo.extend(App.Savable).create();		
		item.setProperties(data);
		this.set('content', item);

		var roles = []
		this.get('content.roles').forEach(function(rol){
			roles.addObject(App.Rol.extend(App.Savable).create(rol));
		});
		this.set('content.roles', roles);

		var comisiones = []
		this.get('content.comisiones').forEach(function(comision){
			comisiones.addObject(App.Comision.extend(App.Savable).create(comision));
		});
		this.set('content.comisiones', comisiones);

		var estructuras = []
		this.get('content.estructuras').forEach(function(estructura){
			estructuras.addObject(App.Estructura.extend(App.Savable).create(estructura));
		});
		this.set('content.estructuras', estructuras);

		var funciones = []
		this.get('content.funciones').forEach(function(funcion){
			funciones.addObject(App.Funcion.extend(App.Savable).create(funcion));
		});
		this.set('content.funciones', funciones);

		this.set('loaded', true);
	},	
});

App.NotificacionTiposController = App.RestController.extend({
	url: 'notification/types',
	type: App.NotificacionTipo,
	useApi: false,
	sortProperties: ['nivel'],
	sortAscending: false,

	createObject: function (data, save) {
		save = save || false;
		item = App.NotificacionTipo.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},
})

App.DiputadosPartidosController = App.RestController.extend({
	url: 'blo/bloques',
	type: App.DiputadoPartido,
	useApi: true,
	sortAscending: true,
	loaded: false,
	async: false,
	data: [],

	filter: function (text) {
		var regex = new RegExp(text.toString().toLowerCase());
		
		filtered = this.get('data').filter(function(partido) {
			return regex.test(partido.get('label').toLowerCase());
		});	
			
		this.set('content', filtered);
	},

	loadSucceeded: function(data){
		var item, items = this.parse(data);
		
		this.set('content', []);

		if(!data || !items){
			this.set('loaded', true);
			return;
		}

		items.forEach(function(i){
			if(i.grupo == 'CD')
			{
				this.createObject(i);
			}
		}, this);
		
		this.set('loaded', true);
	},

	createObject: function (data, save) {
		save = save || false;
		var item = App.DiputadoPartido.extend(App.Savable).create(data);
		item.setProperties(data);
		this.get('data').addObject(item);
	},
});

App.ExpedientesArchivablesController = App.RestController.extend({
	url: 'exp/proyectos/archivables',
	type: App.ExpedienteArchivable,
	useApi: true,
	sortProperties: ['fechaPub'],
	sortAscending: true,
	loaded: false,
	async: false,

	comisionChange: function () {
		this.set('content', []);
	}.observes('App.expedientesArchivablesController.comision'),

	buildURL: function (filterText) {	
		var url =  this.get('url');

		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		
		//url += "/" + filterText;

		url += "?expdip=" + filterText;

		url += this.appendURLforComision();

		return url;		
	},
	appendURLforComision: function () {
		var comision = App.get('expedientesArchivablesController.comision');
		if (comision)
			return "&comision=" + comision.nombre;				
		else
			return "";
	},

	loadSucceeded: function(data){
		var item, items = this.parse(data);
		
		this.set('content', []);

		if(!data || !items){
			this.set('loaded', true);
			return;
		}

		items.forEach(function(i){
			this.createObject(i);
		}, this);
		
		this.set('loaded', true);
	},

	createObject: function (data, save) {
	
		save = save || false;
		
		var item = App.ExpedienteArchivable.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);	
	},	
});

App.ExpedientesController = App.RestController.extend({
	url: 'exp/proyectos',
	type: App.Expediente,
	useApi: true,
	sortProperties: ['expdipA', 'expdipN'],
	sortAscending: false,
	loaded: false,
	loaded2012: false,
	pageSize: 25,
	pageNumber: 1,

	query: null,

	buildURL: function (filterText) {
		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		url += "/" + filterText;
		return url;		
	},

	init : function(){
		this._super();
	},

	nextPage: function () {
		this.set('pageNumber', this.get('pageNumber') + 1);
		this.load();
	},

	load: function() {
		if (App.get('userController.user')) {		
			this.set('loaded', false);
			var url =  this.get('url');
			if (this.get('useApi'))
				url = App.get('apiController').get('url') + url;

			url = url + "?pageNumber=" + this.get('pageNumber') + "&pageSize=" + this.get('pageSize');


			if (this.get('query')) 
			{
				url += this.get('query').get('parameters');
			}

			if ( url ) {
				$.ajax({
					url: url,
					dataType: 'JSON',
					context: this,
					success: this.loadSucceeded,
					complete: this.loadCompleted,
				});

			}
		}
	},

	loadSucceeded: function(data){
		var item, items = this.parse(data);

		if(!data || !items){
			App.get('expedientesController').set('loaded', true);
			return;
		}

		items.forEach(function(i){
			this.createObject(i);
		}, this);
		
		App.get('expedientesController').set('loaded', true);
	},

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Expediente.extend(App.Savable).create(data);
		item.setProperties(data);

		this.addObject(item);
	},	
});

App.ExpedientesArchivadosController = App.RestController.extend({
	url: 'exp/proyectos/archivables',
	type: App.ExpedienteBase,
	useApi: true,
	sortProperties: ['fechaPub'],
	sortAscending: true,
	loaded: false,

	buildURL: function (filterText) {
		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		url += "/" + filterText;
		return url;		
	},

	loadByAnio: function (anio) {
		this.set('content', []);
		this.set('url', '/exp/proyectos/' + anio);
		this.load();
	},

	createObject: function (data, save) {
		save = save || false;
		
		item = App.ExpedienteBase.extend(App.Savable).create(data);
		item.setProperties(data);
		
		this.addObject(item);

	},	
});


// Envios a archivo
App.EnvioArchivoController = App.RestController.extend({
	url: 'com/env/envios',
	type: App.Envio,
	useApi: true,
	sortProperties: ['fechaUltimaModificacion'],
	sortAscending: false,


	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Envio.extend(App.Savable).create(data);
		item.setProperties(data);
		
		App.get('userController.user.comisiones').forEach(function(comision){
			if (item.comision.id == comision.id){
				App.get('envioArchivoController').addObject(item);
			}
		});	
	},
	loadByComisionesUser: function () {
		this.set('loaded', false);

		var roles = App.get('userController.roles').join();

		$.ajax({
			url:  (App.get('apiController').get('url') + this.get('url')),
//			url:  (App.get('apiController').get('url') + this.get('url') + '/' + roles),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},
	loadCompleted: function(xhr) {
		if(xhr.status == 400 || xhr.status == 420){ }
		this.set('loaded', true);		
	},

	loadSucceeded: function(data){
		this._super(data);
		this.set('loaded', true);
	},

});

App.EnvioArchivoConsultaController = Ember.Object.extend({
		content: '',
		url: 'com/env/envio/%@',
	loaded : false,
	useApi: true,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420){ }
		this.set('loaded', true);		
	},
	
	load: function () {
		if (App.get('userController.user')) {		
			this.set('loaded', false);
			$.ajax({
				url:  (App.get('apiController').get('url') + this.get('url') + '/%@').fmt(encodeURIComponent(this.get('content').get('id'))),
				type: 'GET',
				dataType: 'JSON',
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted
			});
		}
	},
				
		loadSucceeded: function(data) {
		item = App.Envio.create();
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);
	},

});


App.CitacionesController = App.RestController.extend({
	url: 'cit/citaciones/%@',
	type: App.Citacion,
	anio: '',
	useApi: true,
	sortProperties: ['start'],
	sortAscending: false,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	load: function() {
		if (App.get('userController.user')) {		
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
		}
	},	
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Citacion.extend(App.Savable).create(data);
		item.setProperties(data);
		item.set('fecha', data.start);

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

	citaciones: function () {
		var roles = App.get('userController.roles');
		var citaciones = [];
		var comsiones = App.get('userController.user.comisiones');


		if(roles.contains('ROLE_DIRECCION_COMISIONES') || roles.contains('ROLE_SEC_PARL_VIEW'))
		{
			citaciones = this.get('arrangedContent');
		}
		else
		{			
			if(roles.contains('ROLE_SECRETARIO_COMISIONES'))
			{
				this.get('arrangedContent').forEach(function (citacion) {
					comsiones.forEach(function (comision) {
						citacion.get('comisiones').forEach(function (c) {
							if (c.id == comision.id)
							{
								citaciones.pushObject(citacion);
								return true;
							}

							return false;
						});
					});
				});
			}
			else
			{
				if(roles.contains('ROLE_DIPUTADO'))
				{
					this.get('arrangedContent').forEach(function (citacion) {
						if(citacion.get('estado.id') != 1) // confirmadas && suspendidas
						{
							comsiones.forEach(function (comision) {
								citacion.get('comisiones').forEach(function (c) {
									if (c.id == comision.id)
									{
										citaciones.pushObject(citacion);
										return true;
									}

									return false;
								});
							});	
						}
					});
				}
			}
		}

		return citaciones;
	}.property('content'),
});

App.CaracterDespachoController = App.RestController.extend({
	url: '//',
	type: App.CaracterDespacho,
	useApi: true,
	
	init : function () {
		this._super();
	},

	load: function() {
		if (App.get('userController.user')) {		
			this.set('content', []);
			for (var i = 0; i < 10; i++) {
				item = App.CaracterDespacho.create();
				this.addObject(item);
			};
			this.set('loaded', true);
		}
	},

	loadSucceeded: function(data){
		this._super(data);

	},
	
	createObject: function (data, save) {
		save = save || false;
		
		item = App.CaracterDespacho.create(data);
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

App.ParteEstadosController = App.RestController.extend({
	url: 'par/secciones',
	type: App.ParteEstado,
	useApi: true,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		save = save || false;
		
		item = App.ParteEstado.create(data);
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

App.FirmantesController = App.RestController.extend({
	tipo: 'pap/dip/diputados',
	url: moment().format('DD/MM/YYYY') + '/resumen',
	type: App.FirmanteTextoDictamen,
	useApi: true,
	comision_id: '',
	sortProperties: ['apellido', 'nombre'],
	sortAscending: true,
	loaded: false,

	init : function () {
		this._super();
	},

	load: function () {	
		if (App.get('userController.user')) {	
			_self = this;
			this.set('loaded', false);
			if (this.get('tipo') != '') {
				$.ajax({
					url: (App.get('apiController').get('url') + this.get('tipo') + '/' + this.get('url')),
					type: 'GET',
					dataType: 'JSON',
					context: this,
					success: this.loadSucceeded,
					complete: this.loadCompleted
				});
			}
		}

	},	

/*
	load: function () {
		if (this.get('comision_id')) {
			this.set('url', this.get('url').fmt(encodeURIComponent(this.get('comision_id'))));
		}
		
		this._super();
	},
*/
	loadSucceeded: function(data){
		this._super(data);
		this.set('loaded', true);
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.FirmanteTextoDictamen.create({diputado: data, apellido: data.datosPersonales.apellido, id: data.id});
		this.addObject(item);
	},	
});

App.CitacionEstadosController = App.RestController.extend({
	url: 'citEst/estados',
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
	url: 'sal/salas',
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
	url: 'pap/com/comisionesFull',
	type: App.Comision,
	selected: '',
	sortProperties: ['nombre'],
	sortAscending: true,	
	useApi: true,
	
	init : function () {
		this._super();
	},

	// load: function() {
	// 	this.set('loaded', false);
	// 	this.loadSucceeded(localStorage.getObject('comisiones'));
	// },
	//
/*
	load: function () {
		this._super();
		_self = this;
		this.set('loaded', false);

		$.ajax({
//			url: (App.get('apiController').get('productionURL') + this.get('url')).fmt(encodeURIComponent(this.get('content').get('id'))),
			url: this.get('url').fmt(encodeURIComponent(this.get('content').get('id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},	
*/

	//grupo

	loadSucceeded: function(data){
		var item, items = this.parse(data);		
		
		if(!data || !items){
			this.set('loaded', true);
			return;
		}

		this.set('content', []);
		items.forEach(function(i){
			if ((!i.grupo) || (i.grupo != 'CS')) {
				this.createObject(i);
			}
		}, this);
		
		this.set('loaded', true);
		this.set('loading', false);
	},	


	createObject: function (data, save) {
		save = save || false;
		//item = App.Comision.create(data);
		item = App.Comision.extend(App.Savable).create(data);
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

App.OrdenDelDiaController = Ember.Object.extend({
	content: null,
	url: "dic/dictamen/%@",
//	url: "/od/orden/del/dia",
	loaded : false,
	useApi: true,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);
	},

	load: function () {
		if (App.get('userController.user')) {
			_self = this;
			this.set('loaded', false);
			$.ajax({
				url: (App.get('apiController').get('url') + this.get('url')).fmt(encodeURIComponent(this.get('content').get('id'))),
				type: 'GET',
				dataType: 'JSON',
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted
			});
		}
	},	

	loadSucceeded: function(data) {
		item = App.OrdeDelDia.create();
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);
	},	
});

App.DictamenConsultaController = Ember.Object.extend({
	content: null,
	url: 'par/evento/%@',
//	url: "/par/parte/%@",
//	url: "/dic/dictamen/%@",
//	url: "/od/orden/del/dia",
	loaded : false,
		useApi: true,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);

		var textos = [];

		this.get('content.textos').forEach(function(texto){
			textos.pushObject(App.DictamenTexto.create(texto));
		});

		this.set('content.textos', textos);
	},

	load: function () {
		if (!App.get('userController.user')) return;
		_self = this;
		this.set('loaded', false);
		$.ajax({
			url: (App.get('apiController').get('url') + this.get('url')).fmt(encodeURIComponent(this.get('content').get('id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},	

	loadSucceeded: function(data) {
		item = App.Dictamen.create();
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);
	},	
});

App.DictamenCrearController = Ember.Object.extend({
	content: null,
	loaded : false,
	useApi: false,
	
		load: function () {
			this.set('loaded', true); 
		},
});


App.DictamenController = Ember.Object.extend({
	content: null,
	url: "par/evento/%@",
	loaded : false,
	useApi: false,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}		
		this.set('loaded', true);		
	},
	
	load: function () {
		if (!App.get('userController.user')) return;
		this.set('loaded', false);
		$.ajax({
			url: (App.get('apiController').get('url') + this.get('url')).fmt(encodeURIComponent(this.get('content.id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
	},
	
	loadSucceeded: function(data) {
		item = App.Dictamen.create();
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);
	},	
});


App.ExpedienteConsultaController = Ember.Object.extend({
	content: null,
	url: "exp/proyecto/%@",
	loaded : false,
	useApi: true,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420){ }
		this.set('loaded', true);		
	},
	
	load: function () {
		if (!App.get('userController.user')) return;
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

App.ProyectoConsultaController = App.ExpedienteConsultaController.extend({
	url: 'ME/exp/proyecto/%@',
	
});

App.DictamenesController = App.RestController.extend({
	url: 'dic/dictamenes/01/01/2014/31/12/2014',
	type: App.Dictamen,
	useApi: true,
	sortProperties: ['fechaReunion'],
	sortAscending: false,
		
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},

	load: function() {
		this._super();
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Dictamen.create(data.evento);
		item.setProperties(data.evento);
		
		if (data.reunion)
		{
			item.set('fechaReunion', data.reunion.fecha);
			item.set('comisiones', data.reunion.comisiones);
		}


		//if (data.dictamen == null && item.get('textos').length >= 1)
		if (item.get('textos').length >= 1)
			this.addObject(item);	
	},		
});

App.DictamenesSinOdController = App.RestController.extend({
	url: 'dic/dictamenes/01/01/2014/31/12/2014',
	type: App.Dictamen,
	useApi: true,
	sortProperties: ['fechaReunion'],
	sortAscending: false,
	
	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		this._super(data);
	},

	load: function() {
		this._super();
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Dictamen.create(data.evento);
		item.setProperties(data.evento);
		if (data.reunion) {
			item.set('fechaReunion', data.reunion.fecha);
		}
		//item.set('comisiones', data.reunion.comisiones);

		if (data.dictamen == null && item.get('textos').length >= 1)
			this.addObject(item);	
	},		
});

App.OrdenesDelDiaController = App.RestController.extend({
	url: 'dic/ods/vigentes/130',
	type: App.OrdeDelDia,
	useApi: true,

	sortProperties: ['fechaImpresion', 'numero'],
	sortAscending: false,

	init : function () {
		this._super();
	},
	loadSucceeded: function(data){
		this._super(data);
	},
	
	createObject: function (data, save) {
		save = save || false;
		item = App.OrdeDelDia.create(data);
		item.setProperties(data);
		this.addObject(item);	
	},		
});


App.ParteConsultaController = Ember.Object.extend({
	content: '',
});

App.ParteCrearController = Ember.Object.extend({
	content: '',
});

App.PartesController = App.RestController.extend({
	url: 'parte/partes',
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

App.EventosParteController = App.RestController.extend({
	url: 'par/secciones',
	type: App.EventoParte,
	useApi: true,
	
	createObject: function (data, save) {
		save = save || false;
		item = App.EventoParte.create(data);
		item.setProperties(data);
		this.addObject(item);	
	},			
});

App.ReunionesSinParteController = App.RestController.extend({
	url: 'com/reun/sp',
	type: App.Reunion,
	useApi: true,
	loaded : false,

	init : function () {
		this._super();
	},

	loadSucceeded: function(data){
		if(data.length > 0)
		{
			this._super(data);
		}
	},	

	createObject: function (data, save) {
		save = save || false;
		item = App.Reunion.create(data);
		item.setProperties(data);
		
		this.addObject(item);	
	},	
	
	reuniones: function () {
		var reuniones = [];
		if (App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SEC_PARL_VIEW')) {
			reuniones = this.get('content');
		} else {
			
			var comsiones = App.get('userController.user.comisiones');

			this.get('arrangedContent').forEach(function (reunion) {
				comsiones.forEach(function (comision) {
					reunion.get('citacion.comisiones').forEach(function (c) {
						if (c.id == comision.id) {
							reuniones.pushObject(reunion);
							return true;
						}
						return false;
					});
				});
			});
		}
		return reuniones;
	}.property('content'),	

	reunionesFilterByComisiones: function(data){
		var reuniones = [];
		var comisiones_input = [];

		if(data)
		{
			comisiones_input.push(data);
		}
		else
		{
			comisiones = $.map(App.get('userController.user.comisiones'), function(comision){ return comision; });			
			comisiones.forEach(function (c) {
				comisiones_input.push(c);
			})
		}

		this.get('reuniones').forEach(function (reunion){
			comisiones_input.forEach(function (comision_input){
				reunion.citacion.comisiones.forEach(function (comision){
					if(comision.id == comision_input.id)
					{
						reuniones.pushObject(reunion);	
						return true;
					}					

					return false;
				});
			});
		});
		return reuniones;
	},

	comisionChange: function(){
		var comision 	= this.get('comision');
		var reuniones 	= this.reunionesFilterByComisiones(comision);
		
		this.set('listado', reuniones); 

	}.observes('comision'),
});

App.ReunionesConParteController = App.ReunionesSinParteController.extend({
	url: 'com/reun/cp/' /* + moment().format('DD/MM/YYYY')*/,
	type: App.Reunion,
	useApi: true,
	loaded : false,
	
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
	url: "com/reun/reunion/%@",
	loaded : false,
	useApi: true,
	isEdit: false,
	
	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420) {
		}
		this.set('loaded', true);
	},
	
	load: function () {
		if (!App.get('userController.user')) return;
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
	url: "cit/citacion/%@",
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
		if (!App.get('userController.user')) return;
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

		var invitados = [];
		
		if (this.get('content.invitados')) {
			this.get('content.invitados').forEach(function (invitado) {
				invitados.addObject(App.CitacionInvitado.create(invitado));
			});
		}
		this.set('content.invitados', invitados);


		$.ajax({
			url:  (App.get('apiController').get('url') + 'com/reun/reunionPorCitacion' + '/%@').fmt(encodeURIComponent(this.get('content').get('id'))),
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
	
	oldSelection: null,


	seleccionarAnterior: function () {
		if (this.get('oldSelection'))
			this.seleccionar(this.get('oldSelection').objectAt(0), this.get('oldSelection').objectAt(1), this.get('oldSelection').objectAt(2));
	},

	seleccionar : function (id, sid, ssid) {

		this.set('oldSelection', [id, sid, ssid]);

		this.get('content').forEach(function (menuItem) {
			menuItem.get('subMenu').forEach(function (subMenuItem) {
				if (subMenuItem.get('subMenu'))
				{
					subMenuItem.get('subMenu').forEach(function (subSubMenuItem) {
						subSubMenuItem.set('seleccionado', false);
					});
				}
				subMenuItem.set('seleccionado', false);
			});
			menuItem.set('seleccionado', false);
		});
		
		var sel = this.get('content').findProperty('id', id);
		
		if (sel)
		{
			if (sid != undefined) {
				var subMenu = sel.get('subMenu').findProperty('id', sid);
				subMenu.set('seleccionado', true);

				if (ssid != undefined) {
					var subSubMenu = subMenu.get('subMenu').findProperty('id', ssid);
					subSubMenu.set('seleccionado', true);
				}
			}

			this.set('titulo', sel.get('titulo'));
			App.get('tituloController').set('fecha', moment().format('LL'));
			this.set('seleccionado', sel);
			sel.set('seleccionado', true);
			if ($('.firstLevel').css('opacity') == "1") {
				$('.firstLevel').animate({
					opacity:0
				}, 500, function(){
					$('.firstLevel').css('display','none');
					$('.secondLevel').css('display','block');
					$('.secondLevel').animate({
						opacity:1
					}, 500,function(){
						//callback
					});
				});
			}
		}
	},

	esOradores: function () {
		if (this.get('seleccionado').get('id') == 4) // antes era 3
			return true;
		else
			return false;
	}.property('seleccionado'),

	esExpedientes: function () {
	if (this.get('seleccionado').get('id') == 1)
			return true;
		else
			return false;
	}.property('seleccionado'),

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
	
	url: 'cit/citacion',
	
	urlExpedientes: 'com/%@/proyectos/',
	//urlExpedientes: '/expedientes-listar',
	
	loading: false,
	loaded: false,
	
	crearReunion: function (reunion) {
		$.ajax({
			url: App.get('apiController').get('url') + "com/reun/reunion",
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
		var obj = JSON.parse(data.responseText);
		
		if(data.responseText)
		{
			if (obj.error)
			{
				$.jGrowl('Ocurrió un error al intentar crear la reunión!', { life: 5000, theme: 'jGrowl-icon-danger jGrowl-danger'});
			}
			else
			{			
				App.eventosParteController = App.EventosParteController.create();
				App.reunionConsultaController = App.ReunionConsultaController.create();

				App.set('reunionConsultaController.loaded', false);
				App.set('eventosParteController.loaded', false);

	//							App.set('reunionConsultaController.content', App.Reunion.create(obj));
				App.set('reunionConsultaController.content', App.Citacion.create({id: obj.id}));

				fn2 = function () {
					if (App.get('citacionConsultaController.loaded') && App.get('eventosParteController.loaded')) {
						App.get('citacionConsultaController').removeObserver('loaded', this, fn2);
						App.get('eventosParteController').removeObserver('loaded', this, fn2);					
						var reunion = App.get('reunionConsultaController.content');
						var citacion = App.get('citacionConsultaController.content');
						var temas = [];
						citacion.get('temas').forEach(function (tema) {
							temas.addObject(App.CitacionTema.create(tema));
						});
						citacion.set('temas', temas);								
						
						App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', reunion);										
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
					
				};

				App.get('reunionConsultaController').addObserver('loaded', this, fn);
				App.get('reunionConsultaController').load();
				
				$.jGrowl('Reunión creada con éxito!', { life: 5000,  theme:'jGrowl-icon-ok jGrowl-success'});
			}
		}
	},
	
	confirmar: function () {

		$.ajax({
			url: App.get('apiController').get('url') + "cit/citacion/" + this.get('content.id') + "/estado/" + 2,
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
		//this.get('content').set('estado', App.CitacionEstado.create({id: 2}));
		//$.jGrowl('Se ha cambiado el estado de la sitacion a Convocada!', { life: 5000 });

		//CREATE NOTIFICATION TEST 
		var notification = App.Notificacion.extend(App.Savable).create();
		//ACA TITULO DE LA NOTIFICACION
		notification.set('tipo', 'confirmarCitacion');	
		//Si hace falta ID del objeto modificado
		notification.set('objectId', data.id);
		//Link del objeto
		notification.set('link', "#/comisiones/citaciones/citacion/" + data.id + "/ver");
		//CreateAt
		notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));

		var message = "La citación a la reunión de @@comisiones@@ ha sido confirmada para el día @@fecha@@h en la sala @@sala@@.";

		message = message.replace("@@fecha@@", moment(this.get('content.start'), 'YYYY-MM-DD HH:mm:ss').format('dddd') + " " + moment(this.get('content.start'), 'YYYY-MM-DD HH:mm:ss').format('LL') + " a las " + this.get('content.start').substring(this.get('content.start').indexOf(' ')));

		message = message.replace("@@sala@@", this.get('content.sala.numero'));

		switch (this.get('content.comisiones.length'))
		{
			case 0: 
				message = message.replace("@@comisiones@@", "");
				break;
			case 1:		
				message = message.replace("@@comisiones@@", "la comisión de " + this.get('content.comisiones').objectAt(0).nombre);
				break;
			default:
				var comisiones = [];
				this.get('content.comisiones').forEach(function (comision) {
					comisiones.pushObject(comision.nombre);
				});
				message = message.replace("@@comisiones@@", "las comisiones de " + comisiones.join(", "));
				break;
		}


		//Custom message
		notification.set('mensaje', message);

		notification.set('comisiones', this.get('content.comisiones'));
		//Crear
		notification.create();


	},
	
	confirmarCompleted: function (xhr) {
		if(xhr.status == 200) {
			this.get('content').set('estado', App.CitacionEstado.create({id: 2}));
			$.jGrowl('Se ha cambiado el estado de la citación a Convocada!', { life: 5000,  theme: 'jGrowl-icon-ok jGrowl-success'});

			var emailList = [];
			var comisionCabecera = this.get('content.comisiones.firstObject');
			
			this.get('content.comisiones').forEach(function (comision) {
				if (comision.integrantes) {				
					comision.integrantes.forEach(function(integrante) {
						emailList.addObject(integrante.diputado.datosPersonales.email + ".dip@hcdn.gov.ar");			
					});
				}
			});
			
			emailList = ['mbiondo@omcmedios.com.ar'];
			
			var notificacion = {
				titulo: 'Citacion Convocada',
				mensaje: 'Se ha convocado a una citacion para ' + this.get('content.start'),
				emailList: emailList,
				objeto: this.get('content'),
				url: "#/comisiones/citaciones/citacion/" + this.get('content.id') + "/ver",
				icono: "../../../../images/calendar.png"
			}
			
			var email = notificacion;
			email.url = document.location.origin + '/' + email.url;
			
			App.get('ioController').sendNotification(notificacion);
			App.get('ioController').sendEmail(email);

			App.set('citacionConsultaController.loaded', false);
			App.set('citacionConsultaController.content', App.Citacion.create(this.get('content')));

			fn = function() {
				var citacion = App.get('citacionConsultaController.content');
				App.get('citacionConsultaController').removeObserver('loaded', this, fn);
				App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', citacion);
			};

			App.get('citacionConsultaController').addObserver('loaded', this, fn);
			App.get('citacionConsultaController').load();	
		} else {
			$.jGrowl('Ocurrió un error al intentar confirmar la citación!', { life: 5000, theme: 'jGrowl-icon-danger jGrowl-danger'});
		}
	},
	
	cancelar: function () {
		//console.log('Cancelando');

		$.ajax({
			url: App.get('apiController').get('url') + "cit/citacion/" + this.get('content.id') + "/estado/" + 3,
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
		//this.get('content').set('estado', App.CitacionEstado.create({id: 3}));
		//$.jGrowl('Se ha cambiado el estado de la sitacion a suspendida!', { life: 5000 });
	},

	cancelarCompleted: function (xhr) {
		if(xhr.status == 200) {
			this.get('content').set('estado', App.CitacionEstado.create({id: 3}));
			$.jGrowl('Se ha cambiado el estado de la citación a suspendida!', { life: 5000, theme: 'jGrowl-icon-ok jGrowl-success'});	
			App.set('citacionConsultaController.loaded', false);
			App.set('citacionConsultaController.content', App.Citacion.create(this.get('content')));

			fn = function() {
				App.get('citacionConsultaController').removeObserver('loaded', this, fn);
				var citacion = App.get('citacionConsultaController.content');
				App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', citacion);
			};

			App.get('citacionConsultaController').addObserver('loaded', this, fn);
			App.get('citacionConsultaController').load();				
		} else {
			$.jGrowl('Ocurrió un error al intentar cancelar la citación!', { life: 5000, theme: 'jGrowl-icon-danger jGrowl-danger' });
		}
	},

	create: function () {
		//console.log('Desactivando los botones..');

		$('.buttonSave').attr('disabled', 'disabled');
		$('.buttonSave').val('Guardando...');	

		this.get('content').create();
		this.get('content').addObserver('createSuccess', this, this.createCompleted);
		

		/*$.ajax({
			url: App.get('apiController').get('url') + this.get('url'),
			contentType: 'text/plain',
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'POST',
			success: this.createCompleted,
			complete: this.createCompleted,
			data : this.get('content').getJson()
		});
		*/	
	},	
	createCompleted: function (data) {
		//TO-DO Revisar que devuelva OK		
		if (this.get('content.createSuccess'))
		{		
			$('.buttonSave').removeAttr('disabled');
			$('.buttonSave').val('Guardar');

			App.set('citacionConsultaController.loaded', false);
			App.set('citacionConsultaController.content', this.get('content'));

			fn = function() {
				var citacion = App.get('citacionConsultaController.content');
				App.get('citacionConsultaController').removeObserver('loaded', this, fn);
				App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', citacion);
			};

			App.get('citacionConsultaController').addObserver('loaded', this, fn);
			App.get('citacionConsultaController').load();
			
			$.jGrowl('Citación creada con éxito!', { life: 5000, theme: 'jGrowl-icon-ok jGrowl-success' });	

			var expedientesD = [];

			data.temas.forEach(function (tema){
			    tema.proyectos.forEach(function(p){ expedientesD.push(p.expdip); });
			});

			var evento = App.TimeLineEvent.extend(App.Savable).create({
			    objectID: expedientesD[0], 
			    titulo: 'Se han agregado Expedientes a una citación',
			    fecha:  data.start,
			    mensaje: 'Se han agregado Expedientes a una citación',
			    icono: 'creado',
			    link: '#/comisiones/citaciones/citacion/' + data.id + '/ver',
			    duplicados: expedientesD,
			});

			evento.create();		

		}
	},
	
	save: function () {
		fn = function () {
			//console.log('Desactivando los botones..');
			$('.buttonSave').attr('disabled', 'disabled');
			$('.buttonSave').val('Guardando...');

			this.get('content').removeObserver('saveSuccess', this, fn);
			if (this.get('content.saveSuccess') == true)
			{
				App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', this.get('content'));
				$.jGrowl('Citación editada con éxito!', { life: 5000, theme: 'jGrowl-icon-ok jGrowl-success' });								
			}			
			else
			{
				//console.log('Activando los botones..');
				$('.buttonSave').removeAttr('disabled');
				$('.buttonSave').val('Guardar');

				//console.log('Citacion editada con Exito');
				$.jGrowl('Ocurrió un error al intentar guardar los cambios en la citación!', { life: 5000, theme: 'jGrowl-icon-danger jGrowl-danger'});
			}
		}
		this.get('content').save();
		this.get('content').addObserver('saveSuccess', this, fn);
	},
	
	cargarExpedientes: function () {
		$.ajax({
//			url: (App.get('apiController').get('url') + this.get('urlExpedientes')).fmt(encodeURIComponent(this.get('content.comisiones').objectAt(0).get('id'))) + moment().format('YYYY'),
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


App.DiputadoConsultaController = Ember.ObjectController.extend({
	
});

App.DiputadoEditController = Ember.ObjectController.extend({
	guardar: function (){
		this.get('content').normalize();
		this.get('content').addObserver('saveSuccess', this, this.saveSucceeded);
		this.get('content').save();
		this.set('loading', true);
	},

	saveSucceeded: function () {
		this.get('content').desNormalize();
		this.get('content').removeObserver('saveSuccess', this, this.saveSucceeded);
		if (this.get('content.saveSuccess')) {
	        this.set('loading', false);
			 if (!App.get('diputadosController'))
			 	 App.diputadosController = App.DiputadosController.create();
				 var deferred = $.Deferred(),

				 fn = function() {
				 	if (App.get('diputadosController.loaded')) {
				 		App.get('diputadosController').removeObserver('loaded', this, fn);
						App.get('router').transitionTo('admin.diputados.index');
				 	}
					deferred.resolve(null);					
				 };

				 App.get('diputadosController').addObserver('loaded', this, fn);
				 App.get('diputadosController').load();            
	    } else if (this.get('content.saveSuccess') == false) {
	        this.set('loading', false);
		}
	},
});


App.DiputadosController  = App.RestController.extend({
	url: 'diputados',
	type: App.User,
	useAPi: false,
	filtro : true,

	init : function(){
		//this.load();
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
	url: 'sesiones',
	type: App.Sesion,
	sortProperties: ['sortValue'],
	sortAscending: false,
	tipoSesiones: [{titulo: "Sesión Ordinaria De Tablas", id: "SesionOrdinariaDeTablas"}, {titulo: "Sesión Informativa", id: "SesionInformativa"}, {titulo: "Sesión Ordinaria Especial", id: "SesionOrdinariaEspecial"}],
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
		{
			this.startTimer(sesion);
		}
		
	},

	startTimer : function (sesion) {
		
		/*if(this.get('sesionActual'))
			this.stopTimer(this.get('sesionActual'))
		*/

		if (this.get('timer')) {
			this.get('timer').stop();
			this.set('sesionActual', null);
			sesion.set('timer', null);		
		}

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

		sesion.addObserver('saveSuccess', this, this.finalizarSesionSucess);
		sesion.save();
		
	},

	finalizarSesionSucess: function () {
		//ACA CREAR NOTIFICACION DE FINALIZAR SESION
	},

	parse : function (data) {
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
		if(listas) {
			lista = listas.objectAt(0)
			App.get('listaController').set('content', lista);
		}
	}.observes('content'),
}),

App.TurnosController = App.RestController.extend({
	notificationType : 'Turno',
	sortUrl: 'turnos/ordenar',
	type : App.Turno,
	sortProperties: ['sortValue'],
	timer : null,
	useAPi: false,
	notificationRoom: 'oradores',

	turnoHablandoBinding : null,

	saveSort: function (ids) {
		this._super(ids);

		ids.forEach(function(item, index){
			var turno = App.get('turnosController').findProperty('id', item);
			if (turno) {
				turno.set('orden', index);
			}
		});			
	},

	misTurnos: function () {
		var misTurnos = this.get('arrangedContent').filter(function (turno) {
			var tengoOrador =  false;

			turno.get('oradores').forEach(function(orador){
				var dipStr = "Dip " + orador.user.apellido + " " + orador.user.nombre;
				if (dipStr.toLowerCase() == App.get('userController.user.estructura').toLowerCase()) {
					tengoOrador = true;
				}
			});

			if (tengoOrador)
				return true;
			else
				return false;
		});
		return misTurnos;
	}.property('arrangedContent', 'length'),

	proximoTurno: function () {

		var turnosDesBloqueados = this.get('arrangedContent').filter(function (turno) {
			return !turno.get('bloqueado');
		});

		return turnosDesBloqueados.objectAt(0);

	}.property('arrangedContent.@each.bloqueado', 'arrangedContent.@each.hora', 'arrangedContent.@each.orden').cacheable(),

	proximosTurnos: function () {

		var turnosDesBloqueados = this.get('arrangedContent').filter(function (turno) {
			return !turno.get('bloqueado');
		});

		return turnosDesBloqueados.slice(0,3);

	}.property('arrangedContent.@each.bloqueado', 'arrangedContent.@each.hora', 'arrangedContent.@each.orden').cacheable(),

	proximosTurnosSinProximo: function () {

		var turnosDesBloqueados = this.get('arrangedContent').filter(function (turno) {
			return !turno.get('bloqueado');
		});

		return turnosDesBloqueados.slice(1,4);

	}.property('arrangedContent.@each.bloqueado', 'arrangedContent.@each.hora', 'arrangedContent.@each.orden').cacheable(),
	


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

	stopTimer : function (turno, save) {
		this.get('timer').stop();

		turno.set('horaFin', Math.round(this.get('timer.endTime')/1000));
		turno.set('timer', null);
		if (save != false)
			turno.save();

		this.set('turnoHablando', null);

		this.actualizarHora();
	},

	cancelTimer : function (turno, save) {
		this.get('timer').stop();
		turno.set('horaFin', null);
		turno.set('horaInicio', null);
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
			var turno = this.find(function (item){
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
		
		var numero = fromIndex + 1;

		if(turnoAnterior === undefined){
			turno = this.get('arrangedContent').objectAt(fromIndex);
			if (turno)
			{
				if(turno.get('horaInicio')){
					turno.set('hora', turno.get('horaInicio'));
					turno.set('horaEstimada', false);
				}else{
					turno.set('hora', sesionFecha);
					turno.set('horaEstimada', true);
				}
			}
			turnoAnterior = turno;
			turnoAnterior.set('numero', numero);
			numero++;
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
			turno.set('numero', numero);

			if(turno.get('horaInicio')){
				turno.set('hora', turno.get('horaInicio'));
				turno.set('horaEstimada', false);
			}else{
				turno.set('hora',  hora);
				turno.set('horaEstimada', true);
			}

			turnoAnterior = turno;
			fromIndex++;
			numero++;
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
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "creado", this.model.getJson(), this.controller.get('notificationRoom'));
			
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
				
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "borrado", this.model.get('id'), this.controller.get('notificationRoom'));
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
		return moment.unix(this.get('horaInicio')).format('HH:mm[h]');
	}.property('horaInicio'),

	sHoraFin: function () {
		return moment.unix(this.get('horaFin')).format('HH:mm[h]');
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
	sortUrl: 'temas/ordenar',
	sortProperties: ['orden'],
	useAPi: false,
	notificationRoom: 'oradores',

	parse : function (data) {
		return data.temas;
	},

	saveSort : function(ids) {
		var url = this.get('sortUrl');

		if (this.get('useApi')) {
			url = App.get('apiController').get('url') + url;	
		}

		ids.forEach(function(item, index){

			var tema = App.get('temasController').findProperty('id', item);
			if (tema) {
				if (tema.get('subTemas')) {
					tema.set('orden', (index + 1) * 1000);
					tema.get('subTemas').forEach(function (subTema) {
						subTema.set('parentOrden', tema.get('orden'));
						subTema.set('orden', subTema.get('orden') + 1);
					});
				}
				else
					tema.set('orden', index);
			}
		});			
			
		$.ajax({
			url: url,
			dataType: 'JSON',
			type: 'POST',
			context : this,
			data : {sort: JSON.stringify(ids)},
			success: this.sortSucceeded,
		});
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
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "creado" , this.model.getJson(), this.controller.get('notificationRoom'));
		}
	},	
	deleteSucceeded: function (data) {
		this._super(data);

		if (data.success == true) {
			App.get('ioController').sendMessage(this.controller.get('notificationType'), "borrado", this.model.get('id'), this.controller.get('notificationRoom'));
		}
	},

	sortEnabled : function () {
		if(App.get('puedeEditar') && !App.get('turnosController').get('turnoHablando'))
			return true;

		return false;
	}.property('App.turnosController.turnoHablando', 'App.puedeEditar'),


	temasOrdenadosPorGrupo: function () {
		_self = this;
		var items = this.get('arrangedContent').filter(function(tema) {
			return (tema.get('plTipo') == 'p') || (tema.get('plTipo') == 't');
		});

		items.forEach(function (item) {
			item.set('orden', item.get('orden') + 1);

			if (item.get('orden') < 100) 
				item.set('orden', parseInt(item.get('orden') * 1000));

			var filtered = _self.get('arrangedContent').filter(function(tema) {
				return ((tema.get('plTipo') != 'p')  &&  (tema.get('plTipo') != 't') && (tema.get('plItemId') == item.get('plItemId')));
			});

			item.set('subTemas', filtered);

			item.get('subTemas').forEach(function (tema) {
				tema.set('parentOrden', item.get('orden'));
				tema.set('orden', tema.get('orden') + 1);
			});
		});

		this.set('refresh', false);
		return items.sort(function(a, b) {
			return a.get('sortValue') - b.get('sortValue');
		});
	}.property('arrangedContent', 'content.@each', 'refresh', 'App.temaController.content'),

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
		//console.log('turnosDesbloqueados');
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
	}.property('content', 'App.temaController.content.@each', 'App.turnosController.content.@each.bloqueado', 'App.turnosController.isUpdated').cacheable(),

	turnosBloqueados : function () {
		//console.log('turnosBloqueados');
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
	}.property('content', 'App.temaController.content', 'App.turnosController.content.@each.bloqueado').cacheable(),

	turnosHablando : function () {
		var temaController = App.get('temaController');

		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			return false;
		}, this);

		return turnos;
	}.property('content', 'App.temaController.content').cacheable(),

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

		
		App.get('turnosController').actualizarHora();
	},

	imprimir : function() {
		var turnosBloqueados = this.get('turnosBloqueados'),
		turnosDesbloqueados = this.get('turnosDesbloqueados');

		var turnos = [];

		turnosBloqueados.forEach(function(item, index){
			var t = item.serialize();
			t['hablando'] = item.get('hablando');
			t['numero'] = item.get('numero');
			turnos.push(t);
		}, this);

		turnosDesbloqueados.forEach(function(item, index){
			var t = item.serialize();
			t['hablando'] = item.get('hablando');
			t['numero'] = item.get('numero');
			turnos.push(t);
		}, this);

		var sesion = App.get('sesionController.content').serialize();
		var tema = App.get('temaController.content').serialize();

		var lista = this.get('content').serialize();

		lista['turnos'] = turnos;

		listas = [lista];
		sesion['listas'] = listas;
		sesion['tema'] = tema;
		delete sesion.temas;
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
			t['numero'] = item.get('numero');
			turnosSerialized.push(t);
		}, item);
		
		var lista = this.get('content').serialize();
		lista['turnos'] = turnosSerialized;
		listasSerialized.push(lista);
		
		sesion['listas'] = listasSerialized;
		sesion['tema'] = tema;
		delete sesion.temas;
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



/*Graph*/



App.EstadisticasController = Ember.Object.extend({
	
	content: null,
	temaId: -1,
	sesionId: 78,
	loaded: false,

	load: function () {
		if (!App.get('userController.user')) return;
		if (this.get('sesion')) {
			this.set('loaded', false);
			_self = this;
			var url = '/estadistica/' + this.get('sesion.id');
			if (this.get('tema.id')) {
				url = url + "/" + this.get('tema').get('id');	
			}
			$.ajax({
				url: url,
				success: _self.parseContent,
				context: _self
			});
		} else {
			this.set('loaded', true);
		}
	}.observes('sesion', 'tema'),

	unsetTema: function () {
		this.set('tema', this.get('temas').objectAt(0));
	}.observes('sesion.id'),
	
	parseContent: function (payload) {
	  var data = JSON.parse(payload);
	  if (data.success == true)
	  {
		this.set('content', data.estadisticaSesion);
	  }		
	  this.set('loaded', true);
	},

	estadisticaSesion: function() { 
		this.get('content'); 
	}.property('content.@each'),

	estadisticaBloques: function() { 
		var data = [];
		if (this.get('content.estadisticasBloque')) {

			this.get('content.estadisticasBloque').forEach(function (bloque) {
				numDiputados = 'Orador';				
				if(bloque.diputadosAsignados>1){ numDiputados = 'Oradores'; }
				data.push([bloque.titulo + " (" + bloque.diputadosAsignados+" "+numDiputados+")", bloque.diputadosAsignados])
			}); 
		}
		return data;
	}.property('content.@each'),

	estadisticaBloquesPorOradores: function() { 
		var data = [];
		if (this.get('content.estadisticasBloque')) {

			this.get('content.estadisticasBloque').forEach(function (bloque) {
				data.push([bloque.titulo + " " + (bloque.tiempoAsignado / 60).toFixed(2) + "'", (bloque.tiempoAsignado).toFixed(2)])
			}); 
		}
		return data;
	}.property('content.@each'),	
	estadisticaBloquesForTable: function () {
		var data= [];
		_self = this;
		if (this.get('content.estadisticasBloque')) {
			this.get('content.estadisticasBloque').forEach(function (bloque) {
				var b = Ember.Object.create(bloque);
				b.set('label', b.get('titulo'));
				b.set('tiempo', moment.duration(b.get('tiempoAsignado')*1000).humanize());
				b.set('tiempoP', (parseInt(b.get('tiempoAsignado')) / _self.get('content.tiempoTotalOradores') * 100).toFixed(2));
				b.set('diputadosP', (b.get('diputadosAsignados') / b.get('totalDiputados') * 100).toFixed(2));
				data.pushObject(b);
			});
			
		}


		return data;

	}.property('content.@each'),
	
	estadisticaInterBloques: function() { 
		var data = [];
		if (this.get('content.estadisticasInterBloque')){
			this.get('content.estadisticasInterBloque').forEach(function (bloque) {
				if(bloque.diputadosAsignados>1){ numDiputados = 'Oradores'; }
				data.push([bloque.titulo + " (" + bloque.diputadosAsignados+" "+numDiputados+")", bloque.diputadosAsignados])
			}); 
		}

		return data;
	}.property('content.@each'),

	estadisticaInterBloquesPorOradores: function() { 
		var data = [];
		if (this.get('content.estadisticasInterBloque')) {

			this.get('content.estadisticasInterBloque').forEach(function (bloque) {
				data.push([bloque.titulo + " (Tiempo Asignado: " + moment.duration(bloque.tiempoAsignado*1000).humanize()+")", (bloque.tiempoAsignado)]);
			}); 
		}
		return data;
	}.property('content.@each'),	
	
	estadisticaInterBloquesForTable: function () {
		var data= [];
		_self = this;

		if (this.get('content.estadisticasInterBloque')) {
			
			this.get('content.estadisticasInterBloque').forEach(function (bloque) {
				var b = Ember.Object.create(bloque);
				b.set('label', b.get('titulo'));
				b.set('tiempo', moment.duration(bloque.tiempoAsignado*1000).humanize());
				b.set('tiempoP', (parseInt(b.get('tiempoAsignado')) / _self.get('content.tiempoTotalOradores') * 100).toFixed(2));
				b.set('diputadosP', (b.get('diputadosAsignados') / b.get('totalDiputados') * 100).toFixed(2));
				data.pushObject(b);
			});
		}

		return data;
	}.property('content.@each'),

	temas: function() { 
		var data = [App.EstadisticaTema.create({titulo: 'Todos los temas', id: -1})];

		if (this.get('content.sesion')) {
			this.get('content.sesion.temas').forEach(function(tema) {
				data.pushObject(App.EstadisticaTema.create(tema));
			}); 
		}
		return data;
	}.property('content.@each'),
});

//Crear Plan De PlanDeLabor

App.PlanDeLaborGruposController = App.RestController.extend({
	url: 'pdl/grupos',
	useApi: true,
	loaded: false,
	type: App.PlanDeLaborGrupo,

	createObject: function (data, save) {
		save = save || false;
		
		item = App.PlanDeLaborGrupo.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.CrearPlanDeLaborController = Ember.Object.extend({
	loaded: false,

	gruposController: null,
	ordenesDelDiaController: null,
	content: null,

	grupos: function () {
		return this.get('gruposController.arrangedContent');
	}.property('gruposController.content'),

	ordenesDelDia: function () {
		return this.get('ordenesDelDiaController.arrangedContent');
	}.property('ordenesDelDiaController.content'),

	load: function () {
		if (!App.get('userController.user')) return;

		this.set('content', App.PlanDeLaborTentativo.extend(App.Savable).create({items: [], estado: 0}));

		if (!this.get('gruposController')) {
			this.set('gruposController', App.PlanDeLaborGruposController.create());
		}
		this.get('gruposController').addObserver('loaded', this, this.controllersLoaded);
		this.get('gruposController').load();
	

		if (!this.get('ordenesDelDiaController'))
			this.set('ordenesDelDiaController', App.OrdenesDelDiaController.create());

		this.get('ordenesDelDiaController').addObserver('loaded', this, this.controllersLoaded);
		this.get('ordenesDelDiaController').load();		
	},

	controllersLoaded: function () {
		if (this.get('gruposController.loaded') && this.get('ordenesDelDiaController.loaded')) {
			this.get('gruposController').removeObserver('loaded', this, this.controllersLoaded);
			this.get('ordenesDelDiaController').removeObserver('loaded', this, this.controllersLoaded);
			this.set('loaded', true);
		}
	},
});

App.GirosController = App.RestController.extend({
	url: 'giros',
	useApi: true,
	loaded: false,
	type: App.Giro,

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Giro.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});


App.AutoridadesController = App.RestController.extend({
	url: 'dip/autoridades/',
	useApi: true,
	loaded: false,
	type: App.Autoridad,

	filter: function (filterText) {
		this.set('loaded', false);
		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url + "?apellido=" + filterText;

		var async = true;
		if (this.get('async'))
			async = this.get('async');
			
		if ( url ) {
			$.ajax({
				url: url,
				dataType: 'JSON',
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted,
				async: async
			});

		}		
	},

	createObject: function (data, save) {
		save = save || false;
		item = App.Autoridad.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.DiputadosVigentesController = App.RestController.extend({
	url: 'dip/diputados/' + moment().format('DD/MM/YYYY') + '/resumen',
	sortProperties: ['fechaJuramento'],
	sortAscending: false,
	useApi: true,
	loaded: false,
	type: App.Mandato,

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Mandato.create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});


App.DistritosController = App.RestController.extend({
	url: 'dip/distritos/',

	useApi: true,
	loaded: false,
	type: App.Distrito,

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Distrito.create(data);
		item.setProperties(data);
		item.set('id', Math.floor((Math.random()*99999)+1));
		this.addObject(item);
	},	
});

App.SearchController = App.RestController.extend({
	url: 'search/list',

	useApi: false,
	loaded: false,

	type: App.ExpedienteQuery,

	load: function() {
		if (!App.get('userController.user')) return;

		this.set('loaded', false);
		var url =  this.get('url');

		if ( url ) {
			$.ajax({
				url: url,
				dataType: 'JSON',
				type: 'POST',
				data : JSON.stringify({cuil: App.get('userController.user.cuil')}),
				context: this,
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});

		}
	},


	createObject: function (data, save) {
		save = save || false;
		item = App.ProyectoQuery.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},	

	hasContent: function () {
		return this.get('content.length') > 0;
	}.property('content.@each')
});



App.BiographyController = Ember.ObjectController.extend({
	expediente: null,
});

App.BloquesController = App.RestController.extend({
	url: 'bloques',
	useApi: false,
	loaded: false,
	type: App.Bloque,
	sortProperties: ['nombre'],

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Bloque.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},		
});


App.InterBloquesController = App.RestController.extend({
	url: 'interbloques',
	useApi: false,
	loaded: false,
	type: App.InterBloque,
	sortProperties: ['nombre'],

	createObject: function (data, save) {
		save = save || false;
		
		item = App.InterBloque.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},		
});



App.TPsController = App.RestController.extend({
	url: 'ME/tps',
	useApi: true,
	loaded: false,
	type: App.TP,
	periodo: 132,

	sortProperties: ['fecha'],
	sortAscending: false,	

	load: function () {

		if (!App.get('userController.user')) return;

		this.set('loaded', false);
		var url =  this.get('url') + '/' + this.get('periodo');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		$.ajax({
			url: url,
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted,
		});
	},

	createObject: function (data, save) {
		save = save || false;
		item = App.TP.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},

	periodoChange: function () {
		if (this.get('periodo'))
			this.load();
	}.observes('periodo'),
});


App.TPConsultaController = Ember.ObjectController.extend({
});

App.TPEditarController = Ember.ObjectController.extend({
	guardar: function (){
		this.get('content').normalize();
		this.get('content').addObserver('saveSuccess', this, this.saveSucceeded);
		this.get('content').save();
		this.set('loading', true);
	},

	saveSucceeded: function (xhr) {
		this.get('content').desNormalize();
		this.get('content').removeObserver('saveSuccess', this, this.saveSucceeded);
		if (this.get('content.saveSuccess')) {
			var tp = this.get('content');
			
            $.jGrowl('Se ha modificado el Trámite Parlamentario  N°' + tp.numero + ' del período N°' + tp.periodo +' correctamente!', { life: 5000, theme: 'jGrowl-icon-ok jGrowl-success' });

			var notification = App.Notificacion.extend(App.Savable).create();
			notification.set('tipo', 'editarTP');	
			notification.set('objectId', tp.id);
			notification.set('link', "/#/publicaciones/TP/" + tp.id + "/ver");
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			notification.set('mensaje', "Se ha modificado el Trámite Parlamentario N°" + tp.numero + " del período N°" + tp.periodo);
			notification.create();  

            App.tpsController = App.TPsController.create();

            fn = function() {
                if(App.get('tpsController.loaded'))
                {
                    App.get('tpsController').removeObserver('loaded', this, fn);	
                    App.get('router').transitionTo('publicaciones.tp.listado')
                }
            };

            App.get('tpsController').addObserver('loaded', this, fn);
            App.get('tpsController').load();                
            this.set('loading', false);
	    } else if (this.get('content.saveSuccess') == false) {
            $.jGrowl('No se ha guardado los cambios del Trámite Parlamentario!', { life: 5000, theme: 'jGrowl-icon-danger jGrowl-danger' });
	        this.set('loading', false);
		}
	},
});

App.TPCrearController = Ember.ObjectController.extend({
	crear: function (){


		this.get('content').normalize();
		this.get('content').addObserver('createSuccess', this, this.createSucceeded);
		this.get('content').create();
		this.set('loading', true);
	},

	createSucceeded: function () {
		this.get('content').desNormalize();
		this.get('content').removeObserver('createSuccess', this, this.createSucceeded);
		if (this.get('content.createSuccess')) {

            $.jGrowl('Trámite Parlamentario creado con éxito!', { life: 5000,theme: 'jGrowl-icon-ok jGrowl-success' });
			var tp = this.get('content');

			var notification = App.Notificacion.extend(App.Savable).create();
			notification.set('tipo', 'crearTP');	
			notification.set('objectId', tp.id);
			notification.set('link', "/#/publicaciones/TP/" + tp.id + "/ver");
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			notification.set('mensaje', "Se ha creado el Trámite Parlamentario N°" + tp.numero + " del período N°" + tp.periodo);
			notification.create();  

            App.tpsController = App.TPsController.create();

            fn = function() {
                if(App.get('tpsController.loaded'))
                {
                    App.get('tpsController').removeObserver('loaded', this, fn);	
                    App.get('router').transitionTo('publicaciones.tp.listado')
                }
            };

            App.get('tpsController').addObserver('loaded', this, fn);
            App.get('tpsController').load();                
            this.set('loading', false);

        } else if (this.get('content.createSuccess') == false) {
            $.jGrowl('No se ha creado el Trámite Parlamentario!', { life: 5000, theme: 'jGrowl-icon-danger jGrowl-danger' });
            this.set('loading', false);
		}
	},
});


App.ComisionesListadoController = App.RestController.extend({
	url: 'com/comisiones/CD/P/detalle',
	type: App.ComisionListado,
	selected: '',
	sortProperties: ['nombre'],
	sortAscending: true,	
	useApi: true,
	
	init : function () {
		this._super();
	},

	createObject: function (data, save) {
		save = save || false;
		item = App.ComisionListado.create(data);
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
        estadisticasBloquesPresidentes:function(){
            var bloques = [];
            var data = [];
            var hist = {};
            if(this.get('content')){
                this.get('content').forEach(function(item){
                    bloques.push(item.integrantes[0].diputado.datosPersonales.bloques[0].nombre)
                });

                bloques.map( function (a) { 
                    if (a in hist) { 
                        hist[a] ++;
                    } else  {
                        hist[a] = 1; 
                    }
                });

                $.each( hist, function( key, value ) {
                    data.push({name: key, y: value})
                });

                data.sort(function(a,b){return b.y-a.y});
            }
            return data;
        }.property('content.@each'),
});

App.ComisionesConsultaController = Ember.ObjectController.extend({
    integrantesComision: function(){
        var data = [];
        var _self = this;

        if (this.get('integrantes'))
        {
            integrantes = this.get('integrantes')            
            integrantes.forEach(function(item){
                var fila = App.ComisionIntegrante.create({nombre: item.diputado.datosPersonales.nombre, apellido: item.diputado.datosPersonales.apellido, fechaInicioMandato: moment(item.diputado.fechaInicioMandato, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY') ,fechaFinMandato: moment(item.diputado.fechaFinMandato, 'YYYY-MM-DD HH:mm:ss').format('DD-MM-YYYY'), nombreBloque:item.diputado.datosPersonales.bloques[0].nombre, cargo:item.cargo.descripcion, orden: item.cargo.orden, tipo: item.diputado.cargo});
                data.push(fila);
                
            });
            
            data.sort(function(a,b){return a.orden-b.orden});
        }        

		var dataController = Ember.ArrayController.create({
		  content: data,
		  sortProperties: ['orden'],
		  sortAscending: true,
		});

        return dataController.get('arrangedContent');		
    }.property('content.@each'),
    
    estadisticasPorBloque: function(){
        var bloques = [];
        var data = [];
        var hist = {};
        
        if(integrantes){
            integrantes.forEach(function(item){
                bloques.push(item.diputado.datosPersonales.bloques[0].nombre)    
            });

            bloques.map( function (a) { 
                if (a in hist) { 
                    hist[a] ++;
                } else  {
                    hist[a] = 1; 
                }
             });

            $.each( hist, function( key, value ) {
                data.push({name: key, y: value})
            });
        }
        return data;
    }.property('content.@each')
});

App.MEExpedienteConsultaController = Ember.ObjectController.extend({
});

App.MEExpedienteEditarController = Ember.ObjectController.extend({
});

App.MEExpedienteGirarController = Ember.ObjectController.extend({
});

App.ProyectosController = App.RestController.extend({
	url: 'ME/exp/proyectos/search',

	type: App.Proyecto,
	useApi: true,
	sortProperties: ['expdipA', 'expdipN'],
	sortAscending: false,
	loaded: false,
	pageSize: 25,
	pageNumber: 1,
	query: null,
	isPaginated: false,

	buildURL: function (filterText) {
		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		url += "/" + filterText;
		return url;		
	},

	init : function(){
		this._super();
	},

	nextPage: function () {
		this.set('pageNumber', this.get('pageNumber') + 1);
		this.set('newestContent', []);
		this.set('newestContentReady', false);
		this.load();
	},

	load: function() {
		if (!App.get('userController.user')) return;
		this.set('loaded', false);

		var getJSON = {};

		if(this.get('query'))
		{
			this.set('query.pageNumber', this.get('pageNumber'));
			this.set('query.pageSize', this.get('pageSize'));			
			getJSON = this.get('query').getJson();
		}

		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;


		if ( url ) {
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'POST',
				context: this,
				contentType: 'text/plain',
				crossDomain: 'true',			
				data : getJSON,
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});

		}
	},

	parse: function (data) {
		return data.proyectos;
	},

	loadSucceeded: function(data) {
		var items = this.parse(data);
		var lista = [];

		if(!data || !items){
			App.get('proyectosController').set('loaded', true);
			return;
		}

		items.forEach(function(i){
			this.createObject(i);
		}, this);

		if (this.get('newestContent')) {
			this.set('newestContentReady', true);
		}

		App.set('proyectosController.recordcount', data.recordcount);
		App.get('proyectosController').set('loading', false);
		App.get('proyectosController').set('loaded', true);

		this.set('isPaginated', false);
	},

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Expediente.extend(App.Savable).create(data);
		item.setProperties(data);

		if (this.get('newestContent')) {
			this.get('newestContent').addObject(item);			
		}

		this.addObject(item);
	},	
});

App.EnviosArchivadosExpedientesArchivablesController = App.RestController.extend({
	url: 'exp/proyectos/archivables',
	type: App.ExpedienteArchivable,
	useApi: true,
	sortProperties: ['fechaPub'],
	sortAscending: true,
	loaded: false,
	async: false,

	buildURL: function (filterText) {	
		var url =  this.get('url');

		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
//		url += "/" + filterText;

		url += "?expdip=" + filterText;

		url += this.appendURLforComision();

		return url;		
	},
	appendURLforComision: function () {
		var comision = App.get('expedientesArchivablesController.comision');
		if (comision)
			return "&comision=" + comision.nombre;				
		else
			return "";
	},

	loadSucceeded: function(data){
		var item, items = this.parse(data);
		
		this.set('content', []);

		if(!data || !items){
			this.set('loaded', true);
			return;
		}

		items.forEach(function(i){
			this.createObject(i);
		}, this);
		
		this.set('loaded', true);
	},

	createObject: function (data, save) {
	
		save = save || false;
		
		var item = App.ExpedienteArchivable.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);	
	},	
});

App.FirmantesarhaController = App.RestController.extend({
	url: 'firmantesarha',
	useApi: false,
	loaded: false,
	type: App.Firmantesarha,
//	sortProperties: ['nombre'],

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Firmantesarha.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},		
});


App.ExpedienteTimelineController = App.RestController.extend({
	url: 'timeline/',
	sortProperties: ['fecha'],
	sortAscending: false,

	createObject: function (data, save) {
		save = save || false;
		
		item = App.TimeLineEvent.extend(App.Savable).create(data);
		item.setProperties(data);
		this.addObject(item);
	},	
});

App.AuditController =  App.RestController.extend({
	url: 'audit/',
	useApi: false,
	loaded: false,

	loadByIdNameObject: function (id,name) {
		this.url = "audit/get-by-id-object/" + id + "/" + name;
		this.load();
	},

	loadByObjectName: function (name) {
		this.url = "audit/get-by-object-name/" + name;
		this.load();
	},

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Audit.create(data);
		item.setProperties(data);
		this.addObject(item);
	},

});

App.AsistenciasController = Ember.ObjectController.extend({
	sesion: null,
	content: null,

	sesionChanged: function () {
		this.set('content', App.AsistenciasDiputadoSeleccionado.extend(App.Savable).create({
			idSesion: this.get('sesion.id'),
			id: this.get('sesion.id'),
			idDiputados: []
		}));

		App.get('diputadosController.content').setEach('seleccionado', false);

		this.get('content').addObserver('loaded', this, this.asistenciasLoadedCompleted);
		this.get('content').load();

	}.observes('sesion'),	


	refresh: function (diputados) {
		App.get('diputadosController.content').setEach('seleccionado', false);

		if (diputados.length > 0) {
			this.set('isEdit', true);
			diputados.forEach(function (diputado) {
				var d = App.get('diputadosController.content').findProperty('id', diputado);
				d.set('seleccionado', true);
			}, this);
		} 
	},

	bloques: function () {
		var sel = $.map(App.get('diputadosController.content'), function (value, key) {  
			return value.bloque; 
		});

		var uniqueNames = [];

		var arr = Ember.ArrayController.create({
			content: [],
			sortProperties: ['nombre'],
		});

		$.each(sel, function(i, el){
		    if (!uniqueNames.contains(el.id)) {
		    	uniqueNames.pushObject(el.id);
		    	arr.get('content').pushObject(el);
		    }
		});

		return arr.get('arrangedContent');
	}.property('App.diputadosController.content'),

	interBloques: function () {
		var sel = $.map(App.get('diputadosController.content'), function (value, key) {  
			return value.interBloque; 
		});

		var uniqueNames = [];

		var arr = Ember.ArrayController.create({
			content: [],
			sortProperties: ['nombre'],
		});

		$.each(sel, function(i, el){
		    if (!uniqueNames.contains(el.id)) {
		    	uniqueNames.pushObject(el.id);
		    	arr.get('content').pushObject(el);
		    }
		});

		return arr.get('arrangedContent');
	}.property('App.diputadosController.content'),

	asistenciasLoadedCompleted: function (data) {
		if (this.get('content.loaded')) {
			if (this.get('content.idDiputados').length > 0) {
				this.set('isEdit', true);
				this.get('content.idDiputados').forEach(function (diputado) {
					var d = App.get('diputadosController.content').findProperty('id', diputado.idDiputado);
					d.set('seleccionado', true);
				}, this);
			} 
		}
	},	

});



App.PedidoRespuestaController = App.RestController.extend({
//	url: 'pedido/%@/respuestas',
	url: '',
	type: App.PedidoRespuesta,
	useApi: false,
	content: null,
	loaded: false,

	load: function() {
		if (!App.get('userController.user')) return;
		this.set('loaded', false);

		//url = this.get('url') + "/" + this.get('pedido');
		url = "pedido" + "/" + this.get('pedido') + "/respuestas";

		if ( url ) {
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'GET',
				context: this,
				contentType: 'text/plain',
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});
		}
	},	
	createObject: function (data, save) {
		save = save || false;
		item = App.PedidoRespuesta.create(data);
		item.setProperties(data);
		this.addObject(item);
	},

});


App.PedidosController = App.RestController.extend({
	url: 'pedido',
	useApi: false,
	loaded: false,
	type: App.Pedido,
	content: null,
	sortProperties: ['id'],
	sortAscending: false,
	pageSize: 25,
	pageNumber: 1,
	
	createObject: function (data, save) {
		save = save || false;
		item = App.Pedido.create(data);
		item.setProperties(data);
		this.addObject(item);
	},
	findByCuil: function(){
		var content = $.map(this.get('content'), function(item){
			if(item.userSaraAsignado && item.userSaraAsignado.cuil == App.get('userController.user.cuil')){
			 	return item;	
			}
		});		

		return content;
	}.property('content'),
	findByDepartamento: function(){
		var content = $.map(this.get('content'), function(item){
			if(item.departamento && item.departamento == App.get('userController.user.departamento')){
			 	return item;	
			}
		});		

		return content;
	}.property('content'),
	estadisticasPorResueltos: function (){
		var data = [];
		if(this.get('content')){
			var resueltos = this.get('content').filterProperty('resuelto', true);

			data.push({name: "Finalizados", y: resueltos.length});
			data.push({name: "Sin finalizar", y: this.get('content').length - resueltos.length});

		}
		return data;
	}.property('content.@each'),

	estadisticasPorInicio: function (){
		var data = [];
		if(this.get('content')){
			var resueltos = this.get('content').filterProperty('resuelto', true);

			data.push({name: "Finalizados", y: resueltos.length});
			data.push({name: "Sin finalizar", y: this.get('content').length - resueltos.length});

		}
		return data;
	}.property('content.@each'),
	nextPage: function () {
		this.set('pageNumber', this.get('pageNumber') + 1);
		this.load();
	},
});


App.MisPedidosController = App.PedidosController.extend({
	url: 'pedidos',
	cuil: '',

	load: function() {
		if (!App.get('userController.user')) return;

		this.set('loaded', false);

		url = this.get('url') + "/" + this.get('cuil');

		if ( url ) {
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'GET',
				context: this,
				contentType: 'text/plain',
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});
		}
	},	
});


App.PedidoConsultaController = Ember.Object.extend({
	url: 'pedido/%@',
	type: App.Pedido,
	useApi: false,

	loadCompleted: function(xhr){
		if(xhr.status == 400 || xhr.status == 420){ }
		this.set('loaded', true);		
	},
	
	load: function () {
		if (!App.get('userController.user')) return;

		this.set('loaded', false);
		
		this.set('loaded', false);
		$.ajax({
			url:  (this.get('url')).fmt(encodeURIComponent(this.get('content').get('id'))),
			type: 'GET',
			dataType: 'JSON',
			context: this,
			success: this.loadSucceeded,
			complete: this.loadCompleted
		});
		
		//var data = {id: this.get('content.id'), nombre: 'test'};
		//this.loadSucceeded(data);
	},
				
	loadSucceeded: function(data) {
		item = App.Pedido.extend(App.Savable).create();		
		item.setProperties(data);
		this.set('content', item);
		this.set('loaded', true);

		App.auditController = App.AuditController.create();

        fn = function() {
            App.get('auditController').removeObserver('loaded', this, fn);	            			
        };

        App.get('auditController').addObserver('loaded', this, fn);


		App.auditController.loadByIdNameObject(this.get('content').id, this.get('content').constructor.toString());
		

		this.get('content').audits = App.get('auditController.content');

	},	
});

App.ProyectoCrearController = Em.Object.extend({
	content: '',
});


App.ScrollContentController = Ember.ArrayController.extend({
	scrolledContent: null,
	visibleItems: 10,
	currentPosition: 0,
	currentIndex: 0,
	content: null,
	step: 1,
	oldLength: 0,


	scrollUp: function () {
		var p = this.get('step') / this.get('content.length') * 100;
		p = Math.floor(p * 1000) / 1000;
		t = this.get('currentPosition') - p;
		if (t < 0)
			t = 0;
		this.scrollTo(t);
	},

	scrollDown: function () {
		var p = this.get('step') / this.get('content.length') * 100;
		p = Math.floor(p * 1000) / 1000;
		t = this.get('currentPosition') + p;
		if (t < 0)
			t = 0;
		this.scrollTo(t);
	},

	contentLengthChanged: function () {
		if (this.get('oldLength') > 0 && this.get('currentPosition') > 0) {

			var p = this.get('oldLength') / this.get('content.length') * 100;
			this.set('currentPosition', p);
		}
		this.set('oldLength', this.get('content.length'));
	}.observes('content.length'),

	contentChanged: function () {
		if (this.get('content')) {
			this.set('currentIndex', 0);
			var s = this.get('content').slice(this.get('currentIndex'), this.get('currentIndex') + this.get('visibleItems'));
			if (s.length > 0) {
				this.set('scrolledContent', s);
				this.set('currentPosition', 0);
				this.set('oldLength', this.get('content.length'));
			}
		}
	}.observes('content'),

	/*
	contentChanged: function () {
		if (this.get('content')) {
			var s = this.get('content').slice(this.get('currentIndex'), this.get('currentIndex') + this.get('visibleItems'));
			if (s.length > 0) {
				this.set('scrolledContent', s);
				this.set('oldLength', this.get('content.length'));
			}
		}
	}.observes('content'),
	*/	

	visibleItemsChanged: function () {
		var s = this.get('content').slice(this.get('currentIndex'), this.get('currentIndex') + this.get('visibleItems'));
		if (s.length > 0) 
			this.set('scrolledContent', s);
	}.observes('visibleItems'),


	scrollTo: function (position) {
		if (position >= 0 && position <= 100 && position != this.get('currentPosition')) {

			var topItems = this.get('content.length') - this.get('visibleItems');

			var newIndex = Math.round(position * topItems / 100);

			var positionDif = position - this.get('currentPosition');

			var diffItems = Math.abs(this.get('currentIndex') - newIndex);

			if (diffItems > this.get('visibleItems')) {
				this.set('scrolledContent', this.get('content').slice(newIndex, newIndex + this.get('visibleItems')));
			} else {
				if (positionDif > 0) {
					for (var i = 0; i < diffItems; i++) {
						this.get('scrolledContent').addObject(this.get('content').objectAt(this.get('currentIndex') + this.get('visibleItems') + i));
						this.get('scrolledContent').removeAt(0);
					};
					this.set('currentIndex', newIndex);
				} else {
					for (var i = 0; i < diffItems; i++) {
						this.get('scrolledContent').insertAt(0, this.get('content').objectAt(this.get('currentIndex') - (i + 1)));
						this.get('scrolledContent').removeAt(this.get('scrolledContent.length') - 1);
					};

					this.set('currentIndex', newIndex);
				}
			}

			this.set('currentPosition', position);
		}
	},
});

App.XHRAuthURLController = Ember.Object.extend({
	xhr : '',
	errorMessage: {	400: "CUIL o contraseña incorrectos", 
					401: "Por favor intente mas tarde nuevamente", 
					432: "Por favor intente mas tarde nuevamente" , 
					433: "Su sesión expiró", 
					434: "Acceso no autorizado", 
					435: "CUIL o mail incorrectos", 
					436: "Mail incorrecto", 
					437: "Falta cargar el mail", 
					438: "Falta cargar el cuit", 
					512: "Por favor intente mas tarde nuevamente", 
					513: "Por favor intente mas tarde nuevamente", 
					514: "Por favor intente mas tarde nuevamente", 
					515: "CUIL incorrecto", 
					516: "No se pudo enviar mail, intente mas tarde", 
					517: "Por favor intente mas tarde nuevamente" },

	getShowMessage: function (){
		var message =this.get('errorMessage')[this.get('xhr').status];
		if(message){
			return  message;	
		}else{
			return "";
		}
		
	},

	hasError: function (){
		return this.get('xhr').status != 200;
	},

});

App.MisVisitasGuiadasController = App.VisitasGuiadasController.extend({
	url: 'visitas-guiadas',
	cuil: '',

	load: function() {
		if (!App.get('userController.user')) return;

		this.set('loaded', false);

		url = this.get('url') + "/" + this.get('cuil');

		if ( url ) {
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'GET',
				context: this,
				contentType: 'text/plain',
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});
		}
	},	
});

App.MEExpedienteMovimientoController = Ember.ObjectController.extend({
	periodos: [132, 131, 130,  129, 128, 127,  126, 125, 124],
	
	movimientos: [
		{id: 17, nombre: 'VUELVE A DIPUTADOS'},
		{id: 22, nombre: 'SOLICITUD DEL AUTOR DE RETIRO DEL PROYECTO (AFIRMATIVA)'},
		{id: 23, nombre: 'SOLICITUD DEL AUTOR DE MODIFICACION DEL PROYECTO (AFIRMATIVA)'}
	],

	camaras: [
		{id: "D", nombre: "Diputados"}, 
		{id: "S", nombre: "Senado"}, 
		{id: "PE", nombre: "Poder Ejecutivo"}, 
		{id: "JGM", nombre: "Jefatura de Gabinete de Ministros"}
	],

	publicacionTipo: ['TP'],
});


App.DepartamentosController = App.RestController.extend({
	url: 'departamentos',
	type: App.Departamento,

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Departamento.extend(App.Savable).create(data);
		item.setProperties(data);
		
		if(save){
			$.ajax({
				url: '/departamento',
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

App.ProyectosMEController = App.RestController.extend({
	url: 'ME/exp/proyectos/search',

	type: App.Proyecto,
	useApi: true,
	sortProperties: ['expdipA', 'expdipN'],
	sortAscending: false,
	loaded: false,
	pageSize: 25,
	pageNumber: 1,
	query: null,
	isPaginated: false,

	filter: function (filterText) {
		this.set('loaded', false);
		this.set('loading', true);
		this.set('content', []);
		this.set('query', App.ProyectoQuery.extend(App.Savable).create({expdip: filterText}))
		this.set('query.pageNumber', 1);
		this.set('query.pageSize', 100);
		this.load();					
	},
	
	buildURL: function (filterText) {
		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		url += "/" + filterText;
		return url;		
	},

	init : function(){
		this._super();
	},

	nextPage: function () {
		this.set('pageNumber', this.get('pageNumber') + 1);
		this.set('newestContent', []);
		this.set('newestContentReady', false);
		this.load();
	},

	load: function() {
		if (!App.get('userController.user')) return;

		this.set('loaded', false);

		var getJSON = {};

		if(this.get('query'))
		{
			this.set('query.pageNumber', this.get('pageNumber'));
			this.set('query.pageSize', this.get('pageSize'));			
			getJSON = this.get('query').getJson();
		}

		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;


		if ( url ) {
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'POST',
				context: this,
				contentType: 'text/plain',
				crossDomain: 'true',			
				data : getJSON,
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});

		}
	},

	parse: function (data) {
		return data.proyectos;
	},

	loadSucceeded: function(data) {
		var items = this.parse(data);
		var lista = [];

		if(!data || !items){
			App.get('proyectosController').set('loaded', true);
			return;
		}

		items.forEach(function(i){
			this.createObject(i);
		}, this);

		if (this.get('newestContent')) {
			this.set('newestContentReady', true);
		}

		this.set('recordcount', data.recordcount);
		this.set('loading', false);
		this.set('loaded', true);

		this.set('isPaginated', false);
	},

	createObject: function (data, save) {
	
		save = save || false;
		
		item = App.Expediente.extend(App.Savable).create(data);
		item.setProperties(data);

		if (this.get('newestContent')) {
			this.get('newestContent').addObject(item);			
		}

		this.addObject(item);
	},	
});



App.ExpedientesNewController = App.RestController.extend({
	url: 'exp/proyectos/search',

	type: App.Expediente,
	useApi: true,
	sortProperties: ['expdipA', 'expdipN'],
	sortAscending: false,
	loaded: false,
	pageSize: 25,
	pageNumber: 1,
	query: null,
	isPaginated: false,

	buildURL: function (filterText) {
		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;
		url += "/" + filterText;
		return url;		
	},

	init : function(){
		this._super();
	},

	nextPage: function () {
		this.set('pageNumber', this.get('pageNumber') + 1);
		this.set('newestContent', []);
		this.set('newestContentReady', false);
		this.load();
	},

	load: function() {
		if (!App.get('userController.user')) return;

		this.set('loaded', false);

		var getJSON = {};

		if(this.get('query'))
		{
			this.set('query.pageNumber', this.get('pageNumber'));
			this.set('query.pageSize', this.get('pageSize'));			
			getJSON = this.get('query').getJson();
		}

		var url =  this.get('url');
		if (this.get('useApi'))
			url = App.get('apiController').get('url') + url;


		if ( url ) {
			$.ajax({
				url:  url,
				dataType: 'JSON',
				type: 'POST',
				context: this,
				contentType: 'text/plain',
				crossDomain: 'true',			
				data : getJSON,
				success: this.loadSucceeded,
				complete: this.loadCompleted,
			});

		}
	},

	parse: function (data) {
		return data.proyectos;
	},

	loadSucceeded: function(data) {
		var items = this.parse(data);
		var lista = [];

		if(!data || !items){
			App.get('expedientesController').set('loaded', true);
			return;
		}

		items.forEach(function(i){
			this.createObject(i);
		}, this);

		if (this.get('newestContent')) {
			this.set('newestContentReady', true);
		}

		App.set('expedientesController.recordcount', data.recordcount);
		App.get('expedientesController').set('loading', false);
		App.get('expedientesController').set('loaded', true);

		this.set('isPaginated', false);
	},

	createObject: function (data, save) {
		save = save || false;
		
		item = App.Expediente.extend(App.Savable).create(data);
		item.setProperties(data);

		if (this.get('newestContent')) {
			this.get('newestContent').addObject(item);			
		}

		this.addObject(item);
	},	
});


App.CrearODSinDictamenController = Ember.ObjectController.extend({

});