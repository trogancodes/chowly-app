const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// GET /api/menu?restaurantId=1 - available menu items for one restaurant, grouped by category
router.get("/", async (req, res, next) => {
  try {
    const { restaurantId } = req.query;
    if (!restaurantId) return res.status(400).json({ error: "restaurantId query param is required." });

    const categories = await prisma.menuCategory.findMany({
      include: {
        menuItems: {
          where: { isAvailable: true, restaurantId: parseInt(restaurantId, 10) },
          orderBy: { itemName: "asc" },
        },
      },
    });
    // Only return categories that actually have items at this restaurant
    res.json(categories.filter((c) => c.menuItems.length > 0));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
