"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var CryptoJS = __importStar(require("crypto-js"));
var sha256Helper = /** @class */ (function () {
    function sha256Helper() {
    }
    sha256Helper.encrypt = function (input) {
        // Convierte el string de entrada a bytes
        var inputBytes = CryptoJS.enc.Utf8.parse(input);
        // Calcula el hash SHA-256
        var sha256Hash = CryptoJS.SHA256(inputBytes);
        // Convierte el hash a una representación hexadecimal
        var sha256Hex = sha256Hash.toString(CryptoJS.enc.Hex);
        return sha256Hex;
    };
    return sha256Helper;
}());
exports.default = sha256Helper;
//# sourceMappingURL=sha256Helper.js.map