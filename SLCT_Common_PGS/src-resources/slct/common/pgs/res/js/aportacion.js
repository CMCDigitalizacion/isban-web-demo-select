/**
 * 
 */

var listaPersona = null;
var tablaActivos = null;
var tablaValores = null;
var listaActivos = null;
var listaValores = null;
var tipoCartera = null;
var documentoImprimir = null;
var aportacionFin = false;
var aportacionOKBool = false;
var clienteCuenta = null;
var widthPantallaAportacion = 0;

var opts = {
		  lines: 11,
		  length: 3,
		  width: 2,
		  radius:4,
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
	       top: '50%', // Top position relative to parent in px
	       left: '50%', // Left position relative to parent in px
		  color: '#FFFFFF'
		};
/*
 * necesario importar
 * 	<script src="/select/front/js/hashtable.js"></script> 
	<script src="/select/front/js/jquery.numberformatter-1.2.4.jsmin.js"></script>
 */

$(document).ready(function(){	
	
	cargarModal("ErrorServidor.html");
	cargarModal("Error.html");
	$("#idFinalizar").prop("disabled", true);
	$("#idImporte").prop("disabled", true);
	
	var wAportacion = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	 resolucionPantallaAportacion(wAportacion);
	 
	 $( window ).resize(function() {
		 widthPantallaAportacion = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		 resolucionPantallaAportacion(widthPantallaAportacion);
	 });
	
	/** Se muestra la seleccion de carteras **/
	if(cartera==""){
		$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Datos&tipoCab=1", function(data){
		    $("#cabeceraLocCarteras").prepend(data);
		    $("body").show();
		    iniciaCabecera();
		});
		cargarModalLocCarteras("LocalizarCarteras12.html");
		
		cargarModal("Error.html");
		
		
		
//		$("#activosMismaTitularidad").hide();
//		$("#rowEfectivo").hide();
		$("#myContainer").show();
		$("#rowCabCarteras").show();
		$("#cabeceraLocCarteras").show();
		
	}else{
		
		//Mostramos el check de Nueva CCV
		$("#rowCCV").show();
		$("#valoresHead").show();
		$("#cabeceraLocCarteras").hide();
		$("#myContainer").show();
		$("#rowCabCarteras").show();
		$("#rowEfectivo").show();
		
		$("#footerFinalizar").show();
		var ajax_cartera_selec = {
				"consulta": "CAB",
				"cartera": cartera
		};
		
		
			$.ajax({
				//url:'../json/personas.json',
				url:'/select/rest/json/Cartera',
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(ajax_cartera_selec),
				type : 'POST',
				dataType: "json", 
				cache: false,
				complete: function(){
					
				},
				success:function(data){
					if(data["ERROR"] === undefined){
						//Con los datos de cartera se puede llamar al servicio de Intervienites
					}else{
						$("#mensajeError").html(data.ERROR_MSG);
						$("#myModalERROR").modal('show');
					}
					
				},
				error: function(xhr, status, error) {
				     alert(xhr.status);
				}
			});
		}
	
	cargarModalLocCuentas("BuscarCuentas12Mod.html");
	
	//$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
	
	if(importeMinimo == ""){
		$(".noImporte").hide();
	}else{
		$("#idTotalEstimado").val(importeMinimo);
	}
		
	
	
	
	
	$("#idLocCuentas").on("click", function(e){	
		if(cartera == ""){
			abrirModalCuentasSiga($("#idCartera").val());
			setCarteraAportacion($("#idCartera").val());
		}else{
			abrirModalCuentasSiga(cartera);
			selCuentasAportacion(cartera);
		}
		
	});
	
	tablaActivos = $('#tabla-activos').DataTable( {
		"sScrollY" : 90,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy: true,
		paging: false, 
		searching: false,
	    ordering:  false,
	    info: false,
	    "aaData" : "",
        "columns": [
            { "data": "descripcion" },
            { "data": "valoracion" },
            { "data": "participaciones" },
            { "data": "cuenta" ,"visible" : false,"searchable" : false},
            { "data": "divisa" ,"visible" : false,"searchable" : false},
            { "data": "saldo"  ,"visible" : false,"searchable" : false},
            { "data": "empresa","visible" : false,"searchable" : false },
            { "data": "centro" ,"visible" : false,"searchable" : false},
            { "data": "producto" ,"visible" : false,"searchable" : false},
            { "data": "contrato" ,"visible" : false,"searchable" : false},
            { "data": "control" ,"visible" : false,"searchable" : false},
            { "data": "participaciones","visible" : false,"searchable" : false }
        ],
        "language": {
	        "emptyTable":     "No hay registros "
	    }
    });
		
		$('#tabla-activos tbody').on('click','tr',function() {
			
			
			if(aportacionFin == false){
					listaActivos = tablaActivos.row(this).data();
				if(listaActivos == null){
					$(this).removeClass('selected');
				}else{
					if($("#idImporte").val()!= ""){
						$("#idFinalizar").prop("disabled", false);
					}
					if ($(this).hasClass('selected')) { // Si deshabilitamos
						$(this).removeClass('selected');
						if(tablaValores.rows('.selected').data().length ==  0 && tablaActivos.rows('.selected').data().length==0 && $("#idImporte").val()==""  ){
								$("#idFinalizar").prop("disabled", true);
						}
						else{
							if ($("#idCuentaOri").val() != "" && $("#idImporte").val()=="")
								$("#idFinalizar").prop("disabled", true);
						}
						
						
					} else {
						$(this).addClass('selected');
						if ($("#idCuentaOri").val() == "")
							$("#idFinalizar").prop("disabled", false);
				
					}
				}
				$("#idTotalAcumulado").val(updateImporteAcumulado()) ;
			}else{
				
			}
		});
		
		
		tablaValores = $('#tabla-valores').DataTable( {
			"sScrollY" : 90,
			"scrollX" : true,
			"sScrollXInner" : "100%",
			destroy: true,
			paging: false, 
			searching: false,
		    ordering:  false,
		    info: false,
		    "aaData" : "",
	        "columns": [
	            { "data": "descripcion" },
	            { "data": "valoracion" },
	            { "data": "participaciones" },
	            { "data": "cuenta" ,"visible" : false,"searchable" : false},
	            { "data": "divisa" ,"visible" : false,"searchable" : false},
	            { "data": "saldo"  ,"visible" : false,"searchable" : false},
	            { "data": "empresa","visible" : false,"searchable" : false },
	            { "data": "centro" ,"visible" : false,"searchable" : false},
	            { "data": "producto" ,"visible" : false,"searchable" : false},
	            { "data": "contrato" ,"visible" : false,"searchable" : false},
	            { "data": "control" ,"visible" : false,"searchable" : false},
	            { "data": "participaciones","visible" : false,"searchable" : false },
	            { "data": "sccc","visible" : false,"searchable" : false }
	        ],
	        "language": {
		        "emptyTable":     "No hay registros "
		    }
	    });
		
		
		$('#tabla-valores tbody').on('click','tr',function() {
			
			if(aportacionFin == false){
				listaValores = tablaValores.row(this).data();
				if(listaValores == null || $("input[name='checkbox']").is(':checked')){
					$(this).removeClass('selected');
				}else{
					if($("#idImporte").val()!= ""){
						$("#idFinalizar").prop("disabled", false);
					}
					if ($(this).hasClass('selected')) { // Si deshabilitamos
						$(this).removeClass('selected');
						if(tablaValores.rows('.selected').data().length ==  0 && tablaActivos.rows('.selected').data().length==0 && $("#idImporte").val()==""  ){
								$("#idFinalizar").prop("disabled", true);
						}
						else{
							if ($("#idCuentaOri").val() != "" && $("#idImporte").val()=="")
								$("#idFinalizar").prop("disabled", true);
						}
					} else {
						$("#tabla-valores tbody tr").removeClass('selected');
						$(this).addClass('selected');
						$("#idFinalizar").prop("disabled", false);
					
					}
				}
				$("#idTotalAcumulado").val(updateImporteAcumulado()) ;
			}else{
				
			}
		});
		
		if(cartera!=""){
			ajaxAportacion(cartera , tipo);
		}
		
		
		/** Validacion de campo Importe **/

		$('#efectivo-form')
	    .formValidation({
	        framework: 'bootstrap',
	        icon: {
//	            valid: 'glyphicon glyphicon-ok',
//	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	importe: {
	                // The messages for this field are shown as usual
	                validators: {
	                	notEmpty: {
	                        message: 'El importe es obligatorio'
	                    }
	                }
	            }
	        }
	    }).on('keyup', '[name="importe"]', function(e){
	    	$("#idFinalizar").prop("disabled", true);
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
			    	     if(aportacionOKBool == true){
			    	    	 AportacionOKEnter();
			    	     }	
					}
			    	
			    }else if(!($("#idFinalizar").is(":disabled"))){
			    	if($("#myModalERROR").hasClass('in')){
				    	
			    		$("#idBtnAceptarError").focus();
			    	     e.preventDefault();
			    	     $("#myModalERROR").modal('hide');
			    	     
			    	
				    }else if($("#myModalERRORTecnico").hasClass('in')){
					    	
				    		$("#idBtnAceptarErrorServidor").focus();
				    	     e.preventDefault();
				    	     $("#myModalERRORTecnico").modal('hide');
				    	     
				    	
					}else{
						$("#idFinalizar").focus();
				    	e.preventDefault();
				    	finalizarEnter();
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
});

