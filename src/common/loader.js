var Mdv = require("mui/mdv/mdv2"),
    Common = require("./common");
class Module {
    static require(clsName) {
        //查找所有的in
        return Mdv.createModel(function (resolve) {
            var loaded;
            require([clsName], function (Cls) {
                loaded = true;
                resolve(Cls);
            })
            setTimeout(function () {
                if (!loaded) {
                    console.log('require ' + clsName + ' timeout')
                }
            }, 5000);
        });
    }

    static kissy(cls) {
        if (window.KISSY && KISSY.UA) {
            return KISSY;
        }
        return Mdv.createLiteral(cls || "mui/kissy/seed-min")
            .then(Module.require)
    }

    static kissyUse(clsName) {
        //查找所有的in
        return Mdv.createLiteral("")
            .then(Module.kissy)
            .then(function (KISSY) {
                return Mdv.createModel(function (resolve) {
                    KISSY.use(clsName, function (S, Mod) {
                        resolve(Mod, {last: true});
                    })
                })
            });
    }

    static json(url, body, method) {
        if (typeof(url) != "string") {
            throw (url + " is not a string");
        }
        return Mdv.createLiteral("mui/fetch/fetch")
            .then(Module.require)
            .then(function (fetch) {
                body = body||{};
                if (body.nodeName) {
                    body = new FormData(body)
                }
                else if (typeof(body) != "string" && !(body instanceof FormData)) {
                    body = JSON.stringify(body);
                }
                return fetch(url, {
                    method: method === 'get' ? method : 'post',
                    body: method === 'get'?undefined:body
                })
            })
            .then(function (response) {
                return response.json();
            });
    }

    /**
     * 发出Json请求
     */
    static mJson(mdvIn) {
        return Common.syncProcess(mdvIn, ["in", "body", "method"], Module.json)
    }

    static jsonp(url) {
        if (typeof(url) != "string") {
            throw (url + " is not a string");
        }
        return Mdv.createLiteral("mui/fetch/jsonp")
            .then(Module.require)
            .then(function (fetch) {
                return fetch(url, {
                    method: 'jsonp'
                })
            })
            .then(function (response) {
                return response.json();
            });
    }

    static getScript(url) {
        return Mdv.createModel(function (resolve, reject) {
            var head = document.head ||
                    document.head.getElementsByTagName('head')[0],
                el = document.createElement('script');
            el.type = 'text\/javascript';
            el.onerror = reject;
            el.onload = resolve;
            head.appendChild(el);
            el.src = url;
        });
    }
}
module.exports = Module;





