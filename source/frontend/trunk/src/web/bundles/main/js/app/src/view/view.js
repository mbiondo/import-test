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

App.CitacionCrearView = Em.View.extend({
	templateName: 'citacion-crear',	
	filterText: '',
	adding: false,
	invitado: App.CitacionInvitado.create(),
	
	agregarInvitadoHabilitado: function () {
		var invitado = this.get('invitado');
		return invitado.nombre != '' && invitado.apellido != '' && invitado.caracter != '' && invitado.mail != '';
	}.property('invitado.nombre', 'invitado.apellido', 'invitado.caracter', 'invitado.mail'),
	
	cargarExpedientesHabilitado: function () {
		return App.get('citacionCrearController.content.comisiones').length > 0;
	}.property('adding'),
	
	guardar: function () {
		App.get('citacionCrearController').create();
	},
	
	editar: function () {
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
	
	listaComisiones: function () {
		var regex = new RegExp(this.get('filterText').toString().toLowerCase());
		var filtered = App.get('comisionesController').get('content').filter(function(comision) {
			return regex.test((comision.nombre).toLowerCase());
		});
		return filtered.removeObjects(App.get('citacionCrearController.content.comisiones'));		
	}.property('citacionCrearController.content.comisiones', 'filterText', 'comisionesController.content', 'adding'),
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
    classNames : ['subNav'],  
	tagName: 'ul',
	itemViewClass: App.InvitadoView, 
});
