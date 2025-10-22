const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    type: { type: String, required: true, enum: ['interest', 'system'] },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
