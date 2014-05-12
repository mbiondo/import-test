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
			// this.$('').not("option").prepend('<div class="view-template-block"><div class="view-template-name">' + this.get('templateName') + '</div></div>');
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
	attributeBindings: ['search-widget', 'accesskey', 'data-required', 'data-error-message', 'data-validation-minlength', 'data-type', 'name', 'pattern', 'maxlength', 'data-min' , 'data-max', 'readonly', 'data-trigger', 'parsley-trigger', 'data-americandate', 'autofocus', 'data-minlength', 'data-maxlength', 'data-length' , 'data-range'],
});

Ember.Select.reopen({
	attributeBindings: ['search-widget', 'accesskey', 'data-required', 'data-error-message', 'data-validation-minlength', 'data-type', 'name', 'pattern', 'maxlength', 'data-min' , 'data-max', 'readonly', 'data-trigger', 'parsley-trigger', 'data-americandate', 'autofocus', 'data-minlength', 'data-maxlength', 'data-range'],
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
		notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
		//Custom message
		notification.set('mensaje', "Ha iniciado la sesión " + numSesion + ", reunión " + reunion + " a las " + moment().format('HH:mm') + " hs del día " + moment().format('dddd d') + " de " + moment().format('MMMM') + " del " + moment().format('YYYY'));

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
		notification.set('mensaje', "Ha finalizado la sesión " + numSesion + ", reunión " + reunion + " a las " + moment().format('HH:mm') + " hs del día " + moment().format('dddd d') + " de " + moment().format('MMMM') + " del " + moment().format('YYYY'));
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
		App.get('router').transitionTo('loading');
		App.get('userController').set('user.first_login', true);
		App.get('userController').set('changePassword', true);
		App.get('router').transitionTo('index');
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

	changePassword: function () {
		if(!$('#login').parsley('validate')) return false;

		$.ajax({
			url: App.get('apiController.authURL') + 'change_password/',
			dataType: 'JSON',
			type: 'PUT',
			context : {controller: this},
			data : {password: this.get('password') },
			success: this.changeSucceeded,
		});

	},

	cancel: function () {
		App.get('userController').set('user.first_login', false);
		App.get('userController').set('changePassword', false);
		App.get('router').transitionTo('loading');
		App.get('router').transitionTo('index');
	},

	changeSucceeded: function (data) {
		if (data.is_valid == true)
		{
			App.get('userController.user').set('first_login', false);
			localStorage.setObject('user', JSON.stringify(App.userController.user));
			App.get('router').transitionTo('loading');
			App.get('router').transitionTo('index');
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

	didInsertElement: function(){
		this._super();
		this.$('#user_username'	).focus();
	},

	loginError: function(){
		return App.get('userController.loginError');
	}.property('App.userController.loginError'),

	loginMessage: function () {
		return App.get('userController.loginMessage');
	}.property('App.userController.loginMessage'),		

	/*
	falseLogin: function (){
		var tmpUser = App.Usuario.extend(App.Savable).create({nombre: "JORGE", apellido: "RIVAS", funcion: "DIPUTADO NACIONAL", cuil: "20148600105", estructuraReal: "DIP RIVAS JORGE"});
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

			App.get('userController').set('user', tmpUser);

			localStorage.setObject('user', JSON.stringify(tmpUser));

			App.get('notificacionesController').load();		
						
			App.get('router').transitionTo('loading');
			App.get('router').transitionTo('index');
			
		});
	},	
	*/

	login: function () {
		if(!$('#login').parsley('validate')) return false;
		App.get('userController').loginCheck(this.get('cuil'), this.get('password'));
	},

	didInsertElement: function () {
		this._super();
		this.set('imageClass', 'login-background-0' + Math.floor((Math.random() * 5) + 1));
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
	filterText: '',
	filterTextComisiones: '',
	step: 10,
	records: [10, 25, 50, 100],
	itemViewClass: App.SimpleListItemView,
	headerViewClass : App.ListHeaderView,
	columnas: ['ID', 'Label'],

	didInsertElement: function(){
		this._super();
		/*
		// comentado por si después se quiere hacer scroll automatico
		var _self = this;
		$(window).scroll(function(){
			if($(window).scrollTop() == $(document).height() - $(window).height()){
				_self.set('totalRecords', _self.get('totalRecords') + _self.get('step'));
			}
		 });
		*/
		
	},

	filterTextChanged: function () {
		//this.set('scroll', 0);
		/*if(this.get('filterText').length == 1)*/
			this.set('scroll', $(document).scrollTop());
	}.observes('filterText'),

	mostrarMas: function () {
		this.set('scroll', $(document).scrollTop());
		this.set('totalRecords', this.get('totalRecords') + this.get('step'));
	},
	
	lista: function (){
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
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
		return filtered.slice(0, this.get('totalRecords'));
	}.property('filterText', 'content', 'totalRecords', 'step', 'content.@each'),
	
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
			notification.set('mensaje', "Se ha creado la sesion del dia " +  moment.unix(this.model.get('fecha')).format('LL'));
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

	loadCompleted: function (data) {

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
		if(data)
		{		
			//CREATE NOTIFICATION TEST 
			var notification = App.Notificacion.extend(App.Savable).create();
			//ACA TITULO DE LA NOTIFICACION
			notification.set('tipo', 'crearOrdenDelDia');	
			//Si hace falta ID del objeto modificado
			notification.set('objectId', data.dictamen.id);
			//Link del objeto
			notification.set('link', "#/OD/orden/" + data.dictamen.id + "/ver");
			//CreateAt
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			//Custom message
			notification.set('mensaje', "Se ha cargado la Orden del Día Número " + data.dictamen.numero);

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
			case "(subclass of App.Estructura)":
				var item = this.get('notificationType.estructuras').findProperty("id", object.get('id'));
				if (!item) {
					this.get('notificationType.estructuras').pushObject(object);
				}
				else {
					this.get('notificationType.estructuras').removeObject(object);
				}
				break;
			case "(subclass of App.Funcion)":
				var item = this.get('notificationType.funciones').findProperty("id", object.get('id'));
				if (!item) {
					this.get('notificationType.funciones').pushObject(object);
				}
				else {
					this.get('notificationType.funciones').removeObject(object);
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
		App.SortableColumn.create({nombre: 'Nro. de Expediente', campo: 'expdip'}), 
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
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('expedientesController').get('arrangedContent').filter(function(expediente){
			return regex.test((expediente.tipo + expediente.titulo + expediente.expdip + expediente.get('firmantesLabel') + expediente.get('girosLabel')).toLowerCase());
		});

		this.set('mostrarMasEnabled', true);
		return filtered;
	}.property('startFecha', 'endFecha','filterText', 'filterFirmantes', 'filterTipos', 'filterComisiones', 'App.expedientesController.arrangedContent.@each', 'totalRecords', 'sorting'),	
});

App.PerfilView = Em.View.extend({
	templateName: 'perfil',
	guardarEnabled: false,
	oldAvatar: '',


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
		if (data.id)
		{
			fn = function() {
				App.get('expedientesArchivadosController').get('arrangedContent').setEach('seleccionado', false);
				App.get('envioArchivoController').removeObserver('loaded', this, fn);                    
				App.get('router').transitionTo('enviosArchivados.index');                     
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
					console.log("HASH: " + data.hash);
					_self.set('file', data.file);
				} 
			}
		});
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
	attributeBindings: ['folder'],

	showUploader: function () {
		App.uploaderController = App.UploaderController.create();

		App.uploaderController.set('content', this.get('content'));
		App.uploaderController.set('folder', this.get('folder'));

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

	puedeCrear: function(){
		return App.get('userController').hasRole('ROLE_ALERTA_TEMPRANA_EDIT') 
	}.property('App.userController.user'),

	openDocument: function () {
		this.set('loading', true);
		var url = App.get('expedienteConsultaController.content.documentURL');

		if (App.get('expedienteConsultaController.content.id') == 160126) {
			url = 'uploads/exp/PE247_13PL.pdf';
		}
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

	loadSucceeded: function (data) {
		this.set('loading', false);
		if (data == "")
		{
			window.open(App.get('expedienteConsultaController.content.url'), '_blank');
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

		this.set('timeLineController', App.ExpedienteTimelineController.create({content: [], url: 'timeline/1'}));
//		this.set('timeLineController', App.ExpedienteTimelineController.create({content: [], url: 'timeline/' + App.get('expedienteConsultaController.content.expdip')}));
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
													color = "green";
											break;
											case 3:
													color = "red";
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
		App.get('router').transitionTo('comisiones.citaciones.citacionesConsulta.verCitacion', this.get('content'));
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
			tolerance: 'pointer',
			containment: 'parent',
			placeholder: 'ui-state-highlight',
			forcePlaceholderSize: true,
			start: function(event, ui) {
				ui.item.previousIndex = ui.item.index();                      
			},
			stop: function(event, ui) {
				view.updateSort(view.$().sortable('toArray'));
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
				turnosSerialized.push(t);
			}, item);
			
			turnosDesBloqueados.forEach(function(turno, index){
				var t = turno.serialize();
				t['hablando'] = turno.get('hablando');
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
	classNameBindings: ['content.seleccionada:active'],

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
			mensajes.push({titulo: "Debes seleccionar un tiempo mayor a 0"});
		if (turno.orden < 0) 
			mensajes.push({titulo: "Debes seleccionar un tiempo orden a 0."});
		if (turno.listaId == null) 
			mensajes.push({titulo: "Debes seleccionar una lista."});
		if (turno.oradores == null || turno.oradores.length == 0) 
			mensajes.push({titulo: "Debes seleccionar uno o mas oradores."});
		if (this.get('esDictamen') && turno.tag == null)
			mensajes.push({titulo: "Debes seleccionar el tipo de dictamen."});
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
						formatter: function() {
							return '<b>'+ this.point.name +'</b>';
						}
					}
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

	mergedContent: function () {
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

		return mergedContentController;
	}.property('content.proyectos.@each, content.dictamenes.@each', 'edited'),

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

			var notification = App.Notificacion.extend(App.Savable).create();
			notification.set('tipo', 'confirmarLaborParlamentaria');	
			notification.set('objectId', this.get('content.id'));
			notification.set('link', "#/laborparlamentaria/plandelabor/" + this.get('content.id') + "/ver");
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			notification.set('mensaje', "Se ha confirmado el Plan de Labor Tentativo del dia " + moment(this.get('content.fechaEstimada')).format('dddd') + " " + moment(this.get('content.fechaEstimada')).format('LL') );

			notification.create();


			$.jGrowl('Se ha cambiado el estado del plan de labor a confirmado!', { life: 5000 });

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

	tipos: ['LEY', 'LEY EN REVISION', 'RESOLUCION', 'DECLARACION', 'MENSAJE'],

	camaras: [
		{id: "Diputados", nombre: "Diputados"}, 
		{id: "Senadores", nombre: "Senadores"}, 
		{id: "Poder Ejecutivo", nombre: "Poder Ejecutivo"}, 
		{id: "JGM", nombre: "Jefatura de Gabinete de Ministros"}
	],	

	camarasChange: function(){
		var _self = this;
		Ember.run.next(function(){		
			_self.set('content.iniciado', _self.get('camarasList.firstObject'));
		});
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
			case 'MENSAJE':
				return Array(this.get('camaras')[1], this.get('camaras')[3]);
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
		if(this.get('content.autoridades').length < 1)
		{
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
						title: 'Confirmar Crear Proyecto',
						message: '¿ Confirma que desea crear el proyecto LEY ' +_self.get('content.expdip')+ ' ?',
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
			
			this.set('content.iniciado', this.get('content.iniciado').id);

			this.set('loading', true);
			this.get('content').normalize();
			//this.get('content').desNormalize();
			
			this.get('content').addObserver('createSuccess', this, this.createSucceeded);
			this.get('content').create();
		}
	},

	createSucceeded: function () {
		var _self = this;
		//this.get('content').desNormalize();
		this.get('content').removeObserver('createSuccess', this, this.createSucceeded);
				
		if (this.get('tipo')) {
				this.get('content').set('tipo', this.get('tipo'));
		}
				
		if (this.get('content.createSuccess')) {
			var expediente = this.get('content');
			
			$.jGrowl('Se ha creado el expediente!', { life: 5000 });
			
			var notification = App.Notificacion.extend(App.Savable).create();
			notification.set('tipo', 'crearProyecto');	
			notification.set('objectId', expediente.id);
			notification.set('link', "/#/mesa/de/entrada/proyecto/" + expediente.id + "/ver");
			notification.set('fecha', moment().format('YYYY-MM-DD HH:mm'));
			notification.set('mensaje', "Se ha creado el expediente " + expediente.expdip);
			notification.create();      

			var iniciado = this.get('camaras').findProperty('id', expediente.get('iniciado'));
			var tp = App.get('tpsController.content').findProperty('numero', expediente.get('pubnro'));

			this.set('content', App.Expediente.extend(App.Savable).create({
				expdipA: '', 
				expdipN: '', 
				tipo: 'LEY', 
				pubtipo: expediente.get('pubtipo'), 
				periodo: expediente.get('periodo'),
				expdipA: expediente.get('expdipA'),
				iniciado: iniciado,
				sesion: expediente.get('sesion'),
				firmantes: [],
				giro: [],
				comisiones: [],
				autoridades: [],
			}));

			this.setupEnter();
			this.set('loading', false);
			this.set('clickGuardar', false);

			$("#formCrearExpediente").parsley('reset');
			$("#nav-tabs-proyecto").click();
			$("#selector-tipo-proyecto").focus();

			this.set('oldTP', tp);

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

		} else {
			$.jGrowl('No se ha creado el expediente!', { life: 5000 });
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
			autoridades: []
		}));              

		Ember.run.next(this, function (){
			$("#selector-tipo-proyecto").focus();
		});

		this.setupEnter();

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

	tipoSesion: ['ORDINARIAS', 'EXTRAORDINARIAS', 'DE PROROGA'],
	tipoPub: ['TP'],
	
	filterTextComisiones: '',
	filterFirmantes: '',
	comisionesSeleccionadas: [],
	firmantesSeleccionados: [],
	periodos: [132, 131, 130,  129, 128, 127,  126, 125, 124],

	numeros: function(){
		return $.map(App.get('tpsController.arrangedContent'), function(key){ return key.numero });
	}.property('tpsController.content.@each'),

	numerosChanged: function(){
		if (this.get('pubnro')) {
			this.set('content.pubFecha', moment(this.get('pubnro.fecha'), 'YYYY-MM-DD').format('DD/MM/YYYY'));
			this.set('content.pubnro', this.get('pubnro.numero'));
		}
		else 
		{
			this.set('content.pubFecha', null);
			this.set('content.pubnro', null);
		}
	}.observes('pubnro'),

	periodoChanged: function () {
		App.set('tpsController.periodo', this.get('content.periodo'));
		this.set('pubnro', null);
	}.observes('content.periodo'),

	didInsertElement: function(){
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

		this.get('content').set('iniciado', this.get('camaras.firstObject'));
		this.set('content.pubFecha', moment().format("DD/MM/YYYY"));
		this.set('content.expdipA', moment().format("YYYY"));

		if (this.get('parentView.oldTP')) {
			_self = this;
			Ember.run.next(function () { 
				_self.set('pubnro', _self.get('parentView.oldTP'));
			});	
		}

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
		Ember.run.next(function () { 
			_self.set('pubnro', _self.get('parentView.oldTP'));
		});
	}.observes('parentView.oldTP'),

	camaraChange: function () {

		switch (this.get('content.iniciado.id')) {
			case "Diputados":
				this.get('content').set('expdipT', 'D');
				break;
			case "Senadores":
				this.get('content').set('expdipT', 'S');
				break;
			case "Poder Ejecutivo":
				this.get('content').set('expdipT', 'PE');
				break;
			case "JGM":
				this.get('content').set('expdipT', 'JGM');
				break;
		}

		var tipo = '';

		if(this.get('content.iniciado.id') == 'JGM')
		{
			tipo = 'func/funcionarios';
		}
		else
		{
			tipo = 'dip/diputados';			
		}

		if(App.get('firmantesController.tipo') != tipo)
		{
			fn = function() {
				App.get('firmantesController').removeObserver('loaded', this, fn);
			};

			App.get('firmantesController').set('tipo', tipo);
			App.get('firmantesController').set('loaded', false);
			App.get('firmantesController').addObserver('loaded', this, fn);
			App.get('firmantesController').load();					
		}

	}.observes('content.iniciado'),

	numeroChange: function () {
		this.get('content').set('expdip', this.get('content.expdipN') + "-" + this.get('content.expdipT') + "-" + this.get('content.expdipA'));
	}.observes('content.expdipT', 'content.expdipN', 'content.expdipA'),
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
	
	didInsertElement: function () {
		this._super();
	},
});

App.ExpedienteFormMensajeView = App.ExpedienteFormLeyView.extend({
	templateName: 'expediente-form-mensaje',
	msgNro: '',
	msgFecha: null,
	msgTipo: '',
	
	msgValueChange: function () {
		var add = '';
		if (this.get('conLey')) {
			add = " Y PROYECTO DE LEY";
		}
		this.set('msgTipo', 'MENSAJE ' + this.get('msgNro') + add);
		this.get('parentView').set('expTipo', this.get('msgTipo'));
	}.observes('msgNro', 'conLey'),
	
	didInsertElement: function () {
		this._super();
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
		
		var biography;
			biography = App.Biography.extend(App.Savable).create(this.get('content'));
			biography.set('bloque', App.bloquesController.findProperty('nombre', this.get('content').get('bloque.nombre')));
			biography.set('interBloque', App.interBloquesController.findProperty('nombre', this.get('content').get('interBloque.nombre')));
			biography.set('url', 'biographys/biography/' + this.get('content').get('id') + '/');
			biography.set('noConcatURL', true);

		App.biographyController = App.BiographyController.create({
			content: biography,
			expediente: App.get('expedienteConsultaController.content'),
		});

		App.CreateBiographyView.popup();
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
	classNames: ['gradeX'],

	didInsertElement: function () {
		this._super();
		this.$('span').tooltip();
	},
});

App.VisitasGuiadasListView = App.ListFilterView.extend({
	itemViewClass: App.VisitasGuiadasListItemView,
	columnas: ['Contacto', 'Fecha', 'Provincia', 'Tipo de visita', 'Visitantes', 'Detalles'],
	templateName: 'simple-list-whit-date-range',
	fechaDesde: '',
	fechaHasta: '',

	lista: function (){
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered;

		var fechaDesde = this.get('fechaDesde');
		var fechaHasta = this.get('fechaHasta');

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
	}.property('filterText', 'content', 'totalRecords', 'step', 'content.@each', 'fechaDesde', 'fechaHasta'),

	limpiar: function (){
		this.set('fechaDesde','');
		this.set('fechaHasta','');
		this.set('filterText','');
		
	}


});

App.VisitasGuiadasView = Ember.View.extend({
	templateName: 'visitas-guiadas',
	content: '',
	contentCount: 0,

	willInsertElement: function(){
		this.set('content', App.get('visitasGuiadasController.arrangedContent'));
	},

});

App.VisitaGuiadaConsultaView = Ember.View.extend({
	templateName: 'visita-guiada-consulta',
	content: '',

	willInsertElement: function(){
		this.set('content', App.get('visitaGuiadaConsultaController.content'));
	},

	aprobar: function () {
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
		console.log(App.get('auditController'));
		return App.get('auditController');
	}.property('App.auditController.content')

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
		App.get('expedientesController').set('loaded', false);
		App.get('expedientesController').nextPage();
		this.set('loading', true);
	},

	expedientesLoaded: function () {
		if (App.get('expedientesController.loaded')) {
			this.set('loading', false);
		}
		else
		{
			this.set('loading', true);
		}
	},

	columnas: [
		App.SortableColumn.create({nombre: 'Número de Expediente', campo: 'expdip'}), 
		App.SortableColumn.create({nombre: 'Tipo', campo: 'tipo'}),
		App.SortableColumn.create({nombre: 'Título', campo: 'titulo'}),
		App.SortableColumn.create({nombre: 'Alerta Temprana'}),
		App.SortableColumn.create({nombre: 'Incluir en el informe'}),
	],	


	didInsertElement: function(){
		this._super();
		App.get('expedientesController').addObserver('loaded', this, this.expedientesLoaded);
		App.get('expedientesController').set('pageSize', 250);
		this.set('mostrarMasEnabled', false);
	},
/*
	lista: function (){
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('expedientesController').get('arrangedContent').filter(function(expediente){
			return regex.test((expediente.tipo + expediente.titulo + expediente.expdip + expediente.get('firmantesLabel') + expediente.get('girosLabel')).toLowerCase());
		});
		
		this.set('mostrarMasEnabled', true);
		return filtered;
	}.property('filterText', 'App.expedientesController.arrangedContent.@each', 'totalRecords', 'sorting'),	
*/	
	lista: function (){
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('proyectosController').get('arrangedContent').filter(function(proyecto){
			return regex.test((proyecto.tipo + proyecto.titulo + proyecto.expdip + proyecto.get('firmantesLabel') + proyecto.get('girosLabel')).toLowerCase());
		});

		this.set('mostrarMasEnabled', true);
		return filtered;
	}.property('startFecha', 'endFecha','filterText', 'filterFirmantes', 'filterTipos', 'filterComisiones', 'App.proyectosController.arrangedContent.@each', 'totalRecords', 'sorting'),	

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
	templateName: 'tp-list-item'
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
	
	crear: function(){
		if($('#formCrearTP').parsley('validate'))
		{
			this.get('controller').crear();
		} 
	}
})

App.TPConsultaView = Ember.View.extend({
	templateName: 'tp-consulta',
	
	documentURL: function () {
		var url = this.get('controller.content.url');

		if (this.get('controller.content').get('useApi'))
		{
			url = App.get('apiController.url') + url;
		}

		return url + "/" + this.get('controller.content.periodo') + "/" + this.get('controller.content.numero') + "/docx";
	}.property('controller.content'),
	exportar: function () {
		$.download('exportar/tp', "&type=tp&data=" + JSON.stringify(this.get('controller.content')));
	},
	confeccionarTP: function () {
		return App.get('userController').hasRole('ROLE_PUBLICACIONES_EDIT') 
	}.property('App.userController.user')
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

	crearTest: function () {
		App.TimeLineEventCreateView.popup();
	},

	didInsertElement: function () {
		this._super();
		
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
		

		this.set('timeLineController', App.ExpedienteTimelineController.create({content: [], url: 'timeline/1'}));
		this.get('timeLineController').load();
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

App.SelectListView = Ember.CollectionView.extend({
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
});


App.MultiSelectListView = Ember.View.extend({
	templateName: 'wg-multiselect',
	itemViewClass: 'App.SelectListItemView',
	itemSelectedViewClass: 'App.SelectListItemVSelectediew',
	selection: [],
	threshold: 3,
	delayFilter: 1000,
	interval: null,
	filterPath: 'nombre',
	labelPath: 'nombre',
	suggestable: false,
	tabindex: 0,
	content: [],

	selectionAc: null,

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
		this.get('selectionAc').set('content', this.get('selection'));
	}.observes('selection'),

	filterData: function () {
		if (this.get('suggestable'))
		{
			if (this.get('filterText').length >= this.get('threshold')) {
				this.get('contentController').addObserver('loaded', this, this.controllerContentChanged);
				this.get('contentController').filter(this.get('filterText'));
			} else {
				this.get('contentController').set('content', []);
			}
		} else {
			if (this.get('filterText').length >= this.get('threshold')) {
				var regex = new RegExp(this.get('filterText').toString().toLowerCase());
				filtered = this.get('contentController').get('arrangedContent').filter(function(c){
					return regex.test(c.get(this.get('labelPath')).toString().toLowerCase());
				}, this);

				var selectionNews = [];
				this.get('selection').forEach(function(i) {
					var item = filtered.findProperty('id', i.get('id'));
					selectionNews.addObject(item);
				}, this);

				filtered.removeObjects(selectionNews);				

				this.set('content', filtered);
			} else {
				this.set('content', this.get('contentController').get('arrangedContent'));
			}
		}

		if (this.get('content'))
			this.set('content', this.get('content').slice(0, 20));		
	},

	controllerContentChanged: function () {
		if (this.get('contentController').get('loaded')) {
			var selectionNews = [];
			this.get('selection').forEach(function(i) {
				var item = this.get('contentController').get('content').findProperty('id', i.get('id'));
				selectionNews.addObject(item);
			}, this);
			this.get('contentController').get('content').removeObjects(selectionNews);
			this.get('contentController').removeObserver('loaded', this, this.controllerContentChanged);
			this.set('content', this.get('contentController').get('arrangedContent'));
			if (this.get('content'))
				this.set('content', this.get('content').slice(0, 20));
			
			this.get('selectionAc').set('content', this.get('selection'));			
		}
	},

	selectedItem: function (i) {		
		var item = this.get('selection').findProperty('id', i.get('id'));
		if (item) {
			if (this.get('filterText').length >= this.get('threshold')){
				var regex = new RegExp(this.get('filterText'));
				if (regex.test(item.get(this.get('filterPath'))))
					this.get('content').addObject(item);
			} else {
				this.get('content').addObject(item);
			}
			this.get('selection').removeObject(item);
			
		} else {
			item = this.get('content').findProperty('id', i.get('id'));
			item.set('orden', this.get('selection').length + 1);
			this.get('selection').addObject(item);
			this.get('content').removeObject(item);
			this.set('filterText', '');
		}

		this.get('selectionAc').set('content', this.get('selection'));

	},

	didInsertElement: function () {
		this._super();
		this.set('contentController', App.get(this.get('controllerName')).create({content: []}));
		this.set('selectionAc', Ember.ArrayController.create({ sortProperties: ['orden']}));
		if (this.get('filterText') && this.get('suggestable')) {
			this.get('contentController').addObserver('loaded', this, this.controllerContentChanged);
			this.get('contentController').filter(this.get('filterText'));
		} else if (!this.get('suggestable')) {
			this.get('contentController').addObserver('loaded', this, this.controllerContentChanged);
			this.get('contentController').load();
		}
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
	classNames: [],
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

		console.log(this.get('optionValuePath'));

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
});

App.ODMiniEditableView = Ember.View.extend({
	templateName: 'od-mini-editable',

	borrar: function(item){
		this.get('parentView').get('parentView').borrarOD(this.get('content'));
	},
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
		element = _self.get('content.firstObject');
		_self.selectedItem(element);

		this.set('value', '');
	},
});


//ME EXP

App.MEExpedienteConsultaView = Ember.View.extend({
	templateName: 'me-expediente-consulta',
});

App.MEExpedienteEditarView = Ember.View.extend({
	templateName: 'me-expediente-editar',
        
	guardar: function(){
        this.get('controller.content').normalize();
		this.get('controller.content').addObserver('saveSuccess', this, this.saveSuccessed);
		this.get('controller.content').save();
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
		App.get('router').transitionTo('direccionSecretaria.mesaDeEntrada.diputados.index');
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

	click: function () {
		if (!this.get('leida'))
			this.marcarLeido();
	},

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
	classNames: ['gradeX'],
	templateName: 'proyectos-list-item',
});

App.ProyectosListView = App.ListFilterWithSortView.extend({
	templateName: 'proyectos-sortable-list',
	itemViewClass: App.ProyectoListItemView,

	mostrarMas: function () {
		this.set('scroll', $(document).scrollTop());
		App.get('proyectosController').set('loaded', false);
		App.get('proyectosController').nextPage();
		this.set('loading', true);
	},

	proyectosLoaded: function () {
		if (App.get('proyectosController.loaded'))
			this.set('loading', false);
		else
			this.set('loading', true);
	},	

	columnas: [
		App.SortableColumn.create({nombre: 'Nro. de Expediente', campo: 'expdip'}), 
		App.SortableColumn.create({nombre: 'Tipo', campo: 'tipo'}),
		App.SortableColumn.create({nombre: 'Título', campo: 'titulo'}),
		App.SortableColumn.create({nombre: 'Firmantes', campo: 'firmantesLabel'}),
		App.SortableColumn.create({nombre: 'Comisiones', campo: 'girosLabel'}),
	],	

	didInsertElement: function(){
		this._super();
		App.get('proyectosController').addObserver('loaded', this, this.proyectosLoaded);
	},

	lista: function (){
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('proyectosController').get('arrangedContent').filter(function(proyecto){
			return regex.test((proyecto.tipo + proyecto.titulo + proyecto.expdip + proyecto.get('firmantesLabel') + proyecto.get('girosLabel')).toLowerCase());
		});

		this.set('content.count', filtered.length);		

		this.set('mostrarMasEnabled', true);
		return filtered;
	}.property('startFecha', 'endFecha','filterText', 'filterFirmantes', 'filterTipos', 'filterComisiones', 'App.proyectosController.arrangedContent.@each', 'totalRecords', 'sorting'),	

});

App.ProyectoSearchView = Em.View.extend({
	templateName: 'proyecto-search',
	tipos: ['LEY', 'RESOLUCION', 'DECLARACION', 'COMUNICACION', 'MENSAJE'],
	collapse: true,
	loading: false,
	palabra: '',
	palabras: [],
	tipoPub: ['TP'],

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
		App.proyectosController.set('query', App.ProyectoQuery.extend(App.Savable).create({}));
	},

	didInsertElement: function () {
		this._super();
		_self = this;
		App.get('proyectosController').addObserver('loaded', this, this.proyectosLoaded);
		Ember.run.next(function () { 
			if (App.get('proyectosController.query.dirty')) {
				_self.limpiar(); 
			}
		});
	},
	buscar: function () {
		App.get('proyectosController').set('loaded', false);
		App.proyectosController.set('pageNumber', 1);
		App.proyectosController.set('content', []);

		var lista_palabras = $.map(this.get('palabras'), function(key){ return key.nombre; });
		App.set('proyectosController.query.palabras', lista_palabras);
		App.set('proyectosController.query.pubnro', App.get('proyectosController.query.pubnro.numero'));

		App.proyectosController.load();
		this.set('loading', true);
	},

	proyectosLoaded: function () {
		if (App.get('proyectosController.loaded'))
			this.set('loading', false);
		else
			this.set('loading', true);
	},

	borrar: function () {
		App.searchController.deleteObject(App.proyectosController.get('query'));
		App.proyectosController.set('query', App.ExpedienteQuery.extend(App.Savable).create({}));
	},

	removerPalabra: function(){
//		console.log(this.get('content'));
	},
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
		/*
		var query = App.get('proyectosController.query');
		var palabra = App.get('proyectosController.query.palabra');
		var palabras = App.get('proyectosController.query.palabras');
		*/

		var query = this.get('parentView');
		var palabra = this.get('parentView').get('palabra');
		var palabras = this.get('parentView').get('palabras');

		palabras.pushObject({nombre: palabra});
		query.set('palabra', '');
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

