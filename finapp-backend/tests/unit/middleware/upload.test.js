const request = require("supertest");
const app = require("../../../app");

jest.mock("../../../config/cloudinary", () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: "https://res.cloudinary.com/fakeurl.jpg",
      public_id: "images/fakepublicid",
    }),
    destroy: jest.fn().mockResolvedValue({ result: "ok" }),
  },
}));

jest.mock("multer-storage-cloudinary", () => ({
  CloudinaryStorage: jest.fn().mockImplementation(() => ({})),
}));

describe("POST /upload", () => {
  beforeEach(() => {
    jest.resetModules();

    jest.doMock("multer", () => {
      return jest.fn(() => ({
        single: () => (req, res, next) => {
          req.file = { path: "https://res.cloudinary.com/fakeurl.jpg" };
          next();
        },
      }));
    });
  });

  it("should upload an image and return its file info", async () => {
    const res = await request(require("../../../app"))
      .post("/upload")
      .attach("image", Buffer.from("fake image content"), "test.jpg");

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("imageUrl");
    expect(typeof res.body.imageUrl).toBe("string");
  });

  it("should return 400 if no image is provided", async () => {
    jest.doMock("multer", () => {
      return jest.fn(() => ({
        single: () => (req, res, next) => {
          req.file = undefined;
          next();
        },
      }));
    });

    const res = await request(require("../../../app")).post("/upload");

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("No file provided");
  });
});
