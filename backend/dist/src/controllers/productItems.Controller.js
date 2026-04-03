"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
const productItems_1 = __importDefault(require("../models/productItems"));
async function getAllProducts(req, res) {
    try {
        const { effect, skinType } = req.query;
        const filter = {};
        if (effect)
            filter.effect = effect;
        if (skinType)
            filter.skin_typ_target = skinType;
        const products = await productItems_1.default.find(filter);
        res.status(200).json({
            message: "Products retrieved successfully",
            data: products,
        });
    }
    catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ error: "Server error while fetching products" });
    }
}
async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productItems_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({
            message: "Product retrieved successfully",
            data: product,
        });
    }
    catch (error) {
        console.error("Error fetching product by ID:", error.message);
        res.status(500).json({ error: "Server error while fetching product" });
    }
}
async function createProduct(req, res) {
    try {
        const { p_name, p_description, skin_typ_target, effect, price, image_url } = req.body;
        if (!p_name || !skin_typ_target || !effect || !price || !image_url) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const newProduct = new productItems_1.default({
            p_name,
            p_description,
            skin_typ_target,
            effect,
            price,
            image_url,
        });
        await newProduct.save();
        res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    }
    catch (error) {
        console.error("Error creating product:", error.message);
        res.status(500).json({ error: "Server error while creating product" });
    }
}
async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const product = await productItems_1.default.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({
            message: "Product updated successfully",
            data: product,
        });
    }
    catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ error: "Server error while updating product" });
    }
}
async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await productItems_1.default.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({
            message: "Product deleted successfully",
            data: product,
        });
    }
    catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ error: "Server error while deleting product" });
    }
}
