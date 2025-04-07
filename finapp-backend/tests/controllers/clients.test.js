jest.mock("../../models/client");
jest.mock("../../models/financing");
jest.mock("../../models/installment");
jest.mock("../../models/reference");

const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");

const { Client, Debtor, Codebtor } = require("../../models/client");
const Reference = require("../../models/reference");
const Financing = require("../../models/financing");
const motorcycle = require("../../models/motorcycle");
const personalInfo = require("../../models/personalInfo");
const commercialInfo = require("../../models/commercialInfo");
const reference = require("../../models/reference");
let clientsController = require("../../controllers/clients");

// GLOBAL MOCKS
const mockMotorcycle = {
  _id: new mongoose.Types.ObjectId(),
  licensePlate: "ABC123",
  brand: "Suzuki",
  model: "DR650",
};

const mockInstallment = {
  _id: new mongoose.Types.ObjectId(),
  installmentNumber: 1,
  dueDate: new Date(),
  capital: 1000,
  interest: 100,
  guaranteeValue: 1500,
  installmentPaid: false,
  installmentValue: 1200,
  outstandingValue: 1000,
  overdueDays: 10,
  lateInterests: 50,
  totalInstallmentValue: 1300,
};

const mockFinancing = {
  _id: new mongoose.Types.ObjectId(),
  status: "AD",
  motorcycle: mockMotorcycle._id,
  initialInstallment: 2000,
  financedAmount: 5000,
  numberOfInstallments: 24,
  totalToPay: 10000,
  monthlyInterest: 5,
  lateInterest: 2,
  installments: [mockInstallment._id],
};

const mockPersonalInfo = {
  _id: new mongoose.Types.ObjectId(),
  photo: "profile.jpg",
  email: "test@example.com",
  phone: "310000",
  birthDate: new Date("2000-01-01"),
};

const mockGeoInfo = {
  _id: new mongoose.Types.ObjectId(),
  address: "Clle 41",
  city: "Medellin",
  department: "Antioquia",
  neighbourhood: "Palmas",
  latitude: 10,
  longitude: 50,
};

const mockCommercialInfo = {
  _id: new mongoose.Types.ObjectId(),
  jobOccupation: "Pilot",
  company: "False Airlines",
  laborSenority: "2",
  income: 10000,
  additionalIncome: 2000,
  expenses: 4000,
};

const mockRef1 = {
  _id: new mongoose.Types.ObjectId(),
  name: "Pedro Vélez",
  referenceType: "PAD",
  phone: "312155777",
  relationship: "FAM",
  save: jest.fn(),
};

const mockRef2 = {
  _id: new mongoose.Types.ObjectId(),
  name: "Camilo Duarte",
  referenceType: "VEC",
  phone: "302545656",
  relationship: "PER",
  save: jest.fn(),
};

const mockRef3 = {
  _id: new mongoose.Types.ObjectId(),
  name: "BANCO MAR",
  referenceType: "ENF",
  phone: "312155777",
  relationship: "COM",
  save: jest.fn(),
};

mockManager = {
  _id: new mongoose.Types.ObjectId(),
  name: "Manager Test",
  role: "manager",
  email: "test@test.com",
};

const mockDebtorClient = {
  _id: new mongoose.Types.ObjectId(),
  name: "Juan Test",
  role: "debtor",
  financing: mockFinancing._id,
  personalInfo: mockPersonalInfo._id,
  geoInfo: mockGeoInfo._id,
  commercialInfo: mockCommercialInfo._id,
  references: [mockRef1._id, mockRef2._id, mockRef3._id],
  manager: mockManager._id,
};

const mockCodebtorClient = {
  _id: new mongoose.Types.ObjectId(),
  role: "debtor",
};

describe("GET /clients/:clientId", () => {
  it("should return a debtor client if the ID is valid", async () => {
    const mockClient = {
      _id: "12345",
      name: "Juan Pérez",
      role: "debtor",
      identification: { idType: "CC", number: "123456789" },
    };
    Client.findById.mockResolvedValue(mockClient);

    const response = await request(app).get("/clients/12345");

    expect(response.statusCode).toBe(200);
    expect(response.body.client).toEqual(mockClient);
  });

  it("should return a codebtor client if the ID is valid", async () => {
    const mockClient = {
      _id: "67890",
      name: "Ana García",
      role: "codebtor",
      identification: { idType: "CE", number: "987654321" },
    };
    Client.findById.mockResolvedValue(mockClient);

    const response = await request(app).get("/clients/67890");

    expect(response.statusCode).toBe(200);
    expect(response.body.client).toEqual(mockClient);
  });

  it("should return an error if client not found", async () => {
    Client.findById = jest.fn().mockResolvedValue(null);

    const response = await request(app).get("/clients/0000");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual("Client not found");
  });

  it("should return 500 if a database failure occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/clients/12345");

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toEqual("Error fetching client");
  });
});

