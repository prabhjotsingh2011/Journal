const multer = require('multer');
const path = require('path');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: './tmp/',
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`); // Unique filename for each attachment
  },
});

// Create a multer instance with the specified storage configuration
const upload  = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Validate file types
    
    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'text/plain'];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
        
      cb(new Error('Invalid file type. Only PDF, image (JPEG/PNG), video (MP4), and plain text files are allowed.'));
    }
  },
});
module.exports=upload;