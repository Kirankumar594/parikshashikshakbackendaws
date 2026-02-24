const mongoose = require("mongoose");

const UserSubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teacherData",
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    subscriptionName: {
      type: String,
      required: true,
    },
    subclassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subClassData",
    },
    subclassName: {
      type: String,
    },
    // Track papers for each examination
    examinations: [
      {
        examinationId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "NameOfExamination",
        },
        examinationName: {
          type: String,
        },
        subjectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "subjectData",
        },
        subjectName: {
          type: String,
        },
        totalPapers: {
          type: Number,
          default: 0,
        },
        usedPapers: {
          type: Number,
          default: 0,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserSubscription", UserSubscriptionSchema);
