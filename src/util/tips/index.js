var _tips = {
	getTips : function(obj){
		var _tips = $(obj).find('.tips');
		var jtHtml = '<span class="b"></span><span class="t"></span>';
		_tips.append(jtHtml);
		_tips.show();
		var t = _tips.parent().height();
		var w = -(_tips.width()/2);
		_tips.css({'margin-top':t+'px','margin-left':w+'px'});
	}
};
module.exports = _tips;