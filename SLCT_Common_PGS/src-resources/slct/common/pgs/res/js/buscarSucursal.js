/**
 * MODAL - Busqueda de Gestores
 */

var sucursalSelected = null;
var tablaSucursal = null;
var sucursalSelec = null;
var arrPagSucursales = [];

$(document).ready(function(){
	
});

/** INICIA TABLAS **/
function iniciaTablasSucursal(){
	tablaSucursal = $('#tabla-sucursal').DataTable({
		"sScrollY" : 250,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		ordering : false,
		info : false,
		"aaData" : "",
		"columns" : [
		             {"data" : "codigo", "width": "25%"},
		             {"data" : "nombre","width" : "75%"}
		 ],
		"language" : {
			"zeroRecords" : "No hay registros"
		}
	});
	
//	$("#tabla-gestores").parent().parent().children(':first-child').children(':first-child').width("100%");
//	$("#tabla-gestores").parent().parent().children(':first-child').children(':first-child').children(':first-child').width("100%");
	
	$('#tabla-sucursal tbody').on('click','tr',function() {
		sucursalSelec = tablaSucursal.row(this).data();
		
		
		if(sucursalSelec == null){
			$(this).removeClass('selected');
		}else{
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				sucursalSelec = null;
				deshabilitaBotonSucursal();
			} else {
				habilitaBotonSucursal();
				tablaSucursal.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');

				
			}
		}
	});
	
	//Llamar al servicio que recupera la lista de gestores
	
}


	


	
	
function iniciaPaginadoresSucursal(){
	// PAGINADOR - Adelante - Sucursales
	$('#btnPaginaBusqSuc').on('click', function() {

		var target = document.getElementById('btnPaginaBusqSuc');
		var spinner = new Spinner(opts).spin(target);
		var pagina = arrPagSucursales.length;
		pagina--;
		
		var ajax_sucursal = {
			"pagina" : arrPagSucursales[pagina].paginacion
		};
		
		
		respBusquedaCart = $.ajax({
			url : '/select/rest/json/Oficina',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_sucursal),
			type : 'POST',
			dataType : "json",
			cache : false,
			beforeSend : function() {
				$("#btnPaginaBusqSuc").css("color", "#ff2500");
				$(target).data('spinner', spinner);
				$("#btnPaginaBusqSuc").prop("disabled", true);
				$("#btnPaginaBusqAtrasSuc").prop("disabled", true);
			},
			complete : function(data) {
				$(target).data('spinner').stop();
				$("#btnPaginaBusqSuc").css("color", "#fff");

				// IE8
				if (data.responseJSON === undefined) {
					var dataParse = JSON.parse(data.responseText);

					if (dataParse["masDatos"] !== undefined) {
						if (dataParse["masDatos"] == true){
							$("#btnPaginaBusqSuc").prop("disabled", false);
						}else{
							$("#btnPaginaBusqSuc").prop("disabled", true);
						}
						
					}

					if (dataParse["masDatos"] === undefined) {
						$("#btnPaginaBusqSuc").prop("disabled", true);
					}

					$("#btnPaginaBusqAtrasSuc").prop("disabled", false);

					$("#idSelSucursalModal").prop("disabled", true);

				} else {
					// Otros navegadores
					if (data.responseJSON["masDatos"] !== undefined) {
						if (data.responseJSON["masDatos"] == false) {
							$("#btnPaginaBusqSuc").prop("disabled", true);
						} else {
							$("#btnPaginaBusqSuc").prop("disabled", false);
						}
					}

					if (data.responseJSON["masDatos"] === undefined) {
						$("#btnPaginaBusqSuc").prop("disabled", true);
					}

					
					$("#btnPaginaBusqAtrasSuc").prop("disabled", false);

					$("#idSelSucursalModal").prop("disabled", true);
				}
			},
			success : function(data) {
				if (data["ERROR"] === undefined) {

					if(data.masDatos == true){
						arrPagSucursales.push({"paginacion" : data.paginacion, "masDatos": true});
					}else{
						arrPagSucursales.push({"paginacion" : data.paginacion, "masDatos": false});
					}
					

					tablaSucursal.clear();
					tablaSucursal.rows.add(data.oficinas).draw();
					
				} else {
					if($("#myModalSucursal").hasClass('in')){
						$("#mensajeError").html(data.ERROR_MSG);
						$("#myModalERROR").modal('show');
					}else{
						
					}
				}

			},
			error : function(xhr, status, error) {
				arrPagSucursales.pop();
				if($("#myModalSucursal").hasClass('in')){
					
					$("#btnPaginaBusqSuc").prop("disabled", false);
					if(arrPagSucursales.length > 1){
						$("#btnPaginaBusqAtrasSuc").prop("disabled", false);
					}
					$("#mensajeErrorTecnico").html(xhr.status + " " + error);
					$("#myModalERRORTecnico").modal('show');
				}else{
					
				}
			}
		});

	});
	
	// PAGINADOR - Atras - Sucursales
	$('#btnPaginaBusqAtrasSuc').on('click',function() {

		var ajax_sucursal = null;
		var target = document.getElementById('btnPaginaBusqAtrasSuc');
		var spinner = new Spinner(opts).spin(target);
		//arrPagSucursales.pop();
		var pagina = arrPagSucursales.length - 2;
		pagina--;
		if(pagina == -1){
			ajax_sucursal = {
				"pagina" : ""	
			}
		}else{
			ajax_sucursal = {
				"pagina" : arrPagSucursales[pagina].paginacion
			}
		}
		respBusquedaCart = $.ajax({
			url : '/select/rest/json/Oficina',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_sucursal),
			type : 'POST',
			dataType : "json",
			cache : false,
			beforeSend : function() {
				$("#btnPaginaBusqAtrasSuc").css("color","#ff2500");
				$(target).data('spinner', spinner);
	
				$("#btnPaginaBusqAtrasSuc").prop("disabled", true);
	
				$("#btnPaginaBusqSuc").prop("disabled",true);
			},
			complete : function(data) {
				$(target).data('spinner').stop();
				$("#btnPaginaBusqAtrasSuc").css("color", "#fff");


				// IE8
				if (data.responseJSON === undefined) {
					var dataParseAtras = JSON.parse(data.responseText);
					if (arrPagSucursales.length == 1 && dataParseAtras.masDatos == true) {

						$("#btnPaginaBusqAtrasSuc").prop("disabled", true);
					}

					if (arrPagSucursales.length > 1 && dataParseAtras.masDatos == true) {

						$("#btnPaginaBusqAtrasSuc").prop("disabled", false);
					}

					$("#idSelSucursalModal").prop("disabled",true);
				} else {
					// Otros navegadores
					if (arrPagSucursales.length == 1 && data.responseJSON.masDatos == true) {
											
						$("#btnPaginaBusqAtrasSuc").prop("disabled", true);
					}

					if (arrPagSucursales.length > 1 && data.responseJSON.masDatos == true) {
												
						$("#btnPaginaBusqAtrasSuc").prop("disabled", false);
					}

					$("#idSelSucursalModal").prop("disabled", true);
				}
			},
			success : function(data) {
				if (data["ERROR"] === undefined) {
											
					$("#btnPaginaBusqSuc").prop("disabled", false);
					if (arrPagSucursales.length == 1 && data.masDatos == true) {
												
						$("#btnPaginaBusqAtrasSuc").prop("disabled", true);

					}

					if (arrPagSucursales.length > 1 && data.masDatos == true) {
												
						$("#btnPaginaBusqAtrasSuc").prop("disabled", false);
					}

					tablaSucursal.clear();
					tablaSucursal.rows.add(data.oficinas).draw();
					arrPagSucursales.pop();
				} else {
					if($("#myModalSucursal").hasClass('in')){
						$("#mensajeError").html(data.ERROR_MSG);
						$("#myModalERROR").modal('show');
					}
				}

			},
			error : function(xhr, status, error) {
				arrPagSucursales.pop();
				if($("#myModalSucursal").hasClass('in')){
					$("#btnPaginaBusqAtrasSuc").prop("disabled", false);
					if(arrPagSucursales[arrPagSucursales.length-1].masDatos == true){
						$("#btnPaginaBusqSuc").prop("disabled", false);
					}
					$("#mensajeErrorTecnico").html(xhr.status + " " + error);
					$("#myModalERRORTecnico").modal('show');
				}else{
									
				}
			}
		});

	});
}

