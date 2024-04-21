const expressAsyncHandler = require("express-async-handler");
const Student = require("../models/Student");
const User = require("../models/User");
const Staff = require("../models/Staff");
const Alumni = require("../models/Alumni");
const Recruiter = require("../models/Recruiter");

const accountStatsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const studentCount = await Student.countDocuments();
    const staffCount = await Staff.countDocuments();
    const AlumniCount = await Alumni.countDocuments();
    const RecruiterCount = await Recruiter.countDocuments();

    res.json({ studentCount, userCount, staffCount, AlumniCount, RecruiterCount });
  } catch (error) {
    res.json(error);
  }
});



module.exports =  accountStatsCtrl;