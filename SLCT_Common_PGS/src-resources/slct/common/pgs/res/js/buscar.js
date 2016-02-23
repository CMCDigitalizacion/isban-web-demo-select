/**
 * Funcionalidad que busca a un interviniente segun una serie de parametros de entrada
 */
var listaPersona = null;


var pagActualClientes = 0;
var datosClienteGuard =  {"pagina": " ", "paginacionCodPersona": " "};

var tablaClientes = null;
var listaIntervinientes = [];

var cuentaSelec = null;
var tablaLocIntervinentes= null;
var listaPersonaCartera = null;


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

$(document).ready(function(){
	
});

/** Funcion que inicia los combos al cargar el modal **/
function iniciaCombos(){
	$("#tipoBusqueda").select2({
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
	
	$("#tipoExtensiva").select2({
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
	
	$("#tipoPersona").select2({
		minimumResultsForSearch : Infinity,
		width : "100%"
	});
	/** Inicializa el combo Tipo de Documento **/
	var ajax_tipo_documento ={
			"concepto":"TDOC"
	}
	cargaComboAjaxLoc(ajax_tipo_documento, "#comboTipoDocumento", 'tipoDocumento');
	eventChangeCombo();
	
	$("#idBtnAceptar").on("click", function(e){
		$("#myModalOK").modal('hide');
	});
	
}

/** Funcion que inicia la tabla de Clientes **/
function iniciaTablaClientes(){
	$("#idSelCliente").prop("disabled", true);
	
	/* Inicializacion paginador */
	$("#pager-cuentas").hide();
	$("#pager-clientes").hide();
	tablaClientes = $('#tabla-clientes').DataTable({
		"sScrollY" : 90,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		ordering : false,
		info : false,
	    "aaData" : "",
        "columns": [
            { "data" : "tDocumento","visible" : false},
		    { "data": "dTipoPersona" },
			{ "data": "cliente" },
			{ "data": "denominacion" },
			{ "data": "dtDocumento" },
			{ "data": "nDocumento" },
			{ "data" : "tipoPersona","visible" : false}
        ],
		"language" : {
			"emptyTable" : "Seleccione un interviniente"
		}
	});
	
	/** Seleccionar cliente **/
	//tablaClientes.columns.adjust().draw();
	$('#tabla-clientes tbody').on('click', 'tr', function() {
		listaPersona = tablaClientes.row(this).data();
		listaPersonaCartera = tablaClientes.row(this).data();
		if(listaPersona == null){
			$(this).removeClass('selected');
		}else{ 
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				$("#idSelCliente").prop("disabled", true);
			} else {
				tablaClientes.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				$("#idSelCliente").prop("disabled", false);
			}
		}
	});
	
	$('#panelFormularioBuscar').on('shown.bs.collapse', function () {
		$('#imgCollapsePersona').prop("src",'/select/front/img/GbAreaV2CloseTrans.gif' );
		$( "#tabla-clientes_wrapper .dataTables_scrollBody" ).css({height: "90px"});
		tablaClientes.columns.adjust().draw();
		
		});
	$('#panelFormularioBuscar').on('hidden.bs.collapse', function () {
		$('#imgCollapsePersona').prop("src",'/select/front/img/GbAreaV2OpenTrans.gif' );
		$( "#tabla-clientes_wrapper .dataTables_scrollBody" ).css({height: "250px"});
		tablaClientes.columns.adjust().draw();
	});
}

/** Funcion que carga los combos **/
function cargaComboAjaxLoc(concepto, idCombo, fileJSON){
	var firstOption = "";
	$.ajax({
		//url:'../json/'+ fileJSON +'.json',
		url:'/select/rest/json/Conceptos',
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(concepto),
		type: 'POST',
		cache: true,
		success:function(data){
			if(data["ERROR"] === undefined){
				firstOption = cargaComboLoc(data, idCombo);
				$(idCombo).select2({
					  minimumResultsForSearch: Infinity,
					  width: "100%"
					});
				$(idCombo).val(firstOption); 
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



function cargaComboLoc(datos, idCombo){	
	var i = 0;
	var selected;
	var primerOpcion = "";
	if($.isEmptyObject(datos)){
		$(idCombo).append(new Option('Seleccionar', '0', true, true));
	}else{
		for(obj in datos){
			if(i == 0){
				$(idCombo).append('<option value="'+obj+'" selected="selected">'+datos[obj]+'</option>');
				primerOpcion = obj;

			}else{
				$(idCombo).append('<option value="'+obj+'">'+datos[obj]+'</option>');
			}
			i++;
		}
	}
	return primerOpcion;
	

}

/** Funcion que carga el evento change del combo tipo de busqueda de clientes */

function eventChangeCombo(){
	$('#tipoBusqueda').on('change', function(e){
		limpiarCamposCliente();
		$('#localizador-pers-form').formValidation('resetForm', true);
		if ($("#tipoBusqueda").val() == "2") {				
			$("#divDocument").show();
			$("#divTipoDocumento").show();
			$("#divCodigo").hide();
			$("#divTipoPersona").hide();
			$("#divExtensiva").hide();
			$("#divNombre").hide();
			$("#divApellido1").hide();
			$("#divApellido2").hide();
			$("#divDenSocial").hide();
		} else if ($("#tipoBusqueda").val() == "4") {				
			$("#divExtensiva").show();
			$("#divNombre").show();
			$("#divApellido1").show();
			$("#divApellido2").show();
			$("#divDocument").hide();
			$("#divTipoDocumento").hide();
			$("#divCodigo").hide();
			$("#divTipoPersona").hide();
			$("#divDenSocial").hide();	
		} else if ($("#tipoBusqueda").val() == "6") {				
			$("#divExtensiva").show();
			$("#divDenSocial").show();				
			$("#divNombre").hide();
			$("#divApellido1").hide();
			$("#divApellido2").hide();
			$("#divDocument").hide();
			$("#divTipoDocumento").hide();
			$("#divCodigo").hide();
			$("#divTipoPersona").hide();
		} else if ($("#tipoBusqueda").val() == "8") {				
			$("#divCodigo").show();
			$("#divTipoPersona").show();
			$("#divDocument").hide();
			$("#divTipoDocumento").hide();
			$("#divNombre").hide();
			$("#divApellido1").hide();
			$("#divApellido2").hide();
			$("#divExtensiva").hide();
			$("#divDenSocial").hide();	
		}
		else {
		}
	});
}

//Llamada Seleccionar desde Alta
function locClienteAlta(){
	$("#idSelCliente").bind("click",function(e){
		$("#myModalBuscar").modal('hide');
		limpiarCamposCliente();
		if(listaPersona!= null){
			ajaxPersonaSel(listaPersona);
			$("#idRefrescarEstado").prop("disabled", false);
			$("#idRefrescarEstado > span").removeClass();
			$("#idRefrescarEstado > span").addClass("info");
			
			$("#idRefrescarPerfil").prop("disabled", false);
			$("#idRefrescarPerfil > span").removeClass();
			$("#idRefrescarPerfil > span").addClass("refresh");
			
			
			//El orden maximo es el numero de registros de la tabla + 1
			
			ordenAdd();
		}
		
		
	});
}

//Llamada Seleccionar desde Localizador Carteras
function locClienteCarteras(){
	$("#idSelCliente").bind("click",function(e){
		$("#myModalBuscar").modal('hide');
		limpiarCamposCliente();
		
		//Si el modal de carteras esta abierto
		if(modalClientesAbierto == true){
			$("#inputNumCliente").val(listaPersonaCartera.cliente);
			if(listaPersonaCartera.tipoPersona == "F"){
				$("#comboTipoPersona").val("F").change();
			}else{
				$("#comboTipoPersona").val("J").change();
			}
		}else{
			//Si no esta abierto significa que estamos en la pantalla de Validacion
			$("#inputClienteVal").val(listaPersonaCartera.cliente);
			if(listaPersonaCartera.tipoPersona == "F"){
				$("#comboTipoPersonaVal").val("F").change();
			}else{
				$("#comboTipoPersonaVal").val("J").change();
			}
		}
		
		
	});
}

function cargaPerfilCliente(estado){
	$("#idPerfil").val(estado);
}
function cargaStatusTest(estado){
	$("#idEstadoTest").val(estado);
}







function ajaxPersonaSel(datosPersona){
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
					tablaIntervinientes.$('tr.selected').removeClass('selected');
					$("#idInterviniente").val(persona.denominacion);
					$("#txtOrden").prop("disabled", false);
					$("#btnAddInterv").prop('disabled', true);
					$('#btnModificarInterv').prop('disabled', true); 
					$('#btnBorrarInterv').prop('disabled', true); 
						
						
						
					$("#txtOrden").val(tablaIntervinientes.page.info().recordsTotal + 1);
					$('#contact-form').formValidation('updateOption', 'orden', 'between', 'max', tablaIntervinientes.page.info().recordsTotal + 1)
			        .formValidation('revalidateField', 'orden');
						
					/** Cargar combo Tipo de Intervencion * */
					var ajax_tipo_intervencion = {
						"concepto" : "TI"
					}
					cargaComboAjax(ajax_tipo_intervencion,"#comboTipoIntervencion", 'tipoIntervencion');
					$("#comboTipoIntervencion").prop('disabled', false);
						
					if($("#comboDispCartera  :selected").val()!=-1){
						$("#comboDispCartera").change();
					}
					
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


