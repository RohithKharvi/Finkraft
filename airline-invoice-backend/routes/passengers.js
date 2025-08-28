const express = require('express');
const router = express.Router();
const Passenger = require('../models/Passenger');
const Invoice = require('../models/Invoice');
const { downloadInvoice } = require('../services/pdfDownloader');
const { parseInvoicePDF } = require('../services/pdfParser');
const upload = require('../middleware/upload');

// Get all passengers


// Create a new passenger
router.post('/', async (req, res) => {
  try {
    const passenger = new Passenger({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      bookingReference: req.body.bookingReference,  // required + unique
      flightNumber: req.body.flightNumber,
      departureDate: req.body.departureDate,
      downloadStatus: 'pending',
      parseStatus: 'pending',
      needsReview: false
    });

    await passenger.save();
    res.status(201).json(passenger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const passengers = await Passenger.find().sort({ createdAt: -1 });
    res.json(passengers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    res.json(passenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/:id/download', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    
    passenger.downloadStatus = 'pending';
    await passenger.save();
    
    
    const result = await downloadInvoice(passenger);
    
    if (result.success) {
      
      passenger.downloadStatus = 'success';
      passenger.pdfPath = result.filePath;
      await passenger.save();
      
      res.json(passenger);
    } else if (result.notFound) {
      
      passenger.downloadStatus = 'not_found';
      await passenger.save();
      
      res.status(404).json({ 
        message: 'Invoice not found for this passenger',
        passenger 
      });
    } else {
      
      passenger.downloadStatus = 'error';
      await passenger.save();
      
      res.status(500).json({ 
        message: result.error || 'Failed to download invoice',
        passenger 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Parse invoice for a passenger
router.post('/:id/parse', async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    if (passenger.downloadStatus !== 'success') {
      return res.status(400).json({ message: 'Invoice must be downloaded successfully before parsing' });
    }
    
    if (!passenger.pdfPath) {
      return res.status(400).json({ message: 'No PDF file available for parsing' });
    }
    
    // Update status to show parsing in progress
    passenger.parseStatus = 'pending';
    await passenger.save();
    
    // Parse the PDF
    const result = await parseInvoicePDF(passenger.pdfPath);
    
    if (result.success) {
      // Create invoice record
      const invoice = new Invoice({
        passenger: passenger._id,
        invoiceNumber: result.data.invoiceNumber,
        date: result.data.date,
        airline: result.data.airline,
        amount: result.data.amount,
        gstin: result.data.gstin,
        pdfPath: passenger.pdfPath
      });
      
      await invoice.save();
      
      // Update passenger with parse success
      passenger.parseStatus = 'success';
      await passenger.save();
      
      res.json({ 
        message: 'Invoice parsed successfully',
        passenger,
        invoice 
      });
    } else {
      // Update passenger with parse error
      passenger.parseStatus = 'error';
      await passenger.save();
      
      res.status(500).json({ 
        message: result.error || 'Failed to parse invoice',
        passenger 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update passenger review status
router.patch('/:id', async (req, res) => {
  try {
    const { needsReview } = req.body;
    const passenger = await Passenger.findByIdAndUpdate(
      req.params.id,
      { needsReview },
      { new: true }
    );
    
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    res.json(passenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload an invoice manually
router.post('/:id/upload', upload.single('invoice'), async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);
    if (!passenger) {
      return res.status(404).json({ message: 'Passenger not found' });
    }
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Update passenger with uploaded file
    passenger.downloadStatus = 'success';
    passenger.pdfPath = req.file.path;
    await passenger.save();
    
    res.json(passenger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;