const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const idTypeEnum = {
  CC: "Cedula de Ciudadania",
  CE: "Cedula de Extranjeria",
  NIT: "Numero de Identificacion Tributaria",
};

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["debtor", "codebtor"],
    required: true,
  },
  identification: {
    idType: {
      type: String,
      enum: Object.keys(idTypeEnum),
      required: true,
    },
    number: {
      type: String,
      required: true,
      unique: true,
    },
  },
  personalInfo: {
    type: Schema.Types.ObjectId,
    ref: "PersonalInfo",
  },
  geoInfo: {
    type: Schema.Types.ObjectId,
    ref: "GeoInfo",
  },
  commercialInfo: {
    type: Schema.Types.ObjectId,
    ref: "CommercialInfo",
  },
  financing: {
    type: Schema.Types.ObjectId,
    ref: "Financing",
  },
  references: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reference",
    },
  ],
  isSimulated: {
    type: Boolean,
    required: true,
  },
});

const Client = mongoose.model("Client", clientSchema);

const debtorSchema = new Schema({
  codebtor: {
    type: Schema.Types.ObjectId,
    ref: "Codebtor",
  },
  manager: {
    type: Schema.Types.ObjectId,
    ref: "Manager",
    default: null,
  },
});

const Debtor = Client.discriminator("Debtor", debtorSchema);

const codebtorSchema = new Schema({});

const Codebtor = Client.discriminator("Codebtor", codebtorSchema);

module.exports = {
  Client,
  Debtor,
  Codebtor,
};
