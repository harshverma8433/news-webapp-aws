const multer = require('multer');

// Multer configuration for in-memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB file size limit (adjust as needed)
    },
    fileFilter: (req, file, cb) => {
        // Validate file types, if needed
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'), false);
        }
    },
});

module.exports = upload;
