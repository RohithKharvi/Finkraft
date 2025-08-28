// backend/seedData.js
const mongoose = require('mongoose');
const Passenger = require('./models/Passenger');
require('dotenv').config();

const samplePassengers = [
  {
    ticketNumber: "2172860898782",
    firstName: "Ashar",
    lastName: "Ahmed",
    bookingReference: "ABC123",
    flightNumber: "AI101",
    departureDate: new Date("2023-11-15"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2173425250895",
    firstName: "PRASOON",
    lastName: "YADAV",
    bookingReference: "DEF456",
    flightNumber: "AI102",
    departureDate: new Date("2023-11-16"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2173420960092",
    firstName: "VICTOR",
    lastName: "WAGNER",
    bookingReference: "GHI789",
    flightNumber: "AI103",
    departureDate: new Date("2023-11-17"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2173420770687",
    firstName: "NAYAN",
    lastName: "KHANNA",
    bookingReference: "JKL012",
    flightNumber: "AI104",
    departureDate: new Date("2023-11-18"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2175905535614",
    firstName: "KAUSHIK",
    lastName: "BANERJEE",
    bookingReference: "MNO345",
    flightNumber: "AI105",
    departureDate: new Date("2023-11-19"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2175904917328",
    firstName: "MANJUNATHASWAMY",
    lastName: "DINNIMATH",
    bookingReference: "PQR678",
    flightNumber: "AI106",
    departureDate: new Date("2023-11-20"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2175413770504",
    firstName: "SOUMYA",
    lastName: "PARVATIYAR",
    bookingReference: "STU901",
    flightNumber: "AI107",
    departureDate: new Date("2023-11-21"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2173079287333",
    firstName: "RAGHAV",
    lastName: "SALLY",
    bookingReference: "VWX234",
    flightNumber: "AI108",
    departureDate: new Date("2023-11-22"),
    downloadStatus: "pending",
    parseStatus: "pending"
  },
  {
    ticketNumber: "2173078482499",
    firstName: "VIKAS",
    lastName: "SAINI",
    bookingReference: "YZA567",
    flightNumber: "AI109",
    departureDate: new Date("2023-11-23"),
    downloadStatus: "pending",
    parseStatus: "pending"
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/airline_invoices');
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Passenger.deleteMany({});
    console.log('Cleared existing passengers');
    
    // Insert sample data
    await Passenger.insertMany(samplePassengers);
    console.log('Added sample passengers');
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();