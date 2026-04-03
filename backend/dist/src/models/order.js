"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const user_1 = __importDefault(require("./user"));
const status_enum_1 = require("../enums/status.enum");
class Order extends sequelize_1.Model {
}
Order.init({
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: user_1.default,
            key: "u_id",
        },
    },
    ordered_items: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
    },
    total_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: status_enum_1.StatusOrder.PENDING,
        validate: {
            isIn: [Object.values(status_enum_1.StatusOrder)],
        },
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: db_1.default.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: db_1.default.literal("CURRENT_TIMESTAMP"),
    },
}, {
    sequelize: db_1.default,
    tableName: "orders",
    modelName: "Order",
    timestamps: true,
});
exports.default = Order;
