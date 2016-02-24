/**
 * Buscador de Cuentas
 */

var tablaCuentas = null;
var listaIntervinienteLoc = null;
var intervSel = null;
var listaClientesOrigen = [];
var codCartera = null;
var cuentaAportacion = null;
var cuentaDestino;
var tablaLocIntervinentes = null;

$(document).ready(function(){
	
	
});

function iniciaBotonesCuentas(){
	$("#idSelCuentasModal").prop("disabled", true);
	$("#idCancelCuentasModal").on("click", function(e){
		$("#myModalCuentas").modal('hide');
		tablaCuentas.clear();
	});

	
	$('#panelFormularioBuscarCuentas').on('shown.bs.collapse', function () {
		$('#imgCollapseCuenta').prop("src",'/select/front/img/GbAreaV2CloseTrans.gif' );
		$("#tabla-cuentas_wrapper .dataTables_scrollBody" ).css({height: "90px"});
		tablaCuentas.columns.adjust().draw();
		});
	$('#panelFormularioBuscarCuentas').on('hidden.bs.collapse', function () {
		$('#imgCollapseCuenta').prop("src",'/select/front/img/GbAreaV2OpenTrans.gif' );
		$("#tabla-cuentas_wrapper .dataTables_scrollBody" ).css({height: "250px"});
		tablaCuentas.columns.adjust().draw();
	});
}

function iniciaTablasCuentas(){
	/** Inicializacion de Tabla Cuentas y tabla Clientes del buscador de cuentas **/
	tablaCuentas = $('#tabla-cuentas').DataTable( {
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
            { "data": "cuenta" },
            { "data": "descripcion" },
            { "data": "divisa" },
            { "data": "disposicion" },
            { "data": "empresa", "visible" : false },
            { "data": "centro", "visible" : false },
            { "data" : "producto","visible" : false},
            { "data" : "contrato","visible" : false},
            { "data" : "saldo","visible" : false},
            { "data" : "control","visible" : false},
            { "data" : "sccc","visible" : false}
        ],
        "language": {
	        "emptyTable":     "Seleccione un cliente"
	    }
    });
	
	$('#tabla-cuentas tbody').on('click','tr',function() {
		cuentaSelec = tablaCuentas.row(this).data();
		
		
		if(cuentaSelec == null){
			$(this).removeClass('selected');
		}else{
			cuentaAportacion = cuentaSelec;
			//codCartera = cuentaSelec.cartera;
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				cuentaSelec = null;
				$("#idSelCuentasModal").prop("disabled", true);
			} else {
				$("#idSelCuentasModal").prop("disabled", false);
				tablaCuentas.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');

				
			}
		}
	});
	
	tablaLocIntervinentes = $('#tabla-loc-intervinientes').DataTable( {
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
	        { "data": "tipopersona" },
	        { "data": "codigopersona" },
	        { "data": "documento" },
	        { "data": "nombre" },
	        { "data": "tipo" },
	        { "data": "tipo", "visible": false },
	        { "data": "fIntervencion","visible": false }
	    ],
	    "language": {
	        "emptyTable":     "No hay registros"
	    }
	});
	
	/** Tabla de intervinientes localizador cartera -- Seleccionar * */
	$('#tabla-loc-intervinientes tbody').on('click','tr',function() {
		intervSel = tablaLocIntervinentes.row(this).data();
		if(intervSel == null){
			$(this).removeClass('selected');
		}else{
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				listaIntervinienteLoc = null;
				tablaCuentas.settings()[0].oLanguage["sEmptyTable"] = "Seleccione un cliente";
				tablaCuentas.clear().draw();
				$("#idSelCuentasModal").prop("disabled", true);
			} else {
				
				tablaLocIntervinentes.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				var clienteSel = {
						"cliente": 0,
			            "tipoPersona":"",
			            "fIntervencion": ""
				}
				
				
				if(intervSel.cliente === undefined){
					//Lupa cuentas Alta
					clienteSel.cliente = tablaLocIntervinentes.row(this).data().codigopersona;
					clienteSel.tipoPersona = tablaLocIntervinentes.row(this).data().tipoPers;
					clienteSel.fIntervencion = tablaLocIntervinentes.row(this).data().fIntervencion;
					
					var ajax_cuenta_cliente = {
							"busqueda":"CCOM",   // Cuentas comisiones
					         "cliente" : clienteSel,
					         "divisa": $("#idDivisa").val(),
					         "tCartera": $("#comboTipoCartera  :selected").val()  // Valor del combo Tipo de cartera
		
					}
				}else if($("#headerTitulo").length != 0){
					if(document.getElementById("headerTitulo").innerHTML == "Modificación"){
						//Lupa cuentas modificacion
						clienteSel.cliente = tablaLocIntervinentes.row(this).data().cliente;
						clienteSel.tipoPersona = tablaLocIntervinentes.row(this).data().tipoPersona;
						clienteSel.fIntervencion = tablaLocIntervinentes.row(this).data().tIntervencion;
						var ajax_cuenta_cliente = {
								"busqueda":"CCOM",   // Cuentas comisiones
						         "cliente" : clienteSel,
						         "cartera": codCartera  // Valor del combo Tipo de cartera
			
						}
					}
					else{
						//Lupa cuentas resto de pantallas
						clienteSel.cliente = tablaLocIntervinentes.row(this).data().cliente;
						clienteSel.tipoPersona = tablaLocIntervinentes.row(this).data().tipoPersona;
						clienteSel.fIntervencion = tablaLocIntervinentes.row(this).data().tIntervencion;
						
						
						var ajax_cuenta_cliente = {
								"busqueda":"CORI",   // Cuentas comisiones
						         "cliente" : clienteSel,
						         "cartera": codCartera  // Valor del combo Tipo de cartera
			
						}
					}
				}else{
					//Lupa cuentas resto de pantallas
					clienteSel.cliente = tablaLocIntervinentes.row(this).data().cliente;
					clienteSel.tipoPersona = tablaLocIntervinentes.row(this).data().tipoPersona;
					clienteSel.fIntervencion = tablaLocIntervinentes.row(this).data().tIntervencion;
					
					
					var ajax_cuenta_cliente = {
							"busqueda":"CORI",   // Cuentas comisiones
					         "cliente" : clienteSel,
					         "cartera": codCartera  // Valor del combo Tipo de cartera
		
					}
				}
				
				
				
				
				cargaCuentasLupaAjax(ajax_cuenta_cliente);
			}
		}
	});
	
	
}

