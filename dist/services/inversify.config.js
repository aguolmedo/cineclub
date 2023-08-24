"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var types_1 = __importDefault(require("./types/types"));
var AuthService_1 = require("./AuthService");
var HealthcheckService_1 = require("./HealthcheckService");
var container = new inversify_1.Container();
container.bind(types_1.default.AuthService).to(AuthService_1.AuthService);
container
    .bind(types_1.default.HealthcheckService)
    .to(HealthcheckService_1.HealthcheckService);
exports.default = container;
//# sourceMappingURL=inversify.config.js.map