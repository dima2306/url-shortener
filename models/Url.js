const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortenedUrl: {
        type: String,
        required: true,
        unique: true,
    },
    visibility: {
        type: Boolean,
        required: false,
        default: true,
    },
    expiration: {
        type: Number,
        required: false,
        default: null,
    },
}, { timestamps: true });

const URL = mongoose.model('URL', urlSchema);

module.exports = URL;
