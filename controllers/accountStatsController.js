const expressAsyncHandler = require("express-async-handler");
const Student = require("../models/Student");
const User = require("../models/User");
const Staff = require("../models/Staff");
const Alumni = require("../models/Alumni");
const Recruiter = require("../models/Recruiter");
const Evenement = require("../models/Evenement");
const Offer = require("../models/Offer")
const FeedBack = require("../models/FeedBack")


const accountStatsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    // Count documents for various models
    const userCount = await User.countDocuments();
    const studentCount = await Student.countDocuments();
    const staffCount = await Staff.countDocuments();
    const alumniCount = await Alumni.countDocuments();
    const recruiterCount = await Recruiter.countDocuments();
    const offerCount = await Offer.countDocuments(); 

    // Aggregate data for evenements
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
    
    // Aggregate data for users
    const studentData = await Student.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.month': 1
        }
      }
    ]);
    
    // Aggregate data for offers
    const offerData = await Offer.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.month': 1
        }
      }
    ]);
    
    // Construct the data object to be sent to the client
    const data = {
      studentCount,
      userCount,
      staffCount,
      alumniCount,
      recruiterCount,
      evenementData,
      Filterdata: {
        labels: offerData.map(d => `${d._id.month}`),
        datasets: [
          {
            data: studentData.map(d => d.count),
          },
          {
            data: offerData.map(d => d.count),
          }
        ]
      }
    };

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = accountStatsCtrl;

