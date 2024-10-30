const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const idTypeEnum = {
  CC: "Cedula de Ciudadania",
  CE: "Cedula de Extranjeria",
  NIT: "Numero de Identificacion Tributaria",
};

const referenceTypeEnum = {
  PER: "Personal",
  FAM: "Familiar",
  COM: "Comercial",
};

const relationshipType = {
  AMI: "Amigo/a",
  CON: "Conocido/a",
  COM: "Compañero/a de trabajo",
  VEC: "Vecino/a",
  OTP: "Otra relacion personal",
  PAD: "Padre",
  MAD: "Madre",
  CYG: "Conyuge",
  HER: "Hermano/a",
  PRI: "Primo/a",
  TIO: "Tio/a",
  ABU: "Abuelo/a",
  NIE: "Nieto/a",
  OTF: "Otra relacion familiar",
  CLI: "Cliente",
  PRO: "Proveedor",
  SOC: "Socio/a",
  ENF: "Entidad financiera",
  OTC: "Otra relacion comercial",
};

const relationshipsAllowedByType = {
  PER: ["AMI", "CON", "COM", "VEC", "OTP"],
  FAM: ["PAD", "MAD", "CYG", "HER", "PRI", "TIO", "ABU", "NIE", "OTF"],
  COM: ["CLI", "PRO", "SOC", "ENF", "OTC"],
};

const referenceSchema = new Schema({
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
  referenceType: {
    type: String,
    enum: Object.keys(referenceTypeEnum),
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  relationship: {
    type: Schema.Types.ObjectId,
    enum: Object.keys(relationshipType),
    validate: {
      validator: function (value) {
        return relationshipsAllowedByType[this.referenceType].includes(value);
      },
      message: (props) =>
        `${props.value} no es una relación permitida para el tipo de referencia seleccionado`,
    },
  },
});

module.exports = mongoose.model("Reference", referenceSchema);
