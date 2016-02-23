/**
 * 
 */

var listaPersona = null;
var tablaCarterasValid = null;
var carteraValidSelec = null;
var pagActualCarterasValid = null;
var arrPagCarterasValid = null;
var isValidacion = null;
var documentoImprimirValid = "";
var isBloqueadoPantalla = false;
var validacionOKBool = false;
var rechazarOKBool = false;

/** SPINNER **/
var optionsSpin = {
		  lines: 11,
		  length: 3,
		  width: 2,
		  radius:4,
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
	       top: '50%', // Top position relative to parent in px
	       left: '50%', // Left position relative to parent in px
		  color: '#FF0000'
};

/**
 * Carga el modal que se le pasa como parametro
 * @param path
 */

function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		success : function(data) {
			$("body").append(data);
		},
		dataType : "html"
	});
}

/**
 * Carga el modal de LocalizadorCarteras
 * @param path
 */
function cargarModalLocCarteras(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		dataType : "html",
		complete: function(){
			iniciaBotonesCarterasModal();
			iniciaCombosCartera();
			iniciaTablaCarteras();
			iniciaFormularioCarteras();
			selCarteraValid();
			$("#myModalCarteras").on("shown.bs.modal", function (event) {
				tablaCarteras.columns.adjust().draw();
			 });
		},
		success : function(data) {
			$("body").append(data);
			
		}
		
	});
}

/**
 * Carga el modal de LocalizadorGestores
 * @param path
 */
function cargarModalLocGestores(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		dataType : "html",
		complete: function(){
			iniciaTablasGestores();
			selGestoresValidacion();
			$("#myModalGestores").on("shown.bs.modal", function (event) {
				ajax_gestores();
				tablaGestores.columns.adjust().draw();
			 });
			
		},
		success : function(data) {
			$("body").append(data);
			
		}
		
	});
}

