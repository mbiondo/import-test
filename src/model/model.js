App.Expediente = Em.Object.extend({
	sortValue: function () {
		return this.get('fechaPub');
	}.property('fechaPub'),
});


App.Citacion = Em.Object.extend({
});


App.MenuItem = Em.Object.extend({
	titulo: '',
	url: ''
});