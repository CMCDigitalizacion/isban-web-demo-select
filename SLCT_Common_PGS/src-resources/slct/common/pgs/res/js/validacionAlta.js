var arrPagClientes = [];
var respBusqueda = null;
$(document).ready(function(){

});

function iniciaFormularioValidacion(){
	$('#localizador-pers-form')
    .formValidation({
        framework: 'bootstrap',
        icon: {
//            valid: 'glyphicon glyphicon-ok',
//            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	documento: {
                // The messages for this field are shown as usual
        		trigger: 'blur',
                validators: {
                    notEmpty: {
                    	enabled: true,
                        message: 'El documento es obligatorio'
                    },
                    regexp: {
                        regexp: /^[xXyYzZ]{1}[0-9]{7}[tTrRwWaAgGmMyYfFpPdDxXbBnNjJzZsSqQvVhHlLcCkKeEtT]{1}$/,
                        message: 'El documento no es válido'
                    }
                }
            },
            apellido1: {
                // The messages for this field are shown as usual
                validators: {
                    notEmpty: {
                        message: 'El primer apellido es obligatorio'
                    }
                }
            },
            densocial: {
                // The messages for this field are shown as usual
                validators: {
                    notEmpty: {
                        message: 'Introduce algún valor de búsqueda'
                    }
                }
            },
            codigo: {
                // The messages for this field are shown as usual
                validators: {
                			notEmpty: {
                        message: 'Introduce algún valor de búsqueda'
                    },
                    integer: {
                    	message: 'El código debe ser numérico'
                    }
                }
            }
        }
    }).on('mousedown', '.buscarCliente', function(){
    	
    	
    	
    	$('#localizador-pers-form').formValidation('updateStatus', 'documento', 'NOT_VALIDATED').formValidation('revalidateField', 'documento');
    	$('#localizador-pers-form').formValidation('updateStatus', 'apellido1', 'NOT_VALIDATED').formValidation('revalidateField', 'apellido1');
    	$('#localizador-pers-form').formValidation('updateStatus', 'densocial', 'NOT_VALIDATED').formValidation('revalidateField', 'densocial');
    	$('#localizador-pers-form').formValidation('updateStatus', 'codigo', 'NOT_VALIDATED').formValidation('revalidateField', 'codigo');
    	
    	/** Documento **/
    	if($("#tipoBusqueda :selected").val()== '2' && $('#localizador-pers-form').data('formValidation').isValidField('documento')){
    		respBusqueda = busquedaClientesAjax();
    	}
    	
    	/** Persona Fisica **/
    	if($("#tipoBusqueda :selected").val()== '4' && $('#localizador-pers-form').data('formValidation').isValidField('apellido1')){
    		respBusqueda = busquedaClientesAjax();
    	}
    	
    	/** Persona Juridica **/
    	if($("#tipoBusqueda :selected").val()== '6' && $('#localizador-pers-form').data('formValidation').isValidField('densocial')){
    		respBusqueda = busquedaClientesAjax();
    	}
    	
    	/** Numero Persona **/
    	if($("#tipoBusqueda :selected").val()== '8' && $('#localizador-pers-form').data('formValidation').isValidField('codigo')){
    		respBusqueda = busquedaClientesAjax();
    	}
    });
	
	
	/** Cambio combo Onchange Regex **/
	$("#comboTipoDocumento").select2().on('change', function(e){
		var regularExpresion = '';
		var valorDocumento = $("#idDocument").val();
		if($("#comboTipoDocumento :selected").val() == "C"){
			//TARJETA DE RESIDENCIA - N.I.E.
			regularExpresion = /^[xXyYzZ]{1}[0-9]{7}[tTrRwWaAgGmMyYfFpPdDxXbBnNjJzZsSqQvVhHlLcCkKeEtT]{1}$/; 
			$('#localizador-pers-form').formValidation('updateOption', 'documento', 'regexp', 'regexp', regularExpresion)
			.formValidation('revalidateField', 'documento');
		}else if($("#comboTipoDocumento :selected").val() == "D"){
			//DNI
			regularExpresion =  /^\d{1,8}$/;
			$('#localizador-pers-form').formValidation('updateOption', 'documento', 'regexp', 'regexp', regularExpresion).
			formValidation('revalidateField', 'documento');
		}else if($("#comboTipoDocumento :selected").val() == "I"){
			//DOCUMENTO IDENTIFICACION EXTRANJERO - Pueden ser solo numeros
			regularExpresion = /^[a-zA-Z0-9]{1,12}$/;
			$('#localizador-pers-form').formValidation('updateOption', 'documento', 'regexp', 'regexp', regularExpresion)
			.formValidation('revalidateField', 'documento');
		}else if($("#comboTipoDocumento :selected").val() == "N"){
			//NIF
			regularExpresion =  /^\d{1,8}[a-zA-Z]$/;
			$('#localizador-pers-form').formValidation('updateOption', 'documento', 'regexp', 'regexp', regularExpresion)
			.formValidation('revalidateField', 'documento');
		}else if($("#comboTipoDocumento :selected").val() == "P"){
			//PASAPORTE - Solo numerico
			regularExpresion =  /^[a-zA-Z0-9]{1,12}$/;
			$('#localizador-pers-form').formValidation('updateOption', 'documento', 'regexp', 'regexp', regularExpresion)
			.formValidation('revalidateField', 'documento');
		}else if($("#comboTipoDocumento :selected").val() == "S"){
			//CIF
			regularExpresion =  /^[a-zA-Z]{1}\d{7}[a-jA-J0-9]{1}$/;
			$('#localizador-pers-form').formValidation('updateOption', 'documento', 'regexp', 'regexp', regularExpresion)
			.formValidation('revalidateField', 'documento');
		}
		
		
		$('#localizador-pers-form').formValidation('resetForm', true);
		$("#idDocument").val(valorDocumento);
		
	});
	
	/** Validar CIF 
	  	$cifRegEx1 = '/^[ABEH][0-9]{8}$/i';
	    $cifRegEx2 = '/^[KPQS][0-9]{7}[A-J]$/i';
	    $cifRegEx3 = '/^[CDFGJLMNRUVW][0-9]{7}[0-9A-J]$/i';
	 **/
}

