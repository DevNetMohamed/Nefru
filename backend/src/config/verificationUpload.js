import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verificationUploadDir = path.resolve(
  __dirname,
  "..",
  "..",
  "private-uploads",
  "guide-verification",
);

fs.mkdirSync(verificationUploadDir, { recursive: true });

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, verificationUploadDir);
  },
  filename(req, file, callback) {
    const extensionByMimeType = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "application/pdf": ".pdf",
    };

    callback(
      null,
      `${crypto.randomUUID()}${extensionByMimeType[file.mimetype] || ""}`,
    );
  },
});

function fileFilter(req, file, callback) {
  if (!allowedMimeTypes.has(file.mimetype)) {
    const error = new Error("Only JPEG, PNG, and PDF documents are allowed");
    error.statusCode = 400;
    callback(error, false);
    return;
  }

  callback(null, true);
}

export const verificationUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export function resolveVerificationFile(storageKey) {
  const safeName = path.basename(storageKey);
  return path.join(verificationUploadDir, safeName);
}

export async function isValidVerificationFile(file) {
  const handle = await fs.promises.open(file.path, "r");

  try {
    const buffer = Buffer.alloc(8);
    await handle.read(buffer, 0, buffer.length, 0);

    if (file.mimetype === "application/pdf") {
      return buffer.subarray(0, 5).toString("ascii") === "%PDF-";
    }

    if (file.mimetype === "image/png") {
      return buffer.equals(
        Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
      );
    }

    if (file.mimetype === "image/jpeg") {
      return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    return false;
  } finally {
    await handle.close();
  }
}
