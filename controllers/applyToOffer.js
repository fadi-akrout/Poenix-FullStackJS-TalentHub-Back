const mongoose = require('mongoose');
const Offer = require('../models/Offer');
const User = require('../models/User');
const OfferUser = require('../models/OfferUser');

const applyToOffer = async (req, res) => {
  try {
    const userId = req.params.userId; // Assuming you have middleware to get the authenticated user
    const offerId = req.params.offerId;

    // Find the user and offer by their respective IDs
    const user = await User.findById(userId);
    const offer = await Offer.findById(offerId);

    if (!user || !offer) {
      return res.status(404).json({ error: 'User or Offer not found' });
    }

    // Check if the user is already associated with the offer
    const existingOfferUser = await OfferUser.findOne({ user: userId, offer: offerId });
    if (existingOfferUser) {
      return res.status(400).json({ error: 'User is already associated with this offer' });
    }

    const applyObject = { offer: offerId, user: userId };
    const offerUser = await OfferUser.create(applyObject);

    // Add the offerUser reference to the offer and user
    offer.users.push(offerUser._id);
    await offer.save();

    user.offers.push(offerUser._id);
    await user.save();

    return res.status(200).json({ message: 'User successfully associated with the offer' });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = applyToOffer;