const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  Admin_id: Number,
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;