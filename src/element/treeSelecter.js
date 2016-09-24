/*
 @author 游侠
 */

KISSY.add("made/mdv/treeSelecter", function (S,DOM,Event,IO,VueRender) {
	return {
		initView: function (el, cfg, holder, callback) {
			DOM.addClass(el,"resourceTree");
			el.innerHTML = '<v-tree data-tree="{{tree}}" data-proxy="{{proxy}}" data-name="{{name}}"\
            data-isloading="{{isLoading}}" data-isdropdown="{{isDropdown}}"\
            data-searchable="{{searchable}}" data-folderselectable="{{folderselectable}}"\
            data-singleselected="{{singleselected}}" data-enableaccordion="{{enableaccordion}}"\
            data-tracepath="{{tracePath}}" data-threshold="{{threshold}}" data-searchplaceholder="{{searchplaceholder}}"></v-tree>';
			cfg.m_data=holder.createLoader(function(callback){
				var url = el.getAttribute("data-url");
				IO({
					url:url,
					dataType:'json',
					success:function(data){
						callback({
							"name": "",
							"threshold": 6,
							"isdropdown": false,
							"searchable": true,
							"folderselectable": false,
							"singleselected": true,
							"enableaccordion": true,
							"searchplaceholder": "输入名称",
							"proxy": {
								"url": url,
								"dataType": "json",
								"crsfToken": true
							},
							"tree": data.model||[]
						})
					}
				});
			},2);
			VueRender.initView(el, cfg, holder, function(mod){
				mod.define("value",mod.createLoader(function(callback){
					mod.onModLoad("vue", function () {
						var _el = DOM.get("v-tree", el)||DOM.get(".v-tree", el);
						var vm = _el.__vue__ || _el.vue_vm;
						vm.openDropdown();
						callback(vm.value);
						vm.$watch('value', function(newVal){
							callback(newVal);
						});
					})
				},2));
				mod.onModChange("value",function(v){
					console.log(v);
				})
				callback(mod);
			});
		}
	};
}, {requires: ['dom','event','io','mui/mdv-mods/element/vueRender', 'made/inside/resourceTree/index.css','vframe/components/tree/component']});