describe("GET /clients/:cliendId/financing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if client is not found", async () => {
    Client.findById.mockResolvedValue(null);

    const res = await request(app).get("/clients/123/financing");

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Client not found");
  });

  it("should return financing info if client exists", async () => {
    const mockClient = {
      ...mockDebtorClient,
      financing: mockFinancing._id,
      populate: jest.fn().mockImplementation(async function () {
        this.financing = {
          ...mockFinancing,
          motorcycle: mockMotorcycle,
          installments: [mockInstallment],
        };
        return this;
      }),
    };
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app).get(
      `/clients/${mockDebtorClient._id}/financing`
    );

    expect(res.status).toBe(200);
    expect(res.body.financing).toEqual({
      _id: mockFinancing._id.toString(),
      status: mockFinancing.status,
      motorcycle: {
        _id: mockMotorcycle._id.toString(),
        licensePlate: mockMotorcycle.licensePlate,
        brand: mockMotorcycle.brand,
        model: mockMotorcycle.model,
      },
      initialInstallment: mockFinancing.initialInstallment,
      financedAmount: mockFinancing.financedAmount,
      numberOfInstallments: mockFinancing.numberOfInstallments,
      totalToPay: mockFinancing.totalToPay,
      monthlyInterest: mockFinancing.monthlyInterest,
      lateInterest: mockFinancing.lateInterest,
      installments: [
        {
          _id: mockInstallment._id.toString(),
          installmentNumber: mockInstallment.installmentNumber,
          dueDate: mockInstallment.dueDate.toISOString(),
          capital: mockInstallment.capital,
          interest: mockInstallment.interest,
          guaranteeValue: mockInstallment.guaranteeValue,
          installmentPaid: mockInstallment.installmentPaid,
          installmentValue: mockInstallment.installmentValue,
          outstandingValue: mockInstallment.outstandingValue,
          overdueDays: mockInstallment.overdueDays,
          lateInterests: mockInstallment.lateInterests,
          totalInstallmentValue: mockInstallment.totalInstallmentValue,
        },
      ],
    });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/clients/12345/financing");

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error fetching financing");
  });
});

describe("GET /clients/:cliendId/personalInfo", () => {
  it("should return personal info if client exists", async () => {
    Client.findById.mockResolvedValue({
      ...mockDebtorClient,
      populate: jest.fn().mockResolvedValue({
        ...mockDebtorClient,
        personalInfo: mockPersonalInfo,
      }),
    });

    const res = await request(app).get(
      `/clients/${mockDebtorClient._id}/personalInfo`
    );

    expect(res.status).toBe(200);
    expect(res.body.personalInfo).toEqual({
      _id: mockPersonalInfo._id.toString(),
      photo: mockPersonalInfo.photo,
      email: mockPersonalInfo.email,
      phone: mockPersonalInfo.phone,
      birthDate: mockPersonalInfo.birthDate.toISOString(),
    });
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    const res = await request(app).get("/clients/0000/personalInfo");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Client not found" });
  });

  it("should return 500 if there is a server error", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get(
      `/clients/${mockDebtorClient._id}/personalInfo`
    );

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Error fetching personal info",
      error: "Database error",
    });
  });
});

