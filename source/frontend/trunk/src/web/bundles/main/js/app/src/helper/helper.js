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

	userRoles = $.map(userRoles, function (value, key) { return value; });

	var _self = this;
	var tienePermisos = false;
	var arraysNoValidos = [];

	this.roles.forEach(function (rolesRequiered_value, rolesRequiered_index){
      var groupIsValid = true;

			rolesRequiered_value.forEach(function(rolRequiered_value, rolRequiered_index){
				if (!userRoles.contains(rolRequiered_value))
				{
					groupIsValid = false;
				}
			});

      if (groupIsValid) {
        tienePermisos = true;
      }
	});

  if (tienePermisos)
  { 
  	return options.fn(this);
  }
});