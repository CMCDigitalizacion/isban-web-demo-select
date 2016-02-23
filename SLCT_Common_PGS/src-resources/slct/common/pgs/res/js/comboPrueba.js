/**
 * JavaScript de la pagina AltaSiga.html
 */
var rows = [];
var listaInterviniente = null;
var modificarOrdenInterv = null;
var indexDelete = null;
var persona= null;
var primerTitular = {
		"cliente": "",
		"tipoPersona": ""
};
var ordenIn = null;

var cartera= null;
var importeMinimo = null;

var addOrMod = null;

var  disposicionValCombo = '-1';
var tipoValCombo = '-1';
var boolDispCombo = false;
var boolTipoCombo = false;

$(document).ready(function() {
	//Inicializa el combo con un json
	
	
	var ajax_concepto = {};
	var disposicion = "001";
	$("#btnCargar").bind('click', function(){
		$.ajax({
			url:'/select/front/json/tipoIntervencion.json',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_concepto),
			type : 'POST',
			cache : true,
			success : function(data) {
				if(data["ERROR"] === undefined){
					
					$("#comboTipoIntervencion").html('<option value="-1">Seleccionar...</option>');
					for (obj in data) {

						$("#comboTipoIntervencion").append('<option value="' + obj + '">' + data[obj] + '</option>');
						
					}
					
					$("#comboTipoIntervencion").select2({
						disabled: false,
						minimumResultsForSearch : Infinity,
						width : "100%"
					});
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					cargaComboVacio(idCombo);
				}
			},
			error : function(xhr, status, error) {
				alert(xhr.status);
			}
		});
	});
	
	$("#btnDato").bind('click', function(){
		$.ajax({
			url:'/select/front/json/tipoIntervencion.json',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_concepto),
			type : 'POST',
			cache : true,
			success : function(data) {
				if(data["ERROR"] === undefined){
					
					$("#comboTipoIntervencion").html('<option value="-1">Seleccionar...</option>');
					for (obj in data) {
						if(obj == disposicion){
							$("#comboTipoIntervencion").append('<option value="' + obj + ' selected">' + data[obj] + '</option>');
						}else{
							$("#comboTipoIntervencion").append('<option value="' + obj + '">' + data[obj] + '</option>');
						}
					}
					
					$("#comboTipoIntervencion").select2({
						disabled: false,
						minimumResultsForSearch : Infinity,
						width : "100%"
					});
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					cargaComboVacio(idCombo);
				}
			},
			error : function(xhr, status, error) {
				alert(xhr.status);
			}
		});
	});
	
	
});