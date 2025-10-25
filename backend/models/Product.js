const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 100 },
  description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 1000 },
  price: { type: Number, required: [true, 'Price is required'], min: 0 },
  category: { type: String, required: [true, 'Category is required'], enum: ['Electronics', 'Books', 'Furniture', 'Vehicles', 'Other'], index: true },
  condition: { type: String, required: [true, 'Condition is required'], enum: ['New', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
  images: [{
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  }],
  status: { type: String, enum: ['available', 'sold'], default: 'available', index: true },
  isFeatured: { type: Boolean, default: false, index: true },
  interestedBuyers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ price: 1 }); // Index price for sorting

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
