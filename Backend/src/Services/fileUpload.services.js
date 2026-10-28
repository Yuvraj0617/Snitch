import multer from "multer"

 export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 5,
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (_req, file, callback) => {
        if (file.mimetype.startsWith("image/")) {
            callback(null, true);
            return;
        }
        callback(new Error("Only image files are allowed."));
    },
})
