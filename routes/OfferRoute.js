const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const User = require('../models/User');
const OfferUser = require('../models/OfferUser');
const { applyToOffer, acceptCandidate, getAcceptedUsers } = require('../controllers/applyToOffer')


const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
// Create
router.post('/', async(req, res) => {
    // Extract offer data from request body
    const { userId, ...offerData } = req.body;

    try {
        // Create new offer instance
        const offer = new Offer(offerData);

        // Save the offer
        const savedOffer = await offer.save();

        // Find the user by ID and update the offers array
        await User.findByIdAndUpdate(
            userId, { $push: { offers: savedOffer._id } }, // Add the offer ID to the user's offers array
            { new: true } // Return the updated user object
        );

        // Send the saved offer as response
        res.status(201).send(savedOffer);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/offerOwner/:userId', async(req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by ID and populate the 'offers' field
        const user = await User.findById(userId).populate('offers');

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send(user.offers);
    } catch (err) {
        res.status(500).send(err);
    }
});
/* router.get('/acceptedList/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by ID and populate the 'offers' field
        const user = await User.findById(userId).populate('offers');
        
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        const offerIds = user.offers.map(offer => offer._id);
        const offerUser = await OfferUser.findOne({ user: userId, offer: user._id });
        res.send(user.offers);
    } catch (err) {
        res.status(500).send(err);
    }
}); */
router.get('/userList/:offerId', async(req, res) => {
    const { offerId } = req.params;

    try {
        // Find the offer by ID and populate the 'users' field
        const offer = await Offer.findById(offerId).populate('users');

        if (!offer) {
            return res.status(404).send({ message: 'Offer not found' });
        }

        res.send(offer.users);
    } catch (err) {
        res.status(500).send(err);
    }
});
// Read
router.get("/", async(req, res) => {
    try {
        const { q } = req.query;
        const fieldNames = ["Title", "Experience_required", "Domain", "Mission", "Speciality", "JobType", "JobCity"]; // Replace with your desired field names
        const regexQueries = fieldNames.map((fieldName) => ({
            [fieldName]: { $regex: q, $options: 'i' }
        }));
        const query = q ? { $or: regexQueries } : {};
        const offers = await Offer.find(query);
        res.json(offers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "An error occurred" });
    }
});
/* router.get('/', async(req, res) => {
    try {
        const offers = await Offer.find();
        res.json(offers);
    } catch (err) {
        res.status(500).send(err);
    }
}); */
router.get('/getoffer/:id', async(req, res) => {

    const id = req.params.id;
    Offer.findById({ _id: id })
        .then(offers => res.json(offers))
        .catch(err => res.json(err))
});
const getOffersByUserId = async(req, res) => {
    const { userId } = req.params;

    try {
        // Find the user by ID
        const offerUsers = await OfferUser.find({ user: userId }).populate('offer');

        if (!offerUsers || offerUsers.length === 0) {
            return res.status(404).json({ message: 'User does not have offers' });
        }

        const offers = offerUsers.map((offerUser) => offerUser.offer);
        res.json(offers);
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
router.get('/user/:userId', getOffersByUserId);

router.put('/accept/:offerId/users/:userId', acceptCandidate);
router.get('/acceptedList/:offerId', getAcceptedUsers);


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
        const offer = await Offer.findById(req.params.id);
        if (!offer) {
            return res.status(404).send({ error: "Offer not found" });
        }

        // Check if the offer has associated users
        const usersCount = await User.countDocuments({ offer: offer._id });
        if (usersCount > 0) {
            return res.status(400).send({ error: "Offer has associated users and cannot be deleted" });
        }

        // If no associated users, proceed with deletion
        await Offer.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post('/quiz/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, questions } = req.body;
  
      // Check if a quiz already exists for the offer
      const existingQuiz = await Quiz.findOne({ offer: id });
      if (existingQuiz) {
        // Update the existing quiz
        existingQuiz.title = title;
        existingQuiz.questions = questions;
        const updatedQuiz = await existingQuiz.save();
        return res.status(200).json(updatedQuiz);
      }
  
      // Create a new quiz
      const newQuiz = new Quiz({
        offer: id,
        title: title,
        questions: questions,
      });
  
      // Save the new quiz in the database
      const savedQuiz = await newQuiz.save();
  
      // Associate the quiz with the specific offer
      const offer = await Offer.findById(id);
      offer.quiz = savedQuiz._id;
      await offer.save();
  
      res.status(201).json(savedQuiz);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error });
    }
  });
  router.get('/quiz/:offerId', async (req, res) => {
    const { offerId } = req.params;
    const userId = req.headers['user-id']; // Assuming you have the authenticated user's ID available

    try {
        // First, check if a quiz result already exists for this user and offer
        const existingQuizResult = await QuizResult.findOne({ user: userId, offer: offerId });
        if (existingQuizResult) {
            return res.status(400).json({ message: 'You have already taken the quiz for this offer' });
           
        }

        // Find the offer with the quiz populated
        const offer = await Offer.findById(offerId).populate({
            path: 'quiz',
            populate: { path: 'questions' } // Further populate the questions of the quiz
        });

        if (!offer) {
            return res.status(404).json({ message: 'Offer not found' });
        }

        // Check if the quiz exists on the offer
        if (!offer.quiz) {
            return res.status(401).json({ message: 'No quiz associated with this offer' });
        }

        // Send the entire quiz along with populated questions
        res.json(offer.quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});


router.post('/apply/:userId/:offerId', applyToOffer);



module.exports = router;