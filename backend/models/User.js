const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide your name'], trim: true },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
        // V-- THIS IS THE UPDATED VALIDATION LOGIC --V
        validator: function(v) {
            // Regex to match format like: 24bec103@iiitdmj.ac.in
            const rollNumberRegex = /^\d{2}[a-zA-Z]+\d{3}@iiitdmj\.ac\.in$/;
            return rollNumberRegex.test(v);
        },
        message: 'Please use a valid IIITDMJ roll number email format (e.g., 24bec103@iiitdmj.ac.in)'
    }
  },
  phone: { type: String, required: [true, 'Please provide your phone number'], unique: true },
  password: { type: String, required: [true, 'Please provide a password'], minlength: 6, select: false },
  batch: { type: String, required: true },
  department: { type: String, required: true, enum: ['CSE', 'ECE', 'ME', 'Design', 'SM'] },
  hostel: { type: String, trim: true },
  roomNumber: { type: String, trim: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;