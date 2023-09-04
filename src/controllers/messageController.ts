import { Request, Response } from "express";
import User from "../models/User";
import Message from "../models/Message";

// Send an anonymous message to a specific user
export const sendMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;
    const { content } = req.body;

    const recipient = await User.findOne({ username });

    if (!recipient) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }

    // Create a new message
    const message = new Message({
      sender: "Anonymous",
      receiver: username,
      content,
    });

    // Save the message to the database
    await message.save();
    recipient.messages.push(message);
    await recipient.save();

    res.status(201).json({ message: "Anonymous message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Message sending failed" });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { username } = req.params;

    // Find the recipient user by username
    const recipient = await User.findOne({ username });
    if (!recipient) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }

    // Fetch the recipient's messages
    const messages = await Message.find({ receiver: username })
      .sort({ timestamp: "desc" })
      .exec();

    res.status(200).json({
      data: messages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};
