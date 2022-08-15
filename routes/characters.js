const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Character = require("../models/Character");

// desc ----- Show add page
//route ----- GET /
router.get("/add", ensureAuth, (req, res) => {
  res.render("characters/add");
});

// desc ----- Process add form
//route ----- POST /characters
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Character.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/500");
  }
});

// desc ----- Show adll characters
//route ----- GET /characters/add
router.get("/", ensureAuth, async (req, res) => {
  try {
    const characters = await Character.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    res.render("/characters/index", {
      characters,
    });
  } catch (error) {
    console.error(error);
    res.render("/error/500");
  }
});

module.exports = router;
