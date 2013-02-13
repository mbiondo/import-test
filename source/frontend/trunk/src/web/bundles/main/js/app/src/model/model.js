App.Expediente = Em.Object.extend({
	sortValue: function () {
		return this.get('fechaPub');
	}.property('fechaPub'),
});


App.Citacion = Em.Object.extend({
	id: null,
	title: '',
	start: '',
	invitados: '',
	comisiones: '',
	temas: '',
	observaciones: '',
	estado: {id: 1},
	sala: '',
	
	serializable : [
		'id',
		'title', 
		'start', 
		'invitados', 
		'temas', 
		'comisiones',
		'observaciones',
		'estado',
		'sala'
	],
});


App.MenuItem = Em.Object.extend({
	titulo: '',
	url: ''
});

App.CitacionInvitado = Em.Object.extend({
	id: null,
    nombre: '',
    apellido: '',
    caracter: '',
    mail: '',
    orden: '',
});

App.CitacionTema = Em.Object.extend({

});

App.CitacionSala = Em.Object.extend({
	id: '',
	numero: '',
	puertas: '',
	internos: '',
	pisos: '',
	
	toString: function () {
		return "Sala " + String(this.get('numero'));
	},
});

App.CitacionEstado = Em.Object.extend({

});

App.Comision = Em.Object.extend({
	
});
