const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    name: { type: String },
    lastname: { type: String },
    email: { type: String },
    diploma: { type: String },
    actualPost: { type: String },
    nbrYearsOfExperience: { type: Number },
    lastPostOccupied: { type: String },
    cv: {
        fileId: { type: Schema.Types.ObjectId, ref: 'CVFile' }
    },
    dateOfBirth: { type: Date },
    address: { type: String },
   
    phoneNumber: { type: String },
    skills: [{ type: String }],
    languages: [{ type: String }],
    linkedinProfile: { type: String },
    profileImage: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;