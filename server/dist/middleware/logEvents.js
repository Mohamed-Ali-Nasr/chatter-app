"use strict";
// import { format } from "date-fns";
// import { v4 as uuid } from "uuid";
// import fs from "fs";
// import path, { dirname } from "path";
// import { fileURLToPath } from "url";
// import { NextFunction, Request, Response } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const fsPromises = fs.promises;
// export const logEvents = async (message: string, logName: string) => {
//   const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
//   const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
//   try {
//     if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
//       await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
//     }
//     await fsPromises.appendFile(
//       path.join(__dirname, "..", "logs", logName),
//       logItem
//     );
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const logger = (req: Request, res: Response, next: NextFunction) => {
//   logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
//   console.log(`${req.method} ${req.path}`);
//   next();
// };
//! to do it correctly you must first change (module) in tsconfig.ts file with (ES2016), like this:
//   "compilerOptions": {"module": "ES2016"}
//! and then add (ts-node) property to tsconfig.ts file, like this:
//   "ts-node": {"esm": true, "experimentalSpecifierResolution": "node"}
//! next you must change (type) in package.json file to (module), like this:
// under (main) property you can write => {"type": "module",}
