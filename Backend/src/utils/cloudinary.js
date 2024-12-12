import {v2 as cloudinary} from cloudinary
import fs from 'fs'

  // Configuration of cloudinary
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOD_NAME, 
        api_key: process.env.CLOUDINARY_CLOD_NAME, 
        api_secret: process.env.CLOUDINARY_CLOD_NAME 
    });

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
      const response =   await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        console.log(`file uploaded on cloudinary : ${response.url}`)
        fs.unlink(localFilePath)
        return response 
    } catch (error) {
        fs.unlinkSync(localFilePath);
    }
}

export {
    uploadOnCloudinary
}