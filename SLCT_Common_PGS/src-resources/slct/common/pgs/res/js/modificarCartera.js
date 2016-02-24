/**
 * Funcionalidad de la pantalla MODIFICAR CARTERA
 */


var tablaModif = null;
var tipoCarteraModif = null;
var clienteModif = null;
var isFinModificar = false;
var dirDocumentoMod = "";
var cuentaServicio = null;
var cuentaInicial = null;
var widthPantallaModif = 0;

$(document).ready(function(){
	
	var wModif = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	 resolucionPantallaModificacion(wModif);
	 
	 $( window ).resize(function() {
		 widthPantallaModif = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		 resolucionPantallaModificacion(widthPantallaModif);
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
	    	
		    }else if(!($("#idModificar").is(":disabled"))){
		    	if($("#myModalERROR").hasClass('in')){
			    	
		    		$("#idBtnAceptarError").focus();
		    	     e.preventDefault();
		    	     $("#myModalERROR").modal('hide');
		    	     
		    	
			    }else if($("#myModalERRORTecnico").hasClass('in')){
				    	
			    		$("#idBtnAceptarErrorServidor").focus();
			    	     e.preventDefault();
			    	     $("#myModalERRORTecnico").modal('hide');
			    	     
			    	
				}else{
					$("#idModificar").focus();
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
	
	
		$("#panelModif").hide();
		$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Modificacion&tipoCab=2", function(data){
		    $("#idCabeceraCartera").prepend(data);
		    $("#headerTitulo").html("Modificación");
		    $("body").show();
		    iniciaCabecera();
		});
		
		$("#idModificar").prop("disabled", true);
		
		cargarModalCarteras("LocalizarCarteras12.html");
		cargarModal("Error.html");
		cargarModal("ErrorServidor.html");
		cargarModalLocCuentas("BuscarCuentas12Mod.html");
		
		$('#comboPerfCartera').select2({
			minimumResultsForSearch : Infinity,
			width : "100%"
		});
		
		$('#comboEstandarRef').select2({
			minimumResultsForSearch : Infinity,
			width : "100%"
		});
		
		$("#comboPerfCartera").select2().on('change',function() {
			$("#idModificar").prop("disabled", true);
			if(clienteModif!=null && tipoCarteraModif!=null){
				var ajax_combo_estandar = {
						"perfilCartera":  $("#comboPerfCartera  :selected").val(),
						"tipoCartera" : tipoCarteraModif,
						"cliente": {
							"codigo": clienteModif.codigo,
							"tipoPersona": clienteModif.tipoPersona 
						},
						"oficina":listaCartera.sucursal
				};
			
				cargaComboAjax(ajax_combo_estandar, "#comboEstandarRef", "comboEstandarRef");
			}
		});
		
		$("#comboEstandarRef").select2().on('change',function() {
			if ($("#comboEstandarRef  :selected").val()==-1) {
				$("#idModificar").prop("disabled", true);
			} else if($("input[type='radio'][name='radio']:checked").val() == 0){
				if($("#idOtrasCuent").val()!=""){
					$("#idModificar").prop("disabled", false);
				}
			}else{
				$("#idModificar").prop("disabled", false);
			}
		});
		
		cargarModal("Error.html");
		cargarModal("ErrorServidor.html");
		
		
		
});
	
	
function cargarModal(path) {
		$.ajax({
			url : "/select/front/htm/modals/"+path,
			success : function(data) {
				$("body").append(data);
			},
			dataType : "html"
		});
}

function cargarModalCarteras(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		complete: function(){
			iniciaBotonesCarterasModal();
			iniciaCombosCartera();
			iniciaTablaCarteras();
			iniciaFormularioCarteras();
			selCarteraModificacion();
			$("#myModalCarteras").on("shown.bs.modal", function (event) {
				tablaCarteras.columns.adjust().draw();
			 });
		},
		success : function(data) {
			$("body").append(data);
		},
		dataType : "html"
	});
}

