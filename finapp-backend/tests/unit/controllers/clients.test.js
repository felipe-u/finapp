const mongoose = require("mongoose");
const { Client } = require("../../../models/client");
const Reference = require("../../../models/reference");
let clientsController = require("../../../controllers/clients");

jest.mock("../../../models/client");
jest.mock("../../../models/financing");
jest.mock("../../../models/installment");
jest.mock("../../../models/reference");

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

describe("get client", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a client if the ID is valid", async () => {
    req.params.clientId = "123456";
    const mockClient = {
      _id: "123456",
      name: "Juan Pérez",
    };
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.getClient(req, res, next);

    expect(Client.findById).toHaveBeenCalledWith("123456");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ client: mockClient });
  });

  it("should return 404 if client is not found", async () => {
    req.params.clientId = "123456";
    Client.findById.mockResolvedValue(null);

    await clientsController.getClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Client not found" });
  });

  it("should return 500 if a database failure occurs", async () => {
    req.params.clientId = "123456";
    Client.findById.mockRejectedValue(new Error("Database error"));

    await clientsController.getClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching client",
      error: "Database error",
    });
  });
});

describe("get client financing", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {
        clientId: "123456",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return client financing if client exists", async () => {
    const mockFinancing = [{ _id: "f1", motorcycle: {}, installments: [] }];
    const mockClient = {
      financing: mockFinancing,
      populate: jest.fn().mockResolvedValue(),
    };
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.getClientFinancing(req, res, next);

    expect(Client.findById).toHaveBeenCalledWith("123456", "financing");
    expect(mockClient.populate).toHaveBeenCalledWith({
      path: "financing",
      populate: [{ path: "motorcycle" }, { path: "installments" }],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ financing: mockFinancing });
  });

  it("should return 404 if client is not found", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.getClientFinancing(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Client not found" });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    await clientsController.getClientFinancing(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching financing",
      error: "Database error",
    });
  });
});

describe("get client personal info", () => {
  const mockClientId = "507f191e810c19729de860ea";
  let req, res, next, mockClient;

  beforeEach(() => {
    req = { params: { clientId: mockClientId } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    next = jest.fn();

    mockClient = {
      personalInfo: { phone: "3101010", photo: "test.jpg" },
      populate: jest.fn().mockResolvedValue(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return personal info if client exists", async () => {
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.getClientPersonalInfo(req, res, next);

    expect(Client.findById).toHaveBeenCalledWith(mockClientId, "personalInfo");
    expect(mockClient.populate).toHaveBeenCalledWith("personalInfo");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      personalInfo: mockClient.personalInfo,
    });
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.getClientPersonalInfo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Client not found" });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    await clientsController.getClientPersonalInfo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching personal info",
      error: "Database error",
    });
  });
});

describe("edit client personal info", () => {
  const mockClientId = "507f1f77bcf86cd799439011";
  const mockReqBody = {
    newIdNumber: "123456789",
    newPersonalInfo: {
      address: "Avenida testing",
      phone: "3202020",
    },
  };
  let req, res, next, mockClient, mockPersonalInfo;

  beforeEach(() => {
    req = {
      params: { clientId: mockClientId },
      body: mockReqBody,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    mockPersonalInfo = {
      address: "Calle testing",
      phone: "3101010",
      save: jest.fn().mockResolvedValue(),
    };

    mockClient = {
      identification: { number: "0000000" },
      personalInfo: mockPersonalInfo,
      populate: jest.fn().mockResolvedValue(),
      save: jest.fn().mockResolvedValue(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should uptade personal info if client exists", async () => {
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.editClientPersonalInfo(req, res, next);

    expect(Client.findById).toHaveBeenCalledWith(mockClientId);
    expect(mockClient.populate).toHaveBeenCalledWith("personalInfo");
    expect(mockClient.identification.number).toBe(mockReqBody.newIdNumber);
    expect(mockPersonalInfo.address).toBe(mockReqBody.newPersonalInfo.address);
    expect(mockPersonalInfo.phone).toBe(mockReqBody.newPersonalInfo.phone);
    expect(mockPersonalInfo.save).toHaveBeenCalled();
    expect(mockClient.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Client personal info updated",
    });
  });

  it("should return 404 if client is not found", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.editClientPersonalInfo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Client not found" });
  });

  it("should return 404 if personal info is not found", async () => {
    mockClient.personalInfo = null;
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.editClientPersonalInfo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Personal info not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    await clientsController.editClientPersonalInfo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error updating personal info",
      error: "Database error",
    });
  });
});

