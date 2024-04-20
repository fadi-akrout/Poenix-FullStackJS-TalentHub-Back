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
  }
});

const OfferUser = mongoose.model('OfferUser', OfferUserSchema);
module.exports = OfferUser;