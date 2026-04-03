"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getAuthenticatedUserDetails = getAuthenticatedUserDetails;
exports.updateRole = updateRole;
exports.deleteUserAccount = deleteUserAccount;
exports.logoutUser = logoutUser;
exports.getAllUsers = getAllUsers;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const role_enum_1 = require("../enums/role.enum");
const warenkorb_1 = __importDefault(require("../models/warenkorb"));
const JWT_SECRET = process.env.JWT_SECRET || "";
const tokenBlackList = new Set();
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: "Name, Email, or Password is missing." });
            return;
        }
        const existingUser = await user_1.default.findOne({ where: { u_email: email } });
        if (existingUser) {
            res.status(409).json({ message: "The user is already registered." });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await user_1.default.create({
            u_name: name,
            u_email: email,
            u_password: hashedPassword,
            u_role: role_enum_1.Roles.USER,
        });
        await warenkorb_1.default.create({
            user_id: newUser.u_id,
            status: "Offen",
            ordered_items: [],
            total_price: 0.0,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error("🔥 FULL ERROR CREATING USER:", error.message);
        res.status(500).json({ error: "Failed to create user" });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await user_1.default.findOne({ where: { u_email: email } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.u_password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.u_id, role: user.u_role }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({ token });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Failed to log in user" });
    }
}
async function getAuthenticatedUserDetails(req, res) {
    try {
        const userId = req.user.userId;
        const user = await user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({
            user_id: user.u_id,
            name: user.u_name,
            email: user.u_email,
            role: user.u_role,
        });
    }
    catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
}
async function updateRole(req, res) {
    try {
        const { userId, newRole } = req.body;
        const user = await user_1.default.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (!Object.values(role_enum_1.Roles).includes(newRole)) {
            res.status(400).json({
                error: `Invalid role. Allowed values are ${Object.values(role_enum_1.Roles).join(", ")}`,
            });
            return;
        }
        await user_1.default.update({ u_role: newRole }, { where: { u_id: userId } });
        const token = jsonwebtoken_1.default.sign({ userId: user.u_id, role: newRole }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({
            message: "Role updated successfully",
            user: { id: user.u_id, role: newRole },
            token,
        });
    }
    catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ error: "Failed to update user role" });
    }
}
async function deleteUserAccount(req, res) {
    try {
        const userId = req.user.userId;
        await user_1.default.destroy({ where: { u_id: userId } });
        res.status(200).json({ message: "Account deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete account" });
    }
}
function logoutUser(req, res) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(400).json({ message: "Token is missing" });
        return;
    }
    try {
        jsonwebtoken_1.default.verify(token, JWT_SECRET);
        tokenBlackList.add(token);
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        console.error("Error logging out user:", error);
        res.status(200).json({ message: "Invalid or expired token" });
    }
}
async function getAllUsers(_req, res) {
    try {
        const users = await user_1.default.findAll({
            attributes: ["u_id", "u_name", "u_email", "u_role"],
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("...Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
}
