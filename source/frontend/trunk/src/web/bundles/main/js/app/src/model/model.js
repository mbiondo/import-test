App.Usuario = Em.Object.extend({
	url: '/user',
	nombre: '',
	apellido: '',
	cuil: '',
	roles: '',
	estructuraReal: '',
	funcion: '',
	comisiones: '',

	serializable: [
		"cuil",
		"roles",
		"comisiones"
	],

	label: function () {
		return this.get('cuil');
	}.property('cuil'),
	
	estructura: function () {
		return this.get('estructuraReal');
	}.property('estructuraReal'),
});

App.Estructura = Em.Object.extend({
	url: '/user/estructura',
	id: '',
	nombre: '',
	roles: '',

	serializable: [
		"id",
		"nombre",
		"roles"
	],

	label: function () {
		return this.get('nombre');
	}.property('nombre'),

});

App.Funcion = Em.Object.extend({
	url: '/user/funcion',
	id: '',
	nombre: '',
	roles: '',
	
	serializable: [
		"id",
		"nombre",
		"roles"
	],

	label: function () {
		return this.get('nombre');
	}.property('nombre'),	
});

App.Rol = Em.Object.extend({
	url: '/user/rol',
	id: '',
	nombre: '',
	nivel: '',

	serializable: [
		"id",
		"nombre",
		"nivel"
	],

	toString: function () {
		return this.get('nombre');
	},
});

App.Expediente = Em.Object.extend({
	sortValue: '',
	
	seleccionado: false,

	tipolabel: function () {
		var regex = new RegExp('MENSAJE');
		if (regex.test(this.get('tipo'))) {
			return 'MENSAJE';
		} else {
			return this.get('tipo');
		}
	}.property('tipo'),

	label: function () {
                    return this.get('titulo') + this.get('expdip') + this.get('girosLabel') + this.get('firmantesLabel');
	}.property('titulo'),
                
	firmantesLabel: function() {
		var firmantes = this.get('firmantes').sort(function (a, b) {
			return a.orden - b.orden;
		});
		var strFirmantes = [];
		
		var regex = new RegExp('-PE-');
		var regex2 = new RegExp('-JGM-');
		if (regex.test(this.get('expdip')) || regex2.test(this.get('expdip'))) {
			return firmantes.objectAt(0).nombre;
		} else {
			if (firmantes.length < 3) {
				firmantes.forEach(function (firmante) {
					strFirmantes.addObject(firmante.nombre);
				});
				return strFirmantes.join(' y ');
			}
			else {
				return firmantes.objectAt(0).nombre + " y otros (" + (firmantes.length - 1 ) + ")"; 
			}		
		}
	}.property('firmantes'),	
	
	girosLabel: function () {
		var field = "orden";
		var giros = this.get('giro').sort(function (a, b) {
			return a.orden - b.orden;
		});
		
		if (giros.length == 1)
			return giros.objectAt(0).comision;
		else
			return giros.objectAt(0).comision + " y otras (" + (giros.length - 1 ) + ")"; 		
	}.property('giro'),
});


App.Citacion = Em.Object.extend({
	url: "/cit/citacion",
	id: null,
	title: '',
	start: '',
	invitados: '',
	comisiones: '',
	observaciones: '',
	sala: '',	
	allDay: false,
	fecha:'',
	
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
	
	titulo: function () {
		title = this.get('title');
//		return title;
//		return title.substr(0, 3);
	}.property('title'),

	saveSucceeded: function (data) {
		if (data.responseText)
		{
			App.get('router').transitionTo('citaciones');
		}
	},	

	label: function () {
		return this.get('title');
	}.property('title'),

});


App.MenuItem = Em.Object.extend({
	titulo: '',
	url: '',
	subMenu: '',
	seleccionado: '',
	habilitado: '',
	roles: [],
	esLink: true,
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
	estadoParte: '',
	toString: function () {
		return this.get('descripcion');
	},
});

App.PlanDeLabor = Em.Object.extend({
	id: '',
	ods: '',
	dictamenes: '',
	proyectos: '',
	sumario: '',
	fecha: '',
	
	label: function () {
		return this.get('sumario');
	}.property('sumario'),
});

