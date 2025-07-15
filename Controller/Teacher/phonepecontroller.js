// const transactionModel = require("../../Modal/User/phonepayModel");
const axios = require("axios");
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
require("dotenv").config();
// const MERCHANT_ID = "M22IJ7E10A8LQ";
// const SECRET_KEY = "323bd89f-a6c5-402f-a659-043df2b7b3c9";  
// const PHONEPE_API_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"; 
// const CALLBACK_URL = "https://valueproservice.com";  
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Uses amitparnets@gmail.com
    pass: process.env.EMAIL_PASS  // Uses your app password
  },
});

// const sendReceipt = async (username, email, amount, transactionId) => {
//   try {
//     const doc = new PDFDocument({ margin: 40, size: "A4" });
//     const buffers = [];

//     doc.on("data", buffers.push.bind(buffers));

//     const primaryColor = "#1E3A8A";     // Indigo
//     const secondaryColor = "#F3F4F6";   // Gray background
//     const textColor = "#111827";        // Dark text
//     const highlightColor = "#2563EB";   // Accent blue
//     const lightGray = "#9CA3AF";

//     // HEADER SECTION
//     try {
//       doc.image("logo.png", 40, 40, { width: 60 });
//     } catch {
//       console.warn("Logo not found. Skipping image.");
//     }

//     doc
//       .font("Helvetica-Bold")
//       .fontSize(24)
//       .fillColor(primaryColor)
//       .text("ParikshaShikshak", 110, 45);

//     doc
//       .fontSize(12)
//       .fillColor(lightGray)
//       .text("Online Education Platform", 110, 72);

//     doc
//       .fontSize(10)
//       .fillColor(highlightColor)
//       .text("https://parikshashikshak.com", 40, 100);

//     // Receipt Box
//     doc
//       .moveTo(40, 130)
//       .lineTo(555, 130)
//       .strokeColor(secondaryColor)
//       .stroke();

//     doc
//       .fontSize(18)
//       .fillColor(primaryColor)
//       .text("Payment Receipt", 40, 145);

//     doc
//       .fontSize(10)
//       .fillColor(textColor)
//       .text(`Receipt Date: ${new Date().toLocaleString()}`, 40, 165);

//     // USER DETAILS SECTION
//     doc
//       .rect(40, 190, 515, 80)
//       .fill(secondaryColor);

//     doc
//       .fillColor(textColor)
//       .font("Helvetica-Bold")
//       .fontSize(12)
//       .text("Student Information", 50, 200);

//     doc
//       .font("Helvetica")
//       .fontSize(11)
//       .fillColor("#374151")
//       .text(`Name: ${username}`, 50, 220)
//       .text(`Email: ${email}`, 50, 240);

//     // TRANSACTION DETAILS SECTION
//     doc
//       .fillColor(primaryColor)
//       .font("Helvetica-Bold")
//       .fontSize(13)
//       .text("Transaction Summary", 40, 290);

//     doc
//       .font("Helvetica")
//       .fontSize(11)
//       .fillColor(textColor)
//       .text(`Transaction ID: ${transactionId}`, 50, 315)
//       .text(`Status: Successful`, 50, 335)
//       .text(`Mode: UPI / Card / Netbanking`, 50, 355);

//     // AMOUNT BOX
//     doc
//       .roundedRect(360, 310, 180, 60, 8)
//       .fill(highlightColor);

//     doc
//       .fillColor("#FFFFFF")
//       .font("Helvetica-Bold")
//       .fontSize(14)
//       .text("Amount Paid", 370, 320);

//     doc
//       .fontSize(18)
//       .text(`₹${amount}`, 370, 340);

//     // FOOTER
//     doc
//       .moveTo(40, 430)
//       .lineTo(555, 430)
//       .strokeColor(secondaryColor)
//       .stroke();

//     doc
//       .font("Helvetica-Oblique")
//       .fontSize(10)
//       .fillColor("#6B7280")
//       .text("Thank you for your payment!", 50, 450)
//       .text("For support, contact support@parikshashikshak.com", 50, 465);

//     doc.end();

//     doc.on("end", async () => {
//       const pdfBuffer = Buffer.concat(buffers);

