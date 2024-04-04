const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.post('/', async(req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/', async(req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        res.status(500).send(error);
    }
});

/* router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).send();
        }
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
}); */

router.get('/:id', getStudent, (req, res) => {
    const { student, hasUserRelation } = res;
    res.json({ student, hasUserRelation });
});

router.patch('/:id', async(req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).send(err);
    }
});


router.delete('/:id', async(req, res) => {
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

async function getStudent(req, res, next) {
    let student;
    let hasUserRelation = false;
    try {
        student = await Student.findOne({ user: req.params.id }).populate('user');
        if (student == null) {
            return res.status(404).json({ message: 'Cannot find student', hasUserRelation });

        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    hasUserRelation = student.user !== undefined;
    res.hasUserRelation = hasUserRelation;

    res.student = student;
    next();
}
router.get('/a/:id', async(req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('user');
        if (!student) {
            return res.status(404).send();
        }
        res.send(student);
    } catch (error) {
        res.status(500).send(error);
    }
});


module.exports = router;