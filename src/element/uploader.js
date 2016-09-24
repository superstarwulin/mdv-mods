/*
 @author 游侠
 */
var Mdv = require("mui/mdv/mdv2"),
	Common = require("./common"),
	Base = require("./base"),
	$ = require("mui/zepto/zepto"),
	Event = require("mui/zepto/event");
class Element extends Base {
	initEl(el, mdvIn) {
		var self = this;
		self.defineModel("change", Mdv.createModel(function (resolve, reject) {
			$(el).on("change", resolve);
		}));
		//实现输出模型
		self.defineModel("out", self.get("change")
			.thenDemand(function () {
				return el.files[0];
			})
			.thenMdv(Element.mOssToken, {
				server: "/inside/ajax/file/getFile.do?_input_charset=utf-8"
			}, "in", "out")
			.then(function (ossToken) {
				return Mdv.createModel(function (resolve) {
					Mdv.createLiteral(ossToken)
						.thenMdv(Element.mOssUrl, {
							in: el.files[0],
							server: "//tmall-inside.cn-hangzhou.oss-pub.aliyun-inc.com/"
						}, "token", "out")
						.then(function () {
							resolve(ossToken);
						})
				})
			}))
	}

	static ossToken(fileObj, server) {
		return Loader.json(server, {
			fileType: fileObj.type,
			fileName: fileObj.name
		}, "post")
			.then(function (result) {
				return result.model;
			})
	}

	static mOssToken(mdvIn) {
		return Common.syncProcess(mdvIn, ["in", "server"], ossUrl);
	}

	static ossUrl(fileObj, ossToken, server) {
		var form = new FormData();
		for (var key in ossToken) {
			if (key != "url" && key != "fileName" && ossToken.hasOwnProperty(key)) {
				form.append(key, value);
			}
		}
		form.append("file", fileObj);
		return Loader.json(server, form, "post", {
			processData: false,
			contentType: false,
			crossDomain: true
		})
	}

	static mOssUrl(mdvIn) {
		return Common.syncProcess(mdvIn, ["in", "token","server"], ossUrl);
	}

	static initView(el, cfg, holder, callback) {
		callback(new Element({
			el: el
		}));
	}
}
module.exports = Element;