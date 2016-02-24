/**
 * JS - Funciones utiles comunes a todas las pantallas
 */

/**
 * Funcion que calcula el ancho de la barra de scroll vertical. Se añade el padding-rigth=widthScroll al header de las tablas.
 * Esto se hacer, porque el body esta oculto. Cuando se muestra, las tablas no son capaces de mostrar ese padding por lo que aparecen 
 * desalineadas. Si se quita el body-> display: none esto no pasaria.
 */

function getScrollBarWidth() {
    var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
    widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
	$outer.remove();
	return 100 - widthWithScroll;
};