"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyWarenkorb = getMyWarenkorb;
exports.addItemToWarenkorb = addItemToWarenkorb;
exports.updateItemQuantity = updateItemQuantity;
exports.removeItemFromWarenkorb = removeItemFromWarenkorb;
exports.clearWarenkorb = clearWarenkorb;
exports.getAllWarenkorbs = getAllWarenkorbs;
const warenkorb_1 = __importDefault(require("../models/warenkorb"));
const productItems_1 = __importDefault(require("../models/productItems"));
const calculateTotal_1 = require("../utils/calculateTotal");
async function getMyWarenkorb(req, res) {
    try {
        const user_id = req.user.userId;
        let warenkorb = await warenkorb_1.default.findOne({ user_id });
        if (!warenkorb) {
            warenkorb = new warenkorb_1.default({ user_id });
            await warenkorb.save();
        }
        res.status(200).json(warenkorb);
    }
    catch (error) {
        console.error("getMyWarenkorb ERROR:", error);
        res.status(500).json({ message: "Serverfehler beim Abrufen" });
    }
}
async function addItemToWarenkorb(req, res) {
    try {
        const user_id = req.user.userId;
        const { product_id, quantity } = req.body;
        if (!product_id || quantity == null) {
            res
                .status(400)
                .json({ message: "Produkt-ID und Menge sind erforderlich" });
            return;
        }
        const product = await productItems_1.default.findById(product_id);
        if (!product) {
            res.status(404).json({ message: "Produkt nicht gefunden" });
            return;
        }
        let warenkorb = await warenkorb_1.default.findOne({ user_id });
        if (!warenkorb) {
            warenkorb = new warenkorb_1.default({ user_id, ordered_items: [] });
        }
        const existingItem = warenkorb.ordered_items.find((item) => item.product_id.toString() === product_id);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            warenkorb.ordered_items.push({
                product_id: product._id,
                name: product.p_name,
                price: product.price,
                quantity,
            });
        }
        const { total_price } = await (0, calculateTotal_1.calculateTotal)(warenkorb.ordered_items);
        warenkorb.total_price = total_price;
        await warenkorb.save();
        res.status(200).json({ message: "Produkt hinzugefügt", warenkorb });
    }
    catch (error) {
        console.error("addItemToWarenkorb ERROR:", error);
        res.status(500).json({ message: "Fehler beim Hinzufügen" });
    }
}
async function updateItemQuantity(req, res) {
    try {
        const user_id = req.user.userId;
        const { product_id, quantity } = req.body;
        const warenkorb = await warenkorb_1.default.findOne({ user_id });
        if (!warenkorb) {
            res.status(404).json({ message: "Kein Warenkorb gefunden" });
            return;
        }
        const itemIndex = warenkorb.ordered_items.findIndex((item) => item.product_id.toString() === product_id);
        if (itemIndex === -1) {
            res.status(404).json({ message: "Produkt nicht im Warenkorb" });
            return;
        }
        if (quantity === 0) {
            warenkorb.ordered_items.splice(itemIndex, 1);
        }
        else {
            warenkorb.ordered_items[itemIndex].quantity = quantity;
        }
        const { total_price } = await (0, calculateTotal_1.calculateTotal)(warenkorb.ordered_items);
        warenkorb.total_price = total_price;
        await warenkorb.save();
        res.status(200).json({ message: "Menge aktualisiert", warenkorb });
    }
    catch (error) {
        console.error("updateItemQuantity ERROR:", error);
        res.status(500).json({ message: "Fehler beim Aktualisieren" });
    }
}
async function removeItemFromWarenkorb(req, res) {
    try {
        const user_id = req.user.userId;
        const { productId } = req.params;
        const warenkorb = await warenkorb_1.default.findOne({ user_id });
        if (!warenkorb) {
            res.status(404).json({ message: "Kein Warenkorb gefunden" });
            return;
        }
        warenkorb.ordered_items = warenkorb.ordered_items.filter((item) => item.product_id.toString() !== productId);
        const { total_price } = await (0, calculateTotal_1.calculateTotal)(warenkorb.ordered_items);
        warenkorb.total_price = total_price;
        await warenkorb.save();
        res.status(200).json({ message: "Produkt entfernt", warenkorb });
    }
    catch (error) {
        console.error("removeItemFromWarenkorb ERROR:", error);
        res.status(500).json({ message: "Fehler beim Entfernen" });
    }
}
async function clearWarenkorb(req, res) {
    try {
        const user_id = req.user.userId;
        const warenkorb = await warenkorb_1.default.findOne({ user_id });
        if (!warenkorb) {
            res.status(404).json({ message: "Kein Warenkorb gefunden" });
            return;
        }
        warenkorb.ordered_items = [];
        warenkorb.total_price = 0;
        await warenkorb.save();
        res.status(200).json({ message: "Warenkorb geleert", warenkorb });
    }
    catch (error) {
        console.error("clearWarenkorb ERROR:", error);
        res.status(500).json({ message: "Fehler beim Leeren des Warenkorbs" });
    }
}
async function getAllWarenkorbs(_req, res) {
    try {
        const warenkorbs = await warenkorb_1.default.find();
        res.status(200).json(warenkorbs);
    }
    catch (error) {
        console.error("getAllWarenkorbs ERROR:", error);
        res.status(500).json({ message: "Fehler beim Abrufen aller Warenkörbe" });
    }
}
