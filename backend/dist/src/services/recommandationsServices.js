"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendedProducts = void 0;
const productItems_1 = __importDefault(require("../models/productItems"));
const quizResponse_model_1 = __importDefault(require("../models/quizResponse.model"));
const getRecommendedProducts = async (req, res) => {
    try {
        const { userId } = req.params;
        const quiz = await quizResponse_model_1.default.findOne({ userId });
        if (!quiz) {
            res.status(404).json({ nachricht: 'Kein Quiz gefunden für diesen Benutzer.' });
            return;
        }
        const skinType = quiz.result;
        const products = await productItems_1.default.find({ skin_typ_target: skinType });
        res.status(200).json({
            hauttyp: skinType,
            empfohleneProdukte: products
        });
    }
    catch (fehler) {
        console.error('Fehler bei getRecommendedProducts:', fehler.message);
        res.status(500).json({ fehler: 'Fehler beim Laden der empfohlenen Produkte.' });
    }
};
exports.getRecommendedProducts = getRecommendedProducts;
