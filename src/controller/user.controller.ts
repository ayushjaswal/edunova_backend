import { Request, Response } from "express";
import user from "../models/user.model.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await user.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error });
  }
};

export const addUser = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;
    const result = await user.create({ name, email });
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json({ message: "Failed to create a new user" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};
