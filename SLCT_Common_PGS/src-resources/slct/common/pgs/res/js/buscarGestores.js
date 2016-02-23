/**
 * MODAL - Busqueda de Gestores
 */

var gestorSelected = null;
var tablaGestores = null;
var gestorSelec = null;

$(document).ready(function(){
	
});

/** INICIA TABLAS **/
function iniciaTablasGestores(){
	tablaGestores = $('#tabla-gestores').DataTable({
		"sScrollY" : 50,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		ordering : false,
		info : false,
		"aaData" : "",
		"columns" : [
		             {"data" : "codigo", "width": "25%"},
		             {"data" : "nombre","width" : "75%"}
		 ],
		"language" : {
			"zeroRecords" : "No hay registros"
		}
	});
	
	$('#tabla-gestores tbody').on('click','tr',function() {
		gestorSelec = tablaGestores.row(this).data();
		
		
		if(gestorSelec == null){
			$(this).removeClass('selected');
		}else{
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
				gestorSelec = null;
				deshabilitaBotonGestor();
			} else {
				habilitaBotonGestor();
				tablaGestores.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');

				
			}
		}
	});
	
	$("#idCancelGestoresModal").on('click', function(){
		$("#myModalGestores").modal('hide');
	});
	
	
}

function ajax_gestores(){
	//Llamar al servicio que recupera la lista de gestores
	var datosTablaGestores = "";
	var ajax_gestor = { 
	};
	
	$.ajax({
		//url : '../json/cliente.json',
		url:'/select/rest/json/Gestor',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_gestor),
		type : 'POST',
		cache : false,
		complete: function(){
			tablaGestores.clear();
			tablaGestores.rows.add(datosTablaGestores).draw();
		},
		success : function(data) {
			if(data["ERROR"] === undefined){
				datosTablaGestores = data;
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

function deshabilitaBotonGestor(){
	$("#idSelGestoresModal").prop("disabled", true);
}

function habilitaBotonGestor(){
	$("#idSelGestoresModal").prop("disabled", false);
}

function selGestoresValidacion(){
	$("#idSelGestoresModal").on('click', function() {
		if(gestorSelec != null){
			$("#inputGestorEmpresaVal").val(gestorSelec.contrato);
		}else{
			$("#inputGestorEmpresaVal").val("");
		}
	});
}

