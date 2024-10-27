// const Image = require('../models/imageModel'); // Import Image model (optional)

// // Handle image upload
// exports.uploadImage = (req, res) => {
//   // File upload handling
//   if (!req.file) {
//     return res.status(400).json({ message: 'No file selected' });
//   }

//   // If you want to store image info in the database
//   const newImage = new Image({
//     filename: req.file.filename,
//     url: `/uploads/${req.file.filename}`, // The URL to access the file
//   });

//   // Save image info to the database
//   newImage.save()
//     .then(() => {
//       res.status(200).json({
//         message: 'File uploaded successfully',
//         url: `/uploads/${req.file.filename}`,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({ message: 'Error saving image info', error });
//     });
// };
