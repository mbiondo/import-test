JQ = Ember.Namespace.create();

JQ.Widget = Em.Mixin.create({

    didInsertElement: function () {
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



JQ.DatePicker = Em.View.extend(JQ.Widget, {
    uiType: 'datepicker',
    uiOptions: ['disabled', 'altField', 'altFormat', 'appendText', 'autoSize', 'buttonImage', 'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear', 'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames', 'dayNamesMin', 'dayNamesShort', 'defaultDate', 'duration', 'firstDay', 'gotoCurrent', 'hideIfNoPrevNext', 'isRTL', 'maxDate', 'minDate', 'monthNames', 'monthNamesShort', 'navigationAsDateFormat', 'nextText', 'numberOfMonths', 'prevText', 'selectOtherMonths', 'shortYearCutoff', 'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear', 'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths', 'weekHeader', 'yearRange', 'yearSuffix'],
    uiEvents: ['create', 'beforeShow', 'beforeShowDay', 'onChangeMonthYear', 'onClose', 'onSelect'],

    tagName: 'input',
    type: "text",
    attributeBindings: ['type', 'value'],
});

App.DatePicker = JQ.DatePicker.extend({
  dateFormat: 'dd/mm/yy', //ISO 8601
 
  beforeShowDay: function(date) {
      return [true, ""];
  },
  
  onSelect: function (date) {
	this.set('value', date)
  },
});

App.SubMenuView = Ember.View.extend({
	templateName: "sub-menu",

	
});



App.SubMenuOradoresView = Ember.View.extend({
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

App.ContentView = Ember.View.extend({
	templateName: 'content',

	logout: function () {
		App.get('router').transitionTo('loading');
		
		localStorage.setObject('user', null);
		App.get('userController').set('user', null);
		
		App.get('router').transitionTo('index');
	},

	didInsertElement: function () {
	
		$("ul.userNav li a.sidebar").click(function() { 
			$(".secNav").toggleClass('display');
		});	
		
		//===== User nav dropdown =====//		
		
		$('a.leftUserDrop').click(function () {
			$('.leftUser').slideToggle(200);
		});
		
		$(document).bind('click', function(e) {
			var $clicked = $(e.target);
			if (! $clicked.parents().hasClass("leftUserDrop"))
			$(".leftUser").slideUp(200);
		});
	},	
});

App.LoginView = Ember.View.extend({
	templateName: 'login',
	cuil: '',
	password: '',

	falseLogin: function () {
		var usuario = App.Usuario.create({nombre: "testing", apellido: "testing", funcion: "DIPUTADO NACIONAL", cuil: "20306531817", roles: [App.Rol.create({id: 1, nivel: 5, nombre: "ROLE_USER"}), App.Rol.create({id: 2, nivel: 4, nombre: "ROLE_DIPUTADO"})]});
		App.userController.set('user', usuario);
		localStorage.setObject('user', JSON.stringify(usuario));
		App.get('router').transitionTo('loading');
		App.get('router').transitionTo('index');
	},
	
	login: function () {
		var _self = this;

		var url = App.get('apiController.url') + '/usr/autenticate';
		$.ajax({
			url:  url,
			contentType: 'text/plain',
			type: 'POST',
			//crossDomain: 'true',
			context: this,
			data : this.get('cuil') + "," + this.get('password'),
			success: function( data ) 
			{
				if (data == true || data == "true")
				{
					App.get('userController').login(_self.get('cuil'));		
				}
				else
				{
					//Mostrar error de login
					alert('Login Incorrecto');
				}
			},
			complete: this.saveCompleted,
		});					
	}
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
	columnas: ['ID', 'Label'],
	
	mostrarMas: function () {
		this.set('totalRecords', this.get('totalRecords') + this.get('step'));
	},
	
	lista: function (){
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered = this.get('content').filter(function(item){
			return regex.test(item.get('label').toLowerCase());
		});

		var max = this.get('totalRecords');
		if (filtered.length <= max) {
			max = filtered.length;
			this.set('mostrarMasEnabled', false);
		} else {
			this.set('mostrarMasEnabled', true);
		}
		return filtered.splice(0, this.get('totalRecords'));
	}.property('filterText', 'filterTextComisiones', 'content', 'totalRecords', 'step'),

	totalRecords: 10,
});



//DIPUTADOS ORADORES VIEW

App.OradoresDiputadoIndexView = Ember.View.extend({
	templateName: 'oradores-diputados-index',
});

App.OradoresDiputadoSesionConsultaView = Ember.View.extend({
	templateName: 'oradores-diputados-sesion-consulta',

	didInsertElement: function(){
		//===== Accordion =====//		
		$('div.menu_body:eq(0)').show();
		$('.acc .whead:eq(0)').show().css({color:"#2B6893"});
		
		$(".acc .whead").click(function() {	
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
	columnas: ['Fecha', 'Titulo', 'Sala', 'Observaciones', 'Estado'],
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
	columnas: ['Fecha', 'titulo', 'Ver'],
});


App.PlanDeLaborView = Ember.View.extend({
	templateName: 'plan-de-labor-detalle',
	contentBinding: "App.planDeLaborController.content",

	crearSesion: function () {

		var sesion = App.Sesion.extend(App.Savable).create({titulo:"Sesion 24/04/2013", fecha: 1366812030, tipo: "SesionOrdinariaDeTablas", periodoOrdinario:23, sesion:3, reunion:3, idPl: this.get('content.id')});

		var temas = [];
		var orden = 0;
		
		if (this.get('content.ods')) {
			this.get('content.ods').forEach(function (od){
				temas.addObject(
					App.Tema.create({
						titulo: "OD Nro " + od.numero,
						orden: orden,
						plId: od.id,
						plTipo: 'o',
					})
				);
				orden = orden + 1;
			});
		}

		if (this.get('content.dictamenes')) {
			this.get('content.dictamenes').forEach(function (dictamen){
				var tema = App.Tema.create();
				tema.setProperties({
						titulo: "Dictamen: " + dictamen.sumario,
						orden: orden,
						plId: dictamen.id,
						plTipo: 'd',
				});
				temas.addObject(tema);
				orden = orden + 1;
			});
		}

		if (this.get('content.proyectos')) {
			this.get('content.proyectos').forEach(function (expediente){
				temas.addObject(
					App.Tema.create({
						titulo: "Expediente " + expediente.expdip + " " + expediente.tipo,
						orden: orden,
						plId: expediente.id,
						plTipo: 'e',
					})
				);
				orden = orden + 1;
			});				
		}

		sesion.set('temas', temas);

		var url = "/crearSesion/planDeLabor";

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
			App.get('router').transitionTo('recinto.oradores.sesionConsulta.indexSubRoute', this.model);
		}		
	}

});

App.PlanDeLaborListadoView = Ember.View.extend({
	templateName: 'plan-de-labor-listado',
});

App.ODMiniView = Ember.View.extend({
	templateName: 'od-mini',

	dictamen: function () {
		if (this.get('content.dictamen'))
			return App.Dictamen.create(this.get('content.dictamen'));
		else
			return null;
	}.property('content'),


	didInsertElement: function () {
		//$('#htmlText').text(this.get('content.texto'));
	},

});

App.ExpedienteMiniView = Ember.View.extend({
	templateName: 'expediente-mini',	
});

//OD

App.DictamenMiniView = Ember.View.extend({
	templateName: 'dictamen-mini',
	
});

App.CrearODView = Ember.View.extend({
	templateName: 'crear-orden-del-dia',
});

App.OrdenDelDiaDetalleView = Ember.View.extend({
	templateName: 'orden-del-dia-detalle',
});

App.OrdenesDelDiaListView = Ember.View.extend({
	templateName: 'orden-del-dia-listado',
});

App.OrdenesDelDiaDictamenesListView = Ember.View.extend({
	templateName: 'orden-del-dia-dictamenes',
});


App.DictamenView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'orden-del-dia-dictamen-item',

	crearOD: function () {

		 if (!App.get('dictamenController'))
		 	App.dictamenController = App.DictamenController.create();

		 fn = function() {
			App.get('router').transitionTo('comisiones.ordenesDelDia.ordenDelDia.crear');				
		 };

		 App.get('dictamenController').addObserver('loaded', this, fn);
		 App.get('dictamenController').load();
	},
});

App.DictamenesListView = App.ListFilterView.extend({ 
	itemViewClass: App.DictamenView, 	
	columnas: ['Fecha', 'Sumario', 'Crear OD'],
});

App.OrdenDelDiaView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'orden-del-dia-od-item',

	verOD: function () {

		 if (!App.get('ordenDelDiaController'))
		 	App.ordenDelDiaController = App.OrdenDelDiaController.create();

		 fn = function() {
			App.get('router').transitionTo('comisiones.ordenesDelDia.ordenDelDia.ver', this.get('content'));
		 };

		 App.get('ordenDelDiaController').addObserver('loaded', this, fn);
		 App.get('ordenDelDiaController').load();
	},
});

App.OrdenDelDiaListView = App.ListFilterView.extend({ 
	itemViewClass: App.OrdenDelDiaView, 	
	columnas: ['Numero', 'Fecha', 'Sumario', 'Ver'],
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
	}.property('content','change'),

	guardar: function () {
		this.set('change', false);
		this.get('content').save();
	},
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
	columnas: ['ID', 'Label','Roles', 'Acciones'],
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
	columnas: ['ID', 'Label','Comisiones', 'Acciones'],
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
	classNameBindings: ['content.seleccionada:active'],

	
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

App.ChosenMultipleSelect = Em.Select.extend({
    multiple: true,
    attributeBindings: [ 'multiple' ],
    placeholder: '',

    didInsertElement: function(){
        this._super();
        //this.$().data("placeholder", this.get('placeholder')).chosen();
    },
 
    selectionChanged: function() {
        this.$().trigger('liszt:updated');
    }.observes('selection')
});

App.ExpedientesView = App.ListFilterView.extend({
	templateName: 'expedientes',
	itemViewClass: App.ExpedienteView,
	sorting: false,
	filterFirmantes: '',
	startFecha: '',
	endFecha: '',
	filterComisiones: [],
	filterTipos: [],
	tipos: ['LEY', 'RESOLUCION', 'DECLARACION', 'COMUNICACION', 'MENSAJE'],

	isExpanded: false,

	toogleSearch: function() {
		this.set('isExpanded', !this.get('isExpanded'));
		console.log(this.get('isExpanded'));
	},
	
	didInsertElement: function(){
		$("#expedientesAdvancedSearch").hide();
	},
	expedientesAdvancedSearch: function(){
		this.$("#expedientesAdvancedSearch").slideToggle();
	},
	ordenarAscID: function(event) {
		this.ordenarPorCampo('expdip', true);
	},
	ordenarDescID: function(event) {
		this.ordenarPorCampo('expdip', false);
	},

	ordenarAscTipo: function(event) {
		this.ordenarPorCampo('tipo', true);
	},
	ordenarDescTipo: function(event) {
		this.ordenarPorCampo('tipo', false);
	},

	ordenarAscTitulo: function(event) {
		this.ordenarPorCampo('titulo', true);
	},
	ordenarDescTitulo: function(event) {
		this.ordenarPorCampo('titulo', false);
	},

	ordenarAscFirmantes: function(event){
		this.ordenarPorCampo('firmantesLabel', true);
	},
	ordenarDescFirmantes: function(event){
		this.ordenarPorCampo('firmantesLabel', false);
	},

	ordenarAscIniciado: function(event){
		this.ordenarPorCampo('iniciado', true);
	},
	ordenarDescIniciado: function(event){
		this.ordenarPorCampo('iniciado', false);
	},

	ordenarAscGiros: function(event){
		this.ordenarPorCampo('girosLabel', true);
	},
	ordenarDescGiros: function(event){
		this.ordenarPorCampo('girosLabel', false);
	},
	setSorting: function(){
		console.log('click en el header...');
	},
	
	ordenarPorCampo: function (campo, order){		
		App.get('expedientesController').set('sortProperties', [campo]);
		App.get('expedientesController').set('sortAscending', order);
	},

	listaExpedientes: function (){
		localStorage.setObject('tipos', App.get('comisionesController.content'));

		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('expedientesController').get('arrangedContent').filter(function(expediente){
			return regex.test((expediente.tipo + expediente.titulo + expediente.expdip + expediente.get('firmantesLabel') + expediente.get('girosLabel')).toLowerCase());
		});

		var regexFirmantes = new RegExp(this.get('filterFirmantes').toString().toLowerCase());
		filtered = filtered.filter(function(firmante){
			return regexFirmantes.test((firmante.get('firmantesLabel')).toLowerCase());
		});

		var comisiones = $.map(this.get('filterComisiones'), function (value, key) { return value.get('nombre'); })
		filtered = filtered.filter(function(expediente){
			var giros = $.map(expediente.get('giro'), function (value, key) {  return value.comision; })
			var result = true;
			comisiones.forEach(function(comision) {
				if (!giros.contains(comision))
					result = false;
			});
			return result;
		});
	
		var getFilterTipos = $.map(this.get('filterTipos'), function (value, key){
			return value;
		})
		
		if (getFilterTipos.length > 0) {
			filtered = filtered.filter(function(expediente){
				return getFilterTipos.contains(expediente.get('tipolabel'));
			});
		}

		if (this.get('startFecha') && this.get('endFecha')){
			_self = this;
			filtered = filtered.filter(function(expediente){
				var expFecha = moment(expediente.get('pubFecha'), 'YYYY-MM-DD HH:ss');
				console.log(expFecha);
				var fechaD = moment(_self.get('startFecha'), 'DD/MM/YYYY');
				var fechaH = moment(_self.get('endFecha'), 'DD/MM/YYYY');	
				var range = moment().range(fechaD, fechaH);

				return range.contains(expFecha); // false
			});
		}

		var max = this.get('totalRecords');
		if (filtered.length <= max) {
			max = filtered.length;
			this.set('mostrarMasEnabled', false);
		} else {
			this.set('mostrarMasEnabled', true);
		}
		return filtered.splice(0, this.get('totalRecords'));
	}.property('startFecha', 'endFecha','filterText', 'filterFirmantes', 'filterTipos', 'filterComisiones', 'App.expedientesController.arrangedContent', 'totalRecords', 'sorting'),

	
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

	didInsertElement: function () {
	},
});

App.InicioView = Em.View.extend({
	templateName: 'inicio',
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
	
	clickTextoCompleto: function(e){
        console.log(this.getPath('App.expedienteConsultaController.content.url'));
    }
});

App.CitacionConsultaView = Em.View.extend({
	templateName: 'citacionConsulta',
});

App.CalendarTool = Em.View.extend({
    tagName: 'div',
    attributeBindings: ['id', 'events', 'owner'],
    classNamesBindings: ['class'],

    didInsertElement: function(){
	       $('#mycalendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay '
            },
            editable: false,
		   timeFormat: {
		    agenda: 'h(:mm)t{ - h(:mm)t}',
		    '': 'h(:mm)t{-h(:mm)t }'
		   },
		   monthNames: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ], 
		   monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
		   dayNames: [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		   dayNamesShort: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
		   buttonText: {
		    today: 'Hoy',
		    month: 'Mes',
		    week: 'Semana',
		    day: 'Día'
		   },
		   allDayText: 'Todo el día',
			events: function(start, end, callback) {
				
				var fn = function() {
				
					App.get('citacionesController').removeObserver('loaded', this, fn);
					App.get('citacionesController').get('content').forEach(function (citacion) {
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
							citacion.set('url', '');
						}	
					});					
					callback(App.get('citacionesController').get('content'));
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
	classNames: ['nav'],
	tagName: 'ul',
});

App.MenuItemView = Em.View.extend({
	tagName: 'li',
	templateName: 'menuItem',
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
	
//	showErrors: false,

	seleccionarTodos: function () {
		var _self = this;
		this.set('seleccionados', !this.get('seleccionados'));
		this.get('listaExpedientesSeleccionados').forEach(function (expediente) {
			expediente.set('seleccionado', _self.get('seleccionados'));
		});
	},
	
	crearTema: function () {
		var tema = App.CitacionTema.create({descripcion: this.get('tituloNuevoTema'), proyectos: [], grupo: true});
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
	}.property('invitado.nombre', 'invitado.apellido', 'invitado.caracter', 'invitado.mail'),
	
	cargarExpedientesHabilitado: function () {
		return App.get('citacionCrearController.content.comisiones').length > 0;
	}.property('adding'),
	
	cargarExpedientes: function () {
		App.get('citacionCrearController').cargarExpedientes();
	},
	
	guardar: function () {
		console.log('Guardando los datos....');

		if (!$("#crear-citacion-form").validationEngine('validate') || !this.get('cargarExpedientesHabilitado'))
		{
			return;
		}
		
		var temas = App.get('citacionCrearController.content.temas');
		var temasToRemove = [];
		
		
		temas.forEach(function (tema) {
			var proyectos = tema.get('proyectos');
			if (proyectos.length == 0)
				temasToRemove.addObject(tema);
		});
		
		temas.removeObjects(temasToRemove);
		
		console.log(this.get('startFecha'));
		
		
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
		
		console.log('click comision');
		if (App.get('citacionCrearController.isEdit') == true) return;

		this.set('adding', !this.get('adding'));
		var item = App.get('citacionCrearController.content.comisiones').findProperty("id", comision.get('id'));
        if (!item) {
        	//console.log('Agregando Comision');
			App.get('citacionCrearController.content.comisiones').pushObject(comision);
		}
		else {
        	//console.log('Removiendo Comision');
			App.get('citacionCrearController.content.comisiones').removeObject(comision);
		}
	},
	
	clickExpediente: function (expediente) {
		var tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), grupo: false, proyectos: []})
		App.get('citacionCrearController.content.temas').addObject(tema);
		tema.get('proyectos').addObject(expediente);
		expediente.get('tema', null);
		
		this.set('adding', !this.get('adding'));
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
	
	
	clickDesagrupar: function (expediente) {
		
		var temaAnterior = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('tema'));
		temaAnterior.get('proyectos').removeObject(expediente);
		var tema = App.get('citacionCrearController.content.temas').findProperty('descripcion', expediente.get('expdip'));
		if (!tema)
		{
			tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), grupo: false, proyectos: []})
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
				return regex.test((expediente.tipo).toLowerCase() + (expediente.titulo).toLowerCase() + (expediente.expdip).toLowerCase());
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
		
	}.property('citacionCrearController.expedientes', 'filterTextExpedientes', 'citacionCrearController.content.temas.@each', 'adding'),	
	
	listaTemas: function () {
		var temas = App.get('citacionCrearController.content.temas').filterProperty('grupo', true);
		return temas;
	}.property('citacionCrearController.content.temas', 'adding'),
	
	listaExpedientesSeleccionados: function () {
		var expedientesSeleccionados = [];
		var temas = App.get('citacionCrearController.content.temas');
		if (!temas)
			return null;
		
		temas.forEach(function (tema) {
			var proyectos = tema.get('proyectos');
			proyectos.forEach(function (expediente) {
				expedientesSeleccionados.addObject(expediente);
			});
		});
		if (expedientesSeleccionados.length > 0)
			return expedientesSeleccionados;
		else 
			return null;
	}.property('citacionCrearController.content.temas', 'citacionCrearController.content.temas.@each.proyectos', 'adding'),
	
	hayInvitados: function () {
		return App.get('citacionCrearController.content.invitados').length > 0;
	}.property('citacionCrearController.content.invitados', 'adding'),
	
	borrarExpedientes: function () {

		App.set('citacionCrearController.content.temas', []);
		App.set('citacionCrearController.expedientes', []);

		var fo = App.get('citacionCrearController.content.comisiones.firstObject');
		if (fo)
		{
			App.get('citacionCrearController').addObserver('loaded', this, this.cargarExpedientesSuccess);
			App.get('citacionCrearController').cargarExpedientes();
		}

		fo = null;
		
	},

	cargarExpedientesSuccess: function () {
		console.log('amsdasdasd');
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

	didInsertElement: function() {
		/*
			Se presenta esta condicion en caso de que:
				*La citación ya exista
				*Si se está modificando los datos de una citación existente
		*/

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
				fecha: moment(this.get('startFecha'), 'DD/MM/YYYY').format('YYYY-MM-DD') + ' ' +this.get('startHora'),
				comisiones: this.get('citacion.comisiones'),
				citacion: App.Citacion.create({id: this.get('citacion.id') })
			}));
		} else if (opts.secondary) {
			//alert('cancel')
		} else {
			//alert('close')
		}
		event.preventDefault();
	}, 
	
	didInsertElement: function() {	
		this.set('startFecha', moment(App.get('citacionConsultaController').content.start, 'YYYY-MM-DD').format('DD/MM/YYYY'));
		this.set('startHora', moment(App.get('citacionConsultaController').content.start, 'YYYY-MM-DD hh:ss').format('hh:ss'));
		
		$('.timepicker').timeEntry({
			show24Hours: true, // 24 hours format
			showSeconds: false, // Show seconds?
			spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
			spinnerSize: [19, 26, 0], // Image size
			spinnerIncDecOnly: true, // Only up and down arrows
			timeSteps: [1, 15, 1],
			defaultTime: this.get('startHora')
		});	 
		
		$('.timepicker').timeEntry('setTime', this.get('startHora'));
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
	
	didInsertElement: function () {
		$('.tipS').tipsy({gravity: 's',fade: true, html:true});
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
	
	verReunion: function () {
		App.set('reunionConsultaController.loaded', false);
		App.get('router').transitionTo('loading');
		App.set('reunionConsultaController.content', App.Reunion.create({id: this.get('content').get('id')}));

		var deferred = $.Deferred();
		
		fn2 = function () {
		
			var reunion = App.get('reunionConsultaController.content');
			var citacion = App.get('citacionConsultaController.content');
			var temas = [];
			citacion.get('temas').forEach(function (tema) {
				temas.addObject(App.CitacionTema.create(tema));
			});
			citacion.set('temas', temas);
			
			App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', this.get('content'));							
		}
		
		fn = function() {
			var reunion = App.get('reunionConsultaController.content');
			App.set('citacionConsultaController.loaded', false);
			App.set('citacionConsultaController.content', App.Citacion.create({id: reunion.citacion.id}));
			App.get('citacionConsultaController').addObserver('loaded', this, fn2);
			App.get('citacionConsultaController').load();
			App.get('reunionConsultaController').removeObserver('loaded', this, fn);
		}							
		
		App.get('reunionConsultaController').addObserver('loaded', this, fn);
		App.get('reunionConsultaController').load();	
	},
	
	crearParte: function () {
		
		App.set('reunionConsultaController.loaded', false);
		App.get('router').transitionTo('loading');
		App.set('reunionConsultaController.content', App.Reunion.create({id: this.get('content').get('id')}));

		var deferred = $.Deferred();
		
		fn2 = function () {
		
			var reunion = App.get('reunionConsultaController.content');
			var citacion = App.get('citacionConsultaController.content');
			var temas = [];
			citacion.get('temas').forEach(function (tema) {
				temas.addObject(App.CitacionTema.create(tema));
			});
			citacion.set('temas', temas);
			
			App.get('router').transitionTo('comisiones.partes.parteConsulta.crearParte');							
		}
		
		fn = function() {
			var reunion = App.get('reunionConsultaController.content');
			App.set('citacionConsultaController.loaded', false);
			App.set('citacionConsultaController.content', App.Citacion.create({id: reunion.citacion.id}));
			App.get('citacionConsultaController').addObserver('loaded', this, fn2);
			App.get('citacionConsultaController').load();
			App.get('reunionConsultaController').removeObserver('loaded', this, fn);
		}							
		
		App.get('reunionConsultaController').addObserver('loaded', this, fn);
		App.get('reunionConsultaController').load();			
		
	},
});

