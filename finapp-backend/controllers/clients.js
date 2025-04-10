const Financing = require("../models/financing");
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

exports.getClient = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ client });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching client",
      error: err.message,
    });
  }
};

exports.getClientFinancing = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId, "financing");

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await client.populate({
      path: "financing",
      populate: [{ path: "motorcycle" }, { path: "installments" }],
    });

    res.status(200).json({ financing: client.financing });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching financing",
      error: err.message,
    });
  }
};

exports.getClientPersonalInfo = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId, "personalInfo");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.populate("personalInfo");
    res.status(200).json({ personalInfo: client.personalInfo });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error fetching personal info",
        error: err?.message || "Unknown error",
      });
    }
  }
};

exports.editClientPersonalInfo = async (req, res, next) => {
  try {
    const { newIdNumber, newPersonalInfo } = req.body;
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.populate("personalInfo");
    if (!client.personalInfo) {
      return res.status(404).json({ message: "Personal info not found" });
    }
    client.identification.number = newIdNumber;
    Object.assign(client.personalInfo, newPersonalInfo);
    await client.personalInfo.save();
    await client.save();
    res.status(200).json({ message: "Client personal info updated" });
  } catch (err) {
    res.status(500).json({
      message: "Error updating personal info",
      error: err.message || "Unknown error",
    });
  }
};

exports.getClientGeoInfo = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId, "geoInfo");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.populate("geoInfo");
    res.status(200).json({ geoInfo: client.geoInfo });
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).json({
        message: "Error fetching geo info",
        error: err?.message || "Unknown error",
      });
    }
  }
};

exports.editClientGeoInfo = async (req, res, next) => {
  try {
    const { updatedGeoInfo } = req.body;
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.populate("geoInfo");
    if (!client.geoInfo) {
      return res.status(404).json({ message: "Geo info not found" });
    }
    Object.assign(client.geoInfo, updatedGeoInfo);
    await client.geoInfo.save();
    await client.save();
    res.status(200).json({ message: "Client geo info updated" });
  } catch (err) {
    res.status(500).json({
      message: "Error updating geo info",
      error: err.message || "Unknown error",
    });
  }
};

exports.getClientCommercialInfo = async (req, res, next) => {
  try {
    const client = await Client.findById(
      req.params.clientId,
      "references commercialInfo"
    );
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.populate("references");
    await client.populate("commercialInfo");

    res.status(200).json({
      references: client.references,
      commercialInfo: client.commercialInfo,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching commercial info",
      error: err.message,
    });
  }
};

exports.editClientCommercialInfo = async (req, res, next) => {
  try {
    const { newCommercialInfo, newReferences } = req.body;
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    await client.populate("commercialInfo references");
    if (!client.commercialInfo || !client.references) {
      return res
        .status(404)
        .json({ message: "Commercial info or references not found" });
    }
    Object.assign(client.commercialInfo, newCommercialInfo);

    for (const newReference of newReferences) {
      const reference = await Reference.findById(newReference._id);
      if (reference) {
        Object.assign(reference, newReference);
        reference.identification.idType = "CC";
        reference.identification.number = "111";
        await reference.save();
      }
    }
    await client.commercialInfo.save();
    await client.save();
    res.status(200).json({ message: "Client commercial info updated" });
  } catch (err) {
    res.status(500).json({
      message: "Error updating commercial info",
      error: err.message || "Unknown error",
    });
  }
};

exports.getClientName = async (req, res, next) => {
  try {
    const client = await Client.findById(req.params.clientId, "name");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ name: client.name });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching name",
      error: err.message,
    });
  }
};

exports.getDebtorsListByManager = (req, res, next) => {
  if (req.query.searchTerm) {
    exports.getDebtorsListBySearchTerm(req, res, next);
  } else if (req.query.filter) {
    console.log("Filtering...");
    exports.getDebtorsListByStatuses(req, res, next);
  } else {
    exports.getDebtors({}, res, req.params.managerId);
  }
};

exports.getDebtorsListBySearchTerm = (req, res, next) => {
  const searchTerm = req.query.searchTerm;
  const managerId = req.params.managerId;
  const query = isNaN(Number(searchTerm))
    ? { name: { $regex: searchTerm, $options: "i" } }
    : { "identification.number": searchTerm };
  exports.getDebtors(query, res, managerId);
};