App.OrdeDelDia = Em.Object.extend({
	id: '',
	dictamen: '',
	sumario: '',
	fecha: '',
	useApi: false,
	texto: '',

	serializable : [
		'id',
		'dictamen', 
		'sumario', 
		'fecha', 
	],	
	
    label: function () {
    	return this.get('sumario');
    }.property('sumario'),
	sumarioHTML: function () {
		return this.get('sumario').htmlSafe();
	}.property('sumario'),
    textoCompleto: function () {
    	return this.get('texto').htmlSafe();
    }.property('texto'),
});

App.Dictamen = Em.Object.extend({
	proyectosVistos: '',
	proyectos: '',
	sumario: '',
	id_reunion: '',
	copete: '',
	tipo: 'Dictamen',
	art114: false,
    art204: false,
    unanimidad: false,
    caracterDespacho: '',
    observaciones: '',
    textos: '',

    columneable: ['Fecha', 'Sumario'],

    label: function () {
    	return this.get('sumario');
    }.property('sumario'),
});


App.DictamenTexto = Em.Object.extend({
	firmantes: '',
    url: '',
    unificados: false,
    modificado: false,
    sumario: '',
    pr: '',
    rechazo: false,
    pl: '',
    pd: '',
    copete: '',
   	texto: '',
});


App.FirmanteTextoDictamen = Em.Object.extend({  
    id: {
        id_firmante: ''
    },
    disidencia: false,
    diputado: '',
});


App.CaracterDespacho = Em.Object.extend({
	tipo: 'CaracterDictamen',
	id: 5,
	descripcion: "Aprobado con modificaciones Dictamen de Mayoría y Dictamen de Minoría",
	itemParte: 4,
	resumen: "con modif. D. de Mayoría y D. de Minoría",
	tipoDict: "OD",
	toString: function () {
		return this.get('descripcion');
	},
	
});


