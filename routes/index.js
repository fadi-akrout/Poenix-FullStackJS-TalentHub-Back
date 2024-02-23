var express = require('express');
var router = express.Router();
const Admin = require('../models/Admin');
const Recruiter = require('../models/Recruiter');


const createAdmin = async (adminData) => {
  try {
    const admin = new Admin(adminData);
    const createdAdmin = await admin.save();
    return createdAdmin;
  } catch (error) {
    throw new Error('Failed to create admin.');
  }
};

const getAllAdmins = async () => {
  try {
    const admins = await Admin.find();
    return admins;
  } catch (error) {
    throw new Error('Failed to fetch admins.');
  }
};

const getAdminById = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    return admin;
  } catch (error) {
    throw new Error('Failed to fetch admin.');
  }
};

const updateAdmin = async (adminId, adminData) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, adminData, {
      new: true,
    });
    return updatedAdmin;
  } catch (error) {
    throw new Error('Failed to update admin.');
  }
};

const deleteAdmin = async (adminId) => {
  try {
    await Admin.findByIdAndRemove(adminId);
    return true;
  } catch (error) {
    throw new Error('Failed to delete admin.');
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};

// Recruiter
const createRecruiter = async (recruiterData) => {
  try {
    const recruiter = new Recruiter(recruiterData);
    const createdRecruiter = await recruiter.save();
    return createdRecruiter;
  } catch (error) {
    throw new Error('Failed to create recruiter.');
  }
};

const getAllRecruiters = async () => {
  try {
    const recruiters = await Recruiter.find();
    return recruiters;
  } catch (error) {
    throw new Error('Failed to fetch recruiters.');
  }
};

const getRecruiterById = async (recruiterId) => {
  try {
    const recruiter = await Recruiter.findById(recruiterId);
    return recruiter;
  } catch (error) {
    throw new Error('Failed to fetch recruiter.');
  }
};

const updateRecruiter = async (recruiterId, recruiterData) => {
  try {
    const updatedRecruiter = await Recruiter.findByIdAndUpdate(
      recruiterId,
      recruiterData,
      { new: true }
    );
    return updatedRecruiter;
  } catch (error) {
    throw new Error('Failed to update recruiter.');
  }
};

const deleteRecruiter = async (recruiterId) => {
  try {
    await Recruiter.findByIdAndRemove(recruiterId);
    return true;
  } catch (error) {
    throw new Error('Failed to delete recruiter.');
  }
};

module.exports = {
  createRecruiter,
  getAllRecruiters,
  getRecruiterById,
  updateRecruiter,
  deleteRecruiter,
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
