"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const role_enum_1 = require("../enums/role.enum");
class User extends sequelize_1.Model {
}
User.init({
    u_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    u_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    u_email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    u_password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    u_role: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(role_enum_1.Roles)),
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: "users",
    timestamps: false,
    modelName: "User",
});
exports.default = User;
