/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
	Base = require("./base"),
	Common = require("../common/common"),
	$ = require("mui/zepto/zepto"),
	Event = require("mui/zepto/event");

class Element extends Base {
	initEl(el,mdvIn) {
		var self = this,
			callbacked = false;
		function getValue(){
			if (el.multiple) {//多选暂未支持
			}
			else {
				var selectedOption = el.options[el.selectedIndex];
				return (selectedOption && selectedOption.value) || "";
			}
		}
		self.defineModel("value", Mdv.createModel(function (resolve, reject) {
				mdvIn.getModel("value") && mdvIn.getModel("value").then(function () {
					callbacked = true;
					resolve(getValue(el));
				})
				$(el).on("change", function () {
					callbacked = true;
					resolve(getValue(el));
				})
				if (!callbacked) {
					resolve(getValue(el));
				}

			})
				.thenMdv(Common.mDistinct)
		);
		mdvIn.getModel("options") && mdvIn.getModel("options")
			.then(function (options) {
				var allKey = "0";
				if(options.hasOwnProperty("_")){
					allKey="_";
				}
				if(options.hasOwnProperty(allKey))
				{
					el.add(new Option(options[allKey], ""), null);
				}
				for(var key in options){
					if(!options.hasOwnProperty(key) || key==allKey){continue;}
					el.add(new Option(options[key], key), null);
				}
				self.getModel("value").resolve(getValue(el));
			})

		mdvIn.getModel("value") && mdvIn.getModel("value")
			.then(function (value) {
				var options=el.options;
				if(el.multiple){//多选暂未支持
				}
				else
				{
					var found=false;
					for (var i in options) {
						if (value && options[i].value == value) {
							found = true;
							el.selectedIndex = i;
							break
						}
					}
					if(!found){el.selectedIndex=-1;}
				}
			})
	}

	static initView(el, cfg, holder, callback) {
		callback(new Element({
			el: el,
			value: Base.getModel("value", cfg, el, holder),
			options: Base.getModel("options", cfg, el, holder)
		}));
	}
}
module.exports = Element;