"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const db_1 = __importDefault(require("./config/db"));
const user_Routes_1 = __importDefault(require("./routes/user.Routes"));
const order_Routes_1 = __importDefault(require("./routes/order.Routes"));
const payment_Routes_1 = __importDefault(require("./routes/payment.Routes"));
const productItems_Routes_1 = __importDefault(require("./routes/productItems.Routes"));
const quiz_Routes_1 = __importDefault(require("./routes/quiz.Routes"));
const skinAnalysis_Routes_1 = __importDefault(require("./routes/skinAnalysis.Routes"));
const warenkorb_Routes_1 = __importDefault(require("./routes/warenkorb.Routes"));
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 3000;
const allowedOrigins = ["http://localhost:4200", "http://localhost:8080"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (!allowedOrigins.includes(origin)) {
            return callback(new Error(`CORS policy: Origin ${origin} not allowed`), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.send("Hello, the API Skinkare is running.");
});
app.use("/api/users", user_Routes_1.default);
app.use("/api/orders", order_Routes_1.default);
app.use("/api/payments", payment_Routes_1.default);
app.use("/api/product-items", productItems_Routes_1.default);
app.use("/api/quiz", quiz_Routes_1.default);
app.use("/api/skin-analysis", skinAnalysis_Routes_1.default);
app.use("/api/warenkorb", warenkorb_Routes_1.default);
app.get("/api/test", (_req, res) => {
    res.json({ message: "Front-end & back-end connectés !" });
});
(async () => {
    try {
        await (0, mongodb_1.default)();
        // await seedIfEmpty();
        await db_1.default.sync({ alter: true });
        console.log("All tables created or updated.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Startup error:", err);
        process.exit(1);
    }
})();
