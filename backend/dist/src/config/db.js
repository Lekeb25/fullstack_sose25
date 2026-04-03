"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
exports.default = sequelize;
/* import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log("DB ENV VALUES:", {
  db: process.env.SQL_DB,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  host: process.env.SQL_HOST,
  port: process.env.SQL_PORT,
});

const dbName = process.env.SQL_DB as string;
const dbUser = process.env.SQL_USER as string;
const dbPassword = process.env.SQL_PASSWORD as string;
const dbHost = process.env.SQL_HOST as string;
const dbPort = parseInt(process.env.SQL_PORT as string, 10);

console.log(
  "process.env.SQL_PASSWORD typeof:",
  typeof dbPassword,
  " value:",
  dbPassword
);

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: "postgres",
  define: {
    timestamps: true,
    underscored: true,
  },
 logging: process.env.NODE_ENV === 'test' ? false : console.log,
});

if (process.env.NODE_ENV !== "test") {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection to DB has been established successfully!");
    })
    .catch((err: unknown) => {
      console.error("Unable to connect to the database:", err);
    });
}

export default sequelize;

*/ 
