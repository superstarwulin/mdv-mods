define('mui/mdv-mods/common/loader',function (require, exports, module) {
var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ('value' in descriptor)
                    descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function (Constructor, protoProps, staticProps) {
            if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
            if (staticProps)
                defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
var Mdv = require('mui/mdv/mdv2'), Common = require('./common');
var Module = function () {
        function Module() {
            _classCallCheck(this, Module);
        }
        _createClass(Module, null, [{
                key: "require",
                value: function (_require) {
                    function require(_x) {
                        return _require.apply(this, arguments);
                    }
        
                    require.toString = function () {
                        return _require.toString();
                    };
        
                    return require;
                }(function (clsName) {
                    //查找所有的in
                    return Mdv.createModel(function (resolve) {
                        var loaded;
                        require([clsName], function (Cls) {
                            loaded = true;
                            resolve(Cls);
                        });
                        setTimeout(function () {
                            if (!loaded) {
                                console.log('require ' + clsName + ' timeout');
                            }
                        }, 5000);
                    });
                })
            }, {
                key: "kissy",
                value: function kissy(cls) {
                    if (window.KISSY && KISSY.UA) {
                        return KISSY;
                    }
                    return Mdv.createLiteral(cls || "mui/kissy/seed-min").then(Module.require);
                }
            }, {
                key: "kissyUse",
                value: function kissyUse(clsName) {
                    //查找所有的in
                    return Mdv.createLiteral("").then(Module.kissy).then(function (KISSY) {
                        return Mdv.createModel(function (resolve) {
                            KISSY.use(clsName, function (S, Mod) {
                                resolve(Mod, { last: true });
                            });
                        });
                    });
                }
            }, {
                key: "json",
                value: function json(url, body, method) {
                    if (typeof url != "string") {
                        throw url + " is not a string";
                    }
                    return Mdv.createLiteral("mui/fetch/fetch").then(Module.require).then(function (fetch) {
                        body = body || {};
                        if (body.nodeName) {
                            body = new FormData(body);
                        } else if (typeof body != "string" && !(body instanceof FormData)) {
                            body = JSON.stringify(body);
                        }
                        return fetch(url, {
                            method: method === 'get' ? method : 'post',
                            body: method === 'get' ? undefined : body
                        });
                    }).then(function (response) {
                        return response.json();
                    });
                }
        
                /**
                 * 发出Json请求
                 */
        
            }, {
                key: "mJson",
                value: function mJson(mdvIn) {
                    return Common.syncProcess(mdvIn, ["in", "body", "method"], Module.json);
                }
            }, {
                key: "jsonp",
                value: function jsonp(url) {
                    if (typeof url != "string") {
                        throw url + " is not a string";
                    }
                    return Mdv.createLiteral("mui/fetch/jsonp").then(Module.require).then(function (fetch) {
                        return fetch(url, {
                            method: 'jsonp'
                        });
                    }).then(function (response) {
                        return response.json();
                    });
                }
            }, {
                key: "getScript",
                value: function getScript(url) {
                    return Mdv.createModel(function (resolve, reject) {
                        var head = document.head || document.head.getElementsByTagName('head')[0],
                            el = document.createElement('script');
                        el.type = 'text\/javascript';
                        el.onerror = reject;
                        el.onload = resolve;
                        head.appendChild(el);
                        el.src = url;
                    });
                }
            }]);
        return Module;
    }();
module.exports = Module;
});
