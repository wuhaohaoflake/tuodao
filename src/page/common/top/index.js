require('./index.scss');
var _tips = require('util/tips/index.js');
$(function(){
	$('#top .left dd').mouseover(function(){
		_tips.getTips($(this));
	});

	$('#top .left dd').mouseout(function(){
		$(this).find('.tips').hide();
	});

});