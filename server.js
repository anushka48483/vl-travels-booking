// Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection (ENV BASED)
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
  });

// Booking Schema
const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  busType: { type: String, required: true },
  seats: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
});

const Booking = mongoose.model("Booking", bookingSchema);

// CREATE booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { customerName, busType, seats } = req.body;

    if (!customerName || !busType || !seats || seats <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const pricePerSeat = busType === "AC" ? 800 : 500;
    const totalPrice = pricePerSeat * seats;

    const booking = new Booking({
      customerName,
      busType,
      seats,
      totalPrice
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error creating booking" });
  }
});

// READ bookings
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// UPDATE booking
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const { customerName, busType, seats } = req.body;

    const pricePerSeat = busType === "AC" ? 800 : 500;
    const totalPrice = pricePerSeat * seats;

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { customerName, busType, seats, totalPrice },
      { new: true }
    );

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking" });
  }
});

// DELETE booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

// Serve frontend (IMPORTANT for Render)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server (Render compatible)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
