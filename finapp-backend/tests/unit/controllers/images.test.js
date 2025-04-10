const imagesController = require("../../../controllers/images");
const PersonalInfo = require("../../../models/personalInfo");
const { User } = require("../../../models/user");
const fs = require("fs");
const path = require("path");

describe("POST /upload", () => {
  let req, res, next;

  beforeEach(() => {
    req = { file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 201 and the image URL if a file is provided", async () => {
    req.file = { filename: "test-image.jpg" };

    await imagesController.uploadImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      imageUrl: "http://localhost:3000/uploads/test-image.jpg",
    });
  });

  it("should return 400 if no file is provided", async () => {
    await imagesController.uploadImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No file provided" });
  });

  it("should return 500 if an error occurs", async () => {
    Object.defineProperty(req, "file", {
      get: () => {
        throw new Error("Mocked error");
      },
    });

    await imagesController.uploadImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error uploading image",
      error: "Mocked error",
    });
  });
});

describe("PUT /imgs/personal-info", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should update client photo successfully", async () => {
    const mockPersonalInfo = {
      id: 111,
      photo: "test.jpg",
      save: jest.fn().mockResolvedValue(),
    };
    req.body = {
      modelId: "111",
      imageUrl: "newPhoto.jpg",
    };
    PersonalInfo.findById = jest.fn().mockResolvedValue(mockPersonalInfo);

    await imagesController.updateClientPhoto(req, res, next);

    expect(PersonalInfo.findById).toHaveBeenCalledWith("111");
    expect(mockPersonalInfo.photo).toBe("newPhoto.jpg");
    expect(mockPersonalInfo.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Photo updated successfully",
    });
  });

  it("should return 404 if personal info is not found", async () => {
    req.body = {
      modelId: "111",
      imageUrl: "newPhoto.jpg",
    };
    PersonalInfo.findById = jest.fn().mockResolvedValue(null);

    await imagesController.updateClientPhoto(req, res, next);

    expect(PersonalInfo.findById).toHaveBeenCalledWith("111");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Personal Info not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    req.body = {
      modelId: "111",
      imageUrl: "newPhoto.jpg",
    };
    PersonalInfo.findById = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await imagesController.updateClientPhoto(req, res, next);

    expect(PersonalInfo.findById).toHaveBeenCalledWith("111");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("PUT /imgs/user", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should update user photo successfully", async () => {
    const mockUser = {
      id: 222,
      photo: "test.jpg",
      save: jest.fn().mockResolvedValue(),
    };
    req.body = {
      modelId: "222",
      imageUrl: "newPhoto.jpg",
    };
    User.findById = jest.fn().mockResolvedValue(mockUser);

    await imagesController.updateUserPhoto(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("222");
    expect(mockUser.photo).toBe("newPhoto.jpg");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Photo updated successfully",
    });
  });

  it("should return 404 if user is not found", async () => {
    req.body = {
      modelId: "222",
      imageUrl: "newPhoto.jpg",
    };
    User.findById = jest.fn().mockResolvedValue(null);

    await imagesController.updateUserPhoto(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("222");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "User not found",
    });
  });

  it("should return 500 if an error occurs", async () => {
    req.body = {
      modelId: "222",
      imageUrl: "newPhoto.jpg",
    };
    User.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await imagesController.updateUserPhoto(req, res, next);

    expect(User.findById).toHaveBeenCalledWith("222");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: "Database error",
    });
  });
});

describe("DELETE /delete-image", () => {
  let req, res, next;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should delete image successfully", async () => {
    req.query.imageUrl = "http://localhost:3000/uploads/test.jpg";
    const mockPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "test.jpg"
    );
    fs.promises.access = jest.fn().mockResolvedValue();
    fs.promises.unlink = jest.fn().mockResolvedValue();

    await imagesController.deleteImage(req, res, next);

    expect(fs.promises.access).toHaveBeenCalledWith(
      mockPath,
      fs.constants.F_OK
    );
    expect(fs.promises.unlink).toHaveBeenCalledWith(mockPath);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Image deleted successfully",
    });
  });

  it("should return 400 if no imageUrl is provided", async () => {
    await imagesController.deleteImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "No image URL provided" });
  });

  it("should return 404 if the image does not exist", async () => {
    req.query.imageUrl = "http://localhost:3000/uploads/missing.jpg";
    const mockPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "uploads",
      "missing.jpg"
    );
    const error = new Error("Not found");
    error.code = "ENOENT";
    fs.promises.access = jest.fn().mockRejectedValue(error);

    await imagesController.deleteImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Image not found",
      error: "Not found",
    });
  });

  it("should return 500 if another error occurs", async () => {
    req.query.imageUrl = "http://localhost:3000/uploads/error.jpg";
    const mockPath = path.join(__dirname, "..", "..", "uploads", "error.jpg");
    const error = new Error("Unexpected error");
    fs.promises.access = jest.fn().mockResolvedValue();
    fs.promises.unlink = jest.fn().mockRejectedValue(error);

    await imagesController.deleteImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to delete image",
      error: "Unexpected error",
    });
  });
});

describe("POST /delete-images", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should delete all images successfully", async () => {
    req.body.images = [
      "http://localhost:3000/uploads/image1.jpg",
      "http://localhost:3000/uploads/image2.jpg",
    ];
    fs.promises.access = jest.fn().mockResolvedValue();
    fs.promises.unlink = jest.fn().mockResolvedValue();

    await imagesController.deleteImages(req, res, next);

    for (const url of req.body.images) {
      const imageName = path.basename(url);
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        imageName
      );

      expect(fs.promises.access).toHaveBeenCalledWith(
        imagePath,
        fs.constants.F_OK
      );
      expect(fs.promises.unlink).toHaveBeenCalledWith(imagePath);
    }
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Images deleted successfully",
    });
  });

  it("should return 400 if no valid image URLs are provided", async () => {
    req.body.images = [];

    await imagesController.deleteImages(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "No valid image URLs provided",
    });
  });

  it("should return 500 if some images do not exist", async () => {
    req.body.images = [
      "http://localhost:3000/uploads/image1.jpg",
      "http://localhost:3000/uploads/missing.jpg",
    ];
    const errorENOENT = new Error("Not found");
    errorENOENT.code = "ENOENT";
    fs.promises.access = jest
      .fn()
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(errorENOENT);
    fs.promises.unlink = jest.fn().mockResolvedValue();

    await imagesController.deleteImages(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Some images could not be deleted",
      errors: ["Image not found: http://localhost:3000/uploads/missing.jpg"],
    });
  });

  it("should return 500 if some images fail with unknown error", async () => {
    req.body.images = [
      "http://localhost:3000/uploads/image1.jpg",
      "http://localhost:3000/uploads/image2.jpg",
    ];
    const unknownError = new Error("Permission denied");
    fs.promises.access = jest.fn().mockResolvedValue();
    fs.promises.unlink = jest
      .fn()
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(unknownError);

    await imagesController.deleteImages(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Some images could not be deleted",
      errors: ["Failed to delete: http://localhost:3000/uploads/image2.jpg"],
    });
  });

  it("should return 500 if server fails unexpectedly", async () => {
    req.body = null;

    await imagesController.deleteImages(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Server error",
      error: expect.any(String),
    });
  });
});
