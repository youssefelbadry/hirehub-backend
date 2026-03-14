// import { BadRequestException } from "@nestjs/common";
// import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
// import { diskStorage } from "multer";
// import { imageFilter } from "../enums/fileFilter.enum";
// import { extname, join } from "node:path";
// import { existsSync, mkdirSync } from "node:fs";

// export class MulterInterceptor {
//   static storage() {
//     return diskStorage({
//       destination: (req: any, file, callback) => {
//         const userId = req.user._id.toString();

//         const uploadPath = join(process.cwd(), "uploads", "users", userId);

//         if (!existsSync(uploadPath)) {
//           mkdirSync(uploadPath, { recursive: true });
//         }

//         callback(null, uploadPath);
//       },

//       filename: (req, file, callback) => {
//         const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);

//         const ext = extname(file.originalname);
//         const fileName = `profile-${unique}${ext}`;

//         callback(null, fileName);
//       },
//     });
//   }

//   private static fileFilter = (req, file, callback) => {
//     if (!imageFilter.includes(file.mimetype)) {
//       return callback(
//         new BadRequestException("Only images are allowed"),
//         false,
//       );
//     }
//     callback(null, true);
//   };

//   static uploadSingle(fieldName = "file") {
//     return FileInterceptor(fieldName, {
//       storage: this.storage(),
//       limits: { fileSize: 5 * 1024 * 1024 },
//       fileFilter: this.fileFilter,
//     });
//   }

//   static uploadMultiple(fieldName = "files", maxCount = 5) {
//     return FilesInterceptor(fieldName, maxCount, {
//       storage: this.storage(),
//       limits: { fileSize: 5 * 1024 * 1024 },
//       fileFilter: this.fileFilter,
//     });
//   }
// }
