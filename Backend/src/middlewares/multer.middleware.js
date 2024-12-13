import multer from 'multer';
import path from 'path';

// Define the storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // Use path.resolve to create an absolute path
        const tempDir = path.resolve('public', 'temp');
        cb(null, tempDir);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Export the multer upload middleware
export const upload = multer({
    storage
});