function calculoTotal(importe, listaVals){
	var total = importe;
	var valor = 0;
	for(obj in listaVals){
		valor = obj["valoracion"].substring(0, obj["valoracion"].length-1);
		valor = valor.replace(/\./g,'');
		total =+ parseFloat(valor.replace(',', '.'));
	}
	
	$("#idTotalEstimado").val(total);
}
	
	
$("#idImprimir").bind("click", function(e){
	$("#idConfirmar").prop('disabled', false);
});

/** Modificar importe y añadirle puntos **/
$('#idImporte').blur(function() {
	  var importe =  $(this).val();  
	  importe = $.parseNumber(importe, {format:"#,###.##", locale:"es"});
	  var importeStr = $.formatNumber(importe, {format:"#,###.##", locale:"es"});
	  $('#idImporte').val(importeStr);
	  
	  $("#efectivo-form").formValidation('updateStatus', 'importe', 'NOT_VALIDATED').
	  formValidation('validateField', 'importe');
	  
	  if($('#efectivo-form').data('formValidation').isValidField('importe')){
		  if($("#idCuentaOri").val() == ""){
			  $("#idFinalizar").prop("disabled", true);
		  } else {
			  $("#idFinalizar").prop("disabled", false);
		  }
	  }else if(listaValores == null && listaActivos == null){
		  $("#idFinalizar").prop("disabled", true);
	  }
	  
	  
		$("#idTotalAcumulado").val(updateImporteAcumulado()) ;
});



