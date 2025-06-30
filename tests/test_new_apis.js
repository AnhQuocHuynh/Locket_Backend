const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let testUserId = '';
let testNotificationId = '';

// Test data
const testUser = {
    username: 'testuser_new',
    email: 'testuser_new@example.com',
    password: 'TestPass123'
};

const testUser2 = {
    username: 'testuser2_new',
    email: 'testuser2_new@example.com',
    password: 'TestPass123'
};

// Helper function to log test results
const logTest = (testName, success, data = null, error = null) => {
    const status = success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
    if (data) console.log('   Data:', JSON.stringify(data, null, 2));
    if (error) console.log('   Error:', error);
    console.log('');
};

// Test 1: User Registration
async function testRegistration() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
        logTest('User Registration', true, response.data);
        return response.data.token;
    } catch (error) {
        logTest('User Registration', false, null, error.response?.data || error.message);
        return null;
    }
}

// Test 2: User Login
async function testLogin() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        logTest('User Login', true, response.data);
        return response.data.token;
    } catch (error) {
        logTest('User Login', false, null, error.response?.data || error.message);
        return null;
    }
}

// Test 3: Get Notifications
async function testGetNotifications() {
    try {
        const response = await axios.get(`${BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get Notifications', true, response.data);
        return response.data.data.notifications;
    } catch (error) {
        logTest('Get Notifications', false, null, error.response?.data || error.message);
        return [];
    }
}

// Test 4: Get Unread Count
async function testGetUnreadCount() {
    try {
        const response = await axios.get(`${BASE_URL}/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get Unread Count', true, response.data);
        return response.data.data.unreadCount;
    } catch (error) {
        logTest('Get Unread Count', false, null, error.response?.data || error.message);
        return 0;
    }
}

// Test 5: Mark Notification as Read
async function testMarkNotificationRead() {
    if (!testNotificationId) {
        logTest('Mark Notification Read', false, null, 'No notification ID available');
        return false;
    }

    try {
        const response = await axios.put(`${BASE_URL}/notifications/${testNotificationId}/read`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Mark Notification Read', true, response.data);
        return true;
    } catch (error) {
        logTest('Mark Notification Read', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test 6: Mark All Notifications as Read
async function testMarkAllNotificationsRead() {
    try {
        const response = await axios.put(`${BASE_URL}/notifications/read-all`, {}, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Mark All Notifications Read', true, response.data);
        return true;
    } catch (error) {
        logTest('Mark All Notifications Read', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test 7: User Search
async function testUserSearch() {
    try {
        const response = await axios.get(`${BASE_URL}/users/search?q=test`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('User Search', true, response.data);
        return response.data.data.users;
    } catch (error) {
        logTest('User Search', false, null, error.response?.data || error.message);
        return [];
    }
}

// Test 8: User Suggestions
async function testUserSuggestions() {
    try {
        const response = await axios.get(`${BASE_URL}/users/suggestions`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('User Suggestions', true, response.data);
        return response.data.data.suggestions;
    } catch (error) {
        logTest('User Suggestions', false, null, error.response?.data || error.message);
        return [];
    }
}

// Test 9: Change Password
async function testChangePassword() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/change-password`, {
            currentPassword: testUser.password,
            newPassword: 'NewTestPass123',
            confirmPassword: 'NewTestPass123'
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Change Password', true, response.data);
        
        // Change back to original password
        await axios.post(`${BASE_URL}/auth/change-password`, {
            currentPassword: 'NewTestPass123',
            newPassword: testUser.password,
            confirmPassword: testUser.password
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        return true;
    } catch (error) {
        logTest('Change Password', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test 10: Forgot Password
async function testForgotPassword() {
    try {
        const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
            email: testUser.email
        });
        logTest('Forgot Password', true, response.data);
        return true;
    } catch (error) {
        logTest('Forgot Password', false, null, error.response?.data || error.message);
        return false;
    }
}

// Test 11: Get User Profile by ID
async function testGetUserProfile() {
    try {
        const response = await axios.get(`${BASE_URL}/users/${testUserId}`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        logTest('Get User Profile by ID', true, response.data);
        return response.data.data.user;
    } catch (error) {
        logTest('Get User Profile by ID', false, null, error.response?.data || error.message);
        return null;
    }
}

// Test 12: Delete Account
async function testDeleteAccount() {
    try {
        const response = await axios.delete(`${BASE_URL}/auth/account`, {
            headers: { Authorization: `Bearer ${authToken}` },
            data: { password: testUser.password }
        });
        logTest('Delete Account', true, response.data);
        return true;
    } catch (error) {
        logTest('Delete Account', false, null, error.response?.data || error.message);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🧪 Testing New APIs...\n');

    // Test registration and login
    authToken = await testRegistration();
    if (!authToken) {
        authToken = await testLogin();
    }

    if (!authToken) {
        console.log('❌ Cannot proceed without authentication token');
        return;
    }

    // Get user ID for profile tests
    try {
        const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        testUserId = profileResponse.data.user._id;
    } catch (error) {
        console.log('❌ Cannot get user profile');
        return;
    }

    // Test notifications APIs
    console.log('📱 Testing Notifications APIs:');
    const notifications = await testGetNotifications();
    if (notifications.length > 0) {
        testNotificationId = notifications[0]._id;
    }
    await testGetUnreadCount();
    await testMarkNotificationRead();
    await testMarkAllNotificationsRead();

    // Test user search and discovery APIs
    console.log('🔍 Testing User Search & Discovery APIs:');
    await testUserSearch();
    await testUserSuggestions();
    await testGetUserProfile();

    // Test user management APIs
    console.log('👤 Testing User Management APIs:');
    await testChangePassword();
    await testForgotPassword();

    // Test account deletion (this will end the session)
    console.log('🗑️ Testing Account Deletion:');
    await testDeleteAccount();

    console.log('✅ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
    runAllTests().catch(console.error);
}

module.exports = {
    runAllTests,
    testRegistration,
    testLogin,
    testGetNotifications,
    testGetUnreadCount,
    testMarkNotificationRead,
    testMarkAllNotificationsRead,
    testUserSearch,
    testUserSuggestions,
    testChangePassword,
    testForgotPassword,
    testGetUserProfile,
    testDeleteAccount
}; 