describe("POST /clients/:clientId/personalInfo/edit", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      ...mockDebtorClient,
      identification: { number: "123456789" },
      personalInfo: {
        ...mockPersonalInfo,
        save: jest.fn().mockResolvedValue(true),
      },
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue({
        ...mockDebtorClient,
        personalInfo: mockPersonalInfo,
      }),
    };

    jest.clearAllMocks();
  });

  it("should uptade personal info if client exists", async () => {
    const updatedInfo = {
      email: "updated@example.com",
      phone: "3200000",
      birthDate: new Date("1995-01-01").toISOString(),
    };
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app)
      .post(`/clients/${mockClient._id}/personalInfo/edit`)
      .send({
        newIdNumber: "987654321",
        newPersonalInfo: updatedInfo,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Client personal info updated");
    expect(mockClient.identification.number).toBe("987654321");
    expect(mockClient.personalInfo.email).toBe(updatedInfo.email);
    expect(mockClient.personalInfo.phone).toBe(updatedInfo.phone);
    expect(mockClient.personalInfo.birthDate).toBe(updatedInfo.birthDate);
    expect(mockClient.personalInfo.save).toHaveBeenCalled();
    expect(mockClient.save).toHaveBeenCalled();
  });

  it("should return 404 if client is not found", async () => {
    const updatedInfo = {
      email: "updated@example.com",
      phone: "3200000",
      birthDate: new Date("1995-01-01").toISOString(),
    };
    Client.findById.mockResolvedValue(null);

    const res = await request(app)
      .post(`/clients/0000/personalInfo/edit`)
      .send({
        newIdNumber: "987654321",
        newPersonalInfo: updatedInfo,
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Client not found");
  });

  it("should return 404 if personal info is not found", async () => {
    const updatedInfo = {
      email: "updated@example.com",
      phone: "3200000",
      birthDate: new Date("1995-01-01").toISOString(),
    };
    mockClient.personalInfo = null;
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app)
      .post(`/clients/${mockClient._id}/personalInfo/edit`)
      .send({
        newIdNumber: "987654321",
        newPersonalInfo: updatedInfo,
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Personal info not found");
  });

  it("should return 500 if an error occurs", async () => {
    const updatedInfo = {
      email: "updated@example.com",
      phone: "3200000",
      birthDate: new Date("1995-01-01").toISOString(),
    };
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .post(`/clients/${mockClient._id}/personalInfo/edit`)
      .send({
        newIdNumber: "987654321",
        newPersonalInfo: updatedInfo,
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error updating personal info");
    expect(res.body.error).toBe("Database error");
  });
});

describe("GET /clients/:cliendId/geoInfo", () => {
  it("should return geo info if client exists", async () => {
    Client.findById.mockResolvedValue({
      ...mockDebtorClient,
      populate: jest.fn().mockResolvedValue({
        ...mockDebtorClient,
        geoInfo: mockGeoInfo,
      }),
    });

    const res = await request(app).get(
      `/clients/${mockDebtorClient._id}/geoInfo`
    );

    expect(res.status).toBe(200);
    expect(res.body.geoInfo).toEqual({
      _id: mockGeoInfo._id.toString(),
      address: mockGeoInfo.address,
      city: mockGeoInfo.city,
      department: mockGeoInfo.department,
      neighbourhood: mockGeoInfo.neighbourhood,
      latitude: mockGeoInfo.latitude,
      longitude: mockGeoInfo.longitude,
    });
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    const res = await request(app).get("/clients/0000/geoInfo");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Client not found" });
  });

  it("should return 500 if there is a server error", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get(
      `/clients/${mockDebtorClient._id}/geoInfo`
    );

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Error fetching geo info",
      error: "Database error",
    });
  });
});

describe("POST /clients/:clientId/geoInfo/edit", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      ...mockDebtorClient,
      geoInfo: {
        ...mockGeoInfo,
        save: jest.fn().mockResolvedValue(true),
      },
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue({
        ...mockDebtorClient,
        geoInfo: mockGeoInfo,
      }),
    };
    jest.clearAllMocks();
  });

  it("should update geo info if client exists", async () => {
    const updatedInfo = {
      address: "Cra 20",
      city: "Rionegro",
      deparment: "Antioquia",
      neighbourhood: "El Porvenir",
      latitude: 20,
      longitude: 70,
    };
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app)
      .post(`/clients/${mockClient._id}/geoInfo/edit`)
      .send({
        updatedGeoInfo: updatedInfo,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Client geo info updated");
    expect(mockClient.geoInfo.address).toBe(updatedInfo.address);
    expect(mockClient.geoInfo.city).toBe(updatedInfo.city);
    expect(mockClient.geoInfo.deparment).toBe(updatedInfo.deparment);
    expect(mockClient.geoInfo.neighbourhood).toBe(updatedInfo.neighbourhood);
    expect(mockClient.geoInfo.latitude).toBe(updatedInfo.latitude);
    expect(mockClient.geoInfo.longitude).toBe(updatedInfo.longitude);
    expect(mockClient.geoInfo.save).toHaveBeenCalled();
    expect(mockClient.save).toHaveBeenCalled();
  });

  it("should return 404 if client is not found", async () => {
    const updatedInfo = {
      address: "Cra 20",
      city: "Rionegro",
      deparment: "Antioquia",
      neighbourhood: "El Porvenir",
      latitude: 20,
      longitude: 70,
    };
    Client.findById.mockResolvedValue(null);

    const res = await request(app).post(`/clients/0000/geoInfo/edit`).send({
      updatedGeoInfo: updatedInfo,
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Client not found");
  });

  it("should return 404 if geo info is not found", async () => {
    const updatedInfo = {
      address: "Cra 20",
      city: "Rionegro",
      deparment: "Antioquia",
      neighbourhood: "El Porvenir",
      latitude: 20,
      longitude: 70,
    };
    mockClient.geoInfo = null;
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app)
      .post(`/clients/${mockClient._id}/geoInfo/edit`)
      .send({
        updatedGeoInfo: updatedInfo,
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Geo info not found");
  });

  it("should return 500 if an error occurs", async () => {
    const updatedInfo = {
      address: "Cra 20",
      city: "Rionegro",
      deparment: "Antioquia",
      neighbourhood: "El Porvenir",
      latitude: 20,
      longitude: 70,
    };
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .post(`/clients/${mockClient._id}/geoInfo/edit`)
      .send({
        updatedGeoInfo: updatedInfo,
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error updating geo info");
    expect(res.body.error).toBe("Database error");
  });
});

describe("GET /clients/:cliendId/commercialInfo", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      ...mockDebtorClient,
      references: [mockRef1, mockRef2, mockRef3],
      commercialInfo: mockCommercialInfo,
      populate: jest.fn().mockImplementation(function (field) {
        if (field === "references") {
          this.references = [mockRef1, mockRef2, mockRef3];
        }
        if (field === "commercialInfo") {
          this.commercialInfo = mockCommercialInfo;
        }
        return this;
      }),
    };
    jest.clearAllMocks();
  });

  it("should return commercial info and references if client exists", async () => {
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app).get(
      `/clients/${mockClient._id}/commercialInfo`
    );

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      references: [
        {
          _id: mockRef1._id.toString(),
          name: mockRef1.name,
          referenceType: mockRef1.referenceType,
          phone: mockRef1.phone,
          relationship: mockRef1.relationship,
        },
        {
          _id: mockRef2._id.toString(),
          name: mockRef2.name,
          referenceType: mockRef2.referenceType,
          phone: mockRef2.phone,
          relationship: mockRef2.relationship,
        },
        {
          _id: mockRef3._id.toString(),
          name: mockRef3.name,
          referenceType: mockRef3.referenceType,
          phone: mockRef3.phone,
          relationship: mockRef3.relationship,
        },
      ],
      commercialInfo: {
        _id: mockCommercialInfo._id.toString(),
        jobOccupation: mockCommercialInfo.jobOccupation,
        company: mockCommercialInfo.company,
        laborSenority: mockCommercialInfo.laborSenority,
        income: mockCommercialInfo.income,
        additionalIncome: mockCommercialInfo.additionalIncome,
        expenses: mockCommercialInfo.expenses,
      },
    });
    expect(Client.findById).toHaveBeenCalledWith(
      mockClient._id.toString(),
      "references commercialInfo"
    );
    expect(mockClient.populate).toHaveBeenCalledWith("references");
    expect(mockClient.populate).toHaveBeenCalledWith("commercialInfo");
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    const res = await request(app).get("/clients/0000/commercialInfo");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Client not found" });
    expect(mockClient?.populate).not.toHaveBeenCalled();
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get(
      `/clients/${mockClient._id}/commercialInfo`
    );

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Error fetching commercial info",
      error: "Database error",
    });

    expect(mockClient?.populate).not.toHaveBeenCalled();
  });
});

