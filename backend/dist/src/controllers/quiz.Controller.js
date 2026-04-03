"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrUpdateQuiz = createOrUpdateQuiz;
exports.getQuizByUser = getQuizByUser;
exports.getQuizQuestions = getQuizQuestions;
const quizResponse_model_1 = __importDefault(require("../models/quizResponse.model"));
const skinTypeHelper_1 = require("../utils/skinTypeHelper");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function createOrUpdateQuiz(req, res) {
    try {
        const { userId, answers } = req.body;
        if (!userId || !answers) {
            res
                .status(400)
                .json({ message: "userId und Antworten sind erforderlich." });
            return;
        }
        const parsedAnswers = answers instanceof Map ? Object.fromEntries(answers) : answers;
        const { skinType, advice } = (0, skinTypeHelper_1.determineSkinTypeAndAdvice)(parsedAnswers);
        const existing = await quizResponse_model_1.default.findOne({ userId });
        if (existing) {
            existing.answers = parsedAnswers;
            existing.result = skinType;
            await existing.save();
            res
                .status(200)
                .json({ message: "Aktualisiert", result: skinType, advice });
            return;
        }
        const newQuiz = new quizResponse_model_1.default({
            userId,
            answers: parsedAnswers,
            result: skinType,
        });
        await newQuiz.save();
        res.status(201).json({ message: "Gespeichert", result: skinType, advice });
    }
    catch (err) {
        console.error(" Fehler in createOrUpdateQuiz:", err.message);
        res.status(500).json({ error: err.message });
    }
}
async function getQuizByUser(req, res) {
    try {
        const { id } = req.params;
        const quiz = await quizResponse_model_1.default.findOne({ userId: id });
        if (!quiz) {
            res.status(404).json({ message: "Kein Quiz gefunden." });
            return;
        }
        res.status(200).json(quiz);
    }
    catch (err) {
        console.error(" Fehler in getQuizByUser:", err.message);
        res.status(500).json({ error: err.message });
    }
}
function getQuizQuestions(req, res) {
    try {
        const filePath = path_1.default.join(__dirname, "../models/mongo/Data/quizQuestions.json");
        const data = JSON.parse(fs_1.default.readFileSync(filePath, "utf-8"));
        res.status(200).json(data.questions);
    }
    catch (err) {
        console.error(" Fehler in getQuizQuestions:", err.message);
        res.status(500).json({ error: "Fragen konnten nicht geladen werden." });
    }
}
