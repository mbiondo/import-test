var getPath = Ember.Handlebars.getPath;

Handlebars.registerHelper("linkExpediente", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/expedientes/expediente/" + id + "/ver";
});

Handlebars.registerHelper("linkAlertaTemprana", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/expedientes/alerta-temprana/expediente/" + id + "/ver";
});


Handlebars.registerHelper("linkEnvio", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/comisiones/envios/envio/"+id+"/ver";
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

Handlebars.registerHelper("linkTP", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/publicaciones/TP/" + id + "/ver";
});

Handlebars.registerHelper("linkEditarTP", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/publicaciones/TP/" + id + "/editar";
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

Handlebars.registerHelper("linkVisitaGuiada", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/visitas-guiadas/visita/"+id+"/ver";
});

Handlebars.registerHelper("linkMiVisitaGuiada", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/visitas-guiadas/visita/mias/"+id+"/ver";
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


Handlebars.registerHelper("excerpt", function(text, limit, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var text = getPath(context, text, options.fn);
  var limit = parseInt(limit);
  if (text.length > limit)
    return text.substr(0, limit) + "...";
  else
    return text;
});

Handlebars.registerHelper("linkComisionesListado", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/comisiones/comision/"+id+"/ver";
});

Handlebars.registerHelper("linkExpedienteEditar", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/direccionsecretaria/mesadeentrada/proyecto/"+id+"/editar";
});

Handlebars.registerHelper("linkExpedienteMovimiento", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/direccionsecretaria/mesadeentrada/proyecto/"+id+"/movimiento";
});

Handlebars.registerHelper("linkExpedienteGirar", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);

  return "#/direccionsecretaria/mesadeentrada/proyecto/"+id+"/girar";
});

Handlebars.registerHelper("linkProyecto", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/direccionsecretaria/mesadeentrada/proyecto/" + id + "/ver";
});



Ember.Handlebars.registerHelper('substr', function(value, options) {

    var context = (options.contexts && options.contexts[0]) || this;

    var value = getPath(context, value, options.fn);
    
    var opts = options.hash;

    var start = opts.start || 0;
    
    var len = opts.max;

    var out = value.substr(start, len);

    if (value.length > len)
        out += '...';

    return new Handlebars.SafeString(out);
});