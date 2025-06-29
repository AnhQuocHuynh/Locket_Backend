const mongoose = require('mongoose');

const FriendshipSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Requester is required']
    },
    recipient: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Recipient is required']
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'blocked'],
        default: 'pending'
    },
    requestMessage: {
        type: String,
        trim: true,
        maxlength: [200, 'Request message cannot exceed 200 characters']
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate friend requests
FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Index for efficient queries
FriendshipSchema.index({ requester: 1, status: 1 });
FriendshipSchema.index({ recipient: 1, status: 1 });

// Static method to create friendship
FriendshipSchema.statics.createFriendship = async function(requesterId, recipientId, message = '') {
    // Check if friendship already exists
    const existingFriendship = await this.findOne({
        $or: [
            { requester: requesterId, recipient: recipientId },
            { requester: recipientId, recipient: requesterId }
        ]
    });

    if (existingFriendship) {
        throw new Error('Friendship already exists');
    }

    // Check if users are not the same
    if (requesterId.toString() === recipientId.toString()) {
        throw new Error('Cannot send friend request to yourself');
    }

    return await this.create({
        requester: requesterId,
        recipient: recipientId,
        requestMessage: message
    });
};

// Static method to accept friendship
FriendshipSchema.statics.acceptFriendship = async function(friendshipId, userId) {
    const friendship = await this.findById(friendshipId);
    
    if (!friendship) {
        throw new Error('Friendship not found');
    }

    if (friendship.recipient.toString() !== userId.toString()) {
        throw new Error('Only recipient can accept friend request');
    }

    if (friendship.status !== 'pending') {
        throw new Error('Friend request is not pending');
    }

    friendship.status = 'accepted';
    await friendship.save();

    // Add users to each other's friends list
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(friendship.requester, {
        $addToSet: { friends: friendship.recipient }
    });
    await User.findByIdAndUpdate(friendship.recipient, {
        $addToSet: { friends: friendship.requester }
    });

    return friendship;
};

// Static method to decline a friend request
FriendshipSchema.statics.declineFriendship = async function(friendshipId, userId) {
    const friendship = await this.findById(friendshipId);

    if (!friendship) {
        throw new Error('Friendship not found');
    }

    if (friendship.recipient.toString() !== userId.toString()) {
        throw new Error('Only the recipient can decline the friend request');
    }

    if (friendship.status !== 'pending') {
        throw new Error('Friend request is not pending');
    }

    friendship.status = 'declined';
    await friendship.save();
    return friendship;
};

// Static method to cancel a sent friend request
FriendshipSchema.statics.cancelFriendship = async function(friendshipId, userId) {
    const friendship = await this.findById(friendshipId);

    if (!friendship) {
        throw new Error('Friendship not found');
    }

    if (friendship.requester.toString() !== userId.toString()) {
        throw new Error('Only the requester can cancel the friend request');
    }

    if (friendship.status !== 'pending') {
        throw new Error('Cannot cancel a request that is not pending');
    }

    // Instead of deleteOne(), use findByIdAndDelete() for consistency
    await this.findByIdAndDelete(friendshipId);
    return true;
};

// Static method to remove friendship
FriendshipSchema.statics.removeFriendship = async function(currentUserId, friendToRemoveId) {
    const User = mongoose.model('User');

    // 1. Tìm bản ghi Friendship giữa hai người dùng.
    // Đây là nguồn dữ liệu chính xác nhất cho mối quan hệ.
    const friendship = await this.findOne({
        $or: [
            { requester: currentUserId, recipient: friendToRemoveId },
            { requester: friendToRemoveId, recipient: currentUserId }
        ]
    });

    // Nếu không tìm thấy, họ không phải là bạn bè để xóa.
    if (!friendship) {
        throw new Error('Không tìm thấy mối quan hệ bạn bè.');
    }

    // 2. Xóa ID của nhau khỏi mảng 'friends' của mỗi người.
    // Lệnh $pull sẽ xóa an toàn ID khỏi mảng.
    await User.findByIdAndUpdate(currentUserId, {
        $pull: { friends: friendToRemoveId }
    });
    await User.findByIdAndUpdate(friendToRemoveId, {
        $pull: { friends: currentUserId }
    });

    // 3. Cuối cùng, xóa bản ghi Friendship.
    await this.findByIdAndDelete(friendship._id);

    return true; // Báo hiệu thành công
};

// Static method to get friends list
FriendshipSchema.statics.getFriendsList = async function(userId) {
    const friendships = await this.find({
        $or: [
            { requester: userId, status: 'accepted' },
            { recipient: userId, status: 'accepted' }
        ]
    }).populate('requester recipient', 'username displayName profilePicture');

    return friendships.map(friendship => {
        const friend = friendship.requester._id.toString() === userId.toString() 
            ? friendship.recipient 
            : friendship.requester;
        return friend;
    });
};

// Static method to get pending requests
FriendshipSchema.statics.getPendingRequests = async function(userId) {
    return await this.find({
        recipient: userId,
        status: 'pending'
    }).populate('requester', 'username displayName profilePicture');
};

module.exports = mongoose.model('Friendship', FriendshipSchema); 