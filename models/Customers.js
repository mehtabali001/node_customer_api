const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
 
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Customers = mongoose.model('Customers', CustomerSchema);

module.exports = Customers;
