// newsMiddleware.js

const validateNewsData = (req, res, next) => {
    const { title, text } = req.body;
    // const {image} = req.file
    // console.log(rep.body)
    
    if (!title || !text  ) {
      return res.status(400).json({ message: 'Title, text and image  are required' });
    }
  
    next();
  };
  
  module.exports = { validateNewsData };