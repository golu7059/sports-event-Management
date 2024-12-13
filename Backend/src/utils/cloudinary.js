import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv';
dotenv.config()

  // Configuration of cloudinary
  cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
            const response =   await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        console.log(`file uploaded on cloudinary : ${response.url}`)
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return response 
    } catch (error) {
        fs.unlink(localFilePath,(error) => {
            if(error) console.error("Error in uploading file to cloudinary : ",error);
        });
    }
}

const deleteFromCloudinary = async(publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log(`A file Deleted from cloudinary : ${publicId}`)
        return result;
    } catch (error) {
        console.error("Error deleting file from cloudinary : ",error);
        return null;
    }
}

export {
    uploadOnCloudinary,
    deleteFromCloudinary
}