App.menuController = App.MenuController.create({
	content: [
		App.MenuItem.create({
			titulo: 'Inicio',
			url: '#/',
		}),
		App.MenuItem.create({
			titulo: 'Expedientes',
			url: '#/expedientes',
		}),
		App.MenuItem.create({
			titulo: 'Citaciones',
			url: '#/citaciones',
		})		
	]
});

App.expedientesController = App.ExpedientesController.create({
	content: [],
});

App.citacionesController = App.CitacionesController.create({
	content: [],
});

App.citacionConsultaController = App.CitacionConsultaController.create();


App.expedienteController = App.ExpedienteController.create();
App.expedienteConsultaController = App.ExpedienteConsultaController.create();

//App.initialize();