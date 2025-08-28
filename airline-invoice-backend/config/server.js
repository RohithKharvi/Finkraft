const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/database");
const passengerRoutes = require("./routes/passengers");
const invoiceRoutes = require("./routes/invoices");


const app = express();


(async () => {
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); 
  }
})();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/passengers", passengerRoutes);
app.use("/api/invoices", invoiceRoutes);


app.get("/", (req, res) => {
  res.json({ message: " Airline Invoice Processor API is running" });
});


app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});


app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
