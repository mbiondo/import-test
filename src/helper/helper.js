var getPath = Ember.Handlebars.getPath;

Handlebars.registerHelper("linkExpediente", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/expedientes/expediente/" + id + "/ver";
});

Handlebars.registerHelper("linkEnvio", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/envios/envio/"+id+"/ver";
});

Handlebars.registerHelper("linkNotificacion", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/admin/notificaciones/tipo/"+id+"/ver";
});

Handlebars.registerHelper("linkNotificacionEditar", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/admin/notificaciones/tipo/"+id+"/editar";
});

Handlebars.registerHelper("linkConfirmarEnvio", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/enviosArchivo/envio/confirmar/" + id;
});

Handlebars.registerHelper("linkCitacion", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/comisiones/citaciones/citacion/" + id + "/ver";
});

Handlebars.registerHelper("linkDictamen", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/comisiones/dictamenes/dictamen/" + id + "/ver";
});

Handlebars.registerHelper("linkOD", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/OD/orden/" + id + "/ver";
});

Handlebars.registerHelper("linkReunion", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  return "#/comisiones/reuniones/reunion/" + id + "/ver";
});


Handlebars.registerHelper("linkParte", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/comisiones/citaciones/reunion/" + id + "/parte";
});

Handlebars.registerHelper("linkCargarDictamen", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/comisiones/dictamenes/dictamen/" + id + "/cargar";
});

Handlebars.registerHelper("linkCrearParte", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/comisiones/reuniones/reunion/" + id + "/parte/crear";
});


Handlebars.registerHelper("linkCrearOD", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/OD/orden/" + id + "/crear";
});


Handlebars.registerHelper("formatoFecha", function(fecha, format, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var fecha = getPath(context, fecha, options.fn);
	
  return moment(fecha, format).format('LLLL');
});

Handlebars.registerHelper("formatoFechaSinHora", function(fecha, format, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var fecha = getPath(context, fecha, options.fn);
  
  return moment(fecha, format).format('LL');
});

/*
	20324384112
*/
Handlebars.registerHelper("tienePermisos", function(userRoles, options){

	var context = (options.contexts && options.contexts[0]) || this;
	var userRoles = getPath(context, userRoles, options.fn); 

	// Recorro los roles del Usuario logeado y los guardo
	userRoles = $.map(userRoles, function (value, key) { return value; });

	var _self = this;
	var tienePermisos = true;
	var arraysNoValidos = Array();

	console.group(this.titulo);
	//console.log("Arrays Roles: "+ _self.roles.length);
	
	// Recorro el campo "roles"
	this.roles.forEach(function (rolesRequiered_value, rolesRequiered_index){
		// Chequeo que tenga arrays
		if(Ember.isArray(rolesRequiered_value))
		{

			// Recorro cada Array del campo "roles"
			rolesRequiered_value.forEach(function(rolRequiered_value, rolRequiered_index){

				// Chequeo cuantos Arrays tienen roles que no dispone el Usuario
				if (!userRoles.contains(rolRequiered_value))
				{
					// Agrego un valor "true" a la lista por cada Array de Roles que no tenga el Usuario
					arraysNoValidos[rolesRequiered_index] = true;					
					// Retorno que rol no es valido
					console.log('Rol Faltante: ' + rolRequiered_value)
				}

			});

	        console.log("arraysNoValidos: " + arraysNoValidos.length +' / '+ _self.roles.length);

	        if(arraysNoValidos.length == _self.roles.length)
	        {
	        	// Comparo la cantidad de Arrays de Roles que no posee el Usuario
	        	// con el total de Arrays de Roles
	        	// (Ej.: Hay 3 Arrays de Roles, el Usuario cumple con un Array de Roles, entonces le doy permiso)
				tienePermisos = false;
	        	console.log('tienePermisos: '+ tienePermisos);
	        }
		}
	});

	console.groupEnd();	

/*
  // Recorro todos los Roles
  this.roles.forEach(function (rolRequiered){    
	// Si el Usuario no contiene uno de los roles asignado, setea tienePermisos a false 

	if (!userRoles.contains(rolRequiered))
	{
	  tienePermisos = false;    
	}
  });
*/
//  console.log(tienePermisos);

  if (tienePermisos)
  { 
	return options.fn(this);
  }

});