function limpiarCamposCliente(){
	$("#idDocument").val("");
	$("#idNombre").val("");
	$("#idApellido1").val("");
	$("#idApellido2").val("");
	$("#idDenSocial").val("");
	$("#idCodigo").val("");
}

function busquedaClientesAjax(){
	$("#idSelCliente").prop("disabled", true);
	
	tablaClientes.settings()[0].oLanguage["sEmptyTable"] = "No hay registros";
	pagActualClientes = 0;
	arrPagClientes = [];
	
	var pagina = 0;
	var ajax_cliente = null;
	var target = document.getElementById('idBuscarCliente');
	var spinner = new Spinner(opts).spin(target);
	var xhr;
	
	/** Documento **/
	if($("#tipoBusqueda").val() == 2){
		ajax_cliente = {
				//$("#comboTipoDocumento :selected").val()
				  "tipoLlamada": $("#tipoBusqueda").val(),
				  "nDocumento": $("#idDocument").val().toUpperCase(),
				  "tDocumento": $("#comboTipoDocumento :selected").val(),
				  "pagina": ""
				  
		};
	}
	
	/** Persona Fisica **/
	if($("#tipoBusqueda").val() == 4){
		ajax_cliente = {
				"tipoLlamada": $("#tipoBusqueda").val(),
				 "tLocalizacion": $("#tipoExtensiva").val(),
				 "apellido1": $("#idApellido1").val().toUpperCase(),
				 "apellido2": $("#idApellido2").val().toUpperCase(),
				 "nombre": $("#idNombre").val().toUpperCase(),
				 "pagina": ""
				  
		};
	}
	
	/** Persona Juridica **/
	if($("#tipoBusqueda").val() == 6){
		ajax_cliente = {
				"tipoLlamada": $("#tipoBusqueda").val(),  
				  "tLocalizacion": $("#tipoExtensiva").val(),
				  "sociedad": $("#idDenSocial").val().toUpperCase(), 
				  "pagina": ""
		}
	}
	
	/** Numero de Persona **/
	if($("#tipoBusqueda").val() == 8){
		ajax_cliente = {
				"tipoLlamada": $("#tipoBusqueda").val(),
				  "tipoPersona": $("#tipoPersona :selected").val() ,
				  "cliente": parseInt($("#idCodigo").val()),
				  "pagina": ""
		}
	}
	
        xhr = $.ajax({
			//url:'../json/personas.json',
			url:'/select/rest/json/LocalizaBDP',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cliente),
			type : 'POST',
			dataType: "json", 
			cache: false,
			beforeSend: function() {
				$("#idBuscarCliente").css("color", "#ff2500");
				$(target).data('spinner', spinner);
				$("#idBuscarCliente").prop("disabled", true);
	        },
	        complete: function() {
	        	$(target).data('spinner').stop();
	        	$("#idBuscarCliente").css("color", "#fff");
	        	$("#idBuscarCliente").prop("disabled", false);
	        },
			success:function(data){
				if(data["ERROR"] === undefined){
					if(data["paginacion"] === undefined){
						$("#pager-clientes").hide();
					}
					
					if(data.masDatos == true){
						if(arrPagClientes.length == 0){

							$("#btnPaginaBusqAtras").prop("disabled", true);
						
						}
						$("#pager-clientes").show();
						arrPagClientes.push({"paginacion" : data.paginacion, "masDatos": true});
						$("#btnPaginaBusqSig").prop("disabled", false);
					}
					
					if(tablaClientes != null){
						tablaClientes.clear();
						tablaClientes.rows.add(data.clientes).draw();
					}
					
					//Add selected si solo hay un registro
					if(tablaClientes.page.info().recordsTotal == 1){
						$('#tabla-clientes tbody tr').addClass('selected');
						listaPersona = tablaClientes.row(0).data();
						listaPersonaCartera = tablaClientes.row(0).data();
						$("#idSelCliente").prop("disabled", false);
					}
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
					$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
					$("#myModalERRORTecnico").modal('show');
				}else{
					
				}
			}
		});
	
        return xhr;
}



