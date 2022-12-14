const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");

const Character = require("../models/Character");

// desc ----- Login/Landing Page
//route ----- GET /
router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

// desc ----- Dashboard
//route ----- GET /
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const characters = await Character.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.firstName,
      characters,
    });
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});
module.exports = router;
