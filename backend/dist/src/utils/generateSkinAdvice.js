"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSkinAdvice = generateSkinAdvice;
function generateSkinAdvice(skinType) {
    const texte = {
        trocken: 'Deine Haut benötigt intensive Feuchtigkeit und sanfte Pflege.',
        fettig: 'Deine Haut produziert überschüssigen Talg – verwende leichte, mattierende Produkte.',
        misch: 'Deine Haut hat sowohl fettige als auch trockene Zonen – achte auf gezielte Pflege.',
        normal: 'Deine Haut ist ausgeglichen – sanfte tägliche Pflege reicht aus.',
    };
    return texte[skinType] ?? 'Pflegehinweise nicht verfügbar.';
}
