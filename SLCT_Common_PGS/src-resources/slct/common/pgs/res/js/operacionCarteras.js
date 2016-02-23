/**
 * 
 */
var arrPagesOps = [];
var jsonOps = null;
var fullDate = new Date();
var fechaInicio;
var fechaFin;
var tablaIntervinientesOps = null;
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

$(document).ready(function(){
	$.get("/select/front/htm/modals/CabeceraCartera.jsp?header=Consulta+de+cartera+ - +Operaciones&cartera="+idCarteraAux, function(data){
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
		$("#idOficinaGestor").prop('title',idOficinaGestorAux)

		
		$("#idFechaActivacion").val(idFechaActivacionAux);
		$("#idPerfilCartera").val(idPerfilCarteraAux);
		$("#idTelefonoGestor").val(idTelefonoGestorAux);
		$("#estRef").val(idEstandarRef);
		
		$("body").show();
		tablaIntervinientesOps.columns.adjust().draw();
	});
	
	cargarModal("Error.html");
	cargarModal("ErrorServidor.html");
	
	$("#pager-operaciones").hide();
	
	$(function(){
		//Obtener fecha mes anterior
		//var twoDigitMonth = ((fullDate.getMonth().length) === 1)? (fullDate.getMonth()+1) :  '0' + (fullDate.getMonth());
		var twoDigitMonth = ((fullDate.getMonth()) > 9 )? (fullDate.getMonth()) : '0' +(fullDate.getMonth())%12;
//		var date = fullDate.getDate() + "/" + twoDigitMonth + "/" + fullDate.getFullYear();
		$('#input_dia_desde').val(fullDate.getDate());
		$('#input_mes_desde').val(twoDigitMonth);
		$('#input_year_desde').val(fullDate.getFullYear());
		$('#input_date_desde').datepicker({
			constrainInput: true,
            showOn: 'button',
            buttonImage:"../img/glyphicon_calendar_min.png",
            buttonImageOnly: true,
            buttonText: "Seleccionar fecha",
			dateFormat: "dd/mm/yy",
			defaultDate: "-1m",
			dayNamesMin: [ "D", "L", "M", "X", "J", "V", "S" ],
			monthNames: [ "Enero", "Febrero", "Marzo", "Abril",
		                   "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
		                   "Octubre", "Noviembre", "Diciembre" ],
		    firstDay: 1,
		    onSelect: function(textDate, event){
				var fecha = textDate.split("/");
				$('#input_dia_desde').val(fecha[0]);
				$('#input_mes_desde').val(fecha[1]);
				$('#input_year_desde').val(fecha[2]);
			}
		});

	});
	
	$(function(){
		//Obtener fecha mes actual
		var twoDigitMonth = ((fullDate.getMonth()+1) > 9 )? (fullDate.getMonth())%12+1 : '0' +(fullDate.getMonth()+1);
		
		$('#input_dia_hasta').val(fullDate.getDate());
		$('#input_mes_hasta').val(twoDigitMonth);
		$('#input_year_hasta').val(fullDate.getFullYear());
		$('#input_date_hasta').datepicker({
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
				$('#input_dia_hasta').val(fecha[0]);
				$('#input_mes_hasta').val(fecha[1]);
				$('#input_year_hasta').val(fecha[2]);
			}
		});

	});
	
	tablaIntervinientesOps = $('#tablaIntervOps').DataTable({
		"sScrollY" : 90,
		"scrollX" : true,
		"sScrollXInner" : "100%",
		destroy : true,
		paginate : false,
		searching : false,
		"ordering": false,
		info : false,
		"data" : jsonOps,
		"columns" : [ 
		              {"data" : "fecha"},
		              {"data" : "valor"}, 
		              {"data" : "descripcion"},
		              {"data" : "tipoOperacion"},
		              {"data" : "titulos"},
		              {"data" : "importe"},
		              {"data" : "divisa"}
		            ],
		"language" : {
			"emptyTable" : "No hay registros"
		}
	});
	
	/* Detección cambios fechas */
	$("#input_date_desde").on("change", function(){
		tablaIntervinientesOps.clear().draw();
		$("#pager-operaciones").hide();
		arrPagesOps = [];
	});
	$("#input_date_hasta").on("change", function(){
		tablaIntervinientesOps.clear().draw();
		$("#pager-operaciones").hide();
		arrPagesOps = [];
	});

	
	$("#idVolver").on("click", function(e){
		$("#formCartera").attr("action", "/select/front/consulta");
		$("#formCartera").submit();
	});

	$("#idConsultar").on("click", function(e){
		tablaIntervinientesOps.clear().draw();
		$("#pager-operaciones").hide();
		if(arrPagesOps.length != 0){
			arrPagesOps = [];
		}
		ajaxOperacionLista();
	});
});

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

