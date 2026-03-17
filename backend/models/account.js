const mongoose = require('mongoose');

// 1️⃣ Define Schema
const accountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, unique: true, required: true },
    balance: { type: Number, default: 0 }
}, { timestamps: true });

// 2️⃣ Export model safely
module.exports = mongoose.models.Account || mongoose.model('Account', accountSchema);