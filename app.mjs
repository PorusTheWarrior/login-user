import express from "express";
import logger from "./utils/logger.mjs";
import { SERVER_NOT_LISTENING } from "./constants/error-message.mjs";
import { SERVER_LISTENING_ON_PORT_SUCCESS } from "./constants/label.mjs";
import "./db/db.mjs";
import userController from "./controller/user.controller.mjs";
import bodyParser from "body-parser";
import cors from "cors"

const app = express();

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api", userController);

const PORT = process.env.PORT || 3030;;

app.listen(PORT, (error) => {
  if (!error) {
    logger.info(`${SERVER_LISTENING_ON_PORT_SUCCESS} ${PORT}`);
  } else {
    logger.error(`${SERVER_NOT_LISTENING}`);
  }
});
