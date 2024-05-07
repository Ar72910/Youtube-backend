import { v2  } from "cloudinary";
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        // file has been uploaded successfully
        console.log('File has been uploaded successfully', response.url);
        return response

    }
    catch (error) {
        fs.unlink(localFilePath)  // remove the locally saved temporal file as the uploaded operation got failed
        return null;
        
    }
}
 
export {uploadOnCloudinary}