const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET /api/restaurants - list every restaurant, for the restaurant-picker screen
router.get("/", async (req, res, next) => {
  try {
    const restaurants = await prisma.restaurant.findMany({ orderBy: { name: "asc" } });
    res.json(restaurants);
  } catch (err) {
    next(err);
  }
});

// GET /api/restaurants/:id - a single restaurant's details
router.get("/:id", async (req, res, next) => {
  try {
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    });
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found." });
    res.json(restaurant);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