$(document).ready(function(){
	
	
	cargarModal("ErrorServidor.html");
	cargarModal("Error.html");
	cargarModalLocCarteras("LocalizarCarteras12.html");
	cargarModalLocGestores("BuscarGestores12.html");
	
	$('#tipoBusquedaCarterasVal').select2({
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
	
	$("#comboTipoPersonaVal").select2({
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
	
	$("#divGestorVal").hide();
	$("#divCarteraVal").hide();
	$("#divClienteVal").hide();
	$("#divNumClienteVal").hide();
	$("#divSucursalVal").hide();
	
	/** Evento Change Tipo busqueda * */
	$("#tipoBusquedaCarterasVal").change(function() {
					$('#valida-form').formValidation('resetForm', true);
					tablaCarterasValid.clear().draw();
						if ($("#tipoBusquedaCarterasVal").val() == "T") {
							$("#divGestorVal").hide();
							$("#divCarteraVal").hide();
							$("#divClienteVal").hide();
							$("#divNumClienteVal").hide();
							$("#divSucursalVal").hide();
						} else if ($("#tipoBusquedaCarterasVal").val() == "G") {
							$("#divGestorVal").show();
							$("#divCarteraVal").hide();
							$("#divClienteVal").hide();
							$("#divNumClienteVal").hide();
							$("#divSucursalVal").hide();
							
						} else if ($("#tipoBusquedaCarterasVal").val() == "CAR") {
							$("#divGestorVal").hide();
							$("#divCarteraVal").show();
							$("#divClienteVal").hide();
							$("#divNumClienteVal").hide();
							$("#divSucursalVal").hide();
							
							
						} else if ($("#tipoBusquedaCarterasVal").val() == "C") {
							$("#divGestorVal").hide();
							$("#divCarteraVal").hide();
							$("#divClienteVal").show();
							$("#divNumClienteVal").show();
							$("#divSucursalVal").hide();
							
						} else if ($("#tipoBusquedaCarterasVal").val() == "S") {
							$("#divGestorVal").hide();
							$("#divCarteraVal").hide();
							$("#divClienteVal").hide();
							$("#divNumClienteVal").hide();
							$("#divSucursalVal").show();
							
						}else {
						}

	});
		
	
	//Iniciamos la tabla de carteras y declaramos el onclick de los registros
	iniciaTablasValidacion();
	
	

	//Al iniciar la pantalla llamamos al servicio validar
	ajaxInicioValidar();
	
	

	//Validacion Formulario
	$('#valida-form')
    .formValidation({
        framework: 'bootstrap',
        icon: {
//            valid: 'glyphicon glyphicon-ok',
//            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	gestorEmpresa: {
                validators: {
                    notEmpty: {
                        message: 'Introduce algún valor de búsqueda'
                    }
                }
            },
            carteraVal: {
                // The messages for this field are shown as usual
                validators: {
                    notEmpty: {
                        message: 'Introduce algún valor de búsqueda'
                    }
                }
            },
            clienteVal: {
                // The messages for this field are shown as usual
                validators: {
                    notEmpty: {
                        message: 'Introduce algún valor de búsqueda'
                    },
	                numeric: {
	                	message: 'El código debe ser numérico'
	                }
                }
            },
            sucursalVal: {
            	 // The messages for this field are shown as usual
                validators: {
                    notEmpty: {
                        message: 'Introduce algún valor de búsqueda'
                    },
	                numeric: {
	                	message: 'El código debe ser numérico'
	                }
                }
            }
        }
    }).on('mousedown', '.buscarCarteraValidacion', function(){
    	
    	$('#valida-form').formValidation('updateStatus', 'gestorEmpresa', 'NOT_VALIDATED').formValidation('revalidateField', 'gestorEmpresa');
    	$('#valida-form').formValidation('updateStatus', 'carteraVal', 'NOT_VALIDATED').formValidation('revalidateField', 'carteraVal');
    	$('#valida-form').formValidation('updateStatus', 'clienteVal', 'NOT_VALIDATED').formValidation('revalidateField', 'clienteVal');
    	$('#valida-form').formValidation('updateStatus', 'sucursalVal', 'NOT_VALIDATED').formValidation('revalidateField', 'sucursalVal');
    	
    	/** TODAS **/
    	if($("#tipoBusquedaCarterasVal :selected").val()== "T"){
    		respBusqueda = busquedaCarterasValidAjax();
    	}
    	
    	/** GESTOR **/
    	if($("#tipoBusquedaCarterasVal :selected").val()== "G" && $('#valida-form').data('formValidation').isValidField('gestorEmpresa')){
    		respBusqueda = busquedaCarterasValidAjax();
    	}
    	
    	/** CARTERA **/
    	if($("#tipoBusquedaCarterasVal :selected").val()== "CAR" && $('#valida-form').data('formValidation').isValidField('carteraVal')){
    		respBusqueda = busquedaCarterasValidAjax();
    	}
    	
    	/** PERSONA **/
    	if($("#tipoBusquedaCarterasVal :selected").val()== "C" && $('#valida-form').data('formValidation').isValidField('clienteVal')){
    		respBusqueda = busquedaCarterasValidAjax();
    	}
    	
    	/** SUCURSAL **/
    	if($("#tipoBusquedaCarterasVal :selected").val()== "S" && $('#valida-form').data('formValidation').isValidField('sucursalVal')){
    		respBusqueda = busquedaCarterasValidAjax();
    	}
    });

	
	$(document).bind('keyup', function(e) {
		
		if (e.which == '13') {
		    if($("#myModalBuscar").hasClass('in')){
		    	if($("#myModalERROR").hasClass('in')){	
		    		$("#idBtnAceptarError").focus();
		    	     e.preventDefault();
		    	     $("#myModalERROR").modal('hide');
			    }else if($("#myModalERRORTecnico").hasClass('in')){
			    		$("#idBtnAceptarErrorServidor").focus();
			    	     e.preventDefault();
			    	     $("#myModalERRORTecnico").modal('hide');
				}else{
		    		$("#idBuscarCliente").focus();
		    	     e.preventDefault();
		    	     $('#localizador-pers-form').formValidation('updateStatus', 'documento', 'NOT_VALIDATED').formValidation('revalidateField', 'documento');
		    	    	$('#localizador-pers-form').formValidation('updateStatus', 'apellido1', 'NOT_VALIDATED').formValidation('revalidateField', 'apellido1');
		    	    	$('#localizador-pers-form').formValidation('updateStatus', 'densocial', 'NOT_VALIDATED').formValidation('revalidateField', 'densocial');
		    	    	$('#localizador-pers-form').formValidation('updateStatus', 'codigo', 'NOT_VALIDATED').formValidation('revalidateField', 'codigo');
		    	    	
		    	    	/** Documento **/
		    	    	if($("#tipoBusqueda :selected").val()== '2' && $('#localizador-pers-form').data('formValidation').isValidField('documento')){
		    	    		busquedaClientesAjax();
		    	    	}
		    	    	
		    	    	/** Persona Fisica **/
		    	    	if($("#tipoBusqueda :selected").val()== '4' && $('#localizador-pers-form').data('formValidation').isValidField('apellido1')){
		    	    		busquedaClientesAjax();
		    	    	}
		    	    	
		    	    	/** Persona Juridica **/
		    	    	if($("#tipoBusqueda :selected").val()== '6' && $('#localizador-pers-form').data('formValidation').isValidField('densocial')){
		    	    		busquedaClientesAjax();
		    	    	}
		    	    	
		    	    	/** Numero Persona **/
		    	    	if($("#tipoBusqueda :selected").val()== '8' && $('#localizador-pers-form').data('formValidation').isValidField('codigo')){
		    	    		busquedaClientesAjax();
		    	    	}
				}
		    	
		    }else if($("#myModalCarteras").hasClass('in')){
		    	if($("#myModalERROR").hasClass('in')){
			    	
		    		$("#idBtnAceptarError").focus();
		    	     e.preventDefault();
		    	     $("#myModalERROR").modal('hide');
			    }else if($("#myModalERRORTecnico").hasClass('in')){
			    		$("#idBtnAceptarErrorServidor").focus();
			    	     e.preventDefault();
			    	     $("#myModalERRORTecnico").modal('hide');
				}else{
			    	$('#localizador-cart-form').formValidation('updateStatus','numCliente','NOT_VALIDATED').formValidation(
							'validateField','numCliente');
			    	$('#localizador-cart-form').formValidation('updateStatus','cartera','NOT_VALIDATED').formValidation(
							'validateField','cartera');
			    	$('#localizador-cart-form').formValidation('updateStatus','gestor','NOT_VALIDATED').formValidation(
							'validateField','gestor');
			    	$('#localizador-cart-form').formValidation('updateStatus','sucursal','NOT_VALIDATED').formValidation(
							'validateField','sucursal');

					/** Documento * */
					if ($("#tipoBusquedaCarteras :selected")
							.val() == '2'
							&& $('#localizador-cart-form')
									.data('formValidation')
									.isValidField(
											'numCliente')) {
						busquedaCarterasAjax();
					}
		
					/** Persona Fisica * */
					if ($("#tipoBusquedaCarteras :selected")
							.val() == '4'
							&& $('#localizador-cart-form')
									.data('formValidation')
									.isValidField('cartera')) {
						busquedaCarterasAjax();
					}
		
					/** Persona Juridica * */
					if ($("#tipoBusquedaCarteras :selected")
							.val() == '6'
							&& $('#localizador-cart-form')
									.data('formValidation')
									.isValidField('gestor')) {
						busquedaCarterasAjax();
					}
		
					/** Numero Persona * */
					if ($("#tipoBusquedaCarteras :selected")
							.val() == '8'
							&& $('#localizador-cart-form')
									.data('formValidation')
									.isValidField(
											'sucursal')) {
						busquedaCarterasAjax();
				}    	
				}
	    	
		    }else if($("#myModalOK").hasClass('in')){
		    	
		    	if($("#myModalERROR").hasClass('in')){
			    	
		    		$("#idBtnAceptarError").focus();
		    	     e.preventDefault();
		    	     $("#myModalERROR").modal('hide');
		    	     
		    	
			    }else if($("#myModalERRORTecnico").hasClass('in')){
				    	
			    		$("#idBtnAceptarErrorServidor").focus();
			    	     e.preventDefault();
			    	     $("#myModalERRORTecnico").modal('hide');
			    	     
			    	
				}else{
		    		$("#idBtnAceptar").focus();
		    	     e.preventDefault();
		    	     $("#myModalOK").modal('hide');
		    	     
		    	     //Si el alta es correcta se abre la siguiente pantalla
		    	     if(validacionOKBool == true){
		    	    	 ValidacionOKEnter();
		    	     }else{
		    	    	 if(rechazarOKBool == true){
		    	    		 RechazarOKEnter();
		    	    	 }
		    	     }
				}
		    }else{
		    	if($("#myModalERROR").hasClass('in')){
			    	
		    		$("#idBtnAceptarError").focus();
		    	     e.preventDefault();
		    	     $("#myModalERROR").modal('hide');
		    	     
		    	
			    }else if($("#myModalERRORTecnico").hasClass('in')){
				    	
			    		$("#idBtnAceptarErrorServidor").focus();
			    	     e.preventDefault();
			    	     $("#myModalERRORTecnico").modal('hide');
			    	     
			    	
				}else{
		    	
			    	//No hay abierto ningun modal de busqueda por tanto trigger BUSCAR
			    	
			    	$("#idBuscarClientesVal").focus();
		    	   
			    	
			    	$('#valida-form').formValidation('updateStatus', 'gestorEmpresa', 'NOT_VALIDATED').formValidation('revalidateField', 'gestorEmpresa');
			    	$('#valida-form').formValidation('updateStatus', 'carteraVal', 'NOT_VALIDATED').formValidation('revalidateField', 'carteraVal');
			    	$('#valida-form').formValidation('updateStatus', 'clienteVal', 'NOT_VALIDATED').formValidation('revalidateField', 'clienteVal');
			    	$('#valida-form').formValidation('updateStatus', 'sucursalVal', 'NOT_VALIDATED').formValidation('revalidateField', 'sucursalVal');
			    	
			    	/** TODAS **/
			    	if($("#tipoBusquedaCarterasVal :selected").val()== "T"){
			    		respBusqueda = busquedaCarterasValidAjax();
			    	}
			    	
			    	/** GESTOR **/
			    	if($("#tipoBusquedaCarterasVal :selected").val()== "G" && $('#valida-form').data('formValidation').isValidField('gestorEmpresa')){
			    		respBusqueda = busquedaCarterasValidAjax();
			    	}
			    	
			    	/** CARTERA **/
			    	if($("#tipoBusquedaCarterasVal :selected").val()== "CAR" && $('#valida-form').data('formValidation').isValidField('carteraVal')){
			    		respBusqueda = busquedaCarterasValidAjax();
			    	}
			    	
			    	/** PERSONA **/
			    	if($("#tipoBusquedaCarterasVal :selected").val()== "C" && $('#valida-form').data('formValidation').isValidField('clienteVal')){
			    		respBusqueda = busquedaCarterasValidAjax();
			    	}
			    	
			    	/** SUCURSAL **/
			    	if($("#tipoBusquedaCarterasVal :selected").val()== "S" && $('#valida-form').data('formValidation').isValidField('sucursalVal')){
			    		respBusqueda = busquedaCarterasValidAjax();
			    	}
				}
		    	
		    }
		    if($("#myModalERROR").hasClass('in')){	
	    		$("#idBtnAceptarError").focus();
	    	     e.preventDefault();
	    	     $("#myModalERROR").modal('hide');
		    }
		    
		    if($("#myModalERRORTecnico").hasClass('in')){
		    	
	    		$("#idBtnAceptarErrorServidor").focus();
	    	     e.preventDefault();
	    	     $("#myModalERRORTecnico").modal('hide');
		    }
		}
	}); //FIN Evento ENTER
	
	
	/** Collapse paneles **/
	$('#panelValidacion').on('shown.bs.collapse', function () {
		$('#imgCollapse').prop("src",'/select/front/img/GbAreaV2CloseTrans.gif' );
		$( "#tabla-carteras-valid_wrapper .dataTables_scrollBody" ).css({height: "90px"});
		tablaCarterasValid.columns.adjust().draw();
		
		});
	$('#panelValidacion').on('hidden.bs.collapse', function () {
		var altoPanelNuevo = 
		$('#imgCollapse').prop("src",'/select/front/img/GbAreaV2OpenTrans.gif' );
		$( "#tabla-carteras-valid_wrapper .dataTables_scrollBody" ).css({height: window.innerHeight-$(".sigapanel").height()-180});
		tablaCarterasValid.columns.adjust().draw();
		
		
	});
	
	
});

/**
 * Funcion que carga la página al volver del detalle
 */
function cargaValidacionVolver(){
	
	
	if(tipoBuscarVal == "T"){
		
	}
	
	if(tipoBuscarVal == "G"){
		$("#tipoBusquedaCarterasVal").val("G");
		$("#tipoBusquedaCarterasVal").change();

		$("#inputGestorEmpresaVal").val(entradaVal);
	}
	if(tipoBuscarVal == "CAR"){
		$("#tipoBusquedaCarterasVal").val("CAR");
		$("#tipoBusquedaCarterasVal").change();
		
		
		$("#inputCarteraVal").val(entradaVal);
	}
	if(tipoBuscarVal == "C"){
		$("#tipoBusquedaCarterasVal").val("C");
		$("#tipoBusquedaCarterasVal").change();
		
		$("#comboTipoPersonaVal").val(tipoDePersonaVal);
		$("#comboTipoPersonaVal").change();
		$("#inputClienteVal").val(entradaVal);
		
	}
	if(tipoBuscarVal == "S"){
		$("#tipoBusquedaCarterasVal").val("S");
		$("#tipoBusquedaCarterasVal").change();
		
		$("#inputSucursalVal").val(entradaVal);
	}
	
	busquedaCarterasValidAjax();
	
}

/**
 * Funcion que cierra la ventana modal al pulsar el boton Seleccionar.
 * Rellena los campos necesarios en la pantalla de validacion.
 */

function ajaxInicioValidar(){
	var datosTabla = "";
	var ajax_valid = {
			 "operacion": "C",
			  "tipo": "T"  
	};
	
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_valid),
		type : 'POST',
		cache : false,
		complete: function(){
			tablaCarterasValid.clear();
			tablaCarterasValid.rows.add(datosTabla).draw();
			
			if(tablaCarterasValid.page.info().recordsTotal == 1){
				$('#tabla-carteras-valid tbody tr').addClass('selected');
				carteraValidSelec = tablaCarterasValid.row(0).data();
				tablaCarterasValid.draw();
				habilitaBotonera();
			}
			
			if($("body").is(":hidden")){
				$('body').show();
				tablaCarterasValid.columns.adjust().draw();
			}
			
			if(tipoBuscarVal!=""){
				cargaValidacionVolver();
			}
			
//			if(tipoBuscarVal!="" || tipoBuscarVal!=null){
//				tipoBuscarVal =""; 
//	        	entradaVal =""; 
//	        	tipoDePersonaVal =""; 
//			}
			
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				datosTabla = data;
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


/**
 * Abre la ventana modal de la lista de gestores
 */
$("#idLupaGestor").bind("click", function(e){
	$("#myModalGestores").modal('show');
	tablaGestores.columns.adjust().draw();
});


/**
 * Cierra el modal de Confirmacion en caso de que todo sea OK
 */
//$("#idBtnAceptar").bind("click", function(e){
//	
//	//Si se ha seleccionado Validar se cierra el modal
//	if(isValidacion == null || isValidacion){
//		$("#myModalOK").modal('hide');
//	}else{
//		//Si se selecciona rechazar se imprime el documento
//		$("#myModalOK").modal('hide');
//		deshabilitaBotonera();
//		deshabilitaPantalla();
//		
//		if(documentoImprimirValid!=""){
//			window.open(documentoImprimirValid);
//		}
//	}
//	
//});

/**
 * Rechazar - ENTER
 */
function RechazarOKEnter(){
	var ajax_rechazar = {
			"operacion":"V",
            "cartera": carteraValidSelec.cartera
	};
	var target = document.getElementById('idRechazar');
	var spinner = new Spinner(optionsSpin).spin(target);
	
	$.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_rechazar),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#idRechazar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idRechazar").prop("disabled", true);
			deshabilitaPantalla();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idRechazar").css("color", "#fff");
        	$("#idRechazar").prop("disabled", false);
        	habilitaPantalla();
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				if(data.realizada==true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					documentoImprimirValid = data.documento;
					borrarFila();
					rechazarOKBool = true;
					RechazarOK();
				}else{
					$("#mensajeError").html(data.mensaje);
					$("#myModalERROR").modal('show');
				}
				
			}else{
				if($("#myModalBuscar").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}
			}
			
		    			
		},
		error: function(xhr, status, error) {
			if($("#myModalBuscar").hasClass('in')){
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}else{
				
			}
		}
	});
}

