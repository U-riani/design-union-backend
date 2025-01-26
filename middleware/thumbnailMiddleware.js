// thumbnailUrlMiddleware.js
const fetch = require('node-fetch');

const checkThumbnailAvailability = async (videoId) => {
  const thumbnailUrls = [
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, 
    `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,   
    `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,   
  ];

  for (const url of thumbnailUrls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return url; 
      }
    } catch (err) {
      continue; 
    }
  }

  return null; 
};

// Middleware to fetch the thumbnail URL
const thumbnailUrlMiddleware = async (req, res, next) => {
  const videoId = req.body.videoId; // Assuming videoId is in the body

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  const thumbnailUrl = await checkThumbnailAvailability(videoId);

  if (thumbnailUrl) {
    req.body.thumbnail = thumbnailUrl; // Attach the thumbnail URL to the request body
    next(); // Proceed to the next middleware or controller
  } else {
    return res.status(404).json({ error: "No available thumbnail found for the video" });
  }
};

module.exports = thumbnailUrlMiddleware;
