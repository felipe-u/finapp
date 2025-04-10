const path = require("path");
const upload = require("../../../middleware/upload");

describe("upload middleware", () => {
  describe("fileFilter", () => {
    const fileFilter = upload._fileFilter;

    test("should accept image files", () => {
      const req = {};
      const file = { mimetype: "image/jpeg" };
      const cb = jest.fn();

      fileFilter(req, file, cb);

      expect(cb).toHaveBeenCalledWith(null, true);
    });

    test("should reject non-image files", () => {
      const req = {};
      const file = { mimetype: "application/pdf" };
      const cb = jest.fn();

      fileFilter(req, file, cb);

      expect(cb).toHaveBeenCalledWith(expect.any(Error), false);
      expect(cb.mock.calls[0][0].message).toBe("File type not allowed");
    });
  });

  describe("filename generator", () => {
    const filename = upload._filename;

    test("should generate a filename with the correct extension", () => {
      const req = {};
      const file = { originalname: "photo.png" };
      const cb = jest.fn();

      filename(req, file, cb);

      const generatedName = cb.mock.calls[0][1];
      expect(generatedName.endsWith(".png")).toBe(true);
      expect(Number.isNaN(Number(generatedName.split(".")[0]))).toBe(false);
    });
  });
});
