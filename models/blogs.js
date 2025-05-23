const mongoose = require('mongoose');
const { create } = require('./users');

const blogSChema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    Images: [{
        imageUrl: {
            type: String,
            required: true,
        },
    }],
   likes: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}]
});
module.exports = mongoose.model('Blog', blogSChema);