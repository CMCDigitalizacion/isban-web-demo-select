/*
 * necesario importar
 * 	<script src="/select/front/js/hashtable.js"></script> 
	<script src="/select/front/js/jquery.numberformatter-1.2.4.jsmin.js"></script>
 */

var intervSel = null;
var carteraSel = "";
var documentoRetirada = "";
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

var widthPantallaRetirada = 0;

function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		success : function(data) {
			$("body").append(data);
		},
		dataType : "html"
	});
}
	
function cargarModalInfo(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		success : function(data) {
			$("body").append(data);
			$("#mensajeInfo").html("Atención, el importe neto final puede no ajustarse al importe solicitado según la variación de mercado del fondo");
			$("#myModalInfo").modal('show');
		},
		dataType : "html"
	});
}
	
function isEmpty(){
	return ($(this).val().length <= 0);

}

$(document).ready(function(){
	
	var wRetirada = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	 resolucionPantallaRetirada(wRetirada);
	 
	 $( window ).resize(function() {
		 widthPantallaRetirada = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		 resolucionPantallaRetirada(widthPantallaRetirada);
	 });
	 
		$("#idImporte").prop("disabled", true);
		$("#idCuentaOri").prop("disabled", true);
		$("#idLupaCuentaOri").prop("disabled", true);
		$("#idLupaCuentaOri > span").removeClass();
		$("#idLupaCuentaOri > span").addClass("lupaDisabled");
		
		$("#idConfirmar").prop("disabled", true);
		$("#idImprimir").prop("disabled", true);
		
		
		
		$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Retirada&tipoCab=3", function(data){
		    $("#cabCartera").prepend(data);
		    iniciaCabecera();
		});
		
		cargarModalLocCarteras("LocalizarCarteras12.html");
		cargarModalLocCuentas("BuscarCuentas12Mod.html");
		
		$("#idBuscarCarteras").on("click", function(e){
	    	$("#idSelCartera").prop("disabled", true);
	    	$("#panelFormularioBuscarCarteras").collapse('show');
			$("#idCuentaOri").val("");
	    	$("#localizador-cart-form").get(0).reset();
			
		});
		
		
		
		
		cargarModal("Error.html");
		cargarModalInfo("Info.html");
		cargarModal("ErrorServidor.html");
		
		$("#idImporte").on("change", function(){
			if($("#idCuentaOri").val().length == 0){
				$("#idConfirmar").prop("disabled", true);
			} else {
				$("#idConfirmar").prop("disabled", false);
			}
		});
		$("#idCuentaOri").on("change", function(){
			if($("#idImporte").val().length == 0){
				$("#idConfirmar").prop("disabled", true);
			} else {
				$("#idConfirmar").prop("disabled", false);
			}
		});
		
		$("#idCancelar").on("click", function(){
			$("#idImporte").val("");
			$("#idCuentaOri").val("");
		});
		
		
		$("#idLupaCuentaOri").on("click", function(e){
			carteraSel = $("#idCartera").val();
//			selCuentasRetirada(carteraSel);
			setCarteraAportacion(carteraSel);
			abrirModalCuentasSiga($("#idCartera").val());
			
		});
	
		
		
		
		/** Validacion de campo Importe **/
		$('#retirada-form')
	    .formValidation({
	        framework: 'bootstrap',
	        icon: {
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	importe: {
	                // The messages for this field are shown as usual
	                validators: {
	                    notEmpty: {
	                    	enabled: false,
	                        message: 'El importe es obligatorio'
	                    },
	                    regexp: {
	                        regexp:  /^[1-9][0-9]{0,2}(?:\.?[0-9]{3}){0,3}(,[0-9]{1,2})?$/,
	                        message: 'El importe no es válido. Formato: NNN.NNN,DD'
	                    }
	                }
	            },
	            cuenta:{
	            	validators: {
	                    notEmpty: {
	                    	enabled: true,
	                        message: 'La cuenta es obligatoria'
	                    }
	            	}
	            }
	        }
	    });
			
		
	});
	
	
	/** Modificar importe y añadirle puntos **/
	$('#idImporte').blur(function() {	
		
		if($("#idCuentaOri").val()!=""){
			$('#retirada-form').formValidation('enableFieldValidators', 'importe', true, 'notEmpty');
			$('#retirada-form').formValidation('enableFieldValidators', 'importe', true, 'regexp');
			  var importe =  $(this).val();  
			  importe = $.parseNumber(importe, {format:"#,###.##", locale:"es"});
			  var importeStr = $.formatNumber(importe, {format:"#,###.##", locale:"es"});
			  $('#idImporte').val(importeStr);
			  
			  $("#retirada-form").formValidation('updateStatus', 'importe', 'NOT_VALIDATED').
			  formValidation('validateField', 'importe');
			  
			  if($('#retirada-form').data('formValidation').isValidField('importe')){
				  
				  if($("#idCuentaOri").val().length == 0){
						$("#idConfirmar").prop("disabled", true);
					} else {
						$("#idConfirmar").prop("disabled", false);
					}
				  
			  }else{
				  $("#idConfirmar").prop("disabled", true);
			  }
		}else{
			$('#retirada-form').formValidation('enableFieldValidators', 'importe', false, 'notEmpty');
			$('#retirada-form').formValidation('enableFieldValidators', 'importe', false, 'regexp');
			$('#retirada-form').formValidation('resetForm', true);
			
		}
	});
	
	$("#idConfirmar").on("click", function(){
		var target = document.getElementById('idConfirmar');
		var spinner = new Spinner(opts).spin(target);
		if($("#idCuentaOri").val() == ""){
			$("#mensajeError").html("Cuenta Vacía");
			$("#myModalERROR").modal('show');
		}
		var importe = $.parseNumber($("#idImporte").val(), {format:"#,###.##", locale:"es"});
		var ajax_retirada = {
				"cartera": $("#idCartera").val(),
				"divisa": $("#idDivisaRef").val(),
				"importe": importe,
				"cuenta": cuentaDestino
		}
		$.ajax({
			url : "/select/rest/json/Retirada",
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_retirada),
			type : 'POST',
			dataType: "json", 
			cache: false,
			beforeSend: function() {
				$("#idConfirmar").css("color", "#ff2500");
				$(target).data('spinner', spinner);
				$("#idConfirmar").prop("disabled", true);
	        },
	        complete: function() {
	        	$(target).data('spinner').stop();
	        	$("#idConfirmar").css("color", "#fff");
	        	$("#idConfirmar").prop("disabled", false);
	        },
			success : function(data) {
				if(data["ERROR"] === undefined){
					if(data.realizada == true){
//						document.getElementById("retirada-form").reset();
						$("#mensajeAlta").html(data.mensaje);
						$("#myModalOK").modal('show');
						
						documentoRetirada = data.documento;
					} else {
						$("#mensajeInfo").html(data.mensaje);
						$("#myModalInfo").modal('show');
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
		
		
		
});
	
/** Eliminar cuenta **/
$("#idBorrarCuentaOri").bind("click", function(){
		$("#idCuentaOri").val("");
		$("#idImporte").val("");
		$("#idBorrarCuentaOri").hide();
		$('#retirada-form').formValidation('resetForm', true);
		
		$("#idImporte").prop("disabled", true);
		
		$("#idConfirmar").prop("disabled", true);
		
});

$("#idBtnAceptar").bind("click", function(){
	$("#myModalOK").modal('hide');
	
	if(documentoRetirada!=""){
		$("#idImprimir").prop("disabled", false);
		$("#").prop("disabled", true);
		$("#idLupaCuentaOri > span").removeClass();
		$("#idLupaCuentaOri > span").addClass("lupaDisabled");
		
		$("#idConfirmar").prop("disabled", true);
		$("#idImporte").prop("disabled", true);
		$("#idBorrarCuentaOri").hide();
		window.open(documentoRetirada);
		
	}else{
		$("#idImprimir").prop("disabled", true);
		$("#idLupaCuentaOri").prop("disabled", true);
		$("#idLupaCuentaOri > span").removeClass();
		$("#idLupaCuentaOri > span").addClass("lupaDisabled");
		
		$("#idConfirmar").prop("disabled", true);
		$("#idImporte").prop("disabled", true);
		//$("#idBorrarCuentas").prop("disabled", true);
		$("#idBorrarCuentaOri").hide();
		
		
	}
});

function confirmarOKModal(){
$("#myModalOK").modal('hide');
	
	if(documentoRetirada!=""){
		$("#idImprimir").prop("disabled", false);
		$("#idLupaCuentaOri").prop("disabled", true);
		$("#idBorrarCuentaOri").prop("disabled", true);
		$("#idLupaCuentaOri > span").removeClass();
		$("#idLupaCuentaOri > span").addClass("lupaDisabled");
		$("#idBorrarCuentaOri > span").removeClass();
		$("#idBorrarCuentaOri > span").addClass("removeDisabled");
		
		$("#idConfirmar").prop("disabled", true);
		$("#idImporte").prop("disabled", true);
		window.open(documentoRetirada);
		
	}else{
		$("#idImprimir").prop("disabled", true);
		$("#idLupaCuentaOri").prop("disabled", true);
		$("#idBorrarCuentaOri").prop("disabled", true);
		$("#idLupaCuentaOri > span").removeClass();
		$("#idLupaCuentaOri > span").addClass("lupaDisabled");
		$("#idBorrarCuentaOri > span").removeClass();
		$("#idBorrarCuentaOri > span").addClass("removeDisabled");
		
		$("#idConfirmar").prop("disabled", true);
		$("#idImporte").prop("disabled", true);
		$("#idBorrarCuentas").prop("disabled", true);
		
		
	}
}

$("#idImprimir").bind("click", function(){
	if(documentoRetirada!=""){
		window.open(documentoRetirada);
	}
});

//Evento ENTER
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
	    	     
	    	     //Si la retirada es correcta se abre la siguiente pantalla
	    	     confirmarOKModal();
	    	     
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
		    	confirmarENTER();
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
	    
	    if($("#myModalInfo").hasClass('in')){
	    	
    		$("#idBtnAceptarInfo").focus();
    	     e.preventDefault();
    	     $("#myModalInfo").modal('hide');
    	     
    	
	    }
	}
    
	
});

function confirmarENTER(){
	if($("#idCuentaOri").val() == ""){
		$("#mensajeError").html("Cuenta Vacía");
		$("#myModalERROR").modal('show');
	}
	var importe = $.parseNumber($("#idImporte").val(), {format:"#,###.##", locale:"es"});
	var ajax_retirada = {
			"cartera": $("#idCartera").val(),
			"divisa": $("#idDivisaRef").val(),
			"importe": importe,
			"cuenta": cuentaDestino
	}
	$.ajax({
		url : "/select/rest/json/Retirada",
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_retirada),
		type : 'POST',
		dataType: "json", 
		cache: false,
		success : function(data) {
			if(data["ERROR"] === undefined){
				if(data.realizada == true){
					document.getElementById("retirada-form").reset();
					$("#myModalOK").html(data.mensaje);
					$("#myModalOK").modal('show');
					
					documentoRetirada = data.documento;
				} else {
					$("#mensajeInfo").html(data.mensaje);
					$("#myModalInfo").modal('show');
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

function cargarModalLocCarteras(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		dataType : "html",
		complete: function(){
			iniciaBotonesCarterasModal();
			iniciaCombosCartera();
			iniciaTablaCarteras();
			iniciaFormularioCarteras();
			selCarteraRetirada();
			$("#myModalCarteras").on("shown.bs.modal", function (event) {
				tablaCarteras.columns.adjust().draw();
			 });
		},
		success : function(data) {
			$("body").append(data);
			
		}
		
	});
}

function cargarModalLocCuentas(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		dataType : "html",
		complete: function(){
			iniciaTablasCuentasMod();
			selCuentasRetirada(carteraSel);
			
			$("#myModalCuentasMod").on("shown.bs.modal", function (event) {
				if(tablaCuentasMod != null)
					tablaCuentasMod.columns.adjust().draw();
				
				if(tablaLocIntervinentesMod!=null)
					tablaLocIntervinentesMod.columns.adjust().draw();
				
				//$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
			 });
		},
		success : function(data) {
			$("body").append(data);
			
		}
		
	});
}

function resolucionPantallaRetirada(anchoRetirada){
	if(anchoRetirada <= 1024){
		$("#divImporteCancelar").removeClass("col-sm-1");
		$("#divImporteCancelar").addClass("col-sm-2");
		
	}else{
		$("#divImporteCancelar").removeClass("col-sm-2");
		$("#divImporteCancelar").addClass("col-sm-1");

	}
}