describe("POST /clients/:cliendId/commercialInfo/edit", () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      ...mockDebtorClient,
      commercialInfo: {
        ...mockCommercialInfo,
        save: jest.fn().mockResolvedValue(true),
      },
      references: [mockRef1, mockRef2, mockRef3],
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue(true),
    };
    jest.clearAllMocks();
    mockRef1.save = jest.fn().mockResolvedValue(true);
    mockRef2.save = jest.fn().mockResolvedValue(true);
    mockRef3.save = jest.fn().mockResolvedValue(true);
  });

  it("should update commercial info and references if client exists", async () => {
    const updatedCommercialInfo = {
      jobOccupation: "Software Developer",
      company: "New Tech Corp",
      laborSenority: "6",
      income: 6000,
      additionalIncome: 1500,
      expenses: 2500,
    };

    const updatedReferences = [
      {
        _id: mockRef1._id.toString(),
        name: "Reference 1",
        referenceType: "FAM",
        phone: "3009999999",
        relationship: "HER",
      },
      {
        _id: mockRef2._id.toString(),
        name: "Reference 2",
        referenceType: "PER",
        phone: "3008888888",
        relationship: "COM",
      },
      {
        _id: mockRef3._id.toString(),
        name: "Reference 3",
        referenceType: "COM",
        phone: "3008888888",
        relationship: "ENF",
      },
    ];

    Client.findById.mockResolvedValue(mockClient);
    Reference.findById.mockImplementation((id) => {
      [mockRef1, mockRef2, mockRef3].find((ref) => ref._id.toString() === id);
    });

    const res = await request(app)
      .post(`/clients/${mockClient._id}/commercialInfo/edit`)
      .send({
        newCommercialInfo: updatedCommercialInfo,
        newReferences: updatedReferences,
      });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Client commercial info updated");
    expect(mockClient.commercialInfo.jobOccupation).toBe(
      updatedCommercialInfo.jobOccupation
    );
    expect(mockClient.commercialInfo.laborSenority).toBe(
      updatedCommercialInfo.laborSenority
    );
    expect(mockClient.commercialInfo.additionalIncome).toBe(
      updatedCommercialInfo.additionalIncome
    );
    expect(mockClient.commercialInfo.save).toHaveBeenCalled();
  });

  it("should return 404 if commercial info or references are not found", async () => {
    mockClient.commercialInfo = null;
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app)
      .post(`/clients/${mockClient._id}/commercialInfo/edit`)
      .send({
        newCommercialInfo: {},
        newReferences: [],
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Commercial info or references not found");
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app)
      .post(`/clients/${mockClient._id}/commercialInfo/edit`)
      .send({
        newCommercialInfo: {},
        newReferences: [],
      });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Error updating commercial info");
    expect(res.body.error).toBe("Database error");
  });
});

