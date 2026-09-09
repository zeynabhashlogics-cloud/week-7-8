
import "dotenv/config";

import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const router = express.Router();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
       {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (name.trim().length < 2) 
      {
      return res.status(400).json({
        message: "Name should have atleast 2 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
// gives us a cleaner version of mail
    const found = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });
// in case of duplicate email 
    if (found) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: 
      {
        name: name.trim(),
        email: cleanEmail,
        password: hash,
      },
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(201).json({
      message: "User registered successfully",
      user: safeUser,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: cleanEmail,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).json({
      message: "Login successful",
      token,
      user: safeUser,
    });

  } 
  catch (error) {
    console.error("LOGIN ERROR : ", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
