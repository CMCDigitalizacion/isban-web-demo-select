/**
 *  Javascript de Cabecera de Carteras
 */
var widthPantallaCartera = 0;
$(document).ready(function(){
	
});

function iniciaCabecera(){
	var wCartera = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	 resolucionPantallaCarteras(wCartera);
	 
	 $( window ).resize(function() {
		 widthPantallaCartera = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		 resolucionPantallaCarteras(widthPantallaCartera);
	 });
	
	
	/**Aportaciones **/
	if(cabCartera == "1"){
		
		$("#idBuscarCarteras").on("click", function(e){
//			selCarteraAportaciones();
			$("#myModalBuscar").addClass("fade");
			$("#myModalCarteras").addClass("fade");
			$("#panelFormularioBuscarCarteras").collapse('show');
			$("#myModalCarteras").modal('show');
			$("#tipoBusquedaCarteras").val("2").change();
			
			limpiaCamposLoc();
			
			if(respBusquedaCart && respBusquedaCart.readystate != 4){
				respBusquedaCart.abort();
	        }
		});
	}
	
	/**Modificaciones **/
	if(cabCartera == "2"){
		$("#idBuscarCarteras").on("click", function(e){	
			$("#myModalBuscar").addClass("fade");
			$("#myModalCarteras").addClass("fade");
			$("#panelFormularioBuscarCarteras").collapse('show');
			$("#myModalCarteras").modal('show');
			$("#tipoBusquedaCarteras").val("2").change();
			
			limpiaCamposLoc();
			
			if(respBusquedaCart && respBusquedaCart.readystate != 4){
				respBusquedaCart.abort();
	        }
		});
	}
	
	/**Retiradas **/
	if(cabCartera == "3"){
		$("#idBuscarCarteras").on("click", function(e){	
			$("#myModalBuscar").addClass("fade");
			$("#myModalCarteras").addClass("fade");
			$("#panelFormularioBuscarCarteras").collapse('show');
			$("#myModalCarteras").modal('show');
			$("#tipoBusquedaCarteras").val("2").change();
			//$(".dataTables_scrollHeadInner").css("padding-right", getScrollBarWidth()+"px");
			limpiaCamposLoc();
			
			if(respBusquedaCart && respBusquedaCart.readystate != 4){
				respBusquedaCart.abort();
	        }
		});
	}
	
	/**Cancelacion **/
	if(cabCartera == "4"){
		$("#idBuscarCarteras").on("click", function(e){	
			$("#myModalBuscar").addClass("fade");
			$("#myModalCarteras").addClass("fade");
			$("#panelFormularioBuscarCarteras").collapse('show');
			$("#myModalCarteras").modal('show');
			$("#tipoBusquedaCarteras").val("2").change();
			
			limpiaCamposLoc();
			
			if(respBusquedaCart && respBusquedaCart.readystate != 4){
				respBusquedaCart.abort();
	        }
		});
	}
}

function resolucionPantallaCarteras(anchoCabeceraCartera){
	if(anchoCabeceraCartera <= 1024){
		$("#lblLocCartera").html("Loc. de cartera:");
		$("#lblDivisaRef").html("Divisa de ref.:");
		$("#lblFecActivacion").html("Fec. Activación:");
	}else{
		$("#lblLocCartera").html("Localizador de cartera:");
		$("#lblDivisaRef").html("Divisa de referencia:");
		$("#lblFecActivacion").html("Fecha de activación:");
	}
}


