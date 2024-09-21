const Client = require("../models/main/client");
const PersonalInfo = require("../models/main/personalInfo");
const GeoInfo = require("../models/main/geoInfo");
const Address = require("../models/secundary/address");
const CommercialInfo = require("../models/main/commercialInfo");
const Financing = require("../models/main/financing");
const Installment = require("../models/main/installment");
const Product = require("../models/secundary/product");
const Reference = require("../models/secundary/reference");

const mongoDB = require("mongodb");

exports.createClient = async (req, res, next) => {
  console.log("Working - Back - Controller");

  try {
    // CO-DEBTOR
    const coDebtorPersonalInfo = new PersonalInfo({
      phone: "3120000000",
      email: "codeudor@mail.com",
      birthDate: new Date(),
    });
    const savedCoDebtorPersonalInfo = await coDebtorPersonalInfo.save();

    const coDebtorAddress = new Address({
      country: "Colombia",
      department: "Antioquia",
      city: "Rionegro",
      neighbourhood: "Porvenir",
      sector: "Segunda etapa",
      streetAddress: "Calle 41 # 61 F - 50",
    });
    const savedCoDebtorAddress = await coDebtorAddress.save();

    const coDebtorGeoInfo = new GeoInfo({
      address: savedCoDebtorAddress,
      location: {
        type: "Point",
        coordinates: ["41.40338", "2.17403"],
      },
    });
    const savedCoDebtorGeoInfo = await coDebtorGeoInfo.save();

    const coDebtorCommercialInfo = new CommercialInfo({
      clientType: "codeudor",
      jobOccupation: "Policia",
      company: "Policia Nacional",
      laborSenority: "5",
      income: 4000000,
      additionalIncome: 100000,
      expenses: 2000000,
      references: [],
    });
    const savedCoDebtorCommercialInfo = await coDebtorCommercialInfo.save();

    const newCoDebtor = new Client({
      name: "Codeudor Perez",
      identification: {
        idType: "CC",
        number: "789456",
      },
      personalInfo: savedCoDebtorPersonalInfo,
      geoInfo: savedCoDebtorGeoInfo,
      commercialInfo: savedCoDebtorCommercialInfo,
    });
    const savedNewCoDebtor = await newCoDebtor.save();

    // CLIENT
    const clientPersonalInfo = new PersonalInfo({
      phone: "3127751316",
      email: "juan@mail.com",
      birthDate: new Date(),
    });
    const savedClientPersonalInfo = await clientPersonalInfo.save();

    const clientAddress = new Address({
      country: "Colombia",
      department: "Antioquia",
      city: "Rionegro",
      neighbourhood: "Porvenir",
      sector: "Primera etapa",
      streetAddress: "Calle 41 # 61 F - 50",
    });
    const savedClientAddress = await clientAddress.save();

    const clientGeoInfo = new GeoInfo({
      address: savedClientAddress,
      location: {
        type: "Point",
        coordinates: ["41.40338", "2.17403"],
      },
    });
    const savedClientGeoInfo = await clientGeoInfo.save();

    const installment1 = new Installment({
      installmentNumber: 1,
      dueDate: new Date(),
      capital: 1000000,
      interest: 10,
      guaranteeValue: 100000,
      accruedInterest: 0,
      refund: 0,
      installmentValue: 500000,
      outstandingValue: 2000000,
      overdueDays: 0,
      totalInterest: 10,
      totalInstallment: 2000000,
    });
    const savedInstallment1 = await installment1.save();

    const installment2 = new Installment({
      installmentNumber: 2,
      dueDate: new Date(),
      capital: 1000000,
      interest: 10,
      guaranteeValue: 100000,
      accruedInterest: 0,
      refund: 0,
      installmentValue: 500000,
      outstandingValue: 2000000,
      overdueDays: 0,
      totalInterest: 10,
      totalInstallment: 2000000,
    });
    const savedInstallment2 = await installment2.save();

    const clientProduct = new Product({
      brand: "Suzuki",
      model: "DR650",
      licensePlate: "ATR800",
    });
    const savedClientProduct = await clientProduct.save();

    const clientFinancing = new Financing({
      installments: [savedInstallment1, savedInstallment2],
      installmentsQuantity: 2,
      initialInstallment: 5000000,
      product: savedClientProduct,
      totalPrice: 80000000,
      status: "al_dia",
    });
    const savedClientFinancing = await clientFinancing.save();

    const reference1Address = new Address({
      country: "Colombia",
      department: "Antioquia",
      city: "Rionegro",
      neighbourhood: "Porvenir",
      sector: "Tercera etapa",
      streetAddress: "Calle 41 # 61 F - 50",
    });
    const savedReference1Address = await reference1Address.save();

    const clientReference1 = new Reference({
      name: "Martha Ortiz",
      phone: "3110000000",
      address: savedReference1Address,
      relationship: "Mother",
    });
    const savedClientReference1 = await clientReference1.save();

    const reference2Address = new Address({
      country: "Colombia",
      department: "Antioquia",
      city: "Rionegro",
      neighbourhood: "Porvenir",
      sector: "Tercera etapa",
      streetAddress: "Calle 41 # 61 F - 50",
    });
    const savedReference2Address = await reference2Address.save();

    const clientReference2 = new Reference({
      name: "Marcos Perez",
      phone: "3110000000",
      address: savedReference2Address,
      relationship: "Father",
    });
    const savedClientReference2 = await clientReference2.save();

    const clientCommercialInfo = new CommercialInfo({
      clientType: "deudor",
      coDebtor: savedNewCoDebtor,
      jobOccupation: "Vendedor",
      company: "Homecenter",
      laborSenority: "4",
      income: 5000000,
      additionalIncome: 0,
      expenses: 2000000,
      financing: savedClientFinancing,
      references: [savedClientReference1, savedClientReference2],
    });
    const savedClientCommercialInfo = await clientCommercialInfo.save();

    const newClient = new Client({
      name: "Juan Perez",
      identification: {
        idType: "CC",
        number: "123456",
      },
      personalInfo: savedClientPersonalInfo,
      geoInfo: savedClientGeoInfo,
      commercialInfo: savedClientCommercialInfo,
      user: req.user,
    });
    const savedNewClient = await newClient.save();

    const theUser = req.user;
    theUser.clients = [savedNewClient];
    theUser.save();
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
