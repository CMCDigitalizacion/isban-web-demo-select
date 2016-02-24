/**
 * Carga el modal de Localizador Clientes
 */

function cargarModal(path) {
	$.ajax({
		url : "/select/front/htm/modals/"+path,
		success : function(data) {
			$("body").append(data);
			eventChangeCombo();
		},
		dataType : "html"
	});
}