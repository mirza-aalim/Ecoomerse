import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, lowercase: true }
}, { versionKey: false, timestamps: true });

export default model('category', categorySchema);
