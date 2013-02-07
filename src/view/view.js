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
		App.get('router').transitionTo('expedienteConsulta.indexSubRoute', this.get('content'));
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