App.ReunionesSinParteView = App.ListFilterView.extend({
	templateName: 'reuniones-sin-parte',
	itemViewClass: App.ReunionView,
	
	lista: function () {
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered = App.get('reunionesSinParteController').get('content').filter(function(reunion) {
			return regex.test((reunion.fecha).toLowerCase()) || regex.test((reunion.nota).toLowerCase());
		});
		var max = this.get('totalRecords');
		if (filtered.length <= max) {
			max = filtered.length;
			this.set('mostrarMasEnabled', false);
		} else {
			this.set('mostrarMasEnabled', true);
		}
		return filtered.splice(0, this.get('totalRecords'));
	}.property('filterText', 'App.reunionesSinParteController.content', 'totalRecords'),
	
	mostrarMasEnabled: false,
});

App.ReunionesConParteView = App.ListFilterView.extend({
	templateName: 'reuniones-con-parte',
	itemViewClass: App.ParteView,
	
	lista: function () {
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered = App.get('reunionesConParteController').get('content').filter(function(reunion) {
			return regex.test((reunion.fecha).toLowerCase()) || regex.test((reunion.nota).toLowerCase());
		});
		
		var max = this.get('totalRecords');
		if (filtered.length <= max) {
			max = filtered.length;
			this.set('mostrarMasEnabled', false);
		} else {
			this.set('mostrarMasEnabled', true);
		}
		return filtered.splice(0, this.get('totalRecords'));
	}.property('filterText', 'App.reunionesConParteController.content', 'totalRecords'),
	
	mostrarMasEnabled: false,
});



