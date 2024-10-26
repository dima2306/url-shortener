const mongoose = require('mongoose');
const urlSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: [true, 'URL is required'],
    },
    shortenedUrl: {
        type: String,
        required: [true, 'Shortened URL is required'],
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

const UrlModel = mongoose.model('URL', urlSchema);

module.exports = UrlModel;
