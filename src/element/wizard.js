/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
	Base = require("./base"),
	$ = require("mui/zepto/zepto");
class Element extends Base {
	initEl(el, mdvIn) {
		var self = this;
		//在数据变化时显示层
		Mdv.all([mdvIn.getModel("value"),mdvIn.getModel("icon")])
			.then(function (values) {
				return (function (value, icon) {
					icon= icon||"current";
					var children = $(el).find("li");
					for (var i = children.length - 1; i >= 0; i--) {
						var node = children[i];
						if (i < value) {
							$(node).addClass('wizard-complete');
						}
						else {
							$(node).removeClass('wizard-complete');
						}
						if (i == value) {
							$(node).addClass('wizard-'+ icon);
						}
						else {
							$(node).removeClass('wizard-'+ icon);
						}
						if (i > value) {
							$(node).addClass('wizard-future');
						}
						else {
							$(node).removeClass('wizard-future');
						}
					}
				}).apply(null, values)
			});
	}

	static initView(el, cfg, holder, callback) {
		callback(new Element({
			el: el,
			value: Base.getModel("value", cfg, el, holder),
			icon: Base.getModel("icon", cfg, el, holder),
		}));
	}
}
module.exports = Element;