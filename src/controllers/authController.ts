import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import generatePasswordResetToken from "../utils/generatepassword";
import sendPasswordResetEmail from "../utils/mailer";
import User from "../models/User";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, verifyPassword, email } = req.body;

  try {
    //check if email or username exists
    const singleUser = username || email;
    const existingUser = await User.findOne({ singleUser });

    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    if (password !== verifyPassword) {
      res.status(400).json({ error: "Password and verification do not match" });
      return;
    }

    //change username format
    const formattedUsername = `@${username}`;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user document
    const user = new User({
      username: formattedUsername,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [
        { username },
        {
          username: `@${username}`,
        },
      ],
    });

    if (!user) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    const expiresIn = 60 * 60 * 24 * Math.floor(Math.random() * 2 + 2); // 2-3 days in seconds

    const token = jwt.sign(
      { username: user.username },
      process.env.JWT_SECRET as string,
      {
        expiresIn,
      }
    );

    res.status(200).json({ exp: expiresIn, username: user.username, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

//reset password
export const requestPasswordReset = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const token = generatePasswordResetToken();

    user.passwordResetToken = token;
    user.passwordResetTokenExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
    sendPasswordResetEmail(email, resetLink);
    res.status(200).json({ message: "Password reset link sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Password reset failed" });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, newPassword, verifyPassword } = req.body;
  try {
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });
    if (!user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    if (newPassword !== verifyPassword) {
      res.status(400).json({ error: "Passwords do not match" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;

    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Password reset failed" });
  }
};
