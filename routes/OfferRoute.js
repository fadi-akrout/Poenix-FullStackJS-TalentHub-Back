const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const User = require('../models/User');
const OfferUser = require('../models/OfferUser');
const applyToOffer= require('../controllers/applyToOffer')

// Create
router.post('/', async(req, res) => {
    const offer = new Offer(req.body);
    try {
        const savedOffer = await offer.save();
        res.status(201).send(savedOffer);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Read
router.get('/', async(req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (err) {
        res.status(500).send(err);
    }
});
router.get('/getoffer/:id', async(req, res) => {
   
        const id =req.params.id;
        Offer.findById({_id:id})
        .then(offers=>res.json(offers))
        .catch(err=>res.json(err))
});

// Update
router.patch('/:id', async(req, res) => {
    try {
        const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOffer);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete
router.delete('/:id', async(req, res) => {
    try {
        await Offer.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/apply/:userId/:offerId', applyToOffer);

module.exports = router;