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


router.get('/:id', getAlumni, (req, res) => {
    const { alumni, hasUserRelation } = res;
    res.json({ alumni, hasUserRelation });
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

async function getAlumni(req, res, next) {
    let alumni;
    let hasUserRelation= false;
    try {
        alumni = await Alumni.findOne({ user: req.params.id }).populate('user');
        if (alumni == null) {
            return res.status(404).json({ message: 'Cannot find alumni',hasUserRelation });
            
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
     hasUserRelation = alumni.user !== undefined;
    res.hasUserRelation = hasUserRelation;

    res.alumni = alumni;
    next();
}

module.exports = router;
