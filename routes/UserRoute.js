var express = require('express');
var router = express.Router();
const User = require('../models/User');
const createUser = async (UserData) => {
    try {
      const User = new User(UserData);
      const createdUser = await User.save();
      return createdUser;
    } catch (error) {
      throw new Error('Failed to create User.');
    }
  };
  
  const getAllUsers = async () => {
    try {
      const Users = await User.find();
      return Users;
    } catch (error) {
      throw new Error('Failed to fetch Users.');
    }
  };
  
  const getUserById = async (UserId) => {
    try {
      const User = await User.findById(UserId);
      return User;
    } catch (error) {
      throw new Error('Failed to fetch User.');
    }
  };
  
  const updateUser = async (UserId, UserData) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(UserId, UserData, {
        new: true,
      });
      return updatedUser;
    } catch (error) {
      throw new Error('Failed to update User.');
    }
  };
  
  const deleteUser = async (UserId) => {
    try {
      await User.findByIdAndRemove(UserId);
      return true;
    } catch (error) {
      throw new Error('Failed to delete User.');
    }
  };
  
  module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  };