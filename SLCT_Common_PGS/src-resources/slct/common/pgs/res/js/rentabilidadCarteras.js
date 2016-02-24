/**
 * 
 */




var tablaRent = null;
var opts = {
		  lines: 11,
		  length: 3,
		  width: 2,
		  radius:4,
		  zIndex: 2e9, // The z-index (defaults to 2000000000)
	       top: '50%', // Top position relative to parent in px
	       left: '50%', // Left position relative to parent in px
		  color: '#FFFFFF',

		};
var arrayRent = [0];
var arrayFecha = [""];
/* Gráfico operaciones */
var color1 = "red";
var invoice_status_data  = {
	    labels: arrayFecha,
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: color1,
	            strokeColor: color1,
	            pointColor: color1,
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: arrayRent
	        }
	    ]
	};
var empty_data  = {
	    labels: arrayFecha,
	    datasets: [
	        {
	            label: "My First dataset",
	            fillColor: color1,
	            strokeColor: color1,
	            pointColor: color1,
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: ""
	        }
	    ]
	};

var options =
{

		animation: false,
		scaleFontFamily: "Verdana",
		responsive: true,
		tooltipFontFamily:"Verdana",
		tooltipFontSize: 12,
		tooltipTitleFontFamily:"'Verdana', 'Arial'",
		tooltipTitleFontSize: 12,
	    ///Boolean - Whether grid lines are shown across the chart
	    scaleShowGridLines : true,

	    //String - Colour of the grid lines
	    scaleGridLineColor : "rgba(0,0,0,.05)",

	    //Number - Width of the grid lines
	    scaleGridLineWidth : 1,

	    //Boolean - Whether to show horizontal lines (except X axis)
	    scaleShowHorizontalLines: true,

	    //Boolean - Whether to show vertical lines (except Y axis)
	    scaleShowVerticalLines: true,

	    //Boolean - Whether the line is curved between points
	    bezierCurve : false,

	    //Number - Tension of the bezier curve between points
	    bezierCurveTension : 0.4,

	    //Boolean - Whether to show a dot for each point
	    pointDot : true,

	    //Number - Radius of each point dot in pixels
	    pointDotRadius : 4,

	    //Number - Pixel width of point dot stroke
	    pointDotStrokeWidth : 1,

	    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
	    pointHitDetectionRadius : 20,

	    //Boolean - Whether to show a stroke for datasets
	    datasetStroke : true,

	    //Number - Pixel width of dataset stroke
	    datasetStrokeWidth : 2,

	    //Boolean - Whether to fill the dataset with a colour
	    datasetFill : false,
	    
	    
	    showTooltips:true

	    //String - A legend template
//	    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"

	};


