App.Expediente = Em.Object.extend({
	sortValue: function () {
		return this.get('fechaPub');
	}.property('fechaPub'),
	
	seleccionado: false,
	
	firmantesLabel: function() {
		var firmantes = this.get('firmantes').sort(function (a, b) {
			return a.orden - b.orden;
		});
		
		if (firmantes.length == 1)
			return firmantes.objectAt(0).nombre;
		else
			return firmantes.objectAt(0).nombre + " y " + (firmantes.length - 1 ) + " más"; 
	}.property('firmantes'),	
	
	girosLabel: function () {
		var giros = this.get('giro').sort(function (a, b) {
			return a.orden - b.orden;
		});
		
		if (giros.length == 1)
			return giros.objectAt(0).comision;
		else
			return giros.objectAt(0).comision + " y " + (giros.length - 1 ) + " más"; 		
	}.property('giro'),
});


App.Citacion = Em.Object.extend({
	restUrl: "/cit/citacion/%@",
	
	id: null,
	title: '',
	start: '',
	invitados: '',
	comisiones: '',
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
	
	saveSucceeded: function (data) {
		if (data.responseText)
		{
			App.get('router').transitionTo('citaciones');
		}
	},	
});


App.MenuItem = Em.Object.extend({
	titulo: '',
	url: '',
	subMenu: '',
	seleccionado: '',
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
	id: '',
	descripcion: '',
	grupo: false,
	toString: function () {
		return this.get('descripcion');
	},
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
