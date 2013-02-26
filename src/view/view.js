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
  dateFormat: 'yy-mm-dd', //ISO 8601
 
  beforeShowDay: function(date) {
      return [true, ""];
  }
});

App.ListFilterView = Ember.View.extend({
	filterText: '',
	maxRecords: 10,
	records: [10, 25, 50, 100],
	
	mostrarMas: function () {
		this.set('totalRecords', this.get('totalRecords') + this.get('maxRecords'));
	},
	
	

	totalRecords: 10,
});

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

App.ExpedientesView = App.ListFilterView.extend({
	templateName: 'expedientes',
	itemViewClass: App.ExpedienteView,
	
	
	listaExpedientes: function () {
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered = App.get('expedientesController').get('content').filter(function(expediente) {
			return regex.test((expediente.tipo).toLowerCase()) || regex.test((expediente.titulo).toLowerCase()) || regex.test((expediente.expdip).toLowerCase());
		});
		var max = this.get('totalRecords');
		if (filtered.length <= max) {
			max = filtered.length;
			this.set('mostrarMasEnabled', false);
		} else {
			this.set('mostrarMasEnabled', true);
		}
		return filtered.splice(0, this.get('totalRecords'));
	}.property('filterText', 'App.expedientesController.content', 'totalRecords'),
	
	mostrarMasEnabled: true,
});

App.CitacionesView = App.ListFilterView.extend({
	templateName: 'citaciones',
	
	didInsertElement: function () {
	
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
				citacion.set('start', citacion.get('fechaHora'));
			}
			
		});
		
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
					App.set('citacionConsultaController.loaded', false);
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
});

App.InicioView = Em.View.extend({
	templateName: 'inicio',   
});

App.ApplicationView = Em.View.extend({
	templateName: 'application',
	
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

App.ExpedienteConsultaView = Em.View.extend({
	templateName: 'expedienteConsulta',
});

App.CitacionConsultaView = Em.View.extend({
	templateName: 'citacionConsulta',
});

App.CalendarTool = Em.View.extend({
    tagName: 'div',
    attributeBindings: ['id', 'events', 'owner'],
    classNamesBindings: ['class'],
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
	
	startHora: '',
	
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
		var empty = !(invitado.nombre != '' && invitado.apellido != '' && invitado.caracter != '' && invitado.mail != '');
		console.log(empty);
		
		return !empty && $("#crear-citacion-form").validationEngine('validate');
	}.property('invitado.nombre', 'invitado.apellido', 'invitado.caracter', 'invitado.mail'),
	
	cargarExpedientesHabilitado: function () {
		return App.get('citacionCrearController.content.comisiones').length > 0;
	}.property('adding'),
	
	cargarExpedientes: function () {
		App.get('citacionCrearController').cargarExpedientes();
	},
	
	guardar: function () {
	
		if (!$("#crear-citacion-form").validationEngine('validate') || !this.get('cargarExpedientesHabilitado') || this.get('listaExpedientesSeleccionados').length < 1)
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
		
		App.get('citacionCrearController.content').set('start', this.get('startFecha') + " " + moment($('.timepicker').timeEntry('getTime')).format('hh:mm'));
		
		App.get('citacionCrearController').create();
	},
	
	editar: function () {
	
		if (!$("#crear-citacion-form").validationEngine('validate'))
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
		
		App.get('citacionCrearController.content').set('start', this.get('startFecha') + " " + moment($('.timepicker').timeEntry('getTime')).format('hh:mm'));	
		
		App.get('citacionCrearController').get('content').save();
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
		if (App.get('citacionCrearController.isEdit'))
			return;
			
		this.set('adding', !this.get('adding'));
		var item = App.get('citacionCrearController.content.comisiones').findProperty("id", comision.get('id'));
        if (!item) {
			App.get('citacionCrearController.content.comisiones').pushObject(comision);
		}
		else {
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
		var filtered = App.get('comisionesController').get('content').filter(function(comision) {
			return regex.test((comision.nombre).toLowerCase());
		});

		return filtered.removeObjects(App.get('citacionCrearController.content.comisiones'));		
	}.property('citacionCrearController.content.comisiones', 'filterTextComisiones', 'comisionesController.content', 'adding'),
	
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
		fo = null;
		App.get('citacionCrearController').cargarExpedientes();
	},
	
	puedeConfirmar: function () {
		return App.get('citacionCrearController.content.estado.id') == 1 && App.get('citacionCrearController.content.id');
	}.property('citacionCrearController.content.id', 'citacionCrearController.content', 'citacionCrearController.content.estado'),
	
	confirmar: function () {
		App.get('citacionCrearController').confirmar();
	},
	
	puedeCancelar: function () {
		return App.get('citacionCrearController.content.estado.id') == 2 && App.get('citacionCrearController.content.id');
	}.property('citacionCrearController.content.id', 'citacionCrearController.content', 'citacionCrearController.content.estado'),
		
	cancelar: function () {
		App.get('citacionCrearController').cancelar();
	},
		
	didInsertElement: function() {
		
		if (App.get('citacionCrearController.content.start') != '')
		{
			this.set('startFecha', App.get('citacionCrearController.content.start').split(' ')[0]);
			this.set('startHora', App.get('citacionCrearController.content.start').split(' ')[1]);
		}
		else
		{
			this.set('startFecha', moment().format("YYYY-MM-DD"));
			this.set('startHora', moment().format("hh:ss"));
		}
		
		$('.timepicker').timeEntry({
			show24Hours: true, // 24 hours format
			showSeconds: false, // Show seconds?
			spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
			spinnerSize: [19, 26, 0], // Image size
			spinnerIncDecOnly: true, // Only up and down arrows
			defaultTime: this.get('startHora')
		});	 
		
		$('.timepicker').timeEntry('setTime', this.get('startHora'));
		
		var fo = App.get('citacionCrearController.content.comisiones.firstObject');
		
		App.get('citacionCrearController.content.comisiones').addObserver('firstObject', this, this.borrarExpedientes);
		
		//$('#crear-citacion-form').validationEngine('attach');
		
		fo = null;
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
	tagName: 'li',
	templateName: 'invitado',
	
	clickInvitado: function () {
		this.get('parentView').get('parentView').clickInvitado(this.get('content'));
	}, 
});

App.InvitadosView = Ember.CollectionView.extend({
    classNames : [],  
	tagName: 'ul',
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
});


App.CitacionExpedientesSeleccionados = Ember.CollectionView.extend({ 
	tagName: 'tbody',
	itemViewClass: App.CitacionExpedienteSeleccionado, 
});