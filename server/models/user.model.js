const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseId: { type: String, required: true, unique: true},
    nickname: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    role: { type: String, default: 'user' },
    isDisabled: { type: Boolean, default: false},
    emailVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
},
{
    collection: 'user-data',
});



const User = mongoose.model('User', userSchema);
module.exports = User;
