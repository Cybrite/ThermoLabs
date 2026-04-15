import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db/neon.js";

const ALLOWED_ROLES = ["professor", "student"];

const buildToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "dev-jwt-secret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" },
  );

const sanitizeUser = (user) => ({
  id: user.id,
  fullName: user.full_name,
  email: user.email,
  role: user.role,
  createdAt: user.created_at,
});

export const signup = async (req, res) => {
  const { fullName, email, password, role } = req.body;

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({
      success: false,
      error: "fullName, email, password, and role are required.",
    });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({
      success: false,
      error: "Role must be either 'professor' or 'student'.",
    });
  }

  if (String(password).length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters.",
    });
  }

  try {
    const emailLower = String(email).toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO users (full_name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, role, created_at
      `,
      [String(fullName).trim(), emailLower, passwordHash, role],
    );

    const user = result.rows[0];
    const token = buildToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        error: "Email is already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create account.",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "email and password are required.",
    });
  }

  try {
    const emailLower = String(email).toLowerCase().trim();
    const result = await pool.query(
      `
      SELECT id, full_name, email, role, password_hash, created_at
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [emailLower],
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const token = buildToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      error: "Failed to login.",
    });
  }
};

export const me = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT id, full_name, email, role, created_at
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.user.id],
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch current user.",
    });
  }
};
