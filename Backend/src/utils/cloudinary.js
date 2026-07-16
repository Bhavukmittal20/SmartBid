import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

const configureCloudinary=()=>{
    const {CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET}=process.env;

    if(!CLOUDINARY_CLOUD_NAME||!CLOUDINARY_API_KEY||!CLOUDINARY_API_SECRET){
        throw new Error('Missing Cloudinary environment variables');
    }

    cloudinary.config({
        cloud_name:CLOUDINARY_CLOUD_NAME,
        api_key:CLOUDINARY_API_KEY,
        api_secret:CLOUDINARY_API_SECRET,
        secure:true
    });
}

const removeLocalFile=(localFilePath)=>{
    if(localFilePath&&fs.existsSync(localFilePath)){
        fs.unlinkSync(localFilePath);
    }
}

const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath) return null;
        configureCloudinary();
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        });
        console.log('File uploaded successfully',response.secure_url);
        removeLocalFile(localFilePath);
        return response.secure_url;
    }catch(error){
        removeLocalFile(localFilePath);
        console.error('Cloudinary upload failed',{
            message:error.message,
            http_code:error.http_code,
            name:error.name
        });
        throw error;
    }

}
const deleteOnCloudinary=async(publicId)=>{
    try{
        if(!publicId) return null;
        configureCloudinary();
        const response=await cloudinary.uploader.destroy(publicId);
        return response;
    }catch(error){
        console.error('Cloudinary deletion failed',{
            message:error.message,
            http_code:error.http_code,
            name:error.name
        });
        throw error;
    }

}
export {uploadOnCloudinary,deleteOnCloudinary}
