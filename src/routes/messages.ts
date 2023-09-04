import express from "express";
import { sendMessage, getMessages } from "../controllers/messageController";

const router = express.Router();

router.post("/:username", sendMessage);
router.get("/:username", getMessages);

export default router;