/**
 * Rechazar - BOTON
 */
$("#idRechazar").bind("click", function(){
	var ajax_rechazar = {
			"operacion":"R",
            "cartera": carteraValidSelec.cartera
	};
	var target = document.getElementById('idRechazar');
	var spinner = new Spinner(optionsSpin).spin(target);
	
	$.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_rechazar),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#idRechazar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idRechazar").prop("disabled", true);
			deshabilitaPantalla();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idRechazar").css("color", "#fff");
        	$("#idRechazar").prop("disabled", false);
        	habilitaPantalla();
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				if(data.realizada==true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					documentoImprimirValid = data.documento;
					borrarFila();
					rechazarOKBool = true;
					RechazarOK();
				}else{
					$("#mensajeError").html(data.mensaje);
					$("#myModalERROR").modal('show');
				}
				
			}else{
				if($("#myModalBuscar").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}
			}
			
		    			
		},
		error: function(xhr, status, error) {
			if($("#myModalBuscar").hasClass('in')){
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}else{
				
			}
		}
	});
});

/**
 * Validar - ENTER
 */

function ValidacionOKEnter(){
	var ajax_validar = {
			"operacion":"V",
            "cartera": carteraValidSelec.cartera

	};
	var target = document.getElementById('idValidar');
	var spinner = new Spinner(optionsSpin).spin(target);
	
	$.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_validar),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#idValidar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idValidar").prop("disabled", true);
			deshabilitaPantalla();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idValidar").css("color", "#fff");
        	$("#idValidar").prop("disabled", false);
        	habilitaPantalla();
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				if(data.realizada==true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					borrarFila();
					validacionOKBool = true;
					ValidacionOK();
				}else{
					ValidacionNoOK();
					$("#mensajeError").html(data.mensaje);
					$("#myModalERROR").modal('show');
				}
				
			}else{
				if($("#myModalBuscar").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}
			}
			
		    			
		},
		error: function(xhr, status, error) {
			if($("#myModalBuscar").hasClass('in')){
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}else{
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		}
	});
}

