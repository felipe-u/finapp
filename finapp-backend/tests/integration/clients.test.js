const request = require("supertest");
const app = require("../../app");
const { Client, Debtor } = require("../../models/client");
const mongoose = require("mongoose");
const Reference = require("../../models/reference");
const Financing = require("../../models/financing");

jest.mock("../../models/client");
jest.mock("../../models/reference");

describe("GET /clients/:clientId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a client if the ID is valid", async () => {
    const mockClient = {
      _id: "12345",
      name: "Juan Pérez",
      role: "debtor",
      identification: { idType: "CC", number: "123456789" },
    };
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app).get("/clients/12345");

    expect(res.statusCode).toBe(200);
    expect(res.body.client).toEqual(mockClient);
    expect(Client.findById).toHaveBeenCalledWith("12345");
  });

  it("should return 404 if client is not found", async () => {
    Client.findById = jest.fn().mockResolvedValue(null);

    const res = await request(app).get("/clients/0000");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toEqual("Client not found");
  });

  it("should return 500 if a database failure occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get("/clients/12345");

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toEqual("Error fetching client");
    expect(res.body.error).toBe("Database error");
  });
});

describe("GET /clients/:cliendId/financing", () => {
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
    initialInstallment: 2000,
    financedAmount: 5000,
    numberOfInstallments: 24,
    totalToPay: 10000,
    monthlyInterest: 5,
    lateInterest: 2,
    installments: [mockInstallment._id],
  };

  const mockDebtorClient = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    role: "debtor",
    financing: mockFinancing._id,
  };

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
  let mockReqId = "507f191e810c19729de860ea";
  let res, next, mockClient;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    mockClient = {
      personalInfo: {
        photo: "test.jpg",
      },
      populate: jest.fn().mockResolvedValue(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return personal info if client exists", async () => {
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app).get(`/clients/${mockReqId}/personalInfo`);

    expect(Client.findById).toHaveBeenCalledWith(mockReqId, "personalInfo");
    expect(mockClient.populate).toHaveBeenCalledWith("personalInfo");
    expect(res.status).toBe(200);
    expect(res.body.personalInfo.photo).toBe("test.jpg");
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    const res = await request(app).get(`/clients/${mockReqId}/personalInfo`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Client not found" });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get(`/clients/${mockReqId}/personalInfo`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Error fetching personal info",
      error: "Database error",
    });
  });
});

describe("POST /clients/:clientId/personalInfo/edit", () => {
  const mockPersonalInfo = {
    _id: new mongoose.Types.ObjectId(),
    photo: "profile.jpg",
    email: "test@example.com",
    phone: "310000",
    birthDate: new Date("2000-01-01"),
  };

  const mockDebtorClient = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    role: "debtor",
    personalInfo: mockPersonalInfo._id,
  };

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

describe("GET /clients/:clientId/geoInfo", () => {
  const clientId = "507f1f77bcf86cd799439011";
  let mockClient;

  beforeEach(() => {
    mockClient = {
      geoInfo: { location: "Medellín", coordinates: [6.2442, -75.5812] },
      populate: jest.fn().mockResolvedValue(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return geo info if client exists", async () => {
    Client.findById.mockResolvedValue(mockClient);

    const res = await request(app).get(`/clients/${clientId}/geoInfo`);

    expect(Client.findById).toHaveBeenCalledWith(clientId, "geoInfo");
    expect(mockClient.populate).toHaveBeenCalledWith("geoInfo");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ geoInfo: mockClient.geoInfo });
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    const res = await request(app).get(`/clients/${clientId}/geoInfo`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Client not found" });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    const res = await request(app).get(`/clients/${clientId}/geoInfo`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      message: "Error fetching geo info",
      error: "Database error",
    });
  });
});

describe("POST /clients/:clientId/geoInfo/edit", () => {
  const mockGeoInfo = {
    _id: new mongoose.Types.ObjectId(),
    address: "Clle 41",
    city: "Medellin",
    department: "Antioquia",
    neighbourhood: "Palmas",
    latitude: 10,
    longitude: 50,
  };

  const mockDebtorClient = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    role: "debtor",
    geoInfo: mockGeoInfo._id,
  };

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

  const mockDebtorClient = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    role: "debtor",
    commercialInfo: mockCommercialInfo._id,
    references: [mockRef1._id, mockRef2._id, mockRef3._id],
  };
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

  const mockDebtorClient = {
    _id: new mongoose.Types.ObjectId(),
    name: "Juan Test",
    role: "debtor",
    commercialInfo: mockCommercialInfo._id,
    references: [mockRef1._id, mockRef2._id, mockRef3._id],
  };

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

