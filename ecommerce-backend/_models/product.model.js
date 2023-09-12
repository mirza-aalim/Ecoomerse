import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema({
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    categoryId: { type: mongoose.Types.ObjectId, required: true, ref: 'category' },
    quantity: { type: Number, required: true },
    photo: { type: Buffer, contentType: String },
    images: [{
        url: { type: String }
    }],
    shipping: { type: Boolean }
}, { versionKey: false, timestamps: true });

export default model('product', productSchema);
