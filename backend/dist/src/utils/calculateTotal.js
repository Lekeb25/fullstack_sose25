"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = void 0;
const productItems_1 = __importDefault(require("../models/productItems"));
const calculateTotal = async (ordered_items) => {
    let total_price = 0;
    const processedItems = [];
    for (const item of ordered_items) {
        const product = await productItems_1.default.findById(item.product_id);
        if (!product)
            throw new Error(`Produkt ${item.product_id} nicht gefunden.`);
        const subtotal = product.price * item.quantity;
        total_price += subtotal;
        processedItems.push({
            product_id: product._id,
            name: product.p_name,
            price: product.price,
            quantity: item.quantity
        });
    }
    return { total_price, processedItems };
};
exports.calculateTotal = calculateTotal;
