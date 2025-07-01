const axios = require('axios');

// Base URL configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Fresh test data for friend requests
const testUser1 = {
    username: 'frienduser1',
    email: 'friend1@example.com',
    password: 'Password123'
};

const testUser2 = {
    username: 'frienduser2',
    email: 'friend2@example.com',
    password: 'Password123'
};

let user1Token = '';
let user2Token = '';
let user1Id = '';
let user2Id = '';
let friendshipId = '';

// Color console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to make requests
async function makeRequest(method, url, data = null, token = null) {
    try {
        const config = {
            method,
            url: `${API_URL}${url}`,
            headers: {}
        };

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (data) {
            config.data = data;
            config.headers['Content-Type'] = 'application/json';
        }

        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
            status: error.response?.status || 500
        };
    }
}

async function setupUsers() {
    log('\n🔧 Setting up test users...', 'blue');
    
    // Register User 1
    const response1 = await makeRequest('POST', '/auth/register', testUser1);
    if (response1.success && response1.data.success) {
        user1Token = response1.data.token;
        user1Id = response1.data.user.id;
        log('✅ User 1 registered', 'green');
        console.log('   ID:', user1Id);
        console.log('   Username:', response1.data.user.username);
    } else {
        log('❌ User 1 registration failed', 'red');
        console.log('   Error:', response1.error);
        return false;
    }

    // Register User 2
    const response2 = await makeRequest('POST', '/auth/register', testUser2);
    if (response2.success && response2.data.success) {
        user2Token = response2.data.token;
        user2Id = response2.data.user.id;
        log('✅ User 2 registered', 'green');
        console.log('   ID:', user2Id);
        console.log('   Username:', response2.data.user.username);
    } else {
        log('❌ User 2 registration failed', 'red');
        console.log('   Error:', response2.error);
        return false;
    }

    return true;
}

async function testSendFriendRequest() {
    log('\n🔍 Testing Send Friend Request', 'blue');
    
    const requestData = {
        recipientId: user2Id,
        message: 'Hello! Let\'s be friends!'
    };

    const response = await makeRequest('POST', '/friends/request', requestData, user1Token);
    
    if (response.success && response.data.success) {
        log('✅ Send friend request passed', 'green');
        friendshipId = response.data.data._id;
        console.log('   Friendship ID:', friendshipId);
        console.log('   Message:', response.data.data.requestMessage);
        console.log('   Status:', response.data.data.status);
        console.log('   Requester:', response.data.data.requester);
        console.log('   Recipient:', response.data.data.recipient);
    } else {
        log('❌ Send friend request failed', 'red');
        console.log('   Error:', response.error);
        return false;
    }

    return true;
}

async function testGetReceivedRequests() {
    log('\n🔍 Testing Get Received Friend Requests (User 2)', 'blue');
    
    const response = await makeRequest('GET', '/friends/requests', null, user2Token);
    
    if (response.success && response.data.success) {
        log('✅ Get received friend requests passed', 'green');
        console.log('   Received requests count:', response.data.count);
        
        if (response.data.count > 0) {
            const request = response.data.data[0];
            console.log('   First request details:');
            console.log('     From:', request.requester.username);
            console.log('     Message:', request.requestMessage);
            console.log('     Status:', request.status);
            console.log('     Created:', request.createdAt);
        } else {
            log('⚠️  No received requests found', 'yellow');
        }
    } else {
        log('❌ Get received friend requests failed', 'red');
        console.log('   Error:', response.error);
    }
}

async function testGetSentRequests() {
    log('\n🔍 Testing Get Sent Friend Requests (User 1)', 'blue');
    
    const response = await makeRequest('GET', '/friends/requests/sent', null, user1Token);
    
    if (response.success && response.data.success) {
        log('✅ Get sent friend requests passed', 'green');
        console.log('   Sent requests count:', response.data.count);
        
        if (response.data.count > 0) {
            const request = response.data.data[0];
            console.log('   First request details:');
            console.log('     To:', request.recipient.username);
            console.log('     Message:', request.requestMessage);
            console.log('     Status:', request.status);
            console.log('     Created:', request.createdAt);
        } else {
            log('⚠️  No sent requests found', 'yellow');
        }
    } else {
        log('❌ Get sent friend requests failed', 'red');
        console.log('   Error:', response.error);
    }
}

