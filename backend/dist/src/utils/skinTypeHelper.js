"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineSkinTypeAndAdvice = determineSkinTypeAndAdvice;
function determineSkinTypeAndAdvice(answersRaw) {
    const answers = answersRaw instanceof Map ? Object.fromEntries(answersRaw) : answersRaw;
    const yes = (q) => answers[q] === 'ja';
    const scores = {
        fettig: 0,
        trocken: 0,
        normal: 0,
        misch: 0,
    };
    if (yes('q1'))
        scores.fettig++;
    if (yes('q3'))
        scores.fettig++;
    if (yes('q6'))
        scores.fettig++;
    if (yes('q2'))
        scores.trocken++;
    if (yes('q5'))
        scores.trocken++;
    if (yes('q9'))
        scores.trocken++;
    if (yes('q7'))
        scores.normal++;
    if (yes('q10'))
        scores.normal++;
    if (scores.fettig >= 1 && scores.trocken >= 1) {
        scores.misch += 2;
    }
    const max = Object.entries(scores).reduce((a, b) => (b[1] > a[1] ? b : a));
    const skinType = max[0];
    const texte = {
        trocken: 'Deine Haut benötigt intensive Feuchtigkeit und sanfte Pflege.',
        fettig: 'Deine Haut produziert überschüssigen Talg – verwende leichte, mattierende Produkte.',
        misch: 'Deine Haut hat sowohl fettige als auch trockene Zonen – achte auf gezielte Pflege.',
        normal: 'Deine Haut ist ausgeglichen – sanfte tägliche Pflege reicht aus.',
    };
    const advice = texte[skinType];
    return { skinType, advice };
}
