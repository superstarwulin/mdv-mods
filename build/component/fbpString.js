define('mui/mdv-mods/component/fbpString',function (require, exports, module) {
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
function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called');
    }
    return call && (typeof call === 'object' || typeof call === 'function') ? call : self;
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
        throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass)
        Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}
var Mdv = require('mui/mdv/mdv2'), FbpParser = require('mui/mdv-mods/lib/fbp'), FbpJson = require('mui/mdv-mods/component/fbpJson');
var Component = function (_Mdv) {
        _inherits(Component, _Mdv);
        function Component(mdvIn) {
            _classCallCheck(this, Component);
            var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this));
            mdvIn = new Mdv(mdvIn);
            var modelJson;
            _this.defineModel(true, function (name) {
                if (!modelJson) {
                    modelJson = mdvIn.getModel('fbpString').thenOnce(function (str) {
                        return new FbpJson({
                            fbpJson: FbpParser.parse(str),
                            params: mdvIn.getModel('params').thenOnce()
                        });
                    });
                }
                return modelJson.then(function (mdvJson) {
                    var model = mdvJson.getModel(name);
                    if (!model) {
                        throw 'model ' + name + ' not exists';
                    }
                    return model;
                });
            });
            return _this;
        }
        _createClass(Component, null, [{
                key: "mProgess",
                value: function mProgess(mdvIn) {
                    return new Component(mdvIn);
                }
            }]);
        return Component;
    }(Mdv);
module.exports = Component;
});