describe("get client geographic info", () => {
  const mockClientId = "507f1f77bcf86cd799439011";
  let req, res, next, mockClient;

  beforeEach(() => {
    req = {
      params: { clientId: mockClientId },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      headersSent: false,
    };
    next = jest.fn();

    mockClient = {
      geoInfo: { location: "Bogotá", coords: [4.711, -74.0721] },
      populate: jest.fn().mockResolvedValue(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return geo info if client exists", async () => {
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.getClientGeoInfo(req, res, next);

    expect(Client.findById).toHaveBeenCalledWith(mockClientId, "geoInfo");
    expect(mockClient.populate).toHaveBeenCalledWith("geoInfo");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ geoInfo: mockClient.geoInfo });
  });

  it("should return 404 if client does not exist", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.getClientGeoInfo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Client not found" });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    await clientsController.getClientGeoInfo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching geo info",
      error: "Database error",
    });
  });
});

describe("edit client geo info", () => {
  const mockReq = {
    params: { clientId: "123456" },
    body: {
      updatedGeoInfo: {
        location: "New City",
        coordinates: [10.1234, -74.5678],
      },
    },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update and return geo info successfully", async () => {
    const mockGeoInfo = {
      location: "Old City",
      coordinates: [0, 0],
      save: jest.fn().mockResolvedValue(),
    };

    const mockClient = {
      geoInfo: mockGeoInfo,
      populate: jest.fn().mockResolvedValue(),
      save: jest.fn().mockResolvedValue(),
    };

    Client.findById.mockResolvedValue(mockClient);

    await clientsController.editClientGeoInfo(mockReq, mockRes);

    expect(Client.findById).toHaveBeenCalledWith("123456");
    expect(mockClient.populate).toHaveBeenCalledWith("geoInfo");
    expect(mockGeoInfo.save).toHaveBeenCalled();
    expect(mockClient.save).toHaveBeenCalled();
    expect(mockGeoInfo).toMatchObject(mockReq.body.updatedGeoInfo);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Client geo info updated",
    });
  });

  it("should return 404 if client is not found", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.editClientGeoInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Client not found",
    });
  });

  it("should return 404 if geo info is not found", async () => {
    const mockClient = {
      geoInfo: null,
      populate: jest.fn().mockResolvedValue(),
      save: jest.fn(),
    };

    Client.findById.mockResolvedValue(mockClient);

    await clientsController.editClientGeoInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Geo info not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    await clientsController.editClientGeoInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error updating geo info",
      error: "Database error",
    });
  });
});

describe("get client commercial info", () => {
  const mockReq = {
    params: { clientId: "client123" },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return references and commercialInfo", async () => {
    const mockClient = {
      references: [{ name: "Ref 1" }],
      commercialInfo: { company: "Company A" },
      populate: jest.fn().mockResolvedValue(),
    };
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.getClientCommercialInfo(mockReq, mockRes);

    expect(Client.findById).toHaveBeenCalledWith(
      "client123",
      "references commercialInfo"
    );
    expect(mockClient.populate).toHaveBeenCalledWith("references");
    expect(mockClient.populate).toHaveBeenCalledWith("commercialInfo");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      references: mockClient.references,
      commercialInfo: mockClient.commercialInfo,
    });
  });

  it("should return 404 if client is not found", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.getClientCommercialInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Client not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Something went wrong"));

    await clientsController.getClientCommercialInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error fetching commercial info",
      error: "Something went wrong",
    });
  });
});