App.ReunionConsultaView = Em.View.extend({
	templateName: 'reunionConsulta',
	
	crearParte: function () {

		App.set('reunionConsultaController.content.parte', []);
		App.get('router').transitionTo('comisiones.partes.parteConsulta.crearParte');
	},
	
	editarParte: function () {
		App.get('router').transitionTo('comisiones.partes.parteConsulta.crearParte');	
	},
});

App.CrearParteView = Ember.View.extend({
	templateName: 'crear-parte',
	
	listaTemas: function () {
		return App.get('citacionConsultaController.content.temas');
	}.property('citacionConsultaController.content.temas'),
	
	guardarParte: function () {
		var parte = [];

		App.get('citacionConsultaController.content.temas').forEach(function(tema) {
			if (tema.get('parteEstado').id) {
				var parteItem;

				if (tema.get('dictamen') && tema.get('parteEstado').id == 4) {
					parteItem = tema.get('dictamen');
					parteItem.set('id_reunion', App.get('reunionConsultaController.content.id'));
					parteItem.set('tipo', tema.get('parteEstado.tipo'));
				} else {
					parteItem = tema.get('parteEstado');
					parteItem.proyectos = [];
					parteItem.orden = parte.length;
					

					tema.get('proyectos').forEach(function (proyecto){
						parteItem.proyectos.addObject(proyecto);
					});	
				}
				parte.addObject(parteItem);
			}
		});

		App.set('reunionConsultaController.content.parte', parte);
		
		fn = function () {
			App.get('reunionConsultaController.content').removeObserver('saveSuccess', this, fn);
			if (App.get('reunionConsultaController.content.saveSuccess') != true)
			{
				App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', App.get('reunionConsultaController.content'));
				$.jGrowl('Parte creado con Exito!', { life: 5000 });				
			}
			else
			{
				$.jGrowl('No se pudo crear el parte!', { life: 5000 });
			}
		}
		App.get('reunionConsultaController.content').save();
		App.get('reunionConsultaController.content').addObserver('saveSuccess', this, fn);
		
		
	},
});

