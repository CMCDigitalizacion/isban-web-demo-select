/**
 * PANTALLA - LOCALIZADOR CARTERAS
 * 
 */

var tablaCarteras = null;
var arrPagCarteras = [];

var listaCartera = null;

var modalClientesAbierto = false;

var respBusquedaCart = null;
$(document).ready(function() {

});

function iniciaCombosCartera(){
	$("#tipoBusquedaCarteras").select2({
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
	
	$("#comboTipoPersona").select2({
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
	
	/** Evento Change Tipo busqueda * */
	$("#tipoBusquedaCarteras")
			.change(
					function() {
						$('#localizador-cart-form')
								.formValidation('resetForm',
										true);
						if ($("#tipoBusquedaCarteras").val() == "2") {
							$("#divCodPersona").show();
							$("#divPersona").show();
							$("#divCartera").hide();
							$("#divGestor").hide();
							$("#divSucursal").hide();
						} else if ($("#tipoBusquedaCarteras")
								.val() == "4") {
							$("#divCodPersona").hide();
							$("#divPersona").hide();
							$("#divCartera").show();
							$("#divGestor").hide();
							$("#divSucursal").hide();
						} else if ($("#tipoBusquedaCarteras")
								.val() == "6") {
							$("#divCodPersona").hide();
							$("#divPersona").hide();
							$("#divCartera").hide();
							$("#divGestor").show();
							$("#divSucursal").hide();
						} else if ($("#tipoBusquedaCarteras")
								.val() == "8") {
							$("#divCodPersona").hide();
							$("#divPersona").hide();
							$("#divCartera").hide();
							$("#divGestor").hide();
							$("#divSucursal").show();
						} else {
						}

					});

	
	
}

function iniciaBotonesCarterasModal(){
	cargarModalClientes("LocalizadorPersonas12.html");

	tamPantalla();
	/** Media Query para cambiar el tamaño de los campos en funcion del tamaño de la pantalla **/
	$( window ).resize(function() {
		tamPantalla();
	});
	
	$('#myModalCarteras').on('show', function() {
	  	$('#myModalCarteras').addClass("fade");
	  	
	});
	
	$('#panelFormularioBuscarCarteras').on('shown.bs.collapse',function() {
		$('#imgCollapseCartera').prop("src",'/select/front/img/GbAreaV2CloseTrans.gif');
		
	    $("#tabla-carteras_wrapper .dataTables_scrollBody").css({height : "90px"});
	    tablaCarteras.columns.adjust().draw();
	    
	});
	$('#panelFormularioBuscarCarteras').on('hidden.bs.collapse',function() {
			$('#imgCollapseCartera').prop("src",'/select/front/img/GbAreaV2OpenTrans.gif');
			$("#tabla-carteras_wrapper .dataTables_scrollBody").css({height : "250px"});
			tablaCarteras.columns.adjust().draw();
	});
	
	$("#pager-carteras").hide();
	$("#idSelCartera").prop("disabled", true);

	
	/** Localizador Clientes * */
	$("#idBuscarClientes").on('click',function() {
		
						tablaClientes.settings()[0].oLanguage["sEmptyTable"] = " ";
						$("#myModalBuscar").removeClass("fade");
						modalClientesAbierto = true;
						$('#idApellido2').val("");
						$('#idNombre').val("");
						$("#tipoPersona").val("F").change();
						$("#tipoExtensiva").val("E").change();
						$("#panelFormularioBuscar").collapse('show');
						$("#myModalBuscar").modal('show');
						
						
						eventChangeCombo();
						$("#pager-clientes").hide();
						$("#idSelCliente").prop("disabled",true);
						$("#tipoBusqueda").val("2").change();
						// locClienteCarteras();
						tablaClientes.clear().draw();
						//$('.dataTables_scrollHeadInner,.dataTables_scrollHeadInner table').width("100%");
						
						if(respBusqueda && respBusqueda.readystate != 4){
							respBusqueda.abort();
				        }
	});
}

function iniciaTablaCarteras() {
	tablaCarteras = $('#tabla-carteras').DataTable({
		 "sScrollY" : 90,
		 "scrollX" : true,
		 "sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		"ordering" : false,
		info : false,
		"aaData" : "",
		"columns" : [  {"data" : "cartera"},
			             {"data" : "contrato","width" : "15%"}, 
			             {"data" : "primerTitular","width" : "20%"}, 
			             {"data" : "nTitulares"}, 
			             {"data" : "sucursal"},
			             {"data" : "tipo"}, 
			             {"data" : "estandar","width" : "10%"}  
			        ],
		"language" : {
			"emptyTable" : " "
		}
	});
	
	$('#tabla-carteras tbody').on('click','tr',function() {
		listaCartera = tablaCarteras.row(this).data();

		if (listaCartera == null) {
			$(this).removeClass('selected');
		} else {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				$("#idSelCartera").prop("disabled",
						true);
			} else {
				tablaCarteras.$('tr.selected')
						.removeClass('selected');
				$(this).addClass('selected');
				$("#idSelCartera").prop("disabled",
						false);
			}
		}
	});
	
	// PAGINADOR - Adelante - Carteras
	$('#btnPaginaBusqCart').on('click', function() {

		var ajax_cartera = null;
		var target = document.getElementById('btnPaginaBusqCart');
		var spinner = new Spinner(opts).spin(target);
		var pagina = arrPagCarteras.length;
		pagina--;

		/** Documento * */
		if ($("#tipoBusquedaCarteras").val() == 2) {
			ajax_cartera = {
				"cliente" : parseInt($("#inputNumCliente").val()),
				"tipoPersona" : $("#comboTipoPersona :selected").val(),
				"cartera" : "",
				"gestor" : "",
				"sucursal" : "",
				"pagina" : arrPagCarteras[pagina].paginacion

			};
		}

		/** Persona Fisica * */
		if ($("#tipoBusquedaCarteras").val() == 4) {
			ajax_cartera = {
				"cliente" : 0,
				"tipoPersona" : "",
				"cartera" : $("#inputCartera").val(),
				"gestor" : "",
				"sucursal" : "",
				"pagina" :  arrPagCarteras[pagina].paginacion

			};
		}

		/** Persona Juridica * */
		if ($("#tipoBusquedaCarteras").val() == 6) {
			ajax_cartera = {
				"cliente" : 0,
				"tipoPersona" : "",
				"cartera" : "",
				"gestor" : $("#inputGestor").val(),
				"sucursal" : "",
				"pagina" :  arrPagCarteras[pagina].paginacion
			}
		}

		/** Numero de Persona * */
		if ($("#tipoBusquedaCarteras").val() == 8) {
			ajax_cartera = {
				"cliente" : 0,
				"tipoPersona" : "",
				"cartera" : "",
				"gestor" : "",
				"sucursal" : $("#inputSucursal").val(),
				"pagina" :  arrPagCarteras[pagina].paginacion
			}
		}
		respBusquedaCart = $.ajax({
			// url:'../json/personas.json',
			url : '/select/rest/json/LocalizaCartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cartera),
			type : 'POST',
			dataType : "json",
			cache : false,
			beforeSend : function() {
				$("#btnPaginaBusqCart").css("color", "#ff2500");
				$(target).data('spinner', spinner);
				$("#btnPaginaBusqCart").prop("disabled", true);
				$("#btnPaginaBusqAtrasCart").prop("disabled", true);
			},
			complete : function() {
				//$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
				$(target).data('spinner').stop();
				$("#btnPaginaBusqCart").css("color", "#fff");

				// IE8
				if (data.responseJSON === undefined) {
					var dataParse = JSON.parse(data.responseText);

					if (dataParse["masDatos"] !== undefined) {
						
						$("#btnPaginaBusqCart").prop("disabled", false);
					}

					if (dataParse["masDatos"] === undefined) {
						$("#btnPaginaBusqCart").prop("disabled", true);
					}

					$("#btnPaginaBusqAtrasCart").prop("disabled", false);

					$("#idSelCartera").prop("disabled", true);

				} else {
					// Otros navegadores
					if (data.responseJSON["masDatos"] !== undefined) {
						
						$("#btnPaginaBusqCart").prop("disabled", false);
					}

					if (data.responseJSON["masDatos"] === undefined) {
						$("#btnPaginaBusqCart").prop("disabled", true);
					}

					
					$("#btnPaginaBusqAtrasCart").prop("disabled", false);

					$("#idSelCartera").prop("disabled", true);
				}
			},
			success : function(data) {
				if (data["ERROR"] === undefined) {

					if(data.masDatos == true){
						arrPagCarteras.push({"paginacion" : data.paginacion, "masDatos": true});
					}else{
						arrPagCarteras.push({"paginacion" : data.paginacion, "masDatos": false});
					}
					

					tablaCarteras.clear();
					tablaCarteras.rows.add(data.carteras).draw();
					
				} else {
					if($("#myModalCarteras").hasClass('in')){
						$("#mensajeError").html(data.ERROR_MSG);
						$("#myModalERROR").modal('show');
					}else{
						
					}
				}

			},
			error : function(xhr, status, error) {
				arrPagCarteras.pop();
				if($("#myModalCarteras").hasClass('in')){
					
					$("#btnPaginaBusqCart").prop("disabled", false);
					if(arrPagCarteras.length > 1){
						$("#btnPaginaBusqAtrasCart").prop("disabled", false);
					}
					$("#mensajeErrorTecnico").html(xhr.status + " " + error);
					$("#myModalERRORTecnico").modal('show');
				}else{
					
				}
			}
		});

	});

	// PAGINADOR - Atras - Clientes
	$('#btnPaginaBusqAtrasCart').on('click',function() {

						var ajax_cartera = null;
						var target = document.getElementById('btnPaginaBusqAtrasCart');
						var spinner = new Spinner(opts).spin(target);
						//arrPagCarteras.pop();
						var pagina = arrPagCarteras.length - 2;
						pagina--;

						if(pagina == -1){
							/** Documento * */
							if ($("#tipoBusquedaCarteras").val() == 2) {
								ajax_cartera = {
									"cliente" : parseInt($("#inputNumCliente").val()),
									"tipoPersona" : $("#comboTipoPersona :selected")
											.val(),
									"cartera" : "",
									"gestor" : "",
									"sucursal" : "",
									"pagina" : ""
		
								};
							}
		
							/** Persona Fisica * */
							if ($("#tipoBusquedaCarteras").val() == 4) {
								ajax_cartera = {
									"cliente" : 0,
									"tipoPersona" : "",
									"cartera" : $("#inputCartera").val(),
									"gestor" : "",
									"sucursal" : "",
									"pagina" : ""
		
								};
							}
		
							/** Persona Juridica * */
							if ($("#tipoBusquedaCarteras").val() == 6) {
								ajax_cartera = {
									"cliente" : 0,
									"tipoPersona" : "",
									"cartera" : "",
									"gestor" : $("#inputGestor").val(),
									"sucursal" : "",
									"pagina" : ""
								}
							}
		
							/** Numero de Persona * */
							if ($("#tipoBusquedaCarteras").val() == 8) {
								ajax_cartera = {
									"cliente" : 0,
									"tipoPersona" : "",
									"cartera" : "",
									"gestor" : "",
									"sucursal" : $("#inputSucursal").val(),
									"pagina" : ""
								}
							}
						}else{
							/** Documento * */
							if ($("#tipoBusquedaCarteras").val() == 2) {
								ajax_cartera = {
									"cliente" : parseInt($("#inputNumCliente").val()),
									"tipoPersona" : $("#comboTipoPersona :selected")
											.val(),
									"cartera" : "",
									"gestor" : "",
									"sucursal" : "",
									"pagina" : arrPagCarteras[pagina].paginacion
		
								};
							}
		
							/** Persona Fisica * */
							if ($("#tipoBusquedaCarteras").val() == 4) {
								ajax_cartera = {
									"cliente" : 0,
									"tipoPersona" : "",
									"cartera" : $("#inputCartera").val(),
									"gestor" : "",
									"sucursal" : "",
									"pagina" : arrPagCarteras[pagina].paginacion
		
								};
							}
		
							/** Persona Juridica * */
							if ($("#tipoBusquedaCarteras").val() == 6) {
								ajax_cartera = {
									"cliente" : 0,
									"tipoPersona" : "",
									"cartera" : "",
									"gestor" : $("#inputGestor").val(),
									"sucursal" : "",
									"pagina" : arrPagCarteras[pagina].paginacion
								}
							}
		
							/** Numero de Persona * */
							if ($("#tipoBusquedaCarteras").val() == 8) {
								ajax_cartera = {
									"cliente" : 0,
									"tipoPersona" : "",
									"cartera" : "",
									"gestor" : "",
									"sucursal" : $("#inputSucursal").val(),
									"pagina" : arrPagCarteras[pagina].paginacion
								}
							}
						}
						respBusquedaCart = $.ajax({
									// url:'../json/personas.json',
									url : '/select/rest/json/LocalizaCartera',
									contentType : "application/json; charset=utf-8",
									data : JSON.stringify(ajax_cartera),
									type : 'POST',
									dataType : "json",
									cache : false,
									beforeSend : function() {
										$("#btnPaginaBusqAtrasCart").css("color","#ff2500");
										$(target).data('spinner', spinner);

										$("#btnPaginaBusqAtrasCart").prop("disabled", true);

										$("#btnPaginaBusqCart").prop("disabled",true);
									},
									complete : function() {
										//$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
										$(target).data('spinner').stop();
										$("#btnPaginaBusqAtrasCart").css("color", "#fff");


										// IE8
										if (data.responseJSON === undefined) {
											var dataParseAtras = JSON.parse(data.responseText);
											if (arrPagClientes.length == 1 && dataParseAtras.masDatos == true) {

												$("#btnPaginaBusqAtrasCart").prop("disabled", true);

											}

											if (arrPagClientes.length > 1 && dataParseAtras.masDatos == true) {

												$("#btnPaginaBusqAtrasCart").prop("disabled", false);
											}

											$("#idSelCliente").prop("disabled",true);
										} else {
											// Otros navegadores
											if (arrPagClientes.length == 1 && data.responseJSON.masDatos == true) {
												
												$("#btnPaginaBusqAtrasCart").prop("disabled", true);

											}

											if (arrPagClientes.length > 1 && data.responseJSON.masDatos == true) {
												
												$("#btnPaginaBusqAtrasCart").prop("disabled", false);
											}

											$("#idSelCartera").prop("disabled", true);
										}
									},
									success : function(data) {
										if (data["ERROR"] === undefined) {
											
											$("#btnPaginaBusqCart").prop("disabled", false);
											if (arrPagCarteras.length == 1 && data.masDatos == true) {
												
												$("#btnPaginaBusqAtrasCart").prop("disabled", true);

											}

											if (arrPagCarteras.length > 1 && data.masDatos == true) {
												
												$("#btnPaginaBusqAtrasCart").prop("disabled", false);
											}

											tablaCarteras.clear();
											tablaCarteras.rows.add(data.carteras).draw();
											arrPagCarteras.pop();
										} else {
											if($("#myModalCarteras").hasClass('in')){
												$("#mensajeError").html(data.ERROR_MSG);
												$("#myModalERROR").modal('show');
											}
										}

									},
									error : function(xhr, status, error) {
										arrPagCarteras.pop();
										if($("#myModalCarteras").hasClass('in')){
											$("#btnPaginaBusqAtrasCart").prop("disabled", false);
											if(arrPagCarteras[arrPagCarteras.length-1].masDatos == true){
												$("#btnPaginaBusqCart").prop("disabled", false);
											}
											$("#mensajeErrorTecnico").html(xhr.status + " " + error);
											$("#myModalERRORTecnico").modal('show');
										}else{
											
										}
									}
								});

					});


	
}

function iniciaFormularioCarteras(){
	/** VALIDACION FORMULARIO * */
	$('#localizador-cart-form')
			.formValidation(
					{
						framework : 'bootstrap',
						icon : {
							// valid: 'glyphicon glyphicon-ok',
							// invalid: 'glyphicon
							// glyphicon-remove',
							validating : 'glyphicon glyphicon-refresh'
						},
						fields : {
							numCliente : {
								// The messages for this field
								// are shown as usual
								validators : {
									notEmpty : {
										enabled : true,
										message : 'Introduce algún valor de búsqueda'
									},
									integer : {
										message : 'El cliente debe ser numérico'
									}
								}
							},
							cartera : {
								// The messages for this field
								// are shown as usual
								validators : {
									notEmpty : {
										message : 'Introduce algún valor de búsqueda'
									}
								}
							},
							gestor : {
								// The messages for this field
								// are shown as usual
								validators : {
									notEmpty : {
										message : 'Introduce algún valor de búsqueda'
									},
									stringLength : {
										max : 6,
										min : 6,
										message : 'Número de caracteres inválido'
									}
								}
							},
							sucursal : {
								// The messages for this field
								// are shown as usual
								validators : {
									notEmpty : {
										message : 'Introduce algún valor de búsqueda'
									},
									stringLength : {
										max : 4,
										min : 4,
										message : 'Número de caracteres inválido'
									}
								}
							}
						}
					})
			.on(
					'click',
					'.buscarCartera',
					function() {

						$('#localizador-cart-form')
								.formValidation('updateStatus',
										'numCliente',
										'NOT_VALIDATED')
								.formValidation(
										'validateField',
										'numCliente');
						$('#localizador-cart-form')
								.formValidation('updateStatus',
										'cartera',
										'NOT_VALIDATED')
								.formValidation(
										'validateField',
										'cartera');
						$('#localizador-cart-form')
								.formValidation('updateStatus',
										'gestor',
										'NOT_VALIDATED')
								.formValidation(
										'validateField',
										'gestor');
						$('#localizador-cart-form')
								.formValidation('updateStatus',
										'sucursal',
										'NOT_VALIDATED')
								.formValidation(
										'validateField',
										'sucursal');

						/** Documento * */
						if ($("#tipoBusquedaCarteras :selected")
								.val() == '2'
								&& $('#localizador-cart-form')
										.data('formValidation')
										.isValidField(
												'numCliente')) {
							respBusquedaCart = busquedaCarterasAjax();
						}

						/** Persona Fisica * */
						if ($("#tipoBusquedaCarteras :selected")
								.val() == '4'
								&& $('#localizador-cart-form')
										.data('formValidation')
										.isValidField('cartera')) {
							respBusquedaCart = busquedaCarterasAjax();
						}

						/** Persona Juridica * */
						if ($("#tipoBusquedaCarteras :selected")
								.val() == '6'
								&& $('#localizador-cart-form')
										.data('formValidation')
										.isValidField('gestor')) {
							respBusquedaCart = busquedaCarterasAjax();
						}

						/** Numero Persona * */
						if ($("#tipoBusquedaCarteras :selected")
								.val() == '8'
								&& $('#localizador-cart-form')
										.data('formValidation')
										.isValidField(
												'sucursal')) {
							respBusquedaCart = busquedaCarterasAjax();
						}
					});
}

function limpiaCamposLoc() {
	$("#inputNumCliente").val("");
	$("#inputCartera").val("");
	$("#inputGestor").val("");
	$("#inputSucursal").val("");
	$("#idSelCartera").prop("disabled", true);
	
	tablaCarteras.settings()[0].oLanguage["sEmptyTable"] = " ";
	tablaCarteras.clear().draw();
	

}

/* Función para cargar el localizador de clientes */
function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/" + path,
		success : function(data) {
			$("body").append(data);
		},
		dataType : "html"
	});
}

