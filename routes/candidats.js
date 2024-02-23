const express = require('express');
const router = express.Router();
const CandidateController = require('../controllers/CandidateController');

// Get all candidates
router.get('/candidates', CandidateController.getAllCandidates);

// Get a single candidate by id
router.get('/candidates/:id', CandidateController.getCandidate);

// Create a new candidate
router.post('/candidates', CandidateController.createCandidate);

// Update an existing candidate
router.put('/candidates/:id', CandidateController.updateCandidate);

// Delete a candidate
router.delete('/candidates/:id', CandidateController.deleteCandidate);

module.exports = router;