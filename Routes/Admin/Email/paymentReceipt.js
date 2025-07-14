const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
require("dotenv").config();
// Configure nodemailer with YOUR credentials
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Uses amitparnets@gmail.com
    pass: process.env.EMAIL_PASS  // Uses your app password
  },
});

router.post("/send-receipt", express.json(), async (req, res) => {
  try {
    const { username, email, amount, transactionId } = req.body;

    // Validation
    if (!email || !username || !amount || !transactionId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    // PDF Generation
    const doc = new PDFDocument();
    let buffers = [];
    
    doc.on("data", buffers.push.bind(buffers));
    
    doc.on("end", async () => {
      try {
        const pdfBuffer = Buffer.concat(buffers);

        // Email sending with YOUR credentials
        await transporter.sendMail({
          from: `"Parikshashikshak" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Payment Receipt Confirmation",
          html: `
            <h2>Payment Successful!</h2>
            <p>Dear ${username},</p>
            <p>Thank you for your payment of <strong>₹${amount}</strong>.</p>
            <p>Transaction ID: ${transactionId}</p>
            <p>Date: ${new Date().toLocaleString()}</p>
          `,
          attachments: [{
            filename: `Receipt-${transactionId}.pdf`,
            content: pdfBuffer
          }]
        });

        res.json({ success: true, message: "Receipt sent successfully" });
      } catch (emailErr) {
        console.error("Email failed:", emailErr);
        res.status(500).json({ 
          success: false, 
          error: "Failed to send email" 
        });
      }
    });

    // PDF Content
    doc.fontSize(25).text("Payment Receipt", { align: "center" });
    doc.moveDown();
    doc.fontSize(16)
      .text(`Name: ${username}`)
      .text(`Email: ${email}`)
      .text(`Amount: ₹${amount}`)
      .text(`Transaction ID: ${transactionId}`)
      .text(`Date: ${new Date().toLocaleString()}`);
    doc.end();

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
});

module.exports = router; 