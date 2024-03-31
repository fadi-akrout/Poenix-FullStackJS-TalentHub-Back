const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({ 
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    diploma: { type: String, required: true },
    actualPost: { type: String, required: true },
    nbrYearsOfExperience: { type: Number, required: true },
    lastPostOccupied: { type: String, required: true },
    dateOfBirth: { type: Date },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },


});

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;