function deshabilitaBotonSucursal(){
	$("#idSelSucursalModal").prop("disabled", true);
}

function habilitaBotonSucursal(){
	$("#idSelSucursalModal").prop("disabled", false);
}

function selSucursalAlta(){
	$("#idSelSucursalModal").on('click', function() {
		$("#myModalSucursal").modal('hide');
		if(sucursalSelec != null){
			$("#txtSucursal").val(sucursalSelec.codigo);
			
			if(tablaIntervinientes.page.info().recordsTotal >= 1){
				$("#idContinuar").prop("disabled", false);
			}
			
			$('#contact-form').formValidation('updateStatus', 'sucursalAlta', 'NOT_VALIDATED').formValidation('revalidateField', 'sucursalAlta');
			limpiarProductos();
		}else{
			$("#txtSucursal").val("");
		}
	});
}

function iniciaCancelBoton(){
	$("#idCancelSucursalModal").on('click', function(){
		$("#myModalSucursal").modal('hide');
	});
}


function ajaxSucursal(){
	var datosTablaSucursal = "";
	var ajax_sucursal = { 
	};
	arrPagSucursales = [];
	$("#idSelSucursalModal").prop("disabled", true);
	
	$.ajax({
		url:'/select/rest/json/Oficina',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_sucursal),
		type : 'POST',
		cache : false,
		complete: function(){
			tablaSucursal.clear();
			tablaSucursal.rows.add(datosTablaSucursal).draw();
			//Add selected si solo hay un registro
			if(tablaSucursal.page.info().recordsTotal == 1){
				$('#tabla-sucursal tbody tr').addClass('selected');
				sucursalSelec = tablaSucursal.row(0).data();
				$("#idSelSucursalModal").prop("disabled", false);
			}
			tablaSucursal.columns.adjust().draw();
		},
		success : function(data) {
			
			if (data["ERROR"] === undefined) {
				if (data["paginacion"] === undefined) {
					$("#pager-sucursales").hide();
				}

				if (data.masDatos == true) {
					$("#btnPaginaBusqAtrasSuc").prop("disabled", true);
					$("#btnPaginaBusqSuc").prop("disabled", false);
					
					$("#pager-sucursales").show();
					arrPagSucursales.push({"paginacion" : data.paginacion, "masDatos": true});
				} else {
					
				}
				
				
				datosTablaSucursal = data.oficinas;
				
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
}