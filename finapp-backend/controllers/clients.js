const PersonalInfo = require("../models/personalInfo");
const GeoInfo = require("../models/geoInfo");
const CommercialInfo = require("../models/commercialInfo");
const Financing = require("../models/financing");
const Installment = require("../models/installment");
const Motorcycle = require("../models/motorcycle");
const Reference = require("../models/reference");
const { Client, Debtor, Codebtor } = require("../models/client");

const mongoDB = require("mongodb");

const statusEnum = {
  AD: "Al día",
  EM: "En mora",
  CT: "Completada",
  CP: "En cobro prejurídico",
  CJ: "En cobro jurídico",
};

exports.createClient = async (req, res, next) => {
  console.log("Working Back");
  try {
    // CUOTAS
    const installment1 = new Installment({
      installmentNumber: 1,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: true,
      installmentValue: 910000,
      outstandingValue: 10010000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment1 = await installment1.save();

    const installment2 = new Installment({
      installmentNumber: 2,
      dueDate: new Date(2024, 6, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: true,
      installmentValue: 910000,
      outstandingValue: 9100000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment2 = await installment2.save();

    const installment3 = new Installment({
      installmentNumber: 3,
      dueDate: new Date(2024, 7, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: true,
      installmentValue: 910000,
      outstandingValue: 8190000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment3 = await installment3.save();

    const installment4 = new Installment({
      installmentNumber: 4,
      dueDate: new Date(2024, 8, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: true,
      installmentValue: 910000,
      outstandingValue: 7280000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment4 = await installment4.save();

    const installment5 = new Installment({
      installmentNumber: 5,
      dueDate: new Date(2024, 9, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: true,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment5 = await installment5.save();

    const installment6 = new Installment({
      installmentNumber: 6,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: false,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment6 = await installment6.save();

    const installment7 = new Installment({
      installmentNumber: 7,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: false,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment7 = await installment7.save();

    const installment8 = new Installment({
      installmentNumber: 8,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: false,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment8 = await installment8.save();

    const installment9 = new Installment({
      installmentNumber: 9,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: false,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment9 = await installment9.save();

    const installment10 = new Installment({
      installmentNumber: 10,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: false,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment10 = await installment10.save();

    const installment11 = new Installment({
      installmentNumber: 11,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: false,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment11 = await installment11.save();

    const installment12 = new Installment({
      installmentNumber: 12,
      dueDate: new Date(2024, 5, 1),
      capital: 666666.67,
      interest: 243333.33,
      guaranteeValue: 87360,
      installmentPaid: false,
      installmentValue: 910000,
      outstandingValue: 6370000,
      overdueDays: 0,
      lateInterests: 0,
      totalInstallmentValue: 910000,
    });
    const savedInstallment12 = await installment12.save();

    // Motocicleta financiación1
    const motorcycle1 = new Motorcycle({
      licensePlate: "ANL52F",
      brand: "Honda",
      model: "CB 190 R",
    });
    const savedMotorcycle1 = await motorcycle1.save();

    // Financiación codeudor1
    const financing1 = new Financing({
      status: "AD",
      motorcycle: savedMotorcycle1,
      initialInstallment: 1000000,
      financedAmount: 8000000,
      numberOfInstallments: 12,
      totalToPay: 10920000,
      monthlyInterest: 3.65,
      lateInterest: 1.8,
      installments: [
        savedInstallment1,
        savedInstallment2,
        savedInstallment3,
        savedInstallment4,
        savedInstallment5,
        savedInstallment6,
        savedInstallment7,
        savedInstallment8,
        savedInstallment9,
        savedInstallment10,
        savedInstallment11,
        savedInstallment12,
      ],
    });
    const savedFinancing1 = await financing1.save();

    //--------------------------------
    // Referencia familiar1 codeudor1
    const reference7 = new Reference({
      name: "Rocío Valencia",
      identification: {
        idType: "CC",
        number: "845398",
      },
      referenceType: "FAM",
      phone: "3127751316",
      relationship: "MAD",
    });
    const savedReference7 = await reference7.save();

    // Referencia familiar2 codeudor1
    const reference8 = new Reference({
      name: "Milton Botero",
      identification: {
        idType: "CC",
        number: "8453999",
      },
      referenceType: "FAM",
      phone: "3225751516",
      relationship: "PAD",
    });
    const savedReference8 = await reference8.save();

    // Referencia personal1 codeudor1
    const reference9 = new Reference({
      name: "Tatiana Rosas",
      identification: {
        idType: "CC",
        number: "1536496",
      },
      referenceType: "PER",
      phone: "3127710240",
      relationship: "AMI",
    });
    const savedReference9 = await reference9.save();

    // Referencia personal2 codeudor1
    const reference10 = new Reference({
      name: "Juan Rosas",
      identification: {
        idType: "CC",
        number: "1530006",
      },
      referenceType: "PER",
      phone: "3127710241",
      relationship: "AMI",
    });
    const savedReference10 = await reference10.save();

    // Referencia comercial1 codeudor1
    const reference11 = new Reference({
      name: "Banco MAR",
      identification: {
        idType: "NIT",
        number: "12345678901",
      },
      referenceType: "COM",
      phone: "3129894545",
      relationship: "ENF",
    });
    const savedReference11 = await reference11.save();

    // Referencia comercial2 codeudor1
    const reference12 = new Reference({
      name: "Banco Sur",
      identification: {
        idType: "NIT",
        number: "10548922348",
      },
      referenceType: "COM",
      phone: "312656565",
      relationship: "ENF",
    });
    const savedReference12 = await reference12.save();

    // Info comercial codeudor1
    const commercialInfo2 = new CommercialInfo({
      jobOccupation: "Panadera",
      company: "Bimbo",
      laborSenority: "5 años",
      income: 3000000,
      additionalIncome: 0,
      expenses: 680000,
    });
    const savedCommercialInfo2 = await commercialInfo2.save();

    // Info geográfica codeudor1
    const geoInfo2 = new GeoInfo({
      address: "Carrera 9 # 65 - 50",
      city: "Barranquilla",
      department: "Atlántico",
      neighbourhood: "América",
      additionalInfo: "Piso 2",
      location: {
        type: "Point",
        coordinates: ["20.45666", "45.48625"],
      },
    });
    const savedGeoInfo2 = await geoInfo2.save();

    // Info personal codeudor1
    const personalInfo2 = new PersonalInfo({
      email: "melissa@mail.com",
      phone: "3105595656",
      birthDate: new Date("2000", "09", "15"),
    });
    const savedPersonalInfo2 = await personalInfo2.save();

    // Codeudor1
    const codebtor1 = new Codebtor({
      name: "Melissa Botero",
      role: "codebtor",
      identification: {
        idType: "CC",
        number: "4520556",
      },
      personalInfo: savedPersonalInfo2,
      geoInfo: savedGeoInfo2,
      commercialInfo: savedCommercialInfo2,
      financing: savedFinancing1,
      references: [
        savedReference7,
        savedReference8,
        savedReference9,
        savedReference10,
        savedReference11,
        savedReference12,
      ],
    });
    const savedCodebtor1 = await codebtor1.save();

    //--------------------------------
    // Referencia familiar1 deudor1
    const reference1 = new Reference({
      name: "Pedro Vélez",
      identification: {
        idType: "CC",
        number: "96325",
      },
      referenceType: "FAM",
      phone: "312155777",
      relationship: "HER",
    });
    const savedReference1 = await reference1.save();

    // Referencia familiar2 deudor1
    const reference2 = new Reference({
      name: "María Martinez",
      identification: {
        idType: "CC",
        number: "186325",
      },
      referenceType: "FAM",
      phone: "312155777",
      relationship: "MAD",
    });
    const savedReference2 = await reference2.save();

    // Referencia personal1 deudor1
    const reference3 = new Reference({
      name: "Camilo Duarte",
      identification: {
        idType: "CC",
        number: "10369777",
      },
      referenceType: "PER",
      phone: "302545656",
      relationship: "VEC",
    });
    const savedReference3 = await reference3.save();

    // Referencia personal2 deudor1
    const reference4 = new Reference({
      name: "Juan García",
      identification: {
        idType: "CC",
        number: "10369696",
      },
      referenceType: "PER",
      phone: "302545998",
      relationship: "AMI",
    });
    const savedReference4 = await reference4.save();

    // Referencia comercial1 deudor1
    const reference5 = new Reference({
      name: "Cooperativa Palo Alto",
      identification: {
        idType: "NIT",
        number: "98765432111",
      },
      referenceType: "COM",
      phone: "310665650",
      relationship: "ENF",
    });
    const savedReference5 = await reference5.save();

    // Referencia comercial1 deudor1
    const reference6 = new Reference({
      name: "BANCO MAR",
      identification: {
        idType: "NIT",
        number: "12345678901",
      },
      referenceType: "COM",
      phone: "3129894545",
      relationship: "ENF",
    });
    const savedReference6 = await reference6.save();

    // Info comercial deudor1
    const commercialInfo1 = new CommercialInfo({
      jobOccupation: "Vendedor",
      company: "Homecenter",
      laborSenority: "3 años",
      income: 2000000,
      additionalIncome: 200000,
      expenses: 1000000,
    });
    const savedCommercialInfo1 = await commercialInfo1.save();

    // Info geográfica deudor1
    const geoInfo1 = new GeoInfo({
      address: "Calle 41 # 65 - 52",
      city: "Barranquilla",
      department: "Atlántico",
      neighbourhood: "Miraflores",
      location: {
        type: "Point",
        coordinates: ["4.140338", "2.17403"],
      },
    });
    const savedGeoInfo1 = await geoInfo1.save();

    // Info personal deudor1
    const personalInfo1 = new PersonalInfo({
      email: "samuel@mail.com",
      phone: "3127751311",
      birthDate: new Date("1990", "11", "23"),
    });
    const savedPersonalInfo1 = await personalInfo1.save();

    // Deudor1
    const debtor1 = new Debtor({
      name: "Samuel Vélez",
      identification: {
        idType: "CC",
        number: "1036584",
      },
      role: "debtor",
      personalInfo: savedPersonalInfo1,
      geoInfo: savedGeoInfo1,
      commercialInfo: savedCommercialInfo1,
      financing: savedFinancing1,
      references: [
        savedReference1,
        savedReference2,
        savedReference3,
        savedReference4,
        savedReference5,
        savedReference6,
      ],
      codebtor: savedCodebtor1,
    });
    const savedDebtor1 = await debtor1.save();
  } catch (err) {
    console.error("Error saving documents", err);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

exports.showUserInfo = (req, res, next) => {
  const theUser = req.user;
  theUser.name = "Test2";
  theUser.save();
};

exports.getClients = (req, res, next) => {
  Client.find().then((clients) => {
    res.status(200).json({ clients: clients });
  });
};

exports.getClient = (req, res, next) => {
  Client.findById(req.params.clientId).then((client) => {
    res.status(200).json({ client });
  });
};

exports.getClientFinancing = (req, res, next) => {
  Client.findById(req.params.clientId, "financing")
    .populate({
      path: "financing",
      populate: [{ path: "motorcycle" }, { path: "installments" }],
    })
    .then((client) => {
      res.status(200).json({ financing: client.financing });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error fetching financing" });
    });
};

const getDebtors = (query, res) => {
  Debtor.find(query, "name identification.number financing")
    .populate({
      path: "financing",
      select: "status",
    })
    .then((debtors) => {
      debtors.map((debtor) => {
        debtor.financing.status = statusEnum[debtor.financing.status];
      });
      res.status(200).json({ debtors: debtors });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error fetching debtors" });
    });
};

exports.getDebtorsList = (req, res, next) => {
  getDebtors({ role: "debtor" }, res);
};

exports.getDebtorsListBySearchTerm = (req, res, next) => {
  const searchTerm = req.params.searchTerm;
  const query = isNaN(searchTerm)
    ? { name: { $regex: searchTerm, $options: "i" } }
    : { "identification.number": searchTerm };
  getDebtors(query, res);
};

exports.getDebtorsListByStatuses = (req, res, next) => {
  const statuses = req.params.status.split(",");
  Financing.find({ status: { $in: statuses } })
    .then((financings) => {
      const financingIds = financings.map((financing) => financing._id);
      getDebtors({ financing: { $in: financingIds } }, res);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error fetching financings" });
    });
};
