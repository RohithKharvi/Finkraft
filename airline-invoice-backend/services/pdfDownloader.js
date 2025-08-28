const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Mock function to simulate downloading invoice from airline portal
// In a real implementation, this would integrate with actual airline APIs
const downloadInvoice = async (passengerData) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real scenario, we would use the passenger data to query the airline portal
    // For this example, we'll simulate success 80% of the time
    const shouldSucceed = Math.random() > 0.2;
    
    if (!shouldSucceed) {
      // Simulate "not found" scenario 10% of the time
      if (Math.random() > 0.5) {
        throw new Error('INVOICE_NOT_FOUND');
      } else {
        throw new Error('DOWNLOAD_ERROR');
      }
    }
    
    // Create a mock PDF file path (in a real implementation, we'd download the actual PDF)
    const fileName = `invoice-${passengerData.bookingReference}-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, '../uploads/invoices', fileName);
    
    // Create a mock PDF file (in reality, this would be the downloaded content)
    const mockPdfContent = `MOCK PDF CONTENT FOR ${passengerData.firstName} ${passengerData.lastName}`;
    fs.writeFileSync(filePath, mockPdfContent);
    
    return {
      success: true,
      filePath: filePath,
      fileName: fileName
    };
  } catch (error) {
    if (error.message === 'INVOICE_NOT_FOUND') {
      return {
        success: false,
        error: 'Invoice not found for the given passenger data',
        notFound: true
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to download invoice'
    };
  }
};

module.exports = {
  downloadInvoice
};