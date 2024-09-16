const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commercialInfoSchema = new Schema({
  clientType: {
    type: String,
    enum: ["debtor", "co-debtor"],
    required: true,
  },
  coDebtor: {
    type: Schema.Types.ObjectId,
    ref: "Client",
    required: function () {
      return this.clientType === "debtor";
    },
    validate: {
      validator: function (value) {
        return !(this.clientType === "co-debtor" && value);
      },
      message: "Un codeudor no puede tener otro codeudor",
    },
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
  financingStatus: [
    {
      type: Schema.Types.ObjectId,
      ref: "FinancingStatus",
    },
  ],
  references: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reference",
    },
  ],
});

commercialInfoSchema.pre("save", function (next) {
  if (this.clientType === "co-debtor" && this.coDebtor) {
    return next(new Error("Un codeudor no puede tener otro codeudor"));
  }
  next();
});

module.exports = mongoose.model("CommercialInfo", commercialInfoSchema);
