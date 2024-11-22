import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { hashPassword, verifyPassword } from "../utils/password-hash";
import { generateToken } from "../utils/generate-token";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      first_name,
      last_name,
      email,
      username,
      password,
      confirm_password,
    } = req.body;

    if (
      ![
        first_name,
        last_name,
        email,
        username,
        password,
        confirm_password,
      ].every(Boolean)
    ) {
      res.status(422).json({ message: "All fields are required" });
      return;
    }

    if (password !== confirm_password) {
      res.status(422).json({ message: "Password mismatch" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      res
        .status(400)
        .send({ message: "Username or Email Address already taken" });
      return;
    }

    const user = userRepository.create({
      first_name,
      last_name,
      email,
      username,
      password: await hashPassword(password),
    });

    await userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;

    res
      .status(201)
      .json({ message: "User created", user: userWithoutPassword });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOneBy({ id: parseInt(userId) });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const { password, ...dataWithoutPassword } = user;
    res.status(200).json({ user: dataWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required" });
      return;
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken({ id: user.id, username: user.username });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
