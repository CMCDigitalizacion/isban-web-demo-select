/**
 * JavaScript de la pagina AltaSiga.html
 */
var rows = [];
var listaInterviniente = null;
var modificarOrdenInterv = null;
var indexDelete = null;
var persona= null;
var primerTitular = {
		"cliente": "",
		"tipoPersona": ""
};
var ordenIn = null;

var cartera= null;
var importeMinimo = null;

var addOrMod = null;

var  disposicionValCombo = '-1';
var tipoValCombo = '-1';
var boolDispCombo = false;
var boolTipoCombo = false;
var resguardo = null;
var altaOKBool = false;
var noSelTabla = false;
var widthPantalla = 0;

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

$(document).ready(function() {
	
	/** Modal Clientes SIGA **/
	cargarModalLocPersonas("LocalizadorPersonas12.html");
	cargarModalBuscarCuentas("BuscarCuentas12.html");
	//->descomentar mas adelante 
	cargarModalBuscarSucursal("BuscarSucursal12.html");
	cargarModal("Error.html");
	cargarModal("ErrorServidor.html");
	
	 iniciaOficina();
	 
	 var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	 resolucionPantalla(w);
	 
	 $( window ).resize(function() {
		 widthPantalla = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		 resolucionPantalla(widthPantalla);
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
		    	     if(altaOKBool == true){
		    	    	 altaOKEnter();
		    	     }	
				}
		    	
		    }else if(!($("#idAceptar").is(":disabled"))){
		    	
		    	if($("#myModalERROR").hasClass('in')){
			    	
		    		$("#idBtnAceptarError").focus();
		    	     e.preventDefault();
		    	     $("#myModalERROR").modal('hide');
		    	     
		    	
			    }else if($("#myModalERRORTecnico").hasClass('in')){
				    	
			    		$("#idBtnAceptarErrorServidor").focus();
			    	     e.preventDefault();
			    	     $("#myModalERRORTecnico").modal('hide');
			    	     
			    	
				}else{
			    	$("#idAceptar").focus();
			    	e.preventDefault();
			    	aceptarAlta();
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
	
	$("#pager-lista-cuentas").hide();
	
	
	
	//eventChangeCombo();
	$('#comboDisposicion').select2({
		disabled: true,
		width : "100%"
	});
	
	$('#comboTipoIntervencion').select2({
		disabled: true,
		width : "100%"
	});
	
	
	$('#comboTipoCartera').select2({
		disabled: true,
		width : "100%"
	});
	
	$('#comboTipoAgrup').select2({
		disabled: true,
		width : "100%"
	});
	
	$('#comboPerfil').select2({
		disabled: true,
		width : "100%"
	});
	
	
	$('#comboEstandard').select2({
		disabled: true,
		width : "100%"
	});
	
	
	$("#comboDispCartera").select2({
		disabled: false,
		width : "100%"
	});
	
	$("input[name='radio']").prop('disabled', true);
	$("#idRefrescarEstado").prop("disabled", true);
	$("#idRefrescarPerfil").prop("disabled", true);
	
	
	$("#idAceptar").prop("disabled", true);
	$("#idContinuar").prop("disabled", true);
	
	
	
	/** Cargar combo Disposicion Cartera * */
	var ajax_disp_cartera = {
		"tipo" : "CAR"
	}
	cargaComboAjax(ajax_disp_cartera, "#comboDispCartera",'disposicionCartera');
	
	/** Carga Combo Disposicion **/
	$("#comboDispCartera").select2().on('change',function() {
		/** Cargar combo Disposicion* */
		var ajax_concepto = {
			"tipo" : "CLI",
			"tipoCartera" : $("#comboDispCartera  :selected").val()
		};
		$("#btnAddInterv").prop("disabled", true);
		$("#btnModificarInterv").prop("disabled", true);
    	$("#btnBorrarInterv").prop("disabled", true);
		if ($("#comboDispCartera  :selected").val()!=-1 && $("#idInterviniente").val()!="") {
			$("#comboDisposicion").prop('disabled', false);
			cargaComboAjax(ajax_concepto,"#comboDisposicion",'disposicionCliente');
		} else {
			$('#comboDisposicion').html('<option value="-1"></option>');
			$('#comboDisposicion').select2({
				disabled: true,
				width : "100%"
			});

			
		};
		
		//Limpiar Productos
		limpiarProductos();
		
	});
	
	/** Carga Combo Tipo Cartera - Tipo de Agrupacion**/
	
	$("#comboTipoAgrup").select2().on('change',function() {
		tablaProductos.settings()[0].oLanguage["sEmptyTable"] = " ";
		tablaProductos.clear().draw();
		$("#idAceptar").prop("disabled", true);
		$("#idRefrescarCuenta").prop("disabled", true);
		/** Cargar combo Tipo Cartera **/
		
		
		var ajax_concepto = {
			"perfil":  $("#comboPerfil  :selected").val(),
			"tAgrupacion" : $("#comboTipoAgrup  :selected").val(),
			"cliente": {
				"codigo": primerTitular.cliente,
				"tipoPersona": primerTitular.tipoPersona
			}
		}
		
		$('#comboEstandard').html('<option value="-1"></option>');
		$('#comboEstandard').select2({
			disabled: true,
			width : "100%"
		});
		
		if($("#comboTipoAgrup  :selected").val()==-1) {
			$('#comboTipoCartera').html('<option value="-1"></option>');
			$('#comboTipoCartera').select2({
				disabled: true,
				width : "100%"
			});
		}else if ($("#comboPerfil  :selected").val()!=-1 && $("#comboTipoAgrup  :selected").val()!=-1) {
			cargaComboAjax(ajax_concepto,"#comboTipoCartera",'tipoCartera');
			$("#comboTipoCartera").prop('disabled', false);
		} else {
		}
		
	});
	
	
	/** Carga Combo Tipo Cartera - Perfil Cartera**/
	
	$("#comboPerfil").select2().on('change',function() {
		tablaProductos.settings()[0].oLanguage["sEmptyTable"] = " ";
		tablaProductos.clear().draw();
		$("#idRefrescarCuenta").prop("disabled", true);
		$("#idAceptar").prop("disabled", true);
		
		$('#comboEstandard').html('<option value="-1"></option>');
		$('#comboEstandard').select2({
			disabled: true,
			width : "100%"
		});
		
		/** Cargar combo Tipo de Cartera* */
		var ajax_concepto = {
			"perfil":  $("#comboPerfil  :selected").val(),
			"tAgrupacion" : $("#comboTipoAgrup  :selected").val(),
			"cliente": {
				"codigo": primerTitular.cliente,
				"tipoPersona": primerTitular.tipoPersona 
			}
		}
		
		if($("#comboPerfil  :selected").val()==-1) {
			$('#comboTipoCartera').html('<option value="-1"></option>');
			$('#comboTipoCartera').select2({
				disabled: true,
				width : "100%"
			});
			
			$('#comboEstandard').html('<option value="-1"></option>');
			$('#comboEstandard').select2({
				disabled: true,
				width : "100%"
			});
			$("#idRefrescarCuenta").prop('disabled', true);
			$("#idAceptar").prop("disabled", true);
		}else if ($("#comboTipoAgrup  :selected").val()!=-1 && $("#comboPerfil  :selected").val()!=-1) {
			cargaComboAjax(ajax_concepto,"#comboTipoCartera",'tipoCartera');
			$("#comboTipoCartera").prop('disabled', false);
		} else {
			
		}
		
	});
	
	/** Carga Combo Estandar - Tipo de Cartera**/
	
	$("#comboTipoCartera").select2().on('change',function() {
		tablaProductos.settings()[0].oLanguage["sEmptyTable"] = " ";
		tablaProductos.clear().draw();
		/** Cargar combo Disposicion* */
		var ajax_concepto = {
				"perfilCartera":  $("#comboPerfil  :selected").val(),
				"tipoCartera" : $("#comboTipoCartera  :selected").val(),
				"cliente": {
					"codigo": primerTitular.cliente,
					"tipoPersona": primerTitular.tipoPersona 
				},
				"oficina": $("#txtSucursal").val()
		}
		if($("#comboTipoCartera  :selected").val() == -1){
			$('#comboEstandard').html('<option value="-1"></option>');
			$('#comboEstandard').select2({
				disabled: true,
				width : "100%"
			});
			$("#idRefrescarCuenta").prop('disabled', true);
			$("#idAceptar").prop("disabled", true);
			//Deshabilitar Radio Button
			$("input[name=radio][value=" + 1 + "]").prop('checked', true);
			$("#idOtrasCuentasSi").show();
			$("#idOtrasCuentasNo").hide();
			$("input[name='radio']").prop('disabled', true);
		}else if ($("#comboPerfil  :selected").val()!=-1 && $("#comboTipoCartera  :selected").val()!=-1) {
			cargaComboAjax(ajax_concepto,"#comboEstandard",'comboEstandard');
			$("#comboEstandard").prop('disabled', false);
			$("#idRefrescarCuenta").prop('disabled', true);
			$("#idAceptar").prop("disabled", true);
			$("input[name='radio']").prop('disabled', false);
		} else {
		};
		
		if($("#comboTipoCartera  :selected").val()!=-1){
			$("#idRefrescarCuenta").prop("disabled", false);
		}
		
		if($("#comboTipoCartera  :selected").val()==-1){
			$("#idRefrescarCuenta").prop("disabled", true);
			$("#idAceptar").prop("disabled", true);
		}
	});
	
	/** Boton Añadir Habilitar **/
	$("#comboDisposicion").on('change',function() {

		if($("#comboDisposicion").val()=='-1' || $("#comboTipoIntervencion").val()=='-1'){
			$("#btnAddInterv").prop("disabled", true);
        	$("#btnModificarInterv").prop("disabled", true);
        	$("#btnBorrarInterv").prop("disabled", true);
		}else{
			
			$('#contact-form').formValidation('updateStatus', 'orden', 'NOT_VALIDATED').
			formValidation('validateField', 'orden');
	        
	        if(!($('#contact-form').data('formValidation').isValidField('orden'))){
	        	$("#btnAddInterv").prop("disabled", true);
//				$("#idRefrescarEstado").prop("disabled", true);
//				$("#idRefrescarPerfil").prop("disabled", true);
	        }else{
				if(addOrMod == false){
					$("#btnAddInterv").prop("disabled", false);
//					$("#idRefrescarEstado").prop("disabled", true);
//					$("#idRefrescarPerfil").prop("disabled", true);
				}else{
					$("#btnAddInterv").prop("disabled", true);
		        	$("#btnModificarInterv").prop("disabled", false);
		        	$("#btnBorrarInterv").prop("disabled", false);
				}
	        }
		}
		
	});
	
	$("#comboTipoIntervencion").on('change',function() {
		
		if($("#comboDisposicion").val()=='-1' || $("#comboTipoIntervencion").val()=='-1' || $("#comboDispCartera").val()==-1){
			$("#btnAddInterv").prop("disabled", true);
        	$("#btnModificarInterv").prop("disabled", true);
        	$("#btnBorrarInterv").prop("disabled", true);
		}else{
			
			
			$('#contact-form').formValidation('updateStatus', 'orden', 'NOT_VALIDATED').
				formValidation('validateField', 'orden');
	        
	        if(!($('#contact-form').data('formValidation').isValidField('orden'))){
	        	$("#btnAddInterv").prop("disabled", true);
	        }else{
	        	if(addOrMod == false){
					$("#btnAddInterv").prop("disabled", false);
				}else{
					$("#btnAddInterv").prop("disabled", true);
		        	$("#btnModificarInterv").prop("disabled", false);
		        	$("#btnBorrarInterv").prop("disabled", false);
				}
	        }
			
		}
		
	});
	
	/** Onchange combo estandar **/
	$("#comboEstandard").select2().on('change',function() {
		if ($("#comboEstandard  :selected").val()==-1) {
			$("#idAceptar").prop("disabled", true);
		} else if(tablaProductos.rows('.selected').data().length != 0){
			$("#idAceptar").prop("disabled", false);
		}
		
	});
	
	/** Tabla de intervinientes -- Definición * */
	tablaIntervinientes = $('#tabla-intervinientes').DataTable({
		"sScrollY" : 90,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		"ordering": false,
		info : false,
		"data" : "",
		"columns" : [ {"data" : "id"},
		              {"width" : "5%","data" : "tipopersona"}, 
		              {"width" : "5%","data" : "cliente"}, 
		              {"data" : "tipodocumento"}, 
		              {"data" : "tdocumento","visible" : false,"searchable" : false}, 
		              {"width" : "7%","data" : "documento"}, 
		              {"data" : "denominacion"}, 
		              {"data" : "tipo"}, 
		              {"data" : "tipoVal","visible" : false,"searchable" : false}, 
		              {"data" : "estado"}, 
		              {"data" : "perfil"}, 
		              {"data" : "disposicion"},
		              {"data" : "disposicionVal","visible" : false,"searchable" : false},
		              {"data" : "tipoPersona","visible" : false,"searchable" : false},
		              {"data" : "dPerfil","visible" : false,"searchable" : false} 
		            ],
		"language" : {
			"emptyTable" : " "
		}
	});
	
	/** Tabla de intervinientes -- Seleccionar * */
	$('#tabla-intervinientes tbody').on('click','tr',function() {
		listaInterviniente = tablaIntervinientes.row(this).data();
		modificarOrdenInterv = tablaIntervinientes.row(this).data();
		
		
		
		if(listaInterviniente == null || noSelTabla == true){
			$(this).removeClass('selected');
		}else{
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				$('#btnModificarInterv').prop('disabled', true);
				$('#btnBorrarInterv').prop('disabled', true);
				$("#idRefrescarEstado").prop("disabled", true);
				$("#idRefrescarEstado > span").removeClass();
				$("#idRefrescarEstado > span").addClass("infoDisabled");
				
				$("#idRefrescarPerfil").prop("disabled", true);
				$("#idRefrescarPerfil > span").removeClass();
				$("#idRefrescarPerfil > span").addClass("refreshDisabled");
				
				$("#idBuscar").prop("disabled", false);
				$("#idBuscar > span").removeClass();
				$("#idBuscar > span").addClass("lupa");
				limpiarCamposInterv();
				listaInterviniente = null;
				indexDelete = null;
				addOrMod = null;
			} else {
				//Voy a modificar un registro, OrdenIn max es igual al numero de registros de la tabla
				addOrMod = true;
				tablaIntervinientes.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				$('#btnModificarInterv').prop('disabled', false);
				$('#btnBorrarInterv').prop('disabled', false);
				$("#idRefrescarEstado").prop("disabled", false);
				$("#idRefrescarEstado > span").removeClass();
				$("#idRefrescarEstado > span").addClass("info");
				
				$("#idRefrescarPerfil").prop("disabled", false);
				$("#idRefrescarPerfil > span").removeClass();
				$("#idRefrescarPerfil > span").addClass("refresh");
				
				cargaCamposInterviniente(tablaIntervinientes.row(this).data());
				indexDelete = tablaIntervinientes.row(this).index();
				$("#idBuscar").prop("disabled", true);
				$("#idBuscar > span").removeClass();
				$("#idBuscar > span").addClass("lupaDisabled");
			}
		}
	});
	
	

	$("#comboTipoAgrup").prop("disable", true);
	
	/* PRUEBA Valida intervinientes */
	$("#idContinuar").on("click",function(e) {
		limpiarProductosContinuar();
		var listaIntervinientes = listaValidacion();
		listaIntervinientes.oficina = $("#txtSucursal").val();
		
		var target = document.getElementById('idContinuar');
		var spinner = new Spinner(opts).spin(target);
		
		var ajax_validacion = {
				"sucursal": $("#txtSucursal").val(),
				"listaIntervinientes": listaIntervinientes
		}
		
		if (listaIntervinientes != null) {
			$.ajax({
				dataType : "json",
				//url : '../json/validaIntervinientes.json',
				url:'/select/rest/json/ValidaIntervinientes',
				contentType : "application/json; charset=utf-8",
				data : JSON.stringify(listaIntervinientes),
				type : 'POST',
				beforeSend: function() {
					$("#idContinuar").css("color", "#ff2500");
					$(target).data('spinner', spinner);
					$("#idContinuar").prop("disabled", true);
		        },
		        complete: function() {
		        	$(target).data('spinner').stop();
		        	$("#idContinuar").css("color", "#fff");
		        	$("#idContinuar").prop("disabled", false);
		        },
				success : function(data) {
					if(data["ERROR"] === undefined){
						if (validaIntervinientesMensaje(data))
							cargaProductos(data);
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

		} else {
			bootstrap_alert.warning('No hay intervinientes');
		};
	});
	
	$("#idRefrescarCuenta").on('click', function(){
		$("#idRefrescarCuenta").prop("disabled", true);
		$("#idAceptar").prop("disabled", true);
		cargaCuentasAjax($("#comboTipoCartera  :selected").val());
		
	});
	
	
	$("#btnAddInterv").on("click", function(){
		//PRUEBA: Validación option != -1
		if(checkCombos()){
			var personaInterv = insertarInterviniente(listaPersona);
			ordenIn= tablaIntervinientes.page.info().recordsTotal;
			
			if (personaInterv.bloquear){
				$("#mensajeError").html("No puede añadir cliente sin perfil.");
				$("#myModalERROR").modal('show');
				return;
			}
		
			
			tablaIntervinientes.row.add({
				"id" : personaInterv.id,
				"tipopersona": personaInterv.tipopersona,
		        "cliente": personaInterv.cliente,
		        "tipodocumento": personaInterv.tipodocumento,
		        "tdocumento" : personaInterv.tdocumento,
		        "documento": personaInterv.documento,
		        "denominacion": personaInterv.nombre,
		        "tipo": personaInterv.tipo,
		        "tipoVal" : personaInterv.tipoVal,
		        "estado": personaInterv.estado,
		        "perfil": personaInterv.perfil,
		        "disposicion": personaInterv.disposicion, 
		        "disposicionVal" : personaInterv.disposicionVal,
		        "tipoPersona" : personaInterv.tipoPersona,
		        "dPerfil" : personaInterv.dPerfil
			}).draw(this);
			
			ordenIn++;
			
			ordenaIntervinientesAdd();
			if(tablaIntervinientes.page.info().recordsTotal == 1 && $("#txtSucursal").val()!=""){
				$("#idContinuar").prop("disabled", false);
			}
			listaPersona = null;
			limpiarCamposInterv();
		} else {
			
		};
		
		
		
	});
	
	$('#contact-form')
    // IMPORTANT: You must declare .on('init.field.fv')
    // before calling .formValidation(options)
    .on('init.field.fv', function(e, data) {
        // data.fv      --> The FormValidation instance
        // data.field   --> The field name
        // data.element --> The field element

        var $parent = data.element.parents('#divInterviniente'),
            $icon   = $parent.find('.form-control-feedback[data-fv-icon-for="' + data.field + '"]');
        

        // You can retrieve the icon element by
        // $icon = data.element.data('fv.icon');

        $icon.on('click.clearing', function() {
            // Check if the field is valid or not via the icon class
            if ($icon.hasClass('glyphicon-remove')) {
                // Clear the field
                data.fv.resetField(data.element);
                $("#idInterviniente").val('');
            }
        });
    }).formValidation({
        framework: 'bootstrap',
        icon: {
            valid: '',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	interviniente: {
                // The messages for this field are shown as usual
                validators: {
                    notEmpty: {
                        message: 'El interviniente es obligatorio'
                    }
                }
            },
            orden: {
            	validators: {
            		notEmpty: {
                        message: 'El orden es obligatorio'
                    },
                    integer: {
                    	message: 'Formato incorrecto'
                    },
                    between: {
                        min: 1,
                        max: 1,
                        message: 'Valor introducido no válido' 
                    }
            	}
            },
            sucursalAlta: {
            	validators: {
	            	notEmpty: {
	                    message: 'El campo es obligatorio'
	                },
	                numeric: {
	                	message: 'Formato incorrecto'
	                },
	                stringLength : {
						max : 4,
						min : 4,
						message : 'Número de caracteres inválido'
					}
            	}
            }
        }
    }).on('keyup', '[name="orden"]', function(e) {
    	//Modificar
    	
    	if(addOrMod == true){
    		ordenIn= tablaIntervinientes.page.info().recordsTotal;
    	}else if(addOrMod == false){
    		//Alta
    		ordenIn= tablaIntervinientes.page.info().recordsTotal+1;
    	}
    	
        $('#contact-form').formValidation('updateOption', 'orden', 'between', 'max', ordenIn)
        .formValidation('revalidateField', 'orden');
        
        if(!($('#contact-form').data('formValidation').isValidField('orden')) && addOrMod==false && 
        		$("#comboTipoIntervencion :selected").val()!='-1' && $("#comboDisposicion :selected").val()!='-1'){
        	$("#btnAddInterv").prop("disabled", true);
        	$("#btnModificarInterv").prop("disabled", true);
        	$("#btnBorrarInterv").prop("disabled", true);
        }else if(!($('#contact-form').data('formValidation').isValidField('orden')) && addOrMod==true &&
        		$("#comboTipoIntervencion :selected").val()!='-1' && $("#comboDisposicion :selected").val()!='-1'){
        	$("#btnAddInterv").prop("disabled", true);
        	$("#btnModificarInterv").prop("disabled", true);
        	$("#btnBorrarInterv").prop("disabled", true);
        }else if(($('#contact-form').data('formValidation').isValidField('orden')) && addOrMod==false &&
        		$("#comboTipoIntervencion :selected").val()!='-1' && $("#comboDisposicion :selected").val()!='-1'){
        	$("#btnAddInterv").prop("disabled", false);
        	$("#btnModificarInterv").prop("disabled", true);
        	$("#btnBorrarInterv").prop("disabled", true);
        }else if(($('#contact-form').data('formValidation').isValidField('orden')) && addOrMod==true &&
        		$("#comboTipoIntervencion :selected").val()!='-1' && $("#comboDisposicion :selected").val()!='-1'){
        	$("#btnAddInterv").prop("disabled", true);
        	$("#btnModificarInterv").prop("disabled", false);
        	$("#btnBorrarInterv").prop("disabled", false);
        }else{
        	$("#btnAddInterv").prop("disabled", true);
        	$("#btnModificarInterv").prop("disabled", true);
        	$("#btnBorrarInterv").prop("disabled", true);
        }
        
    });
	
	

	//Lupa de Buscar
	$("#idBuscar").on("click", function(e){
		var datosVacios = {"clientes":
			[{"tDocumento":" ","denominacion":" ","dTipoPersona"
			:" ","cliente":" ","dtDocumento":" ","tipoPersona":" ","nDocumento":" "}]};
		
		$('#idApellido2').val("");
		$('#idNombre').val("");
		$("#panelFormularioBuscar").collapse('show');
		$("#pager-clientes").hide();
		$("#idSelCliente").prop("disabled", true);
		$("#tipoBusqueda").val("2").change();
		$("#tipoPersona").val("F").change();
		$("#tipoExtensiva").val("E").change();
		$("#myModalBuscar").modal('show');
		$("#myModalBuscar").modal({"backdrop": "static"});
		
		if(tablaClientes != null){
			tablaClientes.settings()[0].oLanguage["sEmptyTable"] = " ";
			tablaClientes.clear().draw();
		}
		

		if(respBusqueda && respBusqueda.readystate != 4){
			respBusqueda.abort();
        }
		
		
	});
	
	$('#panelIntervinientes').on('shown.bs.collapse', function () {
		$('#imgCollapse').prop("src",'/select/front/img/GbAreaV2CloseTrans.gif' );
		$( "#tabla-productos_wrapper .dataTables_scrollBody" ).css({height: "90px"});
		tablaProductos.columns.adjust().draw();
		});
	$('#panelIntervinientes').on('hidden.bs.collapse', function () {
		$('#imgCollapse').prop("src",'/select/front/img/GbAreaV2OpenTrans.gif' );
		$( "#tabla-productos_wrapper .dataTables_scrollBody" ).css({height: "300px"});
		tablaProductos.columns.adjust().draw();
		
		
	});
	
	$('#panelSucursal').on('shown.bs.collapse', function () {
		$('#imgCollapse2').prop("src",'/select/front/img/GbAreaV2CloseTrans.gif' );
		$( "#tabla-productos_wrapper .dataTables_scrollBody" ).css({height: "90px"});
		tablaProductos.columns.adjust().draw();
		});
	$('#panelSucursal').on('hidden.bs.collapse', function () {
		$('#imgCollapse2').prop("src",'/select/front/img/GbAreaV2OpenTrans.gif' );
	});
	
	$("#txtSucursal").change(function() {
		 limpiarProductos();
		});
	
});
//Fin document.ready()


/* PRUEBA Validación intervinientes */
function validaIntervinientesMensaje(datos) {
	if (datos.validado == true) {
		$("#idDivisa").val(datos.divisa);
		$("#idDivisaDesc").val(datos.divisa + " - " + datos.divisaDescripcion);
		return true;
	} else {
		$("#mensajeError").html(datos.mensaje);
		$("#myModalERROR").modal('show');
		return false;
	}
}

$("input[type='radio']").click(function() {
	var radioValue = $("input[type='radio'][name='radio']:checked").val();
	if (radioValue == "0") {
		$("#idOtrasCuentasSi").hide();
		$("#idOtrasCuentasNo").show();
		if($("#idOtrasCuent").val()==""){
			$("#idAceptar").prop("disabled", true);
		}
	} else {
		$("#idOtrasCuent").val("");
		cuentaSelec=null;
		$("#idOtrasCuentasNo").hide();
		$("#idOtrasCuentasSi").show();
		
		if(tablaProductos.rows('.selected').data().length != 0 && $("#comboEstandard  :selected").val()!=-1){
			$("#idAceptar").prop("disabled", false);
		}else{
			$("#idAceptar").prop("disabled", true);
		}
	}
});



function cargaStatusTest(estado) {
	$("#idEstadoTest").val(estado);
}

function cargaPerfilCliente(estado) {
	$("#idPerfil").val(estado);
}

function cargaComboAjax(concepto, idCombo, fileJSON) {
	
	if(idCombo == "#comboTipoCartera"){
		$.ajax({
			//url:'../json/'+ fileJSON +'.json',
			url:'/select/rest/json/TipoCartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(concepto),
			type : 'POST',
			cache : true,
			success : function(data) {
				if(data["ERROR"] === undefined){
					cargaCombo(data, idCombo);
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					cargaComboVacio(idCombo);
				}
			},
			error : function(xhr, status, error) {
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		});
	}else if(idCombo == "#comboEstandard"){
		$.ajax({
			//url:'../json/'+ fileJSON +'.json',
			url:'/select/rest/json/Estandar',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(concepto),
			type : 'POST',
			cache : true,
			success : function(data) {
				if(data["ERROR"] === undefined){
					cargaCombo(data, idCombo);
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					cargaComboVacio(idCombo);
				}
				
			},
			error : function(xhr, status, error) {
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		});
	} else if(idCombo == "#comboDispCartera" || idCombo == "#comboDisposicion"){
		$.ajax({
			//url:'../json/'+ fileJSON +'.json',
			url:'/select/rest/json/Disposicion',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(concepto),
			type : 'POST',
			cache : true,
			complete: function(){
				//La primera vez que se carga la pantalla se va a mostrar el body si esta oculto y se
				//arreglara el padding-right de las tablas
				if($("body").is(":hidden")){
					$("body").show();
					tablaIntervinientes.columns.adjust().draw();
					tablaProductos.columns.adjust().draw();
					$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
				}
			},
			success : function(data) {
				if(data["ERROR"] === undefined){
					cargaCombo(data, idCombo);
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					cargaComboVacio(idCombo);
				}
				
			},
			error : function(xhr, status, error) {
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		});
	}else{
		$.ajax({
			//url:'../json/'+ fileJSON +'.json',
			url:'/select/rest/json/Conceptos',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(concepto),
			type : 'POST',
			cache : true,
			success : function(data) {
				if(data["ERROR"] === undefined){
					cargaCombo(data, idCombo);
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					cargaComboVacio(idCombo);
				}
			},
			error : function(xhr, status, error) {
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		});
	}
	
	
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

function cargaComboVacio(idCombo) {
	$(idCombo).html('<option value="-1">Seleccionar...</option>');
	
	$(idCombo).select2({
//		theme : "classic",
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
}

/** Funcionalidad Modificar/Eliminar Interviniente de la lista de Intervinientes * */
function cargaCamposInterviniente(datosInterv) {
	disposicionValCombo = datosInterv.disposicionVal;
	tipoValCombo = datosInterv.tipoVal;
	
	boolDispCombo = true;
	boolTipoCombo = true;
	
	$("#idInterviniente").val(datosInterv.denominacion);
	
	$("#txtOrden").val(datosInterv.id);
	$("#txtOrden").prop("disabled", false);

	cargaCombosInterv(tipoValCombo, disposicionValCombo);
		
	
	// Llamar al servicio Persona y cargar de nuevo los datos de Test y Perfil
	ajaxPersona(datosInterv);

	
}

function ajaxPersona(datosPersona) {

	if (datosPersona != null) {
		var ajax_cliente = {
			"tipoPersona" : datosPersona.tipoPersona,
			"cliente" : datosPersona.cliente

		}
		$.ajax({
			//url : '../json/cliente.json',
			url:'/select/rest/json/Persona',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_cliente),
			type : 'POST',
			cache : false,
			success : function(data) {
				if(data["ERROR"] === undefined){
					persona = data;
					cargaStatusTest(data.dTest);
					cargaPerfilCliente(data.dPerfil);
					
					
				}else{
					
					persona = null;
					limpiarCamposInterv();
					//alert("ERROR" + data.ERROR);
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
}

/** Funcionalidad Modificar Interviniente * */
$("#btnModificarInterv").on('click',function() {
	var indiceModificar = parseInt(modificarOrdenInterv.id)-1;
	var indiceOrden = parseInt( $("#txtOrden").val())-1;
	var intervModificado = {};
	var arrayTabla = [];
	//Interviniente modificado
	//Si no detetcta ningun cambio en el combo

	
	if( $("#comboTipoIntervencion :selected").val() == -1 && $("#comboDisposicion :selected").val() != -1 ){
		intervModificado = {
				"id" : $("#txtOrden").val(),
				"tipopersona" : listaInterviniente.tipopersona,
				"cliente" : listaInterviniente.cliente,
				"tipodocumento" : listaInterviniente.tipodocumento,
				"tdocumento" : listaInterviniente.tdocumento,
				"documento" : listaInterviniente.documento,
				"denominacion" : listaInterviniente.denominacion,
				"tipo" : listaInterviniente.tipo,
				"tipoVal" : listaInterviniente.tipoVal,
				"estado" : $("#idEstadoTest").val(),
				"perfil" : $("#idPerfil").val(),
				"disposicion" : $("#comboDisposicion :selected").text(),
				"disposicionVal" : $("#comboDisposicion :selected").val(),
				 "tipoPersona" :listaInterviniente.tipoPersona,
				"dPerfil" :persona.perfil
		};
		
	}else if($("#comboDisposicion :selected").val() == -1 && $("#comboTipoIntervencion :selected").val() != -1){
		intervModificado = {
				"id" : $("#txtOrden").val(),
				"tipopersona" : listaInterviniente.tipopersona,
				"cliente" : listaInterviniente.cliente,
				"tipodocumento" : listaInterviniente.tipodocumento,
				"tdocumento" : listaInterviniente.tdocumento,
				"documento" : listaInterviniente.documento,
				"denominacion" : listaInterviniente.denominacion,
				"tipo" : $("#comboTipoIntervencion :selected").text(),
				"tipoVal" : $("#comboTipoIntervencion :selected").val(),
				"estado" : $("#idEstadoTest").val(),
				"perfil" : $("#idPerfil").val(),
				"disposicion" : listaInterviniente.disposicion,
				"disposicionVal" : listaInterviniente.disposicionVal,
				 "tipoPersona" :listaInterviniente.tipoPersona,
				"dPerfil" :persona.perfil
		};
	}else if($("#comboDisposicion :selected").val() == -1 && $("#comboTipoIntervencion :selected").val() == -1){
		intervModificado = {
				"id" : $("#txtOrden").val(),
				"tipopersona" : listaInterviniente.tipopersona,
				"cliente" : listaInterviniente.cliente,
				"tipodocumento" : listaInterviniente.tipodocumento,
				"tdocumento" : listaInterviniente.tdocumento,
				"documento" : listaInterviniente.documento,
				"denominacion" : listaInterviniente.denominacion,
				"tipo" : listaInterviniente.tipo,
				"tipoVal" : listaInterviniente.tipoVal,
				"estado" : $("#idEstadoTest").val(),
				"perfil" : $("#idPerfil").val(),
				"disposicion" : listaInterviniente.disposicion,
				"disposicionVal" : listaInterviniente.disposicionVal,
				 "tipoPersona" :listaInterviniente.tipoPersona,
				"dPerfil" :persona.perfil
		};
	}else{
		intervModificado = {
				"id" : $("#txtOrden").val(),
				"tipopersona" : listaInterviniente.tipopersona,
				"cliente" : listaInterviniente.cliente,
				"tipodocumento" : listaInterviniente.tipodocumento,
				"tdocumento" : listaInterviniente.tdocumento,
				"documento" : listaInterviniente.documento,
				"denominacion" : listaInterviniente.denominacion,
				"tipo" : $("#comboTipoIntervencion :selected").text(),
				"tipoVal" : $("#comboTipoIntervencion :selected").val(),
				"estado" : $("#idEstadoTest").val(),
				"perfil" : $("#idPerfil").val(),
				"disposicion" : $("#comboDisposicion :selected").text(),
				"disposicionVal" : $("#comboDisposicion :selected").val(),
				 "tipoPersona" :listaInterviniente.tipoPersona,
				"dPerfil" :persona.perfil
		};
	}
	
	
	if(indiceOrden != indiceModificar){

		tablaIntervinientes.row(indiceModificar).data(intervModificado).draw();

		
		for(var j = 0; j<tablaIntervinientes.page.info().recordsTotal; j++){
			arrayTabla.push(tablaIntervinientes.row(j).data());
		}
		
		tablaIntervinientes.clear().draw();
		
		//En la posicion-1 en la que tengo que insertar hago un splice
		//Borro el elemento duplicado que estaba en la posicion original
		
		
		if(indiceOrden < indiceModificar){
			var indexAsc = indiceOrden;
			indexAsc;
			var indexModAsc = indiceModificar;
			indexModAsc++;
			arrayTabla.splice(indexAsc,0,arrayTabla[indiceModificar]);
			
			arrayTabla.splice(indexModAsc,1);
			for(var i = indexAsc+1; i<=indiceModificar ; i++){
				arrayTabla[i].id = parseInt(arrayTabla[i].id)+1;
			}
			
			
		}else if(indiceOrden > indiceModificar){
			var indexDesc = indiceOrden;
			indexDesc++;
			var indexModDesc = indiceModificar;
			indexModDesc++;
			arrayTabla.splice(indexDesc,0,arrayTabla[indiceModificar]);
			arrayTabla.splice(indiceModificar,1);
			
			
			for(var i = indiceModificar; i<indiceOrden ; i++){
				arrayTabla[i].id = parseInt(arrayTabla[i].id)-1;
			}
			
		}
		
		for(var k = 0; k<arrayTabla.length; k++){
			tablaIntervinientes.row.add(arrayTabla[k]).draw(this);
		}
		

	}
	else{
		tablaIntervinientes.row(indiceModificar).data(intervModificado).draw(this);

	}
	
	//Si cambio algo en Interviniente se limpia Productos
	if($("#comboDisposicion :selected").val() != -1 || $("#comboTipoIntervencion :selected").val() != -1){
		limpiarProductos();
	}
	limpiarCamposInterv();
	
	
	
	
	
});

/** Funcionalidad que Elimina un Interviniente **/
$("#btnBorrarInterv").on('click', function() {

	tablaIntervinientes.row(indexDelete).remove().draw();
	var modicadoInterv = null;
	for(var i = 0; i< tablaIntervinientes.page.info().recordsTotal; i++){
		modicadoInterv = tablaIntervinientes.row(i).data();
		modicadoInterv.id = i+1;
		tablaIntervinientes.row(i).data(modicadoInterv).draw();
	}
	
	if(tablaIntervinientes.page.info().recordsTotal == 0){
		$("#idContinuar").prop("disabled", true);
	}
	limpiarProductos();
	limpiarCamposInterv();
	listaPersona = null;
});

/** Funcionalidad que limpia los campos de Interviniente **/
function limpiarCamposInterv() {
	$("#idBuscar").prop("disabled", false);
	$("#idBuscar > span").removeClass();
	$("#idBuscar > span").addClass("lupa");
	
	$("#txtOrden").prop("disabled", true);
	$("#btnAddInterv").prop("disabled", true);
	$("#idRefrescarEstado").prop("disabled", true);
	$("#idRefrescarEstado > span").removeClass();
	$("#idRefrescarEstado > span").addClass("infoDisabled");
	
	$("#idRefrescarPerfil").prop("disabled", true);
	$("#idRefrescarPerfil > span").removeClass();
	$("#idRefrescarPerfil > span").addClass("refreshDisabled");
	
	$("#txtOrden").val("");
	$("#idInterviniente").val("");
	$("#idEstadoTest").val("");
	$("#idPerfil").val("");
	tablaIntervinientes.$('tr.selected').removeClass('selected');

	$('#btnModificarInterv').prop('disabled', true);
	$('#btnBorrarInterv').prop('disabled', true);

	$('#comboDisposicion').html('<option value="-1"></option>');
	$('#comboDisposicion').select2('destroy');
	$('#comboDisposicion').select2({
		disabled: true,
		width : "100%"
	});
	
	$('#comboTipoIntervencion').html('<option value="-1"></option>');
	$('#comboTipoIntervencion').select2('destroy');
	$('#comboTipoIntervencion').select2({
		disabled: true,
		width : "100%"
	});
}


function listaValidacion(){
	var listaVal = [];
	var validaIntervinientes = {
			intervinientes: listaVal,
			dispCartera:$("#comboDispCartera  :selected").val(),
			"oficina": $("txtSucursal").val()
	};
	var datosInterviniente= {
			"cliente": "",
			"tipoPersona": "",
			"disposicion": "",
			"fIntervencion": "",
			"perfil": ""		
	};
	for(var i=0; i < tablaIntervinientes.page.info().recordsTotal; i++ ){
		datosInterviniente.cliente = parseInt(tablaIntervinientes.row(i).data().cliente);
		datosInterviniente.tipoPersona = tablaIntervinientes.row(i).data().tipoPersona;
		datosInterviniente.disposicion = tablaIntervinientes.row(i).data().disposicionVal;
		datosInterviniente.fIntervencion = tablaIntervinientes.row(i).data().tipoVal;
		datosInterviniente.perfil = tablaIntervinientes.row(i).data().dPerfil;
		
		
		listaVal.push(datosInterviniente);
		datosInterviniente= {
				"codigo": "",
				"tipoPersona": "",
				"disposicion": "",
				"fIntervencion": "",
				"perfil": ""
		};

	}
	
	validaIntervinientes.intervinientes = listaVal;
	
	return validaIntervinientes;
	
	
}

function listaCuentasClientes(){
	var listaValClientes = [];
	var datosInterviniente= {
			"tipopersona": "",
			"codigopersona": "",
			"documento": "",
			"nombre": "",
			"tipo": ""	,
			"tipoPers": "",
			"fIntervencion" : ""
	};
	for(var i=0; i < tablaIntervinientes.page.info().recordsTotal; i++ ){
		datosInterviniente.codigopersona = parseInt(tablaIntervinientes.row(i).data().cliente);
		datosInterviniente.tipoPers = tablaIntervinientes.row(i).data().tipoPersona;
		datosInterviniente.documento = tablaIntervinientes.row(i).data().documento;
		datosInterviniente.nombre = tablaIntervinientes.row(i).data().denominacion;
		datosInterviniente.fIntervencion = tablaIntervinientes.row(i).data().tipoVal;
		datosInterviniente.tipo = tablaIntervinientes.row(i).data().tipo;
		datosInterviniente.tipopersona = tablaIntervinientes.row(i).data().tipopersona;
		
		
		listaValClientes.push(datosInterviniente);
		datosInterviniente= {
				"tipopersona": "",
				"codigopersona": "",
				"documento": "",
				"nombre": "",
				"tipo": ""	,
				"tipoPers": "",
				"fIntervencion" : ""
		};

	}
	
	
	return listaValClientes;
	
	
}

function cargaProductos(datos){
	cargaCombo(datos.tAgrupacion, "#comboTipoAgrup");
	$("#comboTipoAgrup").prop('disabled', false);
	
	cargaCombo(datos.perfilCartera, "#comboPerfil");
	$("#comboPerfil").prop('disabled', false);
	primerTitular = datos.primerTitular;
}

function cargaCuentasAjax(valTipoCartera){
	var listaIntervCuentas = listaValidacion().intervinientes;
	var cuentasAjax = {
			intervinientes: "",
			"busqueda":"CASO",   
			tCartera: ""
	};
	
	var target = document.getElementById('idRefrescarCuenta');
	var spinner = new Spinner(optionsSpin).spin(target);
	
	cuentasAjax.intervinientes = listaIntervCuentas;
	cuentasAjax.tCartera = valTipoCartera;
	
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/Productos',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(cuentasAjax),
		type : 'POST',
		cache : false,
		beforeSend: function() {
			$("#idRefrescarCuenta").css("color", "#E9E9E9");
			$(target).data('spinner', spinner);
			$("#idRefrescarCuenta").prop("disabled", true);
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idRefrescarCuenta").css("color", "#FF0000");
        	$("#idRefrescarCuenta").prop("disabled", false);
        },
		success : function(data) {
			if(data["ERROR"] === undefined){
				
				if($("#idOtrasCuent").val()!=""){
					$("#idAceptar").prop("disabled", false);
				}
				cargaTablaProductos(data);
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
			}
			$("#idRefrescarCuenta").prop("disabled", false);
		},
		error : function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});
	
}

function cargaTablaProductos(datos){
	
	if(tablaProductos!= null){
		tablaProductos.clear();
		tablaProductos.settings()[0].oLanguage["sEmptyTable"] = "No hay registros";
		tablaProductos.rows.add(datos).draw();
	}
	
	
	tablaProductos.columns.adjust().draw();
	$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
	
}


function aceptarAlta(){
	var target = document.getElementById('idAceptar');
	var spinner = new Spinner(opts).spin(target);
		
	var listaIntervAceptar = [];
	var listaCuentasAceptar = [];
	var cuentaComisiones = {
			"empresa": "",
			"centro": "",
			"producto": "",
			"contrato": "",
			"control":"",
			"divisa":"",
			"sccc":""
	};
	var ajaxAceptar = {
			"intervinientes": listaIntervAceptar,
			"dispCartera": $("#comboDispCartera  :selected").val(),
			"tAgrupacion": $("#comboTipoAgrup  :selected").val(),
			"perfilCartera": $("#comboPerfil  :selected").val(),
			"tipoCartera" : $("#comboTipoCartera  :selected").val(),
			"estandar" : $("#comboEstandard  :selected").val(),
			"cuentas" : listaCuentasAceptar,
			"divisa": $("#idDivisa").val(),
			"oficina": $("#txtSucursal").val()
	};
	
	
	
	/* Lista Intervinientes */
	var datosInterviniente= {
			"cliente": "",
			"tipoPersona": "",
			"disposicion": "",
			"fIntervencion": "",
			"perfil": "",
			"documento": "",
			"tipoDocumento": "" 
	};
	for(var i=0; i < tablaIntervinientes.page.info().recordsTotal; i++ ){
		datosInterviniente.cliente = parseInt(tablaIntervinientes.row(i).data().cliente);
		datosInterviniente.tipoPersona = tablaIntervinientes.row(i).data().tipoPersona;
		datosInterviniente.disposicion = tablaIntervinientes.row(i).data().disposicionVal;
		datosInterviniente.fIntervencion = tablaIntervinientes.row(i).data().tipoVal;
		datosInterviniente.perfil = tablaIntervinientes.row(i).data().dPerfil;
		datosInterviniente.documento = tablaIntervinientes.row(i).data().documento;
		datosInterviniente.tipoDocumento = tablaIntervinientes.row(i).data().tdocumento;
		
		
		listaIntervAceptar.push(datosInterviniente);
		datosInterviniente= {
				"codigo": "",
				"tipoPersona": "",
				"disposicion": "",
				"fIntervencion": "",
				"perfil": ""
		};

	}
	
	/* Lista Cuentas */
	var datosCuenta= {
			"empresa": "",
			"centro": "",
			"producto": "",
			"contrato": "",
			"control":"",
			"divisa":"",
			"sccc":""
	};
	var productoSSelect = tablaProductos.rows('.selected').data();
	
	for(var i=0; i < tablaProductos.rows('.selected').data().length; i++ ){
		datosCuenta.empresa = productoSSelect[i].empresa;
		datosCuenta.centro = productoSSelect[i].centro;
		datosCuenta.producto = productoSSelect[i].producto;
		datosCuenta.contrato = productoSSelect[i].contrato;
		datosCuenta.control = productoSSelect[i].control;
		datosCuenta.divisa = productoSSelect[i].divisa;
		datosCuenta.sccc = productoSSelect[i].sccc;
		
		listaCuentasAceptar.push(datosCuenta);
		datosCuenta= {
				"empresa": "",
				"centro": "",
				"producto": "",
				"contrato": "",		
				"control": "",
				"divisa":"",
				"sccc":""
		};

	}
	
	ajaxAceptar.intervinientes = listaIntervAceptar;
	ajaxAceptar.cuentas = listaCuentasAceptar;
	
	if($("#idOtrasCuent").val() != "" && cuentaSelec!=null && $("input[type='radio'][name='radio']:checked").val()=="0"){
		cuentaComisiones.contrato = cuentaSelec.contrato;
		cuentaComisiones.empresa = cuentaSelec.empresa;
		cuentaComisiones.producto = cuentaSelec.producto;
		cuentaComisiones.centro = cuentaSelec.centro;
		cuentaComisiones.control = cuentaSelec.control;
		cuentaComisiones.divisa = cuentaSelec.divisa;
		cuentaComisiones.sccc = cuentaSelec.sccc;
		ajaxAceptar.cuentaComisiones = cuentaComisiones;
	}
	
	
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/AltaCartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajaxAceptar),
		type : 'POST',
		cache : false,
		beforeSend: function() {
			$("#idAceptar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idAceptar").prop("disabled", true);
			bloquearPantallaAlta();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idAceptar").css("color", "#fff");
        	$("#idAceptar").prop("disabled", false);
        	desbloquearPantallaAlta();
        },
		success : function(data) {
			if(data["ERROR"] === undefined){
				if(data.alta==true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					cartera = data.cartera;
					if(data["importeMinimo"] !== undefined){
						importeMinimo = data.importeMinimo
					}
					resguardo = data.datosResguardo;
					
					AltaOK();
					altaOKBool = true;
					
				}else{
					if(data.alta == false){
						AltaNoOK();
						$("#mensajeError").html(data.mensaje);
						$("#myModalERROR").modal('show');
					}
				}
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



$("#idAceptar").bind("click", function(e){
	
	var target = document.getElementById('idAceptar');
	var spinner = new Spinner(opts).spin(target);
		
	var listaIntervAceptar = [];
	var listaCuentasAceptar = [];
	var cuentaComisiones = {
			"empresa": "",
			"centro": "",
			"producto": "",
			"contrato": "",
			"control":"",
			"divisa":"",
			"sccc":""
	};
	var ajaxAceptar = {
			"intervinientes": listaIntervAceptar,
			"dispCartera": $("#comboDispCartera  :selected").val(),
			"tAgrupacion": $("#comboTipoAgrup  :selected").val(),
			"perfilCartera": $("#comboPerfil  :selected").val(),
			"tipoCartera" : $("#comboTipoCartera  :selected").val(),
			"estandar" : $("#comboEstandard  :selected").val(),
			"cuentas" : listaCuentasAceptar,
			"divisa": $("#idDivisa").val(),
			"oficina": $("#txtSucursal").val()
	};
	
	
	
	/* Lista Intervinientes */
	var datosInterviniente= {
			"cliente": "",
			"tipoPersona": "",
			"disposicion": "",
			"fIntervencion": "",
			"perfil": "",
			"documento": "",
			"tipoDocumento": "" 
	};
	for(var i=0; i < tablaIntervinientes.page.info().recordsTotal; i++ ){
		datosInterviniente.cliente = parseInt(tablaIntervinientes.row(i).data().cliente);
		datosInterviniente.tipoPersona = tablaIntervinientes.row(i).data().tipoPersona;
		datosInterviniente.disposicion = tablaIntervinientes.row(i).data().disposicionVal;
		datosInterviniente.fIntervencion = tablaIntervinientes.row(i).data().tipoVal;
		datosInterviniente.perfil = tablaIntervinientes.row(i).data().dPerfil;
		datosInterviniente.documento = tablaIntervinientes.row(i).data().documento;
		datosInterviniente.tipoDocumento = tablaIntervinientes.row(i).data().tdocumento;
		
		
		listaIntervAceptar.push(datosInterviniente);
		datosInterviniente= {
				"codigo": "",
				"tipoPersona": "",
				"disposicion": "",
				"fIntervencion": "",
				"perfil": ""
		};

	}
	
	/* Lista Cuentas */
	var datosCuenta= {
			"empresa": "",
			"centro": "",
			"producto": "",
			"contrato": "",
			"control":"",
			"divisa":"",
			"sccc":""
	};
	var productoSSelect = tablaProductos.rows('.selected').data();
	
	for(var i=0; i < tablaProductos.rows('.selected').data().length; i++ ){
		datosCuenta.empresa = productoSSelect[i].empresa;
		datosCuenta.centro = productoSSelect[i].centro;
		datosCuenta.producto = productoSSelect[i].producto;
		datosCuenta.contrato = productoSSelect[i].contrato;
		datosCuenta.control = productoSSelect[i].control;
		datosCuenta.divisa = productoSSelect[i].divisa;
		datosCuenta.sccc = productoSSelect[i].sccc;
		
		listaCuentasAceptar.push(datosCuenta);
		datosCuenta= {
				"empresa": "",
				"centro": "",
				"producto": "",
				"contrato": "",		
				"control": "",
				"divisa":"",
				"sccc":""
		};

	}
	
	ajaxAceptar.intervinientes = listaIntervAceptar;
	ajaxAceptar.cuentas = listaCuentasAceptar;
	
	if($("#idOtrasCuent").val() != "" && cuentaSelec!=null && $("input[type='radio'][name='radio']:checked").val()=="0"){
		cuentaComisiones.contrato = cuentaSelec.contrato;
		cuentaComisiones.empresa = cuentaSelec.empresa;
		cuentaComisiones.producto = cuentaSelec.producto;
		cuentaComisiones.centro = cuentaSelec.centro;
		cuentaComisiones.control = cuentaSelec.control;
		cuentaComisiones.divisa = cuentaSelec.divisa;
		cuentaComisiones.sccc = cuentaSelec.sccc;
		ajaxAceptar.cuentaComisiones = cuentaComisiones;
	}
	
	
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/AltaCartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajaxAceptar),
		type : 'POST',
		cache : false,
		beforeSend: function() {
			$("#idAceptar").css("color", "#ff2500");
			$(target).data('spinner', spinner);
			$("#idAceptar").prop("disabled", true);
			bloquearPantallaAlta();
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$("#idAceptar").css("color", "#fff");
        	$("#idAceptar").prop("disabled", false);
        	desbloquearPantallaAlta();
        },
		success : function(data) {
			if(data["ERROR"] === undefined){
				if(data.alta==true){
					$("#mensajeAlta").html(data.mensaje);
					$("#myModalOK").modal('show');
					cartera = data.cartera;
					if(data["importeMinimo"] !== undefined){
						importeMinimo = data.importeMinimo
					}
					resguardo = data.datosResguardo;
					
					AltaOK();
					
					
				}else{
					if(data.alta == false){
						AltaNoOK();
						$("#mensajeError").html(data.mensaje);
						$("#myModalERROR").modal('show');
					}
				}
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

/* Funcion que ordena los intervinientes  */
function ordenaIntervinientesAdd(){
	var indiceModificar = tablaIntervinientes.page.info().recordsTotal;
	indiceModificar--;
	var indiceOrden = parseInt( $("#txtOrden").val())-1;
	var arrayTabla = [];
	
	if(indiceOrden != indiceModificar){

		
		for(var j = 0; j<tablaIntervinientes.page.info().recordsTotal; j++){
			arrayTabla.push(tablaIntervinientes.row(j).data());
		}
		
		tablaIntervinientes.clear().draw();
		
		//En la posicion-1 en la que tengo que insertar hago un splice
		//Borro el elemento duplicado que estaba en la posicion original
		
		
		if(indiceOrden < indiceModificar){
			var indexAsc = indiceOrden;
			indexAsc;
			var indexModAsc = indiceModificar;
			indexModAsc++;
			arrayTabla.splice(indexAsc,0,arrayTabla[indiceModificar]);
			
			arrayTabla.splice(indexModAsc,1);
			for(var i = indexAsc+1; i<=indiceModificar ; i++){
				arrayTabla[i].id = parseInt(arrayTabla[i].id)+1;
			}
			
			
		}else if(indiceOrden > indiceModificar){
			var indexDesc = indiceOrden;
			indexDesc++;
			var indexModDesc = indiceModificar;
			indexModDesc++;
			arrayTabla.splice(indexDesc,0,arrayTabla[indiceModificar]);
			arrayTabla.splice(indiceModificar,1);
			
			
			for(var i = indiceModificar; i<indiceOrden ; i++){
				arrayTabla[i].id = parseInt(arrayTabla[i].id)-1;
			}
			
		}
		
		for(var k = 0; k<arrayTabla.length; k++){
			tablaIntervinientes.row.add(arrayTabla[k]).draw(this);
		}
		

	}
	
}

function limpiarProductos(){
	
	$("#idAceptar").prop("disabled", true);
	//Limpiar combo Tipo Agrupacion
	$('#comboTipoAgrup').html('<option value="-1"></option>');
	$('#comboTipoAgrup').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar combo Perfil
	$('#comboPerfil').html('<option value="-1"></option>');
	$('#comboPerfil').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar combo Tipo Cartera
	$('#comboTipoCartera').html('<option value="-1"></option>');
	$('#comboTipoCartera').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar combo Estandar
	$('#comboEstandard').html('<option value="-1"></option>');
	$('#comboEstandard').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar Divisa
	$("#idDivisa").val("");
	
	//Limpiar tabla productos
	tablaProductos.settings()[0].oLanguage["sEmptyTable"] = " ";
	tablaProductos.clear().draw();
	
	//Deshabilitar Radio Button
	$("input[name=radio][value=" + 1 + "]").prop('checked', true);
	$("#idOtrasCuentasSi").show();
	$("#idOtrasCuentasNo").hide();
	$("input[name='radio']").prop('disabled', true);
	
	//Limpiar Cuenta comisiones
	$("#idOtrasCuent").val("");
	
	//Deshabiliar Boton Consultar Cuentas
	$("#idRefrescarCuenta").prop('disabled', true);
	
	
}

function limpiarProductosContinuar(){
	
	$("#idAceptar").prop("disabled", true);
	//Limpiar combo Tipo Agrupacion
	$('#comboTipoAgrup').html('<option value="-1"></option>');
	$('#comboTipoAgrup').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar combo Perfil
	$('#comboPerfil').html('<option value="-1"></option>');
	$('#comboPerfil').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar combo Tipo Cartera
	$('#comboTipoCartera').html('<option value="-1"></option>');
	$('#comboTipoCartera').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar combo Estandar
	$('#comboEstandard').html('<option value="-1"></option>');
	$('#comboEstandard').select2({
		disabled: true,
		width : "100%"
	});
	
	//Limpiar Divisa
	$("#idDivisa").val("");
	
	//Limpiar tabla productos
	tablaProductos.settings()[0].oLanguage["sEmptyTable"] = " ";
	tablaProductos.clear().draw();
	
	//Deshabilitar Radio Button
	$("input[name=radio][value=" + 1 + "]").prop('checked', true);
	$("#idOtrasCuentasSi").show();
	$("#idOtrasCuentasNo").hide();
	$("input[name='radio']").prop('disabled', true);
	
	//Limpiar Cuenta comisiones
	$("#idOtrasCuent").val("");
	
	//Deshabiliar Boton Consultar Cuentas
	$("#idRefrescarCuenta").prop('disabled', true);
	
	
}

$("#idBtnAceptarError").bind('click', function(){
	$("#myModalERROR").modal('hide');
});

//Llamar de nuevo a AjaxPersona y cargar Perfil y estado
$("#idRefrescarPerfil").bind('click', function(){
	if(persona!=null){
		ajaxPersona(persona);
	}
});

$("#idBuscarCuentas").on("click", function(e){
//	selCuentasAlta();
	abrirModalCuentas();
});

/*Funcion que checkea que los combos de Intervinientes no están vacíos*/
//PRUEBA
function checkCombos(){
	var optDispCartera = $("#comboDispCartera :selected" ).val() != "-1";
	var optTipoInterv = $("#comboTipoIntervencion :selected" ).val() != "-1";
	var optDisposicion = $("#comboDisposicion :selected" ).val() != "-1";
	
	return (optDispCartera && optTipoInterv && optDisposicion);
}

//Inserta interviniente
function insertarInterviniente(listaPersona){
	
	var interviniente= {
			"id":  $("#txtOrden").val(),
			"tipopersona": listaPersona.dTipoPersona,
			"cliente": listaPersona.cliente,
			"tipodocumento": listaPersona.dtDocumento,
			"tdocumento" : listaPersona.tDocumento,
	        "nombre": listaPersona.denominacion,
	        "documento": listaPersona.nDocumento,
	        "tipo": $("#comboTipoIntervencion :selected" ).text(),
	        "tipoVal" : $("#comboTipoIntervencion :selected").val(),
	        "estado":  $("#idEstadoTest").val(),
	        "perfil": persona.dPerfil,
	        "disposicion": $("#comboDisposicion :selected" ).text(),
	        "disposicionVal" : $("#comboDisposicion :selected").val(),
	        "tipoPersona" :listaPersona.tipoPersona,
	        "dPerfil" :persona.perfil,
	        "bloquear":persona.bloquear
			  
	};
	return interviniente;
}

$("#idBuscarClienteLupa").bind("click", function(e){
	e.preventDefault();
	$("#tipoBusqueda").val("2").change();
	$("#myModalBuscar").modal('show');
});


function AltaOK(){
	altaOKBool = false;
	$("#idBtnAceptar").bind('click', function(){
		
		$("#inpCartera").val(cartera);
		$("#inpImporte").val(importeMinimo);
		$("#inpResguardo").val(JSON.stringify(resguardo));
	
		$("#form-alta").submit();
		
	});
}

function altaOKEnter(){
	altaOKBool = false;
	$("#inpCartera").val(cartera);
	$("#inpImporte").val(importeMinimo);
	$("#inpResguardo").val(JSON.stringify(resguardo));

	$("#form-alta").submit();
}

function AltaNoOK(){
	$("#idBtnAceptar").bind('click', function(){
		
	});
}

function ordenAdd(){
	addOrMod = false;
}

function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		success : function(data) {
			$("body").append(data);
			
		},
		dataType : "html"
	});
}


function cargarModalLocPersonas(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		complete: function(){
			iniciaCombos();
			iniciaTablaClientes();
			iniciaPaginadoresCliente();
			iniciaFormularioValidacion();
			locClienteAlta();
			$("#myModalBuscar").on("shown.bs.modal", function (event) {
				tablaClientes.columns.adjust().draw();
			 });
			
		},
		success : function(data) {
			$("body").append(data);
			
		},
		dataType : "html"
	});
}

function cargarModalBuscarCuentas(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		complete: function(){
			iniciaBotonesCuentas()
			iniciaTablasCuentas();
			selCuentasAlta();
			$("#myModalCuentas").on("shown.bs.modal", function (event) {
				tablaCuentas.columns.adjust().draw();
				tablaLocIntervinentes.columns.adjust().draw();
			 });
		},
		success : function(data) {
			$("body").append(data);
			
		},
		dataType : "html"
	});
}

/** Carga el modal de Sucursales **/
function cargarModalBuscarSucursal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		complete: function(){
			iniciaTablasSucursal();
			iniciaPaginadoresSucursal();
			iniciaCancelBoton();
			selSucursalAlta();
			$("#myModalSucursal").on("shown.bs.modal", function (event) {
				tablaSucursal.columns.adjust().draw();
			 });
		},
		success : function(data) {
			$("body").append(data);
			
		},
		dataType : "html"
	});
}

function cargaCombosInterv(tipoIntervencion, disposicion){
	/** Cargar combo Tipo de Intervencion **/
	var ajax_tipo_intervencion = {
		"concepto" : "TI"
	}
	
	
	$.ajax({
		url:'/select/rest/json/Conceptos',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_tipo_intervencion),
		type : 'POST',
		cache : true,
		complete: function(){
//			console.log(disposicion);
//			console.log($("#comboTipoIntervencion :selected").text());
			//$("#comboTipoIntervencion").change(tipoIntervencion);
			$("#comboTipoIntervencion").select2({
				minimumResultsForSearch : Infinity,
				width : "100%"
			});
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				$("#comboTipoIntervencion").prop('disabled', false);
				$("#comboTipoIntervencion").html('<option value="-1">Seleccionar...</option>');
				for (obj in data) {
					if(obj == tipoIntervencion){
						$("#comboTipoIntervencion").append('<option value="' + obj + '" selected>' + data[obj] + '</option>');
					}else{
						$("#comboTipoIntervencion").append('<option value="' + obj + '">' + data[obj] + '</option>');
					}
				}
				
				
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
				cargaComboVacio(idCombo);
			}
		},
		error : function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});
	
	
	/** Cargar combo Disposicion **/
	var ajax_concepto = {
			"tipo" : "CLI",
			"tipoCartera" : $("#comboDispCartera  :selected").val()
	};
	
	
	$.ajax({
		url:'/select/rest/json/Disposicion',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_concepto),
		type : 'POST',
		cache : true,
		complete: function(){
//			console.log(disposicion);
//			console.log($("#comboDisposicion :selected").text());
			//$("#comboDisposicion").change(disposicion);
			$("#comboDisposicion").select2({
				minimumResultsForSearch : Infinity,
				width : "100%"
			});
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				$("#comboDisposicion").prop('disabled', false);
				$("#comboDisposicion").select2('destroy');
				$("#comboDisposicion").html('<option value="-1">Seleccionar...</option>');
				for (obj in data) {
					if(obj == disposicion){
						$("#comboDisposicion").append('<option value="' + obj + '" selected="selected">' + data[obj] + '</option>');
					}else{
						$("#comboDisposicion").append('<option value="' + obj + '">' + data[obj] + '</option>');
					}
				}
				
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
				cargaComboVacio(idCombo);
			}
		},
		error : function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});
	
	
	
	
	
}

function bloquearPantallaAlta(){
	$("#comboDispCartera").prop("disabled", true);
	$('#comboDispCartera').select2('destroy');
	$('#comboDispCartera').prop('disabled', true);
	$('#comboDispCartera').select2();
	
	$("#comboTipoAgrup").prop("disabled", true);
	$('#comboTipoAgrup').select2('destroy');
	$('#comboTipoAgrup').prop('disabled', true);
	$('#comboTipoAgrup').select2();
	
	$("#comboTipoCartera").prop("disabled", true);
	$('#comboTipoCartera').select2('destroy');
	$('#comboTipoCartera').prop('disabled', true);
	$('#comboTipoCartera').select2();
	
	$("#comboEstandard").prop("disabled", true);
	$('#comboEstandard').select2('destroy');
	$('#comboEstandard').prop('disabled', true);
	$('#comboEstandard').select2();
	
	$("#comboPerfil").prop("disabled", true);
	$('#comboPerfil').select2('destroy');
	$('#comboPerfil').prop('disabled', true);
	$('#comboPerfil').select2();
	
	$("#idContinuar").prop("disabled", true);
	$("#idRefrescarCuenta").prop("disabled", true);
	$("input[name='radio']").prop('disabled', true);
	
	$("#idBuscar").prop("disabled", true);
	$("#idBuscar > span").removeClass();
	$("#idBuscar > span").addClass("lupaDisabled");
	
	$("#idBuscarEstandar").prop("disabled", true);
	$("#idBuscarEstandar > span").removeClass();
	$("#idBuscarEstandar > span").addClass("infoDisabled");
	
	$("#idBuscarCuentas").prop("disabled", true);
	$("#idBuscarCuentas > span").removeClass();
	$("#idBuscarCuentas > span").addClass("lupaDisabled");
	
	$("#idBuscarSucursal").prop("disabled", true);
	$("#idBuscarSucursal > span").removeClass();
	$("#idBuscarSucursal > span").addClass("lupaDisabled");
	
	noSelTabla = true;
	
	
}

function desbloquearPantallaAlta(){
	$("#comboDispCartera").prop("disabled", false);
	$('#comboDispCartera').select2('destroy');
	$('#comboDispCartera').prop('disabled', false);
	$('#comboDispCartera').select2({minimumResultsForSearch : Infinity,
			width : "100%"});
	
	$("#comboTipoAgrup").prop("disabled", false);
	$('#comboTipoAgrup').select2('destroy');
	$('#comboTipoAgrup').prop('disabled', false);
	$('#comboTipoAgrup').select2({minimumResultsForSearch : Infinity,
		width : "100%"});
	
	$("#comboTipoCartera").prop("disabled", false);
	$('#comboTipoCartera').select2('destroy');
	$('#comboTipoCartera').prop('disabled', false);
	$('#comboTipoCartera').select2({minimumResultsForSearch : Infinity,
		width : "100%"});
	
	$("#comboEstandard").prop("disabled", false);
	$('#comboEstandard').select2('destroy');
	$('#comboEstandard').prop('disabled', false);
	$('#comboEstandard').select2({minimumResultsForSearch : Infinity,
		width : "100%"});
	
	$("#comboPerfil").prop("disabled", false);
	$('#comboPerfil').select2('destroy');
	$('#comboPerfil').prop('disabled', false);
	$('#comboPerfil').select2({minimumResultsForSearch : Infinity,
		width : "100%"});
	
	$("#idContinuar").prop("disabled", false);
	$("#idRefrescarCuenta").prop("disabled", false);
	$("input[name='radio']").prop('disabled', false);
	
	$("#idBuscar").prop("disabled", false);
	$("#idBuscar > span").removeClass();
	$("#idBuscar > span").addClass("lupa");
	
	$("#idBuscarEstandar").prop("disabled", false);
	$("#idBuscarEstandar > span").removeClass();
	$("#idBuscarEstandar > span").addClass("info");
	
	$("#idBuscarCuentas").prop("disabled", false);
	$("#idBuscarCuentas > span").removeClass();
	$("#idBuscarCuentas > span").addClass("lupa");
	
	$("#idBuscarSucursal").prop("disabled", false);
	$("#idBuscarSucursal > span").removeClass();
	$("#idBuscarSucursal > span").addClass("lupa");
	
	noSelTabla = false;
	
	
}

//Lupa de Buscar sucursal
$("#idBuscarSucursal").on("click", function(e){

	$("#myModalSucursal").modal('show');
	$("#myModalSucursal").modal({"backdrop": "static"});
	
	ajaxSucursal();
	if(respBusqueda && respBusqueda.readystate != 4){
		respBusqueda.abort();
    }
	
	
});

/** Funcion que inicializa la oficina **/
function iniciaOficina(){
	var ajax_sucursal_usu = { 
	};
	var sucursalValUsu = "";
	
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/Usuario',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_sucursal_usu),
		type : 'POST',
		cache : false,
		complete: function(){
			$("#txtSucursal").val(sucursalValUsu);
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				sucursalValUsu = data.IDCENT;
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

function resolucionPantalla(anchoPantalla){
	if(anchoPantalla <= 1024){
		 $("#lblDispCartera").html("Disp. Cartera:");
		 $("#lblSucursalCont").html("Sucursal de Contrat.:");
		 $("#divLblOrden").removeClass("col-sm-3");
		 $("#divLblOrden").addClass("col-sm-4");
		 $("#divLblEstado").removeClass("col-sm-3");
		 $("#divLblEstado").addClass("col-sm-4");
		 $("#divInpEstado").css("width", "60%");
		 $("#divBtnEstado").css("width", "6.6%");
		 $("#divLblPerfil").removeClass("col-sm-3");
		 $("#divLblPerfil").addClass("col-sm-4");
		 $("#divInpPerfil").css("width", "60%");
		 $("#divBtnPerfil").css("width", "6.6%");
		 $("#divLblOtrasCuentas").removeClass("col-sm-10");
		 $("#divLblOtrasCuentas").addClass("col-sm-12");
		 
		 $("#btnModificarInterv").addClass("btnAlta");
		 
	 }else{
		 $("#lblDispCartera").html("Disposición Cartera:");
		 $("#lblSucursalCont").html("Sucursal de Contratación:");
		 $("#divLblOrden").removeClass("col-sm-4");
		 $("#divLblOrden").addClass("col-sm-3");
		 $("#divLblEstado").removeClass("col-sm-4");
		 $("#divLblEstado").addClass("col-sm-3");
		 $("#divInpEstado").css("width", "69%");
		 $("#divBtnEstado").css("width", "6%");
		 $("#divLblPerfil").removeClass("col-sm-4");
		 $("#divLblPerfil").addClass("col-sm-3");
		 $("#divInpPerfil").css("width", "69%");
		 $("#divBtnPerfil").css("width", "6%");
		 $("#divLblOtrasCuentas").addClass("col-sm-10");
		 $("#divLblOtrasCuentas").removeClass("col-sm-12");
		 
		 $("#btnModificarInterv").removeClass("btnAlta");
	 }
}


//Cuando se introduzca la sucursal se habiliata continuar si procede
//Descomentar si procede
/*
$("#txtSucursal").blur(function(){
	$('#contact-form').formValidation('updateStatus', 'sucursalAlta', 'NOT_VALIDATED').formValidation('revalidateField', 'sucursalAlta');
	if(tablaIntervinientes.page.info().recordsTotal > 0 && $('#contact-form').data('formValidation').isValidField('sucursalAlta')){
		$("#idContinuar").prop("disabled", false);
	}else{
		$("#idContinuar").prop("disabled", true);
	}
});
*/
	
