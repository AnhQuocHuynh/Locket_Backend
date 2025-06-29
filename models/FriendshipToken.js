const mongoose = require('mongoose');

const FriendshipTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Token sẽ tự động bị xóa khỏi database sau 24 giờ
        expires: '24h',
    },
});

module.exports = mongoose.model('FriendshipToken', FriendshipTokenSchema);
