const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({ 
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
