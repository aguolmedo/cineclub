"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutes = void 0;
var AuthController_1 = require("./controllers/AuthController");
var HealthcheckController_1 = require("./controllers/HealthcheckController");
exports.AppRoutes = [
    {
        path: "/healthCheck",
        method: "get",
        action: HealthcheckController_1.HealthcheckController.healthCheck,
    },
    {
        path: "/token",
        method: "post",
        action: AuthController_1.AuthController.accessToken,
    },
];
//# sourceMappingURL=routes.js.map