/**
 * 
 */
var jsonAsociadas = null;
var jsonSubyacentes = null;
var jsonInterv = null;
var entrada = {
		"cartera":"",
		"consulta":"DET"
		};
var widthPantallaDetalle = 0;
function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		success : function(data) {
			$("body").append(data);
		},
		dataType : "html"
	});
}

$(document).ready(function(){
	
	var wDetalle = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	resolucionPantallaDetalle(wDetalle);
	 
	 $( window ).resize(function() {
		 widthPantallaDetalle = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		 resolucionPantallaDetalle(widthPantallaDetalle);
	 });
	$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Detalle+de+Cartera&cartera="+idCarteraAux, function(data){
	    $("#idCabeceraCartera").prepend(data);
	    iniciaCabecera();
	    /* Cargar datos post */
		$("#idCartera").val(idCarteraAux);
		$("#idCliente").val(idClienteAux);
		$("#idContrato").val(idContratoAux);
		$("#idContrato").prop('title', idContratoAux);
		$("#idProducto").val(idProductoAux);
		$("#idProducto").prop('title', idProductoAux);
		$("#idNombreGestor").val(idNombreGestorAux);
		$("#idNombreGestor").prop('title',idNombreGestorAux);
		$("#idSituacion").val(idSituacionAux);
		$("#idDivisaRef").val(idDivisaRefAux);
		$("#idOficinaGestor").val(idOficinaGestorAux);
		$("#idOficinaGestor").prop('title',idOficinaGestorAux);
		$("#idFechaActivacion").val(idFechaActivacionAux);
		$("#idPerfilCartera").val(idPerfilCarteraAux);
		$("#idTelefonoGestor").val(idTelefonoGestorAux);
		$("#estRef").val(idEstandarRef);
		
		if(origen == 2){
			var ajax_cartera_valid= {
					"consulta" : "CAB",
					"cartera" : idCarteraAux
				};

				$.ajax({
					// url:'../json/personas.json',
					url : '/select/rest/json/Cartera',
					contentType : "application/json; charset=utf-8",
					data : JSON.stringify(ajax_cartera_valid),
					type : 'POST',
					dataType : "json",
					cache : false,
					success : function(data) {
						if (data["ERROR"] === undefined) {
							// Rellena los campos de Consulta Cartera
							$("#idContrato").val(data.cabecera.contrato);
							$("#idCliente").val(data.cabecera.nombreTitular);
							$("#idPerfilCartera").val(data.cabecera.perfil);
							
							
							
							$("#idSituacion").val(data.cabecera.situacion);
							//$("#idSituacion").val(data.cabecera.estandar);
							
							
							$("#idDivisaRef").val(data.cabecera.divisa);
							$("#estRef").val(data.cabecera.estandar);
							$("#idProducto").val(data.cabecera.tipoProducto);
							$("#idFechaActivacion").val(data.cabecera.activacion);
							
							$("#idNombreGestor").val(data.cabecera.nombreGestor);
							$("#idNombreGestor").prop('title',data.cabecera.nombreGestor);
							
							$("#idOficinaGestor").val(data.cabecera.oficinaGestor);
							$("#idOficinaGestor").prop('title',data.cabecera.oficinaGestor);
							$("#idTelefonoGestor").val(data.cabecera.telefonoGestor);

							$("#idRentabilidad").prop("disabled", false);
							$("#idOperacion").prop("disabled", false);
							$("#idValoracion").prop("disabled", false);
							$("#idDetalle").prop("disabled", false);
							$("#myModalCarteras").modal('hide');

						} else {
							$("#mensajeError").html(data.ERROR_MSG);
							$("#myModalERROR").modal('show');
						}

					},
					error : function(xhr, status, error) {
						$("#mensajeErrorTecnico").html(xhr.status + " " + error);
						$("#myModalERRORTecnico").modal('show');
					}
				});
		}
		
		
	});
	
	cargarModal("ErrorServidor.html");
	cargarModal("Error.html");
	
	entrada.cartera = idCarteraAux;
	//Llamada al servicio para datos de cartera
	//url: /select/rest/json/Cartera
	$.ajax({
		url:'/select/rest/json/Cartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(entrada),
		type : 'POST',
		cache : false,
		complete: function(){
			$("body").show();
			tablaCuentasAsociadas.columns.adjust().draw();
			tablaCuentasSubyacentes.columns.adjust().draw();
			tablaIntervinientes.columns.adjust().draw();
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				jsonAsociadas = data.detalle.cuentas;
				
				jsonSubyacentes = data.detalle.subyacentes;
				
				jsonIntervinientes = data.detalle.intervinientes;
				
				/** Tabla de Cuentas Asociadas (Detalles consulta)-- Definición * */
				tablaCuentasAsociadas = $('#tableCuentas').DataTable({
					"sScrollY" : 90,
					"scrollX" : true,
					"sScrollXInner" : "100%",
					destroy : true,
					paging : false,
					searching : false,
					"ordering": false,
					info : false,
					"data" : jsonAsociadas,
					"columns" : [ 
					              {"data" : "cuenta"}, 
					              {"data" : "divisa"}
					            ],
					"language" : {
						"emptyTable" : "No hay datos"
					}
				});
				
				/** Tabla de Cuentas Subyacentes (Detalles consulta)-- Definición * */
				tablaCuentasSubyacentes = $('#tableCuentasSubyacentes').DataTable({
					"sScrollY" : 90,
					"scrollX" : true,
					"sScrollXInner" : "100%",
					destroy : true,
					paging : false,
					searching : false,
					"ordering": false,
					info : false,
					"data" : jsonSubyacentes,
					"columns" : [ 
					              {"data" : "contrato"}, 
					              {"data" : "descripcion"}
					            ],
					"language" : {
						"emptyTable" : "No hay datos"
					}
				});
				
				/** Tabla de intervinientes (Detalles consulta)-- Definición * */
				tablaIntervinientes = $('#tabla-interv-detalles').DataTable({
					"sScrollY" : 90,
					"scrollX" : true,
					"sScrollXInner" : "100%",
					destroy : true,
					paging : false,
					searching : false,
					"ordering": false,
					info : false,
					"data" : jsonIntervinientes,
					"columns" : [ 
					              {"data" : "denominacion"},
					              {"data" : "documento"}, 
					              {"data" : "dTIntervencion"}
					            ],
					"language" : {
						"emptyTable" : "No hay datos"
					}
				});
				//$('.dataTables_scrollHeadInner,.dataTables_scrollHeadInner table').width("100%");
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
			}
				
		},
		error : function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});

	
});

	

	

$("#idVolver").on("click", function(e){
	if(origen == "1"){
		//Llamada desde consulta
		$("#formCartera").attr("action", "/select/front/consulta");
		$("#formCartera").submit();
	}else if(origen == "2"){
		//Llamada desde Validacion
		
		$("#idBuscadorVal").val(tipoBuscar);
		$("#idEntradaVal").val(entradaValidacion);
		$("#idTipoDePersonaVal").val(tipoDePersona);
		
		$("#formCartera").attr("action", "/select/front/contratacion/validacion");
		$("#formCartera").submit();
	}
});

function addDataAsociadas(data){
	$.each(data, function(obj) {
		tablaCuentasAsociadas.row.add({
			"denominacion": obj.denominacion,
			"cuenta": obj.cuenta
		}).draw(this);
	});
}


$("#idImprimirDet").bind("click", function(){
	
	window.open('/select/rest/documents/alta/' + idCarteraAux);
	

});

function resolucionPantallaDetalle(anchoDetalle){
	if(anchoDetalle <= 1024){
		$("#lblEstandarRef").html("Estándar ref.:");
		
	}else{
		$("#lblEstandarRef").html("Estándar de referencia:");

	}
}