async function testGetAllRequests() {
    log('\n🔍 Testing Get All Friend Requests', 'blue');
    
    // Test for User 1
    const response1 = await makeRequest('GET', '/friends/requests/all', null, user1Token);
    
    if (response1.success && response1.data.success) {
        log('✅ Get all friend requests (User 1) passed', 'green');
        console.log('   Received count:', response1.data.counts.received);
        console.log('   Sent count:', response1.data.counts.sent);
        console.log('   Total count:', response1.data.counts.total);
    } else {
        log('❌ Get all friend requests (User 1) failed', 'red');
        console.log('   Error:', response1.error);
    }

    // Test for User 2
    const response2 = await makeRequest('GET', '/friends/requests/all', null, user2Token);
    
    if (response2.success && response2.data.success) {
        log('✅ Get all friend requests (User 2) passed', 'green');
        console.log('   Received count:', response2.data.counts.received);
        console.log('   Sent count:', response2.data.counts.sent);
        console.log('   Total count:', response2.data.counts.total);
    } else {
        log('❌ Get all friend requests (User 2) failed', 'red');
        console.log('   Error:', response2.error);
    }
}

async function testAcceptFriendRequest() {
    log('\n🔍 Testing Accept Friend Request', 'blue');
    
    if (!friendshipId) {
        log('❌ No friendship ID available for accept test', 'red');
        return false;
    }

    const response = await makeRequest('POST', `/friends/accept/${friendshipId}`, null, user2Token);
    
    if (response.success && response.data.success) {
        log('✅ Accept friend request passed', 'green');
        console.log('   Friendship status:', response.data.data.status);
        console.log('   Updated at:', response.data.data.updatedAt);
    } else {
        log('❌ Accept friend request failed', 'red');
        console.log('   Error:', response.error);
        return false;
    }

    return true;
}

async function testGetFriendsList() {
    log('\n🔍 Testing Get Friends List', 'blue');
    
    // Test for User 1
    const response1 = await makeRequest('GET', '/friends', null, user1Token);
    
    if (response1.success && response1.data.success) {
        log('✅ Get friends list (User 1) passed', 'green');
        console.log('   Friends count:', response1.data.data.length);
        
        if (response1.data.data.length > 0) {
            console.log('   First friend:', response1.data.data[0].username);
        }
    } else {
        log('❌ Get friends list (User 1) failed', 'red');
        console.log('   Error:', response1.error);
    }

    // Test for User 2
    const response2 = await makeRequest('GET', '/friends', null, user2Token);
    
    if (response2.success && response2.data.success) {
        log('✅ Get friends list (User 2) passed', 'green');
        console.log('   Friends count:', response2.data.data.length);
        
        if (response2.data.data.length > 0) {
            console.log('   First friend:', response2.data.data[0].username);
        }
    } else {
        log('❌ Get friends list (User 2) failed', 'red');
        console.log('   Error:', response2.error);
    }
}

async function testRemoveFriend() {
    log('\n🔍 Testing Remove Friend', 'blue');
    
    if (!friendshipId) {
        log('❌ No friendship ID available for remove test', 'red');
        return;
    }

    const response = await makeRequest('DELETE', `/friends/${friendshipId}`, null, user1Token);
    
    if (response.success && response.data.success) {
        log('✅ Remove friend passed', 'green');
        console.log('   Message:', response.data.message);
    } else {
        log('❌ Remove friend failed', 'red');
        console.log('   Error:', response.error);
    }
}

async function runFriendRequestTests() {
    log('🚀 Starting Friend Request Tests', 'yellow');
    log('================================', 'yellow');

    try {
        // Setup users
        const setupSuccess = await setupUsers();
        if (!setupSuccess) {
            log('❌ User setup failed, stopping tests', 'red');
            return;
        }

        // Test friend request flow
        const sendSuccess = await testSendFriendRequest();
        if (!sendSuccess) {
            log('❌ Send friend request failed, stopping tests', 'red');
            return;
        }

        await testGetReceivedRequests();
        await testGetSentRequests();
        await testGetAllRequests();

        const acceptSuccess = await testAcceptFriendRequest();
        if (acceptSuccess) {
            await testGetFriendsList();
            await testRemoveFriend();
        }

        log('\n🎉 Friend request tests completed!', 'yellow');
        log('================================', 'yellow');

    } catch (error) {
        log('\n💥 Test runner error:', 'red');
        console.error(error);
    }
}

// Check if server is running before starting tests
async function checkServerStatus() {
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        return true;
    } catch (error) {
        return false;
    }
}

// Start tests
async function main() {
    log('🔍 Checking if server is running...', 'blue');
    
    const serverRunning = await checkServerStatus();
    
    if (!serverRunning) {
        log('❌ Server is not running!', 'red');
        log('Please start the server first with: npm start', 'yellow');
        log('Or use: node server.js', 'yellow');
        process.exit(1);
    }

    log('✅ Server is running, starting friend request tests...', 'green');
    await runFriendRequestTests();
}

main().catch(console.error); 