describe("GET /clients/:clientId/name", () => {
  let mockClient;
  beforeEach(() => {
    mockClient = {
      _id: "12345",
      name: "Juan Pérez",
      role: "debtor",
      identification: { idType: "CC", number: "123456789" },
    };
    jest.clearAllMocks();
  });

  it("should return client name if client exists", async () => {
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app).get(`/clients/${mockClient._id}/name`);

    expect(res.status).toBe(200);
    expect(res.body.name).toEqual(mockClient.name);
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    const res = await request(app).get("/clients/0000/name");

    expect(res.status).toBe(404);
    expect(res.body.message).toEqual("Client not found");
  });

  it("should return 500 if there is a server error", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get(`/clients/${mockClient._id}/name`);

    expect(res.status).toBe(500);
    expect(res.body.message).toEqual("Error fetching name");
    expect(res.body.error).toEqual("Database error");
  });
});

describe("GET /debtors-list/:managerId", () => {
  let req, res, next;
  beforeEach(() => {
    jest.resetAllMocks();
    req = {
      query: {},
      params: { managerId: "12345" },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    clientsController.getDebtorsListBySearchTerm = jest.fn();
    clientsController.getDebtorsListByStatuses = jest.fn();
    clientsController.getDebtors = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getDebtorsListBySearchTerm if searchTerm is provided", async () => {
    req.query.searchTerm = "test";

    await clientsController.getDebtorsListByManager(req, res, next);

    expect(clientsController.getDebtorsListBySearchTerm).toHaveBeenCalledWith(
      req,
      res,
      next
    );
    expect(clientsController.getDebtorsListByStatuses).not.toHaveBeenCalled();
    expect(clientsController.getDebtors).not.toHaveBeenCalled();
  });

  it("should call getDebtorsListByStatuses if filter is provided", async () => {
    req.query.filter = "test";

    await clientsController.getDebtorsListByManager(req, res, next);

    expect(clientsController.getDebtorsListBySearchTerm).not.toHaveBeenCalled();
    expect(clientsController.getDebtorsListByStatuses).toHaveBeenCalledWith(
      req,
      res,
      next
    );
    expect(clientsController.getDebtors).not.toHaveBeenCalled();
  });

  it("should call getDebtors if neither searchTerm nor filter is provided", async () => {
    req.query.filter = undefined;
    req.query.searchTerm = undefined;

    await clientsController.getDebtorsListByManager(req, res, next);

    expect(clientsController.getDebtorsListBySearchTerm).not.toHaveBeenCalled();
    expect(clientsController.getDebtorsListByStatuses).not.toHaveBeenCalled();
    expect(clientsController.getDebtors).toHaveBeenCalledWith({}, res, "12345");
  });
});

describe("get debtors list by search term", () => {
  let req, res, next;

  beforeEach(() => {
    jest.resetModules();
    clientsController = require("../../controllers/clients");
    req = {
      query: {},
      params: { managerId: "12345" },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    jest.spyOn(clientsController, "getDebtors").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getDebtors with name parameter", async () => {
    req.query.searchTerm = "Juan";

    await clientsController.getDebtorsListBySearchTerm(req, res, next);

    expect(clientsController.getDebtors).toHaveBeenCalled();
    expect(clientsController.getDebtors).toHaveBeenCalledWith(
      { name: { $regex: "Juan", $options: "i" } },
      res,
      req.params.managerId
    );
  });

  it("should call getDebtors with id paramter", async () => {
    req.query.searchTerm = "123";

    await clientsController.getDebtorsListBySearchTerm(req, res, next);

    expect(clientsController.getDebtors).toHaveBeenCalled();
    expect(clientsController.getDebtors).toHaveBeenCalledWith(
      { "identification.number": "123" },
      res,
      req.params.managerId
    );
  });
});

describe("get debtors list by statuses", () => {
  let req, res, next;
  let clientsController;

  beforeEach(() => {
    jest.resetModules();
    clientsController = require("../../controllers/clients");
    req = {
      query: { filter: "AD" },
      params: { managerId: "12345" },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    mockFinancingModel = require("../../models/financing");

    jest.spyOn(clientsController, "getDebtors").mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getDebtors with status parameter", async () => {
    mockFinancingModel.find.mockResolvedValue([mockFinancing]);

    await clientsController.getDebtorsListByStatuses(req, res, next);

    expect(mockFinancingModel.find).toHaveBeenCalledWith({
      status: { $in: ["AD"] },
    });
    expect(clientsController.getDebtors).toHaveBeenCalledWith(
      { financing: { $in: [mockFinancing._id] } },
      res,
      "12345"
    );
  });

  it("should return 500 if an error occurs", async () => {
    mockFinancingModel.find = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await clientsController.getDebtorsListByStatuses(req, res, next);

    expect(mockFinancingModel.find).toHaveBeenCalledWith({
      status: { $in: ["AD"] },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching financings",
      error: "Database error",
    });
  });
});

describe("GET /all-debtors", () => {
  let req, res, next;
  let Debtor;
  let clientsController;
  let findMock;

  const mockManagerId = new mongoose.Types.ObjectId();
  const mockDebtorClient = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    identification: {
      idType: "CC",
      number: "123456789",
    },
    manager: mockManagerId,
  };

  beforeEach(() => {
    jest.resetModules();
    findMock = jest.fn().mockResolvedValue([mockDebtorClient]);
    jest.mock("../../models/client", () => {
      return {
        Debtor: {
          find: (findMock = jest.fn().mockResolvedValue([mockDebtorClient])),
          populate: jest.fn().mockResolvedValue([
            {
              ...mockDebtorClient,
              manager: { _id: mockManagerId, name: "Manager Test" },
            },
          ]),
        },
        Client: {},
        Codebtor: {},
      };
    });
    ({ Debtor } = require("../../models/client"));
    clientsController = require("../../controllers/clients");
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should return a list of debtors if they exist", async () => {
    req.query.searchTerm = "Juan";

    await clientsController.getAllDebtors(req, res, next);

    expect(Debtor.find).toHaveBeenCalledWith(
      { name: { $regex: "Juan", $options: "i" } },
      "name identification.number manager"
    );
    expect(Debtor.populate).toHaveBeenCalledWith([mockDebtorClient], {
      path: "manager",
      select: "name",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      debtors: [
        {
          ...mockDebtorClient,
          manager: { _id: mockManagerId, name: "Manager Test" },
        },
      ],
    });
  });

  it("should return 500 if an error occurs", async () => {
    Debtor.find.mockRejectedValue(new Error("Database error"));
    req.query.searchTerm = "Juan";

    await clientsController.getAllDebtors(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching debtors",
      error: "Database error",
    });
  });
});

describe("POST /assign-debtor", () => {
  let req, res, next;
  let Debtor;
  let clientsController;

  const mockDebtorId = new mongoose.Types.ObjectId();
  const mockManagerId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.mock("../../models/client", () => ({
      Debtor: {
        findById: jest.fn(),
      },
      Client: {},
      Codebtor: {},
    }));
    req = {
      body: {
        clientId: mockDebtorId,
        managerId: mockManagerId,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    ({ Debtor } = require("../../models/client"));
    clientsController = require("../../controllers/clients");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should assign a debtor to a manager successfully", async () => {
    const mockDebtor = {
      manager: null,
      save: jest.fn().mockResolvedValue(),
    };
    Debtor.findById = jest.fn().mockResolvedValue(mockDebtor);

    await clientsController.assigndDebtorToManager(req, res, next);

    expect(Debtor.findById).toHaveBeenCalledWith(mockDebtorId);
    expect(mockDebtor.manager).toBe(mockManagerId);
    expect(mockDebtor.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Debtor added to manager",
    });
  });

  it("should return 404 if debtor is not found", async () => {
    Debtor.findById = jest.fn().mockResolvedValue(null);

    await clientsController.assigndDebtorToManager(req, res, next);

    expect(Debtor.findById).toHaveBeenCalledWith(mockDebtorId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Debtor not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    Debtor.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await clientsController.assigndDebtorToManager(req, res, next);

    expect(Debtor.findById).toHaveBeenCalledWith(mockDebtorId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error assigning debtor",
      error: "Database error",
    });
  });
});

