JQ = Ember.Namespace.create();

Ember.View.reopen({
	didInsertElement: function () {
		this._super();

		if (this.$()){
			this.$().fadeIn(500);
			// Use debugTemplates() # params: true/false
			this.$().prepend('<div class="view-template-block"><div class="view-template-name">' + this.get('templateName') + '</div></div>');
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

    didInsertElement: function(){
        this._super();
        //this.$().data("placeholder", this.get('placeholder')).chosen();
    },
 
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
    attributeBindings: ['data-required', 'data-error-message', 'data-validation-minlength', 'data-type', 'name', 'data-regexp'],
});

Ember.TextArea.reopen({
    attributeBindings: ['data-required', 'data-error-message', 'data-validation-minlength'],
});

Ember.Checkbox.reopen({
    attributeBindings: ['data-group', 'name'],
});

JQ.DatePicker = Em.View.extend(JQ.Widget, {
    uiType: 'datepicker',
    uiOptions: ['disabled', 'altField', 'altFormat', 'appendText', 'autoSize', 'buttonImage', 'buttonImageOnly', 'buttonText', 'calculateWeek', 'changeMonth', 'changeYear', 'closeText', 'constrainInput', 'currentText', 'dateFormat', 'dayNames', 'dayNamesMin', 'dayNamesShort', 'defaultDate', 'duration', 'firstDay', 'gotoCurrent', 'hideIfNoPrevNext', 'isRTL', 'maxDate', 'minDate', 'monthNames', 'monthNamesShort', 'navigationAsDateFormat', 'nextText', 'numberOfMonths', 'prevText', 'selectOtherMonths', 'shortYearCutoff', 'showAnim', 'showButtonPanel', 'showCurrentAtPos', 'showMonthAfterYear', 'showOn', 'showOptions', 'showOtherMonths', 'showWeek', 'stepMonths', 'weekHeader', 'yearRange', 'yearSuffix'],
    uiEvents: ['create', 'beforeShow', 'beforeShowDay', 'onChangeMonthYear', 'onClose', 'onSelect'],

    tagName: 'input',
    type: "text",
    attributeBindings: ['type', 'value', 'placeholder', 'data-validation-minlength', 'data-required', 'data-error-message'],
});

App.DatePicker = JQ.DatePicker.extend({
  dateFormat: 'dd/mm/yy', //ISO 8601
   attributeBindings: ['data-required', 'data-error-message', 'data-validation-minlength'],
 
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
		this._super();
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


App.LoginInput = Ember.TextField.extend({
	insertNewline: function(){
		if(!$('#login').parsley('validate')) return false;
	},
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
	
	falseLogin: function (){
		var usuario = App.Usuario.create({nombre: "testing", apellido: "testing", funcion: "DIPUTADO NACIONAL", cuil: "20306531817", roles: [App.Rol.create({id: 1, nivel: 5, nombre: "ROLE_USER"}), App.Rol.create({id: 2, nivel: 4, nombre: "ROLE_DIPUTADO"})]});
		App.userController.set('user', usuario);
		localStorage.setObject('user', JSON.stringify(usuario));
		App.get('router').transitionTo('loading');
		App.get('router').transitionTo('index');
	},	
	login: function () {
		if(!$('#login').parsley('validate')) return false;
		App.get('userController').loginCheck(this.get('cuil'), this.get('password'));
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

		return filtered.slice(0, this.get('totalRecords'));
	}.property('filterText', 'content', 'totalRecords', 'step'),
	
	updateScroll: function () {
		Ember.run.next(this, function () {
		  	$(document).scrollTop($(document).height());
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
	}, 
});



//DIPUTADOS ORADORES VIEW

App.OradoresDiputadoIndexView = Ember.View.extend({
	templateName: 'oradores-diputados-index',
});

App.OradoresDiputadoSesionConsultaView = Ember.View.extend({
	templateName: 'oradores-diputados-sesion-consulta',

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

		var sesion = App.Sesion.extend(App.Savable).create({titulo:"Sesion 03/07/2013", fecha: 1372865400, tipo: "SesionOrdinariaDeTablas", periodoOrdinario:130, sesion:6, reunion:7, idPl: this.get('content.id')});

		var temas = [];
		var orden = 0;
		sesion.set('plId', this.get('content.id'));

		if (this.get('content.ods')) {
			this.get('content.ods').forEach(function (od){
				var titulo = od.titulo ? od.titulo : "OD Nro " + od.numero;
				temas.addObject(
					App.Tema.create({
						titulo: titulo,
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


});

App.ExpedienteMiniView = Ember.View.extend({
	templateName: 'expediente-mini',	
	texto: function () {
		return this.get('content.texto').htmlSafe();
	}.property('content.texto'),});

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

	crear: function () {
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
		d.set('id_proy_cab', d.get('proyectos')[0].id);
		d.set('tipo', null);
		d.set('anio', moment(this.get('fecha'), 'DD/MM/YYYY').format('YYYY'));
		d.set('numero', this.get('numero'));
		d.set('publicacion', null);
		d.set('fechaImpresion', moment(this.get('fecha'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:ss'));
		d.set('copete', this.get('copete'));
		d.set('parte', null);



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

		delete d.id;

	    var dJson = JSON.stringify(dictamen);

	   	var url = "/dic/od";

        $.ajax({
            url: App.get('apiController').get('url') + url,
            contentType: 'text/plain',
            dataType: 'JSON',
            type: 'POST',
            data : dJson,
			success: this.loadSucceeded,
			complete: this.loadCompleted
        });		
	},

	loadCompleted: function () { 
		 if (!App.get('ordenesDelDiaController'))
		 	App.ordenesDelDiaController = App.OrdenesDelDiaController.create();

		 fn = function() {
			App.get('router').transitionTo('comisiones.ordenesDelDia.listadoOD');				
		 };

		 App.get('ordenesDelDiaController').addObserver('loaded', this, fn);
		 App.get('ordenesDelDiaController').load();		
	},

	loadSucceeded: function () {
		
	}
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
	columnas: ['Fecha', 'Sumario', 'Ver Dictamen'],
});

App.DictamenSinODItemView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'dictamen-sin-od-item',

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
	columnas: ['Fecha', 'Sumario', 'Crear OD'],
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



App.NotificacionTipoCrearView = Ember.View.extend({
	templateName: 'notificacion-tipo-crear',

	notificationType: null,

	itemClicked: function (object) {
		switch (object.constructor.toString()) {
			case "(subclass of App.Rol)":
				var item = this.get('notificationType.roles').findProperty("id", object.get('id'));
		        if (!item) {
					this.get('notificationType.roles').pushObject(object);
				}
				else {
					this.get('notificationType.roles').removeObject(item);
				}
				break;
			case "App.Comision":
				var item = this.get('notificationType.comisiones').findProperty("id", object.get('id'));
		        if (!item) {
					this.get('notificationType.comisiones').pushObject(object);
				}
				else {
					this.get('notificationType.comisiones').removeObject(item);
				}
				break;
			case "(subclass of App.Estructura)":
				var item = this.get('notificationType.estructuras').findProperty("id", object.get('id'));
		        if (!item) {
					this.get('notificationType.estructuras').pushObject(object);
				}
				else {
					this.get('notificationType.estructuras').removeObject(item);
				}
				break;
			case "(subclass of App.Funcion)":
				var item = this.get('notificationType.funciones').findProperty("id", object.get('id'));
		        if (!item) {
					this.get('notificationType.funciones').pushObject(object);
				}
				else {
					this.get('notificationType.funciones').removeObject(item);
				}
				break;
		}
	},

	guardar: function () {
		this.get('notificationType').create();
	},

	didInsertElement: function () {
		this._super();
		this.set('notificationType', App.NotificacionTipo.extend(App.Savable).create({}));
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
	columnas: ['ID', 'Nombre','Titulo', 'icono', 'Roles', 'Estructuras', 'Funciones', 'Comisiones'],
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

	columnas: [
		App.SortableColumn.create({nombre: 'Número de Expediente', campo: 'expdip'}), 
		App.SortableColumn.create({nombre: 'Tipo', campo: 'tipo'}),
		App.SortableColumn.create({nombre: 'Titulo', campo: 'titulo'}),
		App.SortableColumn.create({nombre: 'Camara de inicio', campo: 'iniciado'}),
		App.SortableColumn.create({nombre: 'Firmantes', campo: 'firmantesLabel'}),
		App.SortableColumn.create({nombre: 'Comisiones', campo: 'girosLabel'}),
	],	

	filterFirmantes: '',
	startFecha: '',
	endFecha: '',
	filterComisiones: [],
	filterTipos: [],
	tipos: ['LEY', 'RESOLUCION', 'DECLARACION', 'COMUNICACION', 'MENSAJE'],

	isExpanded: false,

	toogleSearch: function() {
		this.set('isExpanded', !this.get('isExpanded'));
	},
	
	didInsertElement: function(){
		this._super();
		$("#expedientesAdvancedSearch").hide();
	},

	expedientesAdvancedSearch: function(){
		this.$("#expedientesAdvancedSearch").slideToggle();
	},

	deseleccionarComision: function () {
		this.set('filterComisiones', null);
	},

	deseleccionarTipos: function () {
		this.set('filterTipos', null);
	},

	lista: function (){
		localStorage.setObject('tipos', App.get('comisionesController.content'));

		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		filtered = App.get('expedientesController').get('arrangedContent').filter(function(expediente){
			return regex.test((expediente.tipo + expediente.titulo + expediente.expdip + expediente.get('firmantesLabel') + expediente.get('girosLabel')).toLowerCase());
		});

		var regexFirmantes = new RegExp(this.get('filterFirmantes').toString().toLowerCase());
		filtered = filtered.filter(function(firmante){
			return regexFirmantes.test((firmante.get('firmantesLabel')).toLowerCase());
		});

		if(this.get('filterComisiones')){
			var comision = this.get('filterComisiones').get('nombre');

			filtered 	= filtered.filter(function(expediente){
			   var giros = $.map(expediente.get('giro'), function (value, key) {  return value.comision; });
			   if (!giros.contains(comision))
			           return false;
			   else
			        return true;
			});        
		}


		if(this.get('filterTipos')){
			var tipo  = this.get('filterTipos');
			filtered  = filtered.filter(function(expediente){
				if(expediente.tipo == tipo)
					return true;
			});
		}

		if (this.get('startFecha') && this.get('endFecha')){
			_self = this;

			filtered = filtered.filter(function(expediente){
				var expFecha = moment(expediente.get('pubFecha'), 'YYYY-MM-DD HH:ss');
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
		return filtered.slice(0, this.get('totalRecords'));
	}.property('startFecha', 'endFecha','filterText', 'filterFirmantes', 'filterTipos', 'filterComisiones', 'App.expedientesController.arrangedContent', 'totalRecords', 'sorting'),	
});



App.ExpedientesView = Em.View.extend({
	templateName: 'expedientes',
});

App.ExpedienteArchivadoItemListView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'expedienteArchivado',
});

App.ExpedienteArchivadoListView = App.ListFilterView.extend({ 
	itemViewClass: App.ExpedienteArchivadoItemListView, 	
	columnas: ['Seleccionar', 'N&uacute;mero de Expediente', 'Tipo de Proyecto', 'T&iacute;tulo', 'C&aacute;mara de Inicio']
    
     
});



App.ExpedientesArchivadosView = Ember.View.extend({
    templateName: 'expedientesArchivados',
    startFecha: '',
    endFecha: '',
    archivadoFecha: '',
    anio:2012,
    anios: [2012, 2011, 2010, 2009],

    cambiarAnio: function () {
    	App.get('expedientesArchivadosController').loadByAnio(this.get('anio'));
    }.observes('anio'),

    archivarExpedientes: function (){
            var seleccionados = App.get('expedientesArchivadosController').get('arrangedContent').filterProperty('seleccionado', true);

            var fecha = this.get('archivadoFecha');
            var user = localStorage.getObject('user');
            var usuario = App.Usuario.create(JSON.parse(user));
            
            var listaEnvioArchivo = App.ListaEnvioArchivo.create();
            
            listaEnvioArchivo.set('fecha', moment(fecha, 'DD/MM/YYYY').format("YYYY-MM-DD  HH:mm"));
            listaEnvioArchivo.set('autor', usuario.get('nombre') + " " + usuario.get('apellido') );
            listaEnvioArchivo.set('expedientes', seleccionados);
            
            var listaJSON = JSON.stringify(listaEnvioArchivo);
            
            var url = "/com/env/envio";
            
            $.ajax({
                    url: App.get('apiController').get('url') + url,
                    contentType: 'text/plain',
                    dataType: 'JSON',
                    type: 'POST',
                    data : listaJSON,
                    success: this.createSucceeded,
            });
	},

	createSucceeded: function (data) {
            
            if (data.id) {
                fn = function() {
                    App.get('expedientesArchivadosController').get('arrangedContent').setEach('seleccionado', false);
                    App.get('envioArchivoController').removeObserver('loaded', this, fn);	
                    App.get('router').transitionTo('expedientesArchivados.index.index');					
                };

                $.jGrowl('Se ha creado el env&iacute;o satisfactoriamente!', { life: 5000 });
				App.get('envioArchivoController').addObserver('loaded', this, fn);
                $.jGrowl('Se ha creado el env&iacute;o satisfactoriamente!', { life: 5000 });                
                App.get('envioArchivoController').addObserver('loaded', this, fn);
                App.get('envioArchivoController').load();
               
            } else 
            {
                $.jGrowl('Ocurrió un error al intentar crear el env&iacute;o!', { life: 5000 });
            }
	},
        
        
	mostrarMasEnabled: true,
});


// Listado de envios:

App.EnvioArchivoItemListView = Ember.View.extend({
	tagName: 'tr',
	templateName: 'envioArchivado',
});

App.EnvioArchivoListView = App.ListFilterView.extend({ 
	itemViewClass: App.EnvioArchivoItemListView, 	
	columnas: ['Ver Env&iacute;o', 'Fecha Archivado', 'Autor', 'Estado'],
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
	
	exportar: function () {
		$.download('exportar/envio', "&type=envio&data=" + JSON.stringify(App.envioArchivoConsultaController.content));
	},
	toggleBotonConfirmar: function() {
            this.set('isExpanded', !this.get('isExpanded'));
            this.$("#confirmarBotonDiv").slideToggle();
	},
	
	didInsertElement: function(){
			this._super();
            $("#confirmarBotonDiv").hide();
            this.set('content', App.get('envioArchivoConsultaController.content'));
            if (App.get('envioArchivoConsultaController.content.estado')=="Pendiente") {
                this.set('isPendiente', true);
            }
	},

	confirmarToggle: function(){
		this.$("#confirmarBotonDiv").slideToggle();
	}, 
        
        
        confirmarEnvio: function(){
    
            var idConfirmar = JSON.stringify(this.get('content.id'));
            
            var url = "/com/env/envio/confirmar";
            
            $.ajax({
                    url: App.get('apiController').get('url') + url,
                    contentType: 'text/plain',
                    dataType: 'JSON',
                    type: 'POST',
                    data : idConfirmar,
                    success: this.createSucceeded,
            });        
        },
                

	createSucceeded: function (data) {
            
            if (data.id) {
                fn = function() {
                    App.get('envioArchivoController').removeObserver('loaded', this, fn);	
                    App.get('router').transitionTo('enviosArchivo.index');					
                };

                App.get('envioArchivoController').addObserver('loaded', this, fn);
                App.get('envioArchivoController').load();
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

	fileWithOutFolder: function () {
		if (this.get('content')) {
			return this.get('content').replace(this.get('folder'), '');
		}
		return "";
	}.property('content', 'folder'),
});

App.InicioView = Em.View.extend({
	templateName: 'inicio',

	didInsertElement: function(){
		this._super();
		$(".submenu-news").bind('click', function(){
			var lista 	= $("#news-lista");
			var get_id 	= $(this).prop('id');

			lista.find("ul").stop();
			lista.find("ul").not('.'+get_id).fadeOut(0);
			lista.find("ul."+get_id).fadeIn(900);
		});

		//CREATE NOTIFICATION TEST 
		//var notification = App.Notificacion.extend(App.Savable).create();
		//ACA TITULO DE LA NOTIFICACION
		//notification.set('tipo', 'Test');
		//Si hace falta ID del objeto modificado
		//notification.set('objectId', 1);
		//Link del objeto
		//notification.set('link', "#/citaciones");
		//CreateAt
		//notification.set('fecha', moment().format('DD-MM-YYYY HH:mm:ss'));
		//Custom message
		//notification.set('mensaje', "Custon message here!!");
		//Crear
		//notification.create();

		//
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
	
	clickTextoCompleto: function(e){
//        console.log(this.getPath('App.expedienteConsultaController.content.url'));
    }
});

App.CitacionConsultaView = Em.View.extend({
	templateName: 'citacionConsulta',
	puedeConfirmar: false,
	puedeCancelar: false,
	puedeCrearReunion: false,
	puedeEditar: false,

	hasPermission: function () {
		var comisiones = App.get('citacionConsultaController.content.comisiones');
		if (comisiones.length > 1) {
			if (App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES'))
				return true;
			else
				return false;
		} else {
			if (comisiones.length == 1) {
				if (App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES') || App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES'))
					return true;
				else
					return false;
			}
		}
		return true;
	}.property('citacionConsultaController.content.id'),	

	didInsertElement: function(){
		this._super();
		if((App.citacionConsultaController.content.estado.id == 2) 
			&& (!App.citacionConsultaController.content.reunion) 
			&& (moment(App.citacionConsultaController.content.start, 'YYYY-MM-DD HH:mm') < moment()))
			this.set('puedeCrearReunion', true);

		if(App.citacionConsultaController.content.estado.id == 1 && this.get('hasPermission')) 	this.set('puedeConfirmar', true);
		if(App.citacionConsultaController.content.estado.id != 3 && this.get('hasPermission')) 	this.set('puedeCancelar', true);	
		if(App.citacionConsultaController.content.estado.id == 1) 	this.set('puedeEditar', true);	
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
	estadoBorrador: false,
	citacionCrear: false,
	
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
				return regex.test((expediente.titulo).toLowerCase() + (expediente.expdip).toLowerCase());
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
				if (c)
					App.get('citacionCrearController.content.comisiones').pushObject(c);
			}
		}
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
			timeSteps: [1, 15, 1],
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
		this._super();
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
});


App.SinReunionesListView = App.ListFilterView.extend({	
	itemViewClass: App.ReunionView,
	columnas: [],
});

App.ReunionesSinParteListView = App.ListFilterView.extend({
	itemViewClass: App.ReunionView,
//	columnas: ['Fecha', 'Nota', 'Comisiones convocadas'],
	columnas: ['Fecha', 'Temas','Comisiones convocadas'],
});

App.ReunionesSinParteView = Em.View.extend({
	templateName: 'reuniones-sin-parte',
});

App.ReunionesConParteListView = App.ListFilterView.extend({
	itemViewClass: App.ReunionView,
//	columnas: ['Fecha', 'Nota', 'Comisiones convocadas'],
	columnas: ['Fecha', 'Temas', 'Comisiones convocadas'],
});

App.ReunionesConParteView = App.ListFilterView.extend({
	templateName: 'reuniones-con-parte',
});


App.CrearDictamenView = Em.View.extend({
	templateName: 'crear-dictamen',

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
	columnas: ['Fecha Reunion','Proyectos', 'Cargar Dictamen'],
});

App.DictamenConsultaView = Em.View.extend({
	templateName: 'dictamenConsulta',
	rechazoUnificadosModificado: false,
	pResolucionDeclaracionLey: false,

	didInsertElement: function(){
		this._super();

		$(".whead").on('click', function(){
			$(this).parent().children(":eq(1)").stop().slideToggle(1200);
		});
	},
	exportar: function(){
		$.download('exportar/dictamen', "&type=dictamen&data=" + JSON.stringify(App.dictamenConsultaController.content));
	},
});

App.DictamenTextoView = Em.View.extend({
	templateName: 'dictamen-texto',
	disicencias: false,

	didInsertElement: function(){
		this._super();
	}
});
App.DictamenFirmantesView = Em.View.extend({
	templateName: 'dictamen-firmantes',
	disidenciaTipo1: false,
	disidenciaTipo2o3: false,

	didInsertElement: function(){
		this._super();

		if(this.get('content').disidencia == 1) 
			this.set('disidenciaTipo1', true);
		if(this.get('content').disidencia == 2 || this.get('content').disidencia == 3) 
			this.set('disidenciaTipo2o3', true);
	}
});

App.DictamenesSinOrdenDelDiaView = Em.View.extend({
	templateName: 'dictamenes-sin-orden-del-dia',
});


App.ReunionConsultaView = Em.View.extend({
	templateName: 'reunionConsulta',
//	urlExpedientes: '/exp/proyectos',
	urlExpedientes: '/com/%@/proyectos/',
	filterExpedientes: '',
	tituloNuevoTema: '',
	seleccionados: false,
	citacion: null,
	isEdit: false,

	puedeCrearParte: function () {
		return App.get('userController').hasRole('ROLE_DIRECCION_COMISIONES') || App.get('userController').hasRole('ROLE_SECRETARIO_COMISIONES')
	}.property('App.userController.user'),

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
		var exp = [];
		data.forEach(function(i){
			exp.addObject(App.Expediente.extend(App.Savable).create(i));
		}, this);
		this.set('expedientes', exp);
		this.set('loaded', true);

		citacion = this.get('citacion');
		var temas = [];
		_self = this;
		citacion.get('temas').forEach(function (tema) {
			var t = App.CitacionTema.create();
			t.setProperties(tema);
			temas.addObject(t);
			//console.log(t);
			t.set('proyectos', mapObjectsInArrays(_self.get('expedientes'), t.get('proyectos')));
			var proyectos = t.get('proyectos');
			proyectos.forEach(function (proyecto) {
				if (t.get('grupo')) {
					proyecto.set('tema', t.get('descripcion'));
				}
			});									
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
		var tema = App.CitacionTema.create({descripcion: this.get('tituloNuevoTema'), proyectos: [], grupo: true});
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
			temas.forEach(function (tema) {
				var proyectos = tema.get('proyectos');
				if (proyectos.length == 0)
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
				App.set('citacionConsultaController.content', App.Citacion.create(Ember.copy(this.get('citacion'))));
				App.get('router').transitionTo('index');
				App.get('router').transitionTo('comisiones.reuniones.reunionesConsulta.verReunion', App.get('reunionConsultaController.content'));
				$.jGrowl('Reunion editada con éxito!', { life: 5000 });								
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
			var tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), grupo: false, proyectos: []})
			this.get('citacion.temas').addObject(tema);
			tema.get('proyectos').addObject(expediente);
			this.set('adding', !this.get('adding'));
		}
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
			tema = App.CitacionTema.create({descripcion: expediente.get('expdip'), grupo: false, proyectos: []})
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
				expedientesSeleccionados.addObject(expediente);
			});
		});
		return expedientesSeleccionados;
	}.property('citacion.temas', 'citacion.temas.@each.proyectos', 'adding'),
	
	crearParte: function () {
		App.eventosParteController = App.EventosParteController.create();

		fn = function () {
			App.set('reunionConsultaController.content.parte', []);
			App.get('router').transitionTo('comisiones.partes.parteConsulta.crearParte');
		}
		
		App.get('eventosParteController').addObserver('loaded', this, fn);
		App.get('eventosParteController').load();
	},
	
	editarParte: function () {
		App.get('router').transitionTo('comisiones.partes.parteConsulta.editarParte');	
	},

	didInsertElement: function () {
		this._super();
		var citacion = App.Citacion.extend(App.Savable).create(Ember.copy(App.get('citacionConsultaController.content')));
		this.set('citacion', citacion);
	},
});

App.CrearParteView = Ember.View.extend({
	templateName: 'crear-parte',
	nota: '',
	expedientes: [],

	listaTemas: function () {
		return App.get('citacionConsultaController.content.temas');
	}.property('citacionConsultaController.content.temas'),
	
	guardarParte: function () {
		$('#formCrearParte').parsley('destroy');
		if(!$('#formCrearParte').parsley('validate')) return false;

		App.confirmActionController.setProperties({
			title: 'Confirmar Crear parte',
			message: '¿ Esta seguro que desea crear el parte ?',
			success: null,
		});

		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();

	},

	confirmActionDone: function () {
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
					//console.log(App.get('reunionConsultaController.content'));

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
	templateName: 'reunion-crear-parte-dictamen',
	filterExpedientes: '',
	filterProyectosVistos: '',
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
			
			filtered = App.get('expedientesArchivablesController.content').filter(function(expediente) {
				return regex.test(expediente.get('label').toLowerCase());
			});
		}
		else
		{
			filtered = App.get('expedientesArchivablesController.content');
		}

//		return filtered.slice(0, 10);
		return filtered;
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
		//this.set('content', App.Dictamen.create(App.get('dictamenController.content.evento')));
		//===== Form elements styling =====//
		this.$("select, .check, .check :checkbox, input:radio, input:file").uniform();
		// 
		
		$(".whead").on('click', function(){
			$(this).parent().children(":eq(1)").stop().slideToggle(1200);
		});
		
	},



	guardar: function () {
		$('#formCrearParteDictamen').parsley('destroy');
		if(!$('#formCrearParteDictamen').parsley('validate')) return false;

		App.confirmActionController.setProperties({
			title: 'Cargar Dictamen',
			message: '¿ Esta seguro que desea guardar el dictamen ?',
			success: null,
		});

		App.confirmActionController.addObserver('success', this, this.confirmActionDone);
		App.confirmActionController.show();
	},
	

	confirmActionDone: function () {
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

			var url = App.get('apiController.url') + "/par/evento";

			$.ajax({
				url:  url,
				contentType: 'text/plain',
				type: 'POST',
				context: this,
				data : JSON.stringify(dictamen),
				success: function( data ) 
				{
					App.get('router').transitionTo('comisiones.dictamenes.pendientes');
				}
			});		
		}
	},
});

App.DictamenTextoCrearView = Ember.View.extend({
	templateName: 'reunion-crear-parte-dictamen-texto',
	filterFirmantes: '',
	adding: false,
	firmanteSeleccionado: null,
	disicencias: [{id: 1, titulo: "Sin dicedencias"}, {titulo: "Dicidencia Parcial", id: 2}, {titulo: "Dicidencia total", id: 3}],

	clickFirmante: function (firmante) {
		this.set('firmanteSeleccionado', null);

		var item = this.get('content.firmantes').findProperty("diputado.id", firmante.get('diputado.id'));
	    _self = this;

		Ember.run.next(function () {
	        if (!item) {
	        	_self.set('firmanteSeleccionado', firmante);

	        	Ember.run.next(function () {
	        		_self.$("input:radio").uniform();
	        	});
			}
			else {
				_self.get('content.firmantes').removeObject(item);
				_self.set('adding', !_self.get('adding'));	
				item.set('seleccionado', false);
			}
		});
	},

	addFirmante: function () {
		var item = App.FirmanteTextoDictamen.create(Ember.copy(this.get('firmanteSeleccionado')));
		//console.log(item);
		this.get('content.firmantes').pushObject(item);
		item.set('seleccionado', true);
		this.set('firmanteSeleccionado', null);
		this.set('adding', !this.get('adding'));
	},



	listaFirmantes: function () {
		var filtered;
		if (this.get('filterFirmantes') != '')
		{
			var regex = new RegExp(this.get('filterFirmantes').toString().toLowerCase());
			filtered = App.get('firmantesController.content').filter(function(firmante) {
				return regex.test((firmante.diputado.datosPersonales.apellido + firmante.diputado.datosPersonales.nombre).toLowerCase());
//				return regex.test((firmante.id));
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
			return filtered;
		}
		else
			return filtered;
	}.property('filterFirmantes', 'content.firmantes', 'adding'),

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

});


App.CrearTurnoInlineView = Em.View.extend({
	templateName: 'crear-orador-inline',
	turnoBinding: 'App.crearTurnoController.turno',
	filterText: '',
	selectedFilterText: '',
	clickGuardar: null,

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

		if (this.get('oradores').length > 0)
			return false;
		
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
	
	esInvalido: function () {
		var turno = App.get('crearTurnoController').get('turno');

		if (turno.tiempo < 1 || turno.listaId == null || turno.oradores == null || turno.oradores.length == 0 || (this.get('esDictamen') && turno.tag == null)) 
			return true;
		else
			return false;
	}.property('turno.listaId', 'turno.oradores', 'turno.oradores.length', 'turno.tiempo', 'turno.tag', 'turno.orden'),
	
	guardar: function(opts, event) {   
		this.set('clickGuardar', true);  

	  if (this.get('esInvalido')) 
		return false;

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
  	},

  	refreshTurno: function () {
		this.set('clickGuardar', false);

		if(App.get('listaController.content'))
			lista = App.get('listaController.content');
		else
			lista = null;
			
		var temaController = App.get('temaController');
		
		var turno = App.Turno.create({
				temaId:  App.get('temaController').get('content').get('id'),
				//listaId: lista == null ? null : lista.get('id'),
				listaId: null,
				tiempo: 5,
				oradores: []
		});
		App.get('crearTurnoController').set('turno', turno);  	
		this.$(".controls input[type='radio']").removeProp('checked');
  	}.observes('temaController.content', 'listaController.content'),

  	willInsertElement: function () {
  		this.refreshTurno();
  	},
});

/* Estadisticas */


App.PieGraphView = Ember.View.extend({
	attributeBindings: ['title', 'name', 'content'],
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
            	pointFormat: '',
	    		//pointFormat: "Value: {point.percentage:.2f}%" , 
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