$(document).ready(function(){
	
	$("#grafRent").hide();
	cargarModal("Error.html");
	cargarModal("ErrorServidor.html");
	
	
	$.get("modals/CabeceraCartera.jsp?header=Datos&cartera="+idCarteraAux, function(data){
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
		
		$("body").show();
		tablaRent.columns.adjust().draw();
	});
	
	$("#idImprimirRent").prop("disabled", true);
	$("#idConsultar").prop("disabled", true);
	
	$('#tipoConsultaRentabilidades').select2({
		disabled: false,
		width : "100%",
		minimumResultsForSearch: Infinity
	});
	
	tablaRent = $('#tabla-rent').DataTable( {
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
            { "data" : "fecha",},
            { "data": "valoracion" },
            { "data": "rentabilidad" }
        ],
        "language": {
            "zeroRecords": "No hay registros"
          }
    } );
	
	
	
	$("#tipoConsultaRentabilidades").change(function() {
		if($("#tipoConsultaRentabilidades").val() != -1){
			$("#idConsultar").prop("disabled", false);
		} else {
			$("#idConsultar").prop("disabled", true);
		}
		tablaRent.clear().draw();
		$("#idImprimirRent").prop("disabled", true);
		//Reinicio gráfico
		try{
			if(! $("#system").hasClass("ie8") ) 
				iniGrafico(empty_data);
		} catch (e){}
		$("#targetElementID").css("display", "none");
	});
	
	$("#idImprimirRent").on("click", function(){
		var cartera = $("#idCartera").val();
		var tipo = $("#tipoConsultaRentabilidades").val();
		window.open('/select/rest/documents/rentabilidad/'+cartera+'/'+tipo);

	});
	
	$("#idConsultar").bind("click", function(){
		var target = document.getElementById('idConsultar');
		var spinner = new Spinner(opts).spin(target);
		var ajax_rent_cart = {
				"cartera": $("#idCartera").val(),
				"consulta": "REN",
				"tipo": $("#tipoConsultaRentabilidades").val()
		};
		
		$.ajax({
			url:'/select/rest/json/Cartera',
			contentType : "application/json; charset=utf-8",
			data : JSON.stringify(ajax_rent_cart),
			type : 'POST',
			dataType: "json", 
			cache: false,
			beforeSend: function() {
				$("#idConsultar").css("color", "#ff2500");
				$(target).data('spinner', spinner);
				$("#idConsultar").prop("disabled", true);
	        },
	        complete: function() {
	        	$(target).data('spinner').stop();
	        	$("#idConsultar").css("color", "#fff");
	        	$("#idConsultar").prop("disabled", false);
	        	
	        	$("#targetElementID").css("display", "inherit");
	        	if( $("#system").hasClass("ie8") ) {
	        		$("#idCartera").val()
	        		$('#targetElementID').html(
	    		    '<img src="/select/rest/documents/rentabilidad/graph/'+$("#idCartera").val()+'/'+ $("#tipoConsultaRentabilidades").val()+'" id="myChart" style="width: 100%"/>');
	        	}
	        	else iniGrafico(invoice_status_data);    	
	        },
			success:function(data){
				if(data["ERROR"] === undefined){
					
					tablaRent.clear();
					tablaRent.rows.add(data.rentabilidades).draw();
					
					$("#idImprimirRent").prop("disabled", false);
					arrayRent = cargaDatosGraf(data.rentabilidades);
					arrayFecha = cargaFechasGraficos(data.rentabilidades);
					invoice_status_data  = {
						    labels: arrayFecha,
						    datasets: [
						        {
						            label: "My First dataset",
						            fillColor: color1,
						            strokeColor: color1,
						            pointColor: color1,
						            pointStrokeColor: "#fff",
						            pointHighlightFill: "#fff",
						            pointHighlightStroke: "rgba(220,220,220,1)",
						            data: arrayRent
						        }
						    ]
						};
					
					$("#grafRent").show();
				}else{
					$("#mensajeError").html(data.ERROR_MSG);
					$("#myModalERROR").modal('show');
					$("#idImprimirRent").prop("disabled", true);
				}
				
			},
			error: function(xhr, status, error) {
				$("#mensajeErrorTecnico").html(xhr.status +  " " + error);
				$("#myModalERRORTecnico").modal('show');
			}
		    
		});
	});
	
	if( $("#system").hasClass("ie8") ) 
		options.showTooltips = false;
	
	
});

$("#idVolver").on("click", function(e){
	$("#formCartera").attr("action", "/select/front/consulta");
	$("#formCartera").submit();
});

/* Generador de colores aleatorios */
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}




function cargaDatosGraf(datos){
	var arrayDatos = [];
	var valor = 0;
	for(obj in datos){
//		valor = datos[obj].rentabilidad.substring(0, datos[obj].rentabilidad.length-1);
		valor = datos[obj].rentabilidad;
//		arrayDatos.push(parseFloat(valor.replace(',','.')));
		arrayDatos.push(parseFloat(valor));
	}
	
	return arrayDatos;
}

function cargaFechasGraficos(datos){
	var arrayDatos = [];
	var valor = 0;
	for(obj in datos){
		arrayDatos.push(datos[obj].fecha);
	}
	
	
	return arrayDatos;
}



function iniGrafico(datos){
	canvas = $('#myChart').get(0);//get dom element from jquery
	if(canvas.getContext)//function doesn't exist yet
	{
		//we're in IE if we reach this block
		//otherwise getContext already exists
		$('#targetElementID').empty();
		//add #mycanvas as a div instead of a canvas
		//you could use document.createElement('div') instead of jquery
		$('#targetElementID').append(
		    '<canvas id="myChart" style="width: 100% !important; height:200px"></canvas>');
		canvas = $('#myChart').get(0);
		if(typeof G_vmlCanvasManager  != 'undefined' )
		{
		    canvas = G_vmlCanvasManager.initElement(canvas);
		}
		
	} 
	//now you're set up to draw!
	context = canvas.getContext("2d");


	var chartObj = new Chart(context);
	var myLineChart = chartObj.Line(datos , options);
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