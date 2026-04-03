"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const order_1 = __importDefault(require("./order"));
const status_enum_1 = require("../enums/status.enum");
class Payment extends sequelize_1.Model {
}
Payment.init({
    payment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    order_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: order_1.default,
            key: "order_id",
        },
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: status_enum_1.StatusPayment.AUSSTEHEND,
        validate: {
            isIn: [Object.values(status_enum_1.StatusPayment)],
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
    tableName: "payments",
    modelName: "Payment",
    timestamps: true,
});
Payment.belongsTo(order_1.default, { foreignKey: "order_id" });
exports.default = Payment;
