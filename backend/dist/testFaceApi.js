"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
dotenv_1.default.config();
const imageBase64 = fs_1.default.readFileSync("./test.jpg", {
    encoding: "base64",
});
async function testFaceApi() {
    try {
        const payload = qs_1.default.stringify({
            api_key: process.env.FACE_API_KEY,
            api_secret: process.env.FACE_API_SECRET,
            image_base64: imageBase64,
        });
        const response = await axios_1.default.post("https://api-us.faceplusplus.com/facepp/v1/skinanalyze", payload, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log("✅ Réponse API Face++ :");
        console.log(JSON.stringify(response.data, null, 2));
    }
    catch (error) {
        console.error("❌ Erreur API :", error.response?.data || error.message);
    }
}
testFaceApi();
