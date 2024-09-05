const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images/"); // Directory to save the files
    },
    filename: (req, file, cb) => {
      const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
  
  const upload = multer({ storage: storage });
  
  module.exports = upload