//Llamada a Continuar
function ajaxOperacionLista(){
	var dia_desde = $("#input_dia_desde").val();
	var mes_desde = $("#input_mes_desde").val();
	var año_desde = $("#input_year_desde").val();
	fechaInicio = dia_desde+"/"+mes_desde+"/"+año_desde;
	var dia_hasta = $("#input_dia_hasta").val();
	var mes_hasta = $("#input_mes_hasta").val();
	var año_hasta = $("#input_year_hasta").val();
	fechaFin = dia_hasta+"/"+mes_hasta+"/"+año_hasta;
	var target = document.getElementById('idConsultar');
	
	
	if (validarFechas(fechaInicio,fechaFin)){	
		var spinner = new Spinner(opts).spin(target);
		var entrada = {
				"cartera":$("#idCartera").val(),
				"consulta":"OPE",
				"fInicio":fechaInicio,
				"fFin":fechaFin,
				"pagina": ""
				};
		
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
	        },
			success : function(data) {
					if(data["ERROR"] === undefined){
						/* Paginador */
						if(data["paginacion"] === undefined){
							$("#pager-operaciones").hide();
						}
						if(data.masDatos == true){
							if(arrPagesOps.length == 0){
								$("#previous-clientes").addClass("disabled");
								$("#btnPaginaBusqAtras").addClass("disabled");
								
								$("#previous-clientes").prop("disabled", true);
								$("#btnPaginaBusqAtras").prop("disabled", true);
								
								$("#next-clientes").removeClass("disabled");
								$("#btnPaginaBusq").removeClass("disabled");
								
								$("#next-clientes").prop("disabled", false);
								$("#btnPaginaBusq").prop("disabled", false);
							}
							$("#pager-operaciones").show();
							arrPagesOps.push(data.paginacion);
						}
						/* Fin paginador*/
						
						jsonOps = data.operaciones;
						
						tablaIntervinientesOps.clear();
						tablaIntervinientesOps.rows.add(jsonOps).draw();
						
					} else {
						$("#mensajeError").html(data.ERROR_MSG);
						$("#myModalERROR").modal('show');
					}
					
			},
			error : function(xhr, status, error) {
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
				$(target).data('spinner').stop();
			}
		});
	
	} else {
		$("#mensajeError").html("Introduce una fecha válida");
		$("#myModalERROR").modal('show');
		$(target).data('spinner').stop();
	}
	
}


//PAGINADOR - Adelante - Consulta
$('#btnPaginaBusq').on('click',function(){

	var ajax_cliente = null;
	var pagina = arrPagesOps.length;
	pagina--;
	var target = document.getElementById('next-clientes');
	var spinner = new Spinner(opts).spin(target);
	
	/* Entrada */
	ajax_cliente = {
		"cartera":$("#idCartera").val(),
		"consulta":"OPE",
		"fInicio":fechaInicio,
		"fFin":fechaFin,
		"pagina":arrPagesOps[pagina]
	};
	var masData;
	
	$.ajax({
		url:'/select/rest/json/Cartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cliente),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$('#btnPaginaBusq').attr('style', 'color: rgba(244, 178, 167, 1) !important');
			//$('#btnPaginaBusq').attr('style', 'color: #ff2500 !important');
			$("#next-clientes").addClass("disabled");
			$("#btnPaginaBusq").prop("disabled", true);
			$("#previous-clientes").addClass("disabled");
			$("#btnPaginaBusqAtras").prop("disabled", true);
			$(target).data('spinner', spinner);
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	$('#btnPaginaBusq').attr('style', 'color: #fff !important');
        	$("#previous-clientes").removeClass("disabled");
        	$("#btnPaginaBusqAtras").prop("disabled", false);
        	if(masData){
        		$("#next-clientes").removeClass("disabled");
                $("#btnPaginaBusq").prop("disabled", false);
        	}
        },
		success:function(data){
			if(arrPagesOps.length > 0){
				masData=data.masDatos;
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
			arrPagesOps.push(data.paginacion);
			
			jsonOps = data.operaciones;
			
			tablaIntervinientesOps.clear();
			tablaIntervinientesOps.rows.add(jsonOps).draw();
			
		},
		error: function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
			$(target).data('spinner').stop();
		}
	});
	
});

