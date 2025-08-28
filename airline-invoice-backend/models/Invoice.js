const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Passenger',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  airline: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  gstin: {
    type: String
  },
  pdfPath: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);