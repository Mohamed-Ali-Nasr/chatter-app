"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_1 = require("envalid/dist/validators");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MONGO_CONNECTION_STRING: (0, validators_1.str)(),
    PORT: (0, validators_1.port)(),
    FRONT_END_URL: (0, validators_1.str)(),
    ACCESS_TOKEN: (0, validators_1.str)(),
    REFRESH_TOKEN: (0, validators_1.str)(),
});
