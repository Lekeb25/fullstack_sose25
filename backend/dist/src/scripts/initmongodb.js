"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const execPromise = util_1.default.promisify(child_process_1.exec);
const dumpDir = path_1.default.resolve(__dirname, "../../../dump");
const remoteUri = "mongodb+srv://inf4302:DekE&bBmZ3.5af8@ourapp.sq3togc.mongodb.net/skincare";
const localHost = "mongo";
const dbName = "skincare";
async function waitForMongoReady() {
    console.log("Waiting for Mongo to be ready...");
    let connected = false;
    while (!connected) {
        try {
            const client = new mongodb_1.MongoClient(`mongodb://${localHost}:27017`);
            await client.connect();
            await client.db(dbName).command({ ping: 1 });
            await client.close();
            connected = true;
            console.log("Mongo is ready.");
        }
        catch {
            console.log("Mongo not ready, retrying...");
            await new Promise((r) => setTimeout(r, 2000));
        }
    }
}
async function seedIfEmpty() {
    await waitForMongoReady();
    const client = new mongodb_1.MongoClient(`mongodb://${localHost}:27017`);
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    if (collections.length === 0) {
        console.log("DB empty, importing data...");
        await execPromise(`mongodump --uri="${remoteUri}" --out="${dumpDir}"`);
        await execPromise(`mongorestore --host=${localHost} --db=${dbName} --drop "${dumpDir}/${dbName}"`);
        console.log("Dump and restore completed.");
    }
    else {
        console.log("DB already has data, skipping import.");
    }
    await client.close();
}
exports.default = seedIfEmpty;