//PAGINADOR - Atras - Clientes
$('#btnPaginaBusqAtras').on('click',function(){
	
	var ajax_cliente = null;
	var paginaSave = arrPagesOps[arrPagesOps.length-1];
	arrPagesOps.pop();
	
	var pagina = arrPagesOps.length-1;
	pagina--;
	var target = document.getElementById('previous-clientes');
	var spinner = new Spinner(opts).spin(target);
	
	if(arrPagesOps.length == 0){
		/** Entrada **/
		$("#previous-clientes").addClass("disabled");
		$("#btnPaginaBusqAtras").prop("disabled", true);
		return;
		
	} else {
		/** Entrada **/
		ajax_cliente = {
				"cartera":$("#idCartera").val(),
				"consulta":"OPE",
				"fInicio":fechaInicio,
				"fFin":fechaFin,
				"pagina":arrPagesOps[pagina]
		}
	}
		
		

	$.ajax({
		url:'/select/rest/json/Cartera',
		contentType : "application/json; charset=utf-8",
		data : JSON.stringify(ajax_cliente),
		type : 'POST',
		dataType: "json", 
		cache: false,
		beforeSend: function() {
			$('#btnPaginaBusqAtras').attr('style', 'color: rgba(244, 178, 167, 1) !important');
			//S$("#btnPaginaBusqAtras").css("color", "#ff2500");
			$("#previous-clientes").addClass("disabled");
			$("#btnPaginaBusqAtras").prop("disabled", true);
			$("#next-clientes").addClass("disabled");
			$("#btnPaginaBusq").prop("disabled", true);
			$(target).data('spinner', spinner);
        },
        complete: function() {
        	$(target).data('spinner').stop();
        	//$("#btnPaginaBusqAtras").css("color", "#fff");
        	$('#btnPaginaBusqAtras').attr('style', 'color: #fff !important');
        	$("#next-clientes").removeClass("disabled");
        	
            $("#btnPaginaBusq").prop("disabled", false);
        	if(arrPagesOps.length <= 0 ){
	        	$("#previous-clientes").removeClass("disabled");
	        	$("#btnPaginaBusqAtras").prop("disabled", false);
        	}
        },
		success:function(data){
			if(data["ERROR"] === undefined){
				$("#next-clientes").removeClass("disabled");
				$("#btnPaginaBusq").removeClass("disabled");
				
				$("#next-clientes").prop("disabled", false);
				$("#btnPaginaBusq").prop("disabled", false);
				
				if(arrPagesOps.length > 0 && data.masDatos==true){
					$("#previous-clientes").removeClass("disabled");
					$("#btnPaginaBusqAtras").removeClass("disabled");
					
					$("#previous-clientes").prop("disabled", false);
					$("#btnPaginaBusqAtras").prop("disabled", false);
				} else {
					$("#previous-clientes").addClass("disabled");
					$("#btnPaginaBusqAtras").addClass("disabled");
					
					$("#previous-clientes").prop("disabled", true);
					$("#btnPaginaBusqAtras").prop("disabled", true);
				};
				
				if(arrPagesOps.length <= 1){
					$("#previous-clientes").addClass("disabled");
					$("#btnPaginaBusqAtras").addClass("disabled");
					
					$("#previous-clientes").prop("disabled", true);
					$("#btnPaginaBusqAtras").prop("disabled", true);
					
				}
				
				jsonOps = data.operaciones;
				
				tablaIntervinientesOps.clear();
				tablaIntervinientesOps.rows.add(jsonOps).draw();
			}else{
				$("#mensajeError").html(data.ERROR_MSG);
				$("#myModalERROR").modal('show');
				arrPagesOps.push(paginaSave);
				$(target).data('spinner').stop();
			}
			
			
		},
		error: function(xhr, status, error) {
			$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
			$("#myModalERRORTecnico").modal('show');
			$(target).data('spinner').stop();
		}
	});
	
});

function validarFechas(fini, ffin){
	from1 = fini.split("/");
	f1 = new Date(from1[2], from1[1] - 1, from1[0]);
	from2 = ffin.split("/");
	f2 = new Date(from2[2], from2[1] - 1, from2[0]);
	var menor = f1.getTime() <= f2.getTime();
	var sonFechas = isDate(fini) && isDate(ffin);
	return menor && sonFechas;
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