/**
 * Validar - BOTON
 */
$("#idValidar").bind("click", function(){
	var ajax_validar = {
			"operacion":"V",
            "cartera": carteraValidSelec.cartera

	};
	var target = document.getElementById('idValidar');
	var spinner = new Spinner(optionsSpin).spin(target);
	
	$.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_validar),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#idValidar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idValidar").prop("disabled", true);
			deshabilitaPantalla();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idValidar").css("color", "#fff");
        	$("#idValidar").prop("disabled", false);
        	habilitaPantalla();
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				if(data.realizada==true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					borrarFila();
					validacionOKBool = true;
					ValidacionOK();
				}else{
					ValidacionNoOK();
					$("#mensajeError").html(data.mensaje);
					$("#myModalERROR").modal('show');
				}
				
			}else{
				if($("#myModalBuscar").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}
			}
			
		    			
		},
		error: function(xhr, status, error) {
			if($("#myModalBuscar").hasClass('in')){
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}else{
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		}
	});
});

function ValidacionOK(){
	validacionOKBool = false;
	$("#idBtnAceptar").bind('click', function(){
		
		$("#myModalOK").modal('hide');
		deshabilitaBotonera();
				
		
	});
}

function ValidacionNoOK(){
	$("#idBtnAceptar").bind('click', function(){
		
		
		
	});
}