describe("POST /remove-debtor", () => {
  let req, res, next;
  let Debtor;
  let clientsController;

  const mockDebtorId = new mongoose.Types.ObjectId();

  beforeEach(() => {
    jest.mock("../../models/client", () => ({
      Debtor: {
        findById: jest.fn(),
      },
      Client: {},
      Codebtor: {},
    }));
    req = {
      body: {
        clientId: mockDebtorId,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    ({ Debtor } = require("../../models/client"));
    clientsController = require("../../controllers/clients");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should remove a debtor from a manager successfully", async () => {
    const mockDebtor = {
      manager: "someManagerId",
      save: jest.fn().mockResolvedValue(),
    };
    Debtor.findById = jest.fn().mockResolvedValue(mockDebtor);

    await clientsController.removeDebtorFromManager(req, res, next);

    expect(Debtor.findById).toHaveBeenCalledWith(mockDebtorId);
    expect(mockDebtor.manager).toBe(null);
    expect(mockDebtor.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Debtor removed from manager",
    });
  });

  it("should return 404 if debtor is not found", async () => {
    Debtor.findById = jest.fn().mockResolvedValue(null);

    await clientsController.removeDebtorFromManager(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Debtor not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    Debtor.findById = jest.fn().mockRejectedValue(new Error("DB Error"));

    await clientsController.removeDebtorFromManager(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error removing debtor",
      error: "DB Error",
    });
  });
});

describe("GET /debtors-list-report", () => {
  let req, res, next;
  // let clientsController;
  beforeEach(() => {
    jest.resetAllMocks();
    req = {
      query: {},
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();

    clientsController.getDebtorsForDelinquencyReport = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call getDebtorsForDelinquencyReport if reportType is provided and is a delinquency-report", async () => {
    req.query.reportType = "delinquency-report";

    await clientsController.getDebtorsForReport(req, res, next);

    expect(
      clientsController.getDebtorsForDelinquencyReport
    ).toHaveBeenCalledWith(req, res, next);
    expect(res.status).not.toHaveBeenCalledWith(400);
  });

  it("should return 400 if reportType is invalid", async () => {
    req.query.reportType = "invalid-report";

    await clientsController.getDebtorsForReport(req, res, next);

    expect(
      clientsController.getDebtorsForDelinquencyReport
    ).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid report type" });
  });

  it("should return 400 if reportType is not provided", async () => {
    req.query.reportType = undefined;

    await clientsController.getDebtorsForReport(req, res, next);

    expect(
      clientsController.getDebtorsForDelinquencyReport
    ).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid report type" });
  });
});

describe("GET debtors for delinquency report", () => {
  let req, res, next;
  let Debtor;
  let clientsController;

  const mockInstallment1 = {
    _id: new mongoose.Types.ObjectId(),
    installmentNumber: 1,
    dueDate: new Date("2024-01-01"),
    overdueDays: 35,
    installmentValue: 1200,
    lateInterests: 50,
    totalInstallmentValue: 1300,
    installmentPaid: true,
  };

  const mockInstallment2 = {
    _id: new mongoose.Types.ObjectId(),
    installmentNumber: 2,
    dueDate: new Date("2024-02-01"),
    overdueDays: 65,
    installmentValue: 1500,
    lateInterests: 75,
    totalInstallmentValue: 1575,
    installmentPaid: false,
  };

  const mockInstallment3 = {
    _id: new mongoose.Types.ObjectId(),
    installmentNumber: 3,
    dueDate: new Date("2024-01-01"),
    overdueDays: 95,
    installmentValue: 2000,
    lateInterests: 100,
    totalInstallmentValue: 2100,
    installmentPaid: false,
  };

  const mockFinancing1 = {
    _id: new mongoose.Types.ObjectId(),
    status: "EM",
    installments: [mockInstallment1, mockInstallment2],
  };

  const mockFinancing2 = {
    _id: new mongoose.Types.ObjectId(),
    status: "CP",
    installments: [mockInstallment3],
  };

  const mockDebtor1 = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    identification: { number: "123456789" },
    financing: mockFinancing1,
    manager: { name: "Manager 1" },
  };

  const mockDebtor2 = {
    _id: new mongoose.Types.ObjectId(),
    name: "Maria Test",
    identification: { number: "987654321" },
    financing: mockFinancing2,
    manager: { name: "Manager 2" },
  };

  beforeEach(() => {
    jest.resetModules();
    jest.mock("../../models/client", () => ({
      Debtor: {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockDebtor1, mockDebtor2]),
      },
    }));
    ({ Debtor } = require("../../models/client"));
    clientsController = require("../../controllers/clients");

    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should return a list of debtors with overdue installments for 30 days", async () => {
    req.query.days = "30";

    await clientsController.getDebtorsForDelinquencyReport(req, res, next);

    expect(Debtor.find).toHaveBeenCalledWith({});
    expect(Debtor.find().populate).toHaveBeenCalledWith({
      path: "financing",
      populate: {
        path: "installments",
        model: "Installment",
      },
    });
    expect(Debtor.find().populate).toHaveBeenCalledWith("manager", "name");
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should return a list of debtors with overdye installments for 60 days", async () => {
    req.query.days = "60";

    await clientsController.getDebtorsForDelinquencyReport(req, res, next);

    expect(Debtor.find).toHaveBeenCalledWith({});
    expect(Debtor.find().populate).toHaveBeenCalledWith({
      path: "financing",
      populate: {
        path: "installments",
        model: "Installment",
      },
    });
    expect(Debtor.find().populate).toHaveBeenCalledWith("manager", "name");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        debtorId: "123456789",
        debtorName: "Juan Test",
        installmentValue: 1500,
        overdueDays: 65,
        lateInterests: 75,
        totalInstallmentValue: 1575,
        financingStatus: "En mora",
        manager: "Manager 1",
      },
    ]);
  });

  it("should return a list of debtors with overdye installments for 90 days", async () => {
    req.query.days = "90";

    await clientsController.getDebtorsForDelinquencyReport(req, res, next);

    expect(Debtor.find).toHaveBeenCalledWith({});
    expect(Debtor.find().populate).toHaveBeenCalledWith({
      path: "financing",
      populate: {
        path: "installments",
        model: "Installment",
      },
    });
    expect(Debtor.find().populate).toHaveBeenCalledWith("manager", "name");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        debtorId: "987654321",
        debtorName: "Maria Test",
        installmentValue: 2000,
        overdueDays: 95,
        lateInterests: 100,
        totalInstallmentValue: 2100,
        financingStatus: "En cobro prejurídico",
        manager: "Manager 2",
      },
    ]);
  });

  it("should return 400 if 'days' parameter is invalid", async () => {
    req.query.days = "invalid";

    await clientsController.getDebtorsForDelinquencyReport(req, res, next);

    expect(Debtor.find).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Invalid 'days' parameter",
    });
  });

  it("should return 500 if an error occurs", async () => {
    req.query.days = "30";
    Debtor.find().exec = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await clientsController.getDebtorsForDelinquencyReport(req, res, next);
  });
});

