/**
 * 
 */


var listaPersona = null;

$(document).ready(function(){
	$("#tipoBusqueda").val("1").change();
	$('#tipoBusqueda').change(function(e){
		$(".form-control").change(function() {
			if ($("#tipoBusqueda").val() == "1") {				
				$("#divDocument").show();
				$("#divTipoDocumento").show();
				$("#divCodigo").hide();
				$("#divTipoPersona").hide();
				$("#divExtensiva").hide();
				$("#divNombre").hide();
				$("#divApellido1").hide();
				$("#divApellido2").hide();
				$("#divDenSocial").hide();
			} else if ($("#tipoBusqueda").val() == "2") {				
				$("#divExtensiva").show();
				$("#divNombre").show();
				$("#divApellido1").show();
				$("#divApellido2").show();
				$("#divDocument").hide();
				$("#divTipoDocumento").hide();
				$("#divCodigo").hide();
				$("#divTipoPersona").hide();
				$("#divDenSocial").hide();	
			} else if ($("#tipoBusqueda").val() == "3") {				
				$("#divExtensiva").show();
				$("#divDenSocial").show();				
				$("#divNombre").hide();
				$("#divApellido1").hide();
				$("#divApellido2").hide();
				$("#divDocument").hide();
				$("#divTipoDocumento").hide();
				$("#divCodigo").hide();
				$("#divTipoPersona").hide();
			} else if ($("#tipoBusqueda").val() == "4") {				
				$("#divCodigo").show();
				$("#divTipoPersona").show();
				$("#divDocument").hide();
				$("#divTipoDocumento").hide();
				$("#divNombre").hide();
				$("#divApellido1").hide();
				$("#divApellido2").hide();
				$("#divExtensiva").hide();
				$("#divDenSocial").hide();	
			}
			else {
			}

		});	
	});
		
	
	$("#idBuscar").bind("click", function(e){
		$("#tipoBusqueda").val("1").change();
		$("#myModalBuscar").modal('show');
		
	});
	
	$("#idModificar").bind("click", function(e){
		$("#myModalOK").modal('show');
	});
	
});


/**
 * Funcion que cierra la ventana modal al pulsar el boton Seleccionar.
 * Rellena los campos necesarios en la pantalla de modificación.
 */
$("#idBtnCarteras").bind("click",function(e){
	$("#myModalBuscar").modal('hide');
	listaPersona = $("#table-pagination").bootstrapTable('getSelections');
	$("#idContrat").val(listaPersona[0].contrato);
	$("#idClient").val(listaPersona[0].primertitular);
	$("#idSit").val(listaPersona[0].tipo);
	$("#idProduct").val('CARTERA');
	$("#idFActivacion").val('4/11/1997');
	$("#idDivisaRef").val('EUR');
});

$("#idBtnAceptar").bind("click", function(e){
	$("#myModalOK").modal('hide');
});


$("#idLupaEstandar").bind("click", function(e){
	var tipoPers = "F";
	var codPers = 12345;

		$.ajax({
			//url:'json/resultadoBuscador10.json',
			url:'http://localhost:8080/siga-core/servicios/modCartera/getCuentas/'+tipoPers+'/'+codPers,
			type: "GET", dataType: "json", contentType: "application/json; charset=utf-8",
			cache: false,
			success:function(data){
					$("#tableInterv").bootstrapTable('load', data.listaCuentas);
					
			}
		});
	
});