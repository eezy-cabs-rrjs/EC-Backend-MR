"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_SERVICE_NAME = exports.AUTH_PACKAGE_NAME = exports.protobufPackage = void 0;
exports.AuthServiceControllerMethods = AuthServiceControllerMethods;
const microservices_1 = require("@nestjs/microservices");
exports.protobufPackage = "auth";
exports.AUTH_PACKAGE_NAME = "auth";
function AuthServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["login"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcMethod)("AuthService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            (0, microservices_1.GrpcStreamMethod)("AuthService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.AUTH_SERVICE_NAME = "AuthService";
//# sourceMappingURL=auth.js.map