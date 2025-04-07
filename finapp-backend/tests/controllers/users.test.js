let usersController = require("../../controllers/users");
const { User, Manager, Assistant } = require("../../models/user");
const bcrypt = require("bcryptjs");

jest.mock("../../models/user", () => ({
  User: {
    find: jest.fn(),
  },
  Manager: {
    find: jest.fn(),
  },
  Assistant: {
    find: jest.fn(),
  },
}));

describe("GET /users/all", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call getUsersBySearchTerm if searchTerm is provided", async () => {
    req.query.searchTerm = "test";
    const spy = jest
      .spyOn(usersController, "getUsersBySearchTerm")
      .mockImplementation(() => {});
    await usersController.getAllUsers(req, res, next);

    expect(spy).toHaveBeenCalledWith(req, res, next);
    spy.mockRestore();
  });

  it("should return managers and assistants if no searchTerm is provided", async () => {
    const mockManagers = [{ id: 1, name: "Manager 1" }];
    const mockAssistants = [{ id: 1, name: "Assistant 1" }];
    Manager.find.mockResolvedValue(mockManagers);
    Assistant.find.mockResolvedValue(mockAssistants);

    await usersController.getAllUsers(req, res, next);

    expect(Manager.find).toHaveBeenCalled();
    expect(Assistant.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      managers: mockManagers,
      assistants: mockAssistants,
    });
  });

  it("should return 500 if an error occurs", async () => {
    Manager.find.mockRejectedValue(new Error("Database error"));

    await usersController.getAllUsers(req, res, next);

    expect(Manager.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("GET uers by search term", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return managers and assistants matching the searchTerm", async () => {
    req.query.searchTerm = "test";
    const query = { name: { $regex: "test", $options: "i" } };
    const mockManagers = [{ id: 1, name: "Test Manager" }];
    const mockAssistants = [{ id: 2, name: "Test Assistant" }];
    Manager.find.mockResolvedValue(mockManagers);
    Assistant.find.mockResolvedValue(mockAssistants);

    await usersController.getUsersBySearchTerm(req, res, next);

    expect(Manager.find).toHaveBeenCalledWith(query);
    expect(Assistant.find).toHaveBeenCalledWith(query);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      managers: mockManagers,
      assistants: mockAssistants,
    });
  });

  it("should return 500 if an error occurs while searching managers", async () => {
    req.query.searchTerm = "test";
    const query = { name: { $regex: "test", $options: "i" } };

    Manager.find.mockRejectedValue(new Error("Database error"));

    await usersController.getUsersBySearchTerm(req, res, next);

    expect(Manager.find).toHaveBeenCalledWith(query);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });

  it("should return 500 if an error occurs while searching assistants", async () => {
    req.query.searchTerm = "test";
    const query = { name: { $regex: "test", $options: "i" } };

    Manager.find.mockResolvedValue([{ id: 1, name: "Test Manager" }]);
    Assistant.find.mockRejectedValue(new Error("Database error"));

    await usersController.getUsersBySearchTerm(req, res, next);

    expect(Manager.find).toHaveBeenCalledWith(query);
    expect(Assistant.find).toHaveBeenCalledWith(query);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("GET /users", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return the user if this is found", async () => {
    const mockUser = { id: 1, name: "Test User" };
    req.query.userId = "1";
    User.findById = jest.fn().mockResolvedValue(mockUser);

    await usersController.getUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: mockUser });
  });

  it("should return 404 if the user is not found", async () => {
    req.query.userId = "1";

    User.findById = jest.fn().mockResolvedValue(null);

    await usersController.getUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
  });

  it("should return 500 if an error occurs", async () => {
    req.query.userId = "1";

    User.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await usersController.getUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("PUT /user-update", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should update the user if this is found", async () => {
    const mockUser = {
      id: 1,
      email: "old@test.com",
      phone: "123456789",
      save: jest.fn().mockResolvedValue(),
    };
    req.body = {
      userId: "1",
      email: "new@test.com",
      phone: "987654321",
    };
    User.findById = jest.fn().mockResolvedValue(mockUser);

    await usersController.updateUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(mockUser.email).toBe("new@test.com");
    expect(mockUser.phone).toBe("987654321");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "User updated successfully!",
    });
  });

  it("should return 404 if the user is not found", async () => {
    req.body = {
      userId: "1",
      email: "new@test.com",
      phone: "987654321",
    };
    User.findById = jest.fn().mockResolvedValue(null);

    await usersController.updateUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 if an error occurs", async () => {
    req.body = {
      userId: "1",
      email: "new@test.com",
      phone: "987654321",
    };
    User.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await usersController.updateUser(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("POST /check-passwor", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return true if the password matches", async () => {
    const mockUser = { id: 1, password: "hashedPassword" };
    req.body = {
      userId: "1",
      oldPassword: "plainPassword",
    };
    User.findById = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    await usersController.checkPassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "plainPassword",
      "hashedPassword"
    );
    expect(res.json).toHaveBeenCalledWith(true);
  });

  it("should return false if the password does not match", async () => {
    const mockUser = { id: 1, password: "hashedPassword" };
    req.body = {
      userId: "1",
      oldPassword: "wrongPassword",
    };
    User.findById = jest.fn().mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await usersController.checkPassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "wrongPassword",
      "hashedPassword"
    );
    expect(res.json).toHaveBeenCalledWith(false);
  });

  it("should return 404 if the user is not found", async () => {
    req.body = {
      userId: "1",
      oldPassword: "plainPassword",
    };
    User.findById = jest.fn().mockResolvedValue(null);

    await usersController.checkPassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 if an error occurs", async () => {
    req.body = {
      userId: "1",
      oldPassword: "plainPassword",
    };
    User.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await usersController.checkPassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("POST /change-password", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should change the password if the user is found", async () => {
    const mockUser = {
      id: 1,
      password: "oldHashedPassword",
      save: jest.fn().mockResolvedValue(),
    };
    req.body = {
      userId: "1",
      newPassword: "newPlainPassword",
    };
    User.findById = jest.fn().mockResolvedValue(mockUser);
    bcrypt.hashSync = jest.fn().mockReturnValue("newHashedPassword");

    await usersController.changePassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(bcrypt.hashSync).toHaveBeenCalledWith("newPlainPassword");
    expect(mockUser.password).toBe("newHashedPassword");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Password changed successfully",
    });
  });

  it("should return 404 if the user is not found", async () => {
    req.body = {
      userId: "1",
      newPassword: "newPlainPassword",
    };
    User.findById = jest.fn().mockResolvedValue(null);

    await usersController.changePassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 if an error occurs", async () => {
    req.body = {
      userId: "1",
      newPassword: "newPlainPassword",
    };
    User.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await usersController.changePassword(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("POST /change-lang", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should change the language if the user is found", async () => {
    const mockUser = {
      id: 1,
      language: "es",
      save: jest.fn().mockResolvedValue(),
    };
    req.body = {
      userId: "1",
      newLang: "en",
    };
    User.findById = jest.fn().mockResolvedValue(mockUser);

    await usersController.changeLang(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(mockUser.language).toBe("en");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Language changed successfully",
    });
  });

  it("should return 404 if the user is not found", async () => {
    req.body = {
      userId: "1",
      newLang: "en",
    };
    User.findById = jest.fn().mockResolvedValue(null);

    await usersController.changeLang(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 if an error occurs", async () => {
    req.body = {
      userId: "1",
      newLang: "en",
    };
    User.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await usersController.changeLang(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("1");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});
