// const multer = require('multer');
// const path = require('path');

// // Set storage engine for Multer
// const storage = multer.diskStorage({
//   destination: './uploads/', // Directory where files will be saved
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid duplicate filenames
//   },
// });

// // Check file type
// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);

//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// // Init upload middleware
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
//   fileFilter: (req, file, cb) => {
//     checkFileType(file, cb);
//   },
// }).single('image'); // 'image' is the field name used to send the image

// module.exports = upload;
