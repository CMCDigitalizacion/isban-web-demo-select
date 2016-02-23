/**
 * Buscador de Cuentas
 */

var tablaCuentasMod = null;
var listaIntervinienteLocMod = null;
var intervSelMod = null;
var listaClientesOrigenMod = [];
var codCarteraMod = null;
var cuentaDestinoMod;
var tablaLocIntervinentesMod = null;
var cuentaAportacion = null;
var cuentaSelecMod = null;

$(document).ready(function(){
	
});

function iniciaTablasCuentasMod(){
$("#idSelCuentasModal").prop("disabled", true);
	
	/** Inicializacion de Tabla Cuentas y tabla Clientes del buscador de cuentas **/
	tablaCuentasMod = $('#tabla-cuentas').DataTable( {
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
            { "data" : "sccc","visible" : false},
            { "data" : "participaciones","visible" : false},
            { "data" : "valoracion","visible" : false}
        ],
        "language": {
	        "emptyTable":     "Seleccione un cliente"
	    }
    });

	$('#tabla-cuentas tbody').on('click','tr',function() {
		cuentaSelecMod = tablaCuentasMod.row(this).data();
		
		
		if(cuentaSelecMod == null){
			$(this).removeClass('selected');
		}else{
			cuentaAportacion = cuentaSelecMod;
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				cuentaSelecMod = null;
				$("#idSelCuentasModal").prop("disabled", true);
			} else {
				$("#idSelCuentasModal").prop("disabled", false);
				tablaCuentasMod.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');

				
			}
		}
	});
	
	tablaLocIntervinentesMod = $('#tabla-loc-intervinientes').DataTable( {
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
	        { "data": "tipoPersona" },
	        { "data": "cliente" },
	        { "data": "documento" },
	        { "data": "denominacion" },
	        { "data": "dTIntervencion" },
	        { "data": "tIntervencion","visible": false }
	    ],
	    "language": {
	        "emptyTable":     "No hay registros"
	    }
	});
	
	
	/** Tabla de intervinientes localizador cartera -- Seleccionar * */
	$('#tabla-loc-intervinientes tbody').on('click','tr',function() {
		intervSelMod = tablaLocIntervinentesMod.row(this).data();
		if(intervSelMod == null){
			$(this).removeClass('selected');
		}else{
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				listaIntervinienteLocMod = null;
				tablaCuentasMod.settings()[0].oLanguage["sEmptyTable"] = "Seleccione un cliente";
				tablaCuentasMod.clear().draw();
				$("#idSelCuentasModal").prop("disabled", true);
			} else {
				
				tablaLocIntervinentesMod.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
				var clienteSel = {
						"cliente": 0,
			            "tipoPersona":"",
			            "fIntervencion": ""
				}
				
				if($("#headerTitulo").length != 0){
					if(document.getElementById("headerTitulo").innerHTML == "Modificación"){
						//Lupa cuentas modificacion
						clienteSel.cliente = tablaLocIntervinentesMod.row(this).data().cliente;
						clienteSel.tipoPersona = tablaLocIntervinentesMod.row(this).data().tipoPersona;
						clienteSel.fIntervencion = tablaLocIntervinentesMod.row(this).data().tIntervencion;
						var ajax_cuenta_cliente = {
								"busqueda":"CCOM",   // Cuentas comisiones
						         "cliente" : clienteSel,
						         "cartera": codCarteraMod  // Valor del combo Tipo de cartera
			
						}
					}
					else{
						//Lupa cuentas resto de pantallas
						clienteSel.cliente = tablaLocIntervinentesMod.row(this).data().cliente;
						clienteSel.tipoPersona = tablaLocIntervinentesMod.row(this).data().tipoPersona;
						clienteSel.fIntervencion = tablaLocIntervinentesMod.row(this).data().tIntervencion;
						
						
						var ajax_cuenta_cliente = {
								"busqueda":"CORI",   // Cuentas comisiones
						         "cliente" : clienteSel,
						         "cartera": codCarteraMod  // Valor del combo Tipo de cartera
			
						}
					}
				}else{
					//Lupa cuentas resto de pantallas
					clienteSel.cliente = tablaLocIntervinentesMod.row(this).data().cliente;
					clienteSel.tipoPersona = tablaLocIntervinentesMod.row(this).data().tipoPersona;
					clienteSel.fIntervencion = tablaLocIntervinentesMod.row(this).data().tIntervencion;
					
					
					var ajax_cuenta_cliente = {
							"busqueda":"CORI",   // Cuentas comisiones
					         "cliente" : clienteSel,
					         "cartera": codCarteraMod  // Valor del combo Tipo de cartera
		
					}
				}
				
				
				cargaCuentasLupaAjax(ajax_cuenta_cliente);
			}
		}
	});
	$('#panelFormularioBuscarCuentas').on('shown.bs.collapse', function () {
		$('#imgCollapseCuenta').prop("src",'/select/front/img/GbAreaV2CloseTrans.gif' );
		$("#tabla-cuentas_wrapper .dataTables_scrollBody" ).css({height: "90px"});
		tablaCuentasMod.columns.adjust().draw();
		
		});
	$('#panelFormularioBuscarCuentas').on('hidden.bs.collapse', function () {
		$('#imgCollapseCuenta').prop("src",'/select/front/img/GbAreaV2OpenTrans.gif' );
		$("#tabla-cuentas_wrapper .dataTables_scrollBody" ).css({height: "250px"});
		tablaCuentasMod.columns.adjust().draw();
	});
	
	$("#idCancelCuentasModal").on("click", function(e){
		$("#myModalCuentasMod").modal('hide');
		tablaCuentasMod.clear().draw();
		tablaLocIntervinentesMod.clear().draw();
	});

	$("#myModalCuentasMod").on("hidden.bs.modal", function (event) {
			tablaCuentasMod.clear().draw();
			tablaLocIntervinentesMod.clear().draw();
	 });
}