exports.getDebtorsListByStatuses = async (req, res, next) => {
  try {
    const statuses = req.query.filter.split(",");
    const managerId = req.params.managerId;
    const financings = await Financing.find({ status: { $in: statuses } });
    const financingIds = financings.map((financing) => financing._id);
    await exports.getDebtors(
      { financing: { $in: financingIds } },
      res,
      managerId
    );
  } catch (err) {
    res.status(500).json({
      message: "Error fetching financings",
      error: err.message,
    });
  }
};

exports.getAllDebtors = async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm;
    const query = isNaN(searchTerm)
      ? { name: { $regex: searchTerm, $options: "i" } }
      : { "identification.number": searchTerm };
    const debtors = await Debtor.find(
      query,
      "name identification.number manager"
    );
    const populatedDebtors = await Debtor.populate(debtors, {
      path: "manager",
      select: "name",
    });
    console.log(populatedDebtors);
    res.status(200).json({ debtors: populatedDebtors });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching debtors",
      error: err.message,
    });
  }
};

exports.assigndDebtorToManager = async (req, res, next) => {
  const debtorId = req.body.clientId;
  const managerId = req.body.managerId;
  try {
    const debtor = await Debtor.findById(debtorId);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    debtor.manager = managerId;
    await debtor.save();
    res.status(200).json({ message: "Debtor added to manager" });
  } catch (err) {
    res.status(500).json({
      message: "Error assigning debtor",
      error: err.message,
    });
  }
};

exports.removeDebtorFromManager = async (req, res, next) => {
  const debtorId = req.body.clientId;
  try {
    const debtor = await Debtor.findById(debtorId);
    if (!debtor) {
      return res.status(404).json({ message: "Debtor not found" });
    }
    debtor.manager = null;
    await debtor.save();
    res.status(200).json({ message: "Debtor removed from manager" });
  } catch (err) {
    res.status(500).json({
      message: "Error removing debtor",
      error: err.message,
    });
  }
};

exports.getDebtorsListWithoutAssignment = (req, res, next) => {
  exports.getDebtors({}, res, null);
};

exports.getDebtorsForReport = (req, res, next) => {
  if (req.query.reportType === "delinquency-report") {
    exports.getDebtorsForDelinquencyReport(req, res, next);
  } else {
    res.status(400).json({ error: "Invalid report type" });
  }
};

exports.getDebtorsForDelinquencyReport = async (req, res, next) => {
  try {
    const { days } = req.query;
    const validDays = ["30", "60", "90"];
    if (!validDays.includes(days)) {
      return res.status(400).json({ message: "Invalid 'days' parameter" });
    }
    const debtors = await Debtor.find({})
      .populate({
        path: "financing",
        populate: {
          path: "installments",
          model: "Installment",
        },
      })
      .populate("manager", "name")
      .exec();

    const dayRanges = {
      30: { min: 30, max: 60 },
      60: { min: 60, max: 90 },
      90: { min: 90, max: null },
    };
    const { min, max } = dayRanges[days];

    const result = debtors
      .map((debtor) => {
        const installments = debtor?.financing?.installments;
        if (!installments || installments.length === 0) return null;

        const unpaidInstallments = installments
          .filter((inst) => !inst.installmentPaid)
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        if (unpaidInstallments.length === 0) return null;

        const nextDueInstallment = unpaidInstallments[0];
        const overdue = nextDueInstallment.overdueDays;
        if (overdue >= min && (max === null || overdue < max)) {
          return {
            debtorId: debtor.identification.number,
            debtorName: debtor.name,
            installmentValue: nextDueInstallment.installmentValue,
            overdueDays: overdue,
            lateInterests: nextDueInstallment.lateInterests,
            totalInstallmentValue: nextDueInstallment.totalInstallmentValue,
            financingStatus: statusEnum[debtor.financing.status],
            manager: debtor.manager ? debtor.manager.name : "-",
          };
        }
        return null;
      })
      .filter((debtor) => debtor !== null);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching debtors",
      error: err.message,
    });
  }
};

exports.getDebtors = async (query, res, managerId) => {
  try {
    const debtors = await Debtor.find(
      query,
      "name identification.number financing"
    )
      .where({ manager: managerId })
      .populate({
        path: "financing",
        select: "status",
      });
    res.status(200).json({ debtors: debtors });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching debtors",
      error: err.message,
    });
  }
};
