This project automates the downloading and parsing of airline invoices. It simulates invoice downloads from airline portals, stores the invoices locally, and extracts key details (Invoice Number, Date, Airline, Amount, GSTIN, etc.) from PDF files.
The system is designed for extensibility – you can easily integrate real airline APIs later. For now, it supports both mock invoices (generated locally) and real PDF parsing with graceful error handling (e.g., Invalid PDF structure)

