const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET /api/menu - all available menu items with their category, for the customer menu screen
router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: {
          where: { isAvailable: true },
          orderBy: { itemName: "asc" },
        },
      },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
