const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({ 

    name: { type: String },
    lastname: { type: String },
    email: { type: String },
    diploma: { type: String },
    actualPost: { type: String },
    lastPostOccupied: { type: String },
    dateOfBirth: { type: Date },
    profileImage: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },


});

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;
