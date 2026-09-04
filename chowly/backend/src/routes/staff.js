const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET /api/staff - waiters, chefs and bartenders, for the waiter's "assign" dropdowns
router.get("/", async (req, res, next) => {
  try {
    const [waiters, chefs, bartenders] = await Promise.all([
      prisma.waiter.findMany(),
      prisma.chef.findMany(),
      prisma.bartender.findMany(),
    ]);
    res.json({ waiters, chefs, bartenders });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
