const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    address: {
        line1: String,
        line2: String,
        city: String,
        state: String
    },
    additional_info: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('User', userSchema);
