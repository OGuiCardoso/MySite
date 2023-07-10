import dotenv from 'dotenv';

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: './.env' });
}

import cloudinaryBase from 'cloudinary'
const cloudinary = cloudinaryBase.v2
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLAUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'MySite',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});
export { cloudinary, storage }
