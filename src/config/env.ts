import dotenv from "dotenv";
dotenv.config({ quiet: true });;

export const ENV = {
  PORT: parseInt(process.env.PORT || "3010", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "defaultsecret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
};