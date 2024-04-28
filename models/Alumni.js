const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumniSchema = new Schema({ 
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    diploma: { type: String, required: true },
    dateOfBirth: { type: Date },
    address: { type: String },
    phoneNumber: { type: String },
    profileImage: { type: String },
    graduationYear: { type: Number },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Alumni = mongoose.model('Alumni', AlumniSchema);
module.exports = Alumni;