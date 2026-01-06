const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/vlTravelsDB")
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err.message);
});


// Schema
const bookingSchema = new mongoose.Schema({
    customerName: String,
    busType: String,
    seats: Number,
    totalPrice: Number
});

const Booking = mongoose.model("Booking", bookingSchema);

// CREATE booking
app.post("/api/bookings", async (req, res) => {
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
    res.json(booking);
});

// READ bookings
app.get("/api/bookings", async (req, res) => {
    res.json(await Booking.find());
});

// UPDATE booking
app.put("/api/bookings/:id", async (req, res) => {
    const { customerName, busType, seats } = req.body;

    const pricePerSeat = busType === "AC" ? 800 : 500;
    const totalPrice = pricePerSeat * seats;

    const updated = await Booking.findByIdAndUpdate(
        req.params.id,
        { customerName, busType, seats, totalPrice },
        { new: true }
    );

    res.json(updated);
});

// DELETE booking
app.delete("/api/bookings/:id", async (req, res) => {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
});

// Start server
app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
});
