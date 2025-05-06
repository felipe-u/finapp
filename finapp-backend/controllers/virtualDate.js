const { fakerES_MX: faker } = require("@faker-js/faker");
const logger = require("../utils/logger");
const logMessages = require("../utils/logMessages");
const VirtualDate = require("../models/virtualDate");
const { Debtor, Codebtor } = require("../models/client");
const PersonalInfo = require("../models/personalInfo");
const GeoInfo = require("../models/geoInfo");
const CommercialInfo = require("../models/commercialInfo");
const Financing = require("../models/financing");
const Motorcycle = require("../models/motorcycle");
const Installment = require("../models/installment");
const Reference = require("../models/reference");

exports.setDate = async (req, res, next) => {
  const initialDate = new Date("2025-01-01");
  try {
    const virtualDate = new VirtualDate({
      currentDate: initialDate,
    });
    virtualDate.save();
    logger.info(logMessages.SET_VIRTUAL_DATE);
  } catch (err) {
    logger.error(logMessages.SET_VIRTUAL_DATE_ERROR);
  }
};

exports.getCurrentDate = async (req, res, next) => {
  try {
    const virtualDateSchema = await VirtualDate.findOne();
    if (!virtualDateSchema) {
      return res.status(404).json({ message: "Virtual Date not found" });
    }
    res.status(200).json({ date: virtualDateSchema.currentDate });
  } catch (err) {
    res.status(500).json({ message: "Error fetching current date" });
  }
};

exports.advanceDate = async (req, res, next) => {
  try {
    const { days, createClients } = req.body;

    const virtualDateSchema = await VirtualDate.findOne();
    if (!virtualDateSchema) {
      return res.status(404).json({ message: "Virtual Date not found" });
    }

    for (let d = 1; d <= days; d++) {
      const current = new Date(virtualDateSchema.currentDate);
      current.setDate(current.getDate() + 1);
      virtualDateSchema.currentDate = current;
      await virtualDateSchema.save();
      logger.info(logMessages.SIM_DATE(current.toDateString()));

      if (createClients) {
        await exports.createClientForToday(current);
        logger.info(logMessages.SIM_USER_CREATED);
      }

      const simulatedFinancings = await Financing.find({ isSimulated: true })
        .populate("installments")
        .exec();

      for (const financing of simulatedFinancings) {
        const { installments, totalToPay, lateInterest } = financing;

        const unpaidInstallmentIndex = installments.findIndex(
          (i) => !i.installmentPaid
        );
        if (unpaidInstallmentIndex === -1) {
          financing.status = "CT";
          await financing.save();
          continue;
        }

        const currentInstallment = installments[unpaidInstallmentIndex];
        const nextInstallment = installments[unpaidInstallmentIndex + 1];

        const dueDate = new Date(currentInstallment.dueDate);
        const nextDueDate = nextInstallment
          ? new Date(nextInstallment.dueDate)
          : null;

        const inPaymentWindow = nextDueDate
          ? current >= dueDate && current < nextDueDate
          : current >= dueDate;

        if (!inPaymentWindow || currentInstallment.installmentPaid) {
          continue;
        }

        const paid = Math.random() < 0.5;

        if (paid) {
          currentInstallment.installmentPaid = true;
          const remainingInstallments = installments.slice(
            unpaidInstallmentIndex
          );
          for (const i of remainingInstallments) {
            i.outstandingValue =
              totalToPay - currentInstallment.installmentValue;
            await i.save();
          }
          await currentInstallment.save();
          logger.info(logMessages.INST_PAID);

          const hasOverdue = installments.some(
            (i) => !i.installmentPaid && i.overdueDays > 0
          );
          if (!hasOverdue) {
            financing.status = "AD";
            await financing.save();
          }
        } else {
          currentInstallment.overdueDays += 1;
          const mora =
            totalToPay * (lateInterest / 30) * currentInstallment.overdueDays;
          currentInstallment.lateInterests = parseFloat(mora.toFixed(2));
          currentInstallment.totalInstallmentValue = parseFloat(
            (
              currentInstallment.capital +
              currentInstallment.interest +
              currentInstallment.lateInterests
            ).toFixed(2)
          );
          await currentInstallment.save();
          logger.info(logMessages.INST_NOT_PAID);

          const overdue = currentInstallment.overdueDays;
          if (overdue === 0) financing.status = "AD";
          else if (overdue > 0 && overdue < 3) financing.status = "EM";
          else if (overdue >= 3 && overdue <= 5) financing.status = "CP";
          else if (overdue > 5) financing.status = "CJ";

          await financing.save();
        }
      }
    }
    res.status(200).json({ message: `Advanced ${days} days` });
  } catch (err) {
    res.status(500).json({ message: "Error updating virtual date" });
  }
};

exports.resetDate = async (req, res, next) => {
  const initialDate = new Date("2025-01-01");
  try {
    const updated = await VirtualDate.findOneAndUpdate(
      {},
      { currentDate: initialDate },
      { upsert: true, new: true }
    );
    logger.info(logMessages.VIRTUAL_DATE_RESET);
    await exports.deleteSimulatedData();
    logger.info(logMessages.SIM_DATA_DELETED);
    res.status(200).json({ message: "Date restarted" });
  } catch (err) {
    res.status(500).json({ message: "Error restarting virtual date" });
  }
};

