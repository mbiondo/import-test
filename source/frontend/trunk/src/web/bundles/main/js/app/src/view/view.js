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
});

App.InicioView = Em.View.extend({
	templateName: 'inicio',   
});

App.ApplicationView = Em.View.extend({
	templateName: 'application',
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
		return invitado.nombre != '' && invitado.apellido != '' && invitado.caracter != '' && invitado.mail != '';
	}.property('invitado.nombre', 'invitado.apellido', 'invitado.caracter', 'invitado.mail'),
	
	cargarExpedientesHabilitado: function () {
		return App.get('citacionCrearController.content.comisiones').length > 0;
	}.property('adding'),
	
	cargarExpedientes: function () {
		App.get('citacionCrearController').cargarExpedientes();
	},
	
	guardar: function () {
		var temas = App.get('citacionCrearController.content.temas');
		var temasToRemove = [];
		
		temas.forEach(function (tema) {
			var proyectos = tema.get('proyectos');
			if (proyectos.length == 0)
				temasToRemove.addObject(tema);
		});
		
		temas.removeObjects(temasToRemove);
		
		console.log(App.get('citacionCrearController.content'));
		
		App.get('citacionCrearController').create();
	},
	
	editar: function () {
		var temas = App.get('citacionCrearController.content.temas');
		temas.forEach(function (tema) {
			var expedientes = tema.get('expedientes');
			if (expedientes.length < 1)
				temas.removeObject(tema);
		});	
		App.get('citacionCrearController').get('content').save();
	},
	
	crearInvitado: function () {
		var invitado = this.get('invitado');
		App.get('citacionCrearController.content.invitados').addObject(invitado);
		this.set('invitado', App.CitacionInvitado.create());
	},
	
	clickInvitado : function (invitado) {
		App.get('citacionCrearController.content.invitados').removeObject(invitado);
	},
	
	clickComision: function (comision) {
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
			return filtered.removeObjects(this.get('listaExpedientesSeleccionados'));
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