//       await transporter.sendMail({
//         from: `"ParikshaShikshak" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "Your ParikshaShikshak Payment Receipt",
//         html: `
//           <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
//             <h2 style="color: #1E3A8A; text-align: center;">ParikshaShikshak</h2>
//             <p>Hello <strong>${username}</strong>,</p>
//             <p>Thank you for your payment of ₹${amount}.</p>
//             <p><strong>Transaction ID:</strong> ${transactionId}</p>
//             <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
//             <p>Your receipt is attached as a PDF. For any issues, reach out to our support.</p>
//             <p style="text-align: center; color: #6B7280;">support@parikshashikshak.com</p>
//           </div>
//         `,
//         attachments: [
//           {
//             filename: `Receipt-${transactionId}.pdf`,
//             content: pdfBuffer,
//           },
//         ],
//       });
//     });
//   } catch (error) {
//     console.error("Error generating receipt:", error);
//   }
// };  
  
const sendReceipt = async (username, email, amount, transactionId) => {
  try {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    // Colors
    const primaryColor = "#1E3A8A";
    const textColor = "#111827";
    const lightGray = "#9CA3AF";
    const highlightColor = "#16a34a"; // Green for "PAID"

    // Header
    try {
      doc.image("logo.png", 40, 40, { width: 60 });
    } catch {
      console.warn("Logo not found. Skipping image.");
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor(primaryColor)
      .text("PARIKSHA SHIKSHAK", 110, 45);

    doc
      .fontSize(12)
      .fillColor(lightGray)
      .text("India’s Leading Test Platform", 110, 70);

    doc
      .fontSize(10)
      .fillColor(textColor)
      .text("https://parikshashikshak.com", 40, 100);

    // Paid Invoice Label
    doc
      .fillColor(highlightColor)
      .font("Helvetica-Bold")
      .fontSize(14)
      .text("PAID INVOICE", 400, 40, { align: "right" });

    doc
      .fillColor(textColor)
      .fontSize(10)
      .text(`Invoice#: ${transactionId}`, 400, 58, { align: "right" })
      .text(`Date: ${new Date().toLocaleDateString("en-GB")}`, 400, 72, {
        align: "right",
      });

    // Invoice To
    doc
      .fillColor("#f3f4f6")
      .rect(40, 120, 515, 70)
      .fill();

    doc
      .fillColor(textColor)
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Invoice To:", 50, 130);

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(`ARVUBODHI SHIKSHAK TALENTS LLP.`, 50, 145)
      .text(`113B,1st Floor, 20th Main Road`, 50, 160)
      .text(`53rd Cross, 5th Block, Rajajinagar`, 50, 175)
      .text(`Bengaluru, 560010`, 50, 190)
      .text(`info@shikshakworld.com`, 50, 205);

    doc
      .fontSize(10)
      .text("GSTIN : 29AGCFA8346M1ZS", 400, 200, { align: "right" });

    // Invoice Table Header
    const tableTop = 240;
    doc
      .fillColor(textColor)
      .font("Helvetica-Bold")
      .fontSize(10);

    const columns = ["Item Type", "Remark", "Price", "Quantity", "Amount"];
    const columnWidths = [120, 180, 60, 60, 80];
    let x = 40;
    columns.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: columnWidths[i] });
      x += columnWidths[i];
    });

    doc.moveTo(40, tableTop + 15).lineTo(555, tableTop + 15).stroke();

    // Invoice Table Row
    doc
      .font("Helvetica")
      .fillColor("#374151")
      .fontSize(10);

    x = 40;
    const rowY = tableTop + 25;
    const row = ["Test Subscription", "Annual Plan", `₹${amount}`, "1", `₹${amount}`];
    row.forEach((cell, i) => {
      doc.text(cell, x, rowY, { width: columnWidths[i] });
      x += columnWidths[i];
    });

    // Totals
    const totalY = rowY + 40;
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(textColor)
      .text("Sub Total", 400, totalY)
      .text(`₹${amount}`, 500, totalY, { align: "right" });

    doc
      .text("Grand Total", 400, totalY + 20)
      .text(`₹${amount}`, 500, totalY + 20, { align: "right" });

    // Transaction Summary
    const bottomY = totalY + 60;
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor(primaryColor)
      .text("Transaction Summary", 40, bottomY);

    doc
      .font("Helvetica")
      .fillColor(textColor)
      .fontSize(10)
      .text(`Transaction Date: ${new Date().toLocaleString()}`, 50, bottomY + 20)
      .text(`Transaction ID: ${transactionId}`, 50, bottomY + 35)
      .text(`Gateway: PhonePe / Razorpay`, 50, bottomY + 50)
      .text(`Total Paid: ₹${amount}`, 50, bottomY + 65);

    // Footer
    doc
      .moveTo(40, 750)
      .lineTo(555, 750)
      .strokeColor("#e5e7eb")
      .stroke();

    doc
      .font("Helvetica-Oblique")
      .fontSize(10)
      .fillColor("#6B7280")
      .text("Thank you for your payment!", 50, 760)
      .text("For support, contact support@parikshashikshak.com", 50, 775);

    doc.end();

    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      await transporter.sendMail({
        from: `"ParikshaShikshak" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your ParikshaShikshak Payment Receipt",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #1E3A8A; text-align: center;">ParikshaShikshak</h2>
            <p>Hello <strong>${username}</strong>,</p>
            <p>Thank you for your payment of ₹${amount}.</p>
            <p><strong>Transaction ID:</strong> ${transactionId}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            <p>Your receipt is attached as a PDF. For any issues, reach out to our support.</p>
            <p style="text-align: center; color: #6B7280;">support@parikshashikshak.com</p>
          </div>
        `,
        attachments: [
          {
            filename: `Receipt-${transactionId}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    });
  } catch (error) {
    console.error("Error generating receipt:", error);
  }
};

const transactionModel = require("../../Module/Teacher/PhonepeModal");

const {
  StandardCheckoutClient,
  Env,
  StandardCheckoutPayRequest,
  MetaInfo,
  CreateSdkOrderRequest
} = require("pg-sdk-node");

// const clientId = "M22IJ7E10A8LQ";
const clientId = "SU2504081902438340731784";
const clientSecret = "61e1f611-8ad3-49d9-b449-4ec645bc5fc6";
const clientVersion = 1;
const env = Env.PRODUCTION;
// const env = Env.SANDBOX;
// const CALLBACK_URL = "https://valueproservice.com/update/paymentstatus/:id";

const client = StandardCheckoutClient.getInstance(
  clientId,
  clientSecret,
  clientVersion,
  env
);

class Transaction {

  async addPaymentPhone(req, res) {

    try {
      const { userId, username, Mobile, orderId, amount, config,successUrl,failedUrl,email } = req.body;

      // Save transaction details in DB
      const data = await transactionModel.create({
        userId,
        username, 
         email,
        Mobile,
        orderId,
        amount,
        config,
        successUrl,failedUrl
      });

      if (!data)
        return res.status(400).json({ error: "Something went wrong" });

      const merchantOrderId = data._id.toString(); // Use DB _id as unique order ID

      const redirectUrl = `https://parikshashikshak.com/paymentsuccess?transactionId=${data._id}&userID=${userId}`;
      // const redirectUrl = `https://valueproservice.com/`;

      // Build the payment request
      const paymentRequest = CreateSdkOrderRequest.StandardCheckoutBuilder()
        .merchantOrderId(merchantOrderId)
        .amount(amount * 100) // Convert to paise
        .redirectUrl(redirectUrl)
        .build();

      // Send payment request to PhonePe
      const response = await client.pay(paymentRequest);
      console.log("response", response)
      const checkoutUrl = response.redirectUrl;


      if (!checkoutUrl) {
        console.error("Invalid PhonePe response:", response);
        return res.status(500).json({ error: "PhonePe did not return a URL" });
      }

      return res.status(200).json({
        orderId: response.orderId,
        merchantID: merchantOrderId,
        url: checkoutUrl,
      });
    } catch (error) {
      console.error("Payment Error:", error);
      return res.status(500).json({ error: "Payment processing failed" });
    }
  }

  async addPaymentMobile(req, res) {
    let transaction; // Declare transaction here to fix the ReferenceError

    try {
      // Validate input
      const { userId, username, Mobile, orderId, amount } = req.body;
      if (!userId || !username || !Mobile || !amount) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Create transaction record
      transaction = await transactionModel.create({
        userId,
        username,
        Mobile,
        orderId: orderId || `ORD_${Date.now()}`,
        amount,
        status: 'INITIATED'
      })

      // Prepare payment payload
      const paymentPayload = {
        merchantId: "M22IJ7E10A8LQ",
        merchantTransactionId: transaction._id.toString(),
        merchantUserId: userId,
        amount: amount * 100, // Convert to paise
        redirectUrl: `https://parikshashikshak.com/paymentsuccess?transactionId=${transaction._id}&userID=${userId}`,


        callbackUrl: "https://coorgtour.in/api/Teacher/checkPayment/" + transaction._id + "/" + userId,

        mobileNumber: Mobile,
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      }; 
      
      // Generate signature
      const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64');
      const stringToHash = base64Payload + '/pg/v1/pay' + clientSecret;
      const sha256Hash = crypto.createHash('sha256').update(stringToHash).digest('hex')+'###' + 1;
      const signature = sha256Hash + '###' + clientSecret;

      res.status(200).json({
        success: true,
        data: {
          transactionBody: base64Payload,
          checksum: sha256Hash,
          transactionId: transaction._id,
        },
      });

    } catch (error) {
      console.error("Payment Error:", error.message);

      // Update transaction status if it was created
      if (transaction) {
        await transactionModel.findByIdAndUpdate(transaction._id, {
          status: 'FAILED',
          error: error.response?.data?.message || error.message
        });
      }

      return res.status(500).json({
        error: "Payment processing error",
        details: error.response?.data || error.message
      });
    }
  }

  async updateStatuspayment(req, res) {
    try {
      let id = req.params.id;
      let data = await transactionModel.findById(id);
      if (!data) return res.status(400).json({ error: "Data not found" });
      data.status = "Completed";
      data.save();
      return res.status(200).json({ success: "Successfully Completed" });
    } catch (error) {
      console.log(error);
    }
  }

  async checkPayment(req, res) {
    try {

      let id = req.params.id;
      let userId = req.params.userId
      let data = await transactionModel.findById(id);
      if (!data) return res.status(400).json({ error: "Payment Id not found!" })
      client.getOrderStatus(id).then(async (response) => {
        const state = response.state;
        if (state == "COMPLETED") {
          sendReceipt(data.username,data.email,data.amount,data._id)
          if (data.config) {
            await axios(JSON.parse(data.config))
            data.config = null
          }
        }
        data.status = state;
        data = await data.save()
        return res.status(200).json({ success: data })
      }).catch((error) => {
        return res.status(400).json({ error: error })
      });

    } catch (error) {
      console.log(error)
      return res.status(400).json({ error: error.message })
    }
  }

  async paymentcallback(req, res) {
    const { response } = req.body;

    const decodedStr = Buffer.from(response, 'base64').toString('utf-8');

    // Parse JSON
    const responseJson = JSON.parse(decodedStr);
    console.log(responseJson?.data);
    const { merchantTransactionId, state } = responseJson?.data;

    // Log the callback data for debugging
    console.log(`Callback received: Transaction ${merchantTransactionId}, Status: ${state}`);
    let data = await transactionModel.findById(merchantTransactionId);
    if (data) {
      data.status = state;
      if (state === 'COMPLETED') {
 sendReceipt(data.username,data.email,data.amount,data._id)
        await axios(JSON.parse(data.config))
      }
      await data.save()
    }
    // Update transaction status in your database
    if (state === 'COMPLETED') {


      // Mark the transaction as successful
      // Update relevant database records
      console.log(`Transaction ${merchantTransactionId} was successful.`);
    } else {
      // Handle failure or pending status
      console.log(`Transaction ${merchantTransactionId} failed or is pending.`);
    }

    // Send a response back to the payment gateway
    res.status(200).send('Callback processed');
  }

  async getallpayment(req, res) {
    try {
      let data = await transactionModel.find({}).sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error)
    }
  }

  async makepayment(req, res) {
    let {
      amount,
      merchantTransactionId,
      merchantUserId,
      redirectUrl,
      callbackUrl,
      mobileNumber,
    } = req.body;

    function generateSignature(payload, saltKey, saltIndex) {
      const encodedPayload = Buffer.from(payload).toString("base64");
      const concatenatedString = encodedPayload + "/pg/v1/pay" + saltKey;
      const hashedValue = crypto
        .createHash("sha256")
        .update(concatenatedString)
        .digest("hex");

      const signature = hashedValue + "###" + saltIndex;
      return signature;
    }

    const paymentDetails = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: merchantUserId,
      amount: amount,
      redirectUrl: CALLBACK_URL,
      redirectMode: "POST",
      callbackUrl: callbackUrl,
      mobileNumber: mobileNumber,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    const payload = JSON.stringify(paymentDetails);
    let objJsonB64 = Buffer.from(payload).toString("base64");
    const saltKey = SECRET_KEY; //test key
    const saltIndex = 1;
    const signature = generateSignature(payload, saltKey, saltIndex);

    try {
      const response = await axios.post(
        "https://api.phonepe.com/apis/hermes/pg/v1/pay",

        // "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
        {
          request: objJsonB64,
        },
        {
          headers: {
            "X-VERIFY": signature,
          },
        }
      );

      //   console.log(
      //     "Payment Response:",
      //     response.data,
      //     response.data?.data.instrumentResponse?.redirectInfo?.url
      //   );
      return res.status(200).json({
        url: response.data?.data.instrumentResponse?.redirectInfo,
      });
    } catch (error) {
      console.error("Payment Error:", error);
    }
  }

}

module.exports = new Transaction();