function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		dataType : "html",
		success : function(data) {
			$("body").append(data);
			
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
			
			selCarteraAportaciones();
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
			selCuentasAportacion($("#idCartera").val());
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

/**
 * Cliente seleccionado desde el modal de buscar cuentas.
 * Se llama desde buscarCuentas.js dentro de selCuentasAportacion(...).
 * @param numero
 * @param tipoPersona
 */
function setClienteCuenta(numero, tipoPersona){
	clienteCuenta = new Object();
	clienteCuenta.codigo = numero;
	clienteCuenta.tipoPers = tipoPersona;

}


$("input[type='checkbox']").click(function() {
	$('#tabla-valores tbody tr.selected').removeClass("selected");
});

function ajaxAportacion(codCartera,tipo){
	//Se inicializa la pantalla con la llamada al servicio Aportacion
	var ajax_aportacion = {
			"cartera": codCartera,
			"operacion":"CON",
			"tipo":tipo
	};
	$.ajax({
		//url:'/select/front/json/activos.json',
		url:'/select/rest/json/Aportaciones',
		type: "POST", 
		dataType: "json", 
		data : JSON.stringify(ajax_aportacion),
		contentType: "application/json; charset=utf-8",
		cache: false,
		complete: function(){
			if($("body").is(":hidden")){
				$("body").show();
				tablaValores.columns.adjust().draw();
				tablaActivos.columns.adjust().draw();
				
				//$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
			}
			tablaValores.columns.adjust().draw();
			tablaActivos.columns.adjust().draw();
			
		},
		success:function(data){				
			if(data["ERROR"] === undefined){
				$("#idImporte").val(data.importeMin);
				tipoCartera = data.tCartera;
				
				if(data["activos"] !== undefined || data["valores"]!== undefined){
					$("#activosMismaTitularidad").show();
				}
				
				if(data["activos"]!== undefined ){
					$("#activosHead").show();
					$("#tabla-activos").show();
					$("#idImporte").val(data.importeMin);
					
					
					tablaActivos.clear();
					tablaActivos.rows.add(data.activos).draw();
					
					    
				   
				}else{
					tablaActivos.clear().draw();
					$(".espacio").hide();
					$("#rowActivos").hide();
					$("#activosHead").hide();
					$("#tabla-activos").hide();
					$("#activosHead").hide();
				}
				
				if(data["valores"]!== undefined){
					$("#valoresHead").show();
					$("#tabla-valores").show();
					$("#rowCCV").show();
					
					
					tablaValores.clear();
					tablaValores.rows.add(data.valores).draw();
				
					
					
				}else{
					tablaValores.clear().draw();
					$("#rowValores").hide();
					$("#valoresHead").hide();
					$("#tabla-valores").hide();
					$("#valoresHead").hide();
					$("#rowCCV").hide();
				}
				
				if(data["valores"]!== undefined && data["valores"].length == 0){
					$("#valoresHead").show();
					$("input[name='checkbox']").prop('disabled', true);
					$("input[name='checkbox']").prop('checked', true);
					$("#idFinalizar").prop("disabled", false);
				}
					
			}else{
				$("#activosMismaTitularidad").hide();
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


function finalizarEnter(){
	var target = document.getElementById('idFinalizar');
	var spinner = new Spinner(opts).spin(target);
	var carteraFin = "";
	if(cartera==""){
		//Aportaciones Adicionales(Desde la lupa)
		carteraFin = $("#idCartera").val();
		var ajax_finalizar = {
				"cartera": carteraFin,
				"operacion": "ALTA",
				"importeMinimo":importeMinimo,
				"" : $("input[type='checkbox'][name='checkbox']:checked").val()
		};
	}else{
		carteraFin = cartera;
		var ajax_finalizar = {
				"cartera": carteraFin,
				"operacion": "ALTA",
				"importeMinimo":importeMinimo,
				"datosResguardo" : resguardo
		};
	}
	
	
	var cuentaEfectivoLoc = cuentaSeleccionada();
	if (cuentaEfectivoLoc != null){

		var efectivo = {
				"importe": $('#idImporte').parseNumber({format:"#,###.##", locale:"es"}, false),
				"cuenta": {
				    "empresa":cuentaEfectivoLoc.empresa,
				    "centro": cuentaEfectivoLoc.centro,
				    "producto": cuentaEfectivoLoc.producto,
				    "contrato": cuentaEfectivoLoc.contrato,
				    "control": cuentaEfectivoLoc.control,
				    "sccc": cuentaEfectivoLoc.sccc
					},
				"cliente": clienteCuenta
			};
		ajax_finalizar.efectivo = efectivo;
	}

	ajax_finalizar.activos = filasSelActivos();
	ajax_finalizar.valores = filasSelValores();
	
	$.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Aportaciones',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_finalizar),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#idFinalizar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idFinalizar").prop("disabled", true);
			deshabilitaAportaciones();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idFinalizar").css("color", "#fff");
        	$("#idFinalizar").prop("disabled", false);
        	habilitaAportaciones();
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				//Con los datos de cartera se puede llamar al servicio de Intervienites
				if(data.modificacion == true){
					aportacionOKBool = true;
					documentoImprimir = data.documento;
					$("#myModalOK").modal('show');
					$("#mensajeAlta").html(data.mensaje);
				}else{
					
					$("#myModalERROR").modal('show');
					$("#mensajeError").html(data.mensaje);
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

/** FINALIZAR **/
$("#idFinalizar").bind('click', function(){
	var target = document.getElementById('idFinalizar');
	var spinner = new Spinner(opts).spin(target);
	var carteraFin = "";
	if(cartera==""){
		//Aportaciones Adicionales(Desde la lupa)
		carteraFin = $("#idCartera").val();
		var ajax_finalizar = {
				"cartera": carteraFin,
				"operacion": "ALTA",
				"importeMinimo":importeMinimo
		};
	}else{
		carteraFin = cartera;
		var ajax_finalizar = {
				"cartera": carteraFin,
				"operacion": "ALTA",
				"importeMinimo":importeMinimo,
				"datosResguardo" : resguardo,
				"ccv": false
		};
		
		if( $("input[name='checkbox']").is(':checked')){
			ajax_finalizar.ccv = true;
		}
	}
	
	
	var cuentaEfectivoLoc = cuentaSeleccionada();
	if (cuentaEfectivoLoc != null){

		var efectivo = {
				"importe": $('#idImporte').parseNumber({format:"#,###.##", locale:"es"}, false),
				"cuenta": {
				    "empresa":cuentaEfectivoLoc.empresa,
				    "centro": cuentaEfectivoLoc.centro,
				    "producto": cuentaEfectivoLoc.producto,
				    "contrato": cuentaEfectivoLoc.contrato,
				    "control": cuentaEfectivoLoc.control,
				    "sccc": cuentaEfectivoLoc.sccc
					},
					"cliente": clienteCuenta
			};
		ajax_finalizar.efectivo = efectivo;
	}

	ajax_finalizar.activos = filasSelActivos();
	ajax_finalizar.valores = filasSelValores();
	
	$.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Aportaciones',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_finalizar),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$("#idFinalizar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idFinalizar").prop("disabled", true);
			deshabilitaAportaciones();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idFinalizar").css("color", "#fff");
        	$("#idFinalizar").prop("disabled", false);
        	habilitaAportaciones();
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				//Con los datos de cartera se puede llamar al servicio de Intervienites
				if(data.modificacion == true){
					aportacionOKBool = true;
					documentoImprimir = data.documento;
					$("#myModalOK").modal('show');
					$("#mensajeAlta").html(data.mensaje);
				}else{
					
					$("#myModalERROR").modal('show');
					$("#mensajeError").html(data.mensaje);
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

/** Funcion que recoge los registros seleccionados de la tabla de Activos **/
function filasSelActivos(){
	var listaSeleccionAct = [];
	var activosSelect = tablaActivos.rows('.selected').data();	
	var datosActivo ;
	
	for(var i=0; i < tablaActivos.rows('.selected').data().length; i++ ){
		datosActivo = {
				 "descripcion": "",
		         "valoracion": "",
		         "participaciones":"",
		         "cuenta":"",
		         "divisa":"",
		         "saldo":"",
		         "empresa":"",
		         "centro":"",
		         "producto":"",
		         "contrato":"",
		         "control":"",
		};
		
		datosActivo.descripcion = activosSelect[i].descripcion;
		datosActivo.valoracion = activosSelect[i].valoracion;
		datosActivo.participaciones = activosSelect[i].participaciones;	
		datosActivo.control = activosSelect[i].control;
		datosActivo.divisa = activosSelect[i].divisa;
		datosActivo.centro = activosSelect[i].centro;
		datosActivo.empresa = activosSelect[i].empresa;
		datosActivo.producto = activosSelect[i].producto;
		datosActivo.cuenta = activosSelect[i].cuenta;
		datosActivo.saldo = activosSelect[i].saldo;
		datosActivo.contrato = activosSelect[i].contrato;	
		listaSeleccionAct.push(datosActivo);

	}
	
	return listaSeleccionAct;
}


/** Funcion que recoge los registros seleccionados de la tabla de Valores **/
function filasSelValores(){
	var listaSeleccionVal = [];
	var activosSelect = tablaValores.rows('.selected').data();
	var datosActivo ;
	
	for(var i=0; i < tablaValores.rows('.selected').data().length; i++ ){
		datosActivo = {
				 "descripcion": "",
		         "valoracion": "",
		         "participaciones":"",
		         "cuenta":"",
		         "divisa":"",
		         "saldo":"",
		         "empresa":"",
		         "centro":"",
		         "producto":"",
		         "contrato":"",
		         "control":"",
		         "sccc":""
		};
		
		datosActivo.descripcion = activosSelect[i].descripcion;
		datosActivo.valoracion = activosSelect[i].valoracion;
		datosActivo.participaciones = activosSelect[i].participaciones;
		datosActivo.control = activosSelect[i].control;
		datosActivo.divisa = activosSelect[i].divisa;
		datosActivo.centro = activosSelect[i].centro;
		datosActivo.empresa = activosSelect[i].empresa;
		datosActivo.producto = activosSelect[i].producto;
		datosActivo.cuenta = activosSelect[i].cuenta;
		datosActivo.saldo = activosSelect[i].saldo;
		datosActivo.contrato = activosSelect[i].contrato;	
		datosActivo.sccc = activosSelect[i].sccc;
		listaSeleccionVal.push(datosActivo);
	
	}
	
	return listaSeleccionVal;
}



function updateImporteAcumulado(){
	var importeAcumulado = 0;
	var valores = tablaValores.rows('.selected').data();
	var activos = tablaActivos.rows('.selected').data()
	for(var i=0; i < activos.length; i++ )
		importeAcumulado += parseFloat( $.parseNumber(activos[i].valoracion, {format:"#,###.##", locale:"es"}));
	for(var i=0; i < valores.length; i++ )
		importeAcumulado += parseFloat( $.parseNumber(valores[i].valoracion, {format:"#,###.##", locale:"es"}));
	/*
	var importe = $('#idImporte').parseNumber({format:"#,###.##", locale:"es"}, false);
	if (importe  > 0)
		importeAcumulado = +  importe;
	*/
	var importeAcumuladoStr = $.formatNumber(importeAcumulado, {format:"#,##0.##", locale:"es"});
	
	return importeAcumuladoStr;
}


/** Eliminar cuenta **/
$("#idBorrarCuentas").bind("click", function(){
	$("#idCuentaOri").val("");
	$("#idBorrarCuentas").hide();
	$('#efectivo-form').formValidation('resetForm', true);
	cuentaAportacion= null;
	$("#idImporte").val("");
	$("#idImporte").prop("disabled", true);
	if(tablaValores.rows('.selected').data().length ==  0 && tablaActivos.rows('.selected').data().length==0 && 
			$("#idImporte").val()==""){
		$("#idFinalizar").prop("disabled", true);
	}else {
		$("#idFinalizar").prop("disabled", false);
	}
	
	

});

function AportacionOKEnter(){
	aportacionOKBool = false;
	//Abrimos una pagina nueva con el documento a Imprimir
	//y bloqueamos todos los campos de la pantalla.
	//Solo podemos pulsar el localizador de carteras y seleccionar una
	//nueva cartera.
	$("#myModalOK").modal('hide');
	$("#checkbox").prop("disabled", true);
	$("#idFinalizar").prop("disabled", true);
	$("#idLocCuentas").prop("disabled", true);
	$("#idLocCuentas > span").removeClass();
	$("#idLocCuentas > span").addClass("lupaDisabled");
	$("#idImporte").prop("disabled", true);
	$("#idBorrarCuentas").prop("disabled", true);
	$("#idBorrarCuentas > span").removeClass();
	$("#idBorrarCuentas > span").addClass("removeDisabled");
	aportacionFin = true;
	if(documentoImprimir!=""){
		$("#idImprimirApor").prop("disabled", false);
		window.open(documentoImprimir);
	}else
		$("#idImprimirApor").prop("disabled", true);
}

$("#idBtnAceptar").bind("click", function(){
	//Abrimos una pagina nueva con el documento a Imprimir
	//y bloqueamos todos los campos de la pantalla.
	//Solo podemos pulsar el localizador de carteras y seleccionar una
	//nueva cartera.
	$("#myModalOK").modal('hide');
	$("#checkbox").prop("disabled", true);
	$("#idFinalizar").prop("disabled", true);
	$("#idLocCuentas").prop("disabled", true);
	$("#idLocCuentas > span").removeClass();
	$("#idLocCuentas > span").addClass("lupaDisabled");
	$("#idImporte").prop("disabled", true);
	$("#idBorrarCuentas").prop("disabled", true);
	$("#idBorrarCuentas > span").removeClass();
	$("#idBorrarCuentas > span").addClass("removeDisabled");
	aportacionFin = true;
	if(documentoImprimir!=""){
		$("#idImprimirApor").prop("disabled", false);
		window.open(documentoImprimir);
	}else
		$("#idImprimirApor").prop("disabled", true);

});

$("#idImprimirApor").bind("click", function(){
	window.open(documentoImprimir);
});

function setAportacionFin(selTablas){
	aportacionFin = selTablas; 
}

/** Funcion que deshabilita la pantalla de Aportaciones **/
function deshabilitaAportaciones(){
	$("#checkbox").prop("disabled", true);
	$("#idFinalizar").prop("disabled", true);
	$("#idLocCuentas").prop("disabled", true);
	$("#idLocCuentas > span").removeClass();
	$("#idLocCuentas > span").addClass("lupaDisabled");
	$("#idImporte").prop("disabled", true);
	$("#idBorrarCuentas").prop("disabled", true);
	$("#idBorrarCuentas > span").removeClass();
	$("#idBorrarCuentas > span").addClass("removeDisabled");
	$("#idBuscarCarteras").prop("disabled", true);
	$("#idBuscarCarteras > span").removeClass();
	$("#idBuscarCarteras > span").addClass("lupaDisabled");
	
	aportacionFin = true;
}

/** Funcion que deshabilita la pantalla de Aportaciones **/
function habilitaAportaciones(){
	$("#checkbox").prop("disabled", false);
	$("#idFinalizar").prop("disabled", false);
	$("#idLocCuentas").prop("disabled", false);
	$("#idLocCuentas > span").removeClass();
	$("#idLocCuentas > span").addClass("lupa");
	
	if($("#idImporte").val()!=""){
		$("#idImporte").prop("disabled", false);
	}else{
		$("#idImporte").prop("disabled", true);
	}
	
	$("#idBorrarCuentas").prop("disabled", false);
	$("#idBorrarCuentas > span").removeClass();
	$("#idBorrarCuentas > span").addClass("remove");
	
	$("#idBuscarCarteras").prop("disabled", false);
	$("#idBuscarCarteras > span").removeClass();
	$("#idBuscarCarteras > span").addClass("lupa");
	
	
	aportacionFin = false;
	
}

function resolucionPantallaAportacion(anchoCabeceraAportacion){
	if(anchoCabeceraAportacion <= 1024){
		$("#divCuentaImporte").removeClass("col-sm-1");
		$("#divCuentaImporte").addClass("col-sm-2");
		
	}else{
		$("#divCuentaImporte").removeClass("col-sm-2");
		$("#divCuentaImporte").addClass("col-sm-1");

	}
}
