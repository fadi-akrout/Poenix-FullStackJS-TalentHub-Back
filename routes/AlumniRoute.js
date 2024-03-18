const express = require('express');
const router = express.Router();
const Alumni = require('../models/Alumni');

router.post('/', async (req, res) => {
    try {
        const alumni = new Alumni(req.body);
        await alumni.save();
        res.status(201).send(alumni);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const alumni = await Alumni.find();
        res.send(alumni);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);
        if (!alumni) {
            return res.status(404).send();
        }
        res.send(alumni);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/:id', async(req, res) => {
    try {
        const updatedAlumni = await Alumni.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAlumni);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const alumni = await Alumni.findByIdAndDelete(req.params.id);
        if (!alumni) {
            return res.status(404).send();
        }
        res.send(alumni);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
