"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.authorizeRole = void 0;
const role_enum_1 = require("../enums/role.enum");
Object.defineProperty(exports, "Roles", { enumerable: true, get: function () { return role_enum_1.Roles; } });
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                message: "Zugriff verweigert – unzureichende Berechtigungen.",
            });
            return;
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
