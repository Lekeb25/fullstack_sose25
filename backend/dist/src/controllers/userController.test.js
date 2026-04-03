"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_Controller_1 = require("./user.Controller");
const globals_1 = require("@jest/globals");
const user_1 = __importDefault(require("../models/user"));
const warenkorb_1 = __importDefault(require("../models/warenkorb"));
globals_1.jest.mock("../models/user");
globals_1.jest.mock("../models/warenkorb");
globals_1.jest.mock("bcryptjs", () => ({
    hash: globals_1.jest.fn(() => "mockedHashedPassword123"),
}));
(0, globals_1.describe)("registerUser", () => {
    (0, globals_1.beforeAll)(() => {
        globals_1.jest.spyOn(console, "error").mockImplementation(() => { });
    });
    (0, globals_1.it)("returns 400 if name, email, or password is missing", async () => {
        const req = {
            body: {},
        };
        const res = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        await (0, user_Controller_1.registerUser)(req, res);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(res.json).toHaveBeenCalledWith({
            message: "Name, Email, or Password is missing.",
        });
    });
    (0, globals_1.it)("returns 409 if user already exists", async () => {
        globals_1.jest.spyOn(user_1.default, "findOne").mockResolvedValue({ u_id: 1 });
        const req = {
            body: {
                name: "Test User",
                email: "test.user@example.com",
                password: "testuser123",
            },
        };
        const res = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        await (0, user_Controller_1.registerUser)(req, res);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(409);
        (0, globals_1.expect)(res.json).toHaveBeenCalledWith({
            message: "The user is already registered.",
        });
    });
    (0, globals_1.it)("returns 201 and creates user + warenkorb", async () => {
        globals_1.jest.spyOn(user_1.default, "findOne").mockResolvedValue(null);
        globals_1.jest.spyOn(user_1.default, "create").mockResolvedValue({ u_id: 42 });
        globals_1.jest.spyOn(warenkorb_1.default, "create").mockResolvedValue({});
        const req = {
            body: {
                name: "New Test User",
                email: "newuser@example.com",
                password: "password123",
            },
        };
        const res = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        await (0, user_Controller_1.registerUser)(req, res);
        (0, globals_1.expect)(user_1.default.create).toHaveBeenCalledWith({
            u_name: "New Test User",
            u_email: "newuser@example.com",
            u_password: "mockedHashedPassword123",
            u_role: "user",
        });
        (0, globals_1.expect)(warenkorb_1.default.create).toHaveBeenCalledWith({
            user_id: 42,
            status: "Offen",
            ordered_items: [],
            total_price: 0.0,
        });
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(201);
        (0, globals_1.expect)(res.json).toHaveBeenCalledWith({ u_id: 42 });
    });
    (0, globals_1.it)("returns 500 if an unexpected error occurs", async () => {
        globals_1.jest.spyOn(user_1.default, "findOne").mockRejectedValue(new Error("DB exploded"));
        const req = {
            body: {
                name: "Oops",
                email: "oops@example.com",
                password: "fail",
            },
        };
        const res = {
            status: globals_1.jest.fn().mockReturnThis(),
            json: globals_1.jest.fn(),
        };
        await (0, user_Controller_1.registerUser)(req, res);
        (0, globals_1.expect)(res.status).toHaveBeenCalledWith(500);
        (0, globals_1.expect)(res.json).toHaveBeenCalledWith({
            error: "Failed to create user",
        });
    });
});