describe("GET /debtors-list/:managerId", () => {
  const managerId = "manager123";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return filtered debtors by search term (mocked chain)", async () => {
    const mockDebtors = [
      {
        _id: "debtor1",
        name: "John Doe",
        identification: { number: "123456" },
        financing: [{ status: "pending" }],
      },
    ];
    const mockPopulate = jest.fn().mockResolvedValue(mockDebtors);
    const mockWhere = jest.fn().mockReturnValue({ populate: mockPopulate });
    Debtor.find.mockReturnValue({ where: mockWhere });

    const res = await request(app).get(
      `/debtors-list/${managerId}?searchTerm=John`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("debtors");
    expect(res.body.debtors).toEqual(mockDebtors);
    expect(Debtor.find).toHaveBeenCalledWith(
      { name: { $regex: "John", $options: "i" } },
      "name identification.number financing"
    );
    expect(mockWhere).toHaveBeenCalledWith({ manager: managerId });
    expect(mockPopulate).toHaveBeenCalledWith({
      path: "financing",
      select: "status",
    });
  });

  it("should return filtered debtors by status (mocked Financing + Debtor)", async () => {
    const mockFinancings = [{ _id: "fin1" }, { _id: "fin2" }];
    const mockDebtors = [
      {
        _id: "debtor1",
        name: "Jane Smith",
        identification: { number: "654321" },
        financing: mockFinancings,
      },
    ];

    Financing.find = jest.fn().mockResolvedValue(mockFinancings);
    const mockPopulate = jest.fn().mockResolvedValue(mockDebtors);
    const mockWhere = jest.fn().mockReturnValue({ populate: mockPopulate });
    Debtor.find = jest.fn().mockReturnValue({ where: mockWhere });

    const res = await request(app).get(
      `/debtors-list/${managerId}?filter=AD,EM`
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.debtors).toEqual(mockDebtors);
    expect(Financing.find).toHaveBeenCalledWith({
      status: { $in: ["AD", "EM"] },
    });
  });

  it("should return all debtors by default (mocked chain)", async () => {
    const mockDebtors = [
      {
        _id: "debtor1",
        name: "Carlos Pérez",
        identification: { number: "789456" },
        financing: [{ status: "AD" }],
      },
    ];
    const mockPopulate = jest.fn().mockResolvedValue(mockDebtors);
    const mockWhere = jest.fn().mockReturnValue({ populate: mockPopulate });
    Debtor.find = jest.fn().mockReturnValue({ where: mockWhere });

    const res = await request(app).get(`/debtors-list/${managerId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("debtors");
    expect(res.body.debtors).toEqual(mockDebtors);
    expect(Debtor.find).toHaveBeenCalledWith(
      {},
      "name identification.number financing"
    );
    expect(mockWhere).toHaveBeenCalledWith({ manager: managerId });
    expect(mockPopulate).toHaveBeenCalledWith({
      path: "financing",
      select: "status",
    });
  });
});

describe("GET /all-debtors", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a list of debtors filtered by search term", async () => {
    const searchTerm = "John";
    const mockDebtors = [
      {
        _id: "debtor1",
        name: "John Doe",
        identification: { number: "123456" },
        manager: { _id: "manager1", name: "Manager A" },
      },
    ];
    Debtor.find.mockResolvedValue(mockDebtors);
    Debtor.populate.mockResolvedValue(mockDebtors);

    const res = await request(app).get(`/all-debtors?searchTerm=${searchTerm}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("debtors");
    expect(res.body.debtors).toEqual(mockDebtors);
    expect(Debtor.find).toHaveBeenCalledWith(
      { name: { $regex: searchTerm, $options: "i" } },
      "name identification.number manager"
    );
    expect(Debtor.populate).toHaveBeenCalledWith(mockDebtors, {
      path: "manager",
      select: "name",
    });
  });

  it("should return debtors filtered by identification number (numeric search)", async () => {
    const searchTerm = "123456";
    const mockDebtors = [
      {
        _id: "debtor2",
        name: "Jane Smith",
        identification: { number: "123456" },
        manager: { _id: "manager2", name: "Manager B" },
      },
    ];
    Debtor.find.mockResolvedValue(mockDebtors);
    Debtor.populate.mockResolvedValue(mockDebtors);

    const res = await request(app).get(`/all-debtors?searchTerm=${searchTerm}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.debtors).toEqual(mockDebtors);
    expect(Debtor.find).toHaveBeenCalledWith(
      { "identification.number": searchTerm },
      "name identification.number manager"
    );
    expect(Debtor.populate).toHaveBeenCalledWith(mockDebtors, {
      path: "manager",
      select: "name",
    });
  });

  it("should return 500 if an error occurs", async () => {
    const searchTerm = "errorTest";
    const errorMessage = "Database error";
    Debtor.find.mockRejectedValue(new Error(errorMessage));

    const res = await request(app).get(`/all-debtors?searchTerm=${searchTerm}`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Error fetching debtors");
    expect(res.body).toHaveProperty("error", errorMessage);
  });
});

describe("POST /assign-debtor", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should assign a debtor to a manager", async () => {
    const mockDebtor = {
      _id: "debtor123",
      name: "John Doe",
      identification: { number: "123456" },
      save: jest.fn().mockResolvedValue(true),
    };

    Debtor.findById.mockResolvedValue(mockDebtor);

    const res = await request(app)
      .post("/assign-debtor")
      .send({ clientId: "debtor123", managerId: "manager456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Debtor added to manager" });
    expect(Debtor.findById).toHaveBeenCalledWith("debtor123");
    expect(mockDebtor.manager).toBe("manager456");
    expect(mockDebtor.save).toHaveBeenCalled();
  });

  it("should return 404 if debtor is not found", async () => {
    Debtor.findById.mockResolvedValue(null);

    const res = await request(app)
      .post("/assign-debtor")
      .send({ clientId: "nonexistentId", managerId: "manager456" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Debtor not found" });
    expect(Debtor.findById).toHaveBeenCalledWith("nonexistentId");
  });

  it("should return 500 if there's a database error", async () => {
    Debtor.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/assign-debtor")
      .send({ clientId: "debtor123", managerId: "manager456" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Error assigning debtor");
    expect(res.body).toHaveProperty("error", "DB error");
  });
});

describe("POST /remove-debtor", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should remove debtor from manager", async () => {
    const mockDebtor = {
      _id: "debtor123",
      name: "Jane Doe",
      manager: "manager456",
      save: jest.fn().mockResolvedValue(true),
    };

    Debtor.findById.mockResolvedValue(mockDebtor);

    const res = await request(app)
      .post("/remove-debtor")
      .send({ clientId: "debtor123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Debtor removed from manager" });
    expect(Debtor.findById).toHaveBeenCalledWith("debtor123");
    expect(mockDebtor.manager).toBe(null);
    expect(mockDebtor.save).toHaveBeenCalled();
  });

  it("should return 404 if debtor not found", async () => {
    Debtor.findById.mockResolvedValue(null);

    const res = await request(app)
      .post("/remove-debtor")
      .send({ clientId: "nonexistentId" });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ message: "Debtor not found" });
  });

  it("should return 500 if database throws error", async () => {
    Debtor.findById.mockRejectedValue(new Error("DB error"));

    const res = await request(app)
      .post("/remove-debtor")
      .send({ clientId: "debtor123" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Error removing debtor");
    expect(res.body).toHaveProperty("error", "DB error");
  });
});

describe("GET /debtors-list-report", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return list of delinquent debtors for 30-day range", async () => {
    const mockInstallments = [
      {
        installmentPaid: false,
        dueDate: "2024-01-01",
        overdueDays: 45,
        installmentValue: 1000,
        lateInterests: 50,
        totalInstallmentValue: 1050,
      },
    ];

    const mockDebtors = [
      {
        identification: { number: "123456789" },
        name: "John Doe",
        financing: {
          installments: mockInstallments,
          status: "EM",
        },
        manager: { name: "Jane Manager" },
      },
    ];

    Debtor.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockDebtors),
    });

    const res = await request(app)
      .get("/debtors-list-report")
      .query({ reportType: "delinquency-report", days: "30" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      {
        debtorId: "123456789",
        debtorName: "John Doe",
        installmentValue: 1000,
        overdueDays: 45,
        lateInterests: 50,
        totalInstallmentValue: 1050,
        financingStatus: "En mora",
        manager: "Jane Manager",
      },
    ]);
  });

  it("should return 400 for invalid days parameter", async () => {
    const res = await request(app)
      .get("/debtors-list-report")
      .query({ reportType: "delinquency-report", days: "15" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ message: "Invalid 'days' parameter" });
  });

  it("should return 400 for invalid reportType", async () => {
    const res = await request(app)
      .get("/debtors-list-report")
      .query({ reportType: "invalid-type", days: "30" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid report type" });
  });

  it("should return 500 if DB error occurs", async () => {
    Debtor.find.mockReturnValue({
      populate: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    const res = await request(app)
      .get("/debtors-list-report")
      .query({ reportType: "delinquency-report", days: "30" });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("message", "Error fetching debtors");
    expect(res.body).toHaveProperty("error", "Database error");
  });
});