function RechazarOK(){
	rechazarOKBool = false;
	$("#idBtnAceptar").bind('click', function(){

		//Si se selecciona rechazar se imprime el documento
		$("#myModalOK").modal('hide');
		deshabilitaBotonera();	
				
		if(documentoImprimirValid!=""){
			window.open(documentoImprimirValid);
		}
		
		
	});
}

function RechazarNoOK(){
	$("#idBtnAceptar").bind('click', function(){
		$("#myModalOK").modal('hide');
	});
}


/**
 * Ver detalles - BOTON
 */
$("#idVerDetalles").bind("click", function(){
	$("#idBuscador").val($("#tipoBusquedaCarterasVal :selected").val());
	
	if($("#tipoBusquedaCarterasVal :selected").val() == "T"){
		$("#idEntrada").val("");
	}
	if($("#tipoBusquedaCarterasVal :selected").val() == "G"){
		$("#idEntrada").val($("#inputGestorEmpresaVal").val());
	}
	if($("#tipoBusquedaCarterasVal :selected").val() == "CAR"){
		$("#idEntrada").val($("#inputCarteraVal").val());
	}
	if($("#tipoBusquedaCarterasVal :selected").val() == "C"){
		$("#idEntrada").val($("#inputClienteVal").val());
		$("#idTipoDePersona").val($("#comboTipoPersonaVal :selected").val());
	}
	if($("#tipoBusquedaCarterasVal :selected").val() == "S"){
		$("#idEntrada").val($("#inputSucursalVal").val());
	}
	
	$("#formDetalles").attr("action", "/select/front/htm/DetallesSiga.jsp");
	$("#formDetalles").submit();
});