function cuentaSeleccionada(){
	return cuentaAportacion;
}

function setCarteraAportacion(cartera){
	codCarteraMod = cartera;
}



/**
 * Selecciona la cuenta y la pinta en el campo de cuenta de comisiones en Modificacion
 * @param cartera
 */
function selCuentasModificacion(cartera){
	codCarteraMod = cartera;
	$("#idSelCuentasModal").on("click", function(e){
		$("#myModalCuentasMod").modal('hide');
		$("#idOtrasCuent").val(cuentaSelecMod.cuenta);
		if(cuentaSelecMod != null){
			
			if($("#comboEstandarRef :selected").val()!=-1){ 
				$("#idModificar").prop("disabled", false); 
			 }else{
				 $("#idModificar").prop("disabled", true); 
			 }
			
		}
		else{
			$("#idBorrarCuentas").hide(); 
		}
		tablaCuentasMod.draw().clear();
		tablaLocIntervinentesMod.clear().draw();
	});

}

/**
 * Selecciona la cuenta y la pinta en el campo de cuenta de comisiones en Modificacion
 * @param cartera
 */
function selCuentasModificacion(cartera){
	codCarteraMod = cartera;
	$("#idSelCuentasModal").on("click", function(e){
		$("#myModalCuentasMod").modal('hide');
		$("#idOtrasCuent").val(cuentaSelecMod.cuenta);
		if(cuentaSelecMod != null){
			
			if($("#comboEstandarRef :selected").val()!=-1){ 
				$("#idModificar").prop("disabled", false); 
			 }else{
				 $("#idModificar").prop("disabled", true); 
			 }
			
		}
		else{
			$("#idBorrarCuentas").hide(); 
		}
		tablaCuentasMod.draw().clear();
		tablaLocIntervinentesMod.clear().draw();
	});

}

/**
 * Selecciona la cuenta y la pinta en el campo de cuenta de comisiones en Aportacion
 * @param cartera
 */
function selCuentasAportacion(cartera){
	codCarteraMod = cartera;
	$("#idSelCuentasModal").on("click", function(e){
		$("#myModalCuentasMod").modal('hide');
		$("#idCuentaOri").val(cuentaSelecMod.cuenta);
		if(cuentaSelecMod != null){
			setClienteCuenta(intervSelMod.cliente, intervSelMod.tipoPersona);
			$("#idImporte").prop("disabled", false);
			$("#idBorrarCuentas").show(); 
			if($("#idImporte").val()!=""){ 
				 $("#idFinalizar").prop("disabled", false); 
			 }else{
				 $("#idFinalizar").prop("disabled", true); 
			 }
			
		}
		else{
			$("#idBorrarCuentas").hide(); 
		}
		tablaCuentasMod.clear();
		tablaLocIntervinentesMod.clear();
	});

}

/**
 * Selecciona la cuenta y la pinta en el campo de cuenta de comisiones en Retirada
 * @param cartera
 */
function selCuentasRetirada(cartera){
	codCarteraMod = cartera;
	$("#idSelCuentasModal").on("click", function(e){
		$("#idImporte").prop("disabled", false);
		
		cuentaDestino = {
			      "control": cuentaSelecMod.control,
			      "divisa": cuentaSelecMod.divisa,
			      "centro": cuentaSelecMod.centro,
			      "empresa": cuentaSelecMod.empresa,
			      "descripcion": cuentaSelecMod.descripcion,
			      "producto": cuentaSelecMod.producto,
			      "cuenta": cuentaSelecMod.cuenta,
			      "saldo": cuentaSelecMod.saldo,
			      "contrato": cuentaSelecMod.contrato,
			      "sccc": cuentaSelecMod.sccc
			   }
		$("#myModalCuentasMod").modal('hide');
		$("#idCuentaOri").val(cuentaSelecMod.cuenta);
		if($("#idImporte").val() != ""){
			$("#idConfirmar").prop("disabled", false);
			$("#idConfirmar").removeClass("boton-disabled");
		}
		
		$("#idBorrarCuentaOri").show(); 

		tablaCuentasMod.clear();
		tablaLocIntervinentesMod.clear();
	});
	
}


//Carga la tabla de intervinientes y abre el modal de cuentas
function abrirModalCuentasSiga(numCartera){
	var datosTabla = null;
	$("#idSelCuentasModal").prop("disabled", true);
	$("#panelFormularioBuscarCuentas").collapse('show');
	
	tablaCuentasMod.settings()[0].oLanguage["sEmptyTable"] = "Seleccione un cliente";
	
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
		complete: function(){
			tablaLocIntervinentesMod.clear();
			tablaLocIntervinentesMod.rows.add(datosTabla).draw();
			$("#myModalCuentasMod").modal('show');
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				datosTabla  = data.intervinientes;
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
			tablaCuentasMod.clear();
			tablaCuentasMod.settings()[0].oLanguage["sEmptyTable"] = "No hay registros";
			tablaCuentasMod.rows.add(datosCuentas).draw();
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

