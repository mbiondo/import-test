 //===== Tooltips arreglar =====//
 /*
$('.tipN').tipsy({gravity: 'n',fade: true, html:true});
$('.tipS').tipsy({gravity: 's',fade: true, html:true});
$('.tipW').tipsy({gravity: 'w',fade: true, html:true});
$('.tipE').tipsy({gravity: 'e',fade: true, html:true}); 
*/
$.fn.extend({
	safeClone: function() {
		var clone;
		clone = $(this).clone();
		clone.find('script[id^=metamorph]').remove();
		clone.removeClass('ember-view');
		clone.find('*').each(function() {
			var $this;
			$this = $(this);
			$this.removeClass('ember-view');
			return $.each($this[0].attributes, function(index, attr) {
				if (attr == undefined || attr.name.indexOf('data-bindattr') === -1) {
					return;
				}
				return $this.removeAttr(attr.name);
			});
		});
		if (clone.attr('id') && clone.attr('id').indexOf('ember') !== -1) {
			clone.removeAttr('id');
		}
		
		clone.find('[id^=ember]').removeAttr('id');
		return clone;
	},
});

$.fn.extend({
zeroFill: function( number, width )
	{
	  width -= number.toString().length;
	  if ( width > 0 )
	  {
	    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	  }
	  return number + "";
	}
});

jQuery(function($){
	$.datepicker.regional['es'] = {
		closeText: 'Cerrar',
		prevText: '&#x3C;Ant',
		nextText: 'Sig&#x3E;',
		currentText: 'Hoy',
		monthNames: ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
		'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
		monthNamesShort: ['Ene','Feb','Mar','Abr','May','Jun',
		'Jul','Ago','Sep','Oct','Nov','Dic'],
		dayNames: ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'],
		dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		weekHeader: 'Sm',
		dateFormat: 'dd/mm/yy',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: false,
		yearSuffix: ''};
	$.datepicker.setDefaults($.datepicker.regional['es']);
});
jQuery.download = function(url, data, method){
	//url and data options required
	if( url && data ){ 
		//data can be string of parameters or array/object
		data = typeof data == 'string' ? data : jQuery.param(data);
		//split params into form inputs
		var inputs = '';
		jQuery.each(data.split('&'), function(){ 
			var pair = this.split('=');
			inputs+='<input type="hidden" name="'+ pair[0] +'" value=\''+ pair[1] +'\' />'; 
		});
		//send request
		jQuery('<form target="_blank" action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
		.appendTo('body').submit().remove();
	};
};

function mapObjectsInArrays(ar1, ar2) {
	var arr = [];
	
	for (var i = 0; i < ar2.length; i++) {
		var c = ar1.findProperty("id", ar2[i].id);
		if (c)
			arr[i] = c;
	}
	
	return arr;
}

window.IoControllerActions = {
	MODIFICADO: "modificado",
	CREADO: "creado",
	BORRADO: "borrado",
	ORDENADO: "ordenado",
};

Bootstrap.ModalPane.reopenClass({
  popup: function(options) {
    var modalPane;
    if (!options) options = {};
    modalPane = this.create(options);
    modalPane.appendTo(App.rootElement);
    return modalPane;
  }
});

App = Ember.Application.create({
	ready: function () {
		this._super();
		App.initialize();
	}
});