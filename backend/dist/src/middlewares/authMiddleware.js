"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res
            .status(401)
            .json({ message: "Access denied. Token missing or malformed." });
        return;
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (typeof decoded !== "object" ||
            !("userId" in decoded) ||
            !("role" in decoded)) {
            res
                .status(401)
                .json({ message: "Token payload malformed (missing userId or role)." });
            return;
        }
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            ...decoded,
        };
        next();
    }
    catch (error) {
        console.error("JWT verification failed:", error.message);
        res.status(401).json({ message: "Invalid or expired token." });
    }
};
exports.default = authenticateUser;
