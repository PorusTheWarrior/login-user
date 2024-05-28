import express from "express";
import bcrypt from "bcrypt";
import { CREATED } from "../constants/success-code.mjs";
import User from "../model/user.model.mjs";
import {
  FIRST_NAME_REQUIRED,
  INTERNAL_SERVER_ERROR,
  INVALID_CREDS,
  INVALID_EMAIL,
  LAST_NAME_REQUIRED,
  PASSWORD_REQUIRED,
  PASSWORD_WITH_MORE_THAN_SIX_DIGITS,
  USER_ALREADY_EXIST,
} from "../constants/error-message.mjs";
import { check } from "express-validator";
import { INTERNAL_SERVER_ERROR_CODE } from "../constants/error-code.mjs";
import logger from "../utils/logger.mjs";
import validate from "../middlerware/validate.mjs";
import { LOGIN_SUCCESS, REGISTERED_SUCCESS } from "../constants/label.mjs";
const router = express.Router();

router.post(
  "/sign-up",
  [
    check("first_name", FIRST_NAME_REQUIRED).not().isEmpty(),
    check("last_name", LAST_NAME_REQUIRED).not().isEmpty(),
    check("email", INVALID_EMAIL).isEmail(),
    check("password", PASSWORD_WITH_MORE_THAN_SIX_DIGITS).not().isEmpty(),
  ],
  validate,
  async (req, res) => {
    const { first_name, last_name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: USER_ALREADY_EXIST });
      }

      user = new User({
        first_name,
        last_name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res
        .status(CREATED)
        .json({ first_name, last_name, email, message: REGISTERED_SUCCESS });
    } catch (error) {
      console.log(error);
      logger.error(error.message);
      res.status(INTERNAL_SERVER_ERROR_CODE).send(INTERNAL_SERVER_ERROR);
    }
  }
);

router.post(
  "/sign-in",
  [
    check("email", INVALID_EMAIL).isEmail(),
    check("password", PASSWORD_REQUIRED).exists(),
  ],
  validate,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: INVALID_CREDS });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: INVALID_CREDS });
      }

      res.status(200).json({ email, message: LOGIN_SUCCESS });
    } catch (error) {
      logger.error(error.message);
      res.status(INTERNAL_SERVER_ERROR_CODE).send(INTERNAL_SERVER_ERROR);
    }
  }
);

export default router;