/* Función para cargar el localizador de clientes */
function cargarModalClientes(path) {
	$.ajax({
		url : "/select/front/htm/modals/" + path,
		complete : function() {
			iniciaCombos();
			iniciaTablaClientes();
			iniciaPaginadoresCliente();
			iniciaFormularioValidacion();
			locClienteCarteras();
			$('#myModalBuscar').on('shown.bs.modal', function(event){
				if(modalClientesAbierto == true){
					$('#myModalCarteras').modal('hide');
				}
				
				tablaClientes.columns.adjust().draw();
			});
			$('#myModalBuscar').on('hidden.bs.modal', function() {
				if(modalClientesAbierto == true){
					$("#myModalCarteras").removeClass("fade");
					$('#myModalCarteras').modal('show');
				}
			});
		},
		success : function(data) {
			$("body").append(data);
		},
		dataType : "html"
	});
}

function busquedaCarterasAjax() {
	tablaCarteras.settings()[0].oLanguage["sEmptyTable"] = "No hay registros";
	$("#idSelCartera").prop("disabled", true);

	arrPagCarteras = [];

	var pagina = 0;
	var ajax_cartera = null;
	var target = document.getElementById('idBuscarCartera');
	var spinner = new Spinner(opts).spin(target);
	var xhr;

	/** Documento * */
	if ($("#tipoBusquedaCarteras").val() == 2) {
		ajax_cartera = {
			"cliente" : parseInt($("#inputNumCliente").val()),
			"tipoPersona" : $("#comboTipoPersona :selected").val(),
			"cartera" : "",
			"gestor" : "",
			"sucursal" : "",
			"pagina" : ""

		};
	}

	/** Persona Fisica * */
	if ($("#tipoBusquedaCarteras").val() == 4) {
		ajax_cartera = {
			"cliente" : 0,
			"tipoPersona" : "",
			"cartera" : $("#inputCartera").val(),
			"gestor" : "",
			"sucursal" : "",
			"pagina" : ""

		};
	}

	/** Persona Juridica * */
	if ($("#tipoBusquedaCarteras").val() == 6) {
		ajax_cartera = {
			"cliente" : 0,
			"tipoPersona" : "",
			"cartera" : "",
			"gestor" : $("#inputGestor").val(),
			"sucursal" : "",
			"pagina" : ""
		}
	}

	/** Numero de Persona * */
	if ($("#tipoBusquedaCarteras").val() == 8) {
		ajax_cartera = {
			"cliente" : 0,
			"tipoPersona" : "",
			"cartera" : "",
			"gestor" : "",
			"sucursal" : $("#inputSucursal").val(),
			"pagina" : ""
		}
	}

	xhr = $.ajax({
		// url:'../json/personas.json',
		url : '/select/rest/json/LocalizaCartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cartera),
		type : 'POST',
		dataType : "json",
		cache : false,
		beforeSend : function() {
			$("#idBuscarCartera").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idBuscarCartera").prop("disabled", true);
		},
		complete : function() {
			$(target).data('spinner').stop();
			$("#idBuscarCartera").css("color", "#fff");
			$("#idBuscarCartera").prop("disabled", false);
			//$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth().toString+"px");
			
			
			
		},
		success : function(data) {
			if (data["ERROR"] === undefined) {
				if (data["paginacion"] === undefined) {
					$("#pager-carteras").hide();
				}

				if (data.masDatos == true) {
					if (arrPagCarteras.length == 0) {
						$("#btnPaginaBusqAtrasCart").prop("disabled", true);
					}
					$("#pager-clientes").show();
					arrPagCarteras.push({"paginacion" : data.paginacion, "masDatos": true});
				}
				
				

				tablaCarteras.clear();
				tablaCarteras.rows.add(data.carteras).draw();
				

				// Add selected si solo hay un registro
				if (tablaCarteras.page.info().recordsTotal == 1) {
					$('#tabla-carteras tbody tr').addClass('selected');
					listaCartera = tablaCarteras.row(0).data();
					$("#idSelCartera").prop("disabled", false);
				}

			} else {
				if($("#myModalCarteras").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}else{
					
				}
			}

		},
		error : function(xhr, status, error) {
			if($("#myModalCarteras").hasClass('in')){
				$("#mensajeErrorTecnico").html(xhr.status + " " + error);
				$("#myModalERRORTecnico").modal('show');
			}else{
				
			}
		}
	});
	
	return xhr;
}


