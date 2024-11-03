const Hero = require("../models/Hero");
const { deleteFromFirebase } = require("../middleware/imageMiddleware"); // Import the delete function

const getAllHeros = async (req, res) => {
  try {
    const heros = await Hero.find();
    return res.status(200).json(heros);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, costumError: "eror in getAll hero" });
  }
};

const getSingleHero = async (req, res) => {
  try {
    const { id } = req.params();
    const singleHero = await Hero.findById({ id });
    if (!singleHero) {
      return res.status(404).json({ message: "News not found" });
    }
    return res.status(200).json(singleHero);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error, costumError: "eror in get single hero" });
  }
};

const createHero = async (req, res) => {
  try {
    const heroData = {
      text: {
        ge: req.body.text.ge,
        en: req.body.text.en,
      },
      image: req.fileUrl,
    };

    const newHero = new Hero(heroData);
    await newHero.save();
    return res.status(200).json(newHero);
  } catch (error) {
    console.log(error, "error in create hero");
    res.status(500).json({ error, costumError: "error in create hero" });
  }
};

const deleteHero = async (req, res) => {
  try {
    const { id } = req.params();
    const singleHero = await Hero.findById({ id });
    if (!singleHero) {
      return res.status(404).json({ message: "no such hero to delete" });
    }

    await deleteFromFirebase(singleHero.image);

    await Hero.findByIdAndDelete(id);
    res.status(200).json({ message: "hero deleted successfully" });
  } catch (error) {
    console.log("error in delete hero", error);
    return res.status(500).json(error);
  }
};

// Update a single hero
const updateHero = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = {
      text: {
        en: req.body.text.en,
        ge: req.body.text.ge,
      },
    };

    //find hero
    const singleHeroInfo = await Hero.findById(req.params.id);
    if (!singleHeroInfo)
      return res.status(404).json({ message: "hero not found to update" });

    // Update images if new ones are uploaded
    if (req.fileUrl) {
      // delete all old images

      await deleteFromFirebase(singleHeroInfo.image.imageUrl);

      updatedData.image = req.fileUrl;
    }

    const singleHero = await Hero.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!singleHero) {
      return res.status(404).json({ message: "hero not found" });
    }

    res.status(200).json(singleHero);
  } catch (error) {
    res.status(500).json({ message: "Failed to update hero", error });
  }
};

module.exports = {
    getSingleHero,
    getAllHeros,
    createHero,
    deleteHero,
    updateHero
}