describe("edit client commercial info", () => {
  const mockReq = {
    params: { clientId: "client123" },
    body: {
      newCommercialInfo: { company: "Updated Company" },
      newReferences: [
        { _id: "ref1", name: "Updated Ref 1" },
        { _id: "ref2", name: "Updated Ref 2" },
      ],
    },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update commercial info and references successfully", async () => {
    const mockClient = {
      commercialInfo: { company: "Old Company", save: jest.fn() },
      references: [{ _id: "ref1" }, { _id: "ref2" }],
      populate: jest.fn().mockResolvedValue(),
      save: jest.fn(),
    };

    const mockReference1 = {
      _id: "ref1",
      identification: {},
      save: jest.fn(),
    };

    const mockReference2 = {
      _id: "ref2",
      identification: {},
      save: jest.fn(),
    };
    Client.findById.mockResolvedValue(mockClient);
    Reference.findById
      .mockResolvedValueOnce(mockReference1)
      .mockResolvedValueOnce(mockReference2);

    await clientsController.editClientCommercialInfo(mockReq, mockRes);

    expect(Client.findById).toHaveBeenCalledWith("client123");
    expect(mockClient.populate).toHaveBeenCalledWith(
      "commercialInfo references"
    );
    expect(mockClient.commercialInfo.company).toBe("Updated Company");
    expect(mockReference1.name).toBe("Updated Ref 1");
    expect(mockReference1.identification.idType).toBe("CC");
    expect(mockReference1.identification.number).toBe("111");
    expect(mockReference2.name).toBe("Updated Ref 2");
    expect(mockReference2.identification.idType).toBe("CC");
    expect(mockReference2.identification.number).toBe("111");
    expect(mockReference1.save).toHaveBeenCalled();
    expect(mockReference2.save).toHaveBeenCalled();
    expect(mockClient.commercialInfo.save).toHaveBeenCalled();
    expect(mockClient.save).toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Client commercial info updated",
    });
  });

  it("should return 404 if client is not found", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.editClientCommercialInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Client not found",
    });
  });

  it("should return 404 if commercialInfo or references are missing", async () => {
    const mockClient = {
      commercialInfo: null,
      references: null,
      populate: jest.fn().mockResolvedValue(),
    };
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.editClientCommercialInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Commercial info or references not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Unexpected error"));

    await clientsController.editClientCommercialInfo(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error updating commercial info",
      error: "Unexpected error",
    });
  });
});

describe("get client name", () => {
  const mockReq = {
    params: { clientId: "client123" },
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the client's name if found", async () => {
    const mockClient = { name: "John Doe" };
    Client.findById.mockResolvedValue(mockClient);

    await clientsController.getClientName(mockReq, mockRes);

    expect(Client.findById).toHaveBeenCalledWith("client123", "name");
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ name: "John Doe" });
  });

  it("should return 404 if client is not found", async () => {
    Client.findById.mockResolvedValue(null);

    await clientsController.getClientName(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Client not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    Client.findById.mockRejectedValue(new Error("Database error"));

    await clientsController.getClientName(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Error fetching name",
      error: "Database error",
    });
  });
});

describe("GET debtors list by manager id", () => {
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
    clientsController = require("../../../controllers/clients");
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
    clientsController = require("../../../controllers/clients");
    req = {
      query: { filter: "AD" },
      params: { managerId: "12345" },
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    mockFinancingModel = require("../../../models/financing");

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
    jest.mock("../../../models/client", () => {
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
    ({ Debtor } = require("../../../models/client"));
    clientsController = require("../../../controllers/clients");
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
    jest.mock("../../../models/client", () => ({
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
    ({ Debtor } = require("../../../models/client"));
    clientsController = require("../../../controllers/clients");
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
    jest.mock("../../../models/client", () => ({
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
    ({ Debtor } = require("../../../models/client"));
    clientsController = require("../../../controllers/clients");
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
    jest.mock("../../../models/client", () => ({
      Debtor: {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockDebtor1, mockDebtor2]),
      },
    }));
    ({ Debtor } = require("../../../models/client"));
    clientsController = require("../../../controllers/clients");

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
    jest.mock("../../../models/client", () => ({
      Debtor: {
        find: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([mockDebtor1, mockDebtor2]),
      },
    }));
    ({ Debtor } = require("../../../models/client"));
    clientsController = require("../../../controllers/clients");
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
