"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusOrder = exports.StatusPayment = exports.StatusProdukt = exports.StatusKorb = void 0;
var StatusKorb;
(function (StatusKorb) {
    StatusKorb["OFFEN"] = "Offen";
    StatusKorb["BESTELLT"] = "Bestellt";
    StatusKorb["ABGEBROCHEN"] = "Abgebrochen";
    StatusKorb["ABGELAUFEN"] = "Abgelaufen";
})(StatusKorb || (exports.StatusKorb = StatusKorb = {}));
var StatusProdukt;
(function (StatusProdukt) {
    StatusProdukt["VERFUEGBAR"] = "Verfuegbar";
    StatusProdukt["AUSVERKAUFT"] = "Ausverkauft";
})(StatusProdukt || (exports.StatusProdukt = StatusProdukt = {}));
var StatusPayment;
(function (StatusPayment) {
    StatusPayment["AUSSTEHEND"] = "ausstehend";
    StatusPayment["BEZAHLT"] = "bezahlt";
    StatusPayment["FEHLGESCHLAGEN"] = "fehlgeschlagen";
})(StatusPayment || (exports.StatusPayment = StatusPayment = {}));
var StatusOrder;
(function (StatusOrder) {
    StatusOrder["PENDING"] = "pending";
    StatusOrder["CONFIRMED"] = "confirmed";
    StatusOrder["SHIPPED"] = "shipped";
    StatusOrder["DELIVERED"] = "delivered";
    StatusOrder["CANCELLED"] = "cancelled";
})(StatusOrder || (exports.StatusOrder = StatusOrder = {}));