function cuentaSeleccionada(){
	return cuentaAportacion;
}

function setCarteraAportacion(cartera){
	codCartera = cartera;
}

function selCuentasAlta(){
	$("#idSelCuentasModal").on("click", function(e){
		$("#myModalCuentas").modal('hide');
		$("#idOtrasCuent").val(cuentaSelec.cuenta);		
		
		if(tablaProductos.rows('.selected').data().length == 0 || $("#comboEstandard  :selected").val()==-1){
			$("#idAceptar").prop("disabled", true);
		}else{
			$("#idAceptar").prop("disabled", false);
		}
		tablaCuentas.draw().clear();
		tablaLocIntervinentes.clear().draw();
	});
}









//Carga las tabla de intervinientes desde la pantalla de alta
function abrirModalCuentas(){
	$("#idSelCuentasModal").prop("disabled", true);

	tablaCuentas.settings()[0].oLanguage["sEmptyTable"] = "Seleccione un cliente";
	listaIntervinienteLoc = listaCuentasClientes();
	$("#myModalCuentas").modal('show');
	
	if(tablaLocIntervinentes != null){
		tablaLocIntervinentes.clear();
		tablaLocIntervinentes.rows.add(listaIntervinienteLoc).draw();
	}

}
/*Fin Click #idBuscarCuentas*/	

function cargaCuentasLupaAjax(ajax_cuenta){
	var datosCuentas = null;
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/Productos',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cuenta),
		type : 'POST',
		cache : false,
		complete: function(){
			tablaCuentas.clear();
			tablaCuentas.settings()[0].oLanguage["sEmptyTable"] = "No hay registros";
			tablaCuentas.rows.add(datosCuentas).draw();
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				datosCuentas = data;
				
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


function listaCuentasClientesOrigen(numCartera){
	listaClientesOrigen = [];
	
	var ajax_interv_cartera =  {
		"cartera": numCartera,
		"consulta":"INT"
	};
	
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/Cartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_interv_cartera),
		type : 'POST',
		cache : false,
		complete: function(data){
			listaClientesOrigen  = data.intervinientes;
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				listaClientesOrigen  = data.intervinientes;	
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