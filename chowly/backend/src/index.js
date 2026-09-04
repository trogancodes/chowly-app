require("dotenv").config();
const express = require("express");
const cors = require("cors");

const restaurantRoutes = require("./routes/restaurant");
const menuRoutes = require("./routes/menu");
const staffRoutes = require("./routes/staff");
const visitRoutes = require("./routes/visit");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");
const feedbackRoutes = require("./routes/feedback");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Chowly API is running." });
});
app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/restaurant", restaurantRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/visits", visitRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/feedback", feedbackRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on the server." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Chowly API listening on port ${PORT}`);
});
