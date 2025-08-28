const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  flightNumber: {
    type: String,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  downloadStatus: {
    type: String,
    enum: ['pending', 'success', 'not_found', 'error'],
    default: 'pending'
  },
  parseStatus: {
    type: String,
    enum: ['pending', 'success', 'error'],
    default: 'pending'
  },
  pdfPath: {
    type: String
  },
  needsReview: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Passenger', passengerSchema);