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

	
        $('#mycalendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay '
            },
            editable: false,
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
	},
});

App.InicioView = Em.View.extend({
	templateName: 'inicio',   
});

App.ApplicationView = Em.View.extend({
	templateName: 'application',
	
	mostrar : function () {
		this.get('testModal').mostrar();
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
	
	contentBinding: 'App.citacionCrearController.content',
	
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
	
	puedeEditar: function () {
		return this.get('content.estado.id') == 1 || !this.get('content.id');
	}.property('content.id', 'content', 'content.estado'),	
	
	puedeConfirmar: function () {
		return this.get('content.estado.id') == 1 && this.get('content.id');
	}.property('content.id', 'content', 'content.estado'),
	
	confirmar: function () {
		App.get('citacionCrearController').confirmar();
	},
	
	puedeCancelar: function () {
		return this.get('content.estado.id') == 2 && this.get('content.id');
	}.property('content.id', 'content', 'content.estado'),
		
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
	classNames: 'tab-pane pillow-emboss',
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
	classNames: ['nav', 'nav-tabs', 'nav-stacked', 'turnos'],
	itemViewClass: App.TurnoView, 

	updateSort : function (idArray){
		var sortArr = this._super(idArray);

		App.get('turnosController').saveSort(sortArr);
		App.get('turnosController').actualizarHora();
	},
});

App.TurnosPorListaView = App.JQuerySortableView.extend({
	classNames: ['nav', 'nav-tabs', 'nav-stacked', 'turnos'],
	itemViewClass: App.TurnoView, 

	updateSort : function (idArray){
		var sortArr = this._super(idArray);

		App.get('turnosController').saveSort(sortArr);
		App.get('turnosController').actualizarHora();
	},
});

App.TemasView = App.JQuerySortableView.extend({
	classNames: ['nav'],
	itemViewClass: App.TemaView,

	updateSort : function (idArray){
		var sortArr = this._super(idArray);

		App.get('temasController').saveSort(sortArr);
		App.get('turnosController').actualizarHora();
	}
});

App.SesionesView = App.JQuerySortableView.extend({
	classNames: ['nav', 'nav-tabs', 'nav-stacked'],
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
    classNames : ['nav', 'nav-tabs', 'nav-stacked'],  
	tagName: 'ul',
	itemViewClass: App.OradorView, 
}),

App.ModalView = Bootstrap.ModalPane.extend({
	showBackdrop: true,
});

App.DiputadoView = Em.View.extend({
	tagName: 'li',
	templateName: 'diputado',
		agregarDiputado: function () {
				this.get('parentView').get('parentView').agregarOrador(this.get('content'));
		},    
});

App.DiputadosView = Ember.CollectionView.extend({
    classNames : ['nav', 'nav-tabs', 'nav-stacked'],  
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
    classNames : ['nav', 'nav-tabs', 'nav-stacked'],  
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
		if (sesion.titulo == null || sesion.sesion == null || sesion.titulo == "" || sesion.reunion == null || sesion.sesion == "" ||  sesion.periodoOrdinario == null || sesion.periodoOrdinario == "" || sesion.tipo == null) 
			return true;
		else
			return false;
	}.property('sesion.titulo', 'sesion.reunion', 'sesion.periodoOrdinario', 'sesion.sesion', 'sesion.tipo'),
	
	callback: function(opts, event) {
			if (opts.primary) {
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
			
			this.set('fecha', moment().format("YYYY-MM-DD"));
			this.set('hora', moment().format("hh:ss"));
		
			$('.timepicker').timeEntry({
				show24Hours: true, // 24 hours format
				showSeconds: false, // Show seconds?
				spinnerImage: 'bundles/main/images/elements/ui/spinner.png', // Arrows image
				spinnerSize: [19, 26, 0], // Image size
				spinnerIncDecOnly: true, // Only up and down arrows
				defaultTime: this.get('hora')
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