/** SELECCIONAR CARTERA * */
function selCartera() {
	$("#idSelCartera").on('click', function() {
		var ajax_cartera_sel = {
			"consulta" : "CAB",
			"cartera" : listaCartera.cartera
		};

		$.ajax({
			// url:'../json/personas.json',
			url : '/select/rest/json/Cartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cartera_sel),
			type : 'POST',
			dataType : "json",
			cache : false,
			success : function(data) {
				if (data["ERROR"] === undefined) {
					// Rellena los campos de Consulta Cartera
					$("#idCartera").val(listaCartera.cartera);
					$("#idContrato").val(data.cabecera.contrato);
					$("#idContrato").prop('title',data.cabecera.contrato);
					$("#idCliente").val(data.cabecera.nombreTitular);
					$("#idPerfilCartera").val(data.cabecera.perfil);
					
					
					
					$("#idSituacion").val(data.cabecera.situacion);
					//$("#idSituacion").val(data.cabecera.estandar);
					
					
					$("#idDivisaRef").val(data.cabecera.divisa);
					$("#estRef").val(data.cabecera.estandar);
					$("#idProducto").val(data.cabecera.tipoProducto);
					$("#idProducto").prop('title',data.cabecera.tipoProducto);
					$("#idFechaActivacion").val(data.cabecera.activacion);
					
					$("#idNombreGestor").val(data.cabecera.nombreGestor);
					$("#idNombreGestor").prop('title',data.cabecera.nombreGestor);
					
					$("#idOficinaGestor").val(data.cabecera.oficinaGestor);
					$("#idOficinaGestor").prop('title',data.cabecera.oficinaGestor);
					$("#idTelefonoGestor").val(data.cabecera.telefonoGestor);
					$("#idTelefonoGestor").prop('title',data.cabecera.idTelefonoGestor);
					

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
	});

}

function selCarteraAportaciones() {
	$("#idSelCartera").on('click', function() {
		$("#idCuentaOri").val("");
		$("#idLocCuentas").prop("disabled", false);
		$("#idLocCuentas > span").removeClass();
		$("#idLocCuentas > span").addClass("lupa");
		$("#idBorrarCuentas").prop("disabled", false);
		$("#idBorrarCuentas > span").removeClass();
		$("#idBorrarCuentas > span").addClass("remove");
		$("#idBorrarCuentas").hide();
		$("#idImprimirApor").prop("disabled", true);
		setAportacionFin(false);
		$('#efectivo-form').formValidation('resetForm', true);
		$("#idImporte").prop("disabled", true);
		var ajax_cartera_sel = {
			"consulta" : "CAB",
			"cartera" : listaCartera.cartera
		};

		if (document.getElementById("idImporte") == null) {
			$.ajax({
				// url:'../json/personas.json',
				url : '/select/rest/json/Cartera',
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(ajax_cartera_sel),
				type : 'POST',
				dataType : "json",
				cache : false,
				success : function(data) {
					if (data["ERROR"] === undefined) {
						// Rellena los campos de Consulta Cartera
						var cliente = data.cabecera.nombreTitular;
						$("#idCartera").val(listaCartera.cartera);
						$("#idContrato").val(data.cabecera.contrato);
						$("#idContrato").prop('title',data.cabecera.contrato);
						
						$("#idCliente").val(cliente);
						$("#idPerfilCartera").val(data.cabecera.perfil);
						$("#idSituacion").val(data.cabecera.situacion);
						$("#idDivisaRef").val(data.cabecera.divisa);
						$("#estRef").val(data.cabecera.estandar);
						$("#idProducto").val(data.cabecera.tipoProducto);
						$("#idProducto").prop('title',data.cabecera.tipoProducto);
						
						$("#idFechaActivacion").val(data.cabecera.activacion);
						
						$("#idNombreGestor").val(data.cabecera.nombreGestor);
						$("#idNombreGestor").prop('title',data.cabecera.nombreGestor);
						
						$("#idOficinaGestor").val(data.cabecera.oficinaGestor);
						$("#idOficinaGestor").prop('title',data.cabecera.oficinaGestor);

						$("#idRentabilidad").prop("disabled", false);
						$("#idOperacion").prop("disabled", false);
						$("#idValoracion").prop("disabled", false);
						$("#idDetalle").prop("disabled", false);
						$("#myModalCarteras").modal('hide');

						ajaxAportacion(listaCartera.cartera);

						$("#rowEfectivo").show();
						$("idImporte").prop("disabled", false);
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
		} else {
			$.ajax({
				// url:'../json/personas.json',
				url : '/select/rest/json/Cartera',
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(ajax_cartera_sel),
				type : 'POST',
				dataType : "json",
				cache : false,
				success : function(data) {
					if (data["ERROR"] === undefined) {
						// Rellena los campos de Consulta Cartera
						$("#idCartera").val(listaCartera.cartera);
						$("#idContrato").val(data.cabecera.contrato);
						$("#idContrato").prop('title',data.cabecera.contrato);
						
						$("#idCliente").val(data.cabecera.nombreTitular);
						$("#idPerfilCartera").val(data.cabecera.perfil);
						$("#idSituacion").val(data.cabecera.situacion);
						$("#idDivisaRef").val(data.cabecera.divisa);
						$("#estRef").val(data.cabecera.estandar);
						$("#idProducto").val(data.cabecera.tipoProducto);
						$("#idProducto").prop('title',data.cabecera.tipoProducto);
						
						$("#idFechaActivacion").val(data.cabecera.activacion);
						
						$("#idNombreGestor").val(data.cabecera.nombreGestor);
						$("#idNombreGestor").prop('title',data.cabecera.nombreGestor);
						
						$("#idOficinaGestor").val(data.cabecera.oficinaGestor);
						$("#idOficinaGestor").prop('title',data.cabecera.oficinaGestor);
						
						$("#idTelefonoGestor").val(data.cabecera.telefonoGestor);
						$("#idTelefonoGestor").prop('title',data.cabecera.idTelefonoGestor);

						$("#idRentabilidad").prop("disabled", false);
						$("#idOperacion").prop("disabled", false);
						$("#idValoracion").prop("disabled", false);
						$("#idDetalle").prop("disabled", false);
						$("#myModalCarteras").modal('hide');

						ajaxAportacion(listaCartera.cartera,tipo);
						$("#rowEfectivo").show();
						$("idImporte").prop("disabled", false);
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
}

function selCarteraModificacion() {
	$("#idSelCartera").on('click', function() {

		$("#idImprimirMod").prop("disabled", true);
		$("#comboPerfCartera").prop("disabled", false);
		$("#comboEstandarRef").prop("disabled", false);
		setFinModificar(false);
		
		var ajax_cartera_sel = {
			"consulta" : "CAB",
			"cartera" : listaCartera.cartera
		};

		$.ajax({
			// url:'../json/personas.json',
			url : '/select/rest/json/Cartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cartera_sel),
			type : 'POST',
			dataType : "json",
			cache : false,
			success : function(data) {
				if (data["ERROR"] === undefined) {
					// Rellena los campos de Consulta Cartera
					$("#idCartera").val(listaCartera.cartera);
					$("#idContrato").val(data.cabecera.contrato);
					$("#idContrato").prop('title',data.cabecera.contrato);
					
					$("#idCliente").val(data.cabecera.nombreTitular);
					$("#idPerfilCartera").val(data.cabecera.perfil);
					$("#idSituacion").val(data.cabecera.situacion);
					$("#idDivisaRef").val(data.cabecera.divisa);
					$("#estRef").val(data.cabecera.estandar);
					$("#idProducto").val(data.cabecera.tipoProducto);
					$("#idProducto").prop('title',data.cabecera.tipoProducto);
					
					$("#idFechaActivacion").val(data.cabecera.activacion);
					
					$("#idNombreGestor").val(data.cabecera.nombreGestor);
					$("#idNombreGestor").prop('title',data.cabecera.nombreGestor);
					
					$("#idOficinaGestor").val(data.cabecera.oficinaGestor);
					$("#idOficinaGestor").prop('title',data.cabecera.oficinaGestor);
					
					$("#idTelefonoGestor").val(data.cabecera.telefonoGestor);
					$("#idTelefonoGestor").prop('title',data.cabecera.idTelefonoGestor);

					$("#idRentabilidad").prop("disabled", false);
					$("#idOperacion").prop("disabled", false);
					$("#idValoracion").prop("disabled", false);
					$("#idDetalle").prop("disabled", false);
					$("#myModalCarteras").modal('hide');

					ajaxModificacion(listaCartera.cartera);

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
	});
}

/** Seleccionar Cartera Retirada * */
function selCarteraRetirada() {
	
	
	$("#idSelCartera").on('click', function() {
		$("#idCuentaOri").prop("disabled", false);
		$("#idLupaCuentaOri").prop("disabled", false);
		$("#idBorrarCuentaOri").prop("disabled", false);
		$("#idLupaCuentaOri > span").removeClass();
		$("#idLupaCuentaOri > span").addClass("lupa");
		
		$("#idBorrarCuentaOri > span").removeClass();
		$("#idBorrarCuentaOri > span").addClass("remove");
		
		$("#idImprimir").prop("disabled", true);
		$("#idImporte").val("");
		$('#retirada-form').formValidation('resetForm', true);
		
		$("#idImporte").prop("disabled", true);
		$("#idCuentaOri").val("");
		$("#idBorrarCuentaOri").hide();
		$("#idConfirmar").prop("disabled", true);
		

		var ajax_cartera_sel = {
			"consulta" : "CAB",
			"cartera" : listaCartera.cartera
		};

		$.ajax({
			url : '/select/rest/json/Cartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cartera_sel),
			type : 'POST',
			dataType : "json",
			cache : false,
			success : function(data) {
				if (data["ERROR"] === undefined) {
					// Rellena los campos de Consulta Cartera
					$("#idCartera").val(listaCartera.cartera);
					$("#idContrato").val(data.cabecera.contrato);
					$("#idContrato").prop('title',data.cabecera.contrato);
					
					$("#idCliente").val(data.cabecera.nombreTitular);
					$("#idPerfilCartera").val(data.cabecera.perfil);
					$("#idSituacion").val(data.cabecera.situacion);
					$("#idDivisaRef").val(data.cabecera.divisa);
					$("#estRef").val(data.cabecera.estandar);
					$("#idProducto").val(data.cabecera.tipoProducto);
					$("#idProducto").prop('title',data.cabecera.tipoProducto);
					
					$("#idFechaActivacion").val(data.cabecera.activacion);
					
					$("#idNombreGestor").val(data.cabecera.nombreGestor);
					$("#idNombreGestor").prop('title',data.cabecera.nombreGestor);
					
					$("#idOficinaGestor").val(data.cabecera.oficinaGestor);
					$("#idOficinaGestor").prop('title',data.cabecera.oficinaGestor);
					
					$("#idTelefonoGestor").val(data.cabecera.telefonoGestor);
					$("#idTelefonoGestor").prop('title',data.cabecera.idTelefonoGestor);

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
	});
}

/** Seleccionar Cartera Cancelacion * */
function selCarteraCancelacion() {
	$("#idSelCartera").on('click', function() {
		$("#idConfirmar").prop("disabled", true);
		//$("#idConfirmar").removeClass("boton-disabled");

		$('#comboTipoCancel').select2({
			disabled : false,
			minimumResultsForSearch : Infinity,
			width : "100%"
		});

		var ajax_cartera_sel = {
			"consulta" : "CAB",
			"cartera" : listaCartera.cartera
		};

		$.ajax({
			url : '/select/rest/json/Cartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cartera_sel),
			type : 'POST',
			dataType : "json",
			cache : false,
			complete: function(){
				ajaxCancelarCarteras();
			},
			success : function(data) {
				if (data["ERROR"] === undefined) {
					// Rellena los campos de Consulta Cartera
					$("#idCartera").val(listaCartera.cartera);
					$("#idContrato").val(data.cabecera.contrato);
					$("#idContrato").prop('title',data.cabecera.contrato);
					
					$("#idCliente").val(data.cabecera.nombreTitular);
					$("#idPerfilCartera").val(data.cabecera.perfil);
					$("#idSituacion").val(data.cabecera.situacion);
					$("#idDivisaRef").val(data.cabecera.divisa);
					$("#estRef").val(data.cabecera.estandar);
					$("#idProducto").val(data.cabecera.tipoProducto);
					$("#idProducto").prop('title',data.cabecera.tipoProducto);
					
					$("#idFechaActivacion").val(data.cabecera.activacion);
					
					$("#idNombreGestor").val(data.cabecera.nombreGestor);
					$("#idNombreGestor").prop('title',data.cabecera.nombreGestor);
					
					$("#idOficinaGestor").val(data.cabecera.oficinaGestor);
					$("#idOficinaGestor").prop('title',data.cabecera.oficinaGestor);
					
					$("#idTelefonoGestor").val(data.cabecera.telefonoGestor);
					$("#idTelefonoGestor").prop('title',data.cabecera.idTelefonoGestor);

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
	});
}

function ajaxCancelarCarteras(){
	var ajax_cartera_sel = {
			"cartera" : listaCartera.cartera,
			"operacion" : "CON"
		};
	
	$.ajax({
		url : '/select/rest/json/Cancelacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cartera_sel),
		type : 'POST',
		dataType : "json",
		cache : false,
		complete: function(){
			
		},
		success : function(data) {
			if (data["ERROR"] === undefined) {
				// Rellena los campos de Consulta Cartera
				cargaCombo(data, "#comboTipoCancel");
				$("#idImprimir").prop("disabled", true);
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

function cargaCombo(datos, idCombo) {
	$(idCombo).html('<option value="-1">Seleccionar...</option>');
	for (obj in datos) {
		$(idCombo).append('<option value="' + obj + '">' + datos[obj] + '</option>');
	}
	
	$(idCombo).select2({
//		theme : "classic",
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
}

function tamPantalla(){
	myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
    
    if(myWidth < 1100){
   	 //Buscar por:
   	 $('#divBuscarPorLbl').removeClass('col-sm-2');
   	 $('#divBuscarPorLbl').addClass('col-sm-3');
  	 
     	 $('#divBuscarPorSel').removeClass('col-sm-3');
    	 $('#divBuscarPorSel').addClass('col-sm-4');
	 
   	    $('#divBuscarPorVacio').removeClass('col-sm-3');
   	   $('#divBuscarPorVacio').addClass('col-sm-4');
   	 
		 $('#divBuscarPorVacio').removeClass('col-sm-3');
		 $('#divBuscarPorVacio').addClass('col-sm-4');
 	 
//   	//Tipo Persona:
	   	 $('#divTipoPersLbl').removeClass('col-sm-2');
	   	 $('#divTipoPersLbl').addClass('col-sm-3');
 	 
   	 $('#divTipoPersSel').removeClass('col-sm-3');
   	 $('#divTipoPersSel').addClass('col-sm-4');
 	 
   	 $('#divTipoPersVacio').removeClass('col-sm-3');
  	 $('#divTipoPersVacio').addClass('col-sm-4');
   	 $('#divTipoPersVacio').removeClass('col-sm-3');
   	 $('#divTipoPersVacio').addClass('col-sm-4');
   	 
   	 
   	//Numero de cliente:
   	 $('#divNumClienteLbl').removeClass('col-sm-2');
   	 $('#divNumClienteLbl').addClass('col-sm-3');
   	 
   	 $('#divNumClienteSel').removeClass('col-sm-3');
   	 $('#divNumClienteSel').addClass('col-sm-4');
   	 
   	 $('#divNumClienteVacio').removeClass('col-sm-6');
   	 $('#divNumClienteVacio').addClass('col-sm-1');
   	 
   	//Cartera:
   	 $('#divCarteraLbl').removeClass('col-sm-2');
   	 $('#divCarteraLbl').addClass('col-sm-3');
   	 
   	 $('#divCarteraSel').removeClass('col-sm-3');
   	 $('#divCarteraSel').addClass('col-sm-4');
   	 
   	 $('#divCarteraVacio').removeClass('col-sm-6');
   	 $('#divCarteraVacio').addClass('col-sm-4');
   	 
   	//Gestor:
   	 $('#divGestorLbl').removeClass('col-sm-2');
   	 $('#divGestorLbl').addClass('col-sm-3');
   	 
   	 $('#divGestorSel').removeClass('col-sm-3');
   	 $('#divGestorSel').addClass('col-sm-4');
   	 
   	 $('#divGestorVacio').removeClass('col-sm-3');
   	 $('#divGestorVacio').addClass('col-sm-4');
   	 
   	//Sucursal:
   	 $('#divSucursalLbl').removeClass('col-sm-2');
   	 $('#divSucursalLbl').addClass('col-sm-3');
   	 
   	 $('#divSucursalSel').removeClass('col-sm-3');
   	 $('#divSucursalSel').addClass('col-sm-4');
   	 
   	 $('#divSucursalVacio').removeClass('col-sm-3');
   	 $('#divSucursalVacio').addClass('col-sm-4');
   	 
    }else{
   	 if(myWidth >= 1100){
   		 //Buscar por:
	    	 $('#divBuscarPorLbl').removeClass('col-sm-3');
	    	 $('#divBuscarPorLbl').addClass('col-sm-2');
	    	 
	    	 $('#divBuscarPorSel').removeClass('col-sm-4');
	    	 $('#divBuscarPorSel').addClass('col-sm-3');
	    	 
	    	 $('#divBuscarPorVacio').removeClass('col-sm-4');
	    	 $('#divBuscarPorVacio').addClass('col-sm-3');
	    	 $('#divBuscarPorVacio').removeClass('col-sm-6');
	    	 $('#divBuscarPorVacio').addClass('col-sm-7');
	    	 
	    	//Tipo Persona:
	    	 $('#divTipoPersLbl').removeClass('col-sm-3');
	    	 $('#divTipoPersLbl').addClass('col-sm-2');
//	    	 
	    	 $('#divTipoPersSel').removeClass('col-sm-4');
	    	 $('#divTipoPersSel').addClass('col-sm-3');
//	    	 
	    	 $('#divTipoPersVacio').removeClass('col-sm-3');
	    	 $('#divTipoPersVacio').addClass('col-sm-4');
	    	 
	    	 $('#divTipoPersVacio').removeClass('col-sm-3');
	    	 $('#divTipoPersVacio').addClass('col-sm-4');
	    	 
	    	 
	    	//Numero de cliente:
	    	 $('#divNumClienteLbl').removeClass('col-sm-3');
	    	 $('#divNumClienteLbl').addClass('col-sm-2');
	    	 
	    	 $('#divNumClienteSel').removeClass('col-sm-7');
	    	 $('#divNumClienteSel').addClass('col-sm-3');
	    	 
	    	 $('#divNumClienteVacio').removeClass('col-sm-1');
	    	 $('#divNumClienteVacio').addClass('col-sm-6');
	    	 
	    	//Cartera:
	    	 $('#divCarteraLbl').removeClass('col-sm-3');
	    	 $('#divCarteraLbl').addClass('col-sm-2');
	    	 
	    	 $('#divCarteraSel').removeClass('col-sm-7');
	    	 $('#divCarteraSel').addClass('col-sm-3');
	    	 
	    	 $('#divCarteraVacio').removeClass('col-sm-2');
	    	 $('#divCarteraVacio').addClass('col-sm-7');
	    	 
	    	//Gestor:
	    	 $('#divGestorLbl').removeClass('col-sm-3');
	    	 $('#divGestorLbl').addClass('col-sm-2');
	    	 
	    	 $('#divGestorSel').removeClass('col-sm-7');
	    	 $('#divGestorSel').addClass('col-sm-3');
	    	 
	    	 $('#divGestorVacio').removeClass('col-sm-2');
	    	 $('#divGestorVacio').addClass('col-sm-7');
	    	 
	    	//Sucursal:
	    	 $('#divSucursalLbl').removeClass('col-sm-3');
	    	 $('#divSucursalLbl').addClass('col-sm-2');
	    	 
	    	 $('#divSucursalSel').removeClass('col-sm-7');
	    	 $('#divSucursalSel').addClass('col-sm-3');
	    	 
	    	 $('#divSucursalVacio').removeClass('col-sm-2');
	    	 $('#divSucursalVacio').addClass('col-sm-7');
   	 }
    }
}


function selCarteraValid() {
	$("#idSelCartera").on('click', function() {
		$("#myModalCarteras").modal('hide');
		if(listaCartera != null){
			$("#inputCarteraVal").val(listaCartera.cartera);
		}else{
			$("#inputCarteraVal").val("");
		}
	});
}