import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, password, verifyPassword } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      res.status(400).json({ error: "Username already exists" });
      return;
    }

    if (password !== verifyPassword) {
      res.status(400).json({ error: "Password and verification do not match" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user document
    const user = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
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
    const user = await User.findOne({ username });

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