describe("get debtors", () => {
  let req, res, next;
  let Debtor;
  let clientsController;

  const mockDebtor1 = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    identification: { number: "123456789" },
    financing: { status: "EM" },
  };

  const mockDebtor2 = {
    _id: new mongoose.Types.ObjectId(),
    name: "Maria Test",
    identification: { number: "987654321" },
    financing: { status: "CP" },
  };

  beforeEach(() => {
    jest.resetModules();
    jest.mock("../../models/client", () => ({
      Debtor: {
        find: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([mockDebtor1, mockDebtor2]),
      },
    }));
    ({ Debtor } = require("../../models/client"));
    clientsController = require("../../controllers/clients");

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("should return a list of debtors if they exist", async () => {
    const query = { name: { $regex: "Juan", $options: "i" } };
    const managerId = "12345";

    await clientsController.getDebtors(query, res, managerId);

    expect(Debtor.find).toHaveBeenCalledWith(
      query,
      "name identification.number financing"
    );
    expect(Debtor.find().where).toHaveBeenCalledWith({ manager: managerId });
    expect(Debtor.find().populate).toHaveBeenCalledWith({
      path: "financing",
      select: "status",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      debtors: [mockDebtor1, mockDebtor2],
    });
  });

  it("should return 500 if an error occurs", async () => {
    const query = { name: { $regex: "Juan", $options: "i" } };
    const managerId = "12345";
    Debtor.find.mockImplementation(() => {
      throw new Error("Database error");
    });

    await clientsController.getDebtors(query, res, managerId);

    expect(Debtor.find).toHaveBeenCalledWith(
      query,
      "name identification.number financing"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching debtors",
      error: "Database error",
    });
  });
});
