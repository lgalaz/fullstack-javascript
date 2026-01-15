import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const isTest = process.env.NODE_ENV === "test";

const config = {
  database: isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
  user: isTest ? process.env.TEST_DB_USER : process.env.DB_USER,
  password: isTest ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
  host: isTest ? process.env.TEST_DB_HOST : process.env.DB_HOST,
  port: Number(isTest ? process.env.TEST_DB_PORT : process.env.DB_PORT) || 3306
};

if (!config.database || !config.user || !config.host) {
  throw new Error("Database configuration missing; check .env");
}

const sequelize = new Sequelize(config.database, config.user, config.password, {
  host: config.host,
  port: config.port,
  dialect: "mysql",
  logging: false
});

export default sequelize;
