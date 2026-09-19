require("dotenv").config();

const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Shree Hanuman Tours & Travels Backend is running"
  });
});
// Home Route
app.get("/", (req, res) => {
  res.send("Shree Hanuman Tours & Travels Backend is Running 🚗");
});

// Test API
app.get("/api/test", (req, res) => {
  res.json({
    message: "Frontend and Backend Connected Successfully 🚗"
  });
});

// Default car fleet list (mutable for admin operations)
let carsList = [
  {
    id: 1,
    carType: "Sedan",
    carModel: "Swift Dzire",
    ac: "AC",
    seats: 4,
    perKmRate: 15,
    extraHourRate: 200,
    driverAllowance: 500,
    status: "Available",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    carType: "MUV",
    carModel: "Ertiga",
    ac: "AC",
    seats: 7,
    perKmRate: 18,
    extraHourRate: 250,
    driverAllowance: 600,
    status: "Available",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    carType: "SUV",
    carModel: "Innova Crysta",
    ac: "AC",
    seats: 7,
    perKmRate: 22,
    extraHourRate: 300,
    driverAllowance: 700,
    status: "Available",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    carType: "Sedan",
    carModel: "Hyundai Aura / Xcent",
    ac: "AC",
    seats: 4,
    perKmRate: 14,
    extraHourRate: 180,
    driverAllowance: 500,
    status: "Available",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    carType: "SUV",
    carModel: "Toyota Fortuner",
    ac: "AC",
    seats: 7,
    perKmRate: 38,
    extraHourRate: 500,
    driverAllowance: 900,
    status: "On Booking",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    carType: "Executive / Traveller",
    carModel: "Tempo Traveller (12/17 Seater)",
    ac: "AC",
    seats: 7,
    perKmRate: 28,
    extraHourRate: 400,
    driverAllowance: 800,
    status: "Available",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
  }
];

// Initial bookings sample data
let bookings = [
  {
    id: "SHTT-1001",
    customerName: "Rahul Sharma",
    mobileNumber: "9820123456",
    car: "Swift Dzire",
    passengers: "4",
    tripType: "Outstation Trip",
    travelDate: "2026-09-20",
    pickupLocation: "Sector 3, Airoli",
    destination: "Pune",
    estimatedDistanceKm: 150,
    estimatedFare: 2750,
    additionalMessage: "Morning pickup at 7 AM required.",
    status: "Pending",
    createdAt: new Date().toISOString()
  },
  {
    id: "SHTT-1002",
    customerName: "Priya Verma",
    mobileNumber: "9819876543",
    car: "Innova Crysta",
    passengers: "6",
    tripType: "Airport Pickup & Drop",
    travelDate: "2026-09-22",
    pickupLocation: "Airoli Station",
    destination: "Mumbai Airport T2",
    estimatedDistanceKm: 35,
    estimatedFare: 1470,
    additionalMessage: "Need luggage roof carrier.",
    status: "Confirmed",
    createdAt: new Date().toISOString()
  }
];

// Initial contact inquiries sample data
let contactInquiries = [
  {
    id: "INQ-2001",
    name: "Amit Patel",
    mobile: "9769012345",
    email: "amit.p@example.com",
    message: "Inquiring about 3-day Mahabaleshwar tour package rates for Ertiga.",
    status: "New",
    createdAt: new Date().toISOString()
  }
];

// Public GET APIs
app.get("/api/cars", (req, res) => {
  res.json({
    success: true,
    count: carsList.length,
    data: carsList
  });
});

app.get("/api/bookings", (req, res) => {
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// Create Customer Booking
app.post("/api/bookings", (req, res) => {
  const bookingData = req.body;
  const booking = {
    id: "SHTT-" + Math.floor(1000 + Math.random() * 9000),
    ...bookingData,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);
  console.log("New Booking Received:", booking);

  res.json({
    success: true,
    message: "Booking saved successfully 🚗",
    booking: booking
  });
});

// Submit Customer Contact Inquiry
app.post("/api/contact", (req, res) => {
  const inquiry = {
    id: "INQ-" + Math.floor(1000 + Math.random() * 9000),
    ...req.body,
    status: "New",
    createdAt: new Date().toISOString()
  };

  contactInquiries.unshift(inquiry);
  console.log("New Contact Inquiry:", inquiry);

  res.json({
    success: true,
    message: "Inquiry submitted successfully!",
    inquiry: inquiry
  });
});

// Submit Customer Contact Inquiry
app.post("/api/contact", (req, res) => {
  // ...
});


// ==========================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ==========================================

const verifyAdminToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Admin access denied"
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token"
    });
  }
};


