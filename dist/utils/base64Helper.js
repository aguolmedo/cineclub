"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base64Helper = /** @class */ (function () {
    function base64Helper() {
    }
    base64Helper.decode = function (b64string) {
        var buff = Buffer.from(b64string, "base64");
        return buff.toString("utf-8");
    };
    return base64Helper;
}());
exports.default = base64Helper;
//# sourceMappingURL=base64Helper.js.map