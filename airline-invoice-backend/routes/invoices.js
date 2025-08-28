const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Passenger = require('../models/Passenger');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('passenger', 'firstName lastName bookingReference')
      .sort({ date: -1 });
    
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get invoice summary
router.get('/summary', async (req, res) => {
  try {
    const totalInvoices = await Invoice.countDocuments();
    const successfulParses = await Passenger.countDocuments({ parseStatus: 'success' });
    const pendingDownloads = await Passenger.countDocuments({ downloadStatus: 'pending' });
    
    // Calculate total amount
    const amountResult = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);
    
    const totalAmount = amountResult.length > 0 ? amountResult[0].totalAmount : 0;
    
    res.json({
      totalInvoices,
      successfulParses,
      pendingDownloads,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get high-value invoices
router.get('/high-value', async (req, res) => {
  try {
    const threshold = parseFloat(req.query.threshold) || 500;
    
    const highValueInvoices = await Invoice.find({ amount: { $gt: threshold } })
      .populate('passenger', 'firstName lastName bookingReference')
      .sort({ amount: -1 });
    
    res.json(highValueInvoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('passenger', 'firstName lastName bookingReference flightNumber departureDate');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;