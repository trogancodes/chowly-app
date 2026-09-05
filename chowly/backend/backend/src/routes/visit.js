const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

// POST /api/visits - a customer arrives at a table and "checks in".
// Body: { fullName, tableNumber, restaurantId }
// Creates a lightweight Customer record (no login/password, per the brief) and a Visit
// tied to the chosen restaurant and the table/seat number they typed in.
router.post("/", async (req, res, next) => {
  try {
    const { fullName, tableNumber, restaurantId } = req.body;
    if (!fullName || !tableNumber || !restaurantId) {
      return res.status(400).json({ error: "fullName, tableNumber and restaurantId are required." });
    }

    const restaurant = await prisma.restaurant.findUnique({ where: { id: parseInt(restaurantId, 10) } });
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found." });

    const customer = await prisma.customer.create({
      data: { fullName: fullName.trim() },
    });

    const visit = await prisma.visit.create({
      data: {
        customerId: customer.id,
        restaurantId: restaurant.id,
        tableNumber: parseInt(tableNumber, 10),
      },
    });

    res.status(201).json({ visit, customer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
