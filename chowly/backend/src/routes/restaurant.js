const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET /api/restaurant - returns the first (and only, for this build) restaurant
router.get("/", async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) return res.status(404).json({ error: "No restaurant found. Did you run the seed script?" });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
