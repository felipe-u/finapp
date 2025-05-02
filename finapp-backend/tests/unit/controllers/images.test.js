const imagesController = require("../../../controllers/images");
const PersonalInfo = require("../../../models/personalInfo");
const { User } = require("../../../models/user");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../../../config/cloudinary");
require("dotenv").config();

const BASE_URL = process.env.BASE_URL;

jest.mock("../../../config/cloudinary", () => ({
  uploader: {
    destroy: jest.fn(),
  },
}));

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
    req.file = { path: "https://res.cloudinary.com/fakeurl.jpg" };

    await imagesController.uploadImage(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      imageUrl: "https://res.cloudinary.com/fakeurl.jpg",
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
    jest.clearAllMocks();
  });

  it("should delete image successfully", async () => {
    req.query.imageUrl =
      "https://res.cloudinary.com/demo/image/upload/v123/images/testimage.jpg";
    cloudinary.uploader.destroy.mockResolvedValue({ result: "ok" });

    await imagesController.deleteImage(req, res, next);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
      "images/testimage"
    );
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

  it("should return 500 if cloudinary destroy fails", async () => {
    req.query.imageUrl =
      "https://res.cloudinary.com/demo/image/upload/v123/images/errorimage.jpg";
    cloudinary.uploader.destroy.mockRejectedValue(
      new Error("Cloudinary error")
    );

    await imagesController.deleteImage(req, res, next);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
      "images/errorimage"
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to delete image",
      error: "Cloudinary error",
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
    cloudinary.uploader.destroy.mockReset();
  });

  it("should delete all images successfully", async () => {
    req.body.images = [
      "https://res.cloudinary.com/demo/image/upload/v123/images/image1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v123/images/image2.jpg",
    ];
    cloudinary.uploader.destroy
      .mockResolvedValueOnce({ result: "ok" })
      .mockResolvedValueOnce({ result: "ok" });

    await imagesController.deleteImages(req, res, next);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(2);
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

  it("should return 500 if some images fail to delete", async () => {
    req.body.images = [
      "https://res.cloudinary.com/demo/image/upload/v123/images/image1.jpg",
      "https://res.cloudinary.com/demo/image/upload/v123/images/image2.jpg",
    ];
    cloudinary.uploader.destroy
      .mockResolvedValueOnce({ result: "ok" })
      .mockRejectedValueOnce(new Error("Deletion failed"));

    await imagesController.deleteImages(req, res, next);

    expect(cloudinary.uploader.destroy).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Some images could not be deleted",
      errors: [
        "Failed to delete https://res.cloudinary.com/demo/image/upload/v123/images/image2.jpg",
      ],
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