App.ParteEstado = Em.Object.extend({
	id: '',
	tipo: '',
	toString: function () {
		return this.get('tipo');
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
	toString: function () {
		return this.get('nombre');
	},	
});


App.Reunion = Em.Object.extend({
	url: '/com/reun/reunion',
	id: '',
	nota: '',
	comisiones: '',
	citacion: '',
	fecha: '',
	parte: null,
	useApi: true,
	serializable : [
		'id',
		'nota', 
		'citacion', 
		'comisiones', 
		'fecha', 
		'parte',
	],	

	label: function () {
		return this.get('nota');
	}.property('nota'),

	comisionesLabel: function () {
		return "LALALALA";
	}.property('comisiones'),
});


/* Oradores */

// User

App.User = Em.Object.extend({
	sortValue: function () {
		return this.get('nombreCompleto');
	}.property('nombreCompleto'),
	
	nombreCompleto: function () {
		return this.get('apellido') + " " + this.get('nombre');
	}.property('nombre', 'apellido'),
});

// SESION

App.Sesion = Em.Object.extend({
	notificationType : 'Sesion',
	sesionSeleccionadaBinding: 'App.sesionController.content',
	elapsedTimeBinding : 'timer.elapsedTime',
	
	useApi: false,
	planDeLabor: '',

	sortValue: function () {
		return this.get('fecha').toString();
	}.property('fecha'),
	
	sFecha: function () {
		if(this.get('horaInicio'))
			return moment.unix(this.get('horaInicio')).calendar();
			
		return moment.unix(this.get('fecha')).calendar();
	}.property('fecha', 'horaInicio'),

	sFechaDatePicker: function () {
		return moment.unix(this.get('fecha')).format('DD-MM-YYYY');
	}.property('fecha'),

	sFechaLarga: function () {
		if(this.get('horaInicio'))
			return moment.unix(this.get('horaInicio')).format('LLLL');
			
		return moment.unix(this.get('fecha')).format('LLLL');
	}.property('fecha', 'horaInicio'),

	sHora: function () {
		if(this.get('horaInicio'))
			return moment.unix(this.get('horaInicio')).format('HH:mm [hs]');
			
		return moment.unix(this.get('fecha')).format('HH:mm [hs]');
	}.property('fecha', 'horaInicio'),

	tiempoTranscurrido : function () {
		var tiempoTranscurrido;

		if(this.get('elapsedTime'))
			tiempoTranscurrido =this.get('elapsedTime');
		else{
			if(this.get('horaInicio') && this.get('horaFin')){
				tiempoTranscurrido = (this.get('horaFin')-this.get('horaInicio'))*1000;
			}else 
				tiempoTranscurrido = 0;
		}

		return tiempoTranscurrido;

	}.property('elapsedTime', 'horaInicio', 'horaFin'),

	sTiempoTranscurrido: function () {
		if(this.get('tiempoTranscurrido'))
			return moment.cronometro(this.get('tiempoTranscurrido'));
		else
			return "-";
	}.property('tiempoTranscurrido'),

	mostrarTimer : function () {
		var mostrarTimer = true;
		if( this.get('timer') || (this.get('horaInicio') && this.get('horaFin')))
			mostrarTimer = false;

		return mostrarTimer;
	}.property('timer', 'horaInicio', 'horaFin'),

	seleccionada : function (){
		return (this == this.get('sesionSeleccionada'));
	}.property('sesionSeleccionada'),

  serializable : [
    'id',
    'titulo', 
    'fecha', 
    'horaInicio', 
    'horaFin', 
    'tipo',
    'periodoOrdinario',
    'sesion',
    'reunion',
    'temas',
	],
});

// TEMA

App.Tema = Em.Object.extend({
	notificationType : 'Tema',
	temaSeleccionadoBinding: 'App.temaController.content',
 	id: null,
 	sesionId: null,
  	titulo: null,
  	useApi: false,
  	plId: '',
  	plTipo: '',
  
  imprimirURL: function () {
	return ('/listas-imprimir/%@').fmt(encodeURIComponent(this.get('id')));
  }.property('url'),
  
	sortValue: function () {
		return  this.get('orden');
	}.property('orden'),

	seleccionado : function (){
		return (this == this.get('temaSeleccionado'));
	}.property('temaSeleccionado'),
	
	serializable : [
		'id',
		'sesionId',
		'titulo',
        'orden'
	],
});

// LISTA

App.Lista = Em.Object.extend({
	listaSeleccionadaBinding: 'App.listaController.content',
	id: null,
	titulo: null,
    useApi: false,
	
	seleccionada : function (){
		return (this == this.get('listaSeleccionada'));
	}.property('listaSeleccionada'),
	
	serializable : [
		'id',
		'titulo',
	],

	
	turnosDesbloqueados : function () {
		var temaController = App.get('temaController');

		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('temaId') == temaController.get('content.id')){
				if(item.get('listaId') == this.get('id')){
					return !item.get('bloqueado');
				}else{
					return false;
				}
			}else{
				return false;
			}
		}, this);

		return turnos;
	}.property('content', 'App.temaController.content', 'App.turnosController.arrangedContent.@each.bloqueado').cacheable(),

	turnosBloqueados : function () {
		var temaController = App.get('temaController');

		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('temaId') == temaController.get('content.id')){
				if(item.get('listaId') == this.get('id')){
					return item.get('bloqueado');
				}else{
					return false;
				}
			}else{
				return false;
			}
		}, this);

		return turnos;
	}.property('content', 'App.temaController.content', 'App.turnosController.arrangedContent.@each.bloqueado').cacheable(),

	turnosPendientes : function () {
		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('temaId') == App.get('temaController.content.id')){
				if(item.get('listaId') == this.get('id')){
					if (item.get('bloqueado') == false || item.get('hablando') == true)
						return true;
					else
						return false;
				}else{
					return false;
				}
			}else{
				return false;
			}
		}, this);
		return turnos;
	}.property('App.temaController.content', 'App.turnosController.@each.orden', 'App.turnosController.@each.hablando', 'App.turnosController.@each.bloqueado', 'App.turnosController.length').cacheable(),	

	listaVacia : function () {
		var turnos = App.get('turnosController.arrangedContent').filter(function(item){
			if(item.get('listaId') == this.get('id') &&
					item.get('temaId') == App.get('temaController.content.id')){
				return true;
			}else{
				return false;
			}
		}, this);

		return !turnos.length;

	}.property('App.temaController.content', 'App.turnosController.content.length'),

	url : function () {
		var url = "listas-imprimir/%@".fmt(encodeURIComponent(App.get('temaController.content.id')));
		return url + "/%@".fmt(encodeURIComponent(this.get('id')));
	}.property('id', 'App.temaController.content')
});

// TURNO

