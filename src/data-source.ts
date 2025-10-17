import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined;

export const AppDataSource = new DataSource({
  type: "postgres",

  port: port,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  entities: [__dirname + "/**/entities/*.{js,ts}"],
  migrations: [__dirname + "/**/migrations/*.{js,ts}"],

  synchronize: true,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
