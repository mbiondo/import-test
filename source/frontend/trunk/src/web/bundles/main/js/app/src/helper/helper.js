var getPath = Ember.Handlebars.getPath;

Handlebars.registerHelper("linkExpediente", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/expedientes/expediente/" + id + "/ver";
});

Handlebars.registerHelper("linkCitacion", function(id, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var id = getPath(context, id, options.fn);
  
  return "#/comisiones/citaciones/citacion/" + id + "/ver";
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


Handlebars.registerHelper("formatoFecha", function(fecha, format, options) {
  var context = (options.contexts && options.contexts[0]) || this;
  var fecha = getPath(context, fecha, options.fn);
	
  return moment(fecha, format).format('LLLL');
});