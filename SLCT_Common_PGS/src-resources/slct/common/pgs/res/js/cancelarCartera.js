/**
 * 
 */


var documentoImprimir = "";
var widthPantallaCancelacion = 0;
function cargarModal(path) {
		$.ajax({
			url : "/select/front/htm/modals/"+path,
			success : function(data) {
				$("body").append(data);
			},
			dataType : "html"
		});
	}

function cargarModalLocCarteras(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		dataType : "html",
		complete: function(){
			iniciaBotonesCarterasModal();
			iniciaCombosCartera();
			iniciaTablaCarteras();
			iniciaFormularioCarteras();
			selCarteraCancelacion();
			$("#myModalCarteras").on("shown.bs.modal", function (event) {
				tablaCarteras.columns.adjust().draw();
			 });
			
		},
		success : function(data) {
			$("body").append(data);
			
		}
		
	});
}
	
$(document).ready(function(){
	
	var wCancelacion = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	 resolucionPantallaCancelacion(wCancelacion);
	 
	 $( window ).resize(function() {
		 widthPantallaCancelacion = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		 resolucionPantallaCancelacion(widthPantallaCancelacion);
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
	    	
		    }else if(!($("#idConfirmar").is(":disabled"))){
		    	if($("#myModalERROR").hasClass('in')){
			    	
		    		$("#idBtnAceptarError").focus();
		    	     e.preventDefault();
		    	     $("#myModalERROR").modal('hide');
		    	     
		    	
			    }else if($("#myModalERRORTecnico").hasClass('in')){
				    	
			    		$("#idBtnAceptarErrorServidor").focus();
			    	     e.preventDefault();
			    	     $("#myModalERRORTecnico").modal('hide');
			    	     
			    	
				}else{
					$("#idConfirmar").focus();
			    	e.preventDefault();
			    	cancelarEnter();
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
	    
	    
	});
	
	
		$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Cancelación&tipoCab=4", function(data){
		    $("#idCabeceraCartera").prepend(data);
		    iniciaCabecera();
		    $("#headerTitulo").html("Cancelación");
		});
		
		cargarModalLocCarteras("LocalizarCarteras12.html");
		
		cargarModal("Error.html");
		cargarModal("ErrorServidor.html");
		
		$("#idImprimir").prop("disabled", true);
		$("#idConfirmar").prop("disabled", true);
		
		$('#comboTipoCancel').select2({
			disabled: true,
			width : "100%"
		});
		
		
		/** Carga Combo Disposicion **/
		$("#comboTipoCancel").select2().on('change',function() {
			
			if ($("#comboTipoCancel  :selected").val()!=-1) {
				$("#idConfirmar").prop('disabled', false);
				
			} else {
				$("#idConfirmar").prop('disabled', true);
			};
			
		});
		
		$("#idConfirmar").on("click", function(){
			var target = document.getElementById('idConfirmar');
			var spinner = new Spinner(opts).spin(target);
			var ajax_cancelacion = {
					"cartera": $("#idCartera").val(),
					"tipo": $("#comboTipoCancel  :selected").val(),
					"operacion":"CAN"
			};
			$.ajax({
				url : "/select/rest/json/Cancelacion",
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(ajax_cancelacion),
				type : 'POST',
				dataType: "json", 
				cache: false,
				beforeSend: function() {
					$("#idConfirmar").css("color", "#ff2500");
					$(target).data('spinner', spinner);
					$("#idConfirmar").prop("disabled", true);
					$('#comboTipoCancel').prop("disabled", true);
		        },
		        complete: function() {
		        	$(target).data('spinner').stop();
		        	$("#idConfirmar").css("color", "#fff");
		        },
				success : function(data) {
					if(data["ERROR"] === undefined){
						if(data.cancelacion == true){
							$("#mensajeCancelacion").html(data.mensaje);
							$("#myModalOK").modal('show');
							$("#idImprimir").prop("disabled", true);
							$("#idConfirmar").prop("disabled", true);
							documentoImprimir = data.documento;
						} else {
							$("#mensajeError").html(data.mensaje);
							$("#myModalError").modal('show');
						}
						
					}else{
						$("#mensajeError").html(data.ERROR_MSG);
						$("#myModalERROR").modal('show');
						$('#comboTipoCancel').prop("disabled", false);
			        	$("#idConfirmar").css("color", "#fff");
			        	$("#idConfirmar").prop("disabled", false);
					}
		
				},
				error: function(xhr, status, error) {
					$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
					$("#myModalERRORTecnico").modal('show');
					$('#comboTipoCancel').prop("disabled", false);
		        	$("#idConfirmar").css("color", "#fff");
		        	$("#idConfirmar").prop("disabled", false);
				}
			});
		});
		
		
		
});


function cancelarEnter(){
	var ajax_cancelacion = {
			"cartera": $("#idCartera").val(),
			"tipo": $("#comboTipoCancel  :selected").val(),
			"operacion":"CAN"
	};
	$.ajax({
		url : "/select/rest/json/Cancelacion",
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cancelacion),
		type : 'POST',
		dataType: "json", 
		cache: false,
		success : function(data) {
			if(data["ERROR"] === undefined){
				if(data.realizada == true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					
					
					document.getElementById("cancel-form").reset();
					$('#comboTipoCancel').select2({
						disabled: true,
						width : "100%"
					});
					
					documentoImprimir = data.documento;
					
					
				} else {
					$("#mensajeError").html(data.mensaje);
					$("#myModalError").modal('show');
				}
				
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
				
			}

		},
		error: function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});

}

$("#idImprimir").bind("click", function(){
	window.open(documentoImprimir);
});
	
$("#idBtnAceptar").bind("click", function(){
	//Abrimos una pagina nueva con el documento a Imprimir
	//y bloqueamos todos los campos de la pantalla.
	//Solo podemos pulsar el localizador de carteras y seleccionar una
	//nueva cartera.
	$("#myModalOK").modal('hide');
	$("#idConfirmar").prop("disabled", true);
	$("#comboTipoCancel").prop("disabled", true);
	$('#comboTipoCancel').select2('destroy');
	$('#comboTipoCancel').prop('disabled', true);
	$('#comboTipoCancel').select2();
	
	
	if(documentoImprimir !=""){
		$("#idImprimir").prop("disabled", false);		
		window.open(documentoImprimir);
		
	}
	
});

function resolucionPantallaCancelacion(anchoCancelacion){
	if(anchoCancelacion <= 1024){
		$("#lblImporte").html("Tipo Cancelación:");
		
	}else{
		$("#lblImporte").html("Tipo de cancelación:");

	}
}