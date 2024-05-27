import mongoose from "mongoose";
import logger from "../utils/logger.mjs";
import { DB_CONNECTION_SUCCESS } from "../constants/label.mjs";
import { DB_CONNECTION_ERROR } from "../constants/error-message.mjs";

const MONGODB_URI = process.env.MONGODB_URI;
try {
  await mongoose.connect(MONGODB_URI, {});
  logger.info(DB_CONNECTION_SUCCESS);
} catch (error) {
  logger.error(`${DB_CONNECTION_ERROR}  : ${error}`);
}
