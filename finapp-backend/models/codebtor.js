const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const idTypeEnum = {
  CC: "Cedula de Ciudadania",
  CE: "Cedula de Extranjeria",
  NIT: "Numero de Identificacion Tributaria",
};

const codebtorSchema = new Schema({
  name: {
    type: String,
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
});

// método para obtener el nombre completo del tipo de identificación
// clientSchema.statics.getTipoIdentificacionCompleto = function(sigla) {
//   return tipoIdentificacionEnum[sigla];
// };

module.exports = mongoose.model("Codebtor", codebtorSchema);
