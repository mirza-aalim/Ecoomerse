import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import category from '../_models/categorySchema.js';

export const create = (req, res) => {
    if (req.body.name) {
        category.findOne({ name: req.body.name }).then((found) => {
            if (found) {
                res.status(500).json({ error: true, message: "Category Name is already exist." })
            } else {
                let ins = new category({
                    name: req.body.name,
                    slug: slugify(req.body.name)
                });
                ins.save().then((created) => {
                    if (created) {
                        res.status(200).json({ error: false, message: "Category created successfully." })
                    } else {
                        res.status(500).json({ error: true, message: "Category not created." })
                    }
                }).catch((error) => {
                    res.status(500).json({ error: true, message: "Category not created." })
                })
            }
        }).catch((error) => {
            res.status(500).json({ error: true, message: "Invalid Name." })
        });
    } else {
        res.status(500).json({ error: true, message: "Name is required." })
    }
}
export const update = (req, res) => {
    category.findOne({ _id: new ObjectId(req.body.categoryId) }).then((found) => {
        if (found) {
            category.findOne({ name: req.body.name }).then((founded) => {
                if (founded) {
                    res.status(500).json({ error: true, message: "Category Name is already exist." })
                } else {
                    category.findOneAndUpdate({ _id: new ObjectId(req.body.categoryId) }, { name: req.body.name, slug: slugify(req.body.name) }, { new: true }).then((updated) => {
                        if (updated) {
                            res.status(200).json({ error: false, message: "Category successfully updated.", category: updated })
                        } else {
                            res.status(500).json({ error: true, message: "Category not updated." })
                        }
                    }).catch((error) => {
                        res.status(500).json({ error: true, message: "Category not updated." })
                    })
                }
            }).catch((error) => {
                res.status(500).json({ error: true, message: "Invalid Name." })
            });
        } else {
            res.status(500).json({ error: true, message: "Category not found." })
        }
    }).catch((error) => {
        res.status(500).json({ error: true, message: "Invalid categoryId." })
    });
}
export const getAll = (req, res) => {
    category.find({}).sort({ createdAt: -1 }).then((found) => {
        res.status(200).json({ error: false, message: "Category found successfully.", category: found })
    }).catch((error) => {
        res.status(500).json({ error: true, message: "Something went wrong." })
    })
}
export const getById = (req, res) => {
    category.findOne({ _id: new ObjectId(req.params.id) }).then((found) => {
        res.status(200).json({ error: false, message: "Category found successfully.", category: found })
    }).catch((error) => {
        res.status(500).json({ error: true, message: "Something went wrong." })
    })
}
export const deleteCategory = (req, res) => {
    category.findOneAndDelete({ _id: new ObjectId(req.params.id) }).then((updated) => {
        if (updated) {
            res.status(200).json({ error: false, message: "Category successfully updated." })
        } else {
            res.status(500).json({ error: true, message: "Category not found." })
        }
    }).catch((error) => {
        console.log(error)
        res.status(500).json({ error: true, message: "Category not updated." })
    })
}