/** INICIA TABLAS **/
function iniciaTablasValidacion(){
	tablaCarterasValid = $('#tabla-carteras-valid').DataTable({
		"sScrollY" : 90,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		ordering : false,
		info : false,
		"aaData" : "",
		"columns" : [
		             {"data" : "cartera"},
		             {"data" : "contrato","width" : "15%"}, 
		             {"data" : "primerTitular","width" : "20%"}, 
		             {"data" : "nTitulares"}, 
		             {"data" : "sucursal"},
		             {"data" : "tipo"}, 
		             {"data" : "estandar"}  
		 ],
		"language" : {
			"zeroRecords" : "No hay registros"
		}
	});
	
//	$("#tabla-carteras-valid").parent().parent().children(':first-child').children(':first-child').width("100%");
//	$("#tabla-carteras-valid").parent().parent().children(':first-child').children(':first-child').children(':first-child').width("100%");
	
	$('#tabla-carteras-valid tbody').on('click','tr',function() {
		
		if(isBloqueadoPantalla){
			
		}else{
			carteraValidSelec = tablaCarterasValid.row(this).data();
			$("#carteraDetalle").val(carteraValidSelec.cartera);
			
			if(carteraValidSelec == null){
				$(this).removeClass('selected');
			}else{
				if ($(this).hasClass('selected')) {
					$(this).removeClass('selected');
					carteraValidSelec = null;
					deshabilitaBotonera();
				} else {
					habilitaBotonera();
					tablaCarterasValid.$('tr.selected').removeClass('selected');
					$(this).addClass('selected');
	
					
				}
			}
		}
	});
}

/**
 * Rellena la tabla con los datos obtenidos de la respuesta Ajax
 */
function rellenaTabla(datosLista){
	tablaCarterasValid.clear();
	tablaCarterasValid.rows.add(datosLista).draw();
	
	if(tablaCarterasValid.page.info().recordsTotal == 1){
		$('#tabla-carteras-valid tbody tr').addClass('selected');
		carteraValidSelec = tablaCarterasValid.row(0).data();
		tablaCarterasValid.draw();
		habilitaBotonera();
		$("#carteraDetalle").val(carteraValidSelec.cartera);
	}

}

/**
 * Funcion que deshabilita los botones principales
**/
function deshabilitaBotonera(){
	$("#idRechazar").prop("disabled", true);
	$("#idValidar").prop("disabled", true);
	$("#idVerDetalles").prop("disabled", true);
}

/**
 * Funcion que deshabilita los botones principales
**/
function habilitaBotonera(){
	$("#idRechazar").prop("disabled", false);
	$("#idValidar").prop("disabled", false);
	$("#idVerDetalles").prop("disabled", false);
}

/**
 * Funcion que deshabilita la pantalla
 */

function deshabilitaPantalla(){
	$("#idBuscarCarteraVal").prop("disabled", true);
	$("#idBuscarCarteraVal > span").removeClass();
	$("#idBuscarCarteraVal > span").addClass("lupaDisabled");
	
	$("#idBuscarGestor").prop("disabled", true);
	$("#idBuscarGestor > span").removeClass();
	$("#idBuscarGestor > span").addClass("lupaDisabled");
	
	$("#idBuscarClientesVal").prop("disabled", true);
	$("#idBuscarClientesVal > span").removeClass();
	$("#idBuscarClientesVal > span").addClass("lupaDisabled");
	
	$('input, select').prop("disabled", true);
	$("#idBuscarValid").prop("disabled", true);
	
	isBloqueadoPantalla = true;
	deshabilitaBotonera();
	
}

/**
 * Funcion que habilita la pantalla
 */

function habilitaPantalla(){
	$("#idBuscarCarteraVal").prop("disabled", false);
	$("#idBuscarCarteraVal > span").removeClass();
	$("#idBuscarCarteraVal > span").addClass("lupa");
	
	$("#idBuscarGestor").prop("disabled", false);
	$("#idBuscarGestor > span").removeClass();
	$("#idBuscarGestor > span").addClass("lupa");
	
	$("#idBuscarClientesVal").prop("disabled", false);
	$("#idBuscarClientesVal > span").removeClass();
	$("#idBuscarClientesVal > span").addClass("lupa");
	
	$('input, select').prop("disabled", false);
	$("#idBuscarValid").prop("disabled", false);
	
	isBloqueadoPantalla = false;
	
	if(tablaCarterasValid.page.info().recordsTotal == 0){
		carteraValidSelec = null;
	}else{
		habilitaBotonera();
	}
	
	
}

/**
* Funcion que abre el buscador de gestores
**/
$("#idBuscarGestor").bind('click', function(){
	$("#myModalGestores").modal('show');
});

/**
* Funcion que abre el buscador de carteras
**/
$("#idBuscarCarteraVal").bind('click', function(){
	$("#myModalBuscar").addClass("fade");
	$("#myModalCarteras").addClass("fade");
	$("#tipoBusquedaCarteras").val("2").change();
	$("#comboTipoPersona").val("F").change();
	//iniciaTablaCarteras();
	
	tablaCarteras.clear().draw();
	limpiaCamposLoc();
	
	if(respBusquedaCart && respBusquedaCart.readystate != 4){
		respBusquedaCart.abort();
    }
	
	$("#myModalCarteras").modal('show');
});

/**
 * Funcion que abre el buscador de cliente desde la pantalla de Validacion
 */
