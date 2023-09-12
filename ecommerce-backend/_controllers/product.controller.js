import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import formidable from 'formidable';
import product from '../_models/product.model.js';
import { upload } from '../helpers/cloudinary.helper.js'

export const addProduct = (req, res) => {
    const form = formidable({});
    form.parse(req, (error, fields, files) => {
        if (fields.name[0]) {
            if (fields.description[0]) {
                if (fields.price[0]) {
                    if (fields.categoryId[0]) {
                        if (fields.quantity[0]) {
                            if (files.images) {
                                upload(files).then((uploaded) => {
                                    console.log("uploaded", uploaded)
                                }).catch((error) => {

                                })
                            } else {
                                res.status(500).json({ error: true, message: "Name is required" })
                            }
                        } else {
                            res.status(500).json({ error: true, message: "Name is required" })
                        }
                    } else {
                        res.status(500).json({ error: true, message: "CategoryId is required" })
                    }
                } else {
                    res.status(500).json({ error: true, message: "Price is required" })
                }
            } else {
                res.status(500).json({ error: true, message: "Description is required" })
            }
        } else {
            res.status(500).json({ error: true, message: "Name is required" })
        }
    });
}