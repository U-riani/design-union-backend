// const Registration = require("../models/Registration");
// const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

// // Get all heroes
// const getAllHeros = async (req, res) => {
//   try {
//     const heros = await Hero.find();
//     return res.status(200).json(heros);
//   } catch (error) {
//     console.error("Error in getAllHeros:", error);
//     return res.status(500).json({ error, customError: "Error in getAll hero" });
//   }
// };

// // Get a single hero
// const getSingleHero = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const singleHero = await Hero.findById(id);
//     if (!singleHero) {
//       return res.status(404).json({ message: "Hero not found" });
//     }
//     return res.status(200).json(singleHero);
//   } catch (error) {
//     console.error("Error in getSingleHero:", error);
//     return res.status(500).json({ error, customError: "Error in get single hero" });
//   }
// };

// // Create a new hero
// const createHero = async (req, res) => {
//   try {
//     const heroData = {
//       text: {
//         ge: req.body.text.ge,
//         en: req.body.text.en,
//       },
//       image: req.fileUrls || [], // Use `fileUrls` from middleware
//     };

//     const newHero = new Hero(heroData);
//     await newHero.save();
//     return res.status(200).json(newHero);
//   } catch (error) {
//     console.error("Error in createHero:", error);
//     res.status(500).json({ error, customError: "Error in create hero" });
//   }
// };

// // Delete a hero
// const deleteHero = async (req, res) => {
//   try {
//     const { id } = req.params;
  
//     const singleHero = await Hero.findById(id);
//     if (!singleHero) {
//       return res.status(404).json({ message: "No such hero to delete" });
//     }

//     // Delete associated image(s) from Firebase
//     if (singleHero.image  && singleHero.image.length > 0) {
//       await deleteFromFirebase(singleHero.image[0]);
//     }

//     await Hero.findByIdAndDelete(id);
//     res.status(200).json({ message: "Hero deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteHero:", error);
//     return res.status(500).json(error);
//   }
// };

// // Update a hero
// const updateHero = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedData = {
//       text: {
//         en: req.body.text.en,
//         ge: req.body.text.ge,
//       },
//     };

//     // Find existing hero document
//     const singleHeroInfo = await Hero.findById(id);
//     if (!singleHeroInfo) {
//       return res.status(404).json({ message: "Hero not found to update" });
//     }

//     // Handle image updates if new images are uploaded
//     if (req.fileUrls && req.fileUrls.length > 0) {
//       // Delete old image(s)
//       if (singleHeroInfo.image && singleHeroInfo.image.length > 0) {
//         await deleteFromFirebase(singleHeroInfo.image[0]);
//       }

//       // Set new images
//       updatedData.image = req.fileUrls;
//     }

//     const updatedHero = await Hero.findByIdAndUpdate(id, updatedData, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json(updatedHero);
//   } catch (error) {
//     console.error("Failed to update hero:", error);
//     res.status(500).json({ message: "Failed to update hero", error });
//   }
// };

// module.exports = {
//   getSingleHero,
//   getAllHeros,
//   createHero,
//   deleteHero,
//   updateHero,
// };
