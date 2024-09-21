const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commercialInfoSchema = new Schema({
  clientType: {
    type: String,
    enum: ["deudor", "codeudor"],
    required: true,
  },
  coDebtor: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    validate: [
      {
        validator: isRequiredIfClientIsDebtor,
        message: "Es necesario un codeudor para el deudor",
      },
      {
        validator: shouldBeEmptyForCoDebtor,
        message: "Un codeudor no puede tener otro codeudor",
      },
    ],
  },
  jobOccupation: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  laborSenority: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  additionalIncome: {
    type: Number,
    required: true,
  },
  expenses: {
    type: Number,
    required: true,
  },
  financing: {
    type: Schema.Types.ObjectId,
    ref: "Financing",
    validate: [
      {
        validator: isRequiredIfClientIsDebtor,
        message: "Es necesario un estado de financiacion para el deudor",
      },
      {
        validator: shouldBeEmptyForCoDebtor,
        message: "Un codeudor no puede tener estados de financiacion",
      },
    ],
  },

  references: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reference",
    },
  ],
});

function isRequiredIfClientIsDebtor(value) {
  if (this.clientType === "deudor") {
    return value != null && value !== "";
  }
  return true;
}

function shouldBeEmptyForCoDebtor(value) {
  if (this.clientType === "codeudor") {
    return value == null || value === "";
  }
  return true;
}

commercialInfoSchema.pre("save", function (next) {
  if (this.clientType === "codeuddor" && this.coDebtor) {
    return next(new Error("Un codeudor no puede tener otro codeudor"));
  }
  next();
});

module.exports = mongoose.model("CommercialInfo", commercialInfoSchema);
