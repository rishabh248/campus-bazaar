const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please provide your name'], trim: true },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
        validator: function(v) {
            const email = v.toLowerCase();
            const basicRegex = /^\d{2}([a-zA-Z]+)\d{3}@iiitdmj\.ac\.in$/;
            const match = email.match(basicRegex);

            if (!match) return false;

            const year = parseInt(email.substring(0, 2), 10);
            const branch = match[1];
            const roll = parseInt(email.slice(-15, -12), 10);

            if (year < 21 || year > 25) return false;

            switch (branch) {
                case 'bec':
                    return roll >= 0 && roll <= 150;
                case 'bcs':
                    return roll >= 0 && roll <= 350;
                case 'bsm':
                case 'bme':
                case 'bds':
                    return roll >= 0 && roll <= 99;
                default:
                    return false;
            }
        },
        message: 'Invalid IIITDMJ email format or roll number is out of range.'
    },
    index: true
  },
  phone: { 
    type: String, 
    required: [true, 'Please provide your phone number'], 
    unique: true,
    validate: [
        {
            validator: function(v) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: 'Please provide a valid 10-digit phone number.'
        },
        {
            validator: function(v) {
               
                const allSameDigitsRegex = /^(?!(\d)\1{9}$)\d{10}$/;
                return allSameDigitsRegex.test(v);
            },
            message: 'Phone number cannot have all digits the same.'
        }
    ]
  },
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