App.Turno = Em.Object.extend({
	notificationType : 'Turno',
	elapsedTimeBinding : 'timer.elapsedTime',
	turnoHablandoBinding : 'App.turnosController.turnoHablando',
	useApi: false,
	
	serializable : [
		'id',
		'listaId',
		'temaId',
		'tiempo', 
		'orden',
		'oradores',
		'tiempoReal',
		'horaInicio',
		'horaFin',
		'sHora',
		'tag'
	],

	id: null,
	listaId: null,
	temaId: null,
	tema : null,
	oradores: null,
	orden: null,
	hora: null,
	sortDisabled : false,
	tag: null,
	horaEstimada : false,
	horaFin: null,

	sortValue: function () {
		var bloqueado, orden, tema =  this.get('tema');
		
		if(!tema)
			return 0;

		bloqueado = this.get('bloqueado') == true ? 0 : 1;

		
		orden = $().zeroFill(tema.get('orden'),2) +
						$().zeroFill(this.get('listaId'),2) +
						$().zeroFill(bloqueado,2)

		if(this.get('yaHablo')){
			orden = orden + $().zeroFill(this.get('horaInicio'),14);
		}else{
			orden = orden + $().zeroFill(this.get('orden'),14);
		}

		return orden;

	}.property('orden', 'tema.orden', 'horaInicio', 'horaFin'),

	cuantoFalta: function () {
		var b = moment();
		var a = moment.unix(this.get('hora'));
		return a.from(b);
	}.property('hora', 'App.sesionController.content.sTiempoTranscurrido'),

	sHora: function () {
		if(!this.get('hora'))
			return '';

		return moment.unix(this.get('hora')).format('HH:mm [hs]');
	}.property('hora'),

	tiempoTranscurrido : function () {
		var tiempoTranscurrido;

		if(this.get('elapsedTime'))
			tiempoTranscurrido =this.get('elapsedTime')// moment.cronometro();
		else{
			if(this.get('horaInicio') && this.get('horaFin')){
				tiempoTranscurrido = (this.get('horaFin')-this.get('horaInicio'))*1000;
			}else 
				tiempoTranscurrido = 0;
		}

		return tiempoTranscurrido;

	}.property('elapsedTime', 'horaInicio', 'horaFin'),

	sTiempoTranscurrido: function () {
		return moment.cronometro(this.get('tiempoTranscurrido'));
	}.property('tiempoTranscurrido'),
	
	mostrarTimer : function () {
		var mostrarTimer = true;
		if(this.get('turnoHablando') || this.get('timer') || (this.get('horaInicio') && this.get('horaFin')))
			mostrarTimer = false;

		return mostrarTimer;
	}.property('turnoHablando', 'timer', 'horaInicio', 'horaFin'),

	yaHablo : function () {
		return (this.get('horaInicio') !=null) || (this.get('horaFin') != null);
	}.property('horaInicio', 'horaFin'),

	hablando : function () {
		return (this.get('turnoHablando.id') == this.get('id'))
	}.property('turnoHablando'),

	bloqueado : function () {
		if(this.get('horaInicio'))
			return true;
		else
		 return false;
	}.property('horaInicio'),

	propietario: function(){
		var oradores = this.get('oradores');
		var ap = Ember.ArrayProxy.create({
			content: Ember.A(oradores)
		});
		if(ap.objectAt(0))
			return ap.objectAt(0).user;
		else
			return null;
	}.property('content', 'oradores', 'oradores.length'),

	compartidos: function(){
		var oradores = this.get('oradores');
		var ap = Ember.ArrayProxy.create({
			content: Ember.A(oradores)
		});

		if(ap.objectAt(0)){
			return ap.without(ap.objectAt(0)).toArray();
		}else
			return null;
	}.property('content', 'oradores', 'oradores.length'),
	
	
	horaFinEstimada: function(){
		var duracion, hora = moment.unix(this.get('hora'));

		if(this.get('horaInicio') && this.get('horaFin'))
			duracion = this.get('horaFin') * 1000 - this.get('horaInicio') * 1000;
		else
			duracion = this.get('tiempo') * 60 * 1000;
		
		hora.add('milliseconds', duracion);

		return hora.unix();
	}.property('horaFin', 'tiempo', 'hora', 'horaInicio'),

	sTiempo : function () {
		var sTiempo = "-", minutes = this.get('tiempo');
		if(minutes > 0){
			sTiempo = minutes;

			if(minutes == 1)
				sTiempo += " minuto";
			else
				sTiempo += " minutos";
		}

		return sTiempo;
	}.property('tiempo')
});
