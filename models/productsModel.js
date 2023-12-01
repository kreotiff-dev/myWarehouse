const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  description: { type: String },
  images: [{ type: String }],
  rating: { type: Number },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;