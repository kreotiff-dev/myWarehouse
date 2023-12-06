const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategoryId: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, enum: ['USD', 'EUR', 'GBP', 'RUB'] },
  discountPrice: { type: Number },
  description: { type: String },
  images: [{ type: String }],
  rating: { type: Number },
  availability: { type: Boolean, default: true },
  quantity: { type: Number, default: 0 },
  manufacturer: { type: String },
  brand: { type: String },
  weight: { type: Number },
  weightUnit: { type: String, enum: ['grams', 'kilograms', 'pounds', 'ounces'] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  reviews: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      text: { type: String },
      rating: { type: Number },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  featured: { type: Boolean, default: false },
  promotional: { type: Boolean, default: false },
});

const Product = model('Product', productSchema);

module.exports = Product;