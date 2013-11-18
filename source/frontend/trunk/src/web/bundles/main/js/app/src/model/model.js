App.SortableColumn = Em.Object.extend({
	titulo: '',
	campo: '',
});

App.Usuario = Em.Object.extend({
	url: 'user',
	nombre: '',
	apellido: '',
	
	cuil: '',
	password: '',

	roles: '',
	estructuraReal: '',
	funcion: '',
	comisiones: '',
	avatar: '',

	serializable: [
		"cuil",
		"roles",
		"comisiones",
		"avatar"
	],

	label: function () {
		return this.get('id') + ' ' + this.get('datosLabel2') + ' ' + this.get('rolesLabel');
	}.property('id'),
	
	datosLabel: function () {
		var str = "<p>" + this.get('nombre') + " " +this.get('apellido') + "</p><small>" + this.get('cuil') + "</small>"; 
		return str.htmlSafe();
	}.property('cuil', 'nombre', 'apellido'),

	datosLabel2: function () {
		var str = this.get('nombre') + " " + this.get('apellido') + " " + this.get('cuil'); 		
		return str.htmlSafe();
	}.property('cuil', 'nombre', 'apellido'),

	rolesLabel: function () {
		var str = "";
		this.get('roles').forEach(function(rol){
			str += rol.nombre;
		});
		return str.htmlSafe();
	}.property('roles'),

	estructura: function () {
		return this.get('estructuraReal');
	}.property('estructuraReal'),
});

App.Estructura = Em.Object.extend({
	url: 'user/estructura',
	id: '',
	nombre: '',
	roles: '',

	serializable: [
		"id",
		"nombre",
		"roles"
	],

	label: function () {
		return this.get('id') + ' ' + this.get('nombre') + ' ' + this.get('rolesLabel');
	}.property('id', 'nombre'),
	
	datosLabel: function () {
		var str = "<p>" + this.get('nombre') + "</p>"; 
		return str.htmlSafe();
	}.property('nombre'),

	rolesLabel: function () {
		var str = "";
		this.get('roles').forEach(function(rol){
			str += rol.nombre;
		});
		return str.htmlSafe();
	}.property('roles'),
});

App.Funcion = Em.Object.extend({
	url: 'user/funcion',
	id: '',
	nombre: '',

	cuil: '',
	roles: '',
	
	serializable: [
		"id",
		"nombre",
		"roles"
	],

	label: function () {
		return this.get('id') + ' ' + this.get('nombre') + ' ' + this.get('rolesLabel');
	}.property('id', 'nombre'),
	
	datosLabel: function () {
		var str = "<p>" + this.get('nombre') + "</p>"; 
		return str.htmlSafe();
	}.property('nombre'),

	rolesLabel: function () {
		var str = "";
		this.get('roles').forEach(function(rol){
			str += rol.nombre;
		});
		return str.htmlSafe();
	}.property('roles'),
});


App.Audit = Em.Object.extend({
	url: 'audit',
	id: '',
	usuario: '',
	accion: '',
	objeto: '',
	objetoId: '',
	fecha: '',

	serializable: [
	    'id',
	    'usuario',
	    'accion',
	    'objeto',
	    'objetoId',
	    'fecha'
	],
});

App.Rol = Em.Object.extend({
	url: 'user/rol',
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

App.Notificacion = Em.Object.extend({
	
	notificationType : 'Notificacion',
	notificationRoom: 'notificaciones',

	url: 'notification/create',
	tipo: '',
	fecha: '',
	comisiones: [],
	icono: '',

	dia: function () {
		return moment(this.get('fecha'), 'YYYY-MM-DD HH:mm:ss').format('DD');
	}.property('content.fecha'),

	mes: function () {
		return moment(this.get('fecha'), 'YYYY-MM-DD HH:mm:ss').format('MMM').replace('.', "");
	}.property('content.fecha'),

	serializable: [
		"id",
		"tipo",
		"link",
		"objectId",
		"fecha",
		"mensaje",
		"comisiones"
	],	
});

App.NotificacionTipo = Em.Object.extend({
	url: 'notification/createType',
	icono: '',
	nombre: '',
	titulo: '',
	habilitado: '',
	roles: [],
	comisiones: [],
	funciones: [],
	estructuras: [],
	
	serializable: [
		"id",
		"nombre",
		"titulo",
		"habilitado",
		"icono",
		"roles",
		"comisiones",
		"funciones",
		"estructuras",
		"grupo"
	],


	label: function () {
		return this.get('nombre') + this.get('titulo') + this.get('icono') + this.get('habilitadoLabel') + this.get('rolesLabel') + this.get('estructurasLabel') + this.get('funcionesLabel') + this.get('comisionesLabel');
	}.property('nombre'),
	habilitadoLabel: function(){
		var str = "";

		if(this.get('habilitado'))
		{
			str = 'Habilitado';
		}
		else
		{
			str = 'Deshabilitado';
		}
		return str;

	}.property('habilitado'),
	rolesLabel: function () {
		var str = "";
		this.get('roles').forEach(function(rol){
			str += rol.nombre;
		});
		return str.htmlSafe();
	}.property('roles'),
	estructurasLabel: function () {
		var str = "";
		this.get('estructuras').forEach(function(estructura){
			str += estructura.nombre;
		});
		return str.htmlSafe();
	}.property('estructuras'),
	funcionesLabel: function () {
		var str = "";
		this.get('funciones').forEach(function(funcion){
			str += funcion.nombre;
		});
		return str.htmlSafe();
	}.property('funciones'),
	comisionesLabel: function () {
		var str = "";
		this.get('comisiones').forEach(function(comision){
			str += comision.nombre;
		});
		return str.htmlSafe();
	}.property('comisiones'),
});

App.NotificacionGrupo = Em.Object.extend({
	id: null,
	nombre: '',
	serializable: [
		"id",
		"nombre",
	],
});

App.Distrito = Em.Object.extend({
	id: null,
	descripcion: '',
});

App.Mandato = Em.Object.extend({
	url: 'dip/diputado',
	id: null,
    id_cargo: 1,
    cargo: "Diputadoo",
    distrito: "",
    grupo: "",
    partido: null,
    fechaIncorporacion: "",
    fechaCese: "",
    fechaInicioMandato: "",
    fechaFinMandato: "",
    fechaJuramento: "",
    datosPersonales: null,
    mandatoActual: null,
    auditable: true,
    useApi: true,

    normalize: function () {
    	this.set('fechaJuramento', moment(this.get('fechaJuramento'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'));
    	this.set('fechaInicioMandato', moment(this.get('fechaInicioMandato'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'));
    	this.set('fechaFinMandato', moment(this.get('fechaFinMandato'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'));
    },

    desNormalize: function ()  {
    	this.set('fechaJuramento', moment(this.get('fechaJuramento'), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
    	this.set('fechaFinMandato', moment(this.get('fechaFinMandato'), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
    	this.set('fechaInicioMandato', moment(this.get('fechaInicioMandato'), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
    },

    serializable: [
    	'id',
    	'id_cargo',
    	'cargo',
    	'distrito',
    	'grupo',
    	'partido',
    	'fechaIncorporacion',
    	'fechaCese',
    	'fechaInicioMandato',
    	'fechaFinMandato',
    	'fechaJuramento',
    	'datosPersonales',
    	'mandatoActual',
    ],

    label: function () {
    	return this.get('datosPersonales.apellido') + " " + this.get('datosPersonales.nombre');
    }.property('datosPersonales'),
});


App.Autoridad = Em.Object.extend({
    id: null,
    nombre: "",
    apellido: "",
    sexo: "",
    email: "",
    sitio: null,
    despacho: null,
    piso: null,
    tel1: null,
    tel2: null,

    label: function () {
    	return this.get('apellido') + " " + this.get('nombre');
    }.property('nombre', 'apellido'),
});

App.ExpedienteQuery = Em.Object.extend({
	id: '',
	useApi: false,
	url: 'search',

	firmante: '',
	comision: '',
	fechaPublicacionHasta: '',
	fechaPublicacionDesde: '',
	expdip: '',
	tipo: '',
	nombre: '',
	usuario: '',

	parametizable: [
		'firmante',
		'comision',
		'fechaPublicacionHasta',
		'fechaPublicacionDesde',
		'expdip',
		'tipo',
	],

	serializable: [
		'id',
		'firmante',
		'comision',
		'fechaPublicacionHasta',
		'fechaPublicacionDesde',
		'expdip',
		'tipo',
		'nombre',
		'usuario',
	],

	normalize: function () {
		if (this.get('fechaPublicacionHasta'))
			this.set('fechaPublicacionHasta', moment(this.get('fechaPublicacionHasta'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'));
		if (this.get('fechaPublicacionDesde'))
			this.set('fechaPublicacionDesde', moment(this.get('fechaPublicacionDesde'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'));		
	},

	desNormalize: function () {
		if (this.get('fechaPublicacionHasta'))
			this.set('fechaPublicacionHasta', moment(this.get('fechaPublicacionHasta'), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
		if (this.get('fechaPublicacionDesde'))
			this.set('fechaPublicacionDesde', moment(this.get('fechaPublicacionDesde'), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));	
	},

	parameters: function () {
		var queryParameters = "";
		this.normalize();
		_self = this;
		this.get('parametizable').forEach(function (item) {
			if (_self.get(item)) {
				queryParameters += "&" + item + "=" + _self.get(item);
			}
		});
		this.desNormalize();
		return queryParameters;

	}.property('firmante', 'comision', 'fechaPublicacionDesde', 'fechaPublicacionHasta', 'expdip', 'tipo'),

});

App.ExpedienteBase = Em.Object.extend({
	sortValue: '',
	
	seleccionado: false,
	
	label: function () {
		var str = this.get('titulo') + this.get('tipo') + this.get('expdip') +  this.get('iniciado');
		if (str)
			return str;
		return "";
	}.property('titulo'),
});

App.ExpedienteArchivable = Em.Object.extend({
	sortValue: '',
	
	label: function () {
		return this.get('titulo') + this.get('expdip');
	}.property('titulo'),
});

App.Giro = Em.Object.extend({
	auditable: true,
	useApi: true,
	notificationType : 'Giro',
	notificationRoom: 'mesaDeEntrada',	

	id: null,
	proy_id: null,
	giros: [],
	url: 'giro',

	serializable: [
		'id',
		'proy_id',
		'comisiones'
	],

	label: function () {
		return this.get('proy_id');
	}.property('proy_id'),

});

App.Expediente = Em.Object.extend({
	sortValue: '',
	auditable: true,
	useApi: true,
	seleccionado: false,
	notificationType : 'Expediente',
	notificationRoom: 'mesaDeEntrada',

	url: 'exp/proyecto',	

    normalize: function () {
    	this.set('pubFecha', moment(this.get('pubFecha'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss'));
    },

    desNormalize: function ()  {
    	this.set('pubFecha', moment(this.get('pubFecha'), 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'));
    },

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
		var strFirmantes = [];

		if (this.get('firmantes')) {
			var firmantes = this.get('firmantes').sort(function (a, b) {
				return a.orden - b.orden;
			});
			
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
		}
	}.property('firmantes'),	

	firmantesLabel2: function() {
		var strFirmantes = '';
		
		if (this.get('firmantes')) {
			var firmantes = this.get('firmantes').sort(function (a, b) {
				return a.orden - b.orden;
			});

			firmantes.forEach(function (firmante) {
				strFirmantes+=firmante.nombre;
			});
		}
		return strFirmantes;
	}.property('firmantes'),
	
	girosLabel: function () {
		var field = "orden";
		var giros = this.get('giro').sort(function (a, b) {
			return a.orden - b.orden;
		});
		
		if (giros.length > 0)
			if (giros.length == 1)
				return giros.objectAt(0).comision;
			else
				return giros.objectAt(0).comision + " y otras (" + (giros.length - 1 ) + ")";	
	}.property('giro'),

	serializable: [
    	"tipo",
    	"titulo",
    	"sumario",
    	"referencias",
    	"expdip",
    	"expdipA",
    	"expdipT",
    	"expdipN",
    	"periodo",
    	"iniciado",
    	"pubtipo",
    	"pubnro",
    	"pubFecha",
	],
});


App.Envio = Em.Object.extend({
		id: '',
		
	sortValue: '',
	
	seleccionado: false,

	label: function () {
		return moment(this.get('fecha'), 'YYYY-MM-DD HH:mm').format('LLLL') + this.get('autor') + this.get('estado');
	}.property('autor'),

});


App.Citacion = Em.Object.extend({
	url: "cit/citacion",
	id: null,
	title: '',
	start: '',
	invitados: '',
	comisiones: '',
	observaciones: '',
	sala: '',	
	allDay: false,
	fecha:'',
	auditable: true,
	useApi: true,
	
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

	label: function () {
		return moment(this.get('fecha'), 'YYYY-MM-DD HH:mm').format('LLLL') + this.get('title') + this.get('sala.numero') + this.get('observaciones') + this.get('estado.descripcion');
	}.property('title'),
	observacionesHTML: function () {
		return this.get('observaciones').replace(/\n/g, "<br/>").htmlSafe();
	}.property('observaciones'),	
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
	motivo:'',

	motivoLabel: function () {
		return this.get('motivo').replace(/\n/g, "<br/>").htmlSafe();
	}.property('motivo'),	

	motivoCorto: function(){
		var motivo = this.get('motivo');
		var motivoString = '';

		if(motivo.length > 90)
		{			
			motivoString = motivo.substr(0, 90) + '...';
		}
		else
		{
			motivoString = motivo;
		}

		return motivoString;
	}.property('motivo')
});

App.CitacionTema = Em.Object.extend({
	id: '',
	descripcion: '',
	grupo: false,
	art109: false,
	sobreTablas: false,
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
		return moment(this.get('fecha'), 'DD/MM/YYYY').format('LL') + this.get('sumario') + this.get('fecha');
	}.property('sumario'),
});

App.OrdenDelDia = Em.Object.extend({});

App.OrdeDelDia = Em.Object.extend({
	id: '',
	sumario: '',
	dict_id_orig: '',
	fechaImpresion: '',
	useApi: true,
	texto: '',

	serializable : [
		'id',
		'dict_id_orig', 
		'sumario', 
		'fechaImpresion', 
	],	

	label: function () {
		return moment(this.get('fechaImpresion'), 'YYYY-MM-DD HH:mm').format('LL') + this.get('sumario') + this.get('numero');
	}.property('sumario'),
	sumarioHTML: function () {
		if (this.get('sumario')) {
			return this.get('sumario').htmlSafe();
		}
		else {
			return "";
		}
	}.property('sumario'),
	textoCompleto: function () {
		return this.get('texto').htmlSafe();
	}.property('texto'),
});

App.Dictamen = Em.Object.extend({
	proyectosVistos: [],
	proyectos: [],
	sumario: '',
	id_reunion: '',
	copete: '',
	tipo: 'Dictamen',
	art114: false,
	art204: false,
	unanimidad: false,
	caracterDespacho: '',
	useApi: true,
	url: 'par/evento',
	//observaciones: '',

	serializable: [
		"proyectos",
		"proyectosVistos",
		"copete",
		"art114",
		"art204",
		"unanimidad",
		"caracterDespacho",
		"tipo",
		"id_reunion",
		"sumario",
		"fechaImpresion",
		"id",
		"textos",
		"itemParte",
		"art108",
		"observaciones",
		"caracter",
		"url",
		"orden"
	],

	textos: [],

	label: function (){
		return  moment(this.get('fechaReunion'), 'YYYY-MM-DD HH:mm').format('LLLL') + this.get('proyectosLabel2') + this.get('comisionesLabel2');
	}.property('sumario'),
	fecha: function () {
		return this.get('fechaImpresion');
	}.property('fechaImpresion'),

	proyectosLabel: function () {
		var st = "";
		var count  = 0;
		var numeroDeProyectos = this.get('proyectos').length;
		var agregarBorde;

		this.get('proyectos').forEach(function(proyecto){
			count++;
			// st += "<div class='fluid'>";
			// st += "<div class='grid2'>"+proyecto.proyecto.expdip+"</div>";
			// st += "<div class='grid10'>"+proyecto.proyecto.titulo+"</div>";
			// st += "<div class='clear'></div>";
			// st += "</div>";

			if(numeroDeProyectos > 1 && count < numeroDeProyectos)
			{
				agregarBorde = 'border-bottom: 1px solid #eee;';
			}
			else
			{
				agregarBorde = '';				
			}

			st += '<div class="grid12" style="padding-bottom: 10px;margin-bottom:10px;'+ agregarBorde +'">';
			st += '<div>'
			st += '<b>'+proyecto.proyecto.expdip+'</b>'
			st += '</div>'
			st += '<div>'+proyecto.proyecto.titulo+'</div>'
			st += "<div class='clear'></div>";
			st += '</div>';
		})

		return st.htmlSafe();
	}.property('proyectos'),
	proyectosLabel2: function () {
		var st = "";
		this.get('proyectos').forEach(function (proyecto) {
			st += proyecto.proyecto.expdip + " " + proyecto.proyecto.titulo;
		})
		return st.htmlSafe();
	}.property('proyectos'),
	comisionesLabel: function () {
		var comisiones = this.comisiones;

		if(comisiones.length > 0) {
			if (comisiones.length ==1)
				return comisiones.objectAt(0).nombre;
			else
				return comisiones.objectAt(0).nombre + " y otras (" + (comisiones.length - 1 ) + ")"; 		
		}
	}.property('comisiones'),
	comisionesLabel2: function () {
		var st = "";
		this.get('comisiones').forEach(function (comision) {
			st += comision.comision.nombre;
		})
		return st.htmlSafe();
	}.property('comisiones'),
	sumarioHTML: function () {
		return this.get('sumario').replace(/\n/g, "<br/>").htmlSafe();
	}.property('sumario'),	
	copeteHTML: function () {
		return this.get('copete').replace(/\n/g, "<br/>").htmlSafe();
	}.property('copete'),
});



App.FirmanteTextoDictamen = Em.Object.extend({  
	disidencia: "1",
	diputado: '',

	sortOrden: function () {
		return this.get('cargo.orden');
	}.property('cargo'),

	disidenciaLabel: function () {
		switch (this.get('disidencia')) {
			case "1":
				return "Sin disidencias";
				break;
			case "2":
				return "Disidencia parcial";
				break;
			case "3":
				return "Disidencia total";
				break;
			default:
				return "";
		}
	}.property('disidencia'),
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

App.DictamenTexto = Em.Object.extend({
	firmantes: '',
	url: '',
	unificados: false,
	modificado: false,
	sumario: '',
	rechazo: false,
	pr: 0,
	pl: 0,
	pd: 0,
	copete: '',
	texto: '',
	orden: 0,
	mayoria: false,

	ordenLabel: function(){
		return convert(this.get('orden') - 1);
	}.property('orden'),
	sumarioHTML: function () {
		return this.get('sumario').replace(/\n/g, "<br/>").htmlSafe();
	}.property('sumario'),	
	copeteHTML: function () {
		return this.get('copete').replace(/\n/g, "<br/>").htmlSafe();
	}.property('copete'),	
	textoHTML: function () {
		return this.get('texto').replace(/\n/g, "<br/>").htmlSafe();
	}.property('texto'),	
});


App.EventoParte = Em.Object.extend({
	id: '',
	tipo: '',
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

});

App.CitacionEstado = Em.Object.extend({

});

App.Comision = Em.Object.extend({
	toString: function () {
		return this.get('nombre');
	},	
});



App.Reunion = Em.Object.extend({
	url: 'com/reun/reunion',
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
		'art108',
	],	

	label: function () {
		return moment(this.get('fecha'), 'YYYY-MM-DD HH:mm').format('LLLL') + this.get('comisionesLabel') + this.get('temarioLabel');
	}.property('nota'),
	
	comisionesLabel: function () {
		var st = "";
		this.get('comisiones').forEach(function (comision) {
			st += "<li>"+comision.comision.nombre+"</li>";
		})
		return st.htmlSafe();
	}.property('comisiones'),
	comisionesLabel2: function () {
		var st = "";
		this.get('comisiones').forEach(function (comision) {
			st += comision.comision.nombre;
		})
		return st.htmlSafe();
	}.property('comisiones'),
	temarioLabel: function(){
		var st = "";
			this.get('citacion.temas').forEach(function(tema){
				if(tema)
				{
					st += tema.descripcion;				
				}
			});			
		return st.htmlSafe();
	}.property('citacion'),
	notaHTML: function () {
		return this.get('nota').replace(/\n/g, "<br/>").htmlSafe();
	}.property('nota'),	

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

	toString: function () {
		return "Sesion: " + this.get('sesion') + " Reunion: " + this.get('reunion') + " Periodo: " + this.get('periodoOrdinario');
	},

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
			return moment.unix(this.get('fecha')).format('LLLL');
			
		return moment.unix(this.get('fecha')).format('LLLL');
	}.property('fecha', 'horaInicio'),

	sFechaDiaMesAnio: function () {
		return moment.unix(this.get('fecha')).format('LL');
	}.property('fecha'),

	sHora: function () {
		if(this.get('horaInicio'))
			return moment.unix(this.get('horaInicio')).format('HH:mm[h]');
	
		return moment.unix(this.get('fecha')).format('HH:mm[h]');
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
	'plId'
	],
});

// TEMA

App.Tema = Em.Object.extend({
	notificationType : 'Tema',
	temaSeleccionadoBinding: 'App.temaController.content',
	notificationRoom: 'oradores',

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
		if (this.get('parentOrden')) {
			return parseInt(this.get('parentOrden')) + parseInt(this.get('orden'));
		} else {
			return  parseInt(this.get('orden'));
		}
	}.property('orden', 'parentOrden'),

	seleccionado : function (){
		return (this == this.get('temaSeleccionado'));
	}.property('temaSeleccionado'),
	
	serializable : [
		'id',
		'sesionId',
		'titulo',
		'orden',
		'tieneLista',
		'plId',
		'plTipo',
		'plGrupo',
		'plItemId'
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
	notificationRoom: 'oradores',
	
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

		
		orden = $().zeroFill(tema.get('sortValue'), 4) +
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

	oradorPendiente : function () {
		return (this.get('horaFin') == null);
	}.property('horaFin'),

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

App.ListaEnvioArchivo = Em.Object.extend({
	expedientes: '',
	fecha: '',
	autor: ''
});


/* Estadisticas */

App.EstadisticaTema = Ember.Object.extend({
	toString: function () {
		return this.get('titulo');
	}
});


/* Plan De Labor */


App.PlanDeLaborGrupo = Ember.Object.extend({

});

App.PlanDeLaborTentativo = Ember.Object.extend({
	url: "pdl/plan",
	notificationType : 'PlanDeLaborTentativo',
	notificationRoom: 'planDeLabor',
	auditable: true,
	useApi: true,

	id: null,
	reunion: {
        id: 1103
    },
    observaciones: '',
    fechaEstimada: '',
    items: null,

	secciones: [
        {
            id: null,
            seccion: {
                id: 1
            },
            orden: 1,
            texto: null
        },
        {
            id: null,
            seccion: {
                id: 2
            },
            orden: 2,
            texto: null
        }
    ],
    
    serializable: [
    	'id',
    	'reunion',
    	'observaciones',
    	'items',
    	'secciones',
    	'fechaEstimada',
    	'estado'
    ],

    normalize: function () {
    	this.set('fechaEstimada', moment(this.get('fechaEstimada'), 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm'));
    	if (this.get('items')) {
	    	this.get('items').forEach(function (planDeLaborTentativoItem) {
	    		planDeLaborTentativoItem.normalize();
	    	});
	    }
    }, 

    desNormalize: function (withDate) {
    	if (withDate != false) 
    		this.set('fechaEstimada', moment(this.get('fechaEstimada'), 'YYYY-MM-DD').format('DD/MM/YYYY'));
    	if (this.get('items')) {
    		var items = [];
	     	this.get('items').forEach(function (planDeLaborTentativoItem) {
	     		var pl =  App.PlanDeLaborTentativoItem.create(planDeLaborTentativoItem);
	    		pl.desNormalize();
	    		items.addObject(pl);
	    	});   	
	    	this.set('items', items);
    	}
    },

    label: function () {
    	return moment(this.get('fechaEstimada'), 'YYYY-MM-DD').format('LL') + this.get('observaciones');
    }.property('observaciones'),
});

App.PlanDeLaborTentativoItem = Ember.Object.extend({
    sumario: null,
    grupo: null,
    observaciones: null,
    proyectos: null,
    dictamenes: null,

    normalize: function () {
    	var p = [];
    	var d = [];

    	this.get('proyectos').forEach(function (proyecto) {
    		p.addObject({proyecto: proyecto, id: proyecto.pseudoId});
    	});

    	this.set('proyectos', p);

    	this.get('dictamenes').forEach(function (dictamen) {
    		d.addObject({dictamen: dictamen, id: dictamen.pseudoId});
    	});

    	this.set('dictamenes', d); 	
    },

    desNormalize: function () {
    	var p = [];
    	var d = [];

    	this.get('proyectos').forEach(function (proyecto) {
    		if (proyecto.proyecto) {
    			var proy = App.Expediente.create(proyecto.proyecto);
    			proy.set('pseudoId', proyecto.id);
    			p.addObject(proy);
    		}
    	});

    	this.set('proyectos', p);

    	this.get('dictamenes').forEach(function (dictamen) {
    		if (dictamen.dictamen){
    			var dic = App.OrdeDelDia.create(dictamen.dictamen);
    			dic.set('pseudoId', dictamen.id);
    			d.addObject(dic);
    		}
    	});

    	this.set('dictamenes', d); 	
    },
});