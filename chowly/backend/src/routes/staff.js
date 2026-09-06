const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET /api/staff?restaurantId=1 - waiters, chefs and bartenders for one restaurant,
// for the waiter's "assign" dropdowns
router.get("/", async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    if (!restaurantId) return res.status(400).json({ error: "restaurantId query param is required." });
    const rid = parseInt(restaurantId, 10);

    const [waiters, chefs, bartenders] = await Promise.all([
      prisma.waiter.findMany({ where: { restaurantId: rid } }),
      prisma.chef.findMany({ where: { restaurantId: rid } }),
      prisma.bartender.findMany({ where: { restaurantId: rid } }),
    ]);
    res.json({ waiters, chefs, bartenders });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
