import path from "path";
import crypto from "crypto";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const nomeUnico = crypto.randomBytes(16).toString("hex");
    cb(null, `${nomeUnico}${path.extname(file.originalname)}`);
  },
});

export const uploadImagem = multer({ storage });
