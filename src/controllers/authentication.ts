import { Request, Response } from "express";
import { createUser, getUserByEmail, getUserById } from "../db/users";
import { random, authentication } from "../helpers";

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Plase enter email or password" });
    }

    const user = await getUserByEmail(email).select("+authentication.salt +authentication.password");
    // .select("+authentication.salt +authentication.password") => ถ้าไม่ใส่มันจะเข้าถึง salt กับ password ไม่ได้
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist or Email do not match Plase try again" });
    }

    const expectedHash = authentication(user.authentication.salt as string, password);
    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ message: "Passwords do not match Please try again" });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    await user.save();
    res.cookie("USER-AUTH", user.authentication.sessionToken, { domain: "localhost", path: "/" });
    res.status(200).json(user).end();
  } catch (error) {
    console.log(error.message);
    return res.sendStatus(400);
  }
};

// Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: "Plase enter email or password or username" });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User is exist in database" });
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
