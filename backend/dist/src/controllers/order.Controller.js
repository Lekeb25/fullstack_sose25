"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderFromWarenkorb = createOrderFromWarenkorb;
exports.getOrdersByUser = getOrdersByUser;
exports.updateOrderStatus = updateOrderStatus;
exports.deleteOrder = deleteOrder;
exports.getAllOrders = getAllOrders;
const order_1 = __importDefault(require("../models/order"));
const warenkorb_1 = __importDefault(require("../models/warenkorb"));
const role_enum_1 = require("../enums/role.enum");
const status_enum_1 = require("../enums/status.enum");
const calculateTotal_1 = require("../utils/calculateTotal");
async function createOrderFromWarenkorb(req, res) {
    try {
        const user_id = req.user.userId;
        const warenkorb = await warenkorb_1.default.findOne({ user_id });
        if (!warenkorb || warenkorb.ordered_items.length === 0) {
            res.status(400).json({ message: "Dein Warenkorb ist leer." });
            return;
        }
        const { total_price, processedItems } = await (0, calculateTotal_1.calculateTotal)(warenkorb.ordered_items);
        const order = await order_1.default.create({
            user_id,
            ordered_items: processedItems,
            total_price,
            status: status_enum_1.StatusOrder.PENDING,
        });
        warenkorb.ordered_items = [];
        warenkorb.total_price = 0;
        warenkorb.status = status_enum_1.StatusKorb.ABGELAUFEN;
        await warenkorb.save();
        res.status(201).json({
            message: "Bestellung erfolgreich erstellt.",
            order,
        });
    }
    catch (error) {
        console.error("createOrderFromWarenkorb ERROR:", error.message);
        res
            .status(500)
            .json({ error: "Interner Fehler beim Erstellen der Bestellung." });
    }
}
async function getOrdersByUser(req, res) {
    try {
        const user_id = req.user.userId;
        const orders = await order_1.default.findAll({
            where: { user_id },
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("getOrdersByUser ERROR:", error.message);
        res.status(500).json({ error: "Fehler beim Laden der Bestellungen." });
    }
}
async function updateOrderStatus(req, res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        if (req.user.role !== role_enum_1.Roles.ADMIN) {
            res.status(403).json({ message: "Nur Admins dürfen den Status ändern." });
            return;
        }
        if (!Object.values(status_enum_1.StatusOrder).includes(status)) {
            res.status(400).json({
                message: `Ungültiger Status. Erlaubte Werte: ${Object.values(status_enum_1.StatusOrder).join(", ")}`,
            });
            return;
        }
        const updated = await order_1.default.update({ status }, { where: { order_id: orderId } });
        if (updated[0] === 0) {
            res.status(404).json({ message: "Bestellung nicht gefunden." });
            return;
        }
        res.status(200).json({ message: "Status erfolgreich geändert." });
    }
    catch (error) {
        console.error("updateOrderStatus ERROR:", error.message);
        res.status(500).json({ error: "Status konnte nicht geändert werden." });
    }
}
async function deleteOrder(req, res) {
    try {
        const { orderId } = req.params;
        const order = await order_1.default.findByPk(orderId);
        if (!order) {
            res.status(404).json({ message: "Bestellung nicht gefunden." });
            return;
        }
        const user = req.user;
        if (user.role !== role_enum_1.Roles.ADMIN && user.userId !== order.user_id) {
            res
                .status(403)
                .json({ message: "Nicht berechtigt, diese Bestellung zu löschen." });
            return;
        }
        await order.destroy();
        res.status(200).json({ message: "Bestellung erfolgreich gelöscht." });
    }
    catch (error) {
        console.error("deleteOrder ERROR:", error.message);
        res.status(500).json({ error: "Fehler beim Löschen der Bestellung." });
    }
}
async function getAllOrders(_req, res) {
    try {
        const orders = await order_1.default.findAll({
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(orders);
    }
    catch (error) {
        console.error("getAllOrders ERROR:", error.message);
        res.status(500).json({ error: "Fehler beim Laden der Bestellungen." });
    }
}
