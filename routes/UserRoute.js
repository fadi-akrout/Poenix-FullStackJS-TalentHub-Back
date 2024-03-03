// /*var express = require('express');
// var router = express.Router();
// //const User = require('../models/User');
// const usersController= require('../controllers/userController')

// router.route('/')
//     .get(usersController.getAllUsers)
//     .post(usersController.createNewUser)
//     .patch(usersController.updateUser)
//     .delete(usersController.deleteUser)
// module.exports = router*/



// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const verifyJWT= require('../middleware/verifyJWT')
// router.use(verifyJWT)


// // Create
// router.post('/', async(req, res) => {
//     const user = new User(req.body);
//     try {
//         const savedUser = await user.save();
//         res.status(201).send(savedUser);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// // Read
// router.get('/', async(req, res) => {
//     try {
//         const users = await User.find();
//         res.json(users);
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// // Update
// router.patch('/:id', async(req, res) => {
//     try {
//         const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedUser);
//     } catch (err) {
//         res.status(400).send(err);
//     }
// });

// // Delete
// router.delete('/:id', async(req, res) => {
//     try {
//         await User.findByIdAndDelete(req.params.id);
//         res.status(204).send();
//     } catch (err) {
//         res.status(500).send(err);
//     }
// });

// module.exports = router;