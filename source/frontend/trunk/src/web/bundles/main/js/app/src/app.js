App = Ember.Application.create({
	ready: function () {
		this._super();
		App.initialize();
	}
});