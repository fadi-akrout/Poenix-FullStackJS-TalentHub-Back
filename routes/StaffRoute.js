const express = require('express');
const router = express.Router();
const Staff = require('../models/Staff');

// Create
router.post('/', async(req, res) => {
    const staff = new Staff(req.body);
    try {
        const savedStaff= await staff.save();
        res.status(201).send(savedStaff);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Read
router.get('/', async(req, res) => {
    try {
        const staffs = await Staff.find();
        res.json(staffs);
    } catch (err) {
        res.status(500).send(err);
    }
});
router.get('/getstaff/:id', async(req, res) => {
   
        const id =req.params.id;
        Staff.findById({_id:id})
        .then(staffs=>res.json(staffs))
        .catch(err=>res.json(err))
});

// Update
router.patch('/:id', async(req, res) => {
    try {
        const updatedStaff= await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStaff);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete
router.delete('/:id', async(req, res) => {
    try {
        await Staff.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;