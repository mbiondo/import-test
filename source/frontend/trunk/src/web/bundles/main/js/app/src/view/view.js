JQ = Ember.Namespace.create();


Ember.View.reopen({
	didInsertElement: function () {
		this._super();

		if (this.$()){
			this.$().fadeIn(500);
			/*
				// Use debugTemplates() # params: true/false
				// NOTA: Recordar comentar linea al comitear
			*/
			//this.$('').not("option").prepend('<div class="view-template-block"><div class="view-template-name">' + this.get('templateName') + '</div></div>');
			
			//new WOW().init();

		}
	},
});

JQ.Widget = Em.Mixin.create({

	didInsertElement: function () {
		this._super();
		"use strict";
		var options = this._gatherOptions(), ui;

		this._gatherEvents(options);

		if (typeof jQuery.ui[this.get('uiType')] === 'function') {
			ui = jQuery.ui[this.get('uiType')](options, this.get('element'));
		} else {
			ui = $(this.get('element'))[this.get('uiType')](options);
		}
		
		this.set('ui', ui);
	},

	willDestroyElement: function () {
		"use strict";
		var ui = this.get('ui'), observers, prop;

		if (ui) {
			observers = this._observers;
			for (prop in observers) {
				if (observers.hasOwnProperty(prop)) {
					this.removeObserver(prop, observers[prop]);
				}
			}
			//ui._destroy();
		}
	},

	_gatherOptions: function () {
		"use strict";
		var uiOptions = this.get('uiOptions'), options = {};

		uiOptions.forEach(function (key) {
			options[key] = this.get(key);

			var observer = function () {
				var value = this.get(key);
				this.get('ui')._setOption(key, value);
			};

			this.addObserver(key, observer);

			this._observers = this._observers || {};
			this._observers[key] = observer;
		}, this);

		return options;
	},


	_gatherEvents: function (options) {
		"use strict";
		var uiEvents = this.get('uiEvents') || [], self = this;

		uiEvents.forEach(function (event) {
			var callback = self[event];

			if (callback) {
				options[event] = function (event, ui) { return callback.call(self, event, ui); };
			}
		});
	}
});

App.ModalView = Bootstrap.ModalPane.extend({
	showBackdrop: true,
});

JQ.Button = Em.View.extend(JQ.Widget, {
	uiType: 'button',
	uiOptions: ['disabled', 'text', 'icons', 'label'],
	uiEvents: ['create'],

	tagName: 'button'
});

JQ.ChosenMultipleSelect = Em.Select.extend({
	multiple: true,
	attributeBindings: [ 'multiple' ],
	placeholder: '',


 
	selectionChanged: function() {
		this.$().trigger('liszt:updated');
	}.observes('selection')
});

JQ.Menu = Em.CollectionView.extend(JQ.Widget, {
	uiType: 'menu',
	uiOptions: ['disabled'],
	uiEvents: ['create', 'focus', 'blur', 'select'],

	tagName: 'ul',


	arrayDidChange: function (content, start, removed, added) {
		"use strict";
		this._super(content, start, removed, added);

		var ui = this.get('ui');
		if (ui) {

			Em.run.schedule('render', function () {
				ui.refresh();
			});
		}
	}
});


Ember.TextField.reopen({
	attributeBindings: ['search-widget', 'accesskey', 'data-required', 'data-error-message', 'data-validation-minlength', 'data-type', 'name', 'pattern', 'maxlength', 'data-min' , 'data-max', 'readonly', 'data-trigger', 'parsley-trigger', 'data-americandate', 'autofocus', 'data-minlength', 'data-maxlength', 'data-length' , 'data-range', 'data-pattern', 'data-parsley-pattern', 'autocomplete'],
});

Ember.Select.reopen({
	attributeBindings: ['search-widget', 'accesskey', 'data-required', 'data-error-message', 'data-validation-minlength', 'data-type', 'name', 'pattern', 'maxlength', 'data-min' , 'data-max', 'readonly', 'data-trigger', 'parsley-trigger', 'data-americandate', 'autofocus', 'data-minlength', 'data-maxlength', 'data-range', 'disabled'],
});


Ember.TextArea.reopen({
	attributeBindings: ['accesskey', 'data-required', 'data-error-message', 'data-validation-minlength', 'maxlength'],
});

Ember.Checkbox.reopen({
	attributeBindings: ['data-group', 'name'],
});

Ember.Select.reopen({
	attributeBindings: ['autofocus'],
});

JQ.DatePicker = Em.View.extend(JQ.Widget, {
	uiType: 'datepicker',
	uiOptions: ['disabled', 'altField', 'altFormat', 'appendText', 'autoSize', 'buttonImage', 'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear', 'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames', 'dayNamesMin', 'dayNamesShort', 'defaultDate', 'duration', 'firstDay', 'gotoCurrent', 'hideIfNoPrevNext', 'isRTL', 'maxDate', 'minDate', 'monthNames', 'monthNamesShort', 'navigationAsDateFormat', 'nextText', 'numberOfMonths', 'prevText', 'selectOtherMonths', 'shortYearCutoff', 'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear', 'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths', 'weekHeader', 'yearRange', 'yearSuffix'],
	uiEvents: ['create', 'beforeShow', 'beforeShowDay', 'onChangeMonthYear', 'onClose', 'onSelect', 'onChange'],

	tagName: 'input',
	type: "text",
	attributeBindings: ['type', 'value', 'placeholder', 'data-validation-minlength', 'data-required', 'data-error-message', 'readonly', 'data-americandate', 'data-trigger', 'parsley-trigger','tabindex'],
});

App.DatePicker = JQ.DatePicker.extend({
  dateFormat: 'dd/mm/yy', //ISO 8601
   attributeBindings: ['data-required', 'data-error-message', 'data-validation-minlength', 'parsley-regex', 'data-americandate', 'data-trigger', 'parsley-trigger', 'tabindex' ],
 
  beforeShowDay: function(date) {
	  return [true, ""];
  },
  
  onSelect: function (date) {
	this.set('value', date)
	this.$("").parsley('validate');
  },
});

App.SubMenuView = Ember.View.extend({
	templateName: "sub-menu",

	clickItem: function (item) {

		App.get('menuController').seleccionar(item.get('id'));
	},

	goBack: function () {
		var $secondLevel = $('.secondLevel'),
			$firstLevel = $('.firstLevel');

		$secondLevel.animate({
			opacity:0
		}, 500, function(){
			$secondLevel.css('display','none');
			$('.firstLevel').css('display','block');
			$firstLevel.animate({
				opacity:1
			}, 500,function(){
				//callback
			});
		});

		//tooltip bootstrap 3
		$().tooltip();
	},

	misExpedientes: function () {
		App.expedientesController.set('query', App.ExpedienteQuery.extend(App.Savable).create({firmante: App.userController.user.apellido + " " + App.userController.user.nombre}));
		App.expedientesController.set('pageNumber', 1);
		App.expedientesController.set('content', []);
		App.expedientesController.load();
		App.get('router').transitionTo('root.expedientes.index');

	},

	query: function (query) {
		App.expedientesController.set('query', query);
		App.expedientesController.set('pageNumber', 1);
		App.expedientesController.set('content', []);
		App.expedientesController.load();
		App.get('router').transitionTo('root.expedientes.index');
	},	
	
});

App.SubMenuExpedientesView = App.SubMenuView.extend({
	templateName: 'sub-menu-expedientes',

	misExpedientes: function () {
		App.expedientesController.set('query', App.ExpedienteQuery.extend(App.Savable).create({firmante: App.userController.user.apellido + " " + App.userController.user.nombre}));
		App.expedientesController.set('pageNumber', 1);
		App.expedientesController.set('content', []);
		App.expedientesController.load();
	},

	query: function (query) {
		App.expedientesController.set('query', query);
		App.expedientesController.set('pageNumber', 1);
		App.expedientesController.set('content', []);
		App.expedientesController.load();
	},
});


App.SubMenuQueryView = Ember.View.extend({
	templateName: 'sub-menu-query-item',
	tagName: 'li',
	loading: false,

	click: function () {
		if (!this.get('loading'))
			this.get('parentView').query(this.get('content'));
	},

	didInsertElement: function () {
		this._super();
		App.get('expedientesController').addObserver('loaded', this, this.expedientesLoading);
	},

	expedientesLoading: function () {
		if (App.get('expedientesController.loaded'))
		{
			this.set('loading', false);
		}
		else
		{
			this.set('loading', true);
		}
	},

})

App.SubMenuOradoresView = App.SubMenuView.extend({
	templateName: "sub-menu-oradores",

	crearTema: function () {
		var orden = App.get('sesionController.content.temas.length');
		if (orden == null)
			orden = 0;
			
		var tema = App.Tema.create({
					sesionId:  App.get('sesionController').get('content').get('id'), 
					orden: orden,
				});
				App.get('crearTemaController').set('tema', tema);
		App.CrearTemaView.popup();
	},
		
	borrarTema: function () {
		var temaController = App.get('temaController');
		temaController.set('borrarTema', !temaController.get('borrarTema'));
	},

	startTimer : function () {
		App.get('sesionesController').startTimer(App.get('sesionController.content'));

		var sesionId = App.get('sesionController').get('content').get('id');
		var temasSesion = App.get('sesionController').get('content').get('temas');
		var numSesion = App.get('sesionController').get('content').get('sesion');
		var reunion = App.get('sesionController').get('content').get('reunion');

		//CREATE NOTIFICATION TEST 
		var notification = App.Notificacion.extend(App.Savable).create();
		//ACA TITULO DE LA NOTIFICACION
		notification.set('tipo', 'iniciarSesion');	
		//Si hace falta ID del objeto modificado
		notification.set('objectId', sesionId);
		//Link del objeto
		notification.set('link', "/#/laborparlamentaria/recinto/oradores/sesion/" + sesionId + "/tema/" + temasSesion[0].id);
		//CreateAt
		notification.set('fecha', moment().format('YYYY-MM-DD HH:mm:ss'));
		//Custom message
		notification.set('mensaje', "Ha iniciado la Sesión " + numSesion + ", Reunión " + reunion + " del día " + moment().format('LL'));
		//notification.set('comisiones', this.get('content.comisiones'));
		//Crear
		notification.create();

	},

	stopTimer : function () {
		App.get('sesionesController').stopTimer(App.get('sesionController.content'));
		var sesionId = App.get('sesionController').get('content').get('id');
		var temasSesion = App.get('sesionController').get('content').get('temas');
		var numSesion = App.get('sesionController').get('content').get('sesion');
		var reunion = App.get('sesionController').get('content').get('reunion');

		//CREATE NOTIFICATION TEST 
		var notification = App.Notificacion.extend(App.Savable).create();
		//ACA TITULO DE LA NOTIFICACION
		notification.set('tipo', 'finalizarSesion');	
		//Si hace falta ID del objeto modificado
		notification.set('objectId', sesionId);
		//Link del objeto
		notification.set('link', "/#/laborparlamentaria/recinto/oradores/sesion/" + sesionId + "/tema/" + temasSesion[0].id);
		//CreateAt
		notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
		//Custom message
		notification.set('mensaje', "Ha finalizado la Sesión " + numSesion + ", Reunión " + reunion + " del día " + moment().format('LL'));
		//notification.set('comisiones', this.get('content.comisiones'));
		//Crear
		notification.create();
	},	

	hayOradoresPendientes: function(){
		var oradorPendiente = App.get('turnosController.content').findProperty('oradorPendiente', true);
		var cantidad = 0;
		if (oradorPendiente != null) {
			cantidad = oradorPendiente.length;
		}
		return cantidad > 0;
	}.property('App.turnosController.content.@each.oradorPendiente').cacheable(),


	didInsertElement: function(){
		this._super();

		this.$('.widget-menu a').tooltip();
	}

});

App.ContentView = Ember.View.extend({
	templateName: 'content',

	toggleMenu: false,
	toggleHelp: true,
	oldColumns: [],

	refresh: function () {
		window.location.reload();
	},
 

	appColumnsChange: function () {
		this.set('columns', App.get('router.applicationController.columns'));
		
		var l = this.get('toggleMenu') == true ? 1 : this.get('columns').objectAt(0);
		var r = this.get('toggleHelp') == true ? 0 : this.get('columns').objectAt(2);
		var m = this.get('toggleMenu') == true ? this.get('columns').objectAt(1) + (this.get('columns').objectAt(0) - 1) : this.get('columns').objectAt(1);

		if (this.get('toggleHelp')) {
			m = m + this.get('columns').objectAt(2);
		}	

		this.setupColumns(l, m, r);

	}.observes('App.router.applicationController.columns.@each'),

	setupColumns: function (l, m, r) {
		var $leftColumn = $('#leftColumn'),
			$middleColumn = $('#middleColumn'),
			$rightColumn = $('#rightColumn');

		$leftColumn.removeClass('col-md-' + this.get('oldColumns').objectAt(0)).addClass('col-md-' + l);
		$middleColumn.removeClass('col-md-' + this.get('oldColumns').objectAt(1)).addClass('col-md-' + m);
		$rightColumn.removeClass('col-md-' + this.get('oldColumns').objectAt(2)).addClass('col-md-' + r);
		this.set('oldColumns', [l, m, r]);
	},

	changetoggleMenu: function () {
		Ember.run.next(function () {
			this.$('.toggleMainMenu').tooltip();
		});
	}.observes('toggleMenu'),

	clickMenu: function () {
		var $menuWrapper =  this.$('#mainMenu');
		var $menuWrapperTiny =  this.$('#mainMenuTiny');

		$menuWrapper.toggle();
		$menuWrapperTiny.toggle();

		if (this.get('toggleMenu')) {
			this.setupColumns(this.get('columns').objectAt(0), this.get('oldColumns').objectAt(1) - (this.get('columns').objectAt(0)) + 1, this.get('oldColumns').objectAt(2));
		}
		else {
			this.setupColumns(1, this.get('oldColumns').objectAt(1) + (this.get('oldColumns').objectAt(0) - 1), this.get('oldColumns').objectAt(2));
		}

		this.set('toggleMenu', !this.get('toggleMenu'));

	},


	clickHelp: function () {

		if (this.get('toggleHelp')) {
			this.setupColumns(this.get('oldColumns').objectAt(0), this.get('oldColumns').objectAt(1) - this.get('columns').objectAt(2) , this.get('columns').objectAt(2));
			Ember.run.next(function () {
				$('.support').fadeIn('slow'); 
			});
			this.helpMessage(false);
		}
		else {
			this.setupColumns(this.get('oldColumns').objectAt(0), this.get('oldColumns').objectAt(1) + (this.get('columns').objectAt(2)), 0);
			this.$('.support').hide(); 
			this.helpMessage(true);
		}	
		this.set('toggleHelp', !this.get('toggleHelp'));	
	},

	helpMessage: function (contextHelp){
		var $toggleHelp = this.$('.toggleHelp');

		if (contextHelp == true){
			$toggleHelp.hover(function(){
				$toggleHelp.popover('show');

			},function(){
				$toggleHelp.popover('hide');
			});
		}
		else
		{
			$toggleHelp.hover(function(){
				$toggleHelp.popover('destroy');
			});
		}
	},

	logout: function () {
		App.get('router').transitionTo('loading');
		
		localStorage.setObject('user', null);
		App.get('userController').set('user', null);
		
		App.get('router').transitionTo('index');
	},

	changePassword: function () {
		
/*
		App.get('router').transitionTo('loading');
		App.get('router').transitionTo('index');
*/

		if (App.get('userController.user'))
			App.get('userController').set('user.first_login', true);

		App.get('userController').set('changePassword', true);
		/*
		App.userController.set('user', null);
		localStorage.setObject('user', null);

		App.get('router').transitionTo('loading');
		App.get('router').transitionTo('index');

		$.jGrowl('Su sesión ha caducado, por favor ingrese nuevamente', { life: 5000 });
		*/
	},

	marcarTodas: function () {
		App.get('notificacionesController').marcarTodas();
	},

	didInsertElement: function () {
		this._super();
		var $menuWrapperTiny =  this.$('#mainMenuTiny');
		$menuWrapperTiny.toggle();
		this.set('columns', App.get('router.applicationController.columns'));
		this.setupColumns(this.get('columns').objectAt(0), this.get('columns').objectAt(1) + this.get('columns').objectAt(2), 0);
		this.helpMessage(true);
		this.$('.toggleMainMenu').tooltip();
/*
		shortcut("F1",function() {
			$(".toggleHelp").trigger("click");
		});
*/

/*
		var firmantes = [
			{id:1853, nombre: "ABRAHAM, ALEJANDRO"}
		];

						
		var notiTest = App.Notificacion.extend(App.Savable).create();

		//ACA TITULO DE LA NOTIFICACION
		notiTest.set('tipo', 'firmanteTest');	
		//Si hace falta ID del objeto modificado
		notiTest.set('objectId', 54);
		//Link del objeto
		notiTest.set('link', "#/visitas-guiadas/visita/54/ver");
		//CreateAt
		notiTest.set('fecha', moment().format('YYYY-MM-DD HH:mm'));

		notiTest.set('mensaje', "Probando notficiacion para firmantes");

		notiTest.set('firmantes', firmantes);
		//Crear
		notiTest.create();	
*/
	},	
});

App.LoginInput = Ember.TextField.extend({
	insertNewline: function(){
		if(!$('#login').parsley('validate')) return false;
	},
});


App.ChangePasswordView = Ember.View.extend({
	templateName: 'change-password',
	password: '',
	password_confirm: '',

	comparePasswordisValid: function(){
		if(this.get('password') == this.get('password_confirm')) return true;
		else return false;
	}.property('password', 'password_confirm'),
	changePassword: function () {		
		var data;
		_self = this;

		if($('#login').parsley('validate'))
		{
			_self.set('loading', false);
			if(App.get('userController.access_token'))
			{
				$.ajax({
					url: App.get('apiController.authURL') + 'change_password/',
					dataType: 'JSON',
					type: 'PUT',
					context : {controller: this},
			    	headers: {'Authorization': 'Bearer ' + App.get('userController.access_token')},
					data : {password: this.get('password') },
					success: this.changeSucceeded,
				});
			}
			else
			{			
				if(this.get('comparePasswordisValid'))
				{
					$.ajax({
						url: App.get('apiController.authURL') + 'change_password/',
						dataType: 'JSON',
						type: 'PUT',
						context : {controller: this},
						data : {password: this.get('password') },
						success: this.changeSucceeded,
					});
				}
			}


		}
	},

	cancel: function () {

		if (App.get('userController.user'))
			App.get('userController').set('user.first_login', false);

		App.get('userController').set('changePassword', false);
		
		App.get('router').transitionTo('loading');
		App.get('router').transitionTo('index');		
	},

	changeSucceeded: function (data) {
		_self.set('loading', false);
		if (data.is_valid == true)
		{
			if(App.get('userController.isLogin'))
			{
				App.get('userController.user').set('first_login', false);
			}

			App.get('userController').set('changePassword', false);

			localStorage.setObject('user', JSON.stringify(App.userController.user));
			App.get('router').transitionTo('loading');
			App.get('router').transitionTo('index');
			$.jGrowl( jGrowlMessage.modificadoContrasena.message , { life: jGrowlMessage.modificadoContrasena.life });
		}else{
			$.jGrowl( jGrowlMessage.noModificadoContrasena.message , { life: jGrowlMessage.noModificadoContrasena.life });
		}
	},

	didInsertElement: function () {
		this._super();
		this.set('imageClass', 'login-background-0' + Math.floor((Math.random() * 5) + 1));
	}	
});

App.LoginView = Ember.View.extend({
	templateName: 'login',

	cuil: '',
	password: '',

	loading: false,


	didInsertElement: function () {
		this._super();
		this.set('imageClass', 'login-background-0' + Math.floor((Math.random() * 5) + 1));
		this.$('#user_username'	).focus();
	},

	loadingChange: function () {
		return App.get('userController.loading');
	}.observes('App.userController.loading'),
	
	loginError: function(){
		return App.get('userController.loginError');
	}.property('App.userController.loginError'),

	loginMessage: function () {
		return App.get('userController.loginMessage');
	}.property('App.userController.loginMessage'),		

	login: function () {
		if(!$('#login').parsley('validate')) return false;
		App.get('userController').loginCheck(this.get('cuil'), this.get('password'));
	},

	recoveryPassword: function() {
		App.get('userController').set('recoveryPassword', true);
	},

	solicitarAcceso: function () {
		App.get('userController').set('createUser', true);
	}
});

App.ListHeaderItemView = Em.View.extend({
	templateName: 'list-header-item',
});

App.ListHeaderWithSortItemView = App.ListHeaderItemView.extend({
	templateName: 'list-header-item-with-sort',

	sortAsc: function () {
		this.get('parentView').ordenarPorCampo(this.get('content').get('campo'), true);
	},

	sortDesc: function () {
		this.get('parentView').ordenarPorCampo(this.get('content').get('campo'), false);
	},

});

App.ListHeaderView = Em.CollectionView.extend({
	itemViewClass: App.ListHeaderItemView,
});

App.ListHeaderWithSortView = App.ListHeaderView.extend({
	templateName: 'list-header-item-with-sort',
	itemViewClass: App.ListHeaderWithSortItemView,
	sortablController: null,

	ordenarPorCampo: function (campo, asc){
		// comentado por si despues se quiere usar (cuando se da click a un ordenar,)
		// $(document).scrollTop($("#Expedientes").offset().top);
		this.get('sortablController').set('sortProperties', [campo]);
		this.get('sortablController').set('sortAscending', asc);

	},	
});

App.SimpleListItemView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'simple-list-item',
});



App.ListFilterView = Ember.View.extend({
	templateName: 'simple-list',
	filterListText: '',
	filterText: '',
	filterTextComisiones: '',
	step: 10,
	records: [10, 25, 50, 100],
	itemViewClass: App.SimpleListItemView,
	headerViewClass : App.ListHeaderView,
	columnas: ['ID', 'Label'],
	puedeExportar: false,
	filterTextChanged: false,
	delayFilter: 500,


	didInsertElement: function(){
		this._super();
	},

	filterTextChangedText: function () {
		_self = this;

		if (this.get('interval'))
			clearInterval(this.get('interval'));		

		this.set('interval', setInterval(function () {
			_self.set('filterTextChanged', true);
			clearInterval(_self.get('interval'));
		}, this.get('delayFilter')));
	}.observes('filterText'),


	filterList: function(){
		this.set('filterListText', this.get('parentView.filterList'));
	}.observes('parentView.filterList'),

	filterTextChangedScroll: function () {
		//this.set('scroll', 0);
		/*if(this.get('filterText').length == 1)*/
			this.set('scroll', $(document).scrollTop());
	}.observes('filterText'),

	mostrarMas: function () {
		this.set('scroll', $(document).scrollTop());
		this.set('totalRecords', this.get('totalRecords') + this.get('step'));
	},
	
	lista: function (){
		if(this.get('parentView.filterList')){
			var regex = new RegExp("role_" + this.get('filterListText').toString().toLowerCase());
		}else{
			var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		}

		var filtered;

		if(this.get('content'))
		{
			filtered = this.get('content').filter(function(item){
				return regex.test(item.get('label').toLowerCase());
//				return regex.test(item.get('label'));
			});
		}

		if (!filtered)
			filtered = [];

		var max = this.get('totalRecords');
		if (filtered.length <= max) {
			max = filtered.length;
			this.set('mostrarMasEnabled', false);
		} else {
			this.set('mostrarMasEnabled', true);
		}

		this.set('filterTextChanged', false);
		
		return filtered.slice(0, this.get('totalRecords'));
	}.property('filterListText', 'content', 'totalRecords', 'step', 'content.@each', 'filterTextChanged'),
	
	updateScroll: function () {
		_self = this;

		Ember.run.next(this, function () {
			$(document).scrollTop(_self.get('scroll'));
		});
	}.observes('lista'),

	totalRecords: 10,
});



App.ListFilterWithSortView = App.ListFilterView.extend({
	templateName: 'sortable-list',
	headerViewClass : App.ListHeaderWithSortView,
	sortablController: null,
	columnas: [
		App.SortableColumn.create({nombre: 'ID', campo: 'id'}), 
		App.SortableColumn.create({nombre: 'Label', campo: 'label'})
	],
});




App.ConfirmActionPopupView = App.ModalView.extend({
	templateName: 'confirmar-accion-popup',

	callback: function(opts, event){

		if (opts.primary) {
			App.get('confirmActionController').set('success', true);
		} else if (opts.secondary) {
			//alert('cancel')
			App.get('confirmActionController').set('success', false);
		} else {
			//alert('close')
			App.get('confirmActionController').set('success', false);
		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();

		// add shortcut
		var shortcuts = ["enter"];
		var shortcuts_buttonFocus = [];
			shortcuts_buttonFocus["enter"] = ["ventanaModalConfirmar"];

			shortcuts.forEach(function(getShortcut){
				shortcut.add(getShortcut, function(){
					if($(".modal").is(":visible"))
					{
						inputClass = "." + shortcuts_buttonFocus[getShortcut];

						$(inputClass).click();
					}
				});
			});		
	},
	willDestroyElement: function(){
		this._super();
		// remove shorcut
		var shortcuts = ["enter"];
		shortcuts.forEach(function(item){
			shortcut.remove(item);
		});
	},
});



//DIPUTADOS ORADORES VIEW

App.OradoresDiputadoIndexView = Ember.View.extend({
	templateName: 'oradores-diputados-index',
});

App.OradoresDiputadoSesionConsultaView = Ember.View.extend({
	templateName: 'oradores-diputados-sesion-consulta',

	showList: false,

	toggleList: function () {
		this.set('showList', true);
	},

	toggleData: function () {
		this.set('showList', false);
	},

	didInsertElement: function(){
		this._super();
		//===== Accordion =====//		
		$('div.menu_body:eq(0)').show();
		$('.acc .whead:eq(0)').show().css({color:"#2B6893"});
		$(".acc .whead").click(function(){
			$(this).css({color:"#2B6893"}).next("div.menu_body").slideToggle(200).siblings("div.menu_body").slideUp("slow");
			$(this).siblings().css({color:"#404040"});
		});
	},
});



//Citaciones List


App.CalendarItemListView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'citacion-item',

	verPlanDeLabor: function () {
		App.get('router').transitionTo('planDeLabor.planDeLabor.ver', this.get('content'));
	},
});

App.CalendarListView = App.ListFilterView.extend({ 
	itemViewClass: App.CalendarItemListView, 	
	columnas: ['Fecha', 'Título', 'Sala', 'Observaciones', 'Estado'],
});


//PLAN DE LABOR



App.PlanDeLaborItemView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'plan-de-labor-item',

	verPlanDeLabor: function () {
		App.get('router').transitionTo('planDeLabor.planDeLabor.ver', this.get('content'));
	},
});

App.PlanDeLaborListView = App.ListFilterView.extend({ 
	itemViewClass: App.PlanDeLaborItemView, 	
	columnas: ['Fecha Estimada', 'Observaciones', 'Ver'],
});


App.PlanDeLaborView = Ember.View.extend({
	templateName: 'plan-de-labor-detalle',
	contentBinding: "App.planDeLaborController.content",


	crearSesion: function () {

		var sesion = App.Sesion.extend(App.Savable).create({titulo:"Sesion " + moment(this.get('content.fechaEstimada'), 'YYYY-MM-DD HH:ss').format('MM/DD/YYYY') , fecha: moment(this.get('content.fechaEstimada'), 'YYYY-MM-DD HH:mm').unix(), tipo: "SesionOrdinariaDeTablas", periodoOrdinario:130, sesion:6, reunion:7, idPl: this.get('content.id')});

		var temas = [];
		var orden = 0;
		sesion.set('plId', this.get('content.id'));

		this.get('content.items').forEach(function (item) {
			var tema = App.Tema.create();

			tema.setProperties({
					titulo: item.get('sumario'),
					orden: orden,
					plId: 0,
					plTipo: 'p',
					plGrupo: item.get('grupo.descripcion'),
					plItemId: item.get('id'),
			});

			temas.addObject(tema);

			orden = orden + 1;

			/*
			if (item.get('dictamenes')) {
				item.get('dictamenes').forEach(function (dictamen){
					var tema = App.Tema.create();
					tema.setProperties({
							titulo: "Dictamen: " + dictamen.sumario,
							orden: orden,
							plId: dictamen.id,
							plTipo: 'd',
							plGrupo: '',
							plItemId: item.get('id'),
					});
					temas.addObject(tema);
					orden = orden + 1;
				});
			}

			if (item.get('proyectos')) {
				item.get('proyectos').forEach(function (expediente){
					temas.addObject(
						App.Tema.create({
							titulo: "Expediente " + expediente.expdip + " " + expediente.tipo,
							orden: orden,
							plId: expediente.id,
							plTipo: 'e',
							plGrupo: '',
							plItemId: item.get('id'),
						})
					);
					orden = orden + 1;
				});				
			}
		
		*/

			var data = [];
			data.addObjects(this.get('item.dictamenes'));
			data.addObjects(this.get('item.proyectos'));

			data.get('content').forEach(function (object) {
				if (object.constructor.toString() == 'App.Expediente') {
					temas.addObject(
						App.Tema.create({
							titulo: "Expediente " + object.expdip + " " + object.tipo,
							orden: object.orden,
							plId: object.id,
							plTipo: 'e',
							plGrupo: '',
							plItemId: item.get('id'),
						})
					);
	    		} else if (object.constructor.toString() == 'App.OrdeDelDia') {
					var tema = App.Tema.create();
					tema.setProperties({
							titulo: "Dictamen: " + object.sumario,
							orden: object.orden,
							plId: object.id,
							plTipo: 'd',
							plGrupo: '',
							plItemId: item.get('id'),
					});
					temas.addObject(tema);
	    		}
			}, this);
		});
		sesion.set('temas', temas);

		var url = "crearSesion/planDeLabor";

		$.ajax({
			url: url,
			contentType: 'text/plain',
			dataType: 'JSON',
			type: 'POST',
			context : {model : sesion },
			data : sesion.getJson(),
			success: this.createSucceeded,
		});
	},

	createSucceeded: function (data) {
		if (data.success == true) {
			this.model.set('id', data.id);

			console.log(this.model)

			//CREATE NOTIFICATION TEST 
			var notification = App.Notificacion.extend(App.Savable).create();
			//ACA TITULO DE LA NOTIFICACION
			notification.set('tipo', 'crearSesion');	
			
			notification.set('titulo', 'Crear Sesion');

			//Si hace falta ID del objeto modificado
			notification.set('objectId', data.id);
			//Link del objeto
			notification.set('link', "#/laborparlamentaria/recinto/oradores/sesion/" + data.id + "/ver");
			//CreateAt
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			//Custom message
			notification.set('mensaje', "Se ha creado la Sesión del día " +  moment.unix(this.model.get('fecha')).format('LL'));
			//Crear
			notification.create();		

			App.get('router').transitionTo('planDeLabor.recinto.oradores.sesionConsulta.indexSubRoute', this.model);
		}		
	}

});

App.PlanDeLaborListadoView = Ember.View.extend({
	templateName: 'plan-de-labor-listado',

	tituloNuevo: function () {
		var titulos = ['Planes de Labor Tentativos', 'Planes de Labor Confirmados', 'Planes de Labor Definitivos'];
		var estado = App.get('planDeLaborListadoController.estado');
		var str = '';

		str = titulos[estado];		

		if(str.length > 0)
		{
			return str;
		}

	}.property('App.planDeLaborListadoController.estado'),
	titulo: function () {
		switch (App.get('planDeLaborListadoController.estado')) {
			case "0":
				return "Planes de labor tentativos";
				break;
			case "1":
				return "Planes de labor confirmados";
				break;
			case "2":
				return "Planes de labor definitivos";
				break;								
		}
		return "";
	}.property('App.planDeLaborListadoController.estado'),
});

App.ODMiniView = Ember.View.extend({
	templateName: 'od-mini',

	hasDocument: true,
	loading: false,

	borrar: function(item){
		this.get('parentView').get('parentView').borrarOD(this.get('content'));
	},
	dictamen: function () {
		if (this.get('content.dictamen'))
			return App.Dictamen.create(this.get('content.dictamen'));
		else
			return null;
	}.property('content'),


	openDocument: function () {
		delete $.ajaxSettings.headers["Authorization"];
		this.set('loading', true);
		$.ajax({
			url: this.get('content.documentURL'),
			type: 'GET',
			success: this.loadSucceeded,
			complete: this.loadCompleted,
			contentType: 'text/plain',
			crossDomain: true,
			context: this,
		});			
	},

	loadCompleted: function () {
		var usuario = App.userController.get('user');
		$.ajaxSetup({
	    	headers: { 'Authorization': usuario.get('token_type') + ' ' +  usuario.get('access_token') }
		});				
	},	

	loadSucceeded: function (data) {
		this.set('loading', false);
		if (data == "")
		{
			this.set('hasDocument', false);
		} 
		else
		{
			window.open(this.get('content.documentURL'), '_blank');
		}
	},

});

App.ExpedienteMiniView = Ember.View.extend({
	templateName: 'expediente-mini',	

	borrar: function(item){
		this.get('parentView').get('parentView').borrarExpediente(this.get('content'));
	},
	texto: function () {
		if (this.get('content.texto')) {
			return this.get('content.texto').htmlSafe();
		}
		else {
			return "";
		}
	}.property('content.texto'),
});

//OD

App.DictamenMiniView = Ember.View.extend({
	templateName: 'dictamen-mini',
	didInsertElement: function(){
		this._super();
		//===== Accordion =====//		
		$('div.menu_body:eq(0)').show();
		$('.acc .whead:eq(0)').show().css({color:"#2B6893"});
		
		$(".acc .whead").click(function() {	
			$(this).css({color:"#2B6893"}).next("div.menu_body").slideToggle(200).siblings("div.menu_body").slideUp("slow");
			$(this).siblings().css({color:"#404040"});
		});
	},	
});

App.OrdenDelDiaCrearView = Ember.View.extend({
	templateName: 'orden-del-dia-crear',
	url: '',
	anio: '',
	numero: '',
	fecha: '',
	copete: '',

	uploadFolder: function () {
		return "uploads/od/" + App.get('dictamenController.content.id') + "/";
	}.property('content'),

	crear: function () {
		if($("#OrdenDelDiaCrear").parsley("validate"))
		{
			var d = App.get('dictamenController.content');
			var p = d.get('proyectos');
			var pList = [];

			p.forEach(function (e) {
				pList.push({id: e.id.id_proy});
			});
			
			d.set('proyectos', pList);
			d.set('subclass', 'OD');
			d.set('camara', 'Diputados');
			d.set('dict_id_orig', 0);
			d.set('anioParl', null);
			d.set('nroGiro', 1);
			if(d.get('proyectos')[0]){
				d.set('id_proy_cab', d.get('proyectos')[0].id);
			}
			d.set('tipo', null);
			d.set('anio', moment(this.get('fecha'), 'DD/MM/YYYY').format('YYYY'));
			d.set('numero', this.get('numero'));
			d.set('publicacion', null);
			d.set('fechaImpresion', moment(this.get('fecha'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:ss'));
			d.set('copete', this.get('copete'));
			d.set('parte', null);
			d.set('url', this.get('url'));



			delete d.art108;
			delete d.art114;
			delete d.art204;
			delete d.caracter;
			delete d.caracterDespacho;
			delete d.itemParte;
			delete d.unanimidad;

			var dictamen = App.OrdenDelDia.create({dictamen: d});

			dictamen.set('id', {id_parte: d.get('id')});
			dictamen.set('estado', 1);
			dictamen.set('fecha_estado', null);
			dictamen.set('fecha_113', moment(this.get('fecha'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:ss'));
			dictamen.set('url', this.get('url'));

			delete d.id;

			var dJson = JSON.stringify(dictamen);

			var url = "dic/od";

			$.ajax({
				url: App.get('apiController').get('url') + url,
				contentType: 'text/plain',
				dataType: 'JSON',
				type: 'POST',
				data : dJson,
				success: this.loadSucceeded,
				complete: this.loadCompleted
			});	
		}	
	},

	loadCompleted: function () { 
		 if (!App.get('ordenesDelDiaController'))
			App.ordenesDelDiaController = App.OrdenesDelDiaController.create();

		 fn = function() {
			App.get('router').transitionTo('root.ordenDelDia.listadoOD');				
		 };

		 App.get('ordenesDelDiaController').addObserver('loaded', this, fn);
		 App.get('ordenesDelDiaController').load();
	},

	loadSucceeded: function (data) {
		var dictamen = App.get('dictamenController.content');
		var expedientesD = [];
		var firmantes = [];

		if(dictamen.proyectosVistos)
		{				
			dictamen.proyectosVistos.forEach(function (proyecto){
				if(proyecto.proyecto)
				{
					expedientesD.push(proyecto.proyecto.expdip);
				}
			});
		}

		if(dictamen.proyectos)
		{				
			dictamen.proyectos.forEach(function (proyecto){
				if(proyecto.proyecto)
				{
					expedientesD.push(proyecto.proyecto.expdip);
				}
			});
		}

		if(dictamen.textos)
		{
			dictamen.textos.forEach(function(texto){
				if(texto.firmantes)
				{
					texto.firmantes.forEach(function(firmante){
						firmantes.push(firmante.diputado.datosPersonales);
					});
				}
			});
		}

		var evento = App.TimeLineEvent.extend(App.Savable).create({
		    objectID: expedientesD[0], 
		    titulo: 'Se ha creado una Orden del Día con Dictamen',
		    fecha:  moment().format('YYYY-MM-DD HH:mm'),
		    mensaje: 'Se ha creado una Orden del Día con Dictamen',
		    icono: 'creado',
		    link: '#OD/orden/' + dictamen.id + '/ver',
		    duplicados: expedientesD,
		});

		evento.create();

		console.log(data);
		if(data)
		{		
			//CREATE NOTIFICATION TEST 
			var notification = App.Notificacion.extend(App.Savable).create();
			//ACA TITULO DE LA NOTIFICACION
			notification.set('tipo', 'crearOrdenDelDia');	
			//Si hace falta ID del objeto modificado
			notification.set('objectId', data.id);
			//Link del objeto
			notification.set('link', "#/OD/orden/" + data.id + "/ver");
			//CreateAt
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			//Custom message
			//notification.set('mensaje', "Se ha cargado la Orden del Día");
			notification.set('mensaje', "Se ha cargado la Orden del Día " + data.dictamen.numero);

			notification.set('firmantes', firmantes);

			//notification.set('comisiones', this.get('content.comisiones'));
			//Crear
			
			notification.create();

		}
	}
});

App.OrdenDelDiaDetalleView = Ember.View.extend({
	templateName: 'orden-del-dia-detalle',
	nombreArchivo: null,
	hasDocument: true,
	loading: false,

	borrar: function(item){
		this.get('parentView').get('parentView').borrarOD(App.get('ordenDelDiaController.content'));
	},
	dictamen: function () {
		if (this.get('content.dictamen'))
			return App.Dictamen.create(App.get('ordenDelDiaController.content.dictamen'));
		else
			return null;
	}.property('content'),


	openDocument: function () {
		this.set('loading', true);
		delete $.ajaxSettings.headers["Authorization"];
		$.ajax({
			url: App.get('ordenDelDiaController.content.documentURL'),
			type: 'GET',
			success: this.loadSucceeded,
			complete: this.loadCompleted,
			contentType: 'text/plain',
			crossDomain: true,
			context: this,
		});			
	},

	loadCompleted: function (data) {
		var usuario = App.userController.get('user');
		$.ajaxSetup({
	    	headers: { 'Authorization': usuario.get('token_type') + ' ' +  usuario.get('access_token') }
		});	
	},

	loadSucceeded: function (data) {
		this.set('loading', false);
		if (data == "")
		{
			this.set('hasDocument', false);
		} 
		else
		{
			window.open(App.get('ordenDelDiaController.content.documentURL'), '_blank');
		}
	},

	didInsertElement: function(){
		this._super();

		url = App.get('ordenDelDiaController.content.url');
		if (url != null) {
			this.set('nombreArchivo', url.substr(url.lastIndexOf('/')+1));
		}
	},
	hayArchivoAdjunto: function(){
		var str = '';
		
			if(App.get('ordenDelDiaController.content.url') != '' && App.get('ordenDelDiaController.content.url') != null)
			{
				str = true;
			}else{
				str = false;
			}
		
		return str;
	}.property('App.ordenDelDiaController.content.url')
});

App.OrdenesDelDiaListView = Ember.View.extend({
	templateName: 'orden-del-dia-listado',
});

App.OrdenesDelDiaDictamenesListView = Ember.View.extend({
	templateName: 'orden-del-dia-dictamenes',
});

App.DictamenView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'dictamen-item',

	crearOD: function (){
		 if (!App.get('dictamenController'))
			App.dictamenController = App.DictamenController.create();

		 fn = function() {
			App.get('router').transitionTo('comisiones.ordenesDelDia.ordenDelDia.crear');				
		 };

		 App.get('dictamenController').addObserver('loaded', this, fn);
		 App.get('dictamenController').load();
	},
});

App.DictamenesView = Em.View.extend({
	templateName: 'dictamenes',
});


App.DictamenesListView = App.ListFilterView.extend({ 
	itemViewClass: App.DictamenView, 	
	columnas: ['Fecha Dictamen', 'Expedientes dictaminados', 'Comisión cabecera', 'Ver Dictamen'],
});

App.DictamenSinODItemView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'dictamen-sin-od-item',

	puedeCrearOD: function () {
		return App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES') 
	}.property('App.userController.user'),

	crearOD: function (){
		 if (!App.get('dictamenController'))
			App.dictamenController = App.DictamenController.create();

		 fn = function() {
			App.get('router').transitionTo('comisiones.ordenesDelDia.ordenDelDia.crear');				
		 };

		 App.get('dictamenController').addObserver('loaded', this, fn);
		 App.get('dictamenController').load();
	},
});

App.DictamenesSinOrdenDelDiaListView = App.ListFilterView.extend({ 
	itemViewClass: App.DictamenSinODItemView, 	
	//columnas: ['Fecha Dictamen', 'Temario', 'Crear OD'],
		columnas: function(){
			if(App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES') ){
				return ['Fecha Dictamen', 'Temario', 'Crear OD']
			}else{
				return ['Fecha Dictamen', 'Temario']
			}
		}.property('columnas'),
});

App.OrdenDelDiaView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'orden-del-dia-od-item',

	verOD: function(){
		 if (!App.get('ordenDelDiaController'))
			App.ordenDelDiaController = App.OrdenDelDiaController.create();

		 fn = function() {
			App.get('router').transitionTo('comisiones.ordenesDelDia.ordenDelDia.ordenConsulta.verOrden', this.get('content'));
		 };

		 App.get('ordenDelDiaController').addObserver('loaded', this, fn);
		 App.get('ordenDelDiaController').load();
	},
});


App.OrdenDelDiaListView = App.ListFilterView.extend({ 
	itemViewClass: App.OrdenDelDiaView, 	
	columnas: ['Número', 'Fecha', 'Sumario', 'Ver'],
});

//ADMIN

App.RolesAdminView = Ember.View.extend({
	templateName: 'roles-admin',
	rolNombre: '',
	rolNivel: '',

	crearRol: function () {
		App.get('rolesController').createObject({nombre: this.get('rolNombre'), nivel: this.get('rolNivel')}, true);
		this.set('rolNombre', '');
		this.set('rolNivel', '');
	},

	crearRolHabilitado: function () {
		return this.get('rolNombre') != '' && this.get('rolNivel') > 0 && this.get('rolNivel') < 6;
	}.property('rolNombre', 'rolNivel'),
});



App.ComisionesAdminView = Ember.View.extend({
	templateName: 'comisiones-admin',

});

App.ItemMultiSelectView = Em.View.extend({
	tagName: 'li',
	templateName: 'item-multiselect',	
	clickItem: function () {
		this.get('parentView').get('parentView').itemClicked(this.get('content'));
	}, 
});

App.MultiSelectView = Ember.CollectionView.extend({
	classNames : ['subNav'],  
	tagName: 'ul',
	itemViewClass: App.ItemMultiSelectView, 
});

App.NotificacionTipoConsultaView = Ember.View.extend({
	templateName: 'notificacion-tipo-consulta',

	didInsertElement: function(){
		this._super();
	}
});


App.NotificacionTipoCrearView = Ember.View.extend({
	templateName: 'notificacion-tipo-crear',

	notificationType: null,

	iconos: ['sprite-alert', 'sprite-info', 'sprite-check'],

	itemClicked: function (object) {
		switch (object.constructor.toString()) {
			case "(subclass of App.Rol)":
				var item = this.get('notificationType.roles').findProperty("id", object.get('id'));

				if (!item) {
					this.get('notificationType.roles').pushObject(object);
				}
				else {
					this.get('notificationType.roles').removeObject(object);
				}
				break;
			case "(subclass of App.Comision)":
				var item = this.get('notificationType.comisiones').findProperty("id", object.get('id'));
				if (!item) {
					this.get('notificationType.comisiones').pushObject(object);
				}
				else {
					this.get('notificationType.comisiones').removeObject(object);
				}
				break;
		}
	},

	guardar: function () {
		this.get('notificationType').set('grupo', this.get('notificationType.grupoSelected.id'));
		this.get('notificationType').create();
		this.get('notificationType').addObserver('createSuccess', this, this.createSuccess);
	},

	createSuccess: function (){
		if(this.get('notificationType.createSuccess')){
			App.set('notificacionTipoController.content', this.get('notificationType'));

			fn = function(){
				App.get('notificacionTipoController').removeObserver('loaded', this, fn);
				App.get('router').transitionTo('notificaciones.notificacionConsulta.ver', this.get('notificationType'));
			};

			App.get('notificacionTipoController').addObserver('loaded', this, fn);
			App.get('notificacionTipoController').load();
		}
	},

	initNotificacion: function  () {
		// body...
		// this.set('notificationType', App.NotificacionTipo.extend(App.Savable).create());
		this.set('notificationType', App.NotificacionTipo.extend(App.Savable).create({comisiones:[], estructuras: [], funciones: [], roles: []}));
	},

	didInsertElement: function () {
		this._super();
		this.initNotificacion();
	},
});

App.NotificacionTipoEditarView = App.NotificacionTipoCrearView.extend({
	content: '',

	guardar: function () {
		this.get('notificationType').set('grupo', this.get('notificationType.grupoSelected.id'));
		this.get('notificationType').save();
		this.get('notificationType').addObserver('saveSuccess', this, this.createSuccess);
	},

	createSuccess: function (){
		if(this.get('notificationType.saveSuccess')){
			App.notificacionTipoController = App.NotificacionTipoController.create();

			App.set('notificacionTipoController.loaded', false);
			App.set('notificacionTipoController.content', this.get('notificationType'));

			fn = function(){
				App.get('notificacionTipoController').removeObserver('loaded', this, fn);
				App.get('router').transitionTo('notificaciones.notificacionConsulta.ver', App.get('notificacionTipoController.content'));
			};

			App.get('notificacionTipoController').addObserver('loaded', this, fn);
			App.get('notificacionTipoController').load();
		}
	},

	initNotificacion: function  () {
		// body...
		this.set('notificationType', App.get('notificacionTipoController.content'));
		var g = App.get('notificacionesGruposController').findProperty('id', this.get('notificationType.grupo'));
		this.set('notificationType.grupoSelected', g);
	},
});

App.NotificacionesAdminView = Ember.View.extend({
	templateName: 'notificaciones-admin',

});

App.NotificacionTipoItemView = Em.View.extend({
	content: '',
	templateName: 'item-notificacion-tipo',
	tagName: 'tr',
});

App.NotificacionTipoListView = App.ListFilterView.extend({ 
	itemViewClass: App.NotificacionTipoItemView, 	
	columnas: ['Nombre','Título', 'Estado', 'Ver Notificación'],
});


App.ItemRoleableView = Em.View.extend({

	content: '',
	templateName: 'item-roleable',
	tagName: 'tr',
	change: false,
	rolSeleccionadoBinding: "App.rolesController.content.firstObject",

	agregarRolHabilitado: function () {
		return this.get('rolSeleccionado.id') != -1;
	}.property('rolSeleccionado'),

	borrarRol: function (rol) {
		this.set('change', true);
		this.get('content.roles').removeObject(rol);
	},

	agregarRol: function () {
		this.set('change', true);
		this.get('content.roles').addObject(this.get('rolSeleccionado'));
		this.set('rolSeleccionado', App.get('rolesController.content.firstObject'));
	},

	guardarHabilitado: function () {
		return this.get('change');
	}.property('content', 'change'),

	avatarChange: function () {
		this.set('change', true);
	}.observes('content.avatar'),

	guardar: function () {
		this.set('change', false);
		this.get('content').save();
	},
});

App.ItemUserRoleableView = App.ItemRoleableView.extend({
	templateName: 'item-user-roleable',
});

App.ItemRoleableRolView = Em.View.extend({
	templateName: 'item-roleable-rol',
	tagName: 'span',
	classNames: ['tag'],

	borrar: function () {
		this.get('parentView').borrarRol(this.get('content'));
	}	
});

App.RoleabeListView = App.ListFilterView.extend({ 
	itemViewClass: App.ItemRoleableView, 	
	columnas: ['ID', 'Datos','Roles', 'Acciones'],
});

App.RoleabeUserListView = App.ListFilterView.extend({ 
	itemViewClass: App.ItemUserRoleableView, 	
	columnas: ['ID', 'Datos', 'Avatar', 'Roles', 'Acciones'],
});


App.ItemComisionableView = Em.View.extend({
	content: '',
	templateName: 'item-comisionable',
	tagName: 'tr',
	change: false,
	comisionSeleccionadaBinding: "App.comisionesController.content.firstObject",

	agregarComisionHabilitado: function () {
		return this.get('comisionSeleccionada.id') != -1;
	}.property('comisionSeleccionada'),

	borrarComision: function (rol) {
		this.set('change', true);
		this.get('content.comisiones').removeObject(rol);
	},

	agregarComision: function () {
		this.set('change', true);
		this.get('content.comisiones').addObject(this.get('comisionSeleccionada'));
		this.set('comisionSeleccionada', App.get('comisionesController.content.firstObject'));
	},

	guardarHabilitado: function () {
		return this.get('change');
	}.property('content','change'),

	guardar: function () {
		this.set('change', false);
		this.get('content').save();
	},
});

App.ItemComisionableComisionView = Em.View.extend({
	templateName: 'item-comisionable-comision',
	tagName: 'span',
	classNames: ['tag'],

	borrar: function () {
		this.get('parentView').borrarComision(this.get('content'));
	}	
});

App.ComisionableListView = App.ListFilterView.extend({ 
	itemViewClass: App.ItemComisionableView, 	
	columnas: ['ID', 'Label','Comisiones convocadas', 'Acciones'],
});





//ERRORES
App.Page404View = Ember.View.extend({
	templateName: 'page-404',
});

App.Page403View = Ember.View.extend({
	templateName: 'page-403',
});



//Expedientes
App.ExpedienteView = Ember.View.extend({
	tagName: 'tr',
	classNames: ['gradeX'],
	templateName: 'expediente',

	
	verExpediente: function () {
		App.set('expedienteConsultaController.loaded', false);
		App.get('router').transitionTo('loading');
		App.set('expedienteConsultaController.content', App.Citacion.create({id: this.get('content').get('id')}));
		
		fn = function() {
			App.get('expedienteConsultaController').removeObserver('loaded', this, fn);
			App.get('router').transitionTo('expedienteConsulta.indexSubRoute', this.get('content'));
		};

		App.get('expedienteConsultaController').addObserver('loaded', this, fn);			
		App.get('expedienteConsultaController').load();		
	},
});

App.SinExpedientesListView = App.ListFilterWithSortView.extend({	
	itemViewClass: App.ExpedienteView,
	columnas: [],
});

App.ExpedientesListView = App.ListFilterWithSortView.extend({
	templateName: 'expedientes-sortable-list',
	itemViewClass: App.ExpedienteView,
	loading: false,

	mostrarMas: function () {
		this.set('scroll', $(document).scrollTop());
		App.get('expedientesController').set('loaded', false);
		App.get('expedientesController').nextPage();
		this.set('loading', true);
	},

	expedientesLoaded: function () {
		if (App.get('expedientesController.loaded'))
			this.set('loading', false);
		else
			this.set('loading', true);
	},

	columnas: [
		App.SortableColumn.create({nombre: 'Nro. de expediente', campo: 'expdip'}), 
		App.SortableColumn.create({nombre: 'Tipo', campo: 'tipo'}),
		App.SortableColumn.create({nombre: 'Título', campo: 'titulo'}),
		// App.SortableColumn.create({nombre: 'Camara de inicio', campo: 'iniciado'}),
		App.SortableColumn.create({nombre: 'Firmantes', campo: 'firmantesLabel'}),
		App.SortableColumn.create({nombre: 'Comisiones', campo: 'girosLabel'}),
	],	


	didInsertElement: function(){
		this._super();
		App.get('expedientesController').addObserver('loaded', this, this.expedientesLoaded);
	},

	lista: function (){		
		var _self = this;
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('expedientesController').get('arrangedContent').filter(function(expediente){
			return regex.test((expediente.tipo + expediente.titulo + expediente.expdip + expediente.get('firmantesLabel') + expediente.get('girosLabel')).toLowerCase());
		});

		this.set('mostrarMasEnabled', true);

		Ember.run.next(function(){
		// High Light Words
		// Agrega la clase .highlight, modificar el css si se quiere cambiar el color de fondo
			$('table').removeHighlight();

			if(_self.get('filterText') && _self.get('filterText').length > 0){
				$('td').highlight(_self.get('filterText'));
			}
		});
		return filtered;
	}.property('startFecha', 'endFecha','filterText', 'filterFirmantes', 'filterTipos', 'filterComisiones', 'App.expedientesController.arrangedContent.@each', 'totalRecords', 'sorting'),	
});

App.PerfilView = Em.View.extend({
	templateName: 'perfil',
	guardarEnabled: false,
	oldAvatar: '',
	hayComisiones: false,

	guardar: function () {
		App.userController.get('user').save();
		localStorage.setObject('user', JSON.stringify(App.userController.get('user')));
		this.set('guardarEnabled', false);
	},

	cancelar: function () {
		this.set('guardarEnabled', false);
		if (this.get('oldAvatar'))
			this.set('content.avatar', this.get('oldAvatar'));
	},

	avatarChange: function () {
		if (this.get('content.avatar'))
			this.set('guardarEnabled', true);
	}.observes('content.avatar'),

	cambiarFoto: function () {
		this.set('oldAvatar', this.get('content.avatar'));
		this.get('content').set('avatar', null);
	},

	

	didInsertElement: function () {
		this._super();
		this.set('content', App.userController.user);
		if(this.get('content.comisiones').length > 0){
			this.set('hayComisiones', true);
		}
		

		var url = 'notificaciones/config';
		var posting = $.post( url, { cuil: App.get('userController.user').get('cuil'), funcion: App.get('userController.user').get('funcion'), estructura: App.get('userController.user').get('estructura')});
		_self = this;
		posting.done(function( data ){
			data = JSON.parse(data);
			_self.set('notificationConfig', App.NotificacionConfig.extend(App.Savable).create(data.config));
			_self.get('notificationConfig').desNormalize();
		});
	},
});

App.ExpedienteSearchView = Em.View.extend({
	templateName: 'expediente-search',
	tipos: ['LEY', 'RESOLUCION', 'DECLARACION', 'COMUNICACION', 'MENSAJE'],
	collapse: true,
	loading: false,

	collapseToggle: function(){
		this.set('collapse', !this.get('collapse'));
	},

	comisiones: function () {
		var comisiones = [];
		if (App.get('comisionesController.content')) {
			App.get('comisionesController.content').forEach(function (comision) {
				comisiones.pushObject(comision.nombre);
			});
		}
		return comisiones;
	}.property('App.comisionesController.content.@each'),

	limpiar: function () {
		App.expedientesController.set('query', App.ExpedienteQuery.extend(App.Savable).create({}));
	},

	didInsertElement: function () {
		this._super();
		var _self = this;
		App.get('expedientesController').addObserver('loaded', this, this.expedientesLoaded);
		Ember.run.next(function () { 
			if (App.get('expedientesController.query.dirty')) {
//				console.log(App.get('expedientesController.query.dirty'));
				_self.limpiar(); 
			}
		});

		// Escucho el enter en cualquier input text del search
		shortcut.add('enter', function() {
		  if($('input[type="text"]').is(':focus'))
		  {
		    _self.buscar();
		  }
		});

	},
	buscar: function () {
		App.get('expedientesController').set('loaded', false);
		App.expedientesController.set('pageNumber', 1);
		App.expedientesController.set('content', []);
		App.expedientesController.load();
		this.set('loading', true);

		if(this.get('collapse') == false)
		{
			$(".panel-heading > a").click();
		}		
	},

	expedientesLoaded: function () {
		if (App.get('expedientesController.loaded'))
			this.set('loading', false);
		else
			this.set('loading', true);
	},

	borrar: function () {
		App.searchController.deleteObject(App.expedientesController.get('query'));
		App.expedientesController.set('query', App.ExpedienteQuery.extend(App.Savable).create({}));
	},

	guardar: function () {
		if (App.expedientesController.get('query.id'))
		{
			App.expedientesController.get('query').save();	
		} 
		else 
		{
			App.expedientesController.get('query').set('usuario', App.userController.get('user.cuil'));
			App.expedientesController.get('query').create();
			if (App.searchController.content)
			{
				App.searchController.content.pushObject(App.expedientesController.get('query'));
			}
		}
	},
	willDestroyElement: function(){
		// remuevo la escucha del 'enter'
		shortcut.remove('enter');
	},
});

App.ExpedientesView = Em.View.extend({
	templateName: 'expedientes',
});

App.ExpedienteArchivadoItemListView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'expedienteArchivado',

	borrar: function () {
		this.get('parentView').itemSelect(this.get('content'));
	},
});

App.ExpedienteArchivadoListView = App.ListFilterView.extend({ 
	itemViewClass: App.ExpedienteArchivadoItemListView, 	
	columnas: ['N&uacute;mero de Expediente', 'T&iacute;tulo', 'Eliminar'],

	itemSelect: function (item) {
		this.get('parentView').removeItem(item);
	},
});



App.ExpedientesArchivadosView = Ember.View.extend({
	templateName: 'expedientesArchivados',
	startFecha: '',
	endFecha: '',
	archivadoFecha: '',
	anio:2012,
	anios: [2012, 2011, 2010, 2009],
	filterText: '',
	proyectos: [],
	mostrarMasEnabled: true,
	faltanAgregarExpedientes: false,

	didInsertElement: function () {
		this._super();
		this.set('proyectos', []);
		this.set('faltanAgregarExpedientes', false);
	},
	removeItem: function (item) {
		this.get('proyectos').removeObject(item);
	},
	cambiarAnio: function () {
		App.get('expedientesArchivadosController').loadByAnio(this.get('anio'));
	}.observes('anio'),
	validateFields: function(){
		$('#formCrearEnvio').parsley( 'validate' );
	}.observes('archivadoFecha'),
	checkListExpedientes: function(){
		if(this.get('proyectos').length > 0)
		{
			this.set('faltanAgregarExpedientes', false);
		}
		else
		{
			this.set('faltanAgregarExpedientes', true);
		}
	}.observes('proyectos.@each'),
	archivarExpedientes: function (){
		var seleccionados = this.get('proyectos');
		var fecha = this.get('archivadoFecha');
		var user = localStorage.getObject('user');

		if(this.get('proyectos').length > 0)
		{
			this.set('faltanAgregarExpedientes', false);
		}
		else
		{
			this.set('faltanAgregarExpedientes', true);
		}

		if($('#formCrearEnvio').parsley('validate') && this.get('faltanAgregarExpedientes') == false && this.get('archivadoFecha'))
		{
			var usuario = App.Usuario.create(JSON.parse(user));
			
			var listaEnvioArchivo = App.ListaEnvioArchivo.create();
			
			listaEnvioArchivo.set('fecha', moment(fecha, 'DD/MM/YYYY').format("YYYY-MM-DD  HH:mm"));
			listaEnvioArchivo.set('autor', usuario.get('nombre') + " " + usuario.get('apellido') );
			App.get('expedientesArchivadosController.content').set('seleccionados', seleccionados);
			listaEnvioArchivo.set('expedientes', seleccionados);
			listaEnvioArchivo.set('comision', App.get('expedientesArchivablesController.comision'));
			
			var listaJSON = JSON.stringify(listaEnvioArchivo);
			
			var url = "com/env/envio";
			
			$.ajax({
					url: App.get('apiController').get('url') + url,
					contentType: 'text/plain',
					dataType: 'JSON',
					type: 'POST',
					data : listaJSON,
					success: this.createSucceeded,
			});
			
		}
	},
	createSucceeded: function (data) {
		var _self = this;

		if (data.id)
		{

			fn = function() {
				App.get('expedientesArchivadosController').get('arrangedContent').setEach('seleccionado', false);
				App.get('envioArchivoController').removeObserver('loaded', this, fn);                    
				App.get('router').transitionTo('enviosArchivados.index');                     

				var expedientesD = [];

				App.get('expedientesArchivadosController.content.seleccionados').forEach(function(expedienteSeleccionado){
					expedientesD.push(expedienteSeleccionado.expdip);
				});

				var evento = App.TimeLineEvent.extend(App.Savable).create({
				    objectID: expedientesD[0], 
				    titulo: 'Se ha creado un Envio a Archivo',
				    fecha:  moment().format('YYYY-MM-DD HH:mm'),
				    mensaje: 'Se ha ha creado un Envío a Archivo',
				    icono: 'creado',
				    link: '#/comisiones/envios/envio/' + data.id + '/ver',
				    duplicados: expedientesD,
				});

				evento.create();

			};

			$.jGrowl('Se ha creado el env&iacute;o satisfactoriamente!', { life: 5000 });
			App.get('envioArchivoController').addObserver('loaded', this, fn);
			App.get('envioArchivoController').load();
		   
		}
		else 
		{
			$.jGrowl('Ocurrió un error al intentar crear el env&iacute;o!', { life: 5000 });
		}
	},
		
		
});


// Listado de envios:

App.EnvioArchivoItemListView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'envioArchivado',
});

App.EnvioArchivoListView = App.ListFilterView.extend({ 
	itemViewClass: App.EnvioArchivoItemListView, 	
	columnas: ['Ver Env&iacute;o', 'Fecha Archivado', 'Autor', 'Comisiones', 'Estado'],
});

App.EnviosArchivadosView = App.ListFilterView.extend({
	templateName: 'enviosArchivados',
	sorting: false,
	startFecha: '',
	endFecha: '',
	archivadoFecha: '',

				
	mostrarMasEnabled: true,
});


//Detalle de envios


App.ExpedientesEnvioConsultaView = Ember.View.extend({
	templateName: 'expedientesEnvioConsulta',
	filterFirmantes: '',
	archivadoFecha: '',
		
	isExpanded: false,
	isPendiente: false,
	
	puedeConfirmarEnvio: function(){
		return (App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES')) && App.get('userController').hasRole('ROLE_MESA_DE_ENTRADA_EDIT') 
	}.property('App.userController.user'),
	cambiaEstado: function(){
		if (this.get('content.estado')=="Pendiente") {
			this.set('isPendiente', true);
		}else{
			this.set('isPendiente', false);
		}
	}.observes('content.estado'),

	exportar: function () {
		$.download('exportar/envio', "&type=envio&data=" + JSON.stringify(App.envioArchivoConsultaController.content));
	},

	toggleBotonConfirmar: function() {
//			this.set('isExpanded', !this.get('isExpanded'));
//			this.$("#confirmarBotonDiv").slideToggle();
		App.confirmActionController.setProperties({
			title: 'Confirmar Envío',
			message: '¿ Esta seguro que desea confirmar el Envío ?',
			success: null,
		});

		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();
	},
	
	didInsertElement: function(){
			this._super();
			$("#confirmarBotonDiv").hide();
			this.set('content', App.get('envioArchivoConsultaController.content'));
	},

	confirmarToggle: function(){
//		this.$("#confirmarBotonDiv").slideToggle();
	}, 
		
	confirmActionDone: function () {
	//confirmarEnvio: function(){
		//this.confirmarToggle();
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);
		if (App.get('confirmActionController.success')) {
			var idConfirmar = JSON.stringify(this.get('content.id'));
			
			var url = "com/env/envio/confirmar";
			
			$.ajax({
					url: App.get('apiController').get('url') + url,
					contentType: 'text/plain',
					dataType: 'JSON',
					type: 'POST',
					data : idConfirmar,
					context: this,
					success: this.createSucceeded,
			});   
		}     
	},
			

	createSucceeded: function (data) {
			if (data.id) {
				fn = function() {
					App.get('envioArchivoConsultaController').removeObserver('loaded', this, fn);						
					this.set('content', App.get('envioArchivoConsultaController.content'));
				};
				App.get('envioArchivoConsultaController').set('loaded', false);
				App.get('envioArchivoConsultaController').addObserver('loaded', this, fn);
				App.get('envioArchivoConsultaController').load();
			} else 
			{
				$.jGrowl('Ocurrió un error al intentar confirmar el env&iacute;o!', { life: 5000 });
			}
	}, 
	mostrarMasEnabled: true,
});


App.CitacionesView = App.ListFilterView.extend({
	templateName: 'citaciones',
	comisionesCalendar: true,

	comisionesCalendarMostrar: function(){
		this.set('comisionesCalendar', true);
	},
	comisionesCalendarOcultar: function(){
		this.set('comisionesCalendar', false);
	},
});


App.UploaderView = Em.View.extend({
	templateName: 'uploader',
	attributeBindings: ['file', 'folder'],
	url: '',
	percent: 0,
	formId: 'upload',


	fileChange: function () {
		if(App.uploaderController.get('useControllerUpload')){		
			App.uploaderController.set('view', this);
			App.uploaderController.set('percent', this.get('percent'));
			App.uploaderController.set('formId', this.get('formId'));
			App.uploaderController.set('file', this.get('file'));
			App.uploaderController.set('folder', this.get('folder'));

			App.uploaderController.set('folder', this.get('folder'));

			App.uploaderController.set('formDataView', new FormData(this.$('#' + this.get('formId'))[0]));

			App.uploaderController.set('url', this.get('url'));
		}else{	
			_self = this;
			var formData = new FormData(this.$('#' + this.get('formId'))[0]);

			$.ajax({
				url: 'upload.php',  //server script to process data
				type: 'POST',
				data: formData,
				cache: false,
				contentType: false,
				processData: false,      
				xhr: function() {  // custom xhr
					myXhr = $.ajaxSettings.xhr();
					if(myXhr.upload){ // if upload property exists
						myXhr.upload.addEventListener('progress', function(a) { 
							_self.set('percent', Math.round(a.loaded / a.totalSize * 100));
							_self.$('#progress').attr('original-title', _self.get('percent') + "%");
							_self.$('#progress').attr('style', "width: " + _self.get('percent') + "%;");
						}, false); // progressbar
					}
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
				},
				complete: function(jqXHR, textStatus)				
				{
					//console.log(jqXHR);
					//console.log(textStatus);
				},
				error: function(jqXHR , textStatus, errorThrown){
					//console.log(jqXHR);
					//console.log(textStatus);
					//console.log(errorThrown);					
				},
			});
		}
	}.observes('url'),

	didInsertElement: function () {
		this._super();
		this.$("input:file").uniform();
		$('.tipS').tipsy({gravity: 's',fade: true, html:true});
	}
});

App.UploaderModalView = App.ModalView.extend({
	templateName: 'uploader-popup',

	callback: function(opts, event) {
			if (opts.primary) {

			} else if (opts.secondary) {
				//alert('cancel')
			} else {
				//alert('close')
			}
			event.preventDefault();
	},
});

App.AttachFileView = Em.View.extend({
	templateName: 'attach-file',
	attributeBindings: ['folder','useControllerUpload'],

	showUploader: function () {
		App.uploaderController = App.UploaderController.create();

		App.uploaderController.set('content', this.get('content'));
		App.uploaderController.set('folder', this.get('folder'));
		
		if(this.get('useControllerUpload')){
			App.uploaderController.set('useControllerUpload', this.get('useControllerUpload'));			
		}else{
			App.uploaderController.set('useControllerUpload', false);
		}
		App.get('uploaderController').addObserver('content', this, this.attachFile);

		App.UploaderModalView.popup();
	},

	attachFile: function () {
		App.get('uploaderController').removeObserver('content', this, this.attachFile);
		this.set('content', App.get('uploaderController.content'));
	},

	deleteFile: function () {
		_self = this;
		if (App.get('uploaderController')) {
			App.set('uploaderController.content', '');
			this.set('content', App.get('uploaderController.content'));
		} else {
			this.set('content', '');
		}

		
	   /*
		$.ajax({
				url: 'delete.php',  //server script to process data
				type: 'POST',
				data: {file: this.get('content')},
				success: function(payload)
				{
				}
		});
		*/
	},
	
	fileWithOutFolder: function () {
		if (this.get('content')) {
			return this.get('content').replace(this.get('folder'), '');
		}
		return "";
	}.property('content', 'folder'),
});

App.InicioView = Em.View.extend({
	templateName: 'inicio',
	titulo: '',

	didInsertElement: function(){
		this._super();

		this.set('titulo', $("a.active").not(".ic").text());
		/*
		$(".submenu-news").bind('click', function(){
			var lista 	= $("#news-lista");
			var get_id 	= $(this).prop('id');

			lista.find("ul").stop();
			lista.find("ul").not('.'+get_id).fadeOut(0);
			lista.find("ul."+get_id).fadeIn(900);
		});
		*/
	},
              
});


App.ApplicationView = Em.View.extend({
	templateName: 'application',
	
	activarNotificaciones: function (){
		if (window.webkitNotifications) {
			window.webkitNotifications.requestPermission();
			App.get('notificationController').set('estado', 0);
		}
	},
	
	mostrar : function () {
		this.get('testModal').mostrar();
	},

});

App.ExpedienteConsultaView = Em.View.extend({
	templateName: 'expedienteConsulta',
	loading: false,
	noDocument: false,

	puedeCrear: function(){
		return App.get('userController').hasRole('ROLE_ALERTA_TEMPRANA_EDIT') 
	}.property('App.userController.user'),

	openDocument: function () {
		this.set('loading', true);
		var url = App.get('expedienteConsultaController.content.documentURL');

		if (App.get('expedienteConsultaController.content.id') == 160126) {
			url = 'uploads/exp/PE247_13PL.pdf';
		}

		delete $.ajaxSettings.headers["Authorization"];

		$.ajax({
			url: url,
			type: 'GET',
			success: this.loadSucceeded,
			complete: this.loadCompleted,
			contentType: 'text/plain',
			crossDomain: true,
			context: this,
		});			
	},
	loadCompleted: function () {
		var usuario = App.userController.get('user');
		$.ajaxSetup({
	    	headers: { 'Authorization': usuario.get('token_type') + ' ' +  usuario.get('access_token') }
		});				
	},
	loadSucceeded: function (data) {
		this.set('loading', false);

		if (data == "")
		{
			window.open(App.get('expedienteConsultaController.content.url'), '_blank');
			this.set('noDocument', true);
		} 
		else
		{
			var url = App.get('expedienteConsultaController.content.documentURL');
			if (App.get('expedienteConsultaController.content.id') == 160126) {
				url = 'uploads/exp/PE247_13PL.pdf';
			}
			window.open(url, '_blank');
		}
	},

	clickTextoCompleto: function(e){
//        console.log(this.getPath('App.expedienteConsultaController.content.url'));
	},

	createBiography: function () {		
		App.biographyController = App.BiographyController.create({
			content: App.Biography.extend(App.Savable).create(
				{expNro: App.get('expedienteConsultaController.content.expdip'), idProyecto: App.get('expedienteConsultaController.content.id')
			}),
			expediente: App.get('expedienteConsultaController.content')
		});

		App.CreateBiographyView.popup();
	},

	didInsertElement: function () {
		this._super();
		if (App.get('userController').hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT')) {
			App.get('expedienteConsultaController.content').loadBiography();
		}

		//this.set('timeLineController', App.ExpedienteTimelineController.create({content: [], url: 'timeline/1'}));
		this.set('timeLineController', App.ExpedienteTimelineController.create({content: [], url: 'timeline/' + App.get('expedienteConsultaController.content.expdip')}));
		this.get('timeLineController').load();		
	}
});

App.CitacionConsultaView = Em.View.extend({
	templateName: 'citacionConsulta',
	puedeConfirmar: false,
	puedeCancelar: false,
	puedeCrearReunion: false,
	puedeEditar: false,
	invitadosx: [],
	citacionClone: null,

	hayInvitados: function () {
		return App.get('citacionConsultaController.content.invitados').length > 0;
	}.property('citacionConsultaController.content.invitados', 'adding'),

	hasPermission: function (){
		var comisiones = App.get('citacionConsultaController.content.comisiones');
		if (comisiones.length > 1) {
			if (App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES')) {
				return true;
			}
			else {
				return false;
			}
		} else {
			if (comisiones.length == 1) {
				if ((App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES') || App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES'))) {
					return true;
				}
				else {
					return false;
				}
			}
		}
		return true;
	}.property('citacionConsultaController.content.id'),

	clonar: function () {
		if (App.citacionConsultaController.content.estado.id == 3) {
			var citacionClone = App.Citacion.extend(App.Savable).create(Ember.copy(App.citacionConsultaController.content));
			citacionClone.set('id', null);
			citacionClone.set('estado', App.CitacionEstado.create({id: 1}));

			this.set('citacionClone', citacionClone);

			this.get('citacionClone').addObserver('createSuccess', this, this.createCompleted);
			this.get('citacionClone').create();
		}
	},

	puedeClonar: function () {
		if (App.citacionConsultaController.content.estado.id == 3 && App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES')) {
			return true;
		}
		else {
			return false;
		}
	}.property('citacionConsultaController.content.id'),
	
	createCompleted: function (data) {
		//TO-DO Revisar que devuelva OK		
		if (this.get('citacionClone.createSuccess'))
		{
			$('.buttonSave').removeAttr('disabled');
			$('.buttonSave').val('Guardar');

			App.set('citacionConsultaController.loaded', false);
			App.set('citacionConsultaController.content', this.get('citacionClone'));

			fn = function() {
				var citacion = App.get('citacionConsultaController.content');
				App.get('citacionConsultaController').removeObserver('loaded', this, fn);
				App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', citacion);
			};

			App.get('citacionConsultaController').addObserver('loaded', this, fn);
			App.get('citacionConsultaController').load();
			
			$.jGrowl('Citación clonada con éxito!', { life: 5000 });
		}
	},

	didInsertElement: function(){
		this._super();

		if((App.citacionConsultaController.content.estado.id == 2) 
			&& (this.get('hasPermission'))
			&& (!App.citacionConsultaController.content.reunion) 
			&& (moment(App.citacionConsultaController.content.start, 'YYYY-MM-DD HH:mm') < moment()))
			this.set('puedeCrearReunion', true);

		if(App.citacionConsultaController.content.estado.id == 1 && this.get('hasPermission')) 	this.set('puedeConfirmar', true);
		if(App.citacionConsultaController.content.estado.id != 3 && this.get('hasPermission')) 	this.set('puedeCancelar', true);	
		if(App.citacionConsultaController.content.estado.id == 1 && this.get('hasPermission')) 	this.set('puedeEditar', true);	

	},

	confirmar: function () {
		if (this.get('hasPermission'))
			App.ComfirmarCitacionView.popup();
	},
		
	cancelar: function () {
		if (this.get('hasPermission'))
			App.CancelarCitacionView.popup();
	},
	crearReunion: function () {
		App.CrearReunionView.popup();		
	},	

	exportar: function () {
		$.download('exportar/citacion', "&type=citacion&data=" + JSON.stringify(App.citacionConsultaController.content));
	},
});

App.CalendarTool = Em.View.extend({
	tagName: 'div',
	attributeBindings: ['id', 'events', 'owner'],
	classNamesBindings: ['class'],

	didInsertElement: function(){
		this._super();
		$('#mycalendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay '
			},
			editable: false,
			timeFormat: {
				agenda: 'H:mm',
				'': 'H:mm'
			},
			axisFormat: 'H:mm',
			monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ], 
			monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
			dayNames: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
			dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
			hiddenDays: [0,1,5,6], // Oculto los dias "Domingo, Lunes, Viernes, Sábado"
			buttonText: {
			 today: 'Hoy',
			 month: 'Mes',
			 week: 'Semana',
			 day: 'Día'
			},
			titleFormat: {
				month: 'MMMM yyyy',
				week: "dd MMM[ yyyy]{ '&#8212;' dd MMM yyyy}",
				day: 'd MMM yyyy'
			},
			columnFormat: {
				month: 'ddd',
				week: "ddd dd/MM",
				day: 'dddd dd/MM'
			},
			minTime: 6,
			allDayText: 'Todo el día',
			events: function(start, end, callback) {
				
				var fn = function() {

						App.get('citacionesController').removeObserver('loaded', this, fn);
						App.get('citacionesController').get('citaciones').forEach(function (citacion) {
								var color = '';
								if (citacion.get('estado'))
								{
									switch (citacion.get('estado').id)
									{
											case 2:
													color = "#47a447";
											break;
											case 3:
													color = "#d2322d";
											break;						
											default:
													color = "";
											break;
									}					
									citacion.set('color', color);
								   
								}	
								citacion.set('url', '');

								if (citacion.get('title').length > 75) {
									citacion.set('title', citacion.get('title').substr(0, 75) + "...");
								}
						});			
						callback(App.get('citacionesController').get('citaciones'));
				}

				App.get('citacionesController').set('anio', moment(start).format('YYYY'));
				App.get('citacionesController').set('loaded', false);
				App.get('citacionesController').addObserver('loaded', this, fn);
				App.get('citacionesController').load();				
			},
			
			eventRender: function(event, element, view) {
				element.bind('click', function() {
						App.set('citacionConsultaController.loaded', false);
						App.set('citacionConsultaController.content', App.Citacion.create({id: event.id}));
						App.get('router').transitionTo('loading');
						fn = function() {
								App.get('citacionConsultaController').removeObserver('loaded', this, fn);
								App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', App.Citacion.create(event));
						};

						App.get('citacionConsultaController').addObserver('loaded', this, fn);			
						App.get('citacionConsultaController').load();
				});
			},            
		});	
	}
});

App.MenuView = Em.View.extend({
	templateName: 'menu',
	classNames: [],
	tagName: 'ul',

	clickItem: function (item) {
		App.get('menuController').seleccionar(item.get('id'));
	},

	didInsertElement: function () {
		this._super();
		App.get('menuController').seleccionarAnterior();
	}
});

App.MenuItemView = Em.View.extend({
	tagName: 'li',
	templateName: 'menuItem',

	/*click: function () {
		this.get('parentView').clickItem(this.get('content'));
	},
	*/
	didInsertElement: function () {
		this._super();
		this.$('a').tooltip();
	},	
});

App.MenuItemTintView = App.MenuItemView.extend({
	templateName: 'menuItemTiny',

	click: function () {
		if (this.get('parentView.clickMenu'))
			this.get('parentView').clickMenu();
	},

	seleccionadoChange: function () {
		Ember.run.next(function () {
			this.$('a').tooltip();
		});
	}.observes('content.seleccionado'),	

	didInsertElement: function () {
		this._super();
		this.$('a').tooltip();
	}	
});

App.MenuItemThumbView = App.MenuItemView.extend({
	tagName: 'li',
	templateName: 'menuItemThumb',

	click: function () {
		this.get('parentView').clickItem(this.get('content'));
	},

	seleccionadoChange: function () {
		Ember.run.next(function () {
			this.$('a').tooltip();
		});
	}.observes('content.seleccionado'),

	didInsertElement: function () {
		this._super();
		this.$('a').tooltip();
	}	
});

App.MenuItemLink = Em.View.extend({
	tagName: 'a',
	classNameBindings: ['content.seleccionado:active'],
});


App.CitacionCrearView = Em.View.extend({
	templateName: 'citacion-crear',	
	
	filterTextComisiones: '',
	
	filterTextExpedientes: '',
	
	adding: false,
	
	invitado: App.CitacionInvitado.create(),
	
	tituloNuevoTema: '',
	
	temaSeleccionado: '',
	
	startFecha: '',
	endFecha: '',
	
	startHora: '',
	
	contentBinding: 'App.citacionCrearController.content',
	
	seleccionados: false,
	estadoBorrador: false,
	citacionCrear: false,

	puedeOrdenar: true,

	
//	showErrors: false,
	didInsertElement: function() {
		this._super();
		if (this.get("invitado")) {					
			this.set('invitado',App.CitacionInvitado.create());
		}

		
		/*
			Se presenta esta condicion en caso de que:
				*La citación ya exista
				*Si se está modificando los datos de una citación existente
		*/

		if(App.get('citacionConsultaController.content.estado.descripcion') == 'borrador'){
			this.set('estadoBorrador', true);
		}
		if (App.get('citacionCrearController.content.id'))
		{
			this.set('startFecha', moment(App.get('citacionCrearController.content.start').split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'));
			this.set('startHora', App.get('citacionCrearController.content.start').split(' ')[1]);
		}
		else
		{			
			this.set('startFecha', moment().format("DD/MM/YYYY"));
			this.set('startHora', moment().format("HH:SS"));
		}
		
		$('.timepicker').timeEntry({
			show24Hours: true, // 24 hours format
			showSeconds: false, // Show seconds?
			spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
			spinnerSize: [19, 26, 0], // Image size
			spinnerIncDecOnly: true, // Only up and down arrows
			defaultTime: this.get('startHora'),
			timeSteps: [1, 15, 1],
		});	 
		
		$('.timepicker').timeEntry('setTime', this.get('startHora'));
		
		var fo = App.get('citacionCrearController.content.comisiones.firstObject');
		
		App.get('citacionCrearController.content.comisiones').addObserver('firstObject', this, this.borrarExpedientes);
		
		//$('#crear-citacion-form').validationEngine('attach');
				
		fo = null;

		if (!App.get('citacionCrearController.content.id')) {
			var cu = App.get('userController.user.comisiones')[0];
			if (cu) {
				var c = App.get('comisionesController').get('content').findProperty('id', cu.id);
				if (c) {
					c.set('orden', 1);
					App.get('citacionCrearController.content.comisiones').pushObject(c);
				}
			}
		}
	}, 

	seleccionarTodos: function () {
		var _self = this;
		this.set('seleccionados', !this.get('seleccionados'));
		this.get('listaExpedientesSeleccionados').forEach(function (expediente) {
			expediente.set('seleccionado', _self.get('seleccionados'));
		});
	},
	
	crearTema: function () {
		var tema = App.CitacionTema.create({descripcion: this.get('tituloNuevoTema'), proyectos: [], grupo: true, sobreTablas: false, art109: false});
		this.set('tituloNuevoTema', '');
		
		App.get('citacionCrearController.content.temas').addObject(tema);

		this.set('temaSeleccionado', tema);
		
		this.set('adding', !this.get('adding'));
	},
	
	crearTemaHabilitado: function () {
		return this.get('tituloNuevoTema') != '';
	}.property('tituloNuevoTema'),
	
	agregarInvitadoHabilitado: function () {		
		var invitado = this.get('invitado');
		var empty = !(invitado.nombre != '' && invitado.apellido != '');
		
		return !empty && $("#formInvitados").validationEngine('validate');		
	}.property('invitado.nombre', 'invitado.apellido', 'invitado.caracter', 'invitado.mail', 'invitado.motivo'),
	
	cargarExpedientesHabilitado: function () {
		return App.get('citacionCrearController.content.comisiones').length > 0;
	}.property('adding'),
	
	cargarExpedientes: function () {
		//App.get('citacionCrearController').cargarExpedientes();
	},
	cancelarEdicion: function(){
		if(this.get('content.id')){
			App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', this.get('content'));
		}
		else{
			App.get('router').transitionTo('comisiones.citaciones.index');
		}
	},
	guardar: function () {
		this.$('#crear-citacion-form').parsley('validate');

		if (!$("#crear-citacion-form").validationEngine('validate') || !this.get('cargarExpedientesHabilitado') || !this.$('form').parsley('isValid')) return;

		var temas = App.get('citacionCrearController.content.temas');
		var temasToRemove = [];
				
		temas.forEach(function (tema) {
			var proyectos = tema.get('proyectos');

			if (proyectos.length == 0)
				temasToRemove.addObject(tema);
		});

		temas.removeObjects(temasToRemove);
				
		App.get('citacionCrearController.content').set('start', moment(this.get('startFecha'), 'DD/MM/YYYY').format('YYYY-MM-DD') + " " + moment($('.timepicker').timeEntry('getTime')).format('HH:mm'));

		if (this.get('content').get('id')) {
			App.get('citacionCrearController').save();
		}
		else {
			App.get('citacionCrearController.content').set('estado', App.CitacionEstado.create({id: 1}));

			App.get('citacionCrearController').create();		
		}
	},	
	crearInvitado: function () {
		var invitado = this.get('invitado');

		if(!$('#formInvitados').parsley('validate')) return false;

		App.get('citacionCrearController.content.invitados').addObject(invitado);
		this.set('invitado', App.CitacionInvitado.create());
		
		this.set('adding', !this.get('adding'));
	},
	clickInvitado : function (invitado) {
		App.get('citacionCrearController.content.invitados').removeObject(invitado);
		this.set('adding', !this.get('adding'));
	},
	clickComision: function (comision) {
		//App.get('citacionCrearController').cargarExpedientes();
		
		if (App.get('citacionCrearController.isEdit') == true) return;

		//if (App.get('citacionCrearController.content.comisiones.length') > 0 && !App.get('userController').hasRole('ROL_DIRECTOR_COMISIONES')) return;	

		var item = App.get('citacionCrearController.content.comisiones').findProperty("id", comision.get('id'));
		if (!item) {
			App.get('citacionCrearController.content.comisiones').pushObject(comision);
		}
		else {
			App.get('citacionCrearController.content.comisiones').removeObject(comision);
		}

		this.set('adding', !this.get('adding'));
	},
	
	clickExpediente: function (expediente) {
		if (!this.get('listaExpedientesSeleccionados').findProperty('id', expediente.get('id'))) {
			var tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), proyectos: [], grupo: false, sobreTablas: false, art109: false})
			App.get('citacionCrearController.content.temas').addObject(tema);
			tema.get('proyectos').addObject(expediente);
			expediente.get('tema', null);
		}
	},	
	
	clickBorrar: function (expediente) {
		var tema = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('tema'));		
		if (tema)
			tema.get('proyectos').removeObject(expediente);
			
		var temaInicial = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('expdip'));
		if (temaInicial)
			App.get('citacionCrearController.content.temas').removeObject(temaInicial);
			
		expediente.set('tema', null);

		this.set('adding', !this.get('adding'));
	},

	clickMoverArribaInTema: function (expediente) {	
		this.clickMoverInTema(expediente, -1);
	},

	clickMoverAbajoInTema: function (expediente) {
		this.clickMoverInTema(expediente, 1);
	},

	clickMoverInTema: function (expediente, haciaPosicion) {
		var tema = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('tema'));
		if (tema){
			App.set('citacionCrearController.content.proyectos', tema.get('proyectos'));
			var proyectos = App.get('citacionCrearController.content.proyectos');
			var posicion = -1;

			posicion = proyectos.indexOf(expediente);


			if(posicion > -1){
				var aux = proyectos[posicion];
				var posicionAnterior = posicion + haciaPosicion;
				if(posicionAnterior > -1 && posicionAnterior < proyectos.length){
					proyectos[posicion] = proyectos[posicionAnterior];
					proyectos[posicionAnterior] = aux;
					var lastProy = proyectos.pop();	
					proyectos.addObject(lastProy);
				}
			}
			
		}
		this.set('adding', !this.get('adding'));
	},	
	
	clickDesagrupar: function (expediente)
	{
		var temaAnterior = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('tema'));
		temaAnterior.get('proyectos').removeObject(expediente);
		var tema = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('expdip'));
		if (!tema)
		{
			tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), proyectos: [], grupo: false, sobreTablas: false, art109: false})
			App.get('citacionCrearController.content.temas').addObject(tema);			
		}

		tema.get('proyectos').addObject(expediente);

		expediente.set('tema', null);
	},
	
	agruparExpedientes: function () {
		var seleccionados = this.get('listaExpedientesSeleccionados').filterProperty('seleccionado', true);
		seleccionados.forEach(function(expediente){
			
			var temaAnterior = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('tema'));
			
			if (temaAnterior)
			{
				temaAnterior.get('proyectos').removeObject(expediente);
			}
			
			var temaInicial = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('expdip'));
			
			if (temaInicial)
			{
				temaInicial.get('proyectos').removeObject(expediente);
			}			
			
			expediente.set('seleccionado', false);
			expediente.set('tema', this.get('temaSeleccionado').get('descripcion'));
			
			this.get('temaSeleccionado.proyectos').addObject(expediente);
		}, this);
		this.set('seleccionados', false);
		App.set('citacionCrearController.content.proyectos', []);
	},
	
	listaComisiones: function () {
		var regex = new RegExp(this.get('filterTextComisiones').toString().toLowerCase());
		var filtered = App.get('comisionesController').get('arrangedContent').filter(function(comision) {
			return regex.test((comision.nombre).toLowerCase());
		});

		return filtered.removeObjects(App.get('citacionCrearController.content.comisiones'));		
	}.property('citacionCrearController.content.comisiones', 'filterTextComisiones', 'comisionesController.arrangedContent', 'adding'),
	
	listaExpedientes: function () {
		var filtered;
		if (this.get('filterTextExpedientes') != '')
		{
			var regex = new RegExp(this.get('filterTextExpedientes').toString().toLowerCase());
			
			filtered = App.get('citacionCrearController.expedientes').filter(function(expediente) {
				return regex.test((expediente.titulo).toLowerCase() + (expediente.expdip).toLowerCase() + expediente.get('firmantesLabel2').toLowerCase());
			});
		}
		else
		{
			filtered = App.get('citacionCrearController.expedientes');
		}
		
		if (this.get('listaExpedientesSeleccionados'))
		{
			this.get('listaExpedientesSeleccionados').forEach(function (expediente) {
				filtered = filtered.without(expediente)
			});
			return filtered;
		}
		else
			return filtered;
		
	}.property('App.citacionCrearController.expedientes', 'filterTextExpedientes', 'App.citacionCrearController.content.temas.@each', 'adding'),	
	
	listaTemas: function () {
		var temas = App.get('citacionCrearController.content.temas').filterProperty('grupo', true);
		return temas;
	}.property('citacionCrearController.content.temas', 'adding'),
	
	listaExpedientesSeleccionados: function () {
		var expedientesSeleccionados = [];
		var temas = App.get('citacionCrearController.content.temas');
		if (!temas)
			return expedientesSeleccionados;
		
		temas.forEach(function (tema) {
			var proyectos = tema.get('proyectos');
			proyectos.forEach(function (expediente) {
				expedientesSeleccionados.addObject(expediente);
			});
		});
		expedientesSeleccionados.reverse();
		return expedientesSeleccionados;
	}.property('App.citacionCrearController.content.temas', 'App.citacionCrearController.content.temas.@each.proyectos','App.citacionCrearController.content.proyectos.@each'),

	hayInvitados: function () {
		return App.get('citacionCrearController.content.invitados').length > 0;
	}.property('citacionCrearController.content.invitados', 'adding'),
	
	borrarExpedientes: function () {

		App.set('citacionCrearController.content.temas', []);
		App.set('citacionCrearController.expedientes', []);

		var fo = App.get('citacionCrearController.content.comisiones.firstObject');
		App.get('expedientesArchivablesController').set('comision', fo);

		fo = null;
		
	},

	cargarExpedientesSuccess: function () {
		this.set('adding', !this.get('adding'));
	},
	
	puedeEditar: function () {
		return this.get('content.estado.id') == 1 || !this.get('content.id');
	}.property('content.id', 'content', 'content.estado'),	
	
	puedeConfirmar: function () {
		return this.get('content.estado.id') == 1 && this.get('content.id');
	}.property('content.id', 'content', 'content.estado'),
	
	confirmar: function () {
		App.ComfirmarCitacionView.popup();
	},
	
	puedeCancelar: function () {
		return this.get('content.estado.id') != 3 && this.get('content.id');
	}.property('content.id', 'content', 'content.estado'),
		
	cancelar: function () {
		App.CancelarCitacionView.popup();
	},
	
	puedeCrearReunion: function () {
		return this.get('content.reunion.id') == undefined && this.get('content.estado.id') == 2;
	}.property('content.reunion.id', 'content.id', 'content.reunion', 'content', 'content.estado'),
		
	crearReunion: function () {
		App.CrearReunionView.popup();		
	},	


});

App.ComfirmarCitacionView = App.ModalView.extend({
	templateName: 'citacion-confirmar',
	
	callback: function(opts, event) {
			if (opts.primary) {
				App.get('citacionCrearController').confirmar();
			} else if (opts.secondary) {
				//alert('cancel')
			} else {
				//alert('close')
			}
			event.preventDefault();
	}, 
	
	didInsertElement: function () {
		this._super();
		if (!App.get('citacionCrearController.content'))
			App.set('citacionCrearController.content', App.get('citacionConsultaController.content'));
	}	
});


App.CancelarCitacionView = App.ModalView.extend({
	templateName: 'citacion-cancelar',
	motivoSeleccionado: '',
	motivos: ['Motivo 1', 'Motivo 2', 'Motivo 3'],
	
	callback: function(opts, event) {

			if (opts.primary) {
				App.get('citacionCrearController').cancelar();
			} else if (opts.secondary) {
				//alert('cancel')
			} else {
				//alert('close')
			}
			event.preventDefault();
	}, 

	didInsertElement: function () {
		this._super();
		if (!App.get('citacionCrearController.content'))
			App.set('citacionCrearController.content', App.get('citacionConsultaController.content'));
	}
});

App.CrearReunionView = App.ModalView.extend({
	templateName: 'reunion-crear',

	startFecha: '',
	startHora: '',
	nota:'',
	
	citacionBinding: 'App.citacionCrearController.content',

	callback: function(opts, event){
		if (opts.primary) {
			App.get('citacionCrearController').crearReunion(App.Reunion.extend(App.Savable).create({
				id: null,
				nota: this.get('nota'),
				fecha: moment(this.get('startFecha'), 'DD/MM/YYYY').format('YYYY-MM-DD') +' '+ this.get('startHora'),
				comisiones: $.map(this.get('citacion.comisiones'), function (value, key) {  
					return {orden: key, nombre: value.nombre, comision: {id: value.id}}; 
				}),
				art108: this.get('art108'),
				citacion: App.Citacion.create({id: this.get('citacion.id') })
			}));
		} else if (opts.secondary) {
			//alert('cancel')
		} else {
			//alert('close')
		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();

		this.$(":checkbox").uniform();

		this.set('startFecha', moment(App.get('citacionConsultaController').content.start, 'YYYY-MM-DD').format('DD/MM/YYYY'));
		this.set('startHora', moment(App.get('citacionConsultaController').content.start, 'YYYY-MM-DD HH:ss').format('HH:ss'));
		
		$('.timepicker').timeEntry({
			show24Hours: true, // 24 hours format
			showSeconds: false, // Show seconds?
			spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
			spinnerSize: [19, 26, 0], // Image size
			spinnerIncDecOnly: true, // Only up and down arrows
			timeSteps: [1, 1, 1],
			defaultTime: this.get('startHora')
		});	 
		
		$('.timepicker').timeEntry('setTime', this.get('startHora'));

		if (!App.get('citacionCrearController.content'))
			App.set('citacionCrearController.content', App.get('citacionConsultaController.content'));

	}, 
});

App.ComisionView = Em.View.extend({
	tagName: 'li',
	templateName: 'comision',	
	clickComision: function () {
		this.get('parentView').get('parentView').clickComision(this.get('content'));
	}, 
});

App.ComisionesView = Ember.CollectionView.extend({
	classNames : ['subNav'],  
	tagName: 'ul',
	itemViewClass: App.ComisionView, 
});

App.ProyectoComisionView = Em.View.extend({
	tagName: 'li',
	templateName: 'proyecto-comision',	

	clickComision: function () {
		this.get('parentView').get('parentView').clickComision(this.get('content'));
	}, 
});

App.ProyectosComisionesView = Ember.CollectionView.extend({
	classNames : ['subNav'],  
	tagName: 'ul',
	itemViewClass: App.ProyectoComisionView, 
});

App.InvitadoView = Em.View.extend({
	tagName: 'tr',
	templateName: 'invitado',
	
	clickInvitado: function () {
		this.get('parentView').get('parentView').clickInvitado(this.get('content'));
	}, 
});

App.InvitadosView = Ember.CollectionView.extend({
	classNames : [],  
	tagName: 'tbody',
	itemViewClass: App.InvitadoView, 
});

App.CitacionExpediente = Em.View.extend({
	tagName: 'li',
	templateName: 'citacion-expediente',
	
	clickExpediente: function () {
		this.get('parentView').get('parentView').clickExpediente(this.get('content'));
	}, 
});


App.CitacionExpedientes = Ember.CollectionView.extend({
	classNames : ['subNav'],  
	tagName: 'ul',
	itemViewClass: App.CitacionExpediente, 
});


App.CitacionExpedienteSeleccionado = Em.View.extend({
	tagName: 'tr',
	templateName: 'citacion-expediente-seleccionado',
	
	clickBorrar: function () {
		this.get('parentView').get('parentView').clickBorrar(this.get('content'));
	}, 
	
	clickDesagrupar: function () {
		this.get('parentView').get('parentView').clickDesagrupar(this.get('content'));
	},
	
	willInsertElement: function(){
//		console.log(this.get('content'));
/*
		this.set('content', this.get('content.proyecto'));
		this.set('content.art109', this.get('content.art109'));
		this.set('content.sobreTabla', this.get('content.sobreTabla'));
*/
	},
	didInsertElement: function () {
		this._super();
		$('.tipS').tipsy({gravity: 's',fade: true, html:true});
	},

	clickMoverArribaInTema: function (){
		this.get('parentView').get('parentView').clickMoverArribaInTema(this.get('content'));
	},

	clickMoverAbajoInTema: function (){
		this.get('parentView').get('parentView').clickMoverAbajoInTema(this.get('content'));
	},

});


App.CitacionExpedientesSeleccionados = Ember.CollectionView.extend({ 
	tagName: 'tbody',
	itemViewClass: App.CitacionExpedienteSeleccionado, 
});


/* Reuniones */


App.ReunionView = Ember.View.extend({
	tagName: 'tr',
	classNames: ['gradeX'],
	templateName: 'reunion',
});


App.SinReunionesListView = App.ListFilterView.extend({	
	itemViewClass: App.ReunionView,
	columnas: [],
});

App.ReunionesSinParteListView = App.ListFilterView.extend({
	itemViewClass: App.ReunionView,
//	columnas: ['Fecha', 'Nota', 'Comisiones convocadas'],
	columnas: ['Fecha Reunión', 'Temario','Comisiones convocadas'],
});

App.ReunionesSinParteView = Em.View.extend({
	templateName: 'reuniones-sin-parte',
});

App.ReunionesConParteListView = App.ListFilterView.extend({
	itemViewClass: App.ReunionView,
//	columnas: ['Fecha', 'Nota', 'Comisiones convocadas'],
	columnas: ['Fecha Reunión ', 'Temario','Comisiones convocadas'],
});

App.ReunionesConParteView = App.ListFilterView.extend({
	templateName: 'reuniones-con-parte',
});


App.CrearDictamenView = Em.View.extend({
	templateName: 'crear-dictamen',
});

	
	
App.CargarDictamenView = Em.View.extend({
	templateName: 'cargar-dictamen',

});

App.DictamenesPendientesView = Em.View.extend({
	templateName: 'dictamenes-pendientes',
});


App.DictamenPendienteView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'dictamen-pendiente-item',

	puedeCargar: function () {
		return App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES') 
	}.property('App.userController.user')
});

App.DictamenesPendientesListView = App.ListFilterView.extend({ 
	itemViewClass: App.DictamenPendienteView, 	        
	//columnas: ['Fecha Reunión','Expedientes', 'Comisiones Convocadas', 'Cargar Dictamen'],
		
		columnas: function(){
			if(App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES') ){
				return ['Fecha Reunión','Expedientes Pendientes de Dictamen', 'Comisiones Convocadas', 'Cargar Dictamen']
			}else{
				return ['Fecha Reunión','Expedientes Pendientes de Dictamen', 'Comisiones Convocadas']
			}
		}.property('columnas'),
		
});

App.DictamenConsultaView = Em.View.extend({
	templateName: 'dictamenConsulta',
	articulos: false,
	art108:null,
	leyenda:null,


	didInsertElement: function(){
		this._super();

		$(".whead").on('click', function(){
			$(this).parent().children(":eq(1)").stop().slideToggle(1200);
		});

		if(App.get('dictamenConsultaController.content.art108'))
			this.set('art108', true);
		if(App.get('dictamenConsultaController.content.art204'))
			this.set('art204', true);
		if(App.get('dictamenConsultaController.content.art114'))
			this.set('art114', true);

		if(App.get('dictamenConsultaController.content.art108') != null || App.get('dictamenConsultaController.content.art204') != null  || App.get('dictamenConsultaController.content.art114') != null || App.get('dictamenConsultaController.content.unanimidad') != null){
			this.set('articulos', true);
		}

		App.set('dictamenConsultaController.content.textos.firstObject.mayoria', true);


		var leyenda		 = null;
		var dictamen 	 = App.get('dictamenConsultaController.content');
		var textos 		 = dictamen.textos;
		var art108		 = dictamen.art108;
		var art114		 = dictamen.art114;
		var art204		 = dictamen.art204;
		var unanimidad   = dictamen.unanimidad;
		var idReunion	 = dictamen.id_reunion;
		var texto 					= null;

		function estaAprobado() {
			var aprobado = true;
			textos.forEach(function(value) {
				if (value.rechazado == true) {
					aprobado = false;
				}
			});
			return aprobado;
		}

		function conModificaciones() {
			var modificado = false;
			textos.forEach(function(value) {
				if (value.modificado == true) {
					modificado = true;
				}
			});
			return modificado;
		}

		function art108PrimerParrafo() {
			return false;
		}

		function art108SegundoParrafo() {
			return art108;
		}

		function estaUnificado(){
			var unificado = false;
			textos.forEach(function(value) {
				if (value.unificado == true) {
					unificado = true;
				}
			});
		}

		function dictamenDeMayoriaFirmanteConDisidencia(textos){
			var conDisidencia = false;
			(textos[0].firmantes).forEach (function(firmante) {
				if (firmante.disidencia > 1) {
					conDisidencia = true;
				}
			});

			return conDisidencia;
		}

		function dictamenesDeMinoriaFirmanteConDisidencia(textos){
			var disidencia = false;

			textos.slice(1).forEach(function(texto){
				texto.firmantes.forEach(function(firmante){
					if(firmante.disidencia > 1)
					{
						disidencia = true;
					}
				});
			});

			return disidencia;
		}

		if (estaAprobado()) {
			leyenda = "Aprobado ";
		}
		if (unanimidad) {
			leyenda = leyenda + "por unanimidad ";
		}
		if (conModificaciones()) {
			leyenda = leyenda + "con modificaciones ";
		} else {
			leyenda = leyenda + "sin modificaciones ";
		}
		if (art108PrimerParrafo()) {
			leyenda = leyenda + "en los términos del artículo 108 primer párrafo del reglamento de la H. Cámara ";
		} else if (art108SegundoParrafo()) {
			leyenda = leyenda + "en los términos del artículo 108 segundo párrafo del reglamento de la H. Cámara ";
		} else if (art114) {
			leyenda = leyenda + "en los términos del articulo 114 del reglamento de la H. Cámara ";
		} else if (art204) {
			leyenda = leyenda + "en los términos del articulo 204 del reglamento de la H. Cámara ";
		}
		if (estaUnificado()) {
			leyenda = leyenda + "unificados ";
		}
		if (textos.length == 1) {
			leyenda = leyenda + "en un solo dictamen ";
			if (dictamenDeMayoriaFirmanteConDisidencia(textos)) {
				leyenda = leyenda + "con disidencia ";
			}
		} else if ( textos.length > 1 ) {
			leyenda = leyenda + "con dictamen de mayoría ";
			if (dictamenDeMayoriaFirmanteConDisidencia(textos)) {
				leyenda = leyenda + "con disidencia ";
			}

			if (textos.length == 2) {
				leyenda = leyenda + "y con dictamen de minoría ";
			}  else {
				var largo = textos.length - 1;
				leyenda = leyenda + "y con " + largo + " dictamenes de minoría ";
			}

			if (dictamenesDeMinoriaFirmanteConDisidencia(textos)) {
				leyenda = leyenda + "con disidencia ";
			}
		}

		this.set('leyenda', leyenda);

	},
	exportar: function(){
		$.download('exportar/dictamen', "&type=dictamen&data=" + JSON.stringify(App.dictamenConsultaController.content));
	},
});

App.DictamenTextoView = Em.View.extend({
	templateName: 'dictamen-texto',
	disicencias: false,
	nombreArchivo: null,
	rechazoUnificadosModificado: false,
	proyectos:false,

	didInsertElement: function(){
		this._super();

		if(this.get('content.rechazo') != null || this.get('content.unificados') != null || this.get('content.modificado') != null){
			this.set('rechazoUnificadosModificado', true);
		}
		if(this.get('content.pr') != null || this.get('content.pd') != null || this.get('content.pl') != null){
			this.set('proyectos', true);
		}

		url = this.get('content.url');
		if (url != null) {
			this.set('nombreArchivo', url.substr(url.lastIndexOf('/')+1));
		}
	}
});
App.DictamenFirmantesView = Em.View.extend({
	templateName: 'dictamen-firmantes',
	disidenciaTipo: null,

	didInsertElement: function(){
		this._super();

		if(this.get('content').disidencia == 1) 
			this.set('disidenciaTipo', true);
	}
});

App.DictamenesSinOrdenDelDiaView = Em.View.extend({
	templateName: 'dictamenes-sin-orden-del-dia',
});


App.ReunionConsultaView = Em.View.extend({
	templateName: 'reunionConsulta',
//	urlExpedientes: '/exp/proyectos',
	urlExpedientes: 'com/%@/proyectos/',
	filterExpedientes: '',
	tituloNuevoTema: '',
	seleccionados: false,
	citacion: null,
	isEdit: false,
	puedeOrdenar: false,

	expSobreTabla: false,
	expArt109: false,
	expedienteSeleccionado: null,

	didInsertElement: function () {
		this._super();
		var citacion = App.Citacion.extend(App.Savable).create(Ember.copy(App.get('citacionConsultaController.content')));
		this.set('citacion', citacion);
	},
	puedeExportar: function(){
		return (App.get('reunionConsultaController.content.nota') != '' || App.get('reunionConsultaController.content.parte').length > 0);
	}.property('App.reunionConsultaController'),
	puedeEditarTemario: function(){
		return (App.get('reunionConsultaController.content.parte').length == 0 && App.get('reunionConsultaController.content.nota') == '');
	}.property('App.reunionConsultaController'),
	puedeVerParte: function(){
		return (App.get('reunionConsultaController.content.nota') != '' || App.get('reunionConsultaController.content.parte').length > 0);
	}.property('App.reunionConsultaController'),
	puedeCrearParte: function () {
		return ((App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES')) && (App.get('reunionConsultaController.content.nota') == '' && App.get('reunionConsultaController.content.parte').length == 0))
	}.property('App.userController.user', 'App.reunionConsultaController'),
	puedeCrearParteyPuedeEditarTemario:function(){
		if(
			(App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES')) 
			&& (App.get('reunionConsultaController.content.nota') == '' && App.get('reunionConsultaController.content.parte').length == 0) 
			&& (App.get('reunionConsultaController.content.parte').length == 0 && App.get('reunionConsultaController.content.nota') == ''))
			return true;
	}.property('App.userController.user', 'App.reunionConsultaController'),
	cancelarEdicion: function () {
		fn = function() {
			App.get('reunionConsultaController').removeObserver('loaded', this, fn);
			App.set('citacionConsultaController.content', App.Citacion.create(Ember.copy(this.get('citacion'))));
			App.get('router').transitionTo('index');
			App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', App.get('reunionConsultaController.content'));							
		}			
		App.set('reunionConsultaController.loaded', false);			
		App.get('reunionConsultaController').addObserver('loaded', this, fn);
		App.get('reunionConsultaController').load();	
	},


	exportar: function(){
		$.download('exportar/reunion', "&type=reunion&data=" + JSON.stringify(App.reunionConsultaController.content)+"&data2=" + JSON.stringify(App.citacionConsultaController.content));
	},

	crearTemaHabilitado: function () {
		return this.get('tituloNuevoTema') != '';
	}.property('tituloNuevoTema'),

	cargarExpedientes: function () {
		this.set('isEdit', true);

		$.ajax({
			url: (App.get('apiController').get('url') + this.get('urlExpedientes')).fmt(encodeURIComponent(this.get('citacion.comisiones').objectAt(0).id)),
			crossDomain: 'true',
			dataType: 'JSON',
			type: 'GET',
			context: this,
			success: this.cargarExpedientesSucceeded,
			beforeSend: function () {		
				this.set('loaded', false);
			}
		});			
	},

	cargarExpedientesSucceeded: function (data) {
		
		/*var exp = [];
		data.forEach(function(i){
			exp.addObject(App.Expediente.extend(App.Savable).create(i));
		}, this);
		this.set('expedientes', exp);
		this.set('loaded', true);
		*/

		citacion = this.get('citacion');
		var temas = [];
		_self = this;
		citacion.get('temas').forEach(function (tema) {
			var t = App.CitacionTema.create();
			t.setProperties(tema);
			temas.addObject(t);
			//console.log(t);
			var proyectos = t.get('proyectos');
			var ps = [];
			proyectos.forEach(function (p) {
				var proyecto = App.Expediente.extend(App.Savable).create(p);
				if (t.get('grupo')) {
					proyecto.set('tema', t.get('descripcion'));
				}
				proyecto.set('bloqueado', true);
				ps.pushObject(proyecto);
			});									
			t.set('proyectos', ps);
		});

		citacion.set('temas', temas);
		
	},

	listaExpedientes: function () {
		var filtered = [];

		if (this.get('filterExpedientes') != '')
		{
			var regex = new RegExp(this.get('filterExpedientes').toString().toLowerCase());
			
			filtered = this.get('expedientes').filter(function(expediente) {
				return regex.test((expediente.tipo).toLowerCase() + (expediente.titulo).toLowerCase() + (expediente.expdip).toLowerCase());
			});
		}
		else
		{
			filtered = this.get('expedientes');
		}

		if (this.get('listaExpedientesSeleccionados'))
		{
			if (filtered) {
				this.get('listaExpedientesSeleccionados').forEach(function (expediente) {
					filtered = filtered.without(expediente)
				});
			}
		}		
		return filtered;
	}.property('expedientes', 'filterExpedientes', 'listaExpedientesSeleccionados'),


	seleccionarTodos: function () {
		var _self = this;
		this.set('seleccionados', !this.get('seleccionados'));
		this.get('listaExpedientesSeleccionados').forEach(function (expediente) {
			expediente.set('seleccionado', _self.get('seleccionados'));
		});
	},
	
	crearTema: function () {
		var tema = App.CitacionTema.create({descripcion: this.get('tituloNuevoTema'), proyectos: [], grupo: true, sobreTablas: true, art109: false});
		this.set('tituloNuevoTema', '');
		
		this.get('citacion.temas').addObject(tema);

		this.set('temaSeleccionado', tema);
		
		this.set('adding', !this.get('adding'));
	},
	
	
	guardar: function () {
		App.confirmActionController.setProperties({
			title: 'Confirmar Temario',
			message: '¿ Esta seguro que desea modificar el temario ?',
			success: null,
		});


		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();
	},
	

	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);

		if (App.get('confirmActionController.success')) {
			var temas = this.get('citacion.temas');
			var temasToRemove = [];
			var orden = 1;
			temas.forEach(function(tema){
				var proyectos = tema.get('proyectos');
				if(proyectos.length == 0)
					temasToRemove.addObject(tema);
				else
				{
					tema.set('orden', orden);
					orden++;
				}
			});

			temas.removeObjects(temasToRemove);

			this.get('citacion').set('temas', temas);
			this.get('citacion').save();
			this.get('citacion').addObserver('saveSuccess', this, this.saveSuccess);				
		}
	},

	saveSuccess: function () {
		this.get('citacion').removeObserver('saveSuccess', this, this.saveSuccess);
		if (this.get('citacion.saveSuccess') == true)
		{
			fn = function() {
				App.get('reunionConsultaController').removeObserver('loaded', this, fn);
				App.set('citacionConsultaController.content', App.Citacion.create(Ember.copy(this.get('citacion'))));
//				App.set('citacionConsultaController.content', App.Citacion.extend(App.Savable).create(Ember.copy(this.get('citacion'))));
				App.get('router').transitionTo('index');
				App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', App.get('reunionConsultaController.content'));
				$.jGrowl('Temario editado exitosamente!', { life: 5000 });
			}			
			App.set('reunionConsultaController.loaded', false);			
			App.get('reunionConsultaController').addObserver('loaded', this, fn);
			App.get('reunionConsultaController').load();			
		}			
		else
		{
			$.jGrowl('Ocurrió un error al intentar guardar los cambios en la reunion!', { life: 5000 });
		}		
	},
	
	clickExpediente: function (expediente) {		
		if (!this.get('listaExpedientesSeleccionados').findProperty('id', expediente.get('id'))) {

			App.ExpedienteSobreTablasFueraDeTemarioView.popup();
			App.reunionConsultaController.addObserver('sobretablas', this, this.sobreTablasConfirm);
			this.set('expedienteSeleccionado', expediente);

//			var tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), grupo: false, proyectos: [], sobreTablas: true, art109: false});
//			this.get('citacion.temas').addObject(tema);
//			tema.get('proyectos').addObject(expediente);			
		}
	},
	sobreTablasConfirm: function () {
		App.reunionConsultaController.removeObserver('sobretablas', this, this.sobreTablasConfirm);
		var expedienteSeleccionado = this.get('expedienteSeleccionado');

		if(App.get('reunionConsultaController.sobretablas'))
		{
			this.set('expSobreTabla', true);
			this.set('expArt109', false);
		}
		else
		{
			this.set('expSobreTabla', false);
			this.set('expArt109', true);
		}

		var tema = App.CitacionTema.create({descripcion: expedienteSeleccionado.get('expdip'), grupo: false, proyectos: [], sobreTablas: this.get('expSobreTabla'), art109: this.get('expArt109')});
		this.get('citacion.temas').addObject(tema);
		tema.get('proyectos').addObject(expedienteSeleccionado);	
	},	
	clickBorrar: function (expediente) {
		var tema = this.get('citacion.temas').findProperty('descripcion', expediente.get('tema'));		
		if (tema)
			tema.get('proyectos').removeObject(expediente);
			
		var temaInicial = this.get('citacion.temas').findProperty('descripcion', expediente.get('expdip'));
		if (temaInicial)
			this.get('citacion.temas').removeObject(temaInicial);
			
		expediente.set('tema', null);
		
		this.set('adding', !this.get('adding'));
	},
	
	
	clickDesagrupar: function (expediente) {
		
		var temaAnterior = this.get('citacion.temas').findProperty('descripcion', expediente.get('tema'));
		temaAnterior.get('proyectos').removeObject(expediente);
		var tema = this.get('citacion.temas').findProperty('descripcion', expediente.get('expdip'));
		if (!tema)
		{
			tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), proyectos: [], grupo: false, sobreTablas: false, art109: false})
			this.get('citacion.temas').addObject(tema);
		}

		tema.get('proyectos').addObject(expediente);
		
		expediente.set('tema', null);
	},
	
	agruparExpedientes: function () {
		var seleccionados = this.get('listaExpedientesSeleccionados').filterProperty('seleccionado', true);
		_self = this;
		seleccionados.forEach(function(expediente){
			
			var temaAnterior = _self.get('citacion.temas').findProperty('descripcion', expediente.get('tema'));
			
			if (temaAnterior)
			{
				temaAnterior.get('proyectos').removeObject(expediente);
			}
			
			var temaInicial = _self.get('citacion.temas').findProperty('descripcion', expediente.get('expdip'));
			
			if (temaInicial)
			{
				temaInicial.get('proyectos').removeObject(expediente);
			}			
			
			expediente.set('seleccionado', false);
			expediente.set('tema', _self.get('temaSeleccionado').get('descripcion'));
			
			_self.get('temaSeleccionado.proyectos').addObject(expediente);
		}, this);
		this.set('seleccionados', false);
	},
	
	listaTemas: function () {
		var temas = [];
		if (this.get('citacion')) {
			temas = this.get('citacion.temas').filterProperty('grupo', true);
		}
		return temas;
	}.property('citacion.temas.@each', 'adding'),
	
	listaExpedientesSeleccionados: function () {
		var expedientesSeleccionados = [];
		var temas = this.get('citacion.temas');
		if (!temas)
			return expedientesSeleccionados;

		temas.forEach(function (tema) {

			var proyectos = tema.get('proyectos');
			proyectos.forEach(function (expediente) {

				expediente.art109 = tema.art109;
				expediente.sobreTablas = tema.sobreTablas;

				expedientesSeleccionados.addObject(expediente);

			});
		});

		return expedientesSeleccionados.reverse();
	}.property('citacion.temas', 'citacion.temas.@each.proyectos'),
	/*
	crearParte: function () {
		App.eventosParteController = App.EventosParteController.create();

		fn = function () {
			App.set('reunionConsultaController.content.parte', []);
//			App.get('router').transitionTo('comisiones.partes.parteConsulta.crearParte');
			App.get('router').transitionTo('comisiones.reunionesConsulta.parte.crear');
		}
		
		App.get('eventosParteController').addObserver('loaded', this, fn);
		App.get('eventosParteController').load();
	},
	*/
	editarParte: function () {
		App.get('router').transitionTo('comisiones.partes.parteConsulta.editarParte');	
	},



});

App.CrearParteView = Ember.View.extend({
	templateName: 'crear-parte',
	nota: '',
	expedientes: [],
	faltaSeleccionar: null,

	cancelar: function () {
		App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', App.get('reunionConsultaController.content'));
	},

	listaTemas: function () {
		return App.get('citacionConsultaController.content.temas');
	}.property('citacionConsultaController.content.temas'),
	

	clearErrors: function () {
		if (this.get('submitting')) {
			App.get('citacionConsultaController.content.temas').forEach(function(tema) {
				if(!tema.get('parteEstado').id){
					tema.set('faltaSeleccionar', true); 
				} else {
					tema.set('faltaSeleccionar', false); 
				}
			});
		}
	}.observes('App.citacionConsultaController.content.temas.@each.parteEstado.id'),


	guardarParte: function () {
		var _self = this;
		this.set('submitting', true);
		this.set('faltaSeleccionar', true);
		App.get('citacionConsultaController.content.temas').forEach(function(tema) {
			if(!tema.get('parteEstado').id){
				tema.set('faltaSeleccionar', true); 
			} else {
				_self.set('faltaSeleccionar', false);
				tema.set('faltaSeleccionar', false); 
			}
		});

		$('#formCrearParte').parsley('destroy');
		if(!$('#formCrearParte').parsley('validate') || (App.get('citacionConsultaController.content.temas').length > 0 && this.get('faltaSeleccionar') == true)) return false;

		App.confirmActionController.setProperties({
			title: 'Confirmar Crear parte',
			message: '¿ Esta seguro que desea crear el parte ?',
			success: null,
		});

		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();

	},

	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);

		if (App.get('confirmActionController.success')) {
			var parte = [];

			App.get('citacionConsultaController.content.temas').forEach(function(tema) {
				if (tema.get('parteEstado').id) {
					var parteItem;
					parteItem = Em.Object.create(tema.get('parteEstado'));
					parteItem.id = null;
					parteItem.set('itemParte', tema.get('parteEstado.id'));
					parteItem.set('tipo', tema.get('parteEstado.tipo'));
					parteItem.proyectos = [];

					filtered = parte.filter(function (parteItem) {
						return parteItem.itemParte == tema.get('parteEstado.id');
					});
					parteItem.orden = filtered.length + 1;

					var orden = 0;
					tema.get('proyectos').forEach(function (proyecto){
						parteItem.proyectos.addObject({proyecto: proyecto, orden: orden, id: {id_proy: proyecto.id}});
						orden++;
					});					
					/*if (tema.get('dictamen') && tema.get('parteEstado').id == 4) {
						parteItem.caracterDespacho = App.CaracterDespacho.create({
							tipo: 'CaracterDictamen',
							id: 5,
							descripcion: "Aprobado con modificaciones Dictamen de Mayoría y Dictamen de Minoría",
							itemParte: 4,
							resumen: "con modif. D. de Mayoría y D. de Minoría",
							tipoDict: "OD",						
						});
					}*/
					parte.addObject(parteItem);
				}
			});

			App.set('reunionConsultaController.content.parte', parte);
			App.set('reunionConsultaController.content.nota', this.get('nota'));

			fn = function () {
				App.get('reunionConsultaController.content').removeObserver('saveSuccess', this, fn);
				if (App.get('reunionConsultaController.content.saveSuccess') == true)
				{
					App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', App.get('reunionConsultaController.content'));

					$.jGrowl('Parte creado con éxito!', { life: 5000 });					

				}
				else
				{
					$.jGrowl('No se pudo crear el parte!', { life: 5000 });
				}
			}

			App.get('reunionConsultaController.content').save();
			App.get('reunionConsultaController.content').addObserver('saveSuccess', this, fn);
		}
	},

	didInsertElement: function () {
		this._super();
		this.set('submitting', false);
		var parte = App.get('reunionConsultaController.content.parte');
		if (parte)
		{
			parte.forEach(function (parteItem) {
				var tema;
				if (parteItem.proyectos)
				{
					App.get('citacionConsultaController.content.temas').forEach(function(t){
						var esTema = false

						if (parteItem.proyectos.length > 0) {
							esTema = true;
							parteItem.proyectos.forEach(function (e){
								if (!t.proyectos.findProperty('id', e.proyecto.id)) {
									esTema = false;
								}
							});
						}


						if (esTema)
						{
							tema = t;
						}
					});
				}
				if (tema)
				{
					tema.set('parteEstado', App.get('eventosParteController.content').findProperty('id', parteItem.itemParte));	
				}
			});
		}
	},
});


App.EstadoParteView = Ember.View.extend({
	templateName: 'parte-estado',
	estado: 'Seleccione una accion',
	listaEstados: function () {
		var arr = ['Seleccione tratamiento'];
		if (App.get('eventosParteController.content')) {
			App.get('eventosParteController.content').forEach(function(eventoParte) {
				arr.addObject(eventoParte);
			});
		}
		return arr;
	}.property('App.eventosParteController.content')
});

App.DictamenCrearView = Ember.View.extend({
	templateName: 'crear-dictamen-detalle',
	filterExpedientesDictaminar: '',
	filterProyectosVistosDictaminar: '',
	filterExpedientes: '',
	filterProyectosVistos: '',
	adding: false,
	dictamenesAgregados: false,
	clickGuardar: null,

	proyectosDictaminadosChange: function(){
		if(this.get('content.proyectos').length > 0 )
		{
			this.set('content.hayProyectosDictaminados', true);
		}
		else
		{
			this.set('content.hayProyectosDictaminados', false);
		}
	}.observes('content.proyectos.@each'),
	unanimidadChange: function(){
		if(this.get('content.textos').length > 0)
		{		
			if(this.get('content.unanimidad') == true)
			{			
				var _self = this;
				this.set('content.desactivarAgregarDictamen', true);
				this.set('content.textos.firstObject.dictamenNormal', true);				
				this.get('content.textos').slice(1).forEach(function(texto){
					_self.get('content.textos').removeObject(texto);
				});
			}
			else
			{
				this.set('content.desactivarAgregarDictamen', false);			
				this.set('content.textos.firstObject.dictamenNormal', false);
			}
		}
	}.observes('content.unanimidad', 'content.textos'),
	setMayoria: function () {
		var i = 0;
		this.get('content.textos').forEach(function (texto) {
			if (i == 0)
				texto.set('mayoria', true);
			else
				texto.set('mayoria', false);
			i++;
		});

		if (this.get('content.textos').length == 0)
		{
			this.set('dictamenesAgregados', false);
		}
	}.observes('content.textos.@each', 'content.textos', 'content.unanimidad'),
	hacerMayoria: function (texto) {
		this.get('content.textos').removeObject(texto);
		this.get('content.textos').insertAt(0, texto);	
	},

	borrarTexto: function (texto) {
		this.get('content.textos').removeObject(texto);
	},

	agregarTexto: function () {
		var texto = App.DictamenTexto.create({firmantes: []});
		this.get('content.textos').addObject(texto);

		this.set('dictamenesAgregados', true);
	},

	clickExpediente: function (expediente) {
			var item;
			if (this.get('content.proyectosVistos') != '') {
				item = this.get('content.proyectosVistos').findProperty("id", expediente.get('id'));
			}


			if (!item) {
					this.get('content.proyectosVistos').pushObject(expediente);
			}
			else {
					this.get('content.proyectosVistos').removeObject(expediente);
			}
			this.set('adding', !this.get('adding'));
	},

	clickExpedienteDictamenCrear: function (expediente) {
			var item;
			if (this.get('content.proyectos') != '') {
				item = this.get('content.proyectos').findProperty("id", expediente.get('id'));
			}


			if (!item) {
					this.get('content.proyectos').pushObject(expediente);
			}
			else {
					this.get('content.proyectos').removeObject(expediente);
			}
			this.set('adding', !this.get('adding'));
	},

	listaExpedientes: function () {
		var filtered;

		if (this.get('filterExpedientes') != '')
		{
			var regex = new RegExp(this.get('filterExpedientes').toString().toLowerCase());
			
			filtered = App.get('expedientesArchivablesController.content').filter(function(expediente) {
				return regex.test(expediente.get('label').toLowerCase());
			});
		}
		else
		{
			filtered = App.get('expedientesArchivablesController.content');
		}

		return filtered.slice(0, 10);
	}.property('content', 'filterExpedientes'),

	listaExpedientesNuevos: function () {
		var filtered;

		if (this.get('filterExpedientesDictaminar') != '')
		{
			var regex = new RegExp(this.get('filterExpedientesDictaminar').toString().toLowerCase());
			
			filtered = App.get('expedientesArchivablesController.content').filter(function(expediente) {
				return regex.test(expediente.get('label').toLowerCase());
			});
		}
		else
		{
			filtered = App.get('expedientesArchivablesController.content');
		}

		return filtered.slice(0, 10);
	}.property('content', 'filterExpedientesDictaminar'),



	listaProyectosVistos: function () {
		var filtered = [];
		if (this.get('filterProyectosVistos') != '')
		{
			var filtered = [];
			var regex = new RegExp(this.get('filterProyectosVistos').toString().toLowerCase());
			
			filtered = this.get('content.proyectosVistos').filter(function(expediente) {
				 return regex.test(expediente.get('label').toLowerCase());
			});
			return filtered;
		} else {
			return this.get('content.proyectosVistos');
		}
	}.property('content.proyectosVistos.@each', 'filterProyectosVistos', 'adding'),


	listaProyectosVistosNuevos: function () {
		var filtered = [];
		if (this.get('filterProyectosVistosDictaminar') != '')
		{
			var filtered = [];
			var regex = new RegExp(this.get('filterProyectosVistosDictaminar').toString().toLowerCase());
			
			filtered = this.get('content.proyectos').filter(function(expediente) {
				 return regex.test(expediente.get('label').toLowerCase());
			});
			return filtered;
		} else {
			return this.get('content.proyectos');
		}
	}.property('content.proyectos.@each', 'filterProyectosVistosDictaminar', 'adding'),

	didInsertElement: function () {
		this._super();
		//this.set('content', App.Dictamen.create(App.get('dictamenController.content.evento')));
		//===== Form elements styling =====//
		this.$("select, .check, .check :checkbox, input:radio, input:file").uniform();
		// 
		
		$(".whead").on('click', function(){
			$(this).parent().children(":eq(1)").stop().slideToggle(1200);
		});
		
	},



	guardar: function () {
		this.set('clickGuardar', true);

		var textosAreValid = true;
		var proyectosAreValid = true;
		var numeroDeProyectos = 0;
		var proyectosDictaminadosAreValid = true;

		$('#formCrearParteDictamen').parsley('destroy');

		if(App.get('dictamenCrearController.content.textos')){
			App.get('dictamenCrearController.content.textos').forEach(function(item){
				if(item.firmantes.length < 1) {
					item.set('faltanFirmantes', true);
					textosAreValid = false;
				}
				else{
					item.set('faltanFirmantes', false);
				}				

				numeroDeProyectos = parseInt(item.pl) + parseInt(item.pd) + parseInt(item.pr);

				if(!isNaN(numeroDeProyectos)){
					if(numeroDeProyectos > 0){
						item.set('faltanProyectos', false);
					}
					else{
						proyectosAreValid = false;
						item.set('faltanProyectos', true);
					}
				}

			});
		}

		if(App.get('dictamenCrearController.content.textos').length > 0){
			this.set('dictamenesAgregados', true);
		}


		if(!App.get('dictamenCrearController.content.hayProyectosDictaminados') || App.get('dictamenCrearController.content.hayProyectosDictaminados') == false)
		{
			$(document).scrollTop(0);
			proyectosDictaminadosAreValid = false;
		}else{			
			proyectosDictaminadosAreValid = true;
		}

		$('#formCrearParteDictamen').parsley('destroy');
		if(!$('#formCrearParteDictamen').parsley('validate') || !proyectosDictaminadosAreValid || !proyectosAreValid || !this.get('dictamenesAgregados') || !textosAreValid ) return false;


		App.confirmActionController.setProperties({
			title: 'Crear Dictamen',
			message: '¿ Esta seguro que desea guardar el dictamen ?',
			success: null,
		});

		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();
	},
	


	confirmActionDone: function () {
		if (App.get('confirmActionController.success')) {
			var dictamen = this.get('content');
			var proyectos = [];
			var pv = [];
			var txts = [];
			var orden = 1;

			dictamen.get('proyectos').forEach(function (proyecto){
				proyectos.addObject({proyecto: proyecto, orden: orden, id: {id_proy: proyecto.id}});
				orden++;
			});

			orden = 1;

			dictamen.get('proyectosVistos').forEach(function (proyecto){
				pv.addObject({proyecto: proyecto, orden: orden, id: {id_proy: proyecto.id}});
				orden++;
			});

			orden = 1;

			dictamen.get('textos').forEach(function (texto){
				txts.addObject(texto);
			});
			dictamen.textos = txts;

			dictamen.get('textos').forEach(function (texto){

				texto.set('orden', orden);
				var fController = Ember.ArrayController.create({
				  content: texto.get('firmantes'),
				  sortProperties: ['orden'],
				  sortAscending: true
				});		
				texto.set('firmantes', fController.get('arrangedContent'));				
				orden++;
			});


			dictamen.caracterDespacho = App.CaracterDespacho.create({
				tipo: 'CaracterDictamen',
				id: 5,
				descripcion: "Aprobado con modificaciones Dictamen de Mayoría y Dictamen de Minoría",
				itemParte: 4,
				resumen: "con modif. D. de Mayoría y D. de Minoría",
				tipoDict: "OD",
			});

			dictamen.proyectos = proyectos;
			dictamen.proyectosVistos = pv;	
			dictamen.tipo = "Dictamen";
			dictamen.orden = "1";
			dictamen.itemParte = "4";
			dictamen.caracter= "Aprobado por Unanimidad insistiendo en el texto sancionado originalmente";

			var url = App.get('apiController.url') + "par/evento";

			$.ajax({
				url:  url,
				contentType: 'text/plain',
				type: 'POST',
				context: this,
				data : JSON.stringify(dictamen),
				dataType: 'json',
				success: function( dataid ) 
				{
					// data = JSON.parse('{"id":21346}');
					data = dataid;
					// data = JSON.parse(dataid);

					if(data.id){					
						if (!App.get('dictamenConsultaController'))
							App.dictamenConsultaController = App.DictamenConsultaController.create();

						App.set('dictamenConsultaController.loaded', false);
						App.set('dictamenConsultaController.content', App.Dictamen.create({id: data.id}));

						 fn = function() {
							App.get('dictamenConsultaController.content').removeObserver('saveSuccess', this, fn);
							App.get('dictamenConsultaController').removeObserver('loaded', this, fn);
							var dictamen = App.get('dictamenConsultaController.content');

							App.get('router').transitionTo('comisiones.dictamenes.dictamen.dictamenConsulta', dictamen);
							$.jGrowl('Dictamen creado con éxito!', { life: 5000 });
						 };

						 App.get('dictamenConsultaController').addObserver('loaded', this, fn);
						 App.get('dictamenConsultaController').load();
					}
					else
					{
						$.jGrowl('No se pudo crear el dictamen!', { life: 5000 });
					}					
				}
			});		
		}
	},
});


App.DictamenCargarView = Ember.View.extend({
	templateName: 'reunion-crear-parte-dictamen',
	filterExpedientes: '',
	filterProyectosVistos: '',
	adding: false,
	dictamenesAgregados: false,
	clickGuardar: null,

	unanimidadChange: function(){
		if(this.get('content.textos').length > 0)
		{		
			if(this.get('content.unanimidad') == true)
			{			
				var _self = this;
				this.set('content.desactivarAgregarDictamen', true);
				this.set('content.textos.firstObject.dictamenNormal', true);				
				this.get('content.textos').slice(1).forEach(function(texto){
					_self.get('content.textos').removeObject(texto);
				});
			}
			else
			{
				this.set('content.desactivarAgregarDictamen', false);			
				this.set('content.textos.firstObject.dictamenNormal', false);
			}
		}
	}.observes('content.unanimidad', 'content.textos'),
	setMayoria: function () {
		var i = 0;
		this.get('content.textos').forEach(function (texto) {
			if (i == 0)
				texto.set('mayoria', true);
			else
				texto.set('mayoria', false);
			i++;
		});

		if (this.get('content.textos').length == 0)
		{
			this.set('dictamenesAgregados', false);
		}
	}.observes('content.textos.@each', 'content.textos', 'content.unanimidad'),


	hacerMayoria: function (texto) {
		this.get('content.textos').removeObject(texto);
		this.get('content.textos').insertAt(0, texto);	
	},

	borrarTexto: function (texto) {
		this.get('content.textos').removeObject(texto);
	},

	agregarTexto: function () {
		var texto = App.DictamenTexto.create({firmantes: []});
		this.get('content.textos').addObject(texto);

		this.set('dictamenesAgregados', true);
	},

	clickExpediente: function (expediente) {
		var item = this.get('content.proyectosVistos').findProperty("id", expediente.get('id'));
		
		if (!item) {
			this.get('content.proyectosVistos').pushObject(expediente);
		}
		else {
			this.get('content.proyectosVistos').removeObject(expediente);
		}
		this.set('adding', !this.get('adding'));
	},

	listaExpedientes: function () {
		var filtered;

		if (this.get('filterExpedientes') != '')
		{
			var regex = new RegExp(this.get('filterExpedientes').toString().toLowerCase());
			
			filtered = App.get('expedientesArchivablesController.content').filter(function(expediente) {
				return regex.test(expediente.get('label').toLowerCase());
			});
		}
		else
		{
			filtered = App.get('expedientesArchivablesController.content');
		}

		return filtered.slice(0, 10);
		//return filtered;
	}.property('content', 'filterExpedientes'),

	listaProyectosVistos: function () {
		var filtered = [];
		if (this.get('filterProyectosVistos') != '')
		{
			var filtered = [];
			var regex = new RegExp(this.get('filterProyectosVistos').toString().toLowerCase());
			
			filtered = this.get('content.proyectosVistos').filter(function(expediente) {
				 return regex.test(expediente.get('label').toLowerCase());
			});
			return filtered;
		} else {
			return this.get('content.proyectosVistos');
		}
	}.property('content.proyectosVistos.@each', 'filterProyectosVistos', 'adding'),

	didInsertElement: function () {
		this._super();
		var dictamen = App.Dictamen.extend(App.Savable).create();
		dictamen.setProperties(App.get('dictamenController.content'));
		
		this.set('content', dictamen);
		//===== Form elements styling =====//
		this.$("select, .check, .check :checkbox, input:radio, input:file").uniform();
		// 
		

		$(".whead").on('click', function(){
			$(this).parent().children(":eq(1)").stop().slideToggle(1200);
		});
	},



	guardar: function () {
		this.set('clickGuardar', true);

		var textosAreValid = true;
		var proyectosAreValid = true;
		var numeroDeProyectos = 0;

		if(App.get('dictamenController.content.textos')){
			App.get('dictamenController.content.textos').forEach(function(item){
				if(item.firmantes.length < 1) {
					item.set('faltanFirmantes', true);
					textosAreValid = false;
				}
				else{
					item.set('faltanFirmantes', false);
				}				

				numeroDeProyectos = parseInt(item.pl) + parseInt(item.pd) + parseInt(item.pr);

				if(!isNaN(numeroDeProyectos)){
					if(numeroDeProyectos > 0){
						item.set('faltanProyectos', false);
					}
					else{
						proyectosAreValid = false;
						item.set('faltanProyectos', true);
					}
				}

			});
		}

		if(App.get('dictamenController.content.textos').length > 0){
			this.set('dictamenesAgregados', true);
		}

		$('#formCrearParteDictamen').parsley('destroy');
		if(!$('#formCrearParteDictamen').parsley('validate') || !proyectosAreValid || !this.get('dictamenesAgregados') || !textosAreValid ) return false;


		App.confirmActionController.setProperties({
			title: 'Cargar Dictamen',
			message: '¿ Esta seguro que desea guardar el dictamen ?',
			success: null,
		});

		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();
	},
	

	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);

		if (App.get('confirmActionController.success')) {
			var dictamen = this.get('content');
			var pv = [];
			var orden = 1;


			dictamen.get('proyectosVistos').forEach(function (proyecto){
				pv.addObject({proyecto: proyecto, orden: orden, id: {id_proy: proyecto.id}});
				orden++;
			});

			orden = 1;

			dictamen.get('textos').forEach(function (texto){
				texto.set('orden', orden);
				var fController = Ember.ArrayController.create({
				  content: texto.get('firmantes'),
				  sortProperties: ['orden'],
				  sortAscending: true
				});	

				fController.get('content').forEach(function (firmante) {
					delete firmante.id;
				});

				texto.set('firmantes', fController.get('arrangedContent'));
				
				orden++;
			});

			dictamen.caracterDespacho = App.CaracterDespacho.create({
				tipo: 'CaracterDictamen',
				id: 5,
				descripcion: "Aprobado con modificaciones Dictamen de Mayoría y Dictamen de Minoría",
				itemParte: 4,
				resumen: "con modif. D. de Mayoría y D. de Minoría",
				tipoDict: "OD",
			});

			dictamen.proyectosVistos = pv;	
			this.set('content', dictamen);

			this.get('content').addObserver('saveSuccess', this, this.saveSuccessed)
			this.get('content').save();
		}
	},

	saveSuccessed: function () {
		var _self = this.get('content');
		this.get('content').removeObserver('createSuccess', this, this.saveSuccessed);
		if (this.get('content.saveSuccess')) {
							
			if (!App.get('dictamenConsultaController')) {
				App.dictamenConsultaController = App.DictamenConsultaController.create();
			}

			App.set('dictamenConsultaController.loaded', false);
			App.set('dictamenConsultaController.content', App.Dictamen.create({id: this.get('content.id')}));

			 fn = function() {
				App.get('dictamenConsultaController.content').removeObserver('saveSuccess', this, fn);
				App.get('dictamenConsultaController').removeObserver('loaded', this, fn);
				var dictamen = App.get('dictamenConsultaController.content');

				App.get('router').transitionTo('comisiones.dictamenes.dictamen.dictamenConsulta', dictamen);
				$.jGrowl('Dictamen creado con éxito!', { life: 5000 });

				var expedientesD = [];
				var firmantes = [];

				if(_self.proyectosVistos)
				{				
					_self.proyectosVistos.forEach(function (proyecto){
						expedientesD.push(proyecto.proyecto.expdip);
					});
				}

				if(_self.proyectos)
				{				
					_self.proyectos.forEach(function (proyecto){
						expedientesD.push(proyecto.proyecto.expdip);
					});
				}

				if(_self.textos)
				{
					_self.textos.forEach(function(texto){
						texto.firmantes.forEach(function(firmante){
							firmantes.push(firmante.diputado);
						});
					});
				}

				var evento = App.TimeLineEvent.extend(App.Savable).create({
				    objectID: expedientesD[0], 
				    titulo: 'Se han agregado Expedientes a un dictamen',
				    fecha:  moment().format('YYYY-MM-DD HH:mm'),
				    mensaje: 'Se han agregado Expedientes a un dictamen',
				    icono: 'creado',
				    link: '#/comisiones/dictamenes/dictamen/'+ _self.id +'/ver',
				    duplicados: expedientesD,
				});

				evento.create();	

				var notification = App.Notificacion.extend(App.Savable).create();
				notification.set('tipo', 'crearDictamen');	
				notification.set('objectId', _self.id);
				notification.set('link', "/#/comisiones/dictamenes/dictamen/"+_self.id+"/ver");
				notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
				notification.set('mensaje', "Se ha creado un dictamen " + _self.id);
				notification.set('firmantes', firmantes);
				
				notification.create();      
			 };

			 App.get('dictamenConsultaController').addObserver('loaded', this, fn);
			 App.get('dictamenConsultaController').load();
		}
		else
		{
			$.jGrowl('No se pudo crear el dictamen!', { life: 5000 });
		}
	},

});

App.DictamenTextoCrearView = Ember.View.extend({
	templateName: 'reunion-crear-parte-dictamen-texto',
	filterFirmantes: '',
	adding: false,
	firmanteTipo: "1",
	hayFirmantesSeleccionados: false,

	disicencias: [{id: 1, titulo: "Sin disidencias"}, {titulo: "Disidencia Parcial", id: 2}, {titulo: "Disidencia total", id: 3}],

	uploadFolder: function () {
		return "uploads/dictamen/" + this.get('parentView').get('content.id') + "/";
	}.property('content'),

	borrar: function () {
		this.get('parentView').borrarTexto(this.get('content'));
	},

	hacerMayoria: function () {
		this.get('parentView').hacerMayoria(this.get('content'));
	},

	clickFirmante: function (firmante) {
		if (!this.get('firmantesSeleccionados'))
			this.set('firmantesSeleccionados', []);

		if(!this.get('hayFirmantesSeleccionados'))
			this.set('hayFirmantesSeleccionados', true);

		if(this.get('firmantesSeleccionados.lenght') > 0)
		{
			this.set('hayFirmantesSeleccionados', true);
		}
		else
		{
			this.set('hayFirmantesSeleccionados', false);			
		}

		_self = this;
		var item = this.get('content.firmantes').findProperty("diputado.id", firmante.get('diputado.id'));
		var pseudoItem = this.get('firmantesSeleccionados').findProperty("diputado.id", firmante.get('diputado.id'));
		Ember.run.next(function () {
			if (item) {
				App.get('firmantesController.content').addObject(item);
				_self.get('content.firmantes').removeObject(item);
				item.set('seleccionado', false);
				this.set('adding', !this.get('adding'));
			} else {
				if (!pseudoItem) {
					_self.get('firmantesSeleccionados').pushObject(firmante);
					if (_self.get('firmantesSeleccionados').length == 1) {
						Ember.run.next(function () {
							_self.$("input:radio").uniform();
						});
					}
				}
				else {
					_self.get('firmantesSeleccionados').removeObject(pseudoItem);
				}
			}
			
		});
	},

	
	// Firmante sin disidencia
	fsd: function () {
		if (this.get('content.firmantes').length > 0)
			return this.get('content.firmantes').filterProperty('disidencia', "1").length;
		else
			return 0;
	}.property('content.firmantes.length'),
	
	// Firmante con disidencia parcial
	fcdp: function () {
		if (this.get('content.firmantes').length > 0)
			return this.get('content.firmantes').filterProperty('disidencia', "2").length;
		else
			return 0;
	}.property('content.firmantes.length'),	
	
	// Firmante con disidencia total
	fcdt: function () {
		if (this.get('content.firmantes').length > 0)
			return this.get('content.firmantes').filterProperty('disidencia', "3").length;
		else
			return 0;
	}.property('content.firmantes.length'),		
	
	// Firmantes seleccionados
	fs: function () {
		if (!this.get('firmantesSeleccionados'))
			return false;
		return this.get('firmantesSeleccionados').length > 0;
	}.property('firmantesSeleccionados.length'),
	
	addFirmante: function () {
		_self = this;
		this.get('firmantesSeleccionados').forEach(function (firmante) {
			var item = firmante;
			item.set('disidencia', _self.get('firmanteTipo'));
			_self.get('content.firmantes').pushObject(item);
			item.set('seleccionado', true);
			App.get('firmantesController.content').removeObject(item);
		});

		this.set('content.faltanFirmantes', false);

		var fController = Ember.ArrayController.create({
		  content: this.get('content.firmantes'),
		  sortProperties: ['sortOrden'],
		  sortAscending: true
		});		

		this.set('content.firmantes', fController.get('arrangedContent'));

		var orden = 0;
		this.get('content.firmantes').forEach(function (firmante) {
			firmante.set('orden', orden);
			orden++;
		});

		this.set('firmantesSeleccionados', []);
		this.set('adding', !this.get('adding'));
	},




	listaFirmantes: function () {
		var filtered = [];
		if (this.get('filterFirmantes') != '')
		{
			var regex = new RegExp(this.get('filterFirmantes').toString().toLowerCase());
			filtered = App.get('firmantesController.content').filter(function(firmante) {
				return regex.test((firmante.diputado.datosPersonales.apellido + firmante.diputado.datosPersonales.nombre).toLowerCase());
			});
		}
		else
		{
			filtered = App.get('firmantesController.arrangedContent');
		}

		if (this.get('content.firmantes'))
		{
			this.get('content.firmantes').forEach(function (firmante) {
				filtered = filtered.without(firmante)
			});
			return filtered.slice(0, 20);
		}
		else
			return filtered.slice(0, 20);
	}.property('filterFirmantes', 'content.firmantes', 'adding', 'App.firmantesController.content.@each'),

	willInsertElement: function(){
		$(".widget-dictamen-texto > .wbody").slideUp(900);
	},
	
	didInsertElement: function (){
		this._super();
		this.$("select, .check, .check :checkbox, input:radio").uniform();
		this.$(".wbody").slideUp(000);
		this.$(".wbody").slideDown(900);
	},
});


App.FirmanteView = Em.View.extend({
	tagName: 'li',
	templateName: 'dictamen-firmante-item',

	clickItem: function () {
		this.get('parentView').get('parentView').clickFirmante(this.get('content'));
	}	
});

App.FirmantesView = Em.CollectionView.extend({
	classNames : ['subNav'], 
	tagName: 'ul',
	itemViewClass: App.FirmanteView,
});

App.ProyectoFirmanteView = Em.View.extend({
	tagName: 'li',
	templateName: 'proyecto-dictamen-firmante-item',


	clickItem: function () {
		this.get('parentView').get('parentView').clickFirmante(this.get('content'));
	}	
});

App.ProyectosFirmantesView = Em.CollectionView.extend({
	classNames : ['subNav'], 
	tagName: 'ul',
	itemViewClass: App.ProyectoFirmanteView,
});


App.ExpedienteItemListView = Em.View.extend({
	templateName: 'expediente-item-list',
	tagName: 'li',

	clickItem: function () {
		this.get('parentView').get('parentView').clickExpediente(this.get('content'));
	}
});


App.ExpedienteItemListDictamenCrearView = Em.View.extend({
	templateName: 'expediente-item-list',
	tagName: 'li',

	clickItem: function () {
		this.get('parentView').get('parentView').clickExpedienteDictamenCrear(this.get('content'));
	}
});

/* Oradores */

App.JQuerySortableView = Ember.CollectionView.extend({
	tagName: 'ul',
	itemViewClass: null, 
	sortValue : 'orden',
	sortAscending: true,
	sortEnabled: true,
	sortIndex: 0,

	updateSort: function(idArray){
		var sortArr, ap, view, model, order;
		ap = Ember.ArrayProxy.create({
			content: Ember.A(idArray)
		});

		sortArr = [];
		ap.forEach(function(item, index){
			view = Ember.View.views[item];
			model = view.get('content');

			sortArr.push(view.get('content.id'));

			if(this.get('sortAscending')){
				order = ap.indexOf(item);
			}else{
				order = (idArray.length-1) - ap.indexOf(item);
			}

			if (model) 
				model.set(this.get('sortValue'), this.get('sortIndex') + order);
		}, this);
		return sortArr;
	},

	refreshSort : function () {
		this.$().sortable('destroy');
		this.sortable();
	},

	didInsertElement: function() {
		this._super();
		this.sortable();
	},

	sortEnabledChange : function () {
		this.refreshSort();
	}.observes('sortEnabled'),

	sortable : function () {
		if(!this.get('sortEnabled'))
			return;

		var view = this;
		view.$().sortable({
			items: '> li:not(.sort-disabled)',
			axis: 'y',
			placeholder: 'ui-state-highlight',
			forcePlaceholderSize: true,

			start: function(event, ui) {
				ui.item.previousIndex = ui.item.index();    
				view.$().addClass('dragged');
			},

			stop: function(event, ui) {
				view.updateSort(view.$().sortable('toArray'));
				view.$().removeClass('dragged');
			},

			helper: function(event, ui) {
				return $(ui).safeClone();            
			}
			
		})
	}
});

App.RadioButton = Ember.View.extend({
	title: null,

	checked: false,

	group: "radio_button",
	disabled: false,

	classNames: ['ember-radio-button'],
	templateName: "radio-button",
	attributeBindings: ['data-required', 'data-error-message', 'data-validation-minlength'],

	bindingChanged: function(){
		var input = this.$('input:radio');
		if(input.attr('option') == Ember.get(this, 'value')){
			 this.set("checked", true);
		}
	}.observes("value"),

	change: function() {
		Ember.run.once(this, this._updateElementValue);
	},

	_updateElementValue: function() {
		var input = this.$('input:radio');
		Ember.set(this, 'value', input.attr('value'));
	},
	
	didInsertElement: function() {
		this._super();
		this.bindingChanged();
	},  
});

App.ListaView = Ember.View.extend({
	classNames: 'pillow-emboss',
	classNameBindings: 'content.seleccionada:active',
	templateName: 'listaView',

	sortIndex: function () {
		return App.get('listaController.turnosBloqueados').length;
	}.property('App.listaController.turnosBloqueados'),

	ordenarPorBloqueAsc : function () {
		App.get('listaController').ordenarPorBloque(true);
	},

	ordenarPorBloqueDesc : function () {
		App.get('listaController').ordenarPorBloque(false);
	},

	modificarTiempos : function () {
		App.ModificarTiemposView.popup();
	},

	imprimir : function () {
		App.get('listaController').imprimir();
	},
	
	imprimirPendientes : function () {
		App.get('listaController').imprimirPendientes();
	}
});

App.ListaTabView = Ember.View.extend({
	classNameBindings: ['content.seleccionada:active'],
	tagName: 'li',
	templateName: 'listaTabView',
	content : null,

	listaClick: function () {
		App.get('listaController').set('content', this.get('content'));
	}
});

App.ListasView = Ember.CollectionView.extend({
	itemViewClass: App.ListaView,
});

App.SesionTurnosView = Em.View.extend({
	templateName: 'sesion-turnos',
	
	mostrarTodosActivado : function () {
		return (App.get('listaController').get('content') == null)
	}.property('App.listaController.content'),

	mostrarTodos : function () {
		return App.get('sesionController').get('content.listas.length') > 1;
	}.property('App.sesionController.content'),

	mostrarTodosClick : function () {
		App.get('listaController').set('content', null);
	},

	imprimir : function() {
		var sesion = App.get('sesionController.content').serialize();
		var tema = App.get('temaController.content').serialize();
		var listasSerialized = [];
		var listas = App.get('sesionController.content.listas');
		listas.forEach(function(item, index){
			var turnosBloqueados = item.get('turnosBloqueados');
			var turnosDesBloqueados = item.get('turnosDesbloqueados');
			var turnosSerialized = [];
			
			turnosBloqueados.forEach(function(turno, index){
				var t = turno.serialize();
				t['hablando'] = turno.get('hablando');
				t['numero'] = turno.get('numero');
				turnosSerialized.push(t);
			}, item);
			
			turnosDesBloqueados.forEach(function(turno, index){
				var t = turno.serialize();
				t['hablando'] = turno.get('hablando');
				t['numero'] = turno.get('numero');
				turnosSerialized.push(t);
			}, item);
			
			var lista = item.serialize();
			lista['turnos'] = turnosSerialized;
			listasSerialized.push(lista);
		}, this);		
		
		sesion['listas'] = listasSerialized;
		sesion['tema'] = tema;
		delete sesion.temas;
		$.download('listas-imprimir', "&data=" + JSON.stringify(sesion));
	},
	
	imprimirPendientes : function() {
		var sesion = App.get('sesionController.content').serialize();
		var tema = App.get('temaController.content').serialize();
		var listasSerialized = [];
		var listas = App.get('sesionController.content.listas');
		listas.forEach(function(item, index){
			var turnos = item.get('turnosPendientes');
			var turnosSerialized = [];
			turnos.forEach(function(turno, index){
				var t = turno.serialize();
				t['hablando'] = turno.get('hablando');
				t['numero'] = turno.get('numero');
				turnosSerialized.push(t);
			}, item);
			var lista = item.serialize();
			lista['turnos'] = turnosSerialized;
			listasSerialized.push(lista);
		}, this);		
		
		sesion['listas'] = listasSerialized;
		sesion['tema'] = tema;
		delete sesion.temas;
		$.download('listas-imprimir', "&data=" + JSON.stringify(sesion));
	},	

});


App.TurnoView = Ember.View.extend({
	tagName: 'li',
	templateName: 'turnito',
	classNameBindings: ['sortDisabled'],
	sortDisabledBinding: 'this.content.sortDisabled',

	remove : function () {
		App.get('turnosController').deleteObject(this.get('content'));
	},
/*
	actualizarTiempo : function () {
		this.get('content').set('tiempo', parseInt(1 + Math.random()*50));
		App.get('turnosController').actualizarHora();
	//	this.get('content').save();
	},
*/
	startTimer : function () {
		App.get('turnosController').startTimer(this.get('content'));
	},

	stopTimer : function () {
		App.get('turnosController').stopTimer(this.get('content'));
	},
	
	modificar: function () {
		App.get('crearTurnoController').set('turno', this.get('content'));
		App.CrearTurnoView.popup();
	},
	
	cancelTimer: function () {
		App.get('turnosController').cancelTimer(this.get('content'));
	},

	index : function () {
		return this.get('contentIndex') + 1;
	}.property('contentIndex'),
	
	didInsertElement: function(){
		this._super();

		this.$("a").tooltip();
	}
});

App.TurnoHablandoView = Ember.View.extend({
	templateName: "turno-hablando",

	stopTimer : function () {
		App.get('turnosController').stopTimer(this.get('content'));
	},
});

App.TemaView = Ember.View.extend({
	tagName: 'li',
	templateName: 'tema',
	classNameBindings: ['content.seleccionado:active'],

	borrar : function () {
		App.get('temasController').deleteObject(this.get('content'));
		App.get('temaController').set('borrarTema', false);
		
		if(App.get('temasController.content.length') == 0)
			App.get('router').transitionTo('sesionConsulta.indexSubRoute', App.get('sesionController.content'));
	}
});

App.SesionView = Ember.View.extend({
	tagName: 'li',
	templateName: 'sesion',
	classNameBindings: ['content.seleccionada:active', ':row' ],


	verSesion : function(){
		var tema = null;
		
		if(App.get('temasController.content')){
			tema = App.get('temasController.content').objectAt(0);
		}
		
		if(tema){
			App.get('router').transitionTo('sesionConsulta.tema', tema);
		}else{
			var sesion = App.get('sesionController.content');
			App.get('router').transitionTo('sesionConsulta.indexSubRoute', sesion);
		}
		
	},

	seleccionada: function () {
		return (this.get('content.id') == App.get('sesionController.content.id'));
	}.property('App.sesionController.content'),

	verResumen : function () {
		App.get('router').get('applicationController').seleccionarSesion(this.get('content'))
	},
});

App.ListaVaciaView = Ember.View.extend({
	tagName: 'div',
	templateName: 'lista-vacia'
});

App.TurnosView = App.JQuerySortableView.extend({
	classNames: [ 'turnos'],
	itemViewClass: App.TurnoView, 

	isCollapse: false,
	isCollapsable: false,

	click: function() {
		if (this.get('isCollapsable')) {
			if (this.get('isCollapse')) {
				this.$().removeClass('collapse');
				this.set('isCollapse', false);
			} else {
				this.$().addClass('collapse');
				this.set('isCollapse', true);
			}
		}
	},
	
	updateSort : function (idArray){
		var sortArr = this._super(idArray);

		App.get('turnosController').saveSort(sortArr);
		App.get('turnosController').actualizarHora();
	},
});

App.TurnosPorListaView = App.JQuerySortableView.extend({
	classNames: [ 'turnos'],
	itemViewClass: App.TurnoView, 

	isCollapse: false,
	isCollapsable: false,

	click: function() {
		if (this.get('isCollapsable')) {
			if (this.get('isCollapse')) {
				this.$().removeClass('collapse');
				this.set('isCollapse', false);
			} else {
				this.$().addClass('collapse');
				this.set('isCollapse', true);
			}
		}
	},


	updateSort : function (idArray){
		var sortArr = this._super(idArray);

		App.get('turnosController').saveSort(sortArr);
		App.get('turnosController').actualizarHora();
	},
});

App.TemasView = App.JQuerySortableView.extend({
	classNames: [],
	itemViewClass: App.TemaView,

	updateSort : function (idArray){
		var sortArr = this._super(idArray);

		this.get('content').forEach(function (tema) {
			if (tema.get('subTemas')) {
				tema.get('subTemas').forEach(function (subTema) {
					subTema.set('parentOrden', tema.get('orden'));
				});
			}
		});	

		App.get('temasController').saveSort(sortArr);
		App.get('turnosController').actualizarHora();
	}
});

App.SesionesView = App.JQuerySortableView.extend({
	classNames: [],
	itemViewClass: App.SesionView,
});

App.OradoresIndexView = Em.View.extend({
	templateName: 'oradores-index',
		
	crearSesion: function () {
		var sesion = App.Sesion.create();
				App.get('crearSesionController').set('sesion', sesion);
		App.CrearSesionView.popup();
	},    
});

App.SesionConsultaView = Em.View.extend({
	templateName: 'sesion-consulta',
	crearTema: function () {
		var orden = App.get('sesionController.content.temas.length');
		if (orden == null)
			orden = 0;
			
		var tema = App.Tema.create({
					sesionId:  App.get('sesionController').get('content').get('id'), 
					orden: orden,
				});
				App.get('crearTemaController').set('tema', tema);
		App.CrearTemaView.popup();
	},
		
	crearTurno: function () {
		var lista;

		if(App.get('listaController.content'))
			lista = App.get('listaController.content');
		else
			lista = null;
			
		var temaController = App.get('temaController');
		
		var turno = App.Turno.create({
				temaId:  App.get('temaController').get('content').get('id'),
				listaId: lista == null ? null : lista.get('id'),
				tiempo: 5,
				orden: 0,
				oradores: []
			});
			
			
		App.get('crearTurnoController').set('turno', turno);
		App.CrearTurnoView.popup();
	},

	borrarTema: function () {
		var temaController = App.get('temaController');
		temaController.set('borrarTema', !temaController.get('borrarTema'));
	},

	startTimer : function () {
		App.get('sesionesController').startTimer(App.get('sesionController.content'));
	},

	stopTimer : function () {
		App.get('sesionesController').stopTimer(App.get('sesionController.content'));
	},
});

App.OradorView = Em.View.extend({
	tagName: 'li',
	classNames: ['usuario-miniatura'],
	templateName: 'orador',
});

App.TurnoOradorView = Ember.CollectionView.extend({
	classNames : [],  
	tagName: 'ul',
	itemViewClass: App.OradorView, 
}),

App.DiputadoView = Em.View.extend({
	tagName: 'li',
	templateName: 'diputado',
	agregarDiputado: function () {
		this.get('parentView').get('parentView').agregarOrador(this.get('content'));
	},   
});

App.DiputadosView = Ember.CollectionView.extend({
	classNames : [],  
	tagName: 'ul',
	itemViewClass: App.DiputadoView, 
});

App.ErrorMensajeView = Em.View.extend({
	tagName: 'li',
	templateName: 'error-mensaje',
});

App.ErroresMensajesView = Ember.CollectionView.extend({
	classNames : ['nav'],  
	tagName: 'ul',
	itemViewClass: App.ErrorMensajeView, 
});


App.FormValidate = Ember.View.extend({
	tagName: 'form',
	attributeBindings: ['data-validate'],
});


App.DiputadoSeleccionadoView = Em.View.extend({
	tagName: 'span',
	classNames: ['tag'],
	templateName: 'diputado-seleccionado',
		borrarDiputado: function () {
				this.get('parentView').get('parentView').borrarOrador(this.get('content'));
		},
		click: function () {
				this.get('parentView').get('parentView').borrarOrador(this.get('content'));
		}, 		
});

App.DiputadosSeleccionadosView = Ember.CollectionView.extend({
	tagName: 'div',
	classNames : ['grid12','headerDiputadosSelected'],  
	itemViewClass: App.DiputadoSeleccionadoView, 
})

App.CrearTurnoView = App.ModalView.extend({
	classNames: ['modal', 'modal-form'],
	templateName: 'crear-turno',
	turnoBinding: 'App.crearTurnoController.turno',
	filterText: '',
	selectedFilterText: '',
		
	tags: [
			{id: "Dictamen de Mayoria", titulo: "Dictamen de Mayoria"},
			{id: "Dictamen de Minoria", titulo: "Dictamen de Minoria"},
			{id: "Observaciones", titulo: "Observaciones"}
	],
	
	esDictamen : function () {
			return this.get('turno').get('listaId') == 1;
	}.property('turno.listaId'),
		
	listaDiputados: function () {
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered = App.get('diputadosController').get('arrangedContent').filter(function(user) {
			return regex.test((user.nombre + " " + user.apellido).toLowerCase()) || regex.test((user.apellido + " " + user.nombre).toLowerCase());
		});
		return filtered;
	}.property('filterText', 'App.diputadosController.content'),
	
	oradores : function () {
		if(!this.get('turno'))
			return null;

		var ap, oradores = this.get('turno').get('oradores');

		ap = Ember.ArrayProxy.create({
			content: Ember.A(oradores)
		});

		return ap.get('content');
	}.property('turno', 'turno.oradores', 'turno.oradores.length'),
	
	agregarOrador: function (user) {
		var turnoUser = {
		  orden: this.get('oradores').get('length'),
		  user: {
			id: user.get('id'),
			nombre: user.get('nombre'),
			apellido: user.get('apellido'),
			avatar: user.get('avatar'),
			bloque: user.get('bloque')
		  }
		};
		var item = this.get('oradores').findProperty("user.id", user.get('id'));
		if (!item) {
		  this.get('oradores').pushObject(turnoUser);
		  return true;
		}
		return false;
	},
		
		
	borrarOrador: function (turnoUser) {
			this.get('oradores').removeObject(turnoUser);
	},

	errorMensajes: function () {
		var mensajes = [];
		var turno = App.get('crearTurnoController').get('turno');
		if (turno.tiempo < 1) 
			mensajes.push({titulo: "Debe seleccionar un tiempo mayor a 0"});
		if (turno.orden < 0) 
			mensajes.push({titulo: "Debe seleccionar un tiempo orden a 0."});
		if (turno.listaId == null) 
			mensajes.push({titulo: "Debe seleccionar una lista."});
		if (turno.oradores == null || turno.oradores.length == 0) 
			mensajes.push({titulo: "Debe seleccionar uno o mas oradores."});
		if (this.get('esDictamen') && turno.tag == null)
			mensajes.push({titulo: "Debe seleccionar el tipo de dictamen."});
		return mensajes;
	}.property('turno.listaId', 'turno.oradores', 'turno.oradores.length', 'turno.tiempo', 'turno.tag', 'turno.orden'),
	
	esInvalido: function () {
		var turno = App.get('crearTurnoController').get('turno');
		if (turno.tiempo < 1 || turno.orden < 0 || turno.listaId == null || turno.oradores == null || turno.oradores.length == 0 || (this.get('esDictamen') && turno.tag == null)) 
			return true;
		else
			return false;
	}.property('turno.listaId', 'turno.oradores', 'turno.oradores.length', 'turno.tiempo', 'turno.tag', 'turno.orden'),
	
	callback: function(opts, event) {
	  if (opts.primary) {
		  if (this.get('esInvalido')) 
			return false;
		  var turno = App.get('crearTurnoController').get('turno');
		  if (turno.get('id')) {
			turno.save();
			App.get('turnosController').actualizarHora();
		  } else {
			turno.set('tema', App.get('temaController.content'));
			App.get('turnosController').createObject(turno, true);
		  }
	  } else if (opts.secondary) {
		//alert('cancel')
	  } else {
		//alert('close')
	  }
	  event.preventDefault();
  },
});

App.CrearTemaView = App.ModalView.extend({
	templateName: 'crear-tema',
		temaBinding: 'App.crearTemaController.tema',
		
	errorMensajes: function () {
		var mensajes = [];
		var tema = App.get('crearTemaController').get('tema');	
		if (tema.titulo == null || tema.titulo == "") 
			mensajes.push({titulo: "Debes escribir un titulo."});
		return mensajes;
	}.property('tema.titulo'),
	
	esInvalido: function () {
		var tema = App.get('crearTemaController').get('tema');	
		if (tema.titulo == null || tema.titulo == "") 
			return true;
		else
			return false;
	}.property('tema.titulo'),
	
	callback: function(opts, event) {
			if (opts.primary)
			{
				if($("#formCrearTema").parsley('validate'))
				{
					var tema = App.get('crearTemaController').get('tema');
					tema.set('plId', 0);
					tema.set('plTipo', 't');
					tema.set('plGrupo', '');
					tema.set('plItemId', 0);

					if (tema.get('id')) {
						 tema.save();
					} else {
						 App.get('temasController').createObject(tema, true);
					}
				}
				else
				{
					return false;
				}
			}
			else if (opts.secondary) {
				//alert('cancel')
			} else {
				//alert('close')
			}
			event.preventDefault();
	},    

});

App.CrearSesionView = App.ModalView.extend({
	templateName: 'crear-sesion',
	sesionBinding: 'App.crearSesionController.sesion',
	fecha: '',
	hora: '',
	showErrors:false,
	buttonRadioCheck: false,

	attributeBindings: ['required'],

	errorMensajes: function (){
		var mensajes = [];
		var sesion = App.get('crearSesionController').get('sesion');

		if (sesion.tipo == null) 
			mensajes.push({titulo:"Debes seleccionar un tipo de Sesion."});
		return mensajes;
	}.property('sesion.tipo'),
	
	esInvalido: function () {
		var sesion = App.get('crearSesionController').get('sesion');
		if(sesion.titulo == null || sesion.sesion == null || sesion.titulo == "" || sesion.reunion == null || sesion.sesion == "" ||  sesion.periodoOrdinario == null || sesion.periodoOrdinario == "" || sesion.tipo == null) 
			return true;
		else
			return false;
	}.property('sesion.titulo', 'sesion.reunion', 'sesion.periodoOrdinario', 'sesion.sesion', 'sesion.tipo'),
	
	callback: function(opts, event) {

			if (opts.primary) {
				this.set('showErrors', true);

				this.$('form').parsley('validate');
				if (!this.$('form').parsley('isValid')){
					//console.log('validando..');
					return false;
				}


				var sesion = App.get('crearSesionController').get('sesion');
				//sesion.set('horaInicio', moment($('.dropdown-timepicker').val(), "hh:mm A").unix())
				// var horaSesion = moment($('.dropdown-timepicker').val(), "hh:mm A");
				// var minutos = horaSesion.minutes();
				// var horas = horaSesion.hours();
				// var segundos = horaSesion.seconds();
				
				// var fechaSesion = moment.unix(this.get('sesion.fecha'));
				
				var fechaSesion = moment(this.get('fecha') + ' ' + this.get('hora') + '+0000', "YYYY-MM-DD HH:mm z");
				sesion.set('fecha', fechaSesion.unix());
				
				if (sesion.get('id')) {
					sesion.save();
					var turnosController = App.get('turnosController');
					turnosController.actualizarHora();
				} else {
					 App.get('sesionesController').createObject(sesion, true);
				}
			} else if (opts.secondary) {
				//alert('cancel')
			} else {
				//alert('close')
			}
			event.preventDefault();
		},    
		
		didInsertElement: function() {
			this._super();
			self = this;

			this.set('fecha', moment().format("DD-MM-YYYY"));
			this.set('hora', moment().format("hh:ss"));
		
			$('.timepicker').timeEntry({
				show24Hours: true, // 24 hours format
				showSeconds: false, // Show seconds?
				spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
				spinnerSize: [19, 26, 0], // Image size
				spinnerIncDecOnly: true, // Only up and down arrows
				defaultTime: this.get('hora'),
				timeSteps: [1, 15, 1],
			});	 
			
			$('.timepicker').timeEntry('setTime', this.get('hora'));
		},    
});

App.ModificarTiemposView = App.ModalView.extend({
	templateName: 'modificar-tiempos',
	tiempo : 5,
	invalido : false,

	callback: function(opts, event) {
			if (opts.primary) {
				if(this.get('invalido')){
					event.preventDefault();
					return false;
				}

				App.get('listaController').modificarTiempos(Math.abs(this.get('tiempo')));
			} else if (opts.secondary) {
				//alert('cancel')
			} else {
				//alert('close')
			}
			event.preventDefault();
	},

	tiempoChange : function (){
		var n = this.get('tiempo');
		this.set('invalido', !(!isNaN(parseFloat(n)) && isFinite(n)));

	}.observes('tiempo')
});

App.SesionResumenView = Em.View.extend({
	templateName: 'sesion-resumen',

	verSesion : function(){
		var tema = null;
		
		if(App.get('temasController.content')){
			tema = App.get('temasController.content').objectAt(0);
		}
		
		if(tema){
			App.get('router').transitionTo('sesionConsulta.tema', tema);
		}else{
			var sesion = App.get('sesionController.content');
			App.get('router').transitionTo('sesionConsulta.indexSubRoute', sesion);
		}
		
	}
});


//Editor Oradores

App.OradoresEditorSesionConsultaView = Ember.View.extend({
	templateName: 'oradores-editor-sesion-consulta',


	crearLista: function () {
		var temaController = App.get('temaController');
		var tema = temaController.get('content');
		tema.set('tieneLista', true);
		tema.save();
	}

});


App.CrearTurnoInlineView = Em.View.extend({
	templateName: 'crear-orador-inline',
	turnoBinding: 'App.crearTurnoController.turno',
	filterText: '',
	selectedFilterText: '',
	clickGuardar: null,
	collapse: true,

	toggleForm: function () {
		this.set('collapse', !this.get('collapse'));
	},
	tags: [
			{id: "Dictamen de Mayoria", titulo: "Dictamen de Mayoria"},
			{id: "Dictamen de Minoria", titulo: "Dictamen de Minoria"},
			{id: "Observaciones", titulo: "Observaciones"}
	],
	
	esDictamen : function () {
		if (this.get('turno')){
			return this.get('turno').get('listaId') == 1;	
		}
		return false;
	}.property('turno.listaId'),
		
	listaDiputados: function () {
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered = App.get('diputadosController').get('arrangedContent').filter(function(user) {
			return regex.test((user.nombre + " " + user.apellido).toLowerCase()) || regex.test((user.apellido + " " + user.nombre).toLowerCase());
		});
		if (filtered)
			return filtered.slice(0, 20);
		return filtered;
	}.property('filterText', 'App.diputadosController.content.@each'),
	
	oradores : function () {
		if(!this.get('turno'))
			return null;

		var ap, oradores = this.get('turno').get('oradores');

		ap = Ember.ArrayProxy.create({
			content: Ember.A(oradores)
		});

		return ap.get('content');
	}.property('turno', 'turno.oradores', 'turno.oradores.length'),
	
	agregarOrador: function (user) {

		if (this.get('oradores').length > 0)
			return false;
		
		var turnoUser = {
		  orden: this.get('oradores').get('length'),
		  user: {
			id: user.get('id'),
			id_user: user.get('id_user'),
			nombre: user.get('nombre'),
			apellido: user.get('apellido'),
			avatar: user.get('avatar'),
			bloque: user.get('bloque')
		  }
		};
		var item = this.get('oradores').findProperty("user.id", user.get('id'));
		if (!item) {
		  this.get('oradores').pushObject(turnoUser);
		  return true;
		}
		return false;
	},
		
		
	borrarOrador: function (turnoUser) {
		this.get('oradores').removeObject(turnoUser);
	},
	
	esInvalido: function () {
		var turno = App.get('crearTurnoController').get('turno');

		if (turno.tiempo < 1 || turno.listaId == null || turno.oradores == null || turno.oradores.length == 0 || (this.get('esDictamen') && turno.tag == null)) 
			return true;
		else
			return false;
	}.property('turno.listaId', 'turno.oradores', 'turno.oradores.length', 'turno.tiempo', 'turno.tag', 'turno.orden'),
	
	guardar: function(opts, event) {   
		if($('#formAgregarOrador').parsley('validate')){
			this.set('clickGuardar', true);  

			if (this.get('esInvalido')){
				return false;			
			}

			var turno = App.get('crearTurnoController').get('turno');
			if (turno.get('id')) {
				turno.save();
				App.get('turnosController').actualizarHora();
			} else {		
				turno.set('orden', App.get('turnosController.content.length'));
				turno.set('tema', App.get('temaController.content'));
				App.get('turnosController').createObject(turno, true);
			}

			this.refreshTurno();	

		}
	},

	refreshTurno: function () {
		this.set('clickGuardar', false);
		if(App.get('listaController.content'))
			lista = App.get('listaController.content');
		else
			lista = null;
			
		var temaController = App.get('temaController');

		if (temaController.get('content')) {
			var turno = App.Turno.create({
					temaId:  App.get('temaController').get('content').get('id'),
					//listaId: lista == null ? null : lista.get('id'),
					listaId: null,
					tiempo: 5,
					oradores: []
			});
			App.get('crearTurnoController').set('turno', turno);  	
		}
		this.$(".controls input[type='radio']").removeProp('checked');
	}.observes('temaController.content', 'listaController.content'),

	didInsertElement: function () {
		this._super();
		this.refreshTurno();
	},
});

App.PieGraphView = Ember.View.extend({
	attributeBindings: ['title', 'name', 'content', 'categories'],
	pointFormat: '{point.y}',
	type: 'pie',

	redrawChart: function () {
		this.$().highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false
			},
			title: {
				text: this.get('title')
			},
			tooltip: {
				//pointFormat: '',
				pointFormat: this.get('pointFormat') , 
			},            		    
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						color: '#000000',
						connectorColor: '#000000',
		 				format: '{point.percentage:.1f} %',
					},
					showInLegend: true
				}
			},
			series: [{
				type:  this.get('type'),
				name: this.get('name'),
				data: this.get('content')
			}]
	   });
	}.observes('content.@each'),

	didInsertElement: function () {
		this._super();
		Ember.run.next(this, this.redrawChart);
	}
});

App.ColumnGraphView = Ember.View.extend({
	attributeBindings: ['title', 'name', 'content'],
	pointFormat: '{point.y}',
	type: 'column',
	categorias :[   'Enero',
                    'Febrero',
                    'Marzo',
                    'Abril',
                    'Mayo',
                    'Junio',
                    'Julio',
                    'Agosto',
                    'Septiembre',
                    'Octubre',
                    'Noviembre',
                    'Diciembre'
                ],

	redrawChart: function () {
		$('#divEstadisticasVisitantesPorMes').highcharts({
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				renderTo: 'divEstadisticasVisitantesPorMes',
			},
			title: {
				text: this.get('title')
			},
			tooltip: {
				pointFormat: this.get('pointFormat') , 
			},
			plotOptions: {
				column: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						color: '#000000',
						connectorColor: '#000000',
						formatter: function() {
							return '<b>'+ this.point.y +'</b>';
						},
						useHTML: true,
						showInLegend: true,
					}
				}
			},
            xAxis: {
                categories: this.get('categorias')
            },
            yAxis: {
                title: {
                    text: 'Visitantes'
                }
            },
			series: [{
				type:  this.get('type'),
				name: this.get('name'),
				data: this.get('content'),
			}]
	   });

		//console.log(this.get('content'));
	}.observes('content.@each'),

	didInsertElement: function () {
		this._super();
		Ember.run.next(this, this.redrawChart);
	}
});




App.EstadisticasView = Ember.View.extend({
	templateName: 'estadisticas-oradores',
	isBloque: true,

	isBloqueTrue: function () {
		this.set('isBloque', true);
	},

	isBloqueFalse: function () {
		this.set('isBloque', false);
	}	
});

App.EstadisticaTableItemView = Ember.View.extend({
	templateName: 'estadistica-table-item'
});

App.EstadisticaTableView = App.ListFilterView.extend({

	columnas: [	"Nombre del bloque",
				"Total de Diputados del Bloque",
				"Oradores",
				"Tiempo Asignado",
				"Tiempo Utilizado",
				"Oradores respecto al Bloque"
	],

	itemViewClass: App.EstadisticaTableItemView,
});


//Plan De Labor Crear
App.CrearPlanDeLaborView = Ember.View.extend({
	templateName: "crear-plan-de-labor",

	addItem: function (item) {
		item.set('orden', this.get('content.items').length);
		this.get('content.items').pushObject(item);
	},

	borrarItem: function () {
		this.get('content.items').removeObject(item);
	},

	guardar: function () {
		if($('#formCrearPlanDeLabor').parsley('validate')){
			this.get('content').normalize();
			this.get('content').addObserver('createSuccess', this, this.createSucceeded);
			this.get('content').create();		
		}
	},

	createSucceeded: function () {
		this.get('content').removeObserver('createSuccess', this, this.createSucceeded);
		this.get('content').desNormalize();
		if (this.get('content.createSuccess') == true) {

			App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: [], estado: 0});

			fn = function() {
				if (App.get('planDeLaborListadoController.loaded')) {
					App.get('planDeLaborListadoController').removeObserver('loaded', this, fn);	
					App.get('router').transitionTo('planDeLabor.index.index', {estado: 0});
				}
			};

			App.get('planDeLaborListadoController').addObserver('loaded', this, fn);
			App.get('planDeLaborListadoController').load();


			//CREATE NOTIFICATION TEST 
			var notification = App.Notificacion.extend(App.Savable).create();
			//ACA TITULO DE LA NOTIFICACION
			notification.set('tipo', 'crearLaborParlamentaria');	
			//Si hace falta ID del objeto modificado
			notification.set('objectId', this.get('content.id'));
			//Link del objeto
			notification.set('link', "#/laborparlamentaria/plandelabor/" + this.get('content.id') + "/ver");
			//CreateAt
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			//Custom message
			notification.set('mensaje', "Se ha creado un nuevo Plan de Labor Tentativo");

			//notification.set('comisiones', this.get('content.comisiones'));
			//Crear

			// Pendiente de confirmacion. Por ahora solamente se usa el confirmar plan de labor
			//notification.create();

			$.jGrowl('Se ha creado el plan de labor satisfactoriamente!', { life: 5000 });

		} else {
			$.jGrowl('Ocurrio un error al crear el plan de labor!', { life: 5000 });
		}
	},
	
	didInsertElement: function () {
		this._super();
		this.set('content', App.PlanDeLaborTentativo.extend(App.Savable).create());
	}
});

App.CrearPlanDeLaborItemView = Ember.View.extend({
	templateName: 'crear-plan-de-labor-item',
	item: null,
	filterExpedientes: '',
	filterDictamenes: '',
	grupoFaltaSeleccionar: false,
	faltaSeleccionarDictamenesProyectos: false,
	formularioNoValido: false,

	didInsertElement: function () {
		this._super();
		this.set('item', App.PlanDeLaborTentativoItem.create({proyectos: [], dictamenes: []}));
	},

	proyectosList: function () {
		var filtered;

		if (this.get('filterExpedientes') != '')
		{
			var regex = new RegExp(this.get('filterExpedientes').toString().toLowerCase());
			
			filtered = this.get('proyectos').filter(function(expediente) {
				return regex.test(expediente.get('label').toLowerCase());
			});
		}
		else
		{
			filtered = this.get('proyectos');
		}

		return filtered.slice(0, 10);
	}.property('filterExpedientes', 'proyectos'),

	dictamenesList: function () {
		var filtered;

		if (this.get('filterDictamenes') != '')
		{
			var regex = new RegExp(this.get('filterDictamenes').toString().toLowerCase());
			
			filtered = this.get('dictamenes').filter(function(expediente) {
				return regex.test(expediente.get('label').toLowerCase());
			});
		}
		else
		{
			filtered = this.get('dictamenes');
		}
		if (filtered)
			return filtered.slice(0, 10);
		return [];
	}.property('filterDictamenes', 'dictamenes'),


	clickExpediente: function (proyecto) {
		var item = this.get('item.proyectos').findProperty('id', proyecto.id);
		if (!item) {
			proyecto.set('orden', this.get('item.proyectos.length'));
			this.get('item.proyectos').pushObject(proyecto);
		} else {
			this.get('item.proyectos').removeObject(proyecto);
		}
	},

	itemClicked: function (dictamen) {
		var item = this.get('item.dictamenes').findProperty('id', dictamen.id);
		if (!item) {
			dictamen.set('orden', this.get('item.dictamenes.length'));
			this.get('item.dictamenes').pushObject(dictamen);
		} else {
			this.get('item.dictamenes').removeObject(dictamen);
		}
	},

	guardar: function (){
		var itemsSeleccionadosPorDictamenesProyectos = (parseInt(this.get('item.dictamenes').length) + parseInt(this.get('item.proyectos').length));

		if(this.get('item.grupo') == null)
		{
			this.set('grupoFaltaSeleccionar', true);
		}
		else
		{
			this.set('grupoFaltaSeleccionar', false);
		}

		if(itemsSeleccionadosPorDictamenesProyectos > 0)
		{
			this.set('faltaSeleccionarDictamenesProyectos', false);
		}
		else
		{
			this.set('faltaSeleccionarDictamenesProyectos', true);			
		}

		if(!$('#formAgregarPlanDeLabor').parsley('validate') || this.get('grupoFaltaSeleccionar') == true || this.get('faltaSeleccionarDictamenesProyectos') == true){
			this.set('formularioNoValido', true);
		}
		else{
			this.set('formularioNoValido', false);			
		}

		if(this.get('formularioNoValido') == false)
		{
			this.get('parentView').addItem(this.get('item'));
			this.set('item', App.PlanDeLaborTentativoItem.create({proyectos: [], dictamenes: []}));			
		}
	},
});

App.PlanDeLaborTentativoItemView = Ember.View.extend({
	templateName: 'plan-de-labor-tentativo-item',

	borrarItem: function () {
		this.get('parentView').borrarItem(this.get('content'));
	}
});

App.PlanDeLaborTentativoListView = App.JQuerySortableView.extend({
	itemViewClass: App.PlanDeLaborTentativoItemView, 
	classNames: ['subNav'],

	borrarItem: function (item) {
		if (this.get('parentView').borrarItem)
		{
			this.get('parentView').borrarItem(item);
		}
	},

	updateSort : function (idArray) {

	},
});


App.PLMiniView = Ember.View.extend({
	templateName: 'pl-item-mini',
	edited: false,

	mergedContentController: null,

	mergedContent: function () {
		return this.get('mergedContentController');
	}.property('mergedContentController'),

	contentChange: function () {
		var data = [];

		if (this.get('content.dictamenes'))
			data.addObjects(this.get('content.dictamenes'));

		if (this.get('content.proyectos'))
			data.addObjects(this.get('content.proyectos'));

		if (this.get('mergedContentController')) 
			this.get('mergedContentController').set('content', data);

	}.observes('content.proyectos.@each, content.dictamenes.@each'),

	borrar: function(){
		this.get('parentView.parentView').borrarItem(this.get('content'));
		this.get('parentView.parentView').set('isEdited', true);
	},

	borrarExpediente: function(item) {
		this.get('content.proyectos').removeObject(item);
		this.set('edited', !this.get('edited'))
		this.get('parentView.parentView').set('isEdited', true);
	},

	borrarOD: function(item){
		this.get('content.dictamenes').removeObject(item);
		this.set('edited', !this.get('edited'))
		this.get('parentView.parentView').set('isEdited', true);
	},

	didInsertElement: function () {
		this._super();

		var data = [];

		if (this.get('content.dictamenes'))
			data.addObjects(this.get('content.dictamenes'));

		if (this.get('content.proyectos'))
			data.addObjects(this.get('content.proyectos'));

		var mergedContentController = Ember.ArrayController.create({
		  content: data,
		  sortProperties: ['orden'],
		  sortAscending: true,
		});

		this.set('mergedContentController', mergedContentController);
	}
});

App.PlanDeLaborEfectivoView = Ember.View.extend({
	templateName: 'plan-de-labor-efectivo',
	contentBinding: "App.planDeLaborController.content",

	exportar: function () {
		$.download('exportar/plandelabor', "&type=plandelabor&data=" + JSON.stringify(App.planDeLaborController.content));
	},

});

App.PlanDeLaborBorradorView = Ember.View.extend({
	templateName: 'plan-de-labor-borrador',
	contentBinding: "App.planDeLaborController.content",
});

App.PlanDeLaborBorradorEditView = Ember.View.extend({
	templateName: 'plan-de-labor-borrador-edit',
	contentBinding: "App.planDeLaborController.content",
	
	addItem: function (item) {
		item.set('orden', this.get('content.items').length);
		this.get('content.items').pushObject(item);
		this.guardar();
	},

	borrarItem: function (item) {
		this.get('content.items').removeObject(item);
		this.set('isEdited', true);
	},

	guardar: function(){

		var clone = App.PlanDeLaborTentativo.extend(App.Savable).create(Ember.copy(this.get('content')));
		
		clone.normalize();
		clone.set('estado', 0);

		clone.addObserver('saveSuccess', this, this.itemAddedSuccess);
		clone.save();
	},

	cancelar: function () {
		this.get('content').addObserver('loaded', this, this.plLoadedSuccess);
		this.get('content').load();
		this.set('isEdited', false);
	},

	plLoadedSuccess: function () {
		if (this.get('content.loaded')) {
			this.get('content').removeObserver('loaded', this, this.plLoadedSuccess);
			this.get('content').desNormalize();
			this.set('isEdited', false);
		}

	},

	cerrarPlan: function () { 
		this.get('content').normalize();
		this.get('content').addObserver('saveSuccess', this, this.saveSuccessed);
		this.set('content.estado', 1);
		this.get('content').save();
	},	

	itemAddedSuccess : function () {
		this.get('content').desNormalize(false);
		this.set('isEdited', false);
	},


	saveSuccessed: function () {
		this.get('content').removeObserver('saveSuccess', this, this.createSucceeded);
		if (this.get('content.saveSuccess') == true) {

			App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: [], estado: 1});

			fn = function() {
				if (App.get('planDeLaborListadoController.loaded')) {
					App.get('planDeLaborListadoController').removeObserver('loaded', this, fn);	
					App.get('router').transitionTo('planDeLabor.index.index', {estado: 1}); 
				}
			};

			App.get('planDeLaborListadoController').addObserver('loaded', this, fn);
			App.get('planDeLaborListadoController').load();
			
			var planDeLabor = this.get('content');
			var expedientesD = [];
			var firmantes = [];

			$.jGrowl('Se ha cambiado el estado del plan de labor a confirmado!', { life: 5000 });

			if(planDeLabor.items)
			{		
				planDeLabor.items.forEach(function(item){
					if(item.proyectos)
					{
						item.proyectos.forEach(function(proyecto){
							if(proyecto.proyecto)
							{
								expedientesD.push(proyecto.proyecto.expdip);

								if(proyecto.proyecto.firmantes)
								{
									proyecto.proyecto.firmantes.forEach(function(firmante){
										firmantes.push(firmante);
									});
								}
							}
						});
					}
				});
			}


			var evento = App.TimeLineEvent.extend(App.Savable).create({
			    objectID: expedientesD[0], 
			    titulo: 'Se ha creado un Plan de labor',
			    fecha:  moment().format('YYYY-MM-DD HH:mm'),
			    mensaje: 'Se ha ha creado un Plan de labor',
			    icono: 'creado',
			    link: '#/laborparlamentaria/plandelabor/' + planDeLabor.id + '/ver',
			    duplicados: expedientesD,
			});

			evento.create();	

			var notification = App.Notificacion.extend(App.Savable).create();
			notification.set('tipo', 'confirmarLaborParlamentaria');	
			notification.set('objectId', this.get('content.id'));
			notification.set('link', "#/laborparlamentaria/plandelabor/" + this.get('content.id') + "/ver");
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			notification.set('mensaje', "Se ha confirmado el Plan de Labor Tentativo del día " + moment(this.get('content.fechaEstimada')).format('dddd') + " " + moment(this.get('content.fechaEstimada')).format('LL') );
			notification.set('firmantes', firmantes);

			notification.create();

		} else {
			$.jGrowl('Ocurrio un error al cambiar el estado del plan tentativo!', { life: 5000 });
		}
	},
});

App.PlanDeLaborTentativoView = Ember.View.extend({
	templateName: 'plan-de-labor-tentativo',
	contentBinding: "App.planDeLaborController.content",

	sesion: null,
	clickGuardar: null,

	puedeCrearSesion: function () {
		if (App.get('userController').hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT'))
			return true;
		else
			return false;
	}.property('App.userController.roles.@each'),

	crearSesion: function () {
		this.set('clickGuardar', true);

		if($("#formCrearSesion").parsley('validate') && this.get('sesion.tipo')){
			//var sesion = App.Sesion.extend(App.Savable).create({titulo:"Sesion " + moment(this.get('content.fechaEstimada'), 'YYYY-MM-DD HH:ss').format('MM/DD/YYYY') , fecha: moment(this.get('content.fechaEstimada'), 'YYYY-MM-DD HH:mm').unix(), tipo: "SesionOrdinariaDeTablas", periodoOrdinario:130, sesion:6, reunion:7, idPl: this.get('content.id')});
			var sesion = this.get('sesion');
			var temas = [];
			var orden = 0;
			sesion.set('plId', this.get('content.id'));
			sesion.set('idPl', this.get('content.id'));

			var fechaSesion = moment(this.get('fecha') + ' ' + this.get('hora') + '+0000', "DD-MM-YYYY HH:mm z");
			sesion.set('fecha', fechaSesion.unix());

			this.get('content.items').forEach(function (item) {
				var tema = App.Tema.create();

				tema.setProperties({
						titulo: item.get('sumario'),
						orden: orden,
						plId: 0,
						plTipo: 'p',
						plGrupo: item.get('grupo.descripcion'),
						plItemId: item.get('id'),
				});

				temas.addObject(tema);

				orden = orden + 1;

				var data = [];
				data.addObjects(item.get('dictamenes'));
				data.addObjects(item.get('proyectos'));

				var mergedContentController = Ember.ArrayController.create({
				  content: data,
				  sortProperties: ['orden'],
				  sortAscending: true,
				});

				mergedContentController.get('arrangedContent').forEach(function (object) {
					if (object.constructor.toString() == 'App.Expediente') {
						temas.addObject(
							App.Tema.create({
								titulo: "Expediente " + object.expdip + " " + object.tipo,
								orden: object.orden,
								plId: object.id,
								plTipo: 'e',
								plGrupo: '',
								plItemId: item.get('id'),
							})
						);
						orden = orden + 1;
		    		} else if (object.constructor.toString() == 'App.OrdeDelDia') {
						var tema = App.Tema.create();
						tema.setProperties({
								titulo: "Dictamen: " + object.sumario,
								orden: object.orden,
								plId: object.id,
								plTipo: 'd',
								plGrupo: '',
								plItemId: item.get('id'),
						});
						temas.addObject(tema);

						orden = orden + 1;      			
		    		}
				}, this);		
			});
			
			sesion.set('temas', temas);
			
			var url = "crearSesion/planDeLabor";

			$.ajax({
				url: url,
				contentType: 'text/plain',
				dataType: 'JSON',
				type: 'POST',
				context : {model : sesion, pl: this.get('content'), scope: this },
				data : sesion.getJson(),
				success: this.createSucceeded,
			});
		}
	},

	createSucceeded: function (data) {
		if (data.success == true) {

			this.model.set('id', data.id);

			var expedientesD = [];
			var firmantes = [];

			var content = this.scope.content;
			var items = this.scope.content.items;

			if(items)
			{							
				items.forEach(function(item){			
					if(item.proyectos)
					{				
						item.proyectos.forEach(function (proyecto){
							if(proyecto)
							{
								expedientesD.push(proyecto.expdip);

								if(proyecto.firmantes)
								{
									proyecto.firmantes.forEach(function(firmante){
										firmantes.push(firmante);
									});
								}

							}
						});
					}
				});
			}

			var evento = App.TimeLineEvent.extend(App.Savable).create({
			    objectID: expedientesD[0], 
			    titulo: 'Se ha creado una Sesión desde un Plan de Labor Confirmado',
			    fecha:  moment().format('YYYY-MM-DD HH:mm'),
			    mensaje: 'Se ha creado una Sesión desde un Plan de Labor Confirmado',
			    icono: 'creado',
			    link: '#laborparlamentaria/plandelabor/'+ data.id +'/ver',
			    duplicados: expedientesD,
			});

			evento.create();	
			//CREATE NOTIFICATION TEST 
			var notification = App.Notificacion.extend(App.Savable).create();
			//ACA TITULO DE LA NOTIFICACION
			notification.set('tipo', 'crearSesion');

			//Si hace falta ID del objeto modificado
			notification.set('objectId', data.id);
			//Link del objeto
			notification.set('link', "#/recinto/oradores/sesion/" + data.id + "/ver");
			//CreateAt
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			//Custom message
//			notification.set('mensaje', "Se ha creado la sesion del dia " +  moment.unix(this.model.get('fecha')).format('LL'));
			notification.set('mensaje', "Se ha creado la sesion del dia " +  moment.unix(this.model.get('fecha')).format('dddd, LL'));

			notification.set('firmantes', firmantes);

			//Crear
			notification.create();

			this.pl.addObserver('saveSuccess', this.scope, this.scope.saveSuccessed);
			this.pl.set('estado', 2);
			this.pl.normalize();
			this.pl.save();
		}		
	},

	saveSuccessed: function () {
		this.get('content').removeObserver('saveSuccess', this, this.createSucceeded);
		if (this.get('content.saveSuccess') == true) {

			App.planDeLaborListadoController = App.PlanDeLaborListadoController.create({content: [], estado: 2});

			fn = function() {
				if (App.get('planDeLaborListadoController.loaded')) {
					App.get('planDeLaborListadoController').removeObserver('loaded', this, fn);	
					App.get('router').transitionTo('planDeLabor.index.index', {estado: 2}); 
				}
			};

			App.get('planDeLaborListadoController').addObserver('loaded', this, fn);
			App.get('planDeLaborListadoController').load();

			$.jGrowl('Se ha creado la sesión satisfactoriamente!', { life: 5000 });

		} else {
			$.jGrowl('Ocurrio un error al crear la sesión!', { life: 5000 });
		}
	},	

	didInsertElement: function () {
		this._super();

		this.$("select, .check, .check :checkbox, input:radio, input:file").uniform();
		this.set('sesion', App.Sesion.extend(App.Savable).create({}));

		self = this;

		this.set('fecha', moment().format("DD-MM-YYYY"));
		this.set('hora', moment().format("HH:mm"));
			
		$('.timepicker').timeEntry({
			show24Hours: true, // 24 hours format
			showSeconds: false, // Show seconds?
			spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
			spinnerSize: [19, 26, 0], // Image size
			spinnerIncDecOnly: true, // Only up and down arrows
			defaultTime: this.get('hora'),
			timeSteps: [1, 15, 1],
		});	 
		
		$('.timepicker').timeEntry('setTime', this.get('hora'));		
	}

});


App.SugestView = Ember.View.extend({
	templateName: 'sugest',
	sugestText: '',
	controllerName: '',
	threshold: 3,
	titulo: null,
	placeHolder: "Expediente N°",
	itemViewClass: 'App.SugestListItemView',
	desactivar: false,
	controller: null,
	optionLabelPath: 'content.label',
	optionValuePath: 'content',
	applyOrden: false,

	sugestTextChanged: function () {
		if (this.get('sugestText').length >= this.get('threshold')) {
			this.get('controller').filter(this.get('sugestText'));
		} else {
			this.set('controller.content', []);
		}	
	}.observes('sugestText'),

	sugestList: function () {
		if (this.get('controller')) {
			if (this.get('controller.content'))
				return this.get('controller.content');
		} else {
			return [];
		}
	}.property('controller.content'),

	itemSelect: function(item) {
		if (Ember.isArray(this.get('selection'))) {
			if (!this.get('selection').findProperty('id', item.get('id'))) {
				if (this.get('applyOrden')) {
					item.set('orden', this.get('selection.length'));
				}
				this.get('selection').addObject(item);
			}
		}
		else {
			this.set('selection', item);
		}
			  
		this.clear();
	},

	clear: function () {
		this.set('sugestText', '');
	},
		
	didInsertElement: function () {
		this._super();

		if (!this.get('controller')) {
			var controller = App.get(this.get('controllerName')).create({ content: [] });
			this.set('controller',  controller);
		}

	},
});


App.SugestListItemView = Ember.View.extend({
	templateName: 'sugest-item',
	classNames: ['list-group-item'],

	label: function () {
		return this.get(this.get('optionLabelPath'))
	}.property('content'),

	click: function () {
		this.get('parentView').itemSelect(this.get(this.get('optionValuePath')));
	},

	didInsertElement: function () {
		this._super();
	}
});

App.ExpedienteSugestListItemView = App.SugestListItemView.extend({
	templateName: 'expediente-sugest-item',
});

App.ExpedienteCitacionSugestListItemView = App.SugestListItemView.extend({
	templateName: 'expediente-sugest-item',
	click: function () {
		this.get('parentView').get('parentView').get('parentView').clickExpediente(this.get('content'));
				this.get('parentView').get('parentView').clear();
	},        
});


App.SugestListView = Ember.CollectionView.extend({
	classNames: ['list-group'],

	tagName: 'ul',
	itemViewClass: App.SugestListItemView,

	itemSelect: function (item) {
		this.get('parentView').itemSelect(item);
	},

	createChildView: function(viewClass, attrs) {
		if (attrs) {
			attrs['optionLabelPath'] = this.get('optionLabelPath');
			attrs['optionValuePath'] = this.get('optionValuePath');
		}
	    return this._super(viewClass, attrs);
	},

	didInsertElement: function () {
		this._super();
//		console.log(this.get('optionValuePath'));
	},
});


/**/

App.DiputadoPartidoItemListView = Em.View.extend({
	templateName: 'diputado-partido-item-list',
	tagName: 'li',

	didInsertElement: function(){
		this._super();
		this.$('a').tooltip();
	},
	clickItem: function () {
		this.get('parentView').get('parentView').clickPartido(this.get('content'));
	}
});

App.DiputadoPartidoSugestListItemView = App.SugestListItemView.extend({
	templateName: 'diputado-partido-sugest-item',
});

App.CrearDiputadoView = Ember.View.extend({
	templateName: 'crear-diputado',
	distrito: null,
	item:null,
	sexo: [{'id':'M', 'titulo':'Masculino'}, {'id': 'F', 'titulo': 'Femenino'}],
	clickGuardar: false,
	sugestDesactivar: null,

	changeContent: function(){
		// console.log(this.get('content.datosPersonales.sexo'));
		var getSexo = this.get('content.datosPersonales.sexo');

		if(getSexo == 'M'){
			this.set('sexo', [{'id':'M', 'titulo':'Masculino', 'checked':'checked'}, {'id': 'F', 'titulo': 'Femenino'}]);
		}else{
			this.set('sexo', [{'id':'M', 'titulo':'Masculino'}, {'id': 'F', 'titulo': 'Femenino', 'checked':'checked'}]);
		}
/*
		this.get('sexo').forEach(function(getItem){

			if(getItem.id == getSexo)
			{
				getItem.value 	= getSexo;
				getItem.checked = 'CHECKED';
			}
			else
			{
				getItem.value 	= '';
				getItem.checked = '';
			}
		});
*/

/*		
		console.group('Sexo REST');
		console.log(this.get('content.datosPersonales.sexo'));
		console.groupEnd();
		
		console.group('Sexo FORM');
		console.log(this.get('sexo'));
		console.groupEnd();
*/
	}.observes('content.datosPersonales.sexo'),
	changeTextSugest: function(){
		if(this.get('item.partidos') && this.get('item.partidos').length > 0 )
		{
			this.set('sugestDesactivar', true);
		}
		else
		{
			this.set('sugestDesactivar', false);			
		}
	}.observes('App.diputadosPartidosController.content.@each', 'item', 'item.partidos.@each'),
	clickPartido: function(partido){
		var item = this.get('item.partidos').findProperty("id", partido.get('id'));		
		this.get('item.partidos').removeObject(partido);
	},
	seleccionoTipoSexo: function(){
		var sexo = this.get('content.datosPersonales.sexo');

		if(sexo){ return true; }
		else{ return false; }
	}.property('content.datosPersonales.sexo'),
	noPuedeElegirMasPartidos: function(){
		if(this.get('item'))
		{		
			if(this.get('item.partidos').length > 1)
			{
				this.get('item.partidos').removeObject(this.get('item.partidos.lastObject'));
				return true;
			}
		}
	}.property('item.partidos.@each'),
	guardar: function () {
		if(this.get('clickGuardar') == false)
		{
			this.set('clickGuardar', true);
		}

		if($("#formCrearDiputado").parsley('validate') && this.get('seleccionoTipoSexo') == true)
		{		
			this.get('content').normalize();
			this.set('content.partido', this.get('item.partidos.firstObject.nombre'));
			this.get('content').addObserver('createSuccess', this, this.createSucceeded);
			this.get('content').create();
		}
	},

	distritoChange: function () {
		this.get('content').set('distrito', this.get('distrito.descripcion'));
	}.observes('distrito'),

	createSucceeded: function () {
		this.get('content').removeObserver('createSuccess', this, this.createSucceeded);
		this.get('content').desNormalize();
		if (this.get('content.createSuccess')) {
			fn = function() {
				if (App.get('diputadosVigentesController.loaded')) {
					App.get('router').transitionTo('direccionSecretaria.diputados.listado');
				}
			};

			App.get('diputadosVigentesController').addObserver('loaded', this, fn);
			App.get('diputadosVigentesController').load();
		} else {

		}
	},
	didInsertElement: function () {
		this._super();
		this.$('a').tooltip();
		this.set('content', App.Mandato.extend(App.Savable).create({datosPersonales: App.Autoridad.create({})}));
		this.set('item', App.DiputadoPartido.create({partidos: []}));
	},	
});


App.ListaDiputadosView = Ember.View.extend({
	templateName: 'autoridades',
});

App.AutoridadListItemView = Ember.View.extend({
	tagName: 'tr',
	classNames: ['gradeX'],
	templateName: 'mandato',
});

App.AutoridadesListView = App.ListFilterView.extend({
	itemViewClass: App.AutoridadListItemView,
//	columnas: ['Fecha', 'Nota', 'Comisiones convocadas'],
	columnas: ['Fecha Juramento', 'Nombre', 'Partido', 'Distrito'],
});


App.CrearExpedienteView = Ember.View.extend({
	templateName: 'crear-expediente',
	clickGuardar: false,
	expTipo: '',
	expedienteExist: false,
	pubnro: null,

	tipos: ['LEY', 'LEY EN REVISION', 'RESOLUCION', 'DECLARACION', 'MENSAJE'],

	camaras: [
		{id: "D", nombre: "Diputados"}, 
		{id: "S", nombre: "Senado"}, 
		{id: "PE", nombre: "Poder Ejecutivo"}, 
		{id: "JGM", nombre: "Jefatura de Gabinete de Ministros"}
	],

	camarasList: function(){
		switch (this.get('content.tipo'))
		{
			case 'LEY':
				return this.get('camaras');
				break;
			case 'LEY EN REVISION':
				return Array(this.get('camaras')[1]);
				break;
			case 'RESOLUCION':
				return this.get('camaras');
				break;
			case 'DECLARACION':
				return this.get('camaras');
				break;
			case 'MENSAJE':
				return Array(this.get('camaras')[2], this.get('camaras')[3]);
				break;
		}
	}.property('content.tipo'),

	esLey: function () {
		return this.get('content.tipo') == "LEY";
	}.property('content.tipo'),

	esDeclaracion: function () {
		return this.get('content.tipo') == "DECLARACION";
	}.property('content.tipo'),

	esResolucion: function () {
		return this.get('content.tipo') == "RESOLUCION";
	}.property('content.tipo'),
		
	esLeyRevision: function () {
		return this.get('content.tipo') == "LEY EN REVISION";
	}.property('content.tipo'),

	esMensaje: function () {
			var regex = new RegExp('mensaje');
			if (this.get('content.tipo'))
				return regex.test(this.get('content.tipo').toLowerCase());
			else
				return false;
	}.property('content.tipo'),

	noHayTipo: function(){
		if(this.get('content.tipo') == null)
		{
			return true;
		}
		else
		{	
			return false;
		}
	}.property('content.tipo'),


	noHayOrigen: function () {
		if(this.get('content.expdipT') == null)
		{
			return true;
		}
		else
		{	
			return false;
		}
	}.property('content.tipo'),
	
	
	faltanFirmantes: function(){
		if (!this.get('clickGuardar'))
			return false;
		if(this.get('content.autoridades').length < 1) 
		{
			if(this.get('content.expdipT.id') == "S" || this.get('content.expdipT') == "S") {
				return false;
			}
			return true;
		} 
		else
		{
			return false;
		} 
	}.property('content.autoridades.@each', 'clickGuardar'),

	faltanGiros: function(){
		
		if (this.get('clickGuardar') == false)
			return false;

		if(this.get('content.comisiones').length < 1)
		{
			return true;
		} 
		else
		{
			return false;
		} 
		//return false;
	}.property('content.comisiones.@each', 'clickGuardar'),

	errorTab: 1,

	guardar: function (){
		var _self = this;
		this.set('errorTab', 0);
		var formIsValid = $("#formCrearExpediente").parsley('validate');

		this.set('clickGuardar', true);

		if(this.get('clickGuardar') == true)
		{
			if(_self.get('noHayTipo') == false)
			{
				
				if (formIsValid) {
					if (_self.get('faltanFirmantes')) {
						this.set('errorTab', 2);
					} else {
						if (_self.get('faltanGiros')) {
							this.set('errorTab', 3);
						}
					}
				} else {
					this.set('errorTab', 1);
				}

				if($("#formCrearExpediente").parsley('validate') && _self.get('faltanFirmantes') == false && _self.get('faltanGiros') == false && this.get('expedienteExist') == false && _self.get('noHayOrigen') == false)
				{				
					App.confirmActionController.setProperties({
						title: 'Confirmar creación de Proyecto',
						message: '¿ Confirma que desea crear el proyecto de ' + _self.get('content.tipo') + ' ' + _self.get('content.expdip') + ' ?',
						success: null,
					});
					
					App.confirmActionController.addObserver('success', _self, _self.confirmActionDone);
					App.confirmActionController.show();
				}
			}
		}

	},
	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);

		if(App.get('confirmActionController.success'))
		{
			if (this.get('expTipo'))
			{
				this.set('tipo', this.get('content.tipo'));
				this.get('content').set('tipo', this.get('expTipo'));
			}
			
			/*
			while (this.get('content.expdipN').length < 4)
			{
                this.set(('content.expdipN'),  '0' + this.get('content.expdipN'));
            }
            */

			this.set('loading', true);
			this.get('content').normalize();
			//this.get('content').desNormalize();
			this.set('content.expdipT', this.get('content.expdipT').id);

			this.get('content').addObserver('createSuccess', this, this.createSucceeded);
			this.get('content').create();
		}else{
			$("#crearProyecto").focus();
		}
	},

	createSucceeded: function () {
		var _self = this;

		if (this.get('content.createSuccess') == true) {
			this.get('content').desNormalize();
			this.get('content').removeObserver('createSuccess', this, this.createSucceeded);
			/*App.confirmActionController.setProperties({
				title: 'Comprobante de ingreso',
				message: '¿ Desea imprimir el comprobante de ingreso ?',
				success: null,
			});
			
			App.confirmActionController.addObserver('success', this, this.confirmarImprimirSuccess);
			App.confirmActionController.show();		
			*/

			this.confirmarImprimirSuccess();

		} else  {
			if (this.get('content.createSuccess') == false) {
				if (typeof this.get('content.createSuccess') == "boolean")
				{
					this.get('content').desNormalize();
					this.get('content').removeObserver('createSuccess', this, this.createSucceeded);
					var expiniciado = this.get('content.iniciado');

					var iniciado = this.get('camaras').findProperty('id', this.get('content').get('expdipT'));
					this.get('content').set('iniciado', expiniciado);
					this.get('content').set('expdipT', iniciado);

					this.setupEnter();

					this.set('loading', false);
					this.set('clickGuardar', false);

					//$("#formCrearExpediente").parsley('reset');
					$("#formCrearExpediente").parsley('destroy');

					$("#nav-tabs-proyecto").click();
					$("#selector-tipo-proyecto").focus();	

					$.jGrowl('No se ha creado el expediente!', { life: 5000 });
					this.set('loading', false);
				}
			}
		}
	},

	confirmarImprimirSuccess: function () {

		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);		

		/*if(App.get('confirmActionController.success')) {
			$.download('exportar', "&type=comprobante-expediente&data=" + JSON.stringify(this.get('content')));			
		}*/

		if (this.get('tipo')) {
			this.get('content').set('tipo', this.get('tipo'));
		}
				
			
		if (this.get('content.createSuccess')) {
			var expediente = this.get('content');
					
			$.jGrowl('Se ha creado el expediente de '+ expediente.tipo + ' ' + expediente.expdip + ' correctamente !', { life: 5000 });
			
			var notification = App.Notificacion.extend(App.Savable).create();
			notification.set('tipo', 'crearProyecto');	
			notification.set('objectId', expediente.id);
			notification.set('link', "/#/direccionsecretaria/mesadeentrada/proyecto/" + expediente.id + "/ver");
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			notification.set('mensaje', "Se ha creado el expediente " + expediente.expdip);
			//notification.set('firmantes', this.get('content.firmantes'));
			
			notification.create();      

			var evento = App.TimeLineEvent.extend(App.Savable).create({
			    objectID: expediente.expdip, 
			    titulo: expediente.titulo,
			    fecha:  expediente.pubFecha,
			    mensaje: 'Expediente creado',
			    icono: 'creado',
			    link: '#/direccionsecretaria/mesadeentrada/proyecto/'+ expediente.id +'/ver',
			 	   duplicados: [],
			});
			evento.create();

			var iniciado = this.get('camaras').findProperty('id', expediente.get('expdipT'));

			//var tp = App.get('tpsController.content').findProperty('numero', expediente.get('pubnro'));


			this.set('content', App.Expediente.extend(App.Savable).create({
				expdipN: '', 
				tipo: 'LEY', 
				pubtipo: expediente.get('pubtipo'), 
				periodo: expediente.get('periodo'),
				expdipA: expediente.get('expdipA'),
				iniciado: expediente.get('iniciado'),
				expdipT: iniciado,
				pubFecha: expediente.get('pubFecha'),
				sesion: expediente.get('sesion'),
				firmantes: [],
				giro: [],
				comisiones: [],
				autoridades: [],
			}));



			//this.set('oldTP', tp);

			/*App.set('expedienteConsultaController.content', this.get('content'));
			fn = function() {
							if (App.get('expedienteConsultaController.loaded')) {
								App.get('expedienteConsultaController').removeObserver('loaded', this, fn);
								App.get('router').transitionTo('expedientes.expedienteConsulta.indexSubRoute', expediente);
							}
			};
			App.get('expedienteConsultaController').addObserver('loaded', this, fn);
			App.get('expedienteConsultaController').load();			
						*/

		
			/*
			var evento = App.TimeLineEvent.extend(App.Savable).create({
		        objectID: 1, 
		        titulo: 'Probando duplicados',
		        fecha:  moment().format('YYYY-MM-DD HH:mm'),
		        mensaje: 'Nunc at dolor at augue posuere tincidunt molestie a odio. Aenean sit amet nisl quis nunc vulputate tristique. Integer feugiat eros ut dapibus dignissim',
		        icono: 'creado',
		        link: '#/direccion/secretaria/mesa/de/entrada/diputados/listado',
		        duplicados: ['158751', '158640', '158902'],
			});
			evento.create();
			*/
		} 

		this.setupEnter();

		this.set('loading', false);
		this.set('clickGuardar', false);

		//$("#formCrearExpediente").parsley('reset');
		$("#formCrearExpediente").parsley('destroy');

		$("#nav-tabs-proyecto").click();
		$("#selector-tipo-proyecto").focus();		
	},

	setupEnter: function(){
		var _self = this;
	

		// console.log('setupEnter');
/*
		$("#crearProyecto").on('click', function(){
			 // console.log('click');				

			if($(this).is(':focus'))
			{
				// console.log('focus + click');

				if(_self.get('clickGuardar') == false)
				{
					_self.set('clickGuardar', true);
				}

				// console.log("clickGuardar: " + _self.get('clickGuardar'));
			}
		});
*/
	},

	didInsertElement: function () {
		this._super();
		var _self = this;
		
		this.set('content', App.Expediente.extend(App.Savable).create({
			expdipA: '', 
			expdipN: '', 
			tipo: 'LEY', 
			firmantes: [],
			giro: [],
			comisiones: [],
			autoridades: [],
		}));                

		
		var tp = App.get('tpsController.arrangedContent.firstObject');
		this.set('oldTP', tp);
          
		Ember.run.next(this, function (){
			$("#selector-tipo-proyecto").focus();
		});

		this.setupEnter();

		shortcut.add('enter', function() {
		  if($('#crearProyecto').is(':focus'))
		  {
			$("#crearProyecto").blur();
		    _self.guardar();
		  }
		});

	},
	cancelar: function() {
		App.confirmActionController.setProperties({
			title: 'Confirmar cancelación de creación de Proyecto',
			message: '¿Confirma que desea salir? Se perderan los datos no guardados.',
			success: null,
		});
		
		App.confirmActionController.addObserver('success', this, this.confirmCancelActionDone);
		App.confirmActionController.show();
	},

	confirmCancelActionDone: function () {
		App.confirmActionController.addObserver('success', this, this.confirmCancelActionDone);

		if(App.get('confirmActionController.success')) {
			App.get('router').transitionTo('direccionSecretaria.mesaDeEntrada.proyectos');						
		}

	},

	willDestroyElement: function(){
		// remove shorcut
		shortcut.remove('enter');
	}
});

App.InputSearchWidget = Ember.TextField.extend({
	insertNewline: function(){
		var _self = this.get('parentView');
		if(this.get('search-widget') == 'firmantes' && $(".searchWidgetFirmantes").is(':focus'))
		{
			firmante = _self.get('listaFirmantes.firstObject');
			_self.clickFirmante(firmante);
		}

		if(this.get('search-widget') == 'giros' && $(".searchWidgetGiros").is(':focus'))
		{
			comision = _self.get('listaComisiones.firstObject');
			_self.clickComision(comision);
		}
	},
});


App.ExpedienteFormLeyView = Ember.View.extend({
	templateName: 'expediente-form-ley',

	tipoSesion: ['ORDINARIAS', 'EXTRAORDINARIAS', 'DE PRORROGA'],

	iniciado: ['Diputados', 'Senado'],

	tipoPub: ['TP'],
	
	filterTextComisiones: '',
	filterFirmantes: '',
	comisionesSeleccionadas: [],
	firmantesSeleccionados: [],
	periodos: [132, 131, 130,  129, 128, 127,  126, 125, 124],
	comisionesBicamerales: false,
	puedeVerPreviewTramiteParlamentario: false,
	oldFecha: '',

	camarasChange: function(){
		var _self = this;
		
		Ember.run.next(function(){		
			_self.set('content.iniciado', _self.get('iniciado.firstObject'));
		});

		this.set('clickGuardar', false);
		$("#formCrearExpediente").parsley('destroy');

	}.observes('content.tipo'),

	numeros: function(){
		return $.map(App.get('tpsController.arrangedContent'), function(key){ return key.numero });
	}.property('tpsController.content.@each'),

	numerosChanged: function(){
		if (this.get('pubnro')) {
			if (this.get('oldFecha') != this.get('pubnro.fecha')) {
				this.set('content.pubFecha', moment(this.get('pubnro.fecha'), 'YYYY-MM-DD').format('DD/MM/YYYY'));
				this.set('content.pubnro', this.get('pubnro.numero'));
				this.set('parentView.oldTP', this.get('pubnro'));
				this.set('oldFecha', this.get('pubnro.fecha'));
			}
		}
		else 
		{
			this.set('content.pubFecha', null);
			this.set('content.pubnro', null);
		}

//: moment().format('DD/MM/YYYY') + '/detalle',
/*
	
*/
	}.observes('pubnro', 'content'),

	fechaChanged: function() {
		var p = new RegExp('/');
		if (p.test(this.get('content.pubFecha'))) {
			if(this.get('content.pubFecha')) {
				if (this.get('oldFechaTp') != this.get('content.pubFecha')) {
					//this.get('content').set('autoridades', []);
					App.get('firmantesController').set('url', this.get('content.pubFecha') + '/resumen');
					App.get('firmantesController').load();	
					this.set('oldFechaTp', this.get('content.pubFecha'));
				}
			}
		}
	}.observes('content.pubFecha'),


	errorTabChange: function () {
		if (this.get('parentView.errorTab') > 0) {
			
			/*
			switch (this.get('parentView.errorTab')) {
				case 1:
					this.$("#nav-tabs-proyecto").click();
					break;
				case 2:
					this.$("#nav-tabs-firmantes").click();
					break;
				case 3:
					this.$("#nav-tabs-giros").click();
					break;
			}*/
			// Nuevo Refactor 1/2	
			$("[tab-order="+ this.get('parentView.errorTab') +"]").click();
		}
	}.observes('parentView.errorTab'),

	/*
	comisionesChange: function () {
		this.get('content').set('comisiones', []);
		
		if (this.get('comisionesBicamerales') == true) {
			App.get('comisionesController').set('url', 'pap/com/comisiones/CB/E/resumen');
		} else {
			App.get('comisionesController').set('url', 'pap/com/comisiones/CD/P/resumen');
		}
		App.get('comisionesController').load();

	}.observes('comisionesBicamerales'),	
	*/

	tpsLoaded: function () {
		if (App.get('tpsController.loaded')) {
			App.get('tpsController').removeObserver('loaded', this, this.tpsLoaded);
			this.set('pubnro', App.get('tpsController.firstObject'));
		}

	},


	periodoChanged: function () {
		App.set('tpsController.periodo', this.get('content.periodo'));
		App.get('tpsController').addObserver('loaded', this, this.tpsLoaded);
	}.observes('content.periodo'),

	didInsertElement: function() {
		this._super();
		var _self = this;
		
		var chequearContent = [];
		var navtab_list_InputFocus = [];
		
		navtab_list_InputFocus['proyecto'] 	= 'camaraIniciadora';
		navtab_list_InputFocus['firmantes'] = 'searchWidgetFirmantes';
		navtab_list_InputFocus['giros'] 	= 'searchWidgetGiros';

		navtab_list = ['proyecto', 'firmantes', 'giros'];
		
		navtab_list.forEach(function(value, index){
			$("#nav-tabs-"+ value).on("click", function(){
				chequearContent[value] = setInterval(function(){
					if($("#" + value).is(":visible"))
					{
						inputClass = "." + navtab_list_InputFocus[value];
						$(inputClass + ' :input').focus();
						$(inputClass).keydown();
						clearInterval(chequearContent[value]);
					}
				}, 500);
			});

			shortcut.add("F" + (index+1),function() {
				$("#nav-tabs-"+ value).click();
			});
		});
		
		
		
			// Nuevo Refactor 2/2	
		/*
		$(".nav-tabs > li")
		.on('click', function(){ // auto focus
			var tabContent 	 = $($(this).children().attr('href'));
			var checkContent = setInterval(function(){
				if(tabContent.is(":visible")){
					tabContent.find(".tab-autofocus :input").focus();
					clearInterval(checkContent);
				}
			}, 500);
		})
		.each(function(index){ // shorcut tabs
			var _self = $(this);
			shortcut.add("F" + _self.children().attr('tab-order'), function(){ _self.children().click(); });
		});
		*/

		//this.set('content.pubFecha', moment().format("DD/MM/YYYY"));
		this.set('content.expdipA', moment().format("YYYY"));

		var _self = this;

		if (this.get('parentView.oldTP')) {
			this.set('pubnro', _self.get('parentView.oldTP'));
		}

		//if (!this.get('content.id')) {
			
			Ember.run.next(function () {
				var camara = _self.get('parentView.camarasList').findProperty('id', _self.get('content.expdipT'));
				if (camara)
					_self.get('content').set('expdipT', camara);
				else 
					_self.get('content').set('expdipT', _self.get('parentView.camarasList').get('firstObject'));
			});
		//}

		/*
		Ember.run.next(function(){
			_self.set('camaras', _self.get('camaras'));
		});
		*/


	},

	willDestroyElement: function(){
		// remove shorcut
		shorcuts = ['F1','F2','F3']
		shorcuts.forEach(function(item){
			shortcut.remove(item);
		});
	},

	uploadFolder: function () {
		return "uploads/expediente/" + this.get('content.expdip') + "/";
	}.property('content.expdip'),

	parentViewChangeTP: function () {
		_self = this;
		if (_self.get('parentView.oldTP') != _self.get('pubnro')) {
			Ember.run.next(function () { 
				_self.set('pubnro', _self.get('parentView.oldTP'));
			});
		}
	}.observes('parentView.oldTP'),

	camaraChange: function () {

		var tipo = '';

		var camara= '';

		if (this.get('content.expdipT.id')) {
			camara = this.get('content.expdipT.id')
		} else {
			return;
		}

		if (this.get('parentView.oldInit') == undefined) {
			this.set('parentView.oldInit', this.get('content.expdipT.id'));
			return;
		}

		if(camara == 'PE' || camara == 'JGM')
		{
			tipo = 'func/funcionarios';
		}
		else if(camara == 'D')
		{
			tipo = 'dip/diputados';
		}

		if (tipo == '') {
			App.get('firmantesController').set('loaded', false);
			this.get('content').set('autoridades', []);	
			App.get('firmantesController').set('content', []);
			App.get('firmantesController').set('loaded', true);
		} else {
			if(App.get('firmantesController.tipo') != tipo)
			{
				this.get('content').set('autoridades', []);
				App.get('firmantesController').set('tipo', 'pap/' + tipo);
				App.get('firmantesController').load();					
			}
		}

	}.observes('content.expdipT'),

	numeroChange: function () {
		if ((!this.get('content.expdipT.id') && !this.get('content.expdipT')) || !this.get('content.expdipN')) {
			this.get('content').set('expdip', '');
		} else {
			var expdipT = this.get('content.expdipT.id');
			if (!expdipT)
				expdipT = this.get('content.expdipT');

			this.get('content').set('expdip', this.get('content.expdipN') + "-" + expdipT + "-" + this.get('content.expdipA'));
		}
	}.observes('content.expdipT', 'content.expdipN', 'content.expdipA'),

	changeExdip: function(){
		var _self = this;
		if((this.get('content.expdipN') && this.get('content.expdipA')) && (this.get('content.expdipN').length == 4 && this.get('content.expdipA').length == 4))
		{		
			App.proyectosController = App.ProyectosController.create({ content: []});
			App.get('proyectosController').set('query', App.ProyectoQuery.extend(App.Savable).create({expediente: this.get('content.expdip')}));

			fn = function() {
				if (App.get('proyectosController.loaded'))
				{
					App.get('proyectosController').removeObserver('loaded', this, fn);									

					if(App.get('proyectosController.recordcount') > 0)
					{
						_self.get('parentView').set('expedienteExist', true);
					}
					else
					{
						_self.get('parentView').set('expedienteExist', false);
					}
				}
			};

			App.get('proyectosController').addObserver('loaded', this, fn);
			App.get('proyectosController').load();
		}
		else{
			_self.get('parentView').set('expedienteExist', false);
		}
	}.observes('content.expdipN', 'content.expdipA'),

	duplicarCancelar: function(){
		this.get('parentView').set('expedienteExist', false);
		this.set('content.expdipN', '');
		$("#expNum").focus();
	},

	duplicar: function(exp){
		if(App.get('proyectosController.recordcount') == 1)
		{
			var getId = App.get('proyectosController.content.firstObject.id');			
			var ex = App.Expediente.extend(App.Savable).create({id: getId});			
			var _self = this;

			ex.set('loaded', false);
			this.set('content.duplicando', true);

			var deferred = $.Deferred(),

			fn2 = function() {
                if (App.get('comisionesController.loaded'))
                {
                    App.get('comisionesController').removeObserver('loaded', this, fn2);
                   	ex.addObserver('loaded', this, fn);
            		ex.load();
                }
			}

			App.get('comisionesController').addObserver('loaded', this, fn2);
			App.get('comisionesController').load();

			fn3 = function () {
				if (App.get('tpsController.loaded') && App.get('firmantesController.loaded')) 
				{
					App.get('firmantesController').removeObserver('loaded', this, fn3);

					ex.desNormalize(); 
					ex.set('autoridades', []);

					var orden = 1;

					ex.get('firmantes').forEach(function (firmante){
						var f = App.get('firmantesController').findProperty('label', firmante.nombre);

						if (f)
						{
							f.set('orden', ++orden);
							ex.get('autoridades').addObject(f);
						}
					}, this);

					deferred.resolve(ex);	
					
					if(ex.get('loaded'))
					{
						this.set('content.duplicando', false);

						_self.get('parentView').set('expedienteExist', false);
						_self.set('content.comisiones', ex.comisiones);

						var titulo = ex.titulo;
						titulo = titulo.substring(0, titulo.length - 1);
						titulo = titulo + " (" + ex.expdip + ", REPRODUCIDO)."

 				 		Ember.run.next(function(){		
 				 			_self.set('content.expdipN', '');
 				 			_self.set('content.expdipA', moment().format('YYYY'));
 				 			_self.set('content.titulo', titulo);
 				 			//_self.set('content.periodo', ex.periodo);
 				 			_self.set('content.iniciado', ex.iniciado);
 				 			_self.set('content.tipo', ex.tipo);
 				 			_self.set('content.ReproduceExp', ex.expdip);
 				 		});						
					}
				}
			};

			fn = function() {
			   if (ex.get('loaded'))
			   {
                   ex.removeObserver('loaded', this, fn);

					App.get('firmantesController').addObserver('loaded', this, fn3);

				    var tipo = '';

					if(ex.get('expdipT') == 'PE' || ex.get('expdipT') == 'JGM')
					{
						tipo = 'func/funcionarios';
					}					
					else if(ex.get('expdipT') == 'D')
					{
						tipo = 'dip/diputados';
					} 	

					if (tipo == '')
					{
						App.get('firmantesController').set('content', []);
						App.get('firmantesController').set('loaded', true);
					}
					else
					{
						if(App.get('firmantesController.tipo') != tipo)
						{
							App.get('firmantesController').set('tipo', 'pap/' + tipo);
							App.get('firmantesController').load();					
						}
					}

					var regex = new RegExp('MENSAJE');

					if (regex.test(ex.get('tipo')))
					{
						regex = new RegExp('LEY');

						if (regex.test(ex.get('tipo')))
						{
							ex.set('conLey', true);
						}

						ex.set('tipo', 'MENSAJE');
					}

			   }
            };                                                                             

		}
	},
	
	changeNumeroTP: function(){		
		if(App.get('tpsController.arrangedContent'))
		{
			var tpSelect = App.get('tpsController.arrangedContent').findProperty('numero', this.get('content.pubnro'));
			if(tpSelect)
			{
				var tp = App.TP.extend(App.Savable).create({id: tpSelect.id})
				App.tpConsultaController = App.TPConsultaController.create();
				App.set('tpConsultaController.content', tp);
				this.set('puedeVerPreviewTramiteParlamentario', true);
			}
			
			/*
			if(tpSelect)
			{		
				var tp = App.TP.extend(App.Savable).create({id: tpSelect.id})

				tp.set('loaded', false);
				var deferred = $.Deferred(),
				fn = function() {
					App.tpConsultaController = App.TPConsultaController.create();
					this.set('puedeVerPreviewTramiteParlamentario', true);
					App.set('tpConsultaController.content', tp);

				    tp.removeObserver('loaded', this, fn);
				    deferred.resolve(tp);
				};

				tp.addObserver('loaded', this, fn);
				tp.load();
			}
			*/
		}
//	}.observes('content.pubnro', 'content.expdipT'),
	}.observes('content.pubnro'),
	previewTramiteParlamentario: function(){
		//this.changeNumeroTP();
		App.PreviewTramiteParlamentarioView.popup();
	},
	cancelarPreviewTramiteParlamentario: function(){
		this.set('puedeVerPreviewTramiteParlamentario', false);
	},
});

App.ExpedienteFormDeclaracionView = App.ExpedienteFormLeyView.extend({
	templateName: 'expediente-form-ley'
});

App.ExpedienteFormResolucionView = App.ExpedienteFormLeyView.extend({
	templateName: 'expediente-form-ley'
});

App.ExpedienteFormLeyRevisionView = App.ExpedienteFormLeyView.extend({
	templateName: 'expediente-form-ley-revision',
	msgNro: '',
	msgFecha: null,
	msgTipo: '',

});

App.ExpedienteFormMensajeView = App.ExpedienteFormLeyView.extend({
	templateName: 'expediente-form-mensaje',
	msgNro: '',
	msgTipo: '',
	
	msgValueChange: function () {
		var add = '';

		if (this.get('conLey')) {
			add = " Y PROYECTO DE LEY";
		}

		this.set('msgTipo', 'MENSAJE ' + this.get('content.mjeNum') + add);
		this.get('parentView').set('expTipo', this.get('msgTipo'));

	}.observes('content.mjeNum', 'conLey'),

	didInsertElement: function () {
		this._super();

		if (this.get('content.conLey')) {
			this.set('conLey', this.get('content.conLey'));
		}
	},
});

App.CrearGiroView = Ember.View.extend({
	templateName: 'crear-giro',

	guardar: function () {
		this.get('content').addObserver('createSucceeded', this.createSucceeded);
		this.get('content').create();
	},

	createSucceeded: function () {
		if (this.get('content.createSucceeded')) {
		} else {

		}
	},

	didInsertElement: function () {
		this._super();
		this.set('content', App.Giro.extend(App.Savable).create());
	}
});


App.GirosView = Ember.View.extend({
	templateName: 'giros',
});

App.GiroListItemView = Ember.View.extend({
	tagName: 'tr',
	classNames: ['gradeX'],
	templateName: 'reunion',
});

App.GirosListView = App.ListFilterView.extend({
	itemViewClass: App.GiroListItemView,
//	columnas: ['Fecha', 'Nota', 'Comisiones convocadas'],
	columnas: ['Fecha giro ', 'Expediente', 'Comisiones'],
});

App.HelpView = Ember.View.extend({
	templateName: 'help',
});



//Biography

App.BiographyView = Ember.View.extend({
	templateName: 'biography',

	puedeEditar: function(){
		return App.get('userController').hasRole('ROLE_ALERTA_TEMPRANA_EDIT') 
	}.property('App.userController.user'),

	edit: function () {

		App.bloquesController = App.BloquesController.create();
		App.interBloquesController = App.InterBloquesController.create();


		fn = function() {
			if (App.get('bloquesController.loaded') && App.get('interBloquesController.loaded')) {
				var biography;
					biography = App.Biography.extend(App.Savable).create(this.get('content'));
					biography.set('bloque', App.bloquesController.findProperty('nombre', this.get('content').get('bloque.nombre')));
					biography.set('interBloque', App.interBloquesController.findProperty('nombre', this.get('content').get('interBloque.nombre')));
					biography.set('url', 'biographys/biography/' + this.get('content').get('id') + '/');
					biography.set('noConcatURL', true);

				var exp = this.get('parentView.controller.content');
				if (!exp)
					exp = App.get('expedienteConsultaController.content');


				App.biographyController = App.BiographyController.create({
					content: biography,
					expediente: exp,
				});

				App.CreateBiographyView.popup();
			}
		};


		App.get('bloquesController').addObserver('loaded', this, fn);
		App.get('interBloquesController').addObserver('loaded', this, fn);

		App.get('bloquesController').load();
		App.get('interBloquesController').load();			
	},
});

App.CreateBiographyView = App.ModalView.extend({
	templateName: 'biography-create',
	observaciones: '',
	prioridades: ['ALTA', 'MEDIA', 'BAJA'],
	formValid: false,

	callback: function(opts, event){
		if (opts.primary) {
			_self = this;

			if($('#formCrearAlertaTemprana').parsley('validate'))
				this.set('formValid', true);
			else
				this.set('formValid', false);			

			if(this.get('formValid'))
			{					
				if (this.get('content.id')) {
					this.get('content').addObserver('saveSuccess', function () {
						if (this.get('saveSuccess')) {
							if (_self.get('expediente'))
								_self.get('expediente').set('biografia', this);
						}
					});
					this.get('content').save();
				} else {
					this.get('content').addObserver('createSuccess', function () {
						if (this.get('createSuccess')) {
							if (_self.get('expediente'))
								_self.get('expediente').set('biografia', this);
						}
					});
					this.get('content').create();
				}
				return true;
			}else{
				return false;
			}
			
		} else if (opts.secondary) {
			//alert('cancel')
		} else {
			//alert('close')
		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();
		this.set('content', App.get('biographyController.content'));
		this.set('expediente', App.get('biographyController.expediente'))
	}, 
});


App.CreateBiographyInfoView = App.ModalView.extend({
	templateName: 'biography-info-create',

	callback: function(opts, event){
		if (opts.primary) {

			this.get('content.bloques').forEach(function (bloque) {
				bloque.resumen = this.$('#' + bloque.id).val();
			})

			$.download('exportar', "&type=informebio&data=" + JSON.stringify(this.get('content')));
		} else if (opts.secondary) {

		} else {

		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();
		this.set('content', App.get('biographyInfoController').get('content'));
	}, 
});

// Visitas Guiadas

App.VisitasGuiadasListItemView = Ember.View.extend({
	templateName: 'visitas-guiadas-list-item',
	tagName: 'tr',
	//classNames: ['gradeX'],
	//classNameBindings: 'content.asistencia:asistencia',
	classNames: ['gradeX'],

	didInsertElement: function () {
		this._super();
		this.$('span').tooltip();
		//console.log(this.get('content.asistencia'));
	},
});

//App.VisitasGuiadasListView = App.ListFilterView.extend({
App.VisitasGuiadasListView = App.ListFilterWithSortView.extend({
	itemViewClass: App.VisitasGuiadasListItemView,
	//columnas: ['Contacto', 'Fecha', 'Provincia', 'Tipo de visita','Nivel de alumnos', 'Visitantes', 'Detalles'],
	templateName: 'simple-list-whit-date-range',
	classNames: ['no-sorting'],
	fechaDesde: '',
	fechaHasta: '',

	columnas: [
		App.SortableColumn.create({nombre: 'Contacto', campo: 'razonSocial'}), 
		App.SortableColumn.create({nombre: 'Fecha', campo: 'fechaPreferencia'}),
		App.SortableColumn.create({nombre: 'Provincia', campo: 'provincia'}),
		App.SortableColumn.create({nombre: 'Tipo de visita', campo: 'visitaPara'}),
		App.SortableColumn.create({nombre: 'Nivel de alumnos', campo: 'nivelAlumnos'}),
		App.SortableColumn.create({nombre: 'Visitantes', campo: 'visitantes'}),
		App.SortableColumn.create({nombre: 'Detalles', campo: ''}),
	],	

	lista: function (){
		this.set('content', App.get('visitasGuiadasController.arrangedContent'));

		var _self = this;
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered;

		var fechaDesde = this.get('fechaDesde');
		var fechaHasta = this.get('fechaHasta');

		Ember.run.next(function() {			
			_self.$('table').removeHighlight();

			if(_self.get('filterText') && _self.get('filterText').length > 0){
				_self.$('td').highlight(_self.get('filterText'));
			}
		});

		if(this.get('content'))
		{
			filtered = this.get('content').filter(function(item){				
				if(fechaDesde && fechaHasta){
					var itemFecha = item.get('fechaPreferencia');
					if(itemFecha){
						var fechaDesdeFormat = fechaDesde.substring(6,10) + "-" + fechaDesde.substring(3,5) + "-" + fechaDesde.substring(0,2);
						var fechaHastaFormat = fechaHasta.substring(6,10) + "-" + fechaHasta.substring(3,5) + "-" + fechaHasta.substring(0,2);
						return regex.test(item.get('label').toLowerCase()) && itemFecha.date >= fechaDesdeFormat && itemFecha.date <= fechaHastaFormat;
					}										
				}else{
					return regex.test(item.get('label').toLowerCase());
				}
				
//				return regex.test(item.get('label'));
			});

			

		}


		if (!filtered)
			filtered = [];

		var max = this.get('totalRecords');
		if (filtered.length <= max) {
			max = filtered.length;
			this.set('mostrarMasEnabled', false);
		} else {
			this.set('mostrarMasEnabled', true);
		}
		this.set('count', filtered.length);		
		return filtered.slice(0, this.get('totalRecords'));
//	}.property('filterText', 'content', 'totalRecords', 'step', 'content.@each', 'fechaDesde', 'fechaHasta'),
	}.property('filterText', 'content', 'totalRecords', 'step', 'fechaDesde', 'fechaHasta', 'sorting', 'App.visitasGuiadasController.arrangedContent'),

	limpiar: function (){
		this.set('fechaDesde','');
		this.set('fechaHasta','');
		this.set('filterText','');
		
	},
	exportar: function () {
		$.download('exportar/visitas-guiadas', "&type=visitas-guiadas&data=" + JSON.stringify(this.get('lista')));
	},	

	didInsertElement: function(){
		this._super();
		this.set('exportarEnabled', true);
	},

	changeFilterText: function () {
		_self = this;
		if (this.get('intervalText'))
			clearInterval(_self.get('intervalText'));

		var i = setInterval(function () {
			clearInterval(_self.get('intervalText'));	
			_self.set('sorting', ! _self.get('sorting'));
		}, 800);
		this.set('intervalText', i);
	}.observes('filterText'),
});

App.VisitasGuiadasView = Ember.View.extend({
	templateName: 'visitas-guiadas',
	content: '',
	contentCount: 0,


	willInsertElement: function(){
		this.set('content', App.get('visitasGuiadasController.arrangedContent'));
	}

});

App.VisitaGuiadaConsultaView = Ember.View.extend({
	templateName: 'visita-guiada-consulta',
	content: '',

	horariosEstipulados: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],

	willInsertElement: function(){
		this.set('content', App.get('visitaGuiadaConsultaController.content'));
	},

	aprobar: function () {

		if(this.get('content.fechaEstipulada')){
			var day = moment(this.get('content.fechaEstipulada'), 'DD/MM/YYYY').format('d');
			if(day == 3){
				this.get('content').set('esMiercoles', true);
			}else{
				this.get('content').set('esMiercoles', false);
			}
		}
		
		this.get('content').set('aprobado', true);
		this.get('content').addObserver('aproveSuccess', this, this.aproveSuccessed);
		this.get('content').aprove();	

		var audit = App.Audit.extend(App.Savable).create();
		audit.set('tipo', 'Test');
		audit.set('accion', 'Aprobado');
		audit.set('usuario', App.get('userController.user.cuil'));
		audit.set('objeto', this.get('content').constructor.toString());
		audit.set('objetoId', this.get('content').id);
		audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
		audit.create();	
	},

	guardar: function(){
		//App.get('visitaGuiadaConsultaController').save();
		this.get('content').addObserver('saveSuccess', this, this.saveSuccessed);
		this.get('content').save();
		if(this.get('content').contactado){
			var audit = App.Audit.extend(App.Savable).create();
			audit.set('tipo', 'Test');
			audit.set('accion', 'Contactado');
			audit.set('usuario', App.get('userController.user.cuil'));
			audit.set('objeto', this.get('content').constructor.toString());
			audit.set('objetoId', this.get('content').id);
			audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
			audit.create();
		}
	},

	aproveSuccessed: function () {
		this.get('content').removeObserver('aproveSuccess', this, this.createSucceeded);
		if (this.get('content.aproveSuccess')) {
			$.jGrowl('Se han guardado las modificaciones realidazas!', { life: 5000 });
		} else if (this.get('aproveSuccess') == false) {
			$.jGrowl('Ocurrio un error al realizar las modificaciones!', { life: 5000 });
		}
	},

	saveSuccessed: function () {
		this.get('content').removeObserver('saveSuccess', this, this.createSucceeded);
		if (this.get('content.saveSuccess')) {
			App.visitasGuiadasController = App.VisitasGuiadasController.create();

			fn = function() {
					if(App.get('visitasGuiadasController.loaded'))
					{
						App.get('visitasGuiadasController').removeObserver('loaded', this, fn);	
						App.get('router').transitionTo('visitasGuiadas.index')
					}
			};

			App.get('visitasGuiadasController').addObserver('loaded', this, fn);

			App.get('visitasGuiadasController').load();                      
						
						
			$.jGrowl('Se han guardado las modificaciones realidazas!', { life: 5000 });
		} else if (this.get('saveSuccess') == false) {
			$.jGrowl('Ocurrio un error al realizar las modificaciones!', { life: 5000 });
		}
	},   

	audits: function(){
		return App.get('auditController');
	}.property('App.auditController.content'),

	borrar: function (){

		App.confirmActionController.setProperties({
			title: 'Confirmar la baja de la visita',
			message: '¿ Confirma que desea dar de baja la visita de ' + this.get('content.razonSocial')+ ' ?',
			success: null,
		});
		
		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();


	},

	confirmActionDone: function(){

		if (App.get('confirmActionController.success')) {
			App.get('confirmActionController.success').removeObserver('success', this, this.confirmActionDone);
			this.set('content.url', 'visitas-guiadas/visita/delete')
			var visita = App.VisitaGuiada.extend(App.Savable).create(this.get('content'));
			visita.delete();

			App.visitasGuiadasController = App.VisitasGuiadasController.create();

			fn = function() {
					if(App.get('visitasGuiadasController.loaded'))
					{
						App.get('visitasGuiadasController').removeObserver('loaded', this, fn);	
						App.get('router').transitionTo('visitasGuiadas.index')
					}
			};

			App.get('visitasGuiadasController').addObserver('loaded', this, fn);

			App.get('visitasGuiadasController').load();                      
						
						
			$.jGrowl(jGrowlMessage.bajaVisita.message, { life: jGrowlMessage.bajaVisita.life });
		} else {
			if (typeof App.get('confirmActionController.success') == "Boolean") {
				App.get('confirmActionController.success').removeObserver('success', this, this.confirmActionDone);
				$.jGrowl('No se ha podido eliimnar la visita!', { life: jGrowlMessage.bajaVisita.life });
			}
		}
	},

});

App.VisitasGuiadasEstadisticasView = Ember.View.extend({
	templateName: 'visitas-guiadas-estadisticas',
	categories: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],

	didInsertElement: function(){
		this._super();
	}
});

App.VisitasGuiadasEstadisticasTableItemView = Ember.View.extend({
	templateName: 'visitas-guiadas-estadisticas-table-item'
});

App.VisitasGuiadasEstadisticasTableView = App.ListFilterView.extend({
	columnas: ["Provincias", "Visitantes"],
	itemViewClass: App.VisitasGuiadasEstadisticasTableItemView,
});


App.ExpedientesBiographyView = Ember.View.extend({
	templateName: 'expedientes-biography',
	/*
	hayExpedientesSeleccionados: function(){
		var expedientes = App.get('expedientesController.content').filterProperty('seleccionado', true);

		if(expedientes.length > 0)
		{
			return true;
		}
		else
		{
			return false;
		}

	}.property('App.expedientesController.content.@each'),
	*/
	generarInforme: function () {
		var expedientes = App.get('proyectosController.content').filterProperty('seleccionado', true);
		var bloquesInfo = [];
		var bloques = [];

		expedientes.forEach(function ( expediente ) {
			var bio = expediente.get('biografia');

			if (bio) {
				bloque = bloques.findProperty('id', bio.get('interBloque.id'));

				if (!bloque) {
					bloque = Ember.copy(bio.get('interBloque'));
					bloque.resumen = "";
					bloque.proyectos = [];
					bloques.pushObject(bloque);
				}

				var proyectoTipo = bloque.proyectos.findProperty('nombre', expediente.get('tipo'));

				if (!proyectoTipo) {
					proyectoTipo = {nombre: expediente.get('tipo'), total: 0}
					bloque.proyectos.pushObject(proyectoTipo);
				}

				proyectoTipo.total += 1;
			}

		});

		App.biographyInfoController = Ember.ObjectController.create({
			content: {
				bloques: bloques,
				expedientes: expedientes,
			}
		});


		App.CreateBiographyInfoView.popup();
	},

	puedeEditar: function(){
		return App.get('userController').hasRole('ROLE_ALERTA_TEMPRANA_EDIT') 
	}.property('App.userController.user'),
});



App.ExpedienteBiographyItemView = Ember.View.extend({
	tagName: 'tr',
	classNames: ['gradeX'],
	templateName: 'expediente-biography-item',
	biographyRoleRequire: 'ROLE_ALERTA_TEMPRANA', 

	puedeEditar: function(){
		return App.get('userController').hasRole('ROLE_ALERTA_TEMPRANA_EDIT') 
	}.property('App.userController.user'),
	createBiography: function () {		
		var biography;

		if (this.get('content').get('biografia')) {
			biography = App.Biography.extend(App.Savable).create(this.get('content').get('biografia'));
			biography.set('bloque', App.bloquesController.findProperty('nombre', biography.get('bloque.nombre')));
			biography.set('interBloque', App.interBloquesController.findProperty('nombre', biography.get('interBloque.nombre')));
			biography.set('url', 'biographys/biography/' + biography.get('id') + '/');
			biography.set('noConcatURL', true);
		}
		else {
			biography = App.Biography.extend(App.Savable).create({
				expNro: this.get('content').expdip, 
//				expsen: this.get('content').expsen, 
				idProyecto: this.get('content').id
			});

		}
		App.biographyController = App.BiographyController.create({
			content: biography,
			expediente: this.get('content'),
		});

		App.CreateBiographyView.popup();
	},


	didInsertElement: function () {
		this._super();
		if (App.get('userController').hasRole(this.get('biographyRoleRequire'))) {
			this.get('content').loadBiography();
		}
	}

});


App.ExpedientesBiographyListView = App.ListFilterWithSortView.extend({
	templateName: 'expedientes-sortable-list',
	itemViewClass: App.ExpedienteBiographyItemView,
	loading: false,

	mostrarMas: function () {
		this.set('scroll', $(document).scrollTop());
		App.get('proyectosController').set('loaded', false);
		App.get('proyectosController').nextPage();
		this.set('loading', true);
	},

	expedientesLoaded: function () {
		if (App.get('proyectosController.loaded')) {
			this.set('loading', false);
		}
		else
		{
			this.set('loading', true);
		}
	},

	columnas: [
		App.SortableColumn.create({nombre: 'Nro. de expediente', campo: 'expdip'}), 
		App.SortableColumn.create({nombre: 'Tipo', campo: 'tipo'}),
		App.SortableColumn.create({nombre: 'Título', campo: 'titulo'}),
		App.SortableColumn.create({nombre: 'Alerta temprana'}),
		App.SortableColumn.create({nombre: 'Incluir en el informe'}),
	],	


	didInsertElement: function(){
		this._super();
		App.get('proyectosController').addObserver('loaded', this, this.expedientesLoaded);
		App.get('proyectosController').set('pageSize', 25);
		this.set('mostrarMasEnabled', false);
	},

	lista: function () {
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('proyectosController').get('arrangedContent').filter(function(proyecto){
			return regex.test((proyecto.tipo + proyecto.titulo + proyecto.expdip + proyecto.get('firmantesLabel') + proyecto.get('girosLabel')).toLowerCase());
		});

		this.set('mostrarMasEnabled', true);
		return filtered;
	}.property('filterText', 'App.proyectosController.arrangedContent.@each', 'totalRecords'),

});


App.LineSeriesChartView = Ember.View.extend({
	attributeBindings: ['title', 'name', 'categories', 'content', 'tooltip'],

	didInsertElement: function(){
		this._super();
		Ember.run.next(this, this.redrawChart);
	},
	redrawChart: function(){
		this.$().highcharts({
			title: {
				text: this.get('title'),
				x: -20 //center
			},
			subtitle: {
				text: '',
				x: -20
			},
			xAxis: {
				categories: this.get('categories')
			},
			yAxis: {
				title: {
					text: ''
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#808080'
				}]
			},
			tooltip: {
				valueSuffix: " " + this.get('tooltip')
			},
			legend: {
				layout: 'vertical',
				align: 'right',
				verticalAlign: 'middle',
				borderWidth: 0
			},

			series: this.get('content'),
		});
	}.observes('content.@each'),
});


//Publicaciones
// -> TP

App.TPListItemView = Ember.View.extend({
	templateName: 'tp-list-item',

	borrar: function () {
		App.confirmActionController.setProperties({
			title: 'Confirmar borrar Trámite Parlamentario',
			message: '¿ Confirma que desea borrar el Trámite parlamentario N° ' + this.get('content.numero') + ' con fecha ' + moment(this.get('content.fecha'), 'YYYY-MM-DD HH:mm').format('LL') +  ' ?',
			success: null,
		});
		
		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();		
	},

	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);
		
		if (App.get('confirmActionController.success'))
		{
			this.get('content').addObserver('deleteSuccess', this, this.deleteSuccess);
			this.get('content').delete();
		}

	},	

	deleteSuccess: function () {
		if (this.get('content.deleteSuccess') == true) {

			this.get('content').removeObserver('deleteSuccess', this, this.deleteSuccess);

			if (App.tpsController)
				App.get('tpsController').removeObject(this.get('content'));

			$.jGrowl('Se ha elimiado el Trámite Parlamentario!', { life: 5000 });

		} else if (this.get('content.deleteSuccess') == false && this.get('content.deleteSuccess') != '') {
			$.jGrowl('No se ha eliminado el Trámite Parlamentario!', { life: 5000 });
		}
	},	
});

App.TPListView = App.ListFilterView.extend({
	columnas: ["Número", "Período", "Fecha", ""],
	itemViewClass: App.TPListItemView,
});

App.TPsView = Ember.View.extend({
	templateName: 'tps',
	periodos: [124, 125, 126, 127, 128, 129, 130, 131, 132].reverse(),
});

App.TPCrearView = Ember.View.extend({
	templateName: 'crear-tp',	
	periodos: [124, 125, 126, 127, 128, 129, 130, 131, 132].reverse(),
	fecha: '',
	clickGuardar: false,
	validateFields: false,
	validateNumero: false,
	
	didInsertElement: function(){
		this._super();
		this.set('fecha', moment().format("DD/MM/YYYY"));
	},
	crear: function(){
		this.set('clickGuardar', true);


		if($('#formCrearTP').parsley('validate'))
		{

			App.confirmActionController.setProperties({
				title: 'Confirmar creación de Trámite Parlamentario',
				message: '¿ Confirma que desea crear el Trámite parlamentario N° ' + this.get('controller.content.numero') + ' con fecha ' + this.get('fecha') +  ' ?',
				success: null,
			});
			
			App.confirmActionController.addObserver('success', this, this.confirmActionDone);
			App.confirmActionController.show();			
		} 
	},

	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);
		
		if (App.get('confirmActionController.success'))
		{
			while (this.get('controller.content.numero').length < 3)
			{
	            this.set(('controller.content.numero'),  '0' + this.get('controller.content.numero'));
	        }

			this.set('controller.content.fecha', this.get('fecha'));
			
			this.get('controller').crear();
		}

	},

})

App.TPConsultaView = Ember.View.extend({
	templateName: 'tp-consulta',
	loading: false,
	url: '',
	withGiros: true,
	creating: false,



	borrar: function () {
		App.confirmActionController.setProperties({
			title: 'Confirmar eliminar Trámite Parlamentario',
			message: '¿ Confirma que desea eliminar el Trámite parlamentario N° ' + this.get('controller.content.numero') + ' con fecha ' + moment(this.get('controller.content.fecha'), 'YYYY-MM-DD HH:mm').format('LL') +  ' ?',
			success: null,
		});
		
		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();		
	},

	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);
		
		if (App.get('confirmActionController.success'))
		{
			this.get('controller.content').addObserver('deleteSuccess', this, this.deleteSuccess);
			this.get('controller.content').delete();
		}

	},	

	deleteSuccess: function () {
		if (this.get('controller.content.deleteSuccess') == true) {

			this.get('controller.content').removeObserver('deleteSuccess', this, this.deleteSuccess);

			App.tpsController = App.TPsController.create();		

			fn = function() {
				if (App.get('tpsController.loaded'))
				{
					App.get('tpsController').removeObserver('loaded', this, fn);
					App.get('router').transitionTo('root.publicaciones.tp.listado');
				}
			};

			App.get('tpsController').addObserver('loaded', this, fn);

			App.get('tpsController').load();

			$.jGrowl('Se ha elimiado el Trámite Parlamentario!', { life: 5000 });

		} else if (this.get('controller.content.deleteSuccess') == false && this.get('controller.content.deleteSuccess') != '') {
			$.jGrowl('No se ha eliminado el Trámite Parlamentario!', { life: 5000 });
		}
	},	

	documentURL: function () {
		var url = this.get('controller.content.url');

		if (this.get('controller.content').get('useApi'))
		{
			url = App.get('apiController.url') + url;
		}

		return url + "/" + this.get('controller.content.periodo') + "/" + this.get('controller.content.numero') + "/" + this.get('withGiros') + "/docxpath";
	}.property('controller.content', 'withGiros'),

	urlHTML: function () {
		return "publicaciones/generate/tpzip/" + this.get('controller.content.periodo') + "/" + this.get('controller.content.numero');
	}.property('controller.content'),

	exportar: function () {
		var _self = this;
		_self.set('creating', true);
		$.ajax({

		    url: this.get('documentURL'),
		    type: 'GET',

		    success: function(data) {
		    	_self.set('creating', false);
		    	$.download(App.get('apiController.tomcat') + data, '&data=data');

				var audit = App.Audit.extend(App.Savable).create();
				audit.set('tipo', 'TP');
				audit.set('accion', 'Confeccionar Documento');
				audit.set('usuario', App.get('userController.user.cuil'));
				audit.set('objeto', _self.get('controller.content').constructor.toString());
				audit.set('objetoId', _self.get('controller.content.id'));
				audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
				audit.create();				
		    },
		    complete: function(){
		    	_self.set('creating', false);
		    }
		});
	},

	confeccionarTP: function () {
		return App.get('userController').hasRole('ROLE_PUBLICACIONES_EDIT') 
	}.property('App.userController.user'),

	publish: function () {
		this.set('loading', true);
		$.ajax({
			url:  'publicaciones/generate/tp',
			dataType: 'JSON',
			type: 'POST',
			context: this,
			contentType: 'text/plain',
			crossDomain: 'true',			
			data : this.get('controller.content').getJson(),
			success: this.createSucceded,
			complete: this.createCompleted,
		});		
	},

	createSucceded: function (data) {
		if (data.success) {
			//
			this.set('url', data.url);
			this.set('loading', false);
		}
	},

	createCompleted: function (data) {
	},

	puedeEliminar: function () {
		if (App.get('userController').hasRole('ROLE_PUBLICACIONES_EDIT'))
			return true;
		else
			return false;
	}.property('App.userController.user'),


});

App.ComisionesListItemView = Ember.View.extend({
	templateName: 'comisiones-list-item',
	tagName: 'tr',
	classNames: ['gradeX'],
});

App.ComisionesListadoView = Ember.View.extend({
	templateName: 'comisiones',
	content: '',
});

App.ComisionesListView = App.ListFilterView.extend({
	itemViewClass: App.ComisionesListItemView,
	columnas: ['Id','Nombre','Ver Comisión'],
});

App.ComisionesConsultaView = Ember.View.extend({
    templateName: 'comisiones-consulta',
});


App.ComisionesConsultaListItemView = Ember.View.extend({
	templateName: 'comisiones-consulta-list-item',
	tagName: 'tr',
	classNames: ['gradeX'],
});

App.ComisionesConsultaListView = App.ListFilterView.extend({
	itemViewClass: App.ComisionesConsultaListItemView,
	columnas: ['Cargo','Tipo','Diputado /a','Bloque','Fecha Inicio Mandato','Fecha Fin Mandato'],
});




App.SelectableView = Ember.View.extend({
	templateName: 'wg-select',

	controllerContentChanged: function () {
		if (this.get('contentController').get('loaded')) {
			this.get('contentController').removeObserver('loaded', this, this.controllerContentChanged);
		}
	},

	didInsertElement: function () {
		this._super();
		this.set('contentController', App.get(this.get('controllerName')).create({content: []}));
		this.get('contentController').addObserver('loaded', this, this.controllerContentChanged);
		this.get('contentController').load();
	},

});


App.TestView = Ember.View.extend({
	templateName: 'wg-test',
	roles: [],
	funciones: [],

	content: [],

	publish: function () {

		$.ajax({
			url:  'publicaciones/generate/tp',
			dataType: 'JSON',
			type: 'POST',
			context: this,
			contentType: 'text/plain',
			crossDomain: 'true',			
			data : JSON.stringify(json),
			success: this.createSucceded,
			complete: this.createCompleted,
		});		
	},

	createSucceded: function (data) {
		//console.log(data);
		if (data.success) {
			alert(data.url);
		}
	},

	createCompleted: function (data) {
		//console.log(data);
	},


	willInsertElement: function () {
		/*
		for (var i=0; i < 100; i++) {
			this.get('content').addObject({label: 'pepe' + i});
		}
		*/
	},

	didInsertElement: function () {
		this._super();
	},	
});


App.LoaderView = Ember.View.extend({
	templateName: 'wg-loader',

})

App.SelectListItemView = Ember.View.extend({
	tagName: "li",
	templateName: 'wg-multiselect-select-list-item',
	classNames: ['selectable'],

	label: function () {
		return this.get('content').get(this.get('labelPath'));
	}.property('content'),

	clickItem: function () {
		this.get('parentView').clickItem(this.get('content'));
	},

	clickMoverArribaInTema: function (){
		this.get('parentView').get('parentView').clickMoverArribaInTema(this.get('content'));
	},

	clickMoverAbajoInTema: function (){
		this.get('parentView').get('parentView').clickMoverAbajoInTema(this.get('content'));
	},

});


App.SelectListItemVSelectediew = App.SelectListItemView.extend({
	classNames: ['selected'],
});

App.SelectListItemFirmanteView = App.SelectListItemView.extend({
	templateName: 'wg-multiselect-select-list-item-firmante',
});

App.SelectListItemFirmanteSelectedView = App.SelectListItemFirmanteView.extend({
	classNames: ['selected'],
});


App.SelectListView = App.JQuerySortableView.extend({
	tagName: "ul",

	clickItem: function (item) {
		this.get('parentView').selectedItem(item);
	},

	emptyView: Ember.View.extend({
	    template: Ember.Handlebars.compile('<label class="empty-view pull-left w75-real">No hay elementos para mostrar.</label>')
	}),

	createChildView: function(viewClass, attrs) {
		if (attrs) {
			attrs['labelPath'] = this.get('labelPath');
		}
	    return this._super(viewClass, attrs);
	},

	updateSort : function (idArray){
		var sortArr = this._super(idArray);
	},	
});


App.MultiSelectListView = Ember.View.extend({
	templateName: 'wg-multiselect',
	itemViewClass: 'App.SelectListItemView',
	itemSelectedViewClass: 'App.SelectListItemVSelectediew',
	selection: [],
	threshold: 3,
	delayFilter: 0,
	interval: null,
	filterPath: 'nombre',
	labelPath: 'nombre',
	suggestable: false,
	tabindex: 0,
	content: [],
	matchPosition: 'ANY',

	selectionAc: null,
	contentAc: null,


	filterTextChanged: function () {
		_self = this;
		if (this.get('interval'))
			clearInterval(this.get('interval'));		

		this.set('interval', setInterval(function () {
			_self.filterData();
			clearInterval(_self.get('interval'));
		}, this.get('delayFilter')));
	}.observes('filterText'),

	selectionChanged: function () {
		if (!this.get('suggestable') && this.get('selection.length') > 0)
			this.get('contentController').load();
		this.get('selectionAc').set('content', this.get('selection'));
	}.observes('selection'),

	filterData: function () {
		if (this.get('suggestable'))
		{
			if (this.get('filterText').length >= this.get('threshold')) {
				this.get('contentController').filter(this.get('filterText'));
			} else {
				this.get('contentController').set('content', []);
			}
		} else {
			if (this.get('filterText').length >= this.get('threshold')) {
				var regex = null;

				switch (this.get('matchPosition')) {
					case 'LEFT':
						regex = new RegExp('^' + this.get('filterText').toString().toLowerCase());
						break;
					case 'ANY':
						regex = new RegExp(this.get('filterText').toString().toLowerCase());
						break;
				}

				filtered = this.get('contentController').get('arrangedContent').filter(function(c){
					return regex.test(c.get(this.get('labelPath')).toString().toLowerCase());
				}, this);

				var selectionNews = [];

				this.get('selection').forEach(function(i) {
					var item = filtered.findProperty('id', i.get('id'));
					selectionNews.addObject(item);
				}, this);

				filtered.removeObjects(selectionNews);				

				this.set('contentAc.content', filtered);
			} else {
				this.set('contentAc.content', this.get('contentController').get('arrangedContent'));
			}
		}

		if (this.get('contentAc.content'))
			this.set('contentAc.content', this.get('contentAc.content').slice(0, 20));
			
		_self = this;
		Ember.run.next(function() {
			_self.$('.search ul').removeHighlight();
			if (_self.get('filterText').length >= _self.get('threshold')) {
				_self.$('.search li').highlight(_self.get('filterText'));
			}
		});

	},

	controllerContentChanged: function () {
		if (this.get('contentController').get('loaded')) {

			var selectionNews = [];

			this.get('selection').forEach(function(i) {
				var item = this.get('contentController').get('content').findProperty('id', i.get('id'));
				selectionNews.addObject(item);
			}, this);

			if (this.get('contentController').get('content'))
				this.get('contentController').get('content').removeObjects(selectionNews);

			if (!this.get('contentAc')) {
				this.set('contentAc', Ember.ArrayController.create({ sortProperties: this.get('contentController').get('sortProperties')}));
			} 
			this.set('contentAc.content', this.get('contentController').get('arrangedContent'));

			
			if (this.get('contentAc.content'))
				this.set('contentAc.content', this.get('contentAc.content').slice(0, 20));
			

			this.get('selectionAc').set('content', this.get('selection'));			
		}
	},

	selectedItem: function (i) {		
		var item = this.get('selection').findProperty('id', i.get('id'));
		if (item) {
			if (this.get('filterText').length >= this.get('threshold')){
				var regex = new RegExp(this.get('filterText'));
				if (regex.test(item.get(this.get('filterPath'))))
					this.get('contentAc.content').addObject(item);
			} else {
				this.get('contentAc.content').addObject(item);
				this.get('contentController.content').addObject(item);
			}
			this.get('selection').removeObject(item);
		} else {
			item = this.get('contentAc.content').findProperty('id', i.get('id'));
			item.set('orden', this.get('selection').length + 1);
			this.get('selection').addObject(item);
			this.get('contentAc.content').removeObject(item);
			this.set('filterText', '');
		}

		this.get('selectionAc').set('content', this.get('selection'));
	},

	didInsertElement: function () {
		this._super();

		this.set('selectionAc', Ember.ArrayController.create({ sortProperties: ['orden']}));

		if (this.get('useCustomController')) {
			this.set('contentController', App.get(this.get('controllerName')));
			this.controllerContentChanged();
		} else {
			this.set('contentController', App.get(this.get('controllerName')).create({content: []}));
		}

		this.get('contentController').addObserver('loaded', this, this.controllerContentChanged);

		if (this.get('filterText') && this.get('suggestable')) {
			this.get('contentController').filter(this.get('filterText'));
		} else if (!this.get('suggestable')) {
			if (!this.get('contentController.loaded')) this.get('contentController').load();
		}
		
		if (!this.get('contentAc'))
			this.set('contentAc', Ember.ArrayController.create({ sortProperties: this.get('contentController').get('sortProperties')}));
	},

	clickMoverArribaInTema: function (item) {	
		this.clickMoverInTema(item, -1);
	},

	clickMoverAbajoInTema: function (item) {
		this.clickMoverInTema(item, 1);
	},

	clickMoverInTema: function (item, gap) {
		var item = this.get('selection').findProperty('id', item.get('id'));
		var nextItem = this.get('selection').findProperty('orden', item.get('orden') + gap);

		if (nextItem) {
			var itemOrden = item.get('orden');
			var nextItemOreden = nextItem.get('orden');
			if (gap < 0) {
				item.set('orden', nextItemOreden);
				nextItem.set('orden', itemOrden);
			} else {
				nextItem.set('orden', itemOrden);
				item.set('orden', nextItemOreden);
			}
		}
	},
});



App.TimeLineView = Ember.View.extend({
	classNames: [],
	templateName: 'wg-time-line',
/*
	didInsertElement: function(){
		this._super();
		console.log(this.get('content'));
	}
*/
});


App.TimteLineListItemView = Ember.View.extend({
	templateName: 'wg-time-line-list-item-new',
	tagName:'li',

	gotoLink: function () {
		if (this.get('content.link')) {
			window.location = this.get('content.link');
		}
	},
});

App.TimeLineListView = Ember.CollectionView.extend({
	classNames: ['cbp_tmtimeline'],
	tagName:'ul',
	itemViewClass: App.TimteLineListItemView,

	createChildView: function(viewClass, attrs) {
		if (attrs) {
			if (attrs['contentIndex'] % 2)
				attrs['odd'] = true;
		}
	    return this._super(viewClass, attrs);
	},	
});


App.TimeLineEventCreateView = App.ModalView.extend({
	templateName: 'wg-time-line-event-create',
	iconos: ['ingresado', 'convocado', 'dictaminado', 'otros'],

	callback: function(opts, event){
		if (opts.primary) {
			this.get('content').set('fecha', moment(this.get('content.fecha'), 'DD/MM/YYYY').format('YYYY-MM-DD hh:mm:ss'));
			this.get('content').create();
		} else if (opts.secondary) {

		} else {

		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();
		this.set('content', App.TimeLineEvent.extend(App.Savable).create({objectID: 1}));
	},

	willDestroyElement: function(){
		this._super();
	},
});

//PL
App.PLMiniListView = App.JQuerySortableView.extend({
	itemViewClass: App.PLMiniView,

	updateSort : function (idArray){
		var sortArr = this._super(idArray);
		this.get('parentView').set('isEdited', true);
	},

	createChildView: function(viewClass, attrs) {
		if (attrs) {
			attrs['editable'] = this.get('editable');
		}
	    return this._super(viewClass, attrs);
	},	
});

App.ODListView = App.JQuerySortableView.extend({
	classNames: [],
	itemViewClass: App.ODMiniView,

	updateSort : function (idArray){
		var sortArr = this._super(idArray);
		this.get('parentView').get('parentView').get('parentView').guardar();
	},
	createChildView: function(viewClass, attrs) {
		if (attrs) {
			attrs['editable'] = this.get('editable');
		}
	    return this._super(viewClass, attrs);
	},	
});


App.ExpedientesListMiniView = App.JQuerySortableView.extend({
	classNames: [],
	itemViewClass: App.ExpedienteMiniView,

	updateSort : function (idArray){
		var sortArr = this._super(idArray);
		this.get('parentView').get('parentView').get('parentView').guardar();
	},
	createChildView: function(viewClass, attrs) {
		if (attrs) {
			attrs['editable'] = this.get('editable');
		}
	    return this._super(viewClass, attrs);
	},
});

App.SugestTextSearch = Ember.TextField.extend({
	insertNewline: function(){		
		var _self = this.get('parentView');

		element = _self.get('sugestList.firstObject');
		if (this.get('optionValuePath')) {
			element = element.get(this.get('optionValuePath').replace('content.', ''));
		}

		_self.itemSelect(element);
	},
});

App.ExpedienteMiniEditableView = Ember.View.extend({
	templateName: 'expediente-mini-editable',	

	borrar: function(item){
		this.get('parentView').get('parentView').borrarExpediente(this.get('content'));
	},

	didInsertElement: function () {
		this.$().fadeIn(0);
	}

});

App.ODMiniEditableView = Ember.View.extend({
	templateName: 'od-mini-editable',

	borrar: function(item){
		this.get('parentView').get('parentView').borrarOD(this.get('content'));
	},

	didInsertElement: function () {
		this.$().fadeIn(0);
	}

});


App.PLItemContentCollectionView = App.JQuerySortableView.extend({
	classNames: [],
	itemViewClass: App.ODMiniView,
	
	updateSort : function (idArray) {
		var sortArr = this._super(idArray);
		this.get('parentView.parentView.parentView').set('isEdited', true);
	},

	createChildView: function(viewClass, attrs) {
		if (attrs) {
			
			if (attrs.content.constructor.toString() == 'App.Expediente') {
				if (this.get('editable'))
   					viewClass = App.ExpedienteMiniEditableView;
   				else
   					viewClass = App.ExpedienteMiniView;
    		} else if (attrs.content.constructor.toString() == 'App.OrdeDelDia') {
				if (this.get('editable'))
   					viewClass = App.ODMiniEditableView;
   				else
   					viewClass = App.ODMiniView;
    		}
    		attrs['editable'] = this.get('editable');
			
		}
	    return this._super(viewClass, attrs);
	},

});

App.MultiSelectTextSearch = Ember.TextField.extend({
	insertNewline: function(){		
		var _self = this.get('parentView');
//		element = _self.get('content.firstObject');
		element = _self.get('contentAc.arrangedContent.firstObject');
		_self.selectedItem(element);

		this.set('value', '');
	},
});


//ME EXP


App.MEExpedienteConsultaView = Ember.View.extend({
	templateName: 'me-expediente-consulta',
	noDocument: false,
	withGiros: true,
	
	puedeCrear: function(){
		return App.get('userController').hasRole('ROLE_ALERTA_TEMPRANA_EDIT') 
	}.property('App.userController.user'),
	
	createBiography: function () {		
		App.biographyController = App.BiographyController.create({
			content: App.Biography.extend(App.Savable).create({
				expNro: this.get('controller.content.expdip'), 
				idProyecto: this.get('controller.content.id')
			}),
			expediente: App.get('expedienteConsultaController.content')
		});

		App.CreateBiographyView.popup();
	},

	didInsertElement: function(){
		this._super();

		if (App.get('userController').hasRole('ROLE_LABOR_PARLAMENTARIA_EDIT')) {
			this.get('controller.content').loadBiography();
		}

		this.set('timeLineController', App.ExpedienteTimelineController.create({content: [], url: 'timeline/' + this.get('controller.content.expdip')}));
		this.get('timeLineController').load();	
	},

	borrar: function () {
		App.confirmActionController.setProperties({
			title: 'Confirmar eliminar proyecto',
			message: '¿ Confirma que desea eliminar el proyecto ' + this.get('controller.content').get('expdip') + ' ?',
			success: null,
		});
		
		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();

	},


	documentURL: function () {
		var url = "ME/oblea";

		if (this.get('controller.content').get('useApi'))
		{
			url = App.get('apiController.url') + url;
		}

		return url + "/" + this.get('withGiros') + "/docxpath";
	}.property('controller.content', 'withGiros'),


	imprimirComprobante: function () {
		var _self = this;
		_self.set('creating', true);
		var data = {proyectos: [{id: this.get('controller.content.id')}]};
		var jsondata = JSON.stringify(data);
		$.ajax({

		    url: this.get('documentURL'),
		    type: 'POST',
		    data: jsondata,
		    dataType: "JSON",
		    success: function(data) {
		    	console.log(data);
		    	_self.set('creating', false);
		    	$.download(App.get('apiController.tomcat') + data, '&data=data');
		    },
		    complete: function(){
		    	_self.set('creating', false);
		    }
		});
	},


	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);

		if(App.get('confirmActionController.success'))
		{
			this.get('controller.content').addObserver('deleteSuccess', this, this.deleteSuccess);
			this.get('controller.content').delete();
		}
	},	

	canEdit: function(){
		if (App.get('userController').hasRole('ROLE_MESA_DE_ENTRADA_EDIT')){
			return true;
		}else{
			return false;
		}		
	}.property('App.userController.user'),
	

	deleteSuccess: function () {
		if (this.get('controller.content.deleteSuccess') == true) {

			App.get('notificacionesController').deleteByObjectId(this.get('controller.content.id'));

			this.get('controller.content').removeObserver('deleteSuccess', this, this.deleteSuccess);
			App.tpsController = App.TPsController.create();		
			App.proyectosController = App.ProyectosController.create({ content: []});
			App.get('proyectosController').set('loaded', false);
			App.get('proyectosController').set('query', App.ProyectoQuery.extend(App.Savable).create({tipo: null, comision: null, dirty: true}));

			fn = function() {
				if (App.get('proyectosController.loaded'))
				{
					App.get('tpsController').removeObserver('loaded', this, fn);	
					App.get('comisionesController').removeObserver('loaded', this, fn);	
					App.get('proyectosController').removeObserver('loaded', this, fn);	
					App.get('router').transitionTo('root.direccionSecretaria.mesaDeEntrada.proyectos');

				}
			};

			App.get('tpsController').addObserver('loaded', this, fn);
			App.get('comisionesController').addObserver('loaded', this, fn);
			App.get('proyectosController').addObserver('loaded', this, fn);

			App.get('tpsController').load();
			App.get('comisionesController').load();
			App.get('proyectosController').load();

			$.jGrowl('Se ha elimiado el expediente!', { life: 5000 });

		} else if (this.get('controller.content.deleteSuccess') == false && this.get('controller.content.deleteSuccess') != '') {
			$.jGrowl('No se ha eliminado el expediente!', { life: 5000 });
		}
	},
	
	openDocument: function () {
		this.set('loading', true);
//		var url = App.get('expedienteConsultaController.content.documentURL');
		var url = this.get('controller.content.documentURL');

		delete $.ajaxSettings.headers["Authorization"];

		$.ajax({
			url: url,
			type: 'GET',
			success: this.loadSucceeded,
			complete: this.loadCompleted,
			contentType: 'text/plain',
			crossDomain: true,
			context: this,

		});
	},

	loadCompleted: function () {
		var usuario = App.userController.get('user');
		$.ajaxSetup({
	    	headers: { 'Authorization': usuario.get('token_type') + ' ' +  usuario.get('access_token') }
		});				
	},

	loadSucceeded: function (data) {
		this.set('loading', false);

		if (data == "")
		{
//			window.open(App.get('expedienteConsultaController.content.url'), '_blank');
			window.open("http://www1.hcdn.gov.ar/proyxml/expediente.asp?numexp=" + this.get('controller.content.expdip'), '_blank');
			//this.set('noDocument', true);

		} 
		else
		{
//			var url = App.get('expedienteConsultaController.content.documentURL');
			var url = this.get('controller.content.documentURL');
			window.open(url, '_blank');
		}
	},	
});

App.MEExpedienteEditarView = Ember.View.extend({
	templateName: 'editar-expediente',
	clickGuardar: false,
	expTipo: '',

	tipos: ['LEY', 'LEY EN REVISION', 'RESOLUCION', 'DECLARACION', 'MENSAJE'],

	camaras: [
		{id: "D", nombre: "Diputados"}, 
		{id: "S", nombre: "Senado"}, 
		{id: "PE", nombre: "Poder Ejecutivo"}, 
		{id: "JGM", nombre: "Jefatura de Gabinete de Ministros"}
	],

	oldInit: undefined,


	canEdit: function(){
		if (App.get('userController').hasRole('ROLE_MESA_DE_ENTRADA_EDIT')){
			return true;
		}else{
			return false;
		}		
	}.property('App.userController.user'),

	camarasChange: function(){
		
		var _self = this;

		var camaraSelected = this.get('camarasList').findProperty('id', this.get('content.expdipT'));

		if (!camaraSelected)
			camaraSelected = this.get('camarasList').findProperty('id', this.get('content.expdipT.id'));

		Ember.run.next(function (){
			if(!camaraSelected){
				_self.set('content.expdipT', _self.get('camarasList.firstObject'));
			}else{
				_self.set('content.expdipT', camaraSelected);
			}
		});
		this.set('clickGuardar', false);

		$("#formCrearExpediente").parsley('destroy');

	}.observes('content.tipo'),

	camarasList: function(){
		switch (this.get('content.tipo'))
		{
			case 'LEY':
				return this.get('camaras');
				break;
			case 'LEY EN REVISION':
				return Array(this.get('camaras')[1]);
				break;
			case 'RESOLUCION':
				return this.get('camaras');
				break;
			case 'DECLARACION':
				return this.get('camaras');
				break;
			default: 
				return Array(this.get('camaras')[2], this.get('camaras')[3]);
				break;

		}
	}.property('content.tipo'),

	esLey: function () {
		return this.get('content.tipo') == "LEY";
	}.property('content.tipo'),

	esDeclaracion: function () {
		return this.get('content.tipo') == "DECLARACION";
	}.property('content.tipo'),

	esResolucion: function () {
		return this.get('content.tipo') == "RESOLUCION";
	}.property('content.tipo'),
		
	esLeyRevision: function () {
		return this.get('content.tipo') == "LEY EN REVISION";
	}.property('content.tipo'),

	esMensaje: function () {
		var regex = new RegExp('mensaje');
		if (this.get('content.tipo'))
			return regex.test(this.get('content.tipo').toLowerCase());
		else
			return false;
	}.property('content.tipo'),

	noHayTipo: function(){
		if(this.get('content.tipo') == null)
		{
			return true;
		}
		else
		{	
			return false;
		}
	}.property('content.tipo'),

	faltanFirmantes: function(){
		if(this.get('content.autoridades') && this.get('content.autoridades').length < 1)
		{
			if(this.get('content.expdipT.id') == "S" || this.get('content.expdipT') == "S") {
				return false;
			}
			return true;
		} 
		else
		{
			return false;
		} 
	}.property('content.autoridades.@each'),

	faltanGiros: function(){
		if(this.get('content.comisiones').length < 1)
		{
			return true;
		} 
		else
		{
			return false;
		} 
	}.property('content.comisiones.@each'),

	guardar: function (){
		var _self = this;

		if(this.get('clickGuardar') == true)
		{
			if(_self.get('noHayTipo') == false)
			{
				if($("#formCrearExpediente").parsley('validate') && _self.get('faltanFirmantes') == false && _self.get('faltanGiros') == false )
				{				
					App.confirmActionController.setProperties({
						title: 'Confirmar modificar Proyecto',
						message: '¿ Confirma que desea modificar el proyecto LEY ' +_self.get('content.expdip')+ ' ?',
						success: null,
					});
					
					App.confirmActionController.addObserver('success', _self, _self.confirmActionDone);
					App.confirmActionController.show();
				}
			}
		}
	},

	confirmActionDone: function () {
		App.confirmActionController.removeObserver('success', this, this.confirmActionDone);

		if(App.get('confirmActionController.success'))
		{
			if (this.get('expTipo'))
			{
				this.set('tipo', this.get('content.tipo'));
				this.get('content').set('tipo', this.get('expTipo'));
			}
			

			this.set('loading', true);
			this.get('content').normalize();
			this.set('content.expdipT', this.get('content.expdipT').id);
			this.get('content').addObserver('saveSuccess', this, this.saveSucceeded);
			this.get('content').save();
		}
	},

	saveSucceeded: function () {
		var _self = this;
		//this.get('content').desNormalize();
		this.get('content').removeObserver('saveSuccess', this, this.saveSucceeded);
				
		if (this.get('tipo')) {
			this.get('content').set('tipo', this.get('tipo.id'));
		}
				
		if (this.get('content.saveSuccess')) {

			$.jGrowl('Se ha modificado el expediente de '+ this.get('content.tipo') + ' ' + this.get('content.expdip') + ' correctamente !', { life: 5000 });

			var ex = App.Expediente.extend(App.Savable).create({id: this.get('content.id')});
			ex.set('loaded', false);
			var deferred = $.Deferred(),
			fn = function() {
				App.get('router').transitionTo('root.direccionSecretaria.mesaDeEntrada.proyecto.ver', ex);
			};

			ex.addObserver('loaded', this, fn);
			ex.load();

		} else {
			$.jGrowl('No se ha creado el expediente!', { life: 5000 });
			this.set('loading', false);
		}
	},
	setupEnter: function(){
		var _self = this;
		// console.log('setupEnter');

		$("#crearProyecto").on('click', function(){
			 // console.log('click');				

			if($(this).is(':focus'))
			{
				// console.log('focus + click');

				if(_self.get('clickGuardar') == false)
				{
					_self.set('clickGuardar', true);
				}

				// console.log("clickGuardar: " + _self.get('clickGuardar'));
			}
		});
	},

	cancelar: function () {
		var ex = App.Expediente.extend(App.Savable).create({id: this.get('content.id')});
		ex.set('loaded', false);
		var deferred = $.Deferred(),
		fn = function() {
			App.get('router').transitionTo('root.direccionSecretaria.mesaDeEntrada.proyecto.ver', ex);				
			deferred.resolve(ex);		
		};

		ex.addObserver('loaded', this, fn);
		ex.load();
	},

	didInsertElement: function () {
		this._super();
		var _self = this;

		Ember.run.next(this, function (){
			$("#selector-tipo-proyecto").focus();
		});

		this.set('content', this.get('controller.content'));

		

		var tp = App.get('tpsController.content').findProperty('numero', parseInt(this.get('content').get('pubnro')));

		this.set('oldTP', tp);

		this.setupEnter();
	}
});

App.MEExpedienteGirarView = Ember.View.extend({
	templateName: 'me-expediente-girar',
	        
    guardar: function(){
    	if (this.get('controller.content.comisiones').length > 0){
	        this.get('controller.content').normalize();
			this.get('controller.content').addObserver('saveSuccess', this, this.saveSuccessed);
			this.get('controller.content').save();
		}else{
			$.jGrowl('Debe haber como minimo una comision', { life: 5000 });
		}
	},
	saveSuccessed: function () {
		this.get('controller.content').removeObserver('saveSuccess', this, this.saveSucceeded);
		if (this.get('controller.content.saveSuccess')) {                                    
            App.get('router').transitionTo('mesaDeEntrada.proyecto.ver', this.get('controller.content'))	
			$.jGrowl('Se han guardado las modificaciones realidazas!', { life: 5000 });
		} else if (this.get('saveSuccess') == false) {
			$.jGrowl('Ocurrio un error al realizar las modificaciones!', { life: 5000 });
		}
	} 
});


App.DiputadoConsultaView = Ember.View.extend({
	templateName: 'diputado-consulta',
});


App.DiputadoEditView = Ember.View.extend({
	templateName: 'diputado-edit',
	content: '',

	didInsertElement: function(){
		this._super();
		this.set('content', App.get('diputadoEditController.content'));
		
		this.get('content').desNormalize();
	},
	cancelarEdicion: function(){
		App.get('router').transitionTo('admin.diputados.index');
	},
	guardar: function(){		
		this.get('controller').guardar();

		this.get('content').normalize();
	}
});


App.DiputadosListaView = Ember.View.extend({
	templateName: 'diputados',

});

App.DiputadoListItemView = Ember.View.extend({
	tagName: 'tr',
	classNames: ['gradeX'],
	templateName: 'diputado-item',
});

App.DiputadosListView = App.ListFilterView.extend({
	itemViewClass: App.DiputadoListItemView,
//	columnas: ['Fecha', 'Nota', 'Comisiones convocadas'],
	columnas: ['', 'Nombre', 'Provincia', 'Partido', 'Interbloque', 'Mandato',''],
});



App.BloquesListView = Ember.View.extend({
	templateName: 'bloques-list',
});


App.BloqueCrearView = Ember.View.extend({
	templateName: 'bloque-crear',
	existeItem: false,

	crear: function (){
		this.get('content').addObserver('createSuccess', this, this.createSucceeded);
		this.get('content').create();
		this.set('loading', true);

		App.get('bloquesController').load();
	},
	createSucceeded: function () {
		this.get('content').removeObserver('createSuccess', this, this.createSucceeded);
		if (this.get('content.createSuccess')) {
			var b = this.get('content');
//        	this.set('existBloque', false);
            this.set('loading', false);
			this.objectCreate(b);

			this.set('existeItem', false);
			$.jGrowl('Se ha creado con éxito!', { life: 5000 });
        } else if (this.get('content.createSuccess') == false) {
//        	this.set('existBloque', true);
            this.set('loading', false);
            this.set('existeItem', true);
            $.jGrowl('Ya está creado!', { life: 5000 });
		}
	},

	didInsertElement: function () {
		this._super();
		this.set('content', App.Bloque.extend(App.Savable).create());
	},

	objectCreate: function (b) {
		if (App.bloquesController) {
			App.bloquesController.addObject(b);
		}
		this.set('content', App.Bloque.extend(App.Savable).create());
	},
});


App.InterBloqueCrearView = App.BloqueCrearView.extend({
	didInsertElement: function () {
		this._super();
		this.set('content', App.InterBloque.extend(App.Savable).create());
	},

	objectCreate: function (b) {
		if (App.interBloquesController) {
			App.interBloquesController.addObject(b);
		}
		this.set('content', App.InterBloque.extend(App.Savable).create());
	},
});


App.NotificacionItemView = Ember.View.extend({
	templateName: 'notificacion-item',
	tagName: 'li',
	loading: false,
	classNameBindings: ['leida:read:unread'],

	/*
	click: function () {
		if (!this.get('leida'))
			this.marcarLeido();
	},
	*/

	leida: function () {
		return this.get('content.leida');
	}.property('content.leida'),

    marcarLeido: function(){
        this.set('notificacionLeida', App.NotificacionLeida.extend(App.Savable).create({idNotificacion: this.get('content.id'), cuil:App.userController.user.cuil}));
        this.get('notificacionLeida').addObserver('createSuccess', this, this.createSuccessed);
        this.set('loading', true);
        this.get('notificacionLeida').create();
    },
        
    createSuccessed: function () {
		if (this.get('notificacionLeida.createSuccess')) {                                                            
			this.get('notificacionLeida').removeObserver('createSuccess', this, this.createSuccessed);
			this.get('content').set('leida', true);
			if (App.get('notificacionesController'))
			{
				var n  = App.get('notificacionesController.content').findProperty('id', this.get('content.id'));
				n.set('leida', true);
			}
			this.set('loading', false);
		} else if (this.get('notificacionLeida.createSuccess') == false) {
			this.get('notificacionLeida').removeObserver('createSuccess', this, this.createSuccessed);
			this.set('loading', false);
		}
	},
});

App.NotificacionItemMiniView = App.NotificacionItemView.extend({
	templateName: 'notificacion-item-mini',
});


App.ProyectosView = Ember.View.extend({
	templateName: 'proyectos',
});

App.ProyectoListItemView = Ember.View.extend({
	tagName: 'tr',
	//classNames: ['gradeX'],
	classNameBindings: ['content.seleccionado:active'],
	templateName: 'proyectos-list-item',
	
	click: function(){
		this.set('content.seleccionado', !this.get('content.seleccionado'))
	}
	

});

App.ProyectoListItemExportView = Ember.View.extend({
	tagName: 'tr',
	classNames: ['gradeX'],
	templateName: 'proyectos-list-item-for-export',
});

App.ProyectosListView = App.ListFilterWithSortView.extend({
	templateName: 'proyectos-sortable-list',
	itemViewClass: App.ProyectoListItemView,
	itemViewClassExport: App.ProyectoListItemExportView,
	intervalText: null,


	changeFilterText: function () {
		_self = this;
		if (this.get('intervalText'))
			clearInterval(_self.get('intervalText'));

		var i = setInterval(function () {
			clearInterval(_self.get('intervalText'));	
			_self.set('sorting', ! _self.get('sorting'));
		}, 800);
		this.set('intervalText', i);
	}.observes('filterText'),

	mostrarMas: function () {
		this.set('scroll', $(document).scrollTop());
		App.get('proyectosController').set('loaded', false);
		App.get('proyectosController').nextPage();
		this.set('loading', true);
	},

	proyectosLoaded: function () {
		if (App.get('proyectosController.loaded')) {
			this.set('loading', false);
		}
		else {
			this.set('loading', true);
		}
	},	
	listaExport: function(){
		var lista;
		
		if(this.get('lista').filterProperty('seleccionado').length > 0)
		{
			lista = this.get('lista').filterProperty('seleccionado');
		}
		else
		{
			lista = this.get('lista');
		}
		
		return lista;

	}.property('content.@each', 'content.@each.seleccionado'),
	columnas: [
		//App.SortableColumn.create({nombre: ''}), 
		App.SortableColumn.create({nombre: 'Nro. de expediente', campo: 'expdip'}), 
		App.SortableColumn.create({nombre: 'Tipo', campo: 'tipo'}),
		App.SortableColumn.create({nombre: 'Título', campo: 'titulo'}),
		App.SortableColumn.create({nombre: 'Firmantes', campo: 'firmantesLabel'}),
		App.SortableColumn.create({nombre: 'Comisiones', campo: 'girosLabel'}),
	],	
	didInsertElement: function(){
		this._super();
		App.get('proyectosController').addObserver('loaded', this, this.proyectosLoaded);
	},

	recordcount: function () {
		return App.get('proyectosController.recordcount');
	}.property('App.proyectosController.recordcount'),

	lista: function (){

		var _self = this;
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());

		if(App.get('proyectosController').get('arrangedContent'))
		{
			filtered = App.get('proyectosController').get('arrangedContent').filter(function(proyecto){
				return regex.test((proyecto.tipo + proyecto.titulo + proyecto.expdip + proyecto.get('firmantesLabel') + proyecto.get('girosLabel')).toLowerCase());
			});
		}

		this.set('content.count', filtered.length);		

		if (this.get('content.count') < this.get('recordcount')) {
			this.set('mostrarMasEnabled', true);
		} else {
			this.set('mostrarMasEnabled', false);
		}

		Ember.run.next(function(){
		// High Light Words
		// Agrega la clase .highlight, modificar el css si se quiere cambiar el color de fondo
			$('table').removeHighlight();

			if(_self.get('filterText') && _self.get('filterText').length > 0){
				$('td').highlight(_self.get('filterText'));
			}
		});

		return filtered;
	}.property('App.proyectosController.arrangedContent.@each', 'totalRecords', 'sorting', 'filterTextChanged'),

});

App.ProyectoSearchView = Em.View.extend({
	templateName: 'proyecto-search',
//	tipos: ['LEY', 'RESOLUCION', 'DECLARACION', 'COMUNICACION', 'MENSAJE'],
	tipos: ['LEY', 'LEY EN REVISION', 'RESOLUCION', 'DECLARACION', 'MENSAJE'],
	collapse: true,
	loading: false,
	palabra: '',
	palabras: [],
	tipoPub: ['TP'],
	periodos: [132, 131, 130,  129, 128, 127,  126, 125, 124],
	palabrasError: false,
	palabrasErrorExist: false,


	collapseToggle: function(){
		this.set('collapse', !this.get('collapse'));
		
		Ember.run.next(function(){
			$("form").find("[tabindex=1]").focus();
		});
	},

	periodoChanged: function () {
		App.set('tpsController.periodo', App.get('proyectosController.query.pubper'));
	}.observes('App.proyectosController.query.pubper'),
	comisiones: function () {
		var comisiones = [];
		if (App.get('comisionesController.content')) {
			App.get('comisionesController.content').forEach(function (comision) {
				comisiones.pushObject(comision.nombre);
			});
		}
		return comisiones;
	}.property('App.comisionesController.content.@each'),
	limpiar: function () {
		this.set('palabras', []);
		App.proyectosController.set('query', App.ProyectoQuery.extend(App.Savable).create({comisionesObject: [], firmantesObject: [], palabras:[]}));
		this.buscar();
	},

	didInsertElement: function () {
		this._super();
		var _self = this;
		App.get('proyectosController').addObserver('loaded', this, this.proyectosLoaded);
		Ember.run.next(function () { 
			if (App.get('proyectosController.query.dirty')) {
				_self.limpiar(); 
			}
		});

		shortcut.add('enter', function() {
		  if($('#buscarProyecto').is(':focus'))
		  {
		    _self.buscar();
		  }
		});

		$(".nav-tabs > li")
		.on('click', function(){
			var tabContent = $($(this).children().attr('href'));
			setTimeout(function(){ if(tabContent.is(":visible")) tabContent.find("[tabindex=1]").focus(); }, 500);
		})
		.each(function(index){
			var _self = $(this);
			shortcut.add("F" + (index + 1), function(){ _self.children().click(); });
		});
	},

	buscar: function () {
		$('#buscarProyecto').is(':focus')
		{
			App.get('proyectosController').set('loaded', false);
			App.proyectosController.set('pageNumber', 1);
			App.proyectosController.set('content', []);

			var lista_palabras = $.map(this.get('palabras'), function(key){ return key.nombre; });
			App.set('proyectosController.query.palabras', lista_palabras);

			if (App.get('proyectosController.query.pub')) {
				App.set('proyectosController.query.pubnro', App.get('proyectosController.query.pub.numero').toString());
			}
			
			App.proyectosController.load();
			
			if(this.get('collapse') == false)
			{
				$(".panel-heading > a").click();
			}


			this.set('loading', true);
		}
	},

	proyectosLoaded: function () {
		if (App.get('proyectosController.loaded'))
			this.set('loading', false);
		else
			this.set('loading', true);
	},

	borrar: function () {
		App.searchController.deleteObject(App.proyectosController.get('query'));
		App.proyectosController.set('query', App.ExpedienteQuery.extend(App.Savable).create({tipo: null, comision: null, dirty: true, pubtipo: 'TP', pubper: 132}));
	},

	removerPalabra: function(){
//		console.log(this.get('content'));
	},

	willDestroyElement: function(){
		// remove shorcuts
		shortcut.remove('enter');
		$(".nav-tabs > li").each(function(index){ shortcut.remove("F" + (index + 1)); });
	},
	palabrasChange: function(){
		if(this.get('palabra').length > 2)
		{
			this.set('palabrasError', false);
		}
	}.observes('palabra')
});


App.BloqueItemView = Ember.View.extend({
	tagName: 'li',
	isEdit: false,
	classNames: ['wg-li-eliminar'],
	contentController: null,
	newName: '',

	templateName: 'bloque-list-item',

	editar: function () {
		this.set('newName', Ember.copy(this.get('content.nombre')));
		this.set('isEdit', true);
	},
	enableToggle: function(){
		this.set('content.enabled', !this.get(('content.enabled')));
		this.get('content').save();
	},
/*
	borrar: function () {

		this.get('content').delete();
		if (App.get(this.get('contentController'))) {
			App.get(this.get('contentController')).removeObject(this.get('content'));
		}
	},
*/
	guardar: function () {
		this.get('content').set('nombre', this.get('newName'));
		this.get('content').save();
		this.set('isEdit', false);
	},

	cancelar: function () {
		this.set('isEdit', false);
	},
});

App.FirmantesarhaView = Ember.View.extend({
	templateName: 'firmantesarha',
});

App.VinculateFirmanteView = Ember.View.extend({
	tagName: 'td',
	templateName: 'firmante-sarha-vinculo',
	vinculo: null,
	vinculos: [],
	user: null,

	didInsertElement: function () {
		this._super();
		var vinculo = App.Firmantesarha.extend(App.Savable).create({id: this.get('content.id')});
		this.set('vinculo', vinculo);
		this.get('vinculo').addObserver('loaded', this, this.vinculoLoaded);
		this.get('vinculo').load();
	},	

	vinculoLoaded: function () {
		if (this.get('vinculo.loaded')) {
			if (this.get('vinculo.cuil'))  {
				this.get('vinculos').push(this.get('vinculo.cuil'));
				this.set('isEdit', true);
			} else {
				this.set('isEdit', false);
			}
		}
		this.set('edited', false);
	},

	cuilChange: function () {
		this.set('edited', true);

		if(this.get('vinculo.loaded'))
		{			
			if(this.get('vinculos').contains(this.get('vinculo.cuil')))
			{
				this.set('content.existeVinculo', true);

				this.set('vinculo.cuil', '');
			}
		}
	}.observes('vinculo.cuil'),

	//Si el cuil no está en this.get('vinculos') hago this.set('edited', false)
	guardar: function () {
		this.get('vinculo').set('nombre', this.get('content.label'));

		if(!this.get('vinculos').contains(this.get('vinculo.cuil')))
		{
			if (this.get('isEdit'))
			{
				this.get('vinculo').save();
			}
			else
			{
				this.get('vinculo').create();
			}

			this.set('edited', false);
			this.get('vinculos').push(this.get('vinculo.cuil'));
		}

	},

	cancelar: function () {
		this.set('content.existeVinculo', false);
		this.set('vinculo.cuil', '');
		this.get('vinculo').load();
		this.set('edited', false);
	},

	cambiar: function () {
		this.set('vinculo.cuil', '');
	},

})

App.FirmantesarhaListItemView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'firmantesarha-list-item',

	crearVinculo: function () {
		//App.VincularFirmanteView.popup();
	},
});


App.FirmantesarhaListView = App.ListFilterView.extend({ 
	itemViewClass: App.FirmantesarhaListItemView, 	
	columnas: ['Diputado', 'Vinculo'],
});

App.VincularFirmanteView = App.ModalView.extend({
	templateName: 'vincular-firmante',

	callback: function(opts, event){
		if (opts.primary) {
			_self = this;
			if (this.get('content.id')) {
				this.get('content').addObserver('saveSuccess', function () {
					if (this.get('saveSuccess')) {
						//
					}
				});
				this.get('content').save();
			} else {
				this.get('content').addObserver('createSuccess', function () {
					if (this.get('createSuccess')) {
						//
					}
				});
				this.get('content').create();
			}
			return true;
		} else if (opts.secondary) {
			//alert('cancel')
		} else {
			//alert('close')
		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();
		this.set('content', App.get('biographyController.content'));
		this.set('expediente', App.get('biographyController.expediente'))
	}, 
});

App.addWordsInput = Ember.TextField.extend({
	insertNewline: function(){ 
		var query = this.get('parentView');
		var palabra = this.get('parentView').get('palabra');
		var palabras = this.get('parentView').get('palabras');

		if(palabras.findProperty('nombre', palabra))
		{
			this.set('parentView.palabrasErrorExist', true);		
		}
		else
		{
			this.set('parentView.palabrasErrorExist', false);			

			if(palabra.length > 2)
			{		
				palabras.pushObject({nombre: palabra});
				query.set('palabra', '');
				this.set('parentView.palabrasError', false);
			}else{
				this.set('parentView.palabrasError', true);		
			}
		}
	},
});

App.ListTags = Ember.View.extend({
	templateName: 'list-tags',
	classNames: ['pull-left'],
	itemViewClass: App.ListItemTags,

	didInsertElement: function(){
		this._super();
	},
});

App.ListItemTags = Ember.View.extend({
	templateName: 'list-item-tags',
	tagName: 'span',
	classNames: ['tag'],

	didInsertElement: function(){
		this._super();
	},
	borrar: function(){
		this.get('parentView').get('content').removeObject(this.get('content'));
	}
});

App.ExpedienteSobreTablasFueraDeTemarioView = App.ModalView.extend({
	templateName: 'expediente-sobretablas-fueradetemario',
	buttonRadioCheck: false,
	attributeBindings: ['required'],
	clickGuardar: null,
	art109: null,
	sobretablas: null,
	seleccionoOpcion: null,

//	opciones: [{id: 1, titulo: "Sin disidencias"}, {titulo: "Disidencia Parcial", id: 2}, {titulo: "Disidencia total", id: 3}],

	callback: function(opts, event) {

			if (opts.primary)
			{
				this.set('clickGuardar', true);
/*
				console.group('popup');
				console.log('art109: ' + this.get('art109'));
				console.log('sobretablas: ' + this.get('sobretablas'));
				console.groupEnd();
*/
				if(this.get('art109') || this.get('sobretablas'))
				{					
					this.set('seleccionoOpcion', true);

					if(this.get('sobretablas'))
					{
						App.get('reunionConsultaController').set('sobretablas', true);
					}
					else
					{
						App.get('reunionConsultaController').set('sobretablas', false);					
					}
				}
				else
				{
					this.set('seleccionoOpcion', false);
					return false;
				}
			} else if (opts.secondary) {
//				App.get('reunionConsultaController').set('sobretablas', false);
				//alert('cancel')
			} else {
				//alert('close')
			}
			event.preventDefault();
		},     
});

App.OradoresAsistenciasView = Em.View.extend({
	templateName: 'oradores-asistencias',
	sesion: null,

	asistencias: null,
	showPresents: false,
	showAbsent: true,


	barClass: function () {
		var seleccionados = App.get('diputadosController.arrangedContent').filterProperty('seleccionado', true);
		if (seleccionados) {
			if (seleccionados.length > 128) {
				return "progress-bar-success";
			} else {
				if (seleccionados.length < 110) {
					return "progress-bar-danger";		
				} else {
					return "progress-bar-warning";		
				}
			}
		} else {
			return "progress-bar-danger";
		}
	}.property('App.diputadosController.content', 'App.diputadosController.content.@each.seleccionado'),
	diputados: function () {
		var arr = Ember.ArrayController.create({ 
			sortProperties: ['sortValue'],
			content: [],
		});


		var dip = [];

		if (this.get('bloque') || this.get('interBloque')) {
			if (this.get('bloque')) {
				App.get('diputadosController.arrangedContent').forEach(function (diputado) {
					if (diputado.bloque.id == this.get('bloque.id'))
					{
						dip.addObject(diputado);
					}
				}, this);
			}
			if (this.get('interBloque')) {
				App.get('diputadosController.arrangedContent').forEach(function (diputado) {
					if (diputado.interBloque.id == this.get('interBloque.id'))
					{
						dip.addObject(diputado);
					}
				}, this);
			}
		}

		else {
			dip = App.get('diputadosController.arrangedContent');
		}

		var presentes = dip.filterProperty('seleccionado', true);
		var ausentes = dip.filterProperty('seleccionado', false);

		if (this.get('showPresents'))
			arr.get('content').addObjects(presentes);
		if (this.get('showAbsent'))
			arr.get('content').addObjects(ausentes);
		return arr.get('arrangedContent');
	}.property('App.diputadosController.content', 'App.diputadosController.content.@each.seleccionado', 'showPresents', 'showAbsent', 'bloque', 'interBloque'),

	asistenciasPorBloques: function (){
		var bloquesPresentes = [];

		App.get('asistenciasController.bloques').forEach(function (bloque) {
			var regex = new RegExp('^' + bloque.nombre + '$');
			filteredByBloque = App.get('diputadosController.content').filter(function(dip){
				return regex.test(dip.bloque.nombre);
			}, this);

			filteredByBloqueAndSelected = filteredByBloque.filterProperty('seleccionado', true);

			bloquesPresentes.addObject({'bloque': bloque.nombre, asistencias: filteredByBloqueAndSelected.length, cantidad: filteredByBloque.length})
		});

		bloquesPresentes.sort(function(a, b){return b.asistencias-a.asistencias});

		var otrosBloques = bloquesPresentes.slice(5, bloquesPresentes.length);

		bloquesPresentes = bloquesPresentes.slice(0, 5);

		var asisOtros = 0;
		var cantOtros = 0;
		otrosBloques.forEach(function (item) {
			asisOtros += item.asistencias;
			cantOtros += item.cantidad;
		});

		bloquesPresentes.addObject({'bloque': "Otros", asistencias: asisOtros, cantidad: cantOtros})

		return bloquesPresentes;
	}.property('App.diputadosController.content.@each.seleccionado'),

	asistenciaChange: function () {
		App.get('diputadosController.content').setEach('seleccionado', false);
		this.set('asistencias', App.get('asistenciasController.content'));
	}.observes('App.asistenciasController.content'),

	diputadosPercent: function () {
		var seleccionados = App.get('diputadosController.arrangedContent').filterProperty('seleccionado', true);
		if (seleccionados) {
			return "width:" + Math.round((seleccionados.length / App.get('diputadosController.arrangedContent.length') * 100)) + "%;";
		} else {
			return "width: 0%;";
		}
	}.property('App.diputadosController.content', 'App.diputadosController.arrangedContent.@each.seleccionado'),

	diputadosPresentes: function () {
		var seleccionados = App.get('diputadosController.arrangedContent').filterProperty('seleccionado', true);
		if (seleccionados)
			return seleccionados.length;
		else
			return 0;
	}.property('App.diputadosController.arrangedContent.@each.seleccionado'),

	diputadosAusentes: function () {
		var seleccionados = App.get('diputadosController.arrangedContent').filterProperty('seleccionado', true);
		if (seleccionados)
			return App.get('diputadosController.arrangedContent.length') - seleccionados.length;
		else
			return App.get('diputadosController.arrangedContent.length');
	}.property('App.diputadosController.arrangedContent.@each.seleccionado'),	


	guardar: function() {
		var seleccionados = App.get('diputadosController.arrangedContent').filterProperty('seleccionado', true);

		var sel = $.map(seleccionados, function (value, key) {  
			return value.id; 
		});


		this.set('asistencias.idDiputados', sel)

		if (App.get('asistenciasController.isEdit')) {
			this.get('asistencias').save();
		} else {
			this.get('asistencias').create();
		}
	},
	
	selectNext: function(){
	},
	selectPrev: function(){
	},

	exportar: function () {
		
		var bloques = [];

		App.get('asistenciasController.bloques').forEach(function (bloque) {
			var dip = [];

			App.get('diputadosController.arrangedContent').forEach(function (diputado) {
				if (diputado.bloque.id == bloque.id)
				{
					dip.addObject(diputado);
				}
			});

			var diputadosPresentes = dip.filterProperty('seleccionado', true);
			var diputadosAusentes = dip.filterProperty('seleccionado', false);

			bloques.addObject({
				bloque: bloque,
				presentes: diputadosPresentes,			
				ausentes: diputadosAusentes,
			});

		}, this);

			
		var diputados = {
			sesion: App.get('asistenciasController').get('sesion').serialize(),
			bloques: bloques,
		};

		$.download('exportar/asistencias', "&type=asistencias&data=" + JSON.stringify(diputados));
	},
});

App.OradoresAsistenciasDiputadosListItemView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'diputado-asistencia-item',
	classNameBindings: 'content.seleccionado:asistencia',

	didInsertElement: function(){
		this._super();
	},

	click: function() {
		if (!App.get('asistenciasController.sesion.completa')) {
			this.set('content.seleccionado', !this.get('content.seleccionado'));
			this.get('parentView.parentView').guardar();
		}
	},

});

App.OradoresAsistenciasDiputadosListView = App.ListFilterView.extend({
	itemViewClass: App.OradoresAsistenciasDiputadosListItemView,
	columnas: ['Nombre', '', '', 'Información', '', ''],
	diputadosSeleccionados: [],

	step: 20,
	totalRecords: 20,
});




App.CrearPedidoView = Ember.View.extend({
	templateName: 'if-pedido-crear',
	actividades: ["Sector público", "Sector privado", "Particular"],
	prioridades: ["Alta","Media","Baja"],
	tipos: ["Trabajos especiales", "Trabajos de consulta", "Digesto"],
	departamentos: ["DSDP"],
	//uploadFolder: 'uploads/solicitudes/',
	agregarOtra: false,
	idPedidosCreados: "",


	collapseToggle: function(event){
		if(event.context.collapse == true){
			event.context.set('collapse', false);
		}else{
			event.context.set('collapse', true);
		}
	},

	crear: function () {	

		$("#if-pedido-crear-form").parsley().destroy();
		$("#if-pedido-crear-form").parsley();

		if ( !$("#if-pedido-crear-form").parsley('validate')){
			return false;
		} 
		else{
			
			this.get('content.consultas').forEach(function(item){
				item.set('tipoIngreso',"Sistema Parlamentario Digital");
				item.set('userSaraCreado',App.get('userController.user.cuil'));
				item.set('nombreYApellido',this.get('content.nombreYApellido'));
				item.set('email',this.get('content.email'));
				item.set('direccion',this.get('content.direccion'));
				item.set('codigoPostal',this.get('content.codigoPostal'));
				item.set('provincia',this.get('content.provincia'));
				item.set('localidad',this.get('content.localidad'));
				item.set('localidadYProvincia', this.get('content.provincia') + ", " + this.get('content.localidad'));
				item.set('fax',this.get('content.fax'));
				item.set('telefono',this.get('content.telefono'));
				item.set('actividad',this.get('content.actividad'));
				item.set('profesion',this.get('content.profesion'));
				item.set('organizacion',this.get('content.organizacion'));
				item.set('cargo',this.get('content.cargo'));

				item.addObserver('createSuccess', item, item.createSucceeded);
				
				item.create();

			},this);				

			this.createSucceeded();
		}
	},

	removerUltima : function () {
		var cantElementos = this.get('content.consultas').length;
		if(cantElementos > 1){
			var ultimaConsulta = this.get('content.consultas')[cantElementos-1];
			//console.log(ultimaConsulta);
			this.get('content.consultas').removeObject(ultimaConsulta);
		}
	},

	agregarOtra : function () {
		$('[id^=collapseConsulta]').removeClass('in');
		$('[id^=collapseConsulta]').addClass('collapse');
		this.get('content.consultas').forEach(function (item){ item.set('collapse', true)});
		var nuevaConsulta = App.Pedido.extend(App.Savable).create();
		nuevaConsulta.set('orden',this.get('content.consultas').length + 1);
		nuevaConsulta.set('collapse', false);
		nuevaConsulta.set('idDiv', "collapseConsulta" + this.get('content.consultas').length + 1);
		nuevaConsulta.set('idHref', "#collapseConsulta" + this.get('content.consultas').length + 1);
		this.get('content.consultas').pushObject(nuevaConsulta);
	},


	createSucceeded: function () {
		/*this.get('content.consultas').forEach(function(item){
			if(item.get('id')){
				this.idPedidosCreados += "item.get('idPedido')" + '-' + moment().format('YYYY') + " ";
			}else{
				this.get('content.consultasConErrores').pushObject(item);
			}	
		},this);*/
		//$.jGrowl('Se han creado las solicitudes: ' + this.idPedidosCreados, { life: 5000 });

		//App.get('uploaderController').fileChange();
		

		App.misPedidosController = App.MisPedidosController.create({cuil: App.get('userController.user.cuil')});

		fn = function() {
			if(App.get('misPedidosController.loaded'))
			{
				App.get('misPedidosController').removeObserver('loaded', this, fn);	
				App.get('router').transitionTo('root.informacionparlamentaria.pedidos.misPedidos');
			}
		};
		
		App.get('misPedidosController').addObserver('loaded', this, fn);

		App.get('misPedidosController').load();	
		
		/*
		this.limpiar();
		$("#if-pedido-crear-form").parsley().destroy();

		var nuevaConsulta = App.Pedido.extend(App.Savable).create();
		nuevaConsulta.set('orden',this.get('content.consultas').length + 1);
		nuevaConsulta.set('idDiv', "collapseConsulta" + this.get('content.consultas').length + 1);
		nuevaConsulta.set('idHref', "#collapseConsulta" + this.get('content.consultas').length + 1);
		this.get('content.consultas').pushObject(nuevaConsulta);
		*/

	},
	

	limpiar: function () {
		this.set('content', App.PedidoCrear.extend(App.Savable).create());
		this.set('content.consultas',[]);
	},

	willDestroyElement: function (){
		this.set('content.consultas',[]);
	},

	didInsertElement: function () {
		this._super();
		this.set('content', App.PedidoCrear.extend(App.Savable).create()); 		
		this.limpiar();
		var nuevaConsulta = App.Pedido.extend(App.Savable).create();
		nuevaConsulta.set('orden',this.get('content.consultas').length + 1);
		nuevaConsulta.set('idDiv', "collapseConsulta" + this.get('content.consultas').length + 1);
		nuevaConsulta.set('idHref', "#collapseConsulta" + this.get('content.consultas').length + 1);
		this.get('content.consultas').pushObject(nuevaConsulta);
	},
})

App.PedidoConsultaView = Ember.View.extend({
	templateName: 'if-pedido-consulta',
	departamentos: ['ES', 'AC', 'LE'],
	departamento: 'ES',

	borrarAsignado: function () {
		this.get('content').set('userSaraAsignado', null);
	},

	guardar: function () {
		this.get('content').normalize();
		this.get('content').addObserver('saveSuccess', this, this.saveSuccessed);
		this.get('content').save();
	},

	saveSuccessed: function () {
		this.get('content').desNormalize();
		this.get('content').removeObserver('saveSuccess', this, this.saveSuccessed);	

		if (this.get('content.saveSuccess')) {
			$.jGrowl('Se ha editado la solicitud!', { life: 5000 });

			App.pedidosController = App.PedidosController.create();

			fn = function() {
				if(App.get('pedidosController.loaded'))
				{
					App.get('pedidosController').removeObserver('loaded', this, fn);	
					App.get('router').transitionTo('root.informacionparlamentaria.pedidos.listado');
				}
			};
			
			App.get('pedidosController').addObserver('loaded', this, fn);

			App.get('pedidosController').load();	
		} else if (this.get('content.saveSuccess') == false ) {
			$.jGrowl('No se ha editado la solicitud!', { life: 5000 });
		}
	},

	didInsertElement: function () {
		this._super();
		this.set('content', App.get('pedidoConsultaController').get('content'));
	},

 	exportar: function () {
 		$.download('exportar/informacionparlamentaria', "&type=informacionparlamentaria&data=" + JSON.stringify(App.pedidoConsultaController.content));
 	},

	revisar: function () {
		this.set('content.userSaraReviso',App.get('userController.user.cuil'));

		this.addObserver('revisoSuccess', this, this.revisoSuccess);

		var url = 'pedido/revisar/' + this.get('content').id
		$.ajax({
			url:  url,
			dataType: 'JSON',
			type: 'PUT',
			context: this,
			data : this.get('content').getJson(),
			complete: this.revisoCompleted,
		});		

	},

	revisoError: function (data) {
		this.set('aproveSuccess', false);
	},

	revisoSuccess: function (data) {
		if (this.get('useApi') && data.id) {
			this.set('revisoSuccess', true);
		}

		if (data.success == true) {
			this.set('revisoSuccess', true);
		}		

		if (this.get('revisoSuccess') == true) 
		{
			var audit = App.Audit.extend(App.Savable).create();
			audit.set('tipo', 'Test');
			audit.set('accion', 'Revisado');
			audit.set('usuario', App.get('userController.user.cuil'));
			audit.set('objeto', this.get('content').constructor.toString());
			audit.set('objetoId', this.get('content').id);
			audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
			audit.create();	

			$.jGrowl('Se ha revisado la solicitud!', { life: 5000 });

			App.get('auditController').loadByIdNameObject(this.get('content').id, this.get('content').constructor.toString());
		}else{
			$.jGrowl('No se ha revisado la solicitud!', { life: 5000 });
		}			
	},
	
	revisoCompleted: function(xhr){
		if (xhr.status == 200) {
			this.set('revisoSuccess', true);
		} 
		else
		{
			this.set('revisoSuccess', false);
		}
	},

	audits: function(){
		return App.get('auditController');
	}.property('App.auditController.content'),

	puedeEditar: function () {
		var puedeEditar = false;

		if(App.get('userController').hasRole('ROLE_IP_EDITOR') || App.get('userController').hasRole('ROLE_IP_DEPARTAMENTO_EDIT'))
		{
			puedeEditar = true;
		}
		else
		{		
			if(App.get('userController').hasRole('ROLE_IP_DEPARTAMENTO') && App.get('pedidoConsultaController.content.userSaraAsignado.cuil') == App.get('userController.user.cuil'))
			{
				puedeEditar = true;
			}
		}

		return puedeEditar;
	}.property('App.userController.user'),

	reenviarRespuesta: function(){
		App.ReenviarRespuestaView.popup();
	},

});


App.MiPedidoConsultaView = Ember.View.extend({
	templateName: 'if-mi-pedido-consulta',
	departamentos: ['ES', 'AC', 'LE'],
	departamento: 'ES',


	didInsertElement: function () {
		this._super();
		this.set('content', App.get('pedidoConsultaController').get('content'));
	},
});

App.PedidoListItemView = Ember.View.extend({
	templateName: 'if-pedido-list-item',
	tagName: 'tr',
	classNames: ['gradeX'],

	didInsertElement: function () {
		this._super();
		this.$('span').tooltip();
	},
});


App.PedidosListView = App.ListFilterView.extend({
	itemViewClass: App.PedidoListItemView,
	columnas: ['Nro. de consulta', 'Recibido/Terminado', 'Ingresado por', 'Solicitante', 'Departamento', 'Personal DIP', ''],
});

App.PedidosView = Ember.View.extend({
	templateName: 'if-pedidos',
	content: '',
	contentCount: 0,

	willInsertElement: function(){
		this.set('content', App.get('pedidosController.arrangedContent'));
		/*var content = [];

		if(App.get('userController').hasRole('') || App.get('userController').hasRole('ROLE_IP_DEPARTAMENTO')){
			content = App.get('pedidosController.arrangedContent');
		}
		if(App.get('userController').hasRole('ROLE_IP_DEPARTAMENTO_EDIT')){
			content = App.get('pedidosController.findByDepartamento');
		}
		this.set('content', content);
		*/
	}
});


App.MisPedidosView = Ember.View.extend({
	templateName: 'if-mis-pedidos',
	content: '',
	contentCount: 0,

	willInsertElement: function(){
		this.set('content', App.get('misPedidosController.arrangedContent'));
	}
});

App.MiPedidoListItemView = Ember.View.extend({
	templateName: 'if-mis-pedidos-list-item',
	tagName: 'tr',
	classNames: ['gradeX'],

	didInsertElement: function () {
		this._super();
		this.$('span').tooltip();
	},
});


App.MisPedidosListView = App.ListFilterView.extend({
	itemViewClass: App.MiPedidoListItemView,
	columnas: ['Nro. de consulta', 'Recibido/Terminado', 'Ingresado por', 'Solicitante', 'Departamento', 'Personal DIP', ''],
});



App.PedidosEstadisticasView = Ember.View.extend({
	templateName: 'if-pedidos-estadisticas',

	didInsertElement: function(){
		this._super();
	}
});

App.ProvinciasLocalidadesView =  Ember.View.extend({
	provincia: '',
	localidad:'',

	provincias: [],
	provinciasLocalidades: [],
	
	didInsertElement: function(){
		this._super();

		var _self = this;
		var url = "bundles/main/js/listadoProvinciasLocalidades.json";
		
		// La fuente del json se parseó en base a la siguiente fuente		
		// https://code.google.com/p/apuranqn/source/browse/trunk/+apuranqn/Script+Provincias+y+Localidades.sql?r=8

		$.getJSON(url, function(key, val){
			_self.set('provincias', ['Seleccione una Opción']);
			_self.get('provincias').addObjects(key.provincias);
			_self.set('provinciasLocalidades', key.localidades);

		});
	},
	

	localidades: function(){
		var _self = this;
		var localidades = [''];

		if(this.get('parentView.content.provincia')){
			$.map(_self.get('provinciasLocalidades'), function(key, value){
				if(key.provincia == _self.get('parentView.content.provincia')){
					localidades.push(key.localidad);
				}
			});
		}
		else{
			localidades = [];
		}		
	
		return localidades;
		

	}.property('parentView.content.provincia'),

	localidadYProvincia: function(){
		var str;

		if(this.get('parentView.content.provincia') && this.get('parentView.content.localidad'))
		{
			str = this.get('parentView.content.provincia') + ', ' + this.get('parentView.content.localidad');
			this.set('parentView.content.localidadYProvincia', str);
		}	

	}.observes('parentView.content.provincia', 'parentView.content.localidad'),

});


//

App.ListItemView = Ember.View.extend({
	tagName: 'li',
	templateName: 'list-item',
	classNames: ['row'],

	didInsertElement: function () {
		this.$().show(0);
	},
});


App.ListView = Ember.View.extend({
	templateName: 'list',
	itemPerPageList: [50, 25, 15, 10, 5],
	filterText: '',
	itemViewClass: App.ListItemView,
	contentAc: null,
	content: null,
	itemPerPage: 15,
	currentPage: 1,
	totalPages: 1,

	filterTextChange: function () {
		this.set('currentPage', 1);
		this.refreshContent();
	}.observes('filterText', 'itemPerPage'),

	refreshContent: function () {	
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered;

		if(this.get('content'))
		{
			filtered = this.get('content').filter(function(item){
				return regex.test(item.get('label').toLowerCase());
			});
		}

		var currentPage = parseInt(this.get('currentPage'));
		var itemPerPage = parseInt(this.get('itemPerPage'));

		if (!filtered) {
			filtered = [];
		}

		var init = (currentPage - 1) * itemPerPage;
		var end = init + itemPerPage;
		var data = filtered.slice(init, end);

		this.set('totalPages', Math.ceil(filtered.length / this.get('itemPerPage')));
		this.set('contentAc.content', data);

	}.observes('content', 'content.@each', 'currentPage'),


	nextPage: function () {
		this.set('currentPage', this.get('currentPage') + 1);
	},

	prevPage: function () {
		this.set('currentPage', this.get('currentPage') - 1);
	},	

	haveNextPage: function () {
		if (this.get('currentPage') < this.get('totalPages')) {
			return true;
		} else {
			return false;
		}
	}.property('content.@each', 'itemPerPage', 'currentPage', 'totalPages'),

	havePrevPage: function () {
		if (this.get('currentPage') > 1) 
			return true;
		else
			return false;
	}.property('content.@each', 'itemPerPage', 'currentPage'),

	didInsertElement: function () {
		this._super();

		this.set('contentAc', Ember.ArrayController.create({
			sortProperties: [this.get('sortProperty')],
			content: this.get('content'),
		}));
	},
});	



App.ScrolleableListView = Ember.View.extend({
	contentController: null,
	templateName: 'list-scrolleable',
	itemViewClass: App.ListItemView,
	itemHeight: 80,
	step: 1,
	paddingBottom: 2,

	didInsertElement: function () {

		this._super();

		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
		var view = this;

		if (document.attachEvent) {
    		document.attachEvent("on"+mousewheelevt, function (e) {
				var e = window.event || e;
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));		
				if (delta > 0)
					view.get('contentController').scrollUp();
				else 
					view.get('contentController').scrollDown();				
    		});
    	}
		else if (document.addEventListener) {
    		document.addEventListener(mousewheelevt, function (e) {
				var e = window.event || e;
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));		
				if (delta > 0)
					view.get('contentController').scrollUp();
				else 
					view.get('contentController').scrollDown();
    		}, false);
    	}

    	view = this;

	  	var h = $(window).height() - view.$().offset().top - view.get('paddingBottom');

	  	visibleItems = Math.floor((h - view.get('itemHeight') / 2) / view.get('itemHeight'));

	  	view.$('.list-scroll-wrapper').css('height', visibleItems * view.get('itemHeight') + view.get('paddingBottom'));
		view.$('.list-scroll-wrapper .scroll-bar').css('height', visibleItems * view.get('itemHeight') - 10);

		this.set('contentController', App.ScrollContentController.create({
			visibleItems: visibleItems,
			content: this.get('content'),
			step: this.get('step'),
		}));

		view.get('contentController').contentChanged();


		$(window).resize(function (event) {
		  	var h = $(window).height() - view.$('.list-scroll-wrapper').offset().top - view.get('paddingBottom');
		  	visibleItems = Math.floor((h - view.get('itemHeight') / 2) / view.get('itemHeight'));
		  	view.$('.list-scroll-wrapper').css('height', visibleItems * view.get('itemHeight') + view.get('paddingBottom') * 2);
		  	view.$('.list-scroll-wrapper .scroll-bar').css('height', visibleItems * view.get('itemHeight') - 10);
		  	view.get('contentController').set('visibleItems', visibleItems);
		});    	
	},

});


App.ScrollBarView = Ember.View.extend({
	templateName: 'scroll-bar',
	classNames: ['scroll-bar'],
	interval: null,

	positionChange: function () {
		var pi = Math.round(this.get('contentController.visibleItems') / this.get('contentController.content.length') * 100);
		var p = this.get('contentController.currentPosition') * (100 - pi) / 100;
		this.$('.track').css('top', p + '%');
	}.observes('contentController.currentPosition', 'updating'),

	lengthChange: function () {
		var p = Math.round(this.get('contentController.visibleItems') / this.get('contentController.content.length') * 100);
		this.$('.track').css('height', p + '%');
	}.observes('contentController.content.length', 'contentController.visibleItems'),


	setupHandlers: function () {
		view = this;

    	this.$(".track").mousedown(function (e) {
    		view.$().mousemove(function (e) {
    			if (e.target.className != "track") {
	    			var p = Math.ceil(e.offsetY / (view.$('.bar').height() - view.$('.track').height()) * 100);
	    			view.get('contentController').scrollTo(p);
    			}
    		});
    	});


    	this.$('.bar').click(function (e) {
    		//console.log(e);
			var p = Math.ceil(e.offsetY / (view.$('.bar').height() - view.$('.track').height()) * 100);
			view.get('contentController').scrollTo(p);
    	}); 


    	this.$().mouseup(function (e) {
    		view.$().unbind('mousemove');
    	});    	

    	this.$().mouseleave(function (e) {
    		view.$().unbind('mousemove');
    	});

    	this.$(".track").mouseup(function (e) {
    		view.$().unbind('mousemove');
    	});    	

		this.$(".bar").mouseup(function (e) {
    		view.$().unbind('mousemove');
    	});
	},


	didInsertElement: function () {
		this._super();
		this.lengthChange();
		this.positionChange();
		this.setupHandlers();		
	},
});

App.PreviewTramiteParlamentarioView = App.ModalView.extend({
	templateName: 'preview-tramite-parlamentario',
	classNames: ['modal-tp'],

	callback: function(opts, event){
		if (opts.primary) {
			_self = this;
			if (this.get('content.id')) {
				this.get('content').addObserver('saveSuccess', function () {
					if (this.get('saveSuccess')) {
						//
					}
				});
				//this.get('content').save();
			} else {
				this.get('content').addObserver('createSuccess', function () {
					if (this.get('createSuccess')) {
						//
					}
				});
				this.get('content').create();
			}
			return true;
		} else if (opts.secondary) {
			//alert('cancel')
		} else {
			//alert('close')
		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();
		
		//this.set('content', App.get('tpConsultaController.content'));		
		
		var tp = App.TP.extend(App.Savable).create({id: App.get('tpConsultaController.content.id')})

		this.set('loading', true)
		tp.set('loaded', false);
		var deferred = $.Deferred(),

		fn = function() {
			tp.desNormalize(); 
			
			this.set('loading', false)
			this.set('content', tp);

		    tp.removeObserver('loaded', this, fn);
		    deferred.resolve(tp);
		};

		tp.addObserver('loaded', this, fn);
		tp.load();

	}, 
});

App.ProyectoListItemNewView = Ember.View.extend({
	tagName: 'li',
	classNames: ['row'],
	templateName: 'proyectos-list-item-new',
});


App.ProyectosListScrolleableView = App.ScrolleableListView.extend({
	//templateName: 'proyectos-sortable-list',
	itemViewClass: App.ProyectoListItemNewView,
	headerViewClass : App.ListHeaderWithSortView,
	sortablController: null,
	step: 1,
	filterText: '',
	itemHeight: 80,

	columnas: [
		App.SortableColumn.create({nombre: 'Nro. de expediente', campo: 'expdip'}), 
		App.SortableColumn.create({nombre: 'Tipo', campo: 'tipo'}),
		App.SortableColumn.create({nombre: 'Título', campo: 'titulo'}),
		App.SortableColumn.create({nombre: 'Firmantes', campo: 'firmantesLabel'}),
		App.SortableColumn.create({nombre: 'Comisiones', campo: 'girosLabel'}),
	],	

	didInsertElement: function(){
		this._super();
	},

	
	contentChanged: function () {
		if (this.get('contentController')) {
			this.set('contentController.content', this.get('content'));	
		} 
	}.observes('sourceController.content'),
	

	filterChanged: function (){
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());

		filtered = this.get('sourceController').get('arrangedContent').filter(function(proyecto){
			return regex.test((proyecto.tipo + proyecto.titulo + proyecto.expdip + proyecto.get('firmantesLabel') + proyecto.get('girosLabel')).toLowerCase());
		});

		this.set('content.count', filtered.length);

		if (this.get('contentController')) 
			this.set('contentController.content', filtered);	

	}.observes('filterText', 'sorting'),

	currentPositionChange: function () {
		if (this.get('contentController.currentPosition') >= 98) {
			this.showMeMore();
		}
	}.observes('contentController.currentPosition'),

	showMeMore: function () {
		this.get('sourceController').nextPage();
	},

	newestContentLoaded: function () {
		if (this.get('sourceController.newestContentReady')) {
			this.get('contentController').addObjects(this.get('sourceController.newestContent'));
		}
	}.observes('sourceController.newestContentReady'),

});

App.ReenviarRespuestaView = App.ModalView.extend({
	templateName: 'if-pedido-reenviar-respuesta',
	actividades: ["Sector público", "Sector privado", "Particular"],
	prioridades: ["Alta","Media","Baja"],
	tipos: ["Trabajos especiales", "Trabajos de consulta", "Digesto"],
	departamentos: ["DSDP"],

	sendEmail: function(){
		var url = 'pedido/sendmail/' + this.get('id');
		$.ajax({
			url:  url,
			dataType: 'JSON',
			type: 'GET',
			context: this,
			data : this.getJson(),
			success: this.aproveSuccess,
			complete: this.aproveCompleted,
		});			
	},
	createSucceeded: function () {
		if (this.get('content.createSuccess')) {
			$.jGrowl('Se ha creado la solicitud!', { life: 5000 });

			App.pedidosController = App.PedidosController.create();

			fn = function() {
				if(App.get('pedidosController.loaded'))
				{
					//this.sendEmail();
					App.get('pedidosController').removeObserver('loaded', this, fn);	
					App.get('router').transitionTo('root.informacionparlamentaria.pedidos.listado');
				}
			};
			
			App.get('pedidosController').addObserver('loaded', this, fn);

			App.get('pedidosController').load();	
		} else {
			if (this.get('content.createSuccess') == false) {
				$.jGrowl('No se ha creado la solicitud!', { life: 5000 });
				this.set('loading', false);
			}
		}
	},

	callback: function(opts, event){
		if (opts.primary) {
			if ( !$("#if-pedido-reenviar-respuesta-form").parsley('validate')){
				return false;
			} 
			else{		
				this.get('content').tipoIngreso = "Sistema Parlamentario Digital";
				this.get('content').userSaraCreado = App.get('userController.user.cuil');
				this.get('content').addObserver('createSuccess', this, this.createSucceeded);
				this.get('content').create();
			}						
						//
				//this.get('content').save();
			return true;
		} else if (opts.secondary) {
			//alert('cancel')
		} else {
			//alert('close')
		}
		event.preventDefault();
	}, 
	
	didInsertElement: function(){	
		this._super();
		this.set('content', App.Pedido.extend(App.Savable).create()); 
//		this.set('content.tipos', []);
		this.set('content.observacion', App.get('pedidoConsultaController.content.observacion'));
	}, 
});

App.RecoveryPasswordView = Ember.View.extend({
	templateName: 'recovery-password',
	recoveryPasswordError: false,
	recoveryPasswordSuccess: false,
	recoveryPasswordErrorText: '',
	loading: false,

	cuil: '',
	mail: '',

	didInsertElement: function(){
		this._super();

		this.set('imageClass', 'login-background-0' + Math.floor((Math.random() * 5) + 1));

		if (App.get('userController.currentCuil')) {
			this.set('cuil', App.get('userController.currentCuil'));
		}
		if (App.get('userController.currentEmail')) {
			this.set('mail', App.get('userController.currentEmail'));
		}
	},
	
	recoveryPassword: function(){
		var _self = this;
		// Ej.
		// cuil: 654321
		// mail: emmanuel.lazarte@goblab.org
		var url = App.get('apiController').get('authURL') +  "recover_password/" + this.get('cuil') + "/" + this.get('mail') + "/";

		if($('#recovery-password').parsley('validate'))
		{
			_self.set('loading', true);
			$.ajax({
				url: url,
				contentType: 'text/plain',
				dataType: 'JSON',
				type: 'GET',
		    	headers: {
		    		'Authorization': 'Credential ' +  App.get('apiController.client') + " " + App.get('apiController.secret')
		    		//'Authorization': 'Credential 1 1'
		    	},
		    	//  curl -i -H "Authorization: Credential 1 secret_1" http://10.105.5.59:9000/o/validate_token/D9F0c1uqwbn4hdXTmh0zGLISeeKFae/
		    	success: function(){
		    		_self.set('loading', false);
		    		_self.set('recoveryPasswordError', false);
		    		_self.set('recoveryPasswordSuccess', true);
		    		_self.set('cuil', '');
		    		_self.set('mail', '');
		    	},

		    	error: function(jqXHR, textStatus, errorThrown){

					var xHRAuthURLController =  App.XHRAuthURLController.create({xhr: jqXHR});				
				
					if (xHRAuthURLController.hasError()){								
						var response = JSON.parse(jqXHR.responseText);						
						_self.set('loading', false);
		    			_self.set('recoveryPasswordError', true);
		    			_self.set('recoveryPasswordSuccess', false);
						_self.set('recoveryPasswordErrorText', xHRAuthURLController.getShowMessage());
					}

		    	}
			});			
		}
	},
	cancel: function () {
		App.set('userController.user', null);
		App.get('userController').set('recoveryPassword', false);

		//App.get('userController').set('user.first_login', false);

		//App.get('router').transitionTo('loading');
		//App.get('router').transitionTo('index');
	},
});


App.NotificacionConfigItemView = Ember.View.extend({
	templateName: 'notificacion-config-item',
	tagName: 'li',
	classNames: ['widget-toggle'],

	checkedChanged: function () {
		this.get('content').save();
	}.observes('content.enabled'),
});

App.NotificacionConfigView = Ember.CollectionView.extend({
	itemViewClass: App.NotificacionConfigItemView,
	tagName: 'ul',
});

App.WelcomeView = Ember.View.extend({
	templateName: 'welcome',
});

App.CreateUserView = Ember.View.extend({
	templateName: 'create-user',
	funciones: ['DIPUTADO NACIONAL', 'SECRETARIO ADMINISTRATIVO', 'SECRETARIO PARLAMENTARIO', 'PROSECRETARIO ADMINISTRATIVO', 'PROSECRETARIO PARLAMENTARIO', 'DIRECTOR GENERAL', 'SUBDIRECTOR', 'JEFE DE DEPARTAMENTO', 'JEFE DE DIVISION', 'ADMINISTRATIVO Y TECNICO', 'MAESTRANZA', 'SECRETARIO DE COMISION', 'TAQUIGRAFO DE PRIMERA', 'TAQUIGRAFO DE SEGUNDA', 'SERVICIOS', 'ADSCRIPTOS', 'EN COMISON', 'PROSECRETARIO GENERAL', 'SECRETARIO GENERAL DE LA PRES.', 'PRELEGAJO', 'JEFE DE COMISION', 'ASESOR EN COM Y REL PUBLICAS'],
	estructuras: [ 'A0000000 PRESIDENCIA - HCDN (PRESI)', 'DIR. GRAL. RELACIONES INTERNACIONALES (DGRI)', 'DIRECCION  DE RELACIONES INTERNACIONAL (DGRI)', 'DIR. GRAL. DE COORDINACION DE LA PRESIDENCIA (DGCP)', 'DIRECCION DE SECRETARIA PRIVADA  (DIR SEC PRIV)', 'DIRECCION DE PROTOCOLO Y CEREMONIAL (DIR PC)', 'ASESORIA DE GABINETE DE LA PRESIDENCIA (ASE GAB PRES)', 'DIR. GRAL. DE PRENSA Y CONUNICACIONES (DGPC)', 'DIRECCION DE PRENSA Y COMUNICACION', 'DEPARTAMENTO DE FOTOGRAFIA', 'DEPARTAMENTO DE COMUNICACION', 'DIRECCION DE DIPUTADOS "T.V."', 'ASESORIA EN COMUNICACIONES Y RELACIONES PUB. (ACRP)', 'ASESOR EN REALCIONES INTERJURISDICCIONALES (A REL INTERJ)', 'SECRETARIA ADMINISTRATIVA (SEC ADM)', 'SUBDIRECCION GESTION LEGAL Y CONTABLE (SUBD G L C)', 'DEPARTAMENTO GESTION LEGAL (DEP GES LEGAL)', 'SUBDIRECCION DE OBRAS Y PROYECTOS (SUBD O Y PROY)', 'DIRECCION DE SEGURIDAD (DIR SEG)', 'DIRECCION DE SISTEMAS ELECTRONICOS (DIR SIST ELEC)', 'DIRECCION AUDITORIA INTERNA (DIR AUD INT)', 'SUBDIRECCION OPERATIVA (SUBD OPE)', 'DEPARTAMENTO SERVICIO VEHICULAR (DEP SER VEHI)', 'DIRECCION DE HIGIENE Y SEGURIDAD DEL TRABAJO (D HST)', 'DIR. GRAL. DE RECURSOS HUMANOS (DIR G R H)', 'SUBDIRECCION REMUNERACIONES Y DIETAS (SUBD RD)', 'PLANTA POLITICA F RP 66/12 (PLA PO RP 66/12)', 'PLANTA POLITICA U RP 69/12 (PLA PO RP 69/12)', 'DIRECCION RELACIONES OFICIALES (DIR REL OFIC)', 'DIRECCION SERVICIO MEDICO (DIR SERV MED)', 'AGENTE ADSCRIPTOS (AGT ADC)', 'AGENTES ADSCRIPTOS AL SUR (AGT ADSC SUR)', 'AGENTES EN COMISION DE OTROS ORGANISMOS (AG COM ORG)', 'AGENTES CON LICENCIA SIN GOCE DE HABERES (A LI S COGE)', 'AGENTES EN COMISION EN OTROS DESTINOS (A COM O DEST)', 'AGENTES AFECTADOS TEMPORARIAMENTE (AGT AFE TEM)', 'CIRCULO DE LEGISLADORES (CIR LEG)', 'DIRECCION JARDIN MATERNO INFANTIL (D JMI)', 'DIR. GRAL. ADMINSTRATIVO CONTABLE (D GRAL ADM CONT)', 'DEPARTAMENTO SUMINISTROS (DTO SUM)', 'DEPARTAMENTO LIQUIDACION DE GASTOS (DTO LIQ DE GAST)', 'DIRECCION COMPRAS (DIR COMPRAS)', 'DIRECCION  DE TESORERIA (DIR TESORE)', 'DIR. GRAL. DE INFORMATICA Y SISTEMAS (D G INF SIST)', 'DIR. GRAL. OBRAS Y SERV. GRALES (DGOYSG)', 'DIRECCION DE OBRAS Y OPERACIONES (DOYO)', 'DIRECCION SERVICIOS GENERALES (DSG)', 'DIR. GRAL.  COORDINACION ADMINISTRATIVA (DIG COO AD)', 'DIRECCION DE AUTOMOTORES (D AUTOM)', 'DIRECCION RELACIONES OFICIALES (D RELOFI)', 'PROSECRETARIA  ADMINISTRATIVA (PROS ADM)', 'SECRETARIA PARLAMENTARIA (SEC PARL)', 'DIRECCION DE PRESUPUESTO Y HACIENDA (DIR PRE HAC)', 'DEPARTAMENTO ADMINISTRATIVO (DTO ADM)', 'DIRECCION DE REL INSTITUTCIONALES Y PRO (DIR RE INS PRO)', 'DIRECCION DE TAQUIGRAFOS (DIR TAQUI)', 'DIRECCION INFORMACION PARLAMENTARIA (DIR INF PARL)', 'DIRECCION ARCHIVO PUBLICACIONES Y MUSEO (DIR A PU MU)', 'DIRECCION COMISIONES', 'COMISION EDUCACION', 'DIRECCION CULTURA (DIR. CULT)', 'DIRECCION DE COORDINACION DE LABOR PARLAMENT. (DIR COOR L P)', 'DIRECCION DEL INSTITUTO DE CAPACI  PARLA (DIR INS CAP PAR)', 'PROSECRETARIA PARLAMENTARIA (PROSEC PARL)', 'SECRETARIA GENERAL DE LA PRESIDENCIA (SEC GP)', 'DIRECCION DE ENLACE CON EL P.E.N (DIR EN PEN)', 'DEPARTAMENTO DE COODINACION DEL P.E.N (DCPEN)', 'DIRECCION DE REL INSTITUCIONA CON LA JUVENTUD (DRICJ)', 'DIRECCION DE ENLACE Y COOP C SISTEMA UNIV NAC (DECSUN)', 'PROSECRETARIA GENERAL DE LA H.C.D.N. (PROS G H.C.D.N.)', 'DIR. GRAL. ADMINISTRATIVA (DIR GRAL ADM)', 'DIRECCION DE COORDINACION (DIR COOD)', 'DIR. GRAL. DE COORDINACION  TECNICO Y LEGAL (DGCTL)', 'DIRECCION DE TRAMITES OFICIALES (DIR TRAM OFIC)', 'DEPARTAMENTO DESPACHO GENERAL  (PRESI)', 'DEPARTAMENTO DE TRAMITES OFICIALES', 'DIRECCION DE ASUNTOS JURIDICOS (DIR A JU)', 'SECRETARIA DE COORDINACION OPERATIVA (SEC COORD OPER)', 'PROSECRETARIA DE COORDINACION OPERATIVA (PROS COORD OPER)', 'BLOQUE UCR (B UCR)', 'BLOQUE UNIDAD POPULAR (B UNI POP)', 'BLOQUE UNION PERONISTA (B UNIN PER)', 'BLOQUE FRENTE PARA LA VICTORIA - PJ (B FPV)', 'BLOQUE PRO (B PRO)', 'BLOQUE FRENTE CIVICO Y SOCIAL DE CATAMARCA (B F C S CATAM)', 'BLOQUE FRENTE PERONISTA (B F PERON)', 'BLOQUE MOVIMIENTO POPULAR FUEGUINO (B MOV POP FUE)', 'BLOQUE POR LA INCLUSION SOCIAL (B INC SOC)', 'BLOQUE FRENTE CIVICO POR SANTIAGO (B F C SANTI)', 'BLOQUE G E N (B G E N)', 'BLOQUE PARTIDO JUSTICIALISTA DE LA PAMPA (B JUST PAMPA)', 'BLOQUE LIBRES DEL SUR UNEN (B L DEL SUR)', 'BLOQUE PROYECTO SUR (B P SUR)', 'BLOQUE MOVIMIENTO POPULAR NEUQUINO (B M P NEUQ)', 'BLOQUE DEMOCRATA DE MENDOZA (B D MZA)', 'BLOQUE FRENTE PERONISTA FEDERAL (B F PER FED)', 'BLOQUE FRENTE NUEVO ENCUENTRO (B  F N ENC)', 'BLOQUE SALTA SOMOS TODOS (B S S TODOS)', 'BLOQUE PARA EL DESARROLLO SOCIAL Y  EQUIDAD (B UDESO)', 'BLOQUE COALICION CIVICA - ARI (COAL CIV ARI)', 'BLOQUE UNION POR TODOS (B UNO P TODOS)', 'BLOQUE DEMOCRATA PROGRESISTA (B DEM PROG)', 'BLOQUE UNION POR SAN JUAN (B UNI P S JUAN)', 'BLOQUE U.DE.SO SALTA - UCR (B UDESO STA)', 'BLOQUE PARTIDO SOCIALISTA (B P SOC)', 'BLOQUE FRENTE CIVICO - CORDOBA (B F C CBA)', 'BLOQUE RENOVADOR DE SALTA (B R SALTA)', 'VICE PRESIDENCIA I (VICE I)', 'VICE PRESIDENCIA II (VICE II)', 'VICE PRESIDENCIA III (VICE III)', 'BLOQUE SANTA FE EN MOVIMIENTO (B STA FE MOV)', 'BLOQUE FRENTE RENOVADOR  (BLO POL)', 'BLOQUE CULTURA, EDUCACION Y TRABAJO (B CET)', 'BLOQUE PERONISMO MAS AL SUR (B P MAS SUR)', 'BLOQUE COMPROMISO FEDERAL (B COM FED)', 'BLOQUE DE IZQUIERDA DE LOS TRABAJADORES (B IZTRAB)', 'BLOQUE SUMA+UNEN (B S+U)', 'BLOQUE UNION POR CORDOBA (B U CORD)', 'BLOQUE UNION CELESTE Y BLANCO (B UCB)', 'BLOQUE UNION POR ENTRE RIOS (B UPER)', 'BLOQUE MOVIMIENTO SOLIDARIO Y POPULAR (BMSP)', 'BLOQUE ENCUENTRO POR CORRIENTES (B EPC)', 'BLOQUE CONSERVADOR PUPULAR (B CONSEPOP)', 'BLOQUE UNIR (B U)', 'BLOQUE PTS FRENTE IZQUIERDA (B PTS FIZQ)', 'BLOQUE FE (B FE)', 'PRELEGAJOS (PRELE)'],
	createSuccess: false,
	isNew: false,

	didInsertElement: function(){
		this._super();
	},

	cuilChanged: function () {
		if (this.get('cuil').length == 11) {
			this.set('cuilIsValid', true);
			this.findCuil();
		} else {
			this.set('cuilIsValid', false);
		}
	}.observes('cuil'),

	createUser: function () {
		_self = this;
		
//		if(!$('form').parsley('validate')) return false;
		//console.log(_self.get('isValid'));

		if($('form').parsley('validate')){
			var url = 'create/user';
			var data = JSON.stringify({cuil: _self.cuil, nombre: _self.nombre, apellido: _self.apellido, email: _self.email, estructura: _self.estructura, funcion: _self.funcion, telefono: _self.telefono });
			$.ajax({
				url: url,
				contentType: 'text/plain',
				dataType: 'JSON',
				type: 'POST',
				data: data,

		    	success: function(data) {
		    		if (data.result == true) {
		    			_self.set('createSuccess', true);
		    		} else {

		    		}
		    	},

		    	error: function(jqXHR, textStatus, errorThrown){

		    	}
			});				
		}

	},

	recuperar: function () {
		App.get('userController').set('currentEmail', this.get('email'));
		App.get('userController').set('currentCuil', this.get('cuil'));

		App.get('userController').set('createUser', false);
		App.get('userController').set('recoveryPassword', true);
	},


	findCuil: function () {
		_self = this;
		var url = App.get('apiController').get('authURL') +  "info_cuil/" + this.get('cuil') + "/";
		$.ajax({
			url: url,
			contentType: 'text/plain',
			dataType: 'JSON',
			type: 'GET',
	    	headers: {
	    		'Authorization': 'Credential ' +  App.get('apiController.client') + " " + App.get('apiController.secret')
	    	},

	    	success: function(data) {
	    		if (data.is_valid) {
	    			$("form").parsley('reset')

	    			_self.set('isValid', true);
	    			_self.set('isNew', false);

	    			_self.set('nombre', data.nombre);
	    			_self.set('apellido', data.apellido);
	    			_self.set('email', data.email);
	    			_self.set('estructura', data.estructura);
	    			_self.set('funcion', data.funcion);

	    			Ember.run.next(function () {
		    			_self.$( "input[name='_nombre']" ).attr('readonly', true);
		    			_self.$( "input[name='_apellido']" ).attr('readonly', true);
		    			_self.$( "input[name='_email']" ).attr('readonly', true);
		    			_self.$( "input[name='_funcion']" ).attr('readonly', true);
		    			_self.$( "input[name='_estructura']" ).attr('readonly', true);
	    			});
	    		} else {
	    			_self.set('isNew', true);
	    			_self.set('isValid', false);
	    			_self.set('nombre', '');
	    			_self.set('apellido', '');
	    			_self.set('email', '');
	    			_self.set('estructura', '');
	    			_self.set('funcion', '');	

	    			_self.$( "input[name='_nombre']" ).attr('readonly', false);
	    			_self.$( "input[name='_apellido']" ).attr('readonly', false);
	    			_self.$( "input[name='_email']" ).attr('readonly', false);

	    		}
	    	},

	    	error: function(jqXHR, textStatus, errorThrown){

	    	}
		});		
	},
	
	cancel: function () {
		App.set('userController.user', null);
		App.get('userController').set('createUser', false);
	},
});

App.VisitaGuiadaCrearView = Ember.View.extend({
	templateName: 'visitas-guiadas-crear',

	startHora: '',
	visitaPara: ['PARTICULAR', 'ENTIDAD', 'ESTABLECIMIENTO EDUCATIVO', 'DIPUTADO', 'EMPLEADO ADMINISTRATIVO', 'VISITA ESPECIAL'],
	tipoInstitucion: ['PRIVADO', 'PUBLICO'],
	alumnosConocimiento: [],
	nivelAlumnos: ['Sin Instrucción', 'Primario', 'Secundario', 'Terciario', 'Universitario', 'Posgrado'],
	nivelDeInteres: [1, 2, 3, 4, 5],
	horario: '09:00',
	horarioGeneral: '11:00',
	
	didInsertElement: function(){
		this._super();

		$('.horarioGeneral').timeEntry({
			show24Hours: true, // 24 hours format
			showSeconds: false, // Show seconds?
			spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
			spinnerSize: [19, 26, 0], // Image size
			spinnerIncDecOnly: true, // Only up and down arrows
			defaultTime: '11:00',
			timeSteps: [1, 0, 1],

			minTime: '11:00',
			maxTime: '17:00',
		});	 

		$('.horario').timeEntry({
			show24Hours: true, // 24 hours format
			showSeconds: false, // Show seconds?
			spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
			spinnerSize: [19, 26, 0], // Image size
			spinnerIncDecOnly: true, // Only up and down arrows
			defaultTime: '09:00',
			timeSteps: [1, 30, 1],

			minTime: '09:00',
			maxTime: '17:30',
		});	 

		this.set('content', App.VisitaGuiada.extend(App.Savable).create()); 			
	},
	crear: function(){	
		if($("#formCrearVisitasGuiadas").parsley('validate')){
			//this.set('content.fechaPreferencia', {date: this.get('content.fechaPreferencia')});
			this.set('content.userSaraCreado', App.get('userController.user.cuil'));
			this.get('content').addObserver("createSuccess", this, this.createSuccess);
			this.get('content').normalize();
			this.get('content').create();
		}
	},

	limpiar: function(){
		this.set('content', App.VisitaGuiada.extend(App.Savable).create());
		//this.set('content', '');
	},

	createSuccess: function(){
		this.get('content').removeObserver("createSuccess", this, this.createSuccess);
		this.get('content').desNormalize();
		if(this.get('content.createSuccess'))
		{
			/*
			App.visitasGuiadasController = App.VisitasGuiadasController.create();

			fn = function(){
				if(App.get('visitasGuiadasController.loaded'))
				{
					App.get('visitasGuiadasController').removeObserver('loaded', this, fn);
					App.get('router').transitionTo('visitasGuiadas.index');
				}
			}

			App.get('visitasGuiadasController').addObserver('loaded', this, fn);
			App.get('visitasGuiadasController').load();
			*/
			App.misVisitasGuiadasController = App.MisVisitasGuiadasController.create({cuil: App.get('userController.user.cuil')});

			fn = function(){
				if(App.get('misVisitasGuiadasController.loaded'))
				{
					App.get('misVisitasGuiadasController').removeObserver('loaded', this, fn);
					App.get('router').transitionTo('visitasGuiadas.misVisitasGuiadas');
				}
			}

			App.get('misVisitasGuiadasController').addObserver('loaded', this, fn);
			App.get('misVisitasGuiadasController').load();

			$.jGrowl('Se creado la Visita Guiada con éxito!', { life: 5000 });
		}else{
			$.jGrowl('Ocurrio un error al crear la Visita Guiada!', { life: 5000 });
		}
	}
	
});


App.SolicitudCrearView = Ember.View.extend({
	templateName: 'solicitud-movimiento',

});

App.FirmantesWidgetView = Ember.View.extend({
	templateName: 'wg-firmantes',
});

App.MisVisitasGuiadasView = Ember.View.extend({
	templateName: 'mis-visitas-guiadas',
	content: '',
	contentCount: 0,

	willInsertElement: function(){
		this.set('content', App.get('misVisitasGuiadasController.arrangedContent'));
	}
});

App.MisVisitasGuiadasListItemView = Ember.View.extend({
	templateName: 'mis-visitas-guiadas-list-item',
	tagName: 'tr',
	classNames: ['gradeX'],

	didInsertElement: function () {
		this._super();
		this.$('span').tooltip();
	},
});


App.MisVisitasGuiadasListView = App.ListFilterView.extend({
	itemViewClass: App.MisVisitasGuiadasListItemView,

	columnas: ['Contacto', 'Fecha', 'Provincia', 'Tipo de visita','Nivel de alumnos', 'Visitantes', 'Detalles'],
});

App.MisVisitasGuiadasConsultaView = Ember.View.extend({
	templateName: 'mis-visitas-guiadas-consulta',
	content: '',

	horariosEstipulados: ['09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'],

	willInsertElement: function(){
		this.set('content', App.get('visitaGuiadaConsultaController.content'));
	},

	aprobar: function () {

		if(this.get('content.fechaEstipulada')){
			var day = moment(this.get('content.fechaEstipulada'), 'DD/MM/YYYY').format('d');
			if(day == 3){
				this.get('content').set('esMiercoles', true);
			}else{
				this.get('content').set('esMiercoles', false);
			}
		}
		
		this.get('content').set('aprobado', true);
		this.get('content').addObserver('aproveSuccess', this, this.aproveSuccessed);
		this.get('content').aprove();	

		var audit = App.Audit.extend(App.Savable).create();
		audit.set('tipo', 'Test');
		audit.set('accion', 'Aprobado');
		audit.set('usuario', App.get('userController.user.cuil'));
		audit.set('objeto', this.get('content').constructor.toString());
		audit.set('objetoId', this.get('content').id);
		audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
		audit.create();	
	},

	guardar: function(){
		//App.get('visitaGuiadaConsultaController').save();
		this.get('content').addObserver('saveSuccess', this, this.saveSuccessed);
		this.get('content').save();
		if(this.get('content').contactado){
			var audit = App.Audit.extend(App.Savable).create();
			audit.set('tipo', 'Test');
			audit.set('accion', 'Contactado');
			audit.set('usuario', App.get('userController.user.cuil'));
			audit.set('objeto', this.get('content').constructor.toString());
			audit.set('objetoId', this.get('content').id);
			audit.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
			audit.create();
		}
	},

	aproveSuccessed: function () {
		this.get('content').removeObserver('aproveSuccess', this, this.createSucceeded);
		if (this.get('content.aproveSuccess')) {
			$.jGrowl('Se han guardado las modificaciones realidazas!', { life: 5000 });
		} else if (this.get('aproveSuccess') == false) {
			$.jGrowl('Ocurrio un error al realizar las modificaciones!', { life: 5000 });
		}
	},

	saveSuccessed: function () {
		this.get('content').removeObserver('saveSuccess', this, this.createSucceeded);
		if (this.get('content.saveSuccess')) {
			App.visitasGuiadasController = App.VisitasGuiadasController.create();

			fn = function() {
					if(App.get('visitasGuiadasController.loaded'))
					{
						App.get('visitasGuiadasController').removeObserver('loaded', this, fn);	
						App.get('router').transitionTo('visitasGuiadas.index')
					}
			};

			App.get('visitasGuiadasController').addObserver('loaded', this, fn);

			App.get('visitasGuiadasController').load();                      
						
						
			$.jGrowl('Se han guardado las modificaciones realidazas!', { life: 5000 });
		} else if (this.get('saveSuccess') == false) {
			$.jGrowl('Ocurrio un error al realizar las modificaciones!', { life: 5000 });
		}
	},   

	audits: function(){
		return App.get('auditController');
	}.property('App.auditController.content'),

	borrar: function (){
		var _self = this;

		App.confirmActionController.setProperties({
			title: 'Confirmar la baja de la visita',
			message: '¿ Confirma que desea dar de baja la visita de ' +_self.get('content.razonSocial')+ ' ?',
			success: null,
		});
		
		App.confirmActionController.addObserver('success', _self, _self.confirmActionDone);
		App.confirmActionController.show();


	},

	confirmActionDone: function(){
		this.set('content.url', 'visitas-guiadas/visita/delete')
		var visita = App.VisitaGuiada.extend(App.Savable).create(this.get('content'));
		visita.delete();
		
		//console.log(this);

		App.visitasGuiadasController = App.VisitasGuiadasController.create();

		fn = function() {
				if(App.get('visitasGuiadasController.loaded'))
				{
					App.get('visitasGuiadasController').removeObserver('loaded', this, fn);	
					App.get('router').transitionTo('visitasGuiadas.index')
				}
		};

		App.get('visitasGuiadasController').addObserver('loaded', this, fn);

		App.get('visitasGuiadasController').load();                      
					
					
		$.jGrowl(jGrowlMessage.bajaVisita.message, { life: jGrowlMessage.bajaVisita.life });
	},

});