const validateBlogsData = (req, res, next) => {
    const { title, text } = req.body;
    // const {image} = req.file
    console.log("---------", req.body.text);
    
    if (!title.ge || !text.ge  ) {
      return res.status(400).json({ message: 'Title, text and image  are required' });
    }
  
    next();
  };
  
  module.exports = { validateBlogsData };