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
});

const Client = mongoose.model("Client", clientSchema);

const debtorSchema = new Schema({
  codebtor: {
    type: Schema.Types.ObjectId,
    ref: "Codebtor",
  },
});

const Debtor = Client.discriminator("Debtor", debtorSchema);

const codebtorSchema = new Schema({
  debtor: {
    type: Schema.Types.ObjectId,
    ref: "Debtor",
  },
});

const Codebtor = Client.discriminator("Codebtor", codebtorSchema);

// método para obtener el nombre completo del tipo de identificación
// clientSchema.statics.getTipoIdentificacionCompleto = function(sigla) {
//   return tipoIdentificacionEnum[sigla];
// };

module.exports = {
  Client,
  Debtor,
  Codebtor,
};
