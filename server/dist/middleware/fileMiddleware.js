"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const imagesPath = path_1.default.join(__dirname, "../public/images");
        fs_extra_1.default.mkdirsSync(imagesPath);
        cb(null, imagesPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        cb(null, true);
    }
    else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg and .jpeg format are allowed!"));
    }
};
exports.upload = (0, multer_1.default)({ storage, fileFilter });
