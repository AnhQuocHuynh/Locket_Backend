const axios = require('axios');

// Base URL configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

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

async function loginUser(email, password) {
    const response = await makeRequest('POST', '/auth/login', { email, password });
    if (response.success && response.data.success) {
        return {
            token: response.data.token,
            user: response.data.user
        };
    }
    return null;
}

async function debugFriendRequests() {
    log('🔍 Debug Friend Requests', 'yellow');
    log('========================', 'yellow');

    // Try to login with existing users
    const user1 = await loginUser('friend1@example.com', 'Password123');
    const user2 = await loginUser('friend2@example.com', 'Password123');

    if (!user1) {
        log('❌ Cannot login user 1 (friend1@example.com)', 'red');
        return;
    }

    if (!user2) {
        log('❌ Cannot login user 2 (friend2@example.com)', 'red');
        return;
    }

    log('✅ Both users logged in successfully', 'green');
    console.log('   User 1 ID:', user1.user.id);
    console.log('   User 2 ID:', user2.user.id);

    // Check received requests for User 2
    log('\n🔍 Checking received requests for User 2...', 'blue');
    const receivedResponse = await makeRequest('GET', '/friends/requests', null, user2.token);
    
    if (receivedResponse.success) {
        console.log('   Response:', JSON.stringify(receivedResponse.data, null, 2));
    } else {
        log('❌ Error getting received requests', 'red');
        console.log('   Error:', receivedResponse.error);
    }

    // Check sent requests for User 1
    log('\n🔍 Checking sent requests for User 1...', 'blue');
    const sentResponse = await makeRequest('GET', '/friends/requests/sent', null, user1.token);
    
    if (sentResponse.success) {
        console.log('   Response:', JSON.stringify(sentResponse.data, null, 2));
    } else {
        log('❌ Error getting sent requests', 'red');
        console.log('   Error:', sentResponse.error);
    }

    // Check all requests for both users
    log('\n🔍 Checking all requests for User 1...', 'blue');
    const allResponse1 = await makeRequest('GET', '/friends/requests/all', null, user1.token);
    
    if (allResponse1.success) {
        console.log('   Response:', JSON.stringify(allResponse1.data, null, 2));
    } else {
        log('❌ Error getting all requests for User 1', 'red');
        console.log('   Error:', allResponse1.error);
    }

    log('\n🔍 Checking all requests for User 2...', 'blue');
    const allResponse2 = await makeRequest('GET', '/friends/requests/all', null, user2.token);
    
    if (allResponse2.success) {
        console.log('   Response:', JSON.stringify(allResponse2.data, null, 2));
    } else {
        log('❌ Error getting all requests for User 2', 'red');
        console.log('   Error:', allResponse2.error);
    }

    // Try to send a new friend request
    log('\n🔍 Sending new friend request from User 1 to User 2...', 'blue');
    const sendResponse = await makeRequest('POST', '/friends/request', {
        recipientId: user2.user.id,
        message: 'Debug test friend request'
    }, user1.token);

    if (sendResponse.success) {
        log('✅ Friend request sent successfully', 'green');
        console.log('   Response:', JSON.stringify(sendResponse.data, null, 2));
        
        // Check again after sending
        log('\n🔍 Checking received requests for User 2 after sending...', 'blue');
        const newReceivedResponse = await makeRequest('GET', '/friends/requests', null, user2.token);
        
        if (newReceivedResponse.success) {
            console.log('   Response:', JSON.stringify(newReceivedResponse.data, null, 2));
        } else {
            log('❌ Error getting received requests after sending', 'red');
            console.log('   Error:', newReceivedResponse.error);
        }
    } else {
        log('❌ Error sending friend request', 'red');
        console.log('   Error:', sendResponse.error);
    }

    // Check friends list for both users
    log('\n🔍 Checking friends list for User 1...', 'blue');
    const friendsResponse1 = await makeRequest('GET', '/friends', null, user1.token);
    
    if (friendsResponse1.success) {
        console.log('   Response:', JSON.stringify(friendsResponse1.data, null, 2));
    } else {
        log('❌ Error getting friends list for User 1', 'red');
        console.log('   Error:', friendsResponse1.error);
    }

    log('\n🔍 Checking friends list for User 2...', 'blue');
    const friendsResponse2 = await makeRequest('GET', '/friends', null, user2.token);
    
    if (friendsResponse2.success) {
        console.log('   Response:', JSON.stringify(friendsResponse2.data, null, 2));
    } else {
        log('❌ Error getting friends list for User 2', 'red');
        console.log('   Error:', friendsResponse2.error);
    }
}

// Check if server is running before starting debug
async function checkServerStatus() {
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        return true;
    } catch (error) {
        return false;
    }
}

async function main() {
    log('🔍 Checking if server is running...', 'blue');
    
    const serverRunning = await checkServerStatus();
    
    if (!serverRunning) {
        log('❌ Server is not running!', 'red');
        log('Please start the server first with: npm start', 'yellow');
        process.exit(1);
    }

    log('✅ Server is running, starting debug...', 'green');
    await debugFriendRequests();
}

main().catch(console.error); 