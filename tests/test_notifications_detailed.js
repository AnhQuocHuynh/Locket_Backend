const axios = require('axios');
const mongoose = require('mongoose');

const BASE_URL = 'http://localhost:3000/api';

// Test data
const testUser1 = {
    username: 'notif_user1',
    email: 'notif_user1@example.com',
    password: 'TestPass123'
};

const testUser2 = {
    username: 'notif_user2',
    email: 'notif_user2@example.com',
    password: 'TestPass123'
};

let user1Token = '';
let user2Token = '';
let user1Id = '';
let user2Id = '';
let testNotificationId = '';

// Helper function to log test results
const logTest = (testName, success, data = null, error = null) => {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
    if (data) console.log('   Data:', JSON.stringify(data, null, 2));
    if (error) console.log('   Error:', error);
    console.log('');
};

// Register and login users
async function setupUsers() {
    try {
        // Register user 1
        const user1Response = await axios.post(`${BASE_URL}/auth/register`, testUser1);
        user1Token = user1Response.data.token;
        user1Id = user1Response.data.user.id;
        logTest('Register User 1', true, { username: testUser1.username });

        // Register user 2
        const user2Response = await axios.post(`${BASE_URL}/auth/register`, testUser2);
        user2Token = user2Response.data.token;
        user2Id = user2Response.data.user.id;
        logTest('Register User 2', true, { username: testUser2.username });

        return true;
    } catch (error) {
        // If registration fails, try login
        try {
            const login1 = await axios.post(`${BASE_URL}/auth/login`, {
                email: testUser1.email,
                password: testUser1.password
            });
            user1Token = login1.data.token;
            user1Id = login1.data.user.id;

            const login2 = await axios.post(`${BASE_URL}/auth/login`, {
                email: testUser2.email,
                password: testUser2.password
            });
            user2Token = login2.data.token;
            user2Id = login2.data.user.id;

            logTest('Login existing users', true);
            return true;
        } catch (loginError) {
            logTest('Setup Users', false, null, loginError.response?.data || loginError.message);
            return false;
        }
    }
}

// Create a test notification manually in database
async function createTestNotification() {
    try {
        // Connect to database
        const config = require('../config');
        await mongoose.connect(config.MONGODB_URI);

        const Notification = require('../models/Notification');
        
        const notification = await Notification.create({
            recipient: user1Id,
            sender: user2Id,
            type: 'friend_request',
            title: 'New Friend Request',
            message: `${testUser2.username} sent you a friend request`,
            data: { test: true }
        });

        testNotificationId = notification._id.toString();
        logTest('Create Test Notification', true, { id: testNotificationId });
        return true;
    } catch (error) {
        logTest('Create Test Notification', false, null, error.message);
        return false;
    }
}

// Test get notifications
async function testGetNotifications() {
    try {
        const response = await axios.get(`${BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        
        logTest('Get Notifications', true, {
            count: response.data.data.notifications.length,
            unreadCount: response.data.data.unreadCount
        });
        
        return response.data.data.notifications;
    } catch (error) {
        logTest('Get Notifications', false, null, error.response?.data || error.message);
        return [];
    }
}

// Test get unread count
async function testGetUnreadCount() {
    try {
        const response = await axios.get(`${BASE_URL}/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        
        logTest('Get Unread Count', true, response.data.data);
        return response.data.data.unreadCount;
    } catch (error) {
        logTest('Get Unread Count', false, null, error.response?.data || error.message);
        return 0;
    }
}

// Test mark notification as read
async function testMarkNotificationRead() {
    if (!testNotificationId) {
        logTest('Mark Notification Read', false, null, 'No notification ID available');
        return false;
    }

    try {
        const response = await axios.put(`${BASE_URL}/notifications/${testNotificationId}/read`, {}, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        
        logTest('Mark Notification Read', true, response.data);
        return true;
    } catch (error) {
        logTest('Mark Notification Read', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test mark all notifications as read
async function testMarkAllNotificationsRead() {
    try {
        const response = await axios.put(`${BASE_URL}/notifications/read-all`, {}, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        
        logTest('Mark All Notifications Read', true, response.data.data);
        return true;
    } catch (error) {
        logTest('Mark All Notifications Read', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test delete notification
async function testDeleteNotification() {
    if (!testNotificationId) {
        logTest('Delete Notification', false, null, 'No notification ID available');
        return false;
    }

    try {
        const response = await axios.delete(`${BASE_URL}/notifications/${testNotificationId}`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        
        logTest('Delete Notification', true, response.data);
        return true;
    } catch (error) {
        logTest('Delete Notification', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test pagination
async function testNotificationPagination() {
    try {
        const response = await axios.get(`${BASE_URL}/notifications?page=1&limit=5`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        
        logTest('Notification Pagination', true, {
            pagination: response.data.data.pagination
        });
        return true;
    } catch (error) {
        logTest('Notification Pagination', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test filter by type
async function testNotificationFilter() {
    try {
        const response = await axios.get(`${BASE_URL}/notifications?type=friend_request`, {
            headers: { Authorization: `Bearer ${user1Token}` }
        });
        
        logTest('Notification Filter by Type', true, {
            count: response.data.data.notifications.length,
            type: 'friend_request'
        });
        return true;
    } catch (error) {
        logTest('Notification Filter by Type', false, null, error.response?.data || error.message);
        return false;
    }
}

// Cleanup
async function cleanup() {
    try {
        // Delete test users
        await axios.delete(`${BASE_URL}/auth/account`, {
            headers: { Authorization: `Bearer ${user1Token}` },
            data: { password: testUser1.password }
        });

        await axios.delete(`${BASE_URL}/auth/account`, {
            headers: { Authorization: `Bearer ${user2Token}` },
            data: { password: testUser2.password }
        });

        // Close database connection
        await mongoose.connection.close();
        
        logTest('Cleanup', true);
    } catch (error) {
        logTest('Cleanup', false, null, error.message);
    }
}

// Main test runner
async function runDetailedNotificationTests() {
    console.log('🔔 Testing Notifications APIs in Detail...\n');

    // Setup
    const setupSuccess = await setupUsers();
    if (!setupSuccess) {
        console.log('❌ Cannot proceed without user setup');
        return;
    }

    // Create test notification
    await createTestNotification();

    // Test all notification endpoints
    console.log('📱 Testing Notification Endpoints:');
    await testGetNotifications();
    await testGetUnreadCount();
    await testMarkNotificationRead();
    await testGetUnreadCount(); // Check count after marking as read
    await testMarkAllNotificationsRead();
    await testNotificationPagination();
    await testNotificationFilter();
    
    // Test delete (should be last)
    await testDeleteNotification();
    
    // Verify deletion
    await testGetNotifications();

    // Cleanup
    await cleanup();

    console.log('✅ Detailed notification tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runDetailedNotificationTests().catch(console.error);
}

module.exports = {
    runDetailedNotificationTests
}; 