const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    subscriptionName: {
      type: String,
      required: true,
    },
    subclassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subClassData",
      required: true,
    },
    subclassName: {
      type: String,
      required: true,
    },
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
        questionPapers: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

// Drop old index if exists (one-time cleanup)
Subscription.collection.dropIndex("standard_1_subject_1").catch(() => {
  // Index doesn't exist, ignore error
});

module.exports = Subscription;
