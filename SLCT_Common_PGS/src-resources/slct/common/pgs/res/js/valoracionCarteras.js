/**
 * 
 */
var fullDate = new Date();
var entrada = null;
var tablaIntervinientesVal = null;
//Options spinner
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

function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		success : function(data) {
			$("body").append(data);
		},
		dataType : "html"
	});
}

$(document).ready(function(){
	$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Consulta+de+cartera+ - +Valoracion&cartera="+idCarteraAux, function(data){
	    $("#idCabeceraCartera").prepend(data);
	    iniciaCabecera();
	    /* Cargar datos post */
		$("#idCartera").val(idCarteraAux);
		$("#idCliente").val(idClienteAux);
		$("#idContrato").val(idContratoAux);
		$("#idContrato").prop('title', idContratoAux);
		$("#idProducto").val(idProductoAux);
		$("#idProducto").prop('title', idProductoAux);
		$("#idNombreGestor").val(idNombreGestorAux);
		$("#idNombreGestor").prop('title',idNombreGestorAux);
		$("#idSituacion").val(idSituacionAux);
		$("#idDivisaRef").val(idDivisaRefAux);
		$("#idOficinaGestor").val(idOficinaGestorAux);
		$("#idOficinaGestor").prop('title',idOficinaGestorAux);
		$("#idFechaActivacion").val(idFechaActivacionAux);
		$("#idPerfilCartera").val(idPerfilCarteraAux);
		$("#idTelefonoGestor").val(idTelefonoGestorAux);
		$("#estRef").val(idEstandarRef);
		var twoDigitMonth = ((fullDate.getMonth()+1) > 9 )? (fullDate.getMonth())%12+1 : '0' +(fullDate.getMonth()+1);
		$('#input_dia').val(fullDate.getDate());
		$('#input_mes').val(twoDigitMonth);
		$('#input_year').val(fullDate.getFullYear());
		cargarTablaValoracion();
	});
	
	cargarModal("Error.html");
	cargarModal("ErrorServidor.html");
	cargarModal("Info.html");
	
	
	
	$("#pager-valoracion").hide();
	
	$("#input_date").on("click", function (){
		
	});
	
	$(function(){
		//Obtener fecha actual
		var twoDigitMonth = ((fullDate.getMonth()+1) > 9 )? (fullDate.getMonth())%12+1 : '0' +(fullDate.getMonth()+1);
		$('#input_dia').val(fullDate.getDate());
		$('#input_mes').val(twoDigitMonth);
		$('#input_year').val(fullDate.getFullYear());
		
		$('#input_date').datepicker({
			constrainInput: true,
            showOn: 'button',
            buttonImage:"../img/glyphicon_calendar_min.png",
            buttonImageOnly: true,
            buttonText: "Seleccionar fecha",
			dateFormat: "dd/mm/yy",
			dayNamesMin: [ "D", "L", "M", "X", "J", "V", "S" ],
			monthNames: [ "Enero", "Febrero", "Marzo", "Abril",
		                   "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
		                   "Octubre", "Noviembre", "Diciembre" ],
			firstDay: 1,
			onSelect: function(textDate, event){
				var fecha = textDate.split("/");
				$('#input_dia').val(fecha[0]);
				$('#input_mes').val(fecha[1]);
				$('#input_year').val(fecha[2]);
			}
		});

	});
	
	tablaIntervinientesVal = $('#tablaIntervVal').DataTable({
		"sScrollY" : 90,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paging : false,
		searching : false,
		"ordering": false,
		info : false,
		"aaData" : "",
		"columns" : [ 
		              {"data" : "activo"},
		              {"data" : "divisa"},
		              {"data" : "isin"},
		              {"data" : "titulos"},
		              {"data" : "valoracion"},
		              {"data" : "contravalor"},
		              {"data" : "cotizacion"},
		              {"data" : "coste"}
		            ],
		"language" : {
			"emptyTable" : "No hay datos"
		}
	});
	
	
});

$("#idVolver").on("click", function(e){
	$("#formCartera").attr("action", "/select/front/consulta");
	$("#formCartera").submit();
});

$("#idConsultar").on("click", function(e){
	cargarTablaValoracion();
});

function cargarTablaValoracion(){
	var dia = $("#input_dia").val();
	var mes = $("#input_mes").val();
	var año = $("#input_year").val();
	var fecha = dia+"/"+mes+"/"+año;
	var target = document.getElementById('idConsultar');
	var spinner = new Spinner(opts).spin(target);
	entrada = {
			"consulta":"VAL",
			"fFin": fecha
			};
	entrada.cartera = idCarteraAux;
	
	//Llamada al servicio para datos de cartera
	//url: /select/rest/json/Cartera
	if(isDate(fecha)){
		$.ajax({
			url:'/select/rest/json/Cartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(entrada),
			type : 'POST',
			cache : true,
			beforeSend: function() {
				$("#idConsultar").css("color", "#ff2500");
				$(target).data('spinner', spinner);
				$("#idConsultar").prop("disabled", true);
	        },
	        complete: function() {
	        	$(target).data('spinner').stop();
	        	$("#idConsultar").css("color", "#fff");
	        	$("#idConsultar").prop("disabled", false);
	        	
	        	if($("body").is(":hidden")){
	        		$("body").show();
	        		tablaIntervinientesVal.columns.adjust().draw();
	        	}
	        },
			success : function(data) {
				if(data["ERROR"] === undefined){
					var salida = data.valoracion;
					
					if(data.peticion == false){
						
						/** Tabla de Intervinientes (Valoraciones consulta)-- Definición * */
						tablaIntervinientesVal.clear();
						tablaIntervinientesVal.rows.add(salida).draw();
					} else {
						$("#mensajeInfo").html(data.mensaje);
						$("#myModalInfo").modal('show');
						tablaIntervinientesVal.clear().draw();
					}
					
				} else {
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
				};	
			},
			error : function(xhr, status, error) {
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
				$(target).data('spinner').stop();
			}
		});
	} else {
		$("#mensajeError").html("Introduce una fecha válida");
		if ($(target).data('spinner') != null){
			$(target).data('spinner').stop();
		}
		$("#myModalERROR").modal('show');
//		$("#labelFecha").focus();
		
	}
}
//function fechaOK(date){
//	return $.datepicker.parseDate('dd/mm/yy', date);
//};

