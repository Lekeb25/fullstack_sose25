"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_KEY = exports.DB_URIMONGODB = exports.PORT = void 0;
exports.sendResponse = sendResponse;
exports.PORT = 4545;
exports.DB_URIMONGODB = "mongodb://mongodb:27017/test";
exports.SECRET_KEY = "tRuBEf1A0l8Heth3qAgO";
const HttpStatus = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
    503: "Service Unavailable",
    409: "already exists",
};
function sendResponse(res, statusCode, data = "") {
    if (statusCode == 200) {
        return res.status(statusCode).json({
            ...data,
        });
    }
    else {
        return res.status(statusCode).json({
            status: statusCode,
            message: HttpStatus[statusCode],
            err: data,
        });
    }
}
