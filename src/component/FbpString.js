var Mdv = require("mui/mdv/mdv2"),
    FbpParser = require("mui/mdv-mods/lib/fbp"),
    FbpJson = require("mui/mdv-mods/component/fbpJson");
class Component extends Mdv {
    constructor(mdvIn) {
        super();
        mdvIn = new Mdv(mdvIn);
        var modelJson;
        this.defineModel(true, function (name) {
            if (!modelJson) {
                modelJson = mdvIn.getModel("fbpString").thenOnce(function (str) {
                    return new FbpJson({
                        fbpJson: FbpParser.parse(str),
                        params: mdvIn.getModel("params").thenOnce()
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
    }

    static mProgess(mdvIn) {
        return new Component(mdvIn);
    }
}
module.exports = Component;