$("#idBuscarClientesVal").bind('click', function(){
	tablaClientes.settings()[0].oLanguage["sEmptyTable"] = " ";
	modalClientesAbierto = false;
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
//	$('.dataTables_scrollHeadInner,.dataTables_scrollHeadInner table').width("100%");
	
	if(respBusqueda && respBusqueda.readystate != 4){
		respBusqueda.abort();
    }
});

/**
 * Crea el parametro ajax que se envia al servicio REST
 * @returns el objeto relleno
 */
function getAjaxCarteras(isPaginacion, paginaIndex){
	var ajax_lista_carteras = null;
	
	if(isPaginacion == false){
	
		if($("#tipoBusquedaCarterasVal").val() == "T"){
			ajax_lista_carteras = {
					  "operacion": "C",
					  "tipo": "T"  
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "G"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "G",
					 "gestor": $("#inputGestorVal").val() 
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "S"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "S",
					 "oficina": $("#inputSucursalVal").val() 
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "C"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "C",
					 "cliente": parseInt($("#inputClienteVal").val()), 
					 "tipoPersona": $("#comboTipoPersonaVal :selected").val()
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "CAR"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "CAR",
					 "cartera": $("#inputCarteraVal").val()
			};
		}
	}else if(isPaginacion){
		if($("#tipoBusquedaCarterasVal").val() == "T"){
			ajax_lista_carteras = {
					  "operacion": "C",
					  "tipo": "T",
					  "paginacion": paginaIndex
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "G"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "G",
					 "gestor": $("#inputGestorVal").val(),
					 "paginacion": paginaIndex
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "S"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "S",
					 "oficina": $("#inputSucursalVal").val(),
					 "paginacion": paginaIndex
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "C"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "C",
					 "cliente": parseInt($("#inputClienteVal").val()), 
					 "tipoPersona": $("#comboTipoPersonaVal :selected").val(),
					 "paginacion": paginaIndex
			};
		}else if($("#tipoBusquedaCarterasVal").val() == "CAR"){
			ajax_lista_carteras = {
					"operacion": "C",
					 "tipo": "CAR",
					 "cartera": $("#inputCarteraVal").val(),
					 "paginacion": paginaIndex
			};
		}
	
	}
	
	if(ajax_lista_carteras != null){
		return ajax_lista_carteras;
	}else{
		return "";
	}
}

/**
 * Búsqueda de carteras
 */
function busquedaCarterasValidAjax(){
	
	pagActualCarterasValid = 0;
	arrPagCarterasValid = [];
	
	var pagina = 0;
	var ajax_cartera_valid = null;
	var target = document.getElementById('idBuscarValid');
	var spinner = new Spinner(optionsSpin).spin(target);
	var xhr;
	
	ajax_cartera_valid = getAjaxCarteras(false, "");
	
    xhr = $.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cartera_valid),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#idBuscarValid").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idBuscarValid").prop("disabled", true);
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idBuscarValid").css("color", "#fff");
        	$("#idBuscarValid").prop("disabled", false);
        	var ie8Nchild = "";
        	if(tipoBuscarVal != ""){
        		
        		if(tablaCarterasValid.page.info().recordsTotal != 1){
        			for(var i=0; i < tablaCarterasValid.page.info().recordsTotal; i++ ){
            			
            			if(tablaCarterasValid.row(i).data().cartera == carteraDetalle){
            				carteraValidSelec = tablaCarterasValid.row(i).data();
            				$("#carteraDetalle").val(carteraValidSelec.cartera);
            				$('#tabla-carteras-valid tbody :first-child'+ ie8Nchild).addClass('selected');
            			}
            			ie8Nchild += " +tr";
            			
            		}
            		habilitaBotonera();
        		}
        		
        	}
        	tablaCarterasValid.draw();
        	tipoBuscarVal =""; 
        	entradaVal =""; 
        	tipoDePersonaVal =""; 
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				if(data["paginacion"] === undefined){
					$("#pager-val-carteras").hide();
				}
				
				if(data.masDatos == true){
					if(arrPagClientes.length == 0){

						$("#btnPaginaBusqAtrasVal").prop("disabled", true);
					
					}
					$("#pager-val-carteras").show();
					arrPagCarterasValid.push({"paginacion" : data.paginacion, "masDatos": true});
					$("#btnPaginaBusqSigVal").prop("disabled", false);
				}
				
				
				rellenaTabla(data);
				
				
			}else{
				if($("#myModalBuscar").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}
			}
			
		    			
		},
		error: function(xhr, status, error) {
			if($("#myModalBuscar").hasClass('in')){
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}else{
				
			}
		}
	});

    return xhr;
	
	
}


