const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaffSchema = new Schema({ 
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    actualPost: { type: String, required: true },
    nbrYearsOfExperience: { type: Number, required: true },
    address: { type: String },
    phoneNumber: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },


});

const Staff = mongoose.model('Staff', StaffSchema);
module.exports = Staff;
