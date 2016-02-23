/**
 * 
 */

$(document).ready(function(){
	
	
	
	$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Datos&tipoCab=1", function(data){
	    $("#idCabeceraCartera").prepend(data);
	    iniciaCabecera();
	    
	    if ( idCarteraAux != null){
	    	/* Cargar datos post */
			$("#idCartera").val(idCarteraAux);
			$("#idCliente").val(idClienteAux);
			$("#idContrato").val(idContratoAux);
			$("#idContrato").prop('title', idContratoAux);
			$("#idProducto").val(idProductoAux);
			$("#idProducto").prop('title', idProductoAux);
			$("#idNombreGestor").val(idNombreGestorAux);
			$("#idNombreGestor").prop('title', idNombreGestorAux);
			$("#idSituacion").val(idSituacionAux);
			$("#idDivisaRef").val(idDivisaRefAux);
			$("#idOficinaGestor").val(idOficinaGestorAux);
			$("#idOficinaGestor").prop('title', idOficinaGestorAux);
			$("#idFechaActivacion").val(idFechaActivacionAux);
			$("#idPerfilCartera").val(idPerfilCarteraAux);
			$("#idTelefonoGestor").val(idTelefonoGestorAux);
			$("#estRef").val(idEstandarRef);
			if($("#idCartera").val() == ""){
				$("#idOperacion").prop('disabled', true);
				$("#idValoracion").prop('disabled', true);
				$("#idDetalle").prop('disabled', true);
				$("#idRentabilidad").prop('disabled', true);
				
			} else {
				$("#idOperacion").prop('disabled', false);
				$("#idValoracion").prop('disabled', false);
				$("#idDetalle").prop('disabled', false);
				$("#idRentabilidad").prop('disabled', false);
			}
	    }
	    
	    $("body").show();
	});
	
	cargarModalLocCarteras("LocalizarCarteras12.html");
	cargarModal("Error.html");
	
	
	
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
	
//	cargarModal("BuscarCuentas12.html");
});

$("#idRentabilidad").on("click", function(e){
	$("#estandar").val(encodeURI($("#estRef").val())) ;
	$("#formCartera").attr("action", "/select/front/htm/RentabilidadSiga.jsp");
	$("#formCartera").submit();	
});

$("#idOperacion").on("click", function(e){
	$("#estandar").val(encodeURI($("#estRef").val())) ;
	$("#formCartera").attr("action", "/select/front/htm/OperacionSiga.jsp");
	$("#formCartera").submit();
});


$("#idValoracion").on("click", function(e){
	$("#formCartera").attr("action", "/select/front/htm/ValoracionSiga.jsp");
	$("#estandar").val(encodeURI($("#estRef").val())) ;
	$("#formCartera").submit();
});

$("#idDetalle").on("click", function(e){
	$("#estandar").val(idEstandarRef) ;
	$("#formCartera").attr("action", "/select/front/htm/DetallesSiga.jsp");
	$("#formCartera").submit();
});






/* Función para cargar el localizador de carteras */
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
			selCartera();
			$("#myModalCarteras").on("shown.bs.modal", function (event) {
				tablaCarteras.columns.adjust().draw();
			 });
			
		},
		success : function(data) {
			$("body").append(data);
			
		}
		
	});
}