// ==========================================
// ADMIN PANEL API ENDPOINTS
// ==========================================

// ==========================================
// ADMIN PANEL API ENDPOINTS
// ==========================================

// Admin Login
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  const correctUsername = process.env.ADMIN_USERNAME;
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (
    username &&
    password &&
    username.trim() === correctUsername &&
    password === correctPassword
  ) {
    res.json({
      success: true,
      message: "Admin login successful",
      token: jwt.sign(
  {
    username: correctUsername,
    role: "owner"
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "2h"
  }
),
      admin: {
        username: correctUsername,
        name: "Shree Hanuman Admin",
        role: "owner"
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid username or password"
    });
  }
});

// Admin Dashboard Summary Metrics
app.get("/api/admin/stats", verifyAdminToken, (req, res) => {
  const totalCars = carsList.length;
  const availableCars = carsList.filter(c => c.status === "Available").length;
  const carsOnBooking = carsList.filter(c => c.status === "On Booking").length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === "Pending" || b.status === "Received").length;
  const totalInquiries = contactInquiries.length;

  res.json({
    success: true,
    stats: {
      totalCars,
      availableCars,
      carsOnBooking,
      totalBookings,
      pendingBookings,
      totalInquiries
    }
  });
});

// Admin: Add New Car
app.post("/api/admin/cars", verifyAdminToken, (req, res) => {
  const carData = req.body;
  const newCar = {
    id: Date.now(),
    carType: carData.carType || "Sedan",
    carModel: carData.carModel,
    ac: carData.ac || "AC",
    seats: parseInt(carData.seats, 10) || 4,
    perKmRate: parseFloat(carData.perKmRate) || 15,
    extraHourRate: parseFloat(carData.extraHourRate) || 200,
    driverAllowance: parseFloat(carData.driverAllowance) || 500,
    status: carData.status || "Available",
    image: carData.image || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80"
  };

  carsList.unshift(newCar);
  res.json({ success: true, message: "Car added successfully", car: newCar });
});

// Admin: Update Car
app.put("/api/admin/cars/:id", verifyAdminToken, (req, res) => {
  const carId = parseInt(req.params.id, 10);
  const index = carsList.findIndex(c => c.id === carId);

  if (index !== -1) {
    carsList[index] = {
      ...carsList[index],
      ...req.body,
      seats: parseInt(req.body.seats, 10) || carsList[index].seats,
      perKmRate: parseFloat(req.body.perKmRate) || carsList[index].perKmRate,
      extraHourRate: parseFloat(req.body.extraHourRate) || carsList[index].extraHourRate,
      driverAllowance: parseFloat(req.body.driverAllowance) || carsList[index].driverAllowance
    };
    res.json({ success: true, message: "Car updated successfully", car: carsList[index] });
  } else {
    res.status(404).json({ success: false, message: "Car not found" });
  }
});

// Admin: Delete Car
app.delete("/api/admin/cars/:id", verifyAdminToken, (req, res) => {
  const carId = parseInt(req.params.id, 10);
  const initialLen = carsList.length;
  carsList = carsList.filter(c => c.id !== carId);

  if (carsList.length < initialLen) {
    res.json({ success: true, message: "Car deleted successfully" });
  } else {
    res.status(404).json({ success: false, message: "Car not found" });
  }
});

// Admin: Get All Bookings
app.get("/api/admin/bookings", verifyAdminToken, (req, res) => {
  res.json({ success: true, count: bookings.length, data: bookings });
});

// Admin: Update Booking Status
app.put("/api/admin/bookings/:id", verifyAdminToken, (req, res) => {  const bookingId = req.params.id;
  const booking = bookings.find(b => b.id === bookingId);

  if (booking) {
    booking.status = req.body.status || booking.status;
    res.json({ success: true, message: "Booking status updated", booking });
  } else {
    res.status(404).json({ success: false, message: "Booking not found" });
  }
});

// Admin: Get All Contact Inquiries
app.get("/api/admin/inquiries", (req, res) => {
  res.json({ success: true, count: contactInquiries.length, data: contactInquiries });
});

// Admin: Update Inquiry Status
app.put("/api/admin/inquiries/:id", (req, res) => {
  const inqId = req.params.id;
  const inquiry = contactInquiries.find(i => i.id === inqId);

  if (inquiry) {
    inquiry.status = req.body.status || inquiry.status;
    res.json({ success: true, message: "Inquiry status updated", inquiry });
  } else {
    res.status(404).json({ success: false, message: "Inquiry not found" });
  }
});

// Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});