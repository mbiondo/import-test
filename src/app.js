App = Ember.Application.create({
	rootElement: "#contentcolumn",
	ready: function () {
		this._super();
		App.initialize();
	}
});