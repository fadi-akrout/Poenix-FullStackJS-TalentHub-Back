const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AlumniSchema = new Schema({ 
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    diploma: { type: String, required: true },
    actualPost: { type: String, required: true },
    nbrYearsOfExperience: { type: Number, required: true },
    lastPostOccupied: { type: String, required: true },
    cv: {
        fileId: { type: Schema.Types.ObjectId, ref: 'CVFile' }
    },
    dateOfBirth: { type: Date },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
    phoneNumber: { type: String },
    skills: [{ type: String }],
    languages: [{ type: String }],
    linkedinProfile: { type: String },
    profileImage: { type: String },
    graduationYear: { type: Number },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Alumni = mongoose.model('Alumni', AlumniSchema);
module.exports = Alumni;