const mongoose = require('mongoose');

const OfferUserSchema = new mongoose.Schema({
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  accepted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const OfferUser = mongoose.model('OfferUser', OfferUserSchema);
module.exports = OfferUser;