App.EstadoParteView = Ember.View.extend({
	templateName: 'parte-estado',
	estado: 'Seleccione una accion',

	esDictamen: function () {
		if (!this.get('tema.parteEstado'))
			return false;
		else
			if (this.get('tema.parteEstado').id)
				return this.get('tema.parteEstado').get('id') == 4;
			else
				return false;

	}.property('tema.parteEstado'),

	listaEstados: [
		'Seleccione una accion',
		App.ParteEstado.create({id: 1, tipo: 'Iniciacion'}),
		App.ParteEstado.create({id: 2, tipo: 'En Estudio'}),
		App.ParteEstado.create({id: 3, tipo: 'PreDictamen'}),
		App.ParteEstado.create({id: 4, tipo: 'Dictamen'}),
	],
});


App.DictamenCrearView = Ember.View.extend({
	templateName: 'reunion-crear-parte-dictamen',
	filterExpedientes: '',
	adding: false,

	agregarTexto: function () {
		var texto = App.DictamenTexto.create({firmantes: []});
		this.get('content.textos').addObject(texto);
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
			
			filtered = App.get('expedientesController.content').filter(function(expediente) {
				return regex.test((expediente.tipo).toLowerCase() + (expediente.titulo).toLowerCase() + (expediente.expdip).toLowerCase());
			});
		}
		else
		{
			filtered = App.get('expedientesController.content');
		}
		
		if (this.get('content.proyectosVistos'))
		{
			this.get('content.proyectosVistos').forEach(function (expediente) {
				filtered = filtered.without(expediente)
			});
			return filtered;
		}
		else
			return filtered;
	}.property('content', 'content.proyectosVistos', 'adding', 'filterExpedientes'),

	didInsertElement: function () {
		this.set('tema.dictamen', App.Dictamen.create({proyectos: this.get('tema.proyectos'), proyectosVistos: [], textos: []}));
		this.set('content', this.get('tema.dictamen'));
	},
});

