/*
 @author 游侠
 */

KISSY.add("mui/mdv-mods/element/xtplEdit", function (S, Mdv,Xtpl, DOM,Event) {
	function Mod(el,cfg) {
		var self = this,
			newData;
		self.defineModel("value", this.createLoader(function (callback) {
			self.onModChange("data",function (data) {
				callback(newData = S.clone(data));
			});
		},6));
		self.defineModel("data", cfg.m_data);
		self.defineModel("tpl", cfg.m_tpl);
		function getter(data,str){
			try {
				return eval(str);
			} catch (e) {
				return undefined;
			}
		}
		function setter(data,str,value)
		{
			try {
				eval(str+"="+JSON.stringify(value));
			} catch (e) {}
		}

		self.onModChange("tpl,value", function (tpl, data) {
			DOM.html(el, new Xtpl(DOM.html(tpl)).render(data));
			var inputs = DOM.query("input", el);
			S.each(inputs, function (input) {
				var bind = DOM.attr(input, "data-bind");
				if (!bind) {
					return;
				}
				switch (input.type) {
					case "checkbox":
						var regResult;
						if (regResult = /(.+)\[\*\](.+)/.exec(bind)) {
							//实现全选框功能
							var allChecked = true,
								list = getter(data, regResult[1]);
							S.each(list, function (item) {
								if (!getter(item, "data" + regResult[2])) {
									allChecked = false;
									return false;
								}
							})
							input.checked = allChecked;
							Event.on(input, "change", function () {
								S.each(list, function (item) {
									setter(item, "data" + regResult[2], input.checked);
								})
								self.onModCreate("value", function (model) {
									model.set(newData);
								});
							});
						}
						else {//实现checkbox
							input.checked = getter(data, bind);
							Event.on(input, "change", function () {
								setter(data, bind, input.checked);
								self.onModCreate("value", function (model) {
									model.set(newData);
								});
							});
						}
						break;
					case "text":
					default:
						input.value = getter(data, bind);
						Event.on(input, "change", function () {
							setter(data, bind, input.value || "");
							self.onModCreate("value", function (model) {
								model.set(newData);
							});
						});
				}
			})
		});
	}

	Mod.prototype=new Mdv();

	Mod.initView = function (el, cfg, holder, callback) {
		cfg = cfg || {};
		cfg.m_data = holder.getModel(el.getAttribute("mdv-model-data"));
		cfg.m_tpl = holder.getModel(el.getAttribute("mdv-model-tpl"), el.getAttribute("data-tpl"));
		callback(new Mod(el, cfg));
	}
	return Mod;
}, {requires: ['mui/mdv/', "kg/xtemplate/4.1.4/", 'dom', 'event']});