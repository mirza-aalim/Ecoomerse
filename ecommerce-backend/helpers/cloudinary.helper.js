import cloudinary from 'cloudinary';

import { cloud_name, api_key, api_secret } from '../_configs/cloudinary.config.js';

cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
});

export const upload = async (files) => {
    return new Promise(async (resolve, reject) => {
        if (files.images) {
            let images = [];
            let count = 0;
            if (files.images.length) {
                for (const file of files.images) {
                    console.log(file)
                    cloudinary.v2.uploader.upload(file.filepath, { folder: 'products' }).then((uploaded) => {
                        images.push(uploaded.secure_url)
                        count++
                        if (count === files.images.length) {
                            resolve(images);
                        }
                    }).catch((error) => {
                        reject(error)
                    });
                }
            } else {
                reject("Invalid File.")
            }
        }
    });
};