let mongoose = require("mongoose");

let participantInputSchema = mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  textSearch: {
    searchTime: {
      type: Number,
      required: true,
    },
    productFound: {
      type: Boolean,
      required: true,
    },
    timeToPurchase: {
      type: Number,
      required: true,
    },
    accuracyCount: {
      type: Array,
      required: true,
    },
  },
  voiceSearch: {
    searchTime: {
      type: Number,
      required: true,
    },
    productFound: {
      type: Boolean,
      required: true,
    },
    timeToPurchase: {
      type: Number,
      required: true,
    },
    accuracyCount: {
      type: Array,
      required: true,
    },
  },
  imageSearch: {
    searchTime: {
      type: Number,
      required: true,
    },
    productFound: {
      type: Boolean,
      required: true,
    },
    timeToPurchase: {
      type: Number,
      required: true,
    },
    accuracyCount: {
      type: Array,
      required: true,
    },
  },

  assignedProduct: {
    category: {
      type: "String",
    },
    productName: {
      type: "String",
    },
    productImage: {
      type: "String",
    },
  },
  surveyAnswers: {
    type: [
      "Mixed"
    ],
  },
});

let participantInputModel = mongoose.model(
  "participantInput",
  participantInputSchema
);

module.exports = participantInputModel;
