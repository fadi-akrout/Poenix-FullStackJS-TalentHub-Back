const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcryptjs')
const Offer = require('../models/Offer');
const OfferUser = require('../models/OfferUser');
// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async(req, res) => {
    // Get all users from MongoDB
    const users = await User.find().select('-password').lean()

    // If no users 
    if (!users.length) {
        return res.status(400).json({ message: 'No users found' })
    }

    res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = asyncHandler(async(req, res) => {
    const { username, email, password, roles, active } = req.body

    // Confirm data
    if (!email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate username
    const duplicate = await User.findOne({ email }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate email' })
    }

    // Hash password 
    const hashedPwd = await bcrypt.hash(password, 10) // salt rounds

    const userObject = (!Array.isArray(roles) || !roles.length) ? { username, "password": hashedPwd } : { username, "password": hashedPwd, roles }
        // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async(req, res) => {
    const { id, username, email, roles, active, password } = req.body

    // Confirm data 
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields except password are required' })
    }

    // Does the user exist to update?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    // Check for duplicate 
    const duplicate = await User.findOne({ email }).lean().exec()

    // Allow updates to the original user 
    if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' })
    }

    user.username = username
    user.roles = roles
    user.active = active
    user.email = email

    if (password) {
        // Hash password 
        user.password = await bcrypt.hash(password, 10) // salt rounds 
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.email} updated` })
})

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async(req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'User ID Required' })
    }

    // Does the user still have assigned notes?
    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' })
    }

    // Does the user exist to delete?
    const user = await User.findById(id).exec()

    if (!user) {
        return res.status(400).json({ message: 'User not found' })
    }

    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} deleted`

    res.json(reply)
})
const getFilteredUsers = async (req, res) => {
    try {
        // Perform filtering based on criteria, for example, role
        const { role } = req.query;
        let filteredUsers;

        if (role) {
            // Filter users based on role
            filteredUsers = await User.find({ roles: role });
        } else {
            // If no role is specified, return all users
            filteredUsers = await User.find();
        }

        res.json(filteredUsers);
    } catch (error) {
        console.error('Error fetching filtered users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/* const getOffersByUserId = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find the user by ID
      const offerUsers = await OfferUser.find({ user: userId }).populate('offer');
  
      if (!offerUsers) {
        return res.status(404).json({ message: 'User does not have offers' });
      }
  
      const offers = offerUsers.map((offerUser) => offerUser.offer);
      res.json(offerUsers);
    } catch (error) {
      console.error('Error fetching offers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }; */

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getFilteredUsers,
}