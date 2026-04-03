"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePayment = makePayment;
exports.getPayments = getPayments;
exports.getPaymentById = getPaymentById;
const role_enum_1 = require("../enums/role.enum");
const payment_1 = __importDefault(require("../models/payment"));
const order_1 = __importDefault(require("../models/order"));
const warenkorb_1 = __importDefault(require("../models/warenkorb"));
const status_enum_1 = require("../enums/status.enum");
async function makePayment(req, res) {
    try {
        const { userId } = req.user;
        const warenkorb = await warenkorb_1.default.findOne({ user_id: userId });
        if (!warenkorb || warenkorb.ordered_items.length === 0) {
            res.status(400).json({ message: "Warenkorb ist leer." });
            return;
        }
        const newOrder = await order_1.default.create({
            user_id: userId,
            total_price: warenkorb.total_price,
            status: status_enum_1.StatusOrder.PENDING,
            ordered_items: warenkorb.ordered_items,
        });
        const payment = await payment_1.default.create({
            order_id: newOrder.order_id,
            amount: newOrder.total_price,
            status: status_enum_1.StatusPayment.BEZAHLT,
        });
        warenkorb.ordered_items = [];
        warenkorb.total_price = 0;
        await warenkorb.save();
        res.status(201).json({
            message: "Zahlung erfolgreich durchgeführt und Bestellung erstellt.",
            order: newOrder,
            payment,
        });
    }
    catch (error) {
        console.error("Fehler bei Zahlung:", error.message);
        res.status(500).json({ error: "Zahlung fehlgeschlagen." });
    }
}
async function getPayments(req, res) {
    try {
        const { role, userId } = req.user;
        let payments;
        if (role === role_enum_1.Roles.ADMIN) {
            payments = await payment_1.default.findAll({ include: order_1.default });
        }
        else {
            payments = await payment_1.default.findAll({
                include: {
                    model: order_1.default,
                    where: { user_id: userId },
                },
            });
        }
        res.status(200).json(payments);
    }
    catch (error) {
        console.error("Fehler beim Abrufen der Zahlungen:", error.message);
        res.status(500).json({ error: "Zahlungen konnten nicht geladen werden." });
    }
}
async function getPaymentById(req, res) {
    try {
        const { id } = req.params;
        const payment = await payment_1.default.findByPk(id);
        if (!payment) {
            res.status(404).json({ message: "Zahlung nicht gefunden." });
            return;
        }
        res.status(200).json(payment);
    }
    catch (error) {
        console.error("Fehler bei getPaymentById:", error.message);
        res.status(500).json({ error: "Fehler beim Abrufen der Zahlung." });
    }
}
