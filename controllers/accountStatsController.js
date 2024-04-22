const expressAsyncHandler = require("express-async-handler");
const Student = require("../models/Student");
const User = require("../models/User");
const Staff = require("../models/Staff");
const Alumni = require("../models/Alumni");
const Recruiter = require("../models/Recruiter");
const Evenement = require("../models/Evenement")

const accountStatsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const studentCount = await Student.countDocuments();
    const staffCount = await Staff.countDocuments();
    const AlumniCount = await Alumni.countDocuments();
    const RecruiterCount = await Recruiter.countDocuments();
    
    const evenementData = await Evenement.aggregate([
      {
        $group: {
          _id: {
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {'_id.day': 1 }
      }
    ]);
    

    const englishStudentCount = await Student.countDocuments({ languages: "french-english" });

    res.json({ studentCount, userCount, staffCount, AlumniCount, RecruiterCount, englishStudentCount, evenementData });
  } catch (error) {
    res.json(error);
  }
});



module.exports =  accountStatsCtrl;