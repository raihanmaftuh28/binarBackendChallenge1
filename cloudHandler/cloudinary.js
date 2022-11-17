const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dkbehtfrs",
  api_key: "244114918877153",
  api_secret: "9jN-NroVIC9J48w9vvT4llvReK4",
  secure: true,
});

module.exports = cloudinary;