App.DictamenTextoCrearView = Ember.View.extend({
	templateName: 'reunion-crear-parte-dictamen-texto',
	filterFirmantes: '',
	adding: false,

	clickFirmante: function (firmante) {
		var item = this.get('content.firmantes').findProperty("id", firmante.get('id'));
        if (!item) {
        	firmante.set('seleccionado', true);
			this.get('content.firmantes').pushObject(firmante);
		}
		else {
			firmante.set('seleccionado', false);
			this.get('content.firmantes').removeObject(firmante);
		}
		this.set('adding', !this.get('adding'));		
	},

	listaFirmantes: function () {
		var filtered;
		if (this.get('filterFirmantes') != '')
		{
			var regex = new RegExp(this.get('filterFirmantes').toString().toLowerCase());
			
			filtered = App.get('firmantesController.content').filter(function(firmante) {
				return regex.test((firmante.id));
			});
		}
		else
		{
			filtered = App.get('firmantesController.content');
		}

		if (this.get('content.firmantes'))
		{
			this.get('content.firmantes').forEach(function (firmante) {
				filtered = filtered.without(firmante)
			});
			return filtered;
		}
		else
			return filtered;
	}.property('filterFirmantes', 'content.firmantes', 'adding'),
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


App.ExpedienteItemListView = Em.View.extend({
	templateName: 'expediente-item-list',
	tagName: 'li',

	clickItem: function () {
		this.get('parentView').get('parentView').clickExpediente(this.get('content'));
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
	classNameBindings: ['content.seleccionada:activeTab'],
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
		$.download('listas-imprimir', "&data=" + JSON.stringify(sesion));
	},	

});


App.TurnoView = Ember.View.extend({
	tagName: 'li',
	templateName: 'turno',
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
	
	index : function () {
		return this.get('contentIndex') + 1;
	}.property('contentIndex'),
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

	updateSort : function (idArray){
		var sortArr = this._super(idArray);

		App.get('turnosController').saveSort(sortArr);
		App.get('turnosController').actualizarHora();
	},
});

App.TurnosPorListaView = App.JQuerySortableView.extend({
	classNames: [ 'turnos'],
	itemViewClass: App.TurnoView, 

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



App.DiputadoSeleccionadoView = Em.View.extend({
	tagName: 'li',
	templateName: 'diputado-seleccionado',
		borrarDiputado: function () {
				this.get('parentView').get('parentView').borrarOrador(this.get('content'));
		},        
});

App.DiputadosSeleccionadosView = Ember.CollectionView.extend({
    classNames : [],  
	tagName: 'ul',
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
			if (opts.primary) {
				if (this.get('esInvalido')) 
					return false;			
				var tema = App.get('crearTemaController').get('tema');
				if (tema.get('id')) {
					 tema.save();
				} else {
					 App.get('temasController').createObject(tema, true);
				}
			} else if (opts.secondary) {
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

	errorMensajes: function () {
		var mensajes = [];
		var sesion = App.get('crearSesionController').get('sesion');

		if (sesion.titulo == null || sesion.titulo == "") 
			mensajes.push({titulo:"Debes escribir un titulo."});
		if (sesion.sesion == null || sesion.sesion == "")  
			mensajes.push({titulo:"Debes escribir un numero de sesion."});
		if (sesion.reunion == null || sesion.reunion == "") 
			mensajes.push({titulo:"Debes escribir un numero de reunion."});
		if (sesion.periodoOrdinario == null || sesion.periodoOrdinario == "") 
			mensajes.push({titulo:"Debes escribir un periodo Ordinario."});
		if (sesion.tipo == null) 
			mensajes.push({titulo:"Debes seleccionar un tipo de Sesion."});
		return mensajes;
	}.property('sesion.titulo', 'sesion.reunion', 'sesion.periodoOrdinario', 'sesion.sesion', 'sesion.tipo'),
	
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
				console.log('Mostrando errores...');

				if (this.get('esInvalido')) 
					return false;			
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