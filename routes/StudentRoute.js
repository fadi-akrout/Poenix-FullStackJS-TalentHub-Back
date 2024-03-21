const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send();
        }
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
});


router.patch('/:id', async(req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).send(err);
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).send();
        }
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
