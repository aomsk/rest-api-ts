import { Request, Response } from "express";

import { deleteUserById, getUserById, getUsers } from "../db/users";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleteUser = await deleteUserById(id);
    return res.status(200).json({ message: "Delete user successfully", deleteUser }).end();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id).select("username");
    user.username = username;
    await user.save();

    return res.status(200).json({ message: "Update username successfully", user }).end();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

// Logout
export const logout = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserById(id);

  user.authentication.sessionToken = "";
  res.clearCookie("USER-AUTH");

  await user.save();
  return res.status(200).json({ message: "Logout successfully", user });
};
