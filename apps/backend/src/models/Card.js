const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer reference is required'],
    index: true
  },
  cardNumber: {
    type: String,
    required: [true, 'Card number is required'],
    unique: true,
    validate: {
      validator: v => validator.isCreditCard(v),
      message: 'Invalid card number format'
    },
    set: v => v.replace(/[\s-]/g, '') // Store without formatting
  },
  expiration: {
    type: Date,
    required: [true, 'Expiration date is required'],
    validate: {
      validator: v => v > Date.now(),
      message: 'Card has expired'
    }
  },
  cvv: {
    type: String,
    required: [true, 'CVV is required'],
    validate: {
      validator: v => /^\d{3,4}$/.test(v),
      message: 'Invalid CVV format'
    },
    set: v => bcrypt.hashSync(v, 10) // Hash CVV
  },
  cardType: {
    type: String,
    required: true,
    enum: ['debit', 'credit']
  },
  dailyLimit: {
    type: Number,
    default: 5000,
    min: [0, 'Daily limit cannot be negative']
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'expired'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      // Mask card number in outputs
      ret.cardNumber = `****-****-****-${ret.cardNumber.slice(-4)}`;
      delete ret.cvv;
      return ret;
    }
  }
});

// Index for common queries
cardSchema.index({ customerId: 1, status: 1 });

const Card = mongoose.model('Card', cardSchema);
module.exports = Card;