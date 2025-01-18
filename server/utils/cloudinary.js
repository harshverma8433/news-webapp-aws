const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});



const bufferToStream = (buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Signals the end of the stream
  return stream;
};
const uploadOnCloudinary = async (fileBuffer) => {
    try {
      if (!fileBuffer) throw new Error('File buffer is required.');
  
      const stream = bufferToStream(fileBuffer);
      const result = await new Promise((resolve, reject) => {
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            folder: 'uploads', // Optional: Folder in Cloudinary to store uploads
          },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          }
        );
  
        stream.pipe(cloudinaryStream);
      });
  
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error.message);
      throw error;
    }
  };
  

module.exports = uploadOnCloudinary;
