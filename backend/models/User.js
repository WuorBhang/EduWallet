const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'parent'], required: true },
    school_id: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
});

module.exports = mongoose.model('User', userSchema);
