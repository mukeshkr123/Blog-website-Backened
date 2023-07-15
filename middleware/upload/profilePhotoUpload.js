const multer = require("multer");

// storage
const multerStorage = multer.memoryStorage();

// file type checking
const multerFilter = (req, file, cb) => {
  // check the file type
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected file
    cb({ message: "Unsupported file format" }, false);
  }
};

const profilePhotoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});

module.exports = {
  profilePhotoUpload,
};
