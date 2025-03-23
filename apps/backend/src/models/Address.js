const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, 'Street address is required'],
    trim: true,
    maxLength: [100, 'Street address cannot exceed 100 characters']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxLength: [50, 'City name cannot exceed 50 characters']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true,
    maxLength: [50, 'State name cannot exceed 50 characters']
  },
  postalCode: {
    type: String,
    required: [true, 'Postal code is required'],
    trim: true,
    maxLength: [10, 'Postal code cannot exceed 10 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true,
    maxLength: [50, 'Country name cannot exceed 50 characters']
  }
});

const addressModel = mongoose.model('Address', addressSchema);

module.exports = addressModel;