/* Función que parsea la fecha */
function isDate(txtDate){
	  var currVal = txtDate;
	  if(currVal == '')
	    return false;
	   
	  //Declare Regex 
	  var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
	  var dtArray = currVal.match(rxDatePattern); // is format OK?
	  if (dtArray == null)
	     return false;
		 
	  //Checks for mm/dd/yyyy format.
	  dtDay = dtArray[1];
	  dtMonth= dtArray[3];
	  dtYear = dtArray[5];
	 
	  if (dtMonth < 1 || dtMonth > 12)
	      return false;
	  else if (dtDay < 1 || dtDay> 31)
	      return false;
	  else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
	      return false;
	  else if (dtMonth == 2)
	  {
	     var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
	     if (dtDay> 29 || (dtDay ==29 && !isleap))
	          return false;
	  }
	  return true;
};


//PAGINADOR - Adelante - Consulta - Valoracion
$('#btnPaginaBusq').on('click',function(){

	var ajax_cliente = null;
	var pagina = arrPagClientes.length;
	pagina--;
	
	/* Entrada */
	ajax_cliente = {
			"pagina": arrPagClientes[pagina]
	}
	
	$.ajax({
		url:'/select/rest/json/Cartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cliente),
		type : 'POST',
		dataType: "json", 
		cache: false,
		success:function(data){
			if(arrPagClientes.length == 1){
				$("#previous-clientes").removeClass("disabled");
				$("#btnPaginaBusqAtras").removeClass("disabled");
				
				$("#previous-clientes").prop("disabled", false);
				$("#btnPaginaBusqAtras").prop("disabled", false);
			}
			
			if(data["masDatos"] === undefined){
				$("#next-clientes").addClass("disabled");
				$("#btnPaginaBusq").addClass("disabled");
				
				$("#next-clientes").prop("disabled", true);
				$("#btnPaginaBusq").prop("disabled", true);
			}
			arrPagClientes.push(data.paginacion);
			
			var salida = data.valoracion;
			
			if(data.peticion == false){
				
				
				tablaIntervinientesVal.clear();
				tablaIntervinientesVal.rows.add(salida).draw();
			} else {
				$("#mensajeInfo").html(data.mensaje);
				$("#myModalInfo").modal('show');
				tablaIntervinientesVal.clear().draw();
			}
			
			tablaIntervinientesVal.columns.adjust().draw();
			
		},
		error: function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});
	
});

//PAGINADOR - Atras - Consulta - Valoracion
$('#btnPaginaBusqAtras').on('click',function(){
	
	var ajax_cliente = null;
	var target = document.getElementById('idBuscarCliente');
	var spinner = new Spinner(opts).spin(target);
	arrPagClientes.pop();
	var pagina = arrPagClientes.length-1;
	pagina--;
	
	/** Entrada **/
	ajax_cliente = {
		"pagina": arrPagClientes[pagina]
	}
		

	$.ajax({
		url:'/select/rest/json/Cartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cliente),
		type : 'POST',
		dataType: "json", 
		cache: false,
		success:function(data){
			$("#next-clientes").removeClass("disabled");
			$("#btnPaginaBusq").removeClass("disabled");
			
			$("#next-clientes").prop("disabled", false);
			$("#btnPaginaBusq").prop("disabled", false);
			if(arrPagClientes.length == 1 && data.masDatos==true){
				$("#previous-clientes").addClass("disabled");
				$("#btnPaginaBusqAtras").addClass("disabled");
				
				$("#previous-clientes").prop("disabled", true);
				$("#btnPaginaBusqAtras").prop("disabled", true);
				
			}
			
			if(arrPagClientes.length > 1 && data.masDatos==true){
				$("#previous-clientes").removeClass("disabled");
				$("#btnPaginaBusqAtras").removeClass("disabled");
				
				$("#previous-clientes").prop("disabled", false);
				$("#btnPaginaBusqAtras").prop("disabled", false);
			}
			
			
			var salida = data.valoracion;
			
			if(data.peticion == false){
				
				tablaIntervinientesVal.clear();
				tablaIntervinientesVal.rows.add(salida).draw();
			} else {
				$("#mensajeInfo").html(data.mensaje);
				$("#myModalInfo").modal('show');
				tablaIntervinientesVal.clear().draw();
			}
			
			tablaIntervinientesVal.columns.adjust().draw();
			
		},
		error: function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
		}
	});
	
});
