const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/airline_invoices';

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, 
    });

    console.log(`✅ MongoDB connected: ${uri}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