function ajaxModificacion(numCartera){
	var ajax_cartera_mod = {
			"cartera":  numCartera,
			"operacion":"CON"
	};
	
	$.ajax({
		//url:'../json/personas.json',
		url:'/select/rest/json/Modificacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cartera_mod),
		type : 'POST',
		dataType: "json", 
		cache: false,
		complete: function(){
			
			$("#comboPerfCartera").select2({
				minimumResultsForSearch : Infinity,
				width : "100%"
			});
			
			$("#comboEstandarRef").select2({
				minimumResultsForSearch : Infinity,
				width : "100%"
			});
			
		},
		success:function(data){
			if(data["ERROR"] === undefined){
				$("#comboPerfCartera").select2('destroy');
				$("#comboEstandarRef").select2('destroy');
				initCombo(data.perfilCartera, "#comboPerfCartera", data.perfilCarteraSelected);
				initCombo( data.estandar, "#comboEstandarRef", data.estandarSelected);
				
				$("#idBuscarCuentas > span").removeClass();
				$("#idBuscarCuentas > span").addClass("lupa");
				$("#idBuscarCuentas").prop("disabled", false);
				$(".radio").prop("disabled", false);
				$("#comboEstandarRef").prop("disabled", false);
				$("#comboPerfCartera").prop("disabled", false);
				
				tipoCarteraModif = data.tipoCartera;
				clienteModif = data.cliente;
				
				if(data["cuentaComisiones"] !== undefined){
					$("input[name=radio][value=" + 0 + "]").prop('checked', true);
					$("#idOtrasCuent").val(data.cuentaComisiones.cuenta);
					cuentaServicio = data.cuentaComisiones;
					cuentaInicial= data.cuentaComisiones;
					$("#idOtrasCuentasNo").show();
				}else{
					$("input[name=radio][value=" + 1 + "]").prop('checked', true);
					$("#idOtrasCuent").val("");
					cuentaServicio = null;
					cuentaInicial= null;
					cuentaSelecMod=null;
					$("#idOtrasCuentasNo").hide();
					$("#idOtrasCuentasSi").show();				
				}
				
				//Descomentar cuando el servicio devuelva el documento
				//dirDocumentoMod = data.documento;
				$("#idModificar").prop("disabled", false);
				$("#panelModif").show();
				
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

function initCombo(datos, idCombo, valSelected) {
	$(idCombo).children().remove();
	if(idCombo == "#comboPerfCartera"){
		
	}else{
		$(idCombo).html('<option value="-1">Seleccionar...</option>');
	}
	
	
	
		for(obj in datos){
			if(obj == valSelected){
				$(idCombo).append('<option value="' + obj + '" selected>' + datos[obj] + '</option>');
			}else{
				$(idCombo).append('<option value="' + obj + '">' + datos[obj] + '</option>');
			}
		}
	
		
//	$(idCombo).select2({
//		minimumResultsForSearch : Infinity,
//		width : "100%"
//	});
}

function cargaComboEstandar(datos, idCombo) {
	
	
	$(idCombo).html('<option value="-1">Seleccionar...</option>');

	for(obj in datos){
			
		$(idCombo).append('<option value="' + obj + '">' + datos[obj] + '</option>');
			
	}
	
	$(idCombo).select2({
//		theme : "classic",
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
}

function cargaTabla(cuentas){
	var ie8Nchild = "";
	tablaModif = $('#tablaMod').DataTable({
		"sScrollY" : 90,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		ordering : false,
		info : false,
		"aaData" : cuentas,
		"columns": [
		            { "data" : "cuenta"},
		            { "data": "descripcion" },
		            { "data": "divisa" },
		            { "data": "disposicion" },
		            { "data": "empresa", "visible" : false },
		            { "data": "centro", "visible" : false },
		            { "data" : "producto","visible" : false},
		            { "data" : "contrato","visible" : false},
		            { "data" : "saldo","visible" : false},
		            { "data" : "control","visible" : false},
		            { "data": "selected", "visible": false}
		],
		"language" : {
			"emptyTable" : " "
		}
	});
	
	for(var i=0; i < cuentas.length; i++ ){
		
		if(cuentas[i].selected == true){
			
			$('#tablaMod tbody :first-child'+ ie8Nchild).addClass('selected');
			
		}
		ie8Nchild += " +tr";
	}
	tablaModif.columns.adjust().draw();
}


$("input[type='radio']").click(function() {
	var radioValue = $("input[type='radio'][name='radio']:checked").val();
	if (radioValue == "0") {
		$("#idBuscarCuentas").prop("disabled", false);
		$("#idOtrasCuentasSi").hide();
		$("#idOtrasCuentasNo").show();
		if($("#idOtrasCuent").val()==""){
			$("#idModificar").prop("disabled", true);
		}
	} else {
		$("#idOtrasCuent").val("");
		cuentaSelec=null;
		$("#idOtrasCuentasNo").hide();
		$("#idOtrasCuentasSi").show();
		
		if($("#comboEstandarRef :selected").val()!=-1){
			$("#idModificar").prop("disabled", false);
		}else{
			$("#idModificar").prop("disabled", true);
		}
			
		
	}
});

function cargaComboAjax(concepto, idCombo, fileJSON) {
	$.ajax({
		//url:'../json/'+ fileJSON +'.json',
		url:'/select/rest/json/Estandar',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(concepto),
		type : 'POST',
		cache : true,
		success : function(data) {
			if(data["ERROR"] === undefined){
				cargaComboEstandar(data, idCombo);
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
				cargaComboVacio(idCombo);
				$("#idModificar").prop("disabled", true);
			}
			
		},
		error : function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});
}

function cargaComboVacio(idCombo) {
	$(idCombo).html('<option value="-1">Seleccionar...</option>');
	
	$(idCombo).select2({
//		theme : "classic",
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
}

	
$("#idModificar").bind("click", function(){
	var target = document.getElementById('idModificar');
	var spinner = new Spinner(opts).spin(target);
	var ajax_fin_mod = {
			"cartera":  $("#idCartera").val(),
			"perfil": $("#comboPerfCartera :selected").val(),
			"estandar": $("#comboEstandarRef :selected").val(),
			"operacion":"MOD",
			"cuentaInicial":cuentaInicial	
				
	};
	
	if(cuentaSelecMod != null && $("#idOtrasCuent").val()!=""){

		ajax_fin_mod = {
				"cartera":  $("#idCartera").val(),
				"perfil": $("#comboPerfCartera :selected").val(),
				"estandar": $("#comboEstandarRef :selected").val(),
				"operacion":"MOD",
				"cuentaComisiones" : { 
				      "sccc": cuentaSelecMod.sccc,
				      "producto": cuentaSelecMod.producto,
				      "centro": cuentaSelecMod.centro,
				      "divisa": cuentaSelecMod.divisa,
				      "cuenta": cuentaSelecMod.cuenta,
				      "empresa": cuentaSelecMod.empresa,
				      "contrato": cuentaSelecMod.contrato
				   },
				"cuentaInicial":cuentaInicial
		};

	}else if($("#idOtrasCuent").val()!="" && cuentaServicio != null){
		ajax_fin_mod = {
				"cartera":  $("#idCartera").val(),
				"perfil": $("#comboPerfCartera :selected").val(),
				"estandar": $("#comboEstandarRef :selected").val(),
				"operacion":"MOD",
				"cuentaComisiones" : cuentaServicio,
				"cuentaInicial":cuentaInicial
		};
	}

	$.ajax({
		//url:'../json/'+ fileJSON +'.json',
		url:'/select/rest/json/Modificacion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_fin_mod),
		type : 'POST',
		cache : true,
		beforeSend: function() {
			$("#idModificar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idModificar").prop("disabled", true);
			$("#idBuscarCuentas > span").removeClass();
			$("#idBuscarCuentas > span").addClass("lupaDisabled");
			$("#idBuscarCuentas").prop("disabled", true);
			$(".radio").prop("disabled", true);
			$("#comboEstandarRef").prop("disabled", true);
			$("#comboPerfCartera").prop("disabled", true);
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idModificar").css("color", "#fff");
        	$("#idModificar").prop("disabled", false);
        },
		success : function(data) {
			if(data["ERROR"] === undefined){
				
				if(data.modificacion==true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					if(data.documento!="")
						dirDocumentoMod = data.documento;		
				}else{
					$("#mensajeError").html(data.mensaje);
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					$("#idModificar").prop("disabled", false);
					$("#idBuscarCuentas > span").removeClass();
					$("#idBuscarCuentas > span").addClass("lupa");
					$("#idBuscarCuentas").prop("disabled", false);
					$(".radio").prop("disabled", false);
					$("#comboEstandarRef").prop("disabled", false);
					$("#comboPerfCartera").prop("disabled", false);
				}
				
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
				$("#idModificar").prop("disabled", false);
				$("#idBuscarCuentas > span").removeClass();
				$("#idBuscarCuentas > span").addClass("lupa");
				$("#idBuscarCuentas").prop("disabled", false);
				$(".radio").prop("disabled", false);
				$("#comboEstandarRef").prop("disabled", false);
				$("#comboPerfCartera").prop("disabled", false);
			}
			
		},
		error : function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});
});

$("#idBtnAceptar").bind("click", function(){
	//Devuelve el documento pdf a imprimir, se abre una pantalla nueva con
	//el documento a imprimir
	$("#myModalOK").modal('hide');
	if(dirDocumentoMod!=""){
		$("#idModificar").prop("disabled", true);
		$("#idImprimirMod").prop("disabled", false);
		$("#comboPerfCartera").prop("disabled", true);
		$('#comboPerfCartera').select2('destroy');
		$('#comboPerfCartera').prop('disabled', true);
		$('#comboPerfCartera').select2();
		$("#comboEstandarRef").prop("disabled", true);
		$('#comboEstandarRef').select2('destroy');
		$('#comboEstandarRef').prop('disabled', true);
		$('#comboEstandarRef').select2();
		isFinModificar = true;
		window.open(dirDocumentoMod);
	}else{
		$("#idModificar").prop("disabled", true);
		$("#idImprimirMod").prop("disabled", true);
		$("#comboPerfCartera").prop("disabled", true);
		$('#comboPerfCartera').select2('destroy');
		$('#comboPerfCartera').prop('disabled', true);
		$('#comboPerfCartera').select2();
		$("#comboEstandarRef").prop("disabled", true);
		$('#comboEstandarRef').select2('destroy');
		$('#comboEstandarRef').prop('disabled', true);
		$('#comboEstandarRef').select2();
		isFinModificar = true;
	}
	
});

function setFinModificar(valFinModificar){
	isFinModificar = valFinModificar;
}

$("#idImprimirMod").bind("click", function(){
	window.open(dirDocumentoMod);
});

function cargarModalLocCuentas(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		dataType : "html",
		complete: function(){
			iniciaTablasCuentasMod();
			selCuentasModificacion($("#idCartera").val());
			$("#myModalCuentasMod").on("shown.bs.modal", function (event) {
				tablaCuentasMod.columns.adjust().draw();
				tablaLocIntervinentesMod.columns.adjust().draw();
			 });
		},
		success : function(data) {
			$("body").append(data);
			
		}
		
	});
}

$("#idBuscarCuentas").bind("click", function(){	
	
	abrirModalCuentasSiga($("#idCartera").val());
	setCarteraAportacion($("#idCartera").val());
	
});

function resolucionPantallaModificacion(anchoModificacion){
	if(anchoModificacion <= 1024){
		 $("#divLblOtrasCuentasMod").removeClass("col-sm-10");
		 $("#divLblOtrasCuentasMod").addClass("col-sm-12");
		 
	 }else{
		 $("#divLblOtrasCuentasMod").addClass("col-sm-10");
		 $("#divLblOtrasCuentasMod").removeClass("col-sm-12");

	 }
}