exports.createClientForToday = async (virtualDate) => {
  try {
    const famRef3 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "FAM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("FAM"),
      isSimulated: true,
    });
    const savedFamRef3 = await famRef3.save();

    const famRef4 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "FAM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("FAM"),
      isSimulated: true,
    });
    const savedFamRef4 = await famRef4.save();

    const perRef3 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "PER",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("PER"),
      isSimulated: true,
    });
    const savedPerRef3 = await perRef3.save();

    const perRef4 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "PER",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("PER"),
      isSimulated: true,
    });
    const savedPerRef4 = await perRef4.save();

    const comRef3 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "COM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("COM"),
      isSimulated: true,
    });
    const savedComRef3 = await comRef3.save();

    const comRef4 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "COM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("COM"),
      isSimulated: true,
    });
    const savedComRef4 = await comRef4.save();

    const newCommercialInfo2 = new CommercialInfo({
      jobOccupation: faker.person.jobType(),
      company: faker.company.name(),
      laborSenority: "5 años",
      income: faker.number.int({
        min: 1000000,
        max: 20000000,
        multipleOf: 100000,
      }),
      additionalIncome: faker.number.int({
        min: 0,
        max: 5000000,
        multipleOf: 100000,
      }),
      expenses: faker.number.int({
        min: 1500000,
        max: 5000000,
        multipleOf: 100000,
      }),
      isSimulated: true,
    });
    const savedNewCommercialInfo2 = await newCommercialInfo2.save();

    const newGeoInfo2 = new GeoInfo({
      address: faker.location.streetAddress(),
      city: "Barranquilla",
      department: "Atlántico",
      neighbourhood: "América",
      latitude: faker.location.latitude({ max: 11.054258, min: 10.822674 }),
      longitude: faker.location.longitude({ max: -74.695437, min: -74.896113 }),
      isSimulated: true,
    });
    const savedNewGeoInfo2 = await newGeoInfo2.save();

    const newPersonalInfo2 = new PersonalInfo({
      photo: "",
      email: faker.internet.email(),
      phone: faker.phone.number(),
      birthDate: faker.date.birthdate(),
      isSimulated: true,
    });
    const savedNewPersonalInfo2 = await newPersonalInfo2.save();

    const famRef1 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "FAM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("FAM"),
      isSimulated: true,
    });
    const savedFamRef1 = await famRef1.save();

    const famRef2 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "FAM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("FAM"),
      isSimulated: true,
    });
    const savedFamRef2 = await famRef2.save();

    const perRef1 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "PER",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("PER"),
      isSimulated: true,
    });
    const savedPerRef1 = await perRef1.save();

    const perRef2 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "PER",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("PER"),
      isSimulated: true,
    });
    const savedPerRef2 = await perRef2.save();

    const comRef1 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "COM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("COM"),
      isSimulated: true,
    });
    const savedComRef1 = await comRef1.save();

    const comRef2 = new Reference({
      name: getFakeFullName(),
      identification: {
        idType: "CC",
        number: "101010",
      },
      referenceType: "COM",
      phone: faker.phone.number(),
      relationship: getRandomRelationshipType("COM"),
      isSimulated: true,
    });
    const savedComRef2 = await comRef2.save();

    const newMotorcycle = new Motorcycle({
      licensePlate: faker.vehicle.vrm().slice(0, 6),
      brand: faker.vehicle.manufacturer(),
      model: faker.vehicle.model(),
      isSimulated: true,
    });
    const savedNewMotorcycle = await newMotorcycle.save();

    // Financing
    const initialInstallment = faker.number.int({
      min: 200000,
      max: 5000000,
      multipleOf: 100000,
    });
    const financedAmount = faker.number.int({
      min: 1000000,
      max: 10000000,
      multipleOf: 100000,
    });
    const numberOfInstallments = faker.helpers.arrayElement([12, 18, 24]);
    let monthlyInterest;
    if (numberOfInstallments === 12) monthlyInterest = 0.365;
    if (numberOfInstallments === 18) monthlyInterest = 0.548;
    if (numberOfInstallments === 24) monthlyInterest = 0.732;

    const totalToPay = financedAmount + financedAmount * monthlyInterest;
    const lateInterest = 0.019;

    const newFinancing = new Financing({
      status: "AD",
      motorcycle: savedNewMotorcycle,
      initialInstallment,
      financedAmount,
      numberOfInstallments,
      totalToPay,
      monthlyInterest,
      lateInterest,
      isSimulated: true,
    });
    const savedNewFinancing = await newFinancing.save();

    // Installments
    const capital = financedAmount / numberOfInstallments;
    const interest = capital * monthlyInterest;
    const installmentValue = capital + interest;
    const guaranteeValue = totalToPay * 0.008;
    const outstandingValue = totalToPay;

    const installments = [];
    for (let i = 0; i < numberOfInstallments; i++) {
      const installmentNumber = i + 1;
      const dueDate = new Date(virtualDate);
      dueDate.setDate(dueDate.getDate() + 7 * installmentNumber);
      const overdueDays = 0;
      const lateInterests = totalToPay * (lateInterest / 30) * overdueDays;
      const totalInstallmentValue = installmentValue + lateInterests;

      const installment = new Installment({
        installmentNumber,
        dueDate,
        capital,
        interest,
        guaranteeValue,
        installmentPaid: false,
        installmentValue,
        outstandingValue,
        overdueDays,
        lateInterests,
        totalInstallmentValue,
        isSimulated: true,
      });
      const savedInstallment = await installment.save();
      installments.push(savedInstallment._id);
    }

    savedNewFinancing.installments = installments;
    await savedNewFinancing.save();

    const newCommercialInfo = new CommercialInfo({
      jobOccupation: faker.person.jobType(),
      company: faker.company.name(),
      laborSenority: "5 años",
      income: faker.number.int({
        min: 1000000,
        max: 20000000,
        multipleOf: 100000,
      }),
      additionalIncome: faker.number.int({
        min: 0,
        max: 5000000,
        multipleOf: 100000,
      }),
      expenses: faker.number.int({
        min: 1500000,
        max: 5000000,
        multipleOf: 100000,
      }),
      isSimulated: true,
    });
    const savedNewCommercialInfo = await newCommercialInfo.save();

    const newGeoInfo = new GeoInfo({
      address: faker.location.streetAddress(),
      city: "Barranquilla",
      department: "Atlántico",
      neighbourhood: "América",
      latitude: faker.location.latitude({ max: 11.054258, min: 10.822674 }),
      longitude: faker.location.longitude({ max: -74.695437, min: -74.896113 }),
      isSimulated: true,
    });
    const savedNewGeoInfo = await newGeoInfo.save();

    const newPersonalInfo = new PersonalInfo({
      photo: "",
      email: faker.internet.email(),
      phone: faker.phone.number(),
      birthDate: faker.date.birthdate(),
      isSimulated: true,
    });
    const savedNewPersonalInfo = await newPersonalInfo.save();

    const newCodebtor = new Codebtor({
      name: getFakeFullName(),
      role: "codebtor",
      identification: {
        idType: getRandomIdType(),
        number: getRandomIdNumber(),
      },
      personalInfo: savedNewPersonalInfo2,
      geoInfo: savedNewGeoInfo2,
      commercialInfo: savedNewCommercialInfo2,
      financing: savedNewFinancing,
      references: [
        savedFamRef3,
        savedFamRef4,
        savedPerRef3,
        savedPerRef4,
        savedComRef3,
        savedComRef4,
      ],
      isSimulated: true,
    });
    const savedNewCodebtor = await newCodebtor.save();

    const newDebtor = new Debtor({
      name: getFakeFullName(),
      role: "debtor",
      identification: {
        idType: getRandomIdType(),
        number: getRandomIdNumber(),
      },
      personalInfo: savedNewPersonalInfo,
      geoInfo: savedNewGeoInfo,
      commercialInfo: savedNewCommercialInfo,
      financing: savedNewFinancing,
      references: [
        savedFamRef1,
        savedFamRef2,
        savedPerRef1,
        savedPerRef2,
        savedComRef1,
        savedComRef2,
      ],
      codebtor: savedNewCodebtor,
      isSimulated: true,
    });
    const savedNewDebtor = await newDebtor.save();
  } catch (err) {
    logger.error(logMessages.USER_CREATE_ERROR(err));
  }
};

