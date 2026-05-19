const express = require("express");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email ve şifre zorunludur.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Email veya şifre hatalı.",
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email veya şifre hatalı.",
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, getCookieOptions());

    res.json({
      message: "Giriş başarılı.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Giriş yapılırken hata oluştu.",
      error: error.message,
    });
  }
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token", getCookieOptions());

  res.json({
    message: "Çıkış yapıldı.",
  });
});

/**
 * GET /api/auth/me
 */
router.get("/me", protect, (req, res) => {
  res.json({
    user: req.user,
  });
});

module.exports = router;