function iniciaPaginadoresCliente(){
	//PAGINADOR - Adelante - Clientes
	$('#btnPaginaBusqSig').on('click',function(){

		var ajax_cliente = null;
		var target = document.getElementById('btnPaginaBusqSig');
		var spinner = new Spinner(opts).spin(target);
		var pagina = arrPagClientes.length;
		pagina--;
		
		/** Documento **/
		if($("#tipoBusqueda").val() == 2){
			ajax_cliente = {
					//$("#comboTipoDocumento :selected").val()
					  "tipoLlamada": $("#tipoBusqueda").val(),
					  "nDocumento": $("#idDocument").val(),
					  "tDocumento": $("#comboTipoDocumento :selected").val(),
					  "pagina": arrPagClientes[pagina].paginacion
					  
			};
		}
		
		/** Persona Fisica **/
		if($("#tipoBusqueda").val() == 4){
			ajax_cliente = {
					"tipoLlamada": $("#tipoBusqueda").val(),
					 "tLocalizacion": $("#tipoExtensiva").val(),
					 "apellido1": $("#idApellido1").val().toUpperCase(),
					 "apellido2": $("#idApellido2").val().toUpperCase(),
					 "nombre": $("#idNombre").val().toUpperCase(),
					 "pagina": arrPagClientes[pagina].paginacion
					  
			};
		}
		
		/** Persona Juridica **/
		if($("#tipoBusqueda").val() == 6){
			ajax_cliente = {
					"tipoLlamada": $("#tipoBusqueda").val(),  
					  "tLocalizacion": $("#tipoExtensiva").val(),
					  "sociedad": $("#idDenSocial").val().toUpperCase(), 
					  "pagina": arrPagClientes[pagina].paginacion
			}
		}
		
		/** Numero de Persona **/
		if($("#tipoBusqueda").val() == 8){
			ajax_cliente = {
					"tipoLlamada": $("#tipoBusqueda").val(),
					  "tipoPersona": $("#tipoPersona :selected").val() ,
					  "cliente": parseInt($("#idCodigo").val()),
					  "pagina": arrPagClientes[pagina].paginacion
			}
		}
		respBusqueda = $.ajax({
			//url:'../json/personas.json',
			url:'/select/rest/json/LocalizaBDP',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cliente),
			type : 'POST',
			dataType: "json", 
			cache: false,
			beforeSend: function() {
				$("#btnPaginaBusqSig").css("color", "#ff2500");
				$(target).data('spinner', spinner);
				$("#btnPaginaBusqSig").prop("disabled", true);
				$("#btnPaginaBusqAtras").prop("disabled", true);
				
		
	        },
	        complete: function(data) {
	        	$(target).data('spinner').stop();
	        	$("#btnPaginaBusqSig").css("color", "#fff");
	        	
	        	
	        	//IE8
	        	if(data.responseJSON === undefined){
	        		var dataParse = JSON.parse(data.responseText);
	        		
	        		if(dataParse["masDatos"] !== undefined){
						
						$("#btnPaginaBusqSig").prop("disabled", false);
					}
		        	
					
					if(dataParse["masDatos"] === undefined){
						
						$("#btnPaginaBusqSig").prop("disabled", true);
					}
					
					$("#btnPaginaBusqAtras").prop("disabled", false);
					
					$("#idSelCliente").prop("disabled", true);
	        	
	        	}else{
	        		//Otros navegadores
		        	if(data.responseJSON["masDatos"] !== undefined){

						$("#btnPaginaBusqSig").prop("disabled", false);
					}
		        	
					
					if(data.responseJSON["masDatos"] === undefined){
						
						$("#btnPaginaBusqSig").prop("disabled", true);
					}

					$("#btnPaginaBusqAtras").prop("disabled", false);
					
					$("#idSelCliente").prop("disabled", true);
	        	}
	        },
			success:function(data){
				if(data["ERROR"] === undefined){
					
					if(data.masDatos == true){
						arrPagClientes.push({"paginacion" : data.paginacion, "masDatos": true});
					}else{
						arrPagClientes.push({"paginacion" : data.paginacion, "masDatos": false});
					}
					var altoTabla = 90
					if (!$('#panelFormularioBuscar').hasClass('in'))
						altoTabla = 250;
					
					if(tablaClientes != null){
						tablaClientes.clear();
						tablaClientes.rows.add(data.clientes).draw();
					}
					
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
						$("#btnPaginaBusqAtras").prop("disabled", false);
					}
					$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
					$("#myModalERRORTecnico").modal('show');
				}else{
					
				}
			}
		});
		
	});
	
	//PAGINADOR - Atras - Clientes
	$('#btnPaginaBusqAtras').on('click',function(){
		if ($('#btnPaginaBusqAtras').hasClass('disabled')){ // Paa chrome
			return;
		}
		var ajax_cliente = null;
		var target = document.getElementById('btnPaginaBusqAtras');
		var spinner = new Spinner(opts).spin(target);
//		arrPagClientes.pop();
		var pagina = arrPagClientes.length-2;
		pagina--;
		
		var tamArray = arrPagClientes.length;
		
		if(pagina == -1){
		
			/** Documento **/
			if($("#tipoBusqueda").val() == 2){
				ajax_cliente = {
						//$("#comboTipoDocumento :selected").val()
						  "tipoLlamada": $("#tipoBusqueda").val(),
						  "nDocumento": $("#idDocument").val(),
						  "tDocumento": $("#comboTipoDocumento :selected").val(),
						  "pagina": ""
						  
				};
			}
			
			/** Persona Fisica **/
			if($("#tipoBusqueda").val() == 4){
				ajax_cliente = {
						"tipoLlamada": $("#tipoBusqueda").val(),
						 "tLocalizacion": $("#tipoExtensiva").val(),
						 "apellido1": $("#idApellido1").val().toUpperCase(),
						 "apellido2": $("#idApellido2").val().toUpperCase(),
						 "nombre": $("#idNombre").val().toUpperCase(),
						 "pagina": ""
						  
				};
			}
			
			/** Persona Juridica **/
			if($("#tipoBusqueda").val() == 6){
				ajax_cliente = {
						"tipoLlamada": $("#tipoBusqueda").val(),  
						  "tLocalizacion": $("#tipoExtensiva").val(),
						  "sociedad": $("#idDenSocial").val().toUpperCase(), 
						  "pagina": ""
				}
			}
			
			/** Numero de Persona **/
			if($("#tipoBusqueda").val() == 8){
				ajax_cliente = {
						"tipoLlamada": $("#tipoBusqueda").val(),
						  "tipoPersona": $("#tipoPersona :selected").val() ,
						  "cliente": parseInt($("#idCodigo").val()),
						  "pagina": ""
				}
			}
		}
		else{
			/** Documento **/
			if($("#tipoBusqueda").val() == 2){
				ajax_cliente = {
						//$("#comboTipoDocumento :selected").val()
						  "tipoLlamada": $("#tipoBusqueda").val(),
						  "nDocumento": $("#idDocument").val(),
						  "tDocumento": $("#comboTipoDocumento :selected").val(),
						  "pagina": arrPagClientes[pagina].paginacion
						  
				};
			}
			
			/** Persona Fisica **/
			if($("#tipoBusqueda").val() == 4){
				ajax_cliente = {
						"tipoLlamada": $("#tipoBusqueda").val(),
						 "tLocalizacion": $("#tipoExtensiva").val(),
						 "apellido1": $("#idApellido1").val().toUpperCase(),
						 "apellido2": $("#idApellido2").val().toUpperCase(),
						 "nombre": $("#idNombre").val().toUpperCase(),
						 "pagina": arrPagClientes[pagina].paginacion
						  
				};
			}
			
			/** Persona Juridica **/
			if($("#tipoBusqueda").val() == 6){
				ajax_cliente = {
						"tipoLlamada": $("#tipoBusqueda").val(),  
						  "tLocalizacion": $("#tipoExtensiva").val(),
						  "sociedad": $("#idDenSocial").val().toUpperCase(), 
						  "pagina": arrPagClientes[pagina].paginacion
				}
			}
			
			/** Numero de Persona **/
			if($("#tipoBusqueda").val() == 8){
				ajax_cliente = {
						"tipoLlamada": $("#tipoBusqueda").val(),
						  "tipoPersona": $("#tipoPersona :selected").val() ,
						  "cliente": parseInt($("#idCodigo").val()),
						  "pagina": arrPagClientes[pagina].paginacion
				}
			}
		}

		respBusqueda = $.ajax({
			//url:'../json/personas.json',
			url:'/select/rest/json/LocalizaBDP',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cliente),
			type : 'POST',
			dataType: "json", 
			cache: false,
			beforeSend: function() {
				$("#btnPaginaBusqAtras").css("color", "#ff2500");
				$(target).data('spinner', spinner);

				$("#btnPaginaBusqAtras").prop("disabled", true);
				$("#btnPaginaBusqSig").prop("disabled", true);
	        },
	        complete: function(data) {
	        	
	        	$(target).data('spinner').stop();
	        	$("#btnPaginaBusqAtras").css("color", "#fff");
				
				//IE8
	        	if(data.responseJSON === undefined){
	        		var dataParseAtras = JSON.parse(data.responseText);
					if(arrPagClientes.length == 1 && dataParseAtras.masDatos==true){

						$("#btnPaginaBusqAtras").prop("disabled", true);
						
					}
					
					if(arrPagClientes.length > 1 && dataParseAtras.masDatos==true){
						$("#btnPaginaBusqAtras").prop("disabled", false);
					}
					
					$("#idSelCliente").prop("disabled", true);
	        	}else{
	        		//Otros navegadores
	        		if(arrPagClientes.length == 1 && data.responseJSON.masDatos==true){

						$("#btnPaginaBusqAtras").prop("disabled", true);
						
					}
					
					if(arrPagClientes.length > 1 && data.responseJSON.masDatos==true){
						$("#btnPaginaBusqAtras").prop("disabled", false);
					}
					
					$("#idSelCliente").prop("disabled", true);
	        	}
	        },
			success:function(data){
				if(data["ERROR"] === undefined){
					
					$("#btnPaginaBusqSig").prop("disabled", false);
					if(arrPagClientes.length == 1 && data.masDatos==true){

						$("#btnPaginaBusqAtras").prop("disabled", true);
						
					}
					
					if(arrPagClientes.length > 1 && data.masDatos==true){
						
						$("#btnPaginaBusqAtras").prop("disabled", false);
					}
					
					if(tablaClientes != null){
						tablaClientes.clear();
						tablaClientes.rows.add(data.clientes).draw();
					}
					
					arrPagClientes.pop();
				}else{
					if($("#myModalBuscar").hasClass('in')){
						$("#mensajeError").html(data.ERROR_MSG);
						$("#myModalERROR").modal('show');
					}
				}
				
			},
			error: function(xhr, status, error) {
				
				
				if($("#myModalBuscar").hasClass('in')){
					
					$("#btnPaginaBusqAtras").prop("disabled", false);
					if(arrPagClientes[arrPagClientes.length-1].masDatos == true ){
						$("#btnPaginaBusqSig").prop("disabled", false);
					}
					$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
					$("#myModalERRORTecnico").modal('show');
				}
			}
		});
		
	});

}