//PAGINADOR - Adelante - Resultados Busqueda
$('#btnPaginaBusqSigVal').bind('click',function(){
	
	var pagina = arrPagCarterasValid.length;
	pagina--;
	var ajax_cartera_valid = null;
	var target = document.getElementById('idBuscarValid');
	var spinner = new Spinner(optionsSpin).spin(target);
	var xhr;
	
	
	ajax_cartera_valid = getAjaxCarteras(true, arrPagCarterasValid[pagina].paginacion);
	
	respBusqueda = $.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cartera_valid),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#btnPaginaBusqSigVal").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#btnPaginaBusqSigVal").prop("disabled", true);
			$("#btnPaginaBusqAtrasVal").prop("disabled", true);
			
	
        },
        complete: function(data) {
        	$(target).data('spinner').stop();
        	$("#btnPaginaBusqSigVal").css("color", "#fff");
        	
        	
        	//IE8
        	if(data.responseJSON === undefined){
        		var dataParse = JSON.parse(data.responseText);
        		
        		if(dataParse["masDatos"] !== undefined){
					$("#btnPaginaBusqSigVal").prop("disabled", false);
				}
				if(dataParse["masDatos"] === undefined){				
					$("#btnPaginaBusqSigVal").prop("disabled", true);
				}
				$("#btnPaginaBusqAtrasVal").prop("disabled", false);
				
				deshabilitaBotonera();
        	
        	}else{
        		//Otros navegadores
	        	if(data.responseJSON["masDatos"] !== undefined){
					$("#btnPaginaBusqSigVal").prop("disabled", false);
				}
				if(data.responseJSON["masDatos"] === undefined){
					$("#btnPaginaBusqSigVal").prop("disabled", true);
				}
				$("#btnPaginaBusqAtrasVal").prop("disabled", false);
				
				deshabilitaBotonera();
        	}
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				
				if(data.masDatos == true){
					arrPagCarterasValid.push({"paginacion" : data.paginacion, "masDatos": true});
				}else{
					arrPagCarterasValid.push({"paginacion" : data.paginacion, "masDatos": false});
				}
				
				rellenaTabla(data);
				
			}else{
				if($("#myModalBuscar").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}else{
					
				}
			}
			
		},
		error: function(xhr, status, error) {
			
			if($("#myModalBuscar").hasClass('in')){
				$("#btnPaginaBusqSig").prop("disabled", false);
				if(arrPagClientes.length > 1){
					$("#btnPaginaBusqAtrasVal").prop("disabled", false);
				}
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}else{
				
			}
		}
	});
	
});


//PAGINADOR - Atras - Resultados Busqueda
$('#btnPaginaBusqAtrasVal').bind('click',function(){
	if ($('#btnPaginaBusqAtrasVal').hasClass('disabled')){ // Paa chrome
		return;
	}
	var ajax_cartera_valid = null;
	var target = document.getElementById('btnPaginaBusqAtrasVal');
	var spinner = new Spinner(optionsSpin).spin(target);
//	arrPagClientes.pop();
	var pagina = arrPagCarterasValid.length-2;
	pagina--;
	
	var tamArray = arrPagCarterasValid.length;
	

	if(pagina == -1){
		ajax_cartera_valid = getAjaxCarteras(true, "");
	}else{
		ajax_cartera_valid = getAjaxCarteras(true, arrPagCarterasValid[pagina].paginacion);
	}

	respBusqueda = $.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Validacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cartera_valid),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#btnPaginaBusqAtrasVal").css("color", "#ff2500");
			$(target).data('spinner', spinner);

			$("#btnPaginaBusqAtrasVal").prop("disabled", true);
			$("#btnPaginaBusqSigVal").prop("disabled", true);
        },
        complete: function(data) {
        	
        	$(target).data('spinner').stop();
        	$("#btnPaginaBusqAtrasVal").css("color", "#fff");
			
			//IE8
        	if(data.responseJSON === undefined){
        		var dataParseAtras = JSON.parse(data.responseText);
				if(arrPagCarterasValid.length == 1 && dataParseAtras.masDatos==true){

					$("#btnPaginaBusqAtrasVal").prop("disabled", true);
					
				}
				
				if(arrPagCarterasValid.length > 1 && dataParseAtras.masDatos==true){
					$("#btnPaginaBusqAtrasVal").prop("disabled", false);
				}
				
				deshabilitaBotonera();
        	}else{
        		//Otros navegadores
        		if(arrPagCarterasValid.length == 1 && data.responseJSON.masDatos==true){

					$("#btnPaginaBusqAtrasVal").prop("disabled", true);
					
				}
				
				if(arrPagCarterasValid.length > 1 && data.responseJSON.masDatos==true){
					$("#btnPaginaBusqAtrasVal").prop("disabled", false);
				}
				
				deshabilitaBotonera();
        	}
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				
				$("#btnPaginaBusqSigVal").prop("disabled", false);
				if(arrPagCarterasValid.length == 1 && data.masDatos==true){

					$("#btnPaginaBusqAtrasVal").prop("disabled", true);
					
				}
				
				if(arrPagCarterasValid.length > 1 && data.masDatos==true){
					
					$("#btnPaginaBusqAtrasVal").prop("disabled", false);
				}
				
				rellenaTabla(data);
				
				arrPagCarterasValid.pop();
			}else{
				if($("#myModalBuscar").hasClass('in')){
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				}
			}
			
		},
		error: function(xhr, status, error) {
			
			
			if($("#myModalBuscar").hasClass('in')){
				
				$("#btnPaginaBusqAtrasVal").prop("disabled", false);
				if(arrPagCarterasValid[arrPagCarterasValid.length-1].masDatos == true ){
					$("#btnPaginaBusqSigVal").prop("disabled", false);
				}
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		}
	});
	
});

function borrarFila(){
	tablaCarterasValid.row('.selected').remove().draw();
}