exports.deleteSimulatedData = async () => {
  try {
    await Promise.all([
      Debtor.deleteMany({ isSimulated: true }),
      Codebtor.deleteMany({ isSimulated: true }),
      PersonalInfo.deleteMany({ isSimulated: true }),
      GeoInfo.deleteMany({ isSimulated: true }),
      CommercialInfo.deleteMany({ isSimulated: true }),
      Financing.deleteMany({ isSimulated: true }),
      Installment.deleteMany({ isSimulated: true }),
      Reference.deleteMany({ isSimulated: true }),
      Motorcycle.deleteMany({ isSimulated: true }),
    ]);
  } catch (err) {
    logger.error(logMessages.SIM_DATA_DELETED_ERROR);
  }
};

function getFakeFullName() {
  return faker.person.firstName() + " " + faker.person.lastName().split(" ")[0];
}

function getRandomIdType() {
  const types = ["CC", "CE", "NIT"];
  return types[Math.floor(Math.random() * types.length)];
}

function getRandomIdNumber() {
  return faker.number.int({ min: 1000000000, max: 9999999999 });
}

function getRandomRelationshipType(referenceType) {
  switch (referenceType) {
    case "FAM":
      return faker.helpers.arrayElement([
        "PAD",
        "MAD",
        "CYG",
        "HER",
        "PRI",
        "TIO",
        "ABU",
        "NIE",
        "OTF",
      ]);
    case "PER":
      return faker.helpers.arrayElement(["AMI", "CON", "COM", "VEC", "OTP"]);
    case "COM":
      return faker.helpers.arrayElement(["CLI", "PRO", "SOC", "ENF", "OTC"]);
    default:
      break;
  }
}
