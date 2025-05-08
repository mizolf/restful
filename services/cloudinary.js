const cloudinary = require("cloudinary").v2
const dotenv = require("dotenv");

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

const uploadToCloudinary = async (path, folder = "my-posts") => {
    try {
        const data = await cloudinary.uploader.upload(path, { folder: folder });
        return { url: data.secure_url, publicId: data.public_id };
    } catch (err) {
        console.log(err);
        throw err;
    }
};

const retrieveFromCloudinary = (publicId) => {
    return cloudinary.url(`${publicId}.jpg`, {
        width: 100,
        height: 150,
        crop: 'fill'
    });
};

module.exports = { uploadToCloudinary, retrieveFromCloudinary }