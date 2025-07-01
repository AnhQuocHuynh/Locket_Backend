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

async function testWithExistingUsers() {
    log('🧪 Testing with Existing Users', 'yellow');
    log('==============================', 'yellow');

    // Use existing users from the debug result
    const user1Email = 'test@example.com';
    const user2Email = 'test2@example.com';

    log('\n🔑 Logging in users...', 'blue');

    // Login User 1
    const login1 = await makeRequest('POST', '/auth/login', {
        email: user1Email,
        password: 'Password123'
    });

    if (!login1.success) {
        log('❌ Cannot login User 1', 'red');
        return;
    }

    // Login User 2  
    const login2 = await makeRequest('POST', '/auth/login', {
        email: user2Email,
        password: 'Password123'
    });

    if (!login2.success) {
        log('❌ Cannot login User 2', 'red');
        return;
    }

    const user1Token = login1.data.token;
    const user2Token = login2.data.token;
    const user1Data = login1.data.user;
    const user2Data = login2.data.user;

    log('✅ Both users logged in successfully', 'green');
    console.log(`   User 1: ${user1Data.username} (${user1Data.id})`);
    console.log(`   User 2: ${user2Data.username} (${user2Data.id})`);

    // Clear any existing friend requests/friendships
    log('\n🧹 Checking existing relationships...', 'blue');
    
    const allRequests1 = await makeRequest('GET', '/friends/requests/all', null, user1Token);
    const allRequests2 = await makeRequest('GET', '/friends/requests/all', null, user2Token);
    
    if (allRequests1.success && allRequests1.data.counts.total > 0) {
        log('   User 1 has existing requests', 'yellow');
    }
    
    if (allRequests2.success && allRequests2.data.counts.total > 0) {
        log('   User 2 has existing requests', 'yellow');
    }

    // Send fresh friend request
    log('\n📤 Sending fresh friend request...', 'blue');
    
    const sendResponse = await makeRequest('POST', '/friends/request', {
        recipientId: user2Data.id,
        message: 'Fresh test friend request!'
    }, user1Token);

    if (sendResponse.success) {
        log('✅ Friend request sent successfully', 'green');
        console.log('   Friendship ID:', sendResponse.data.data._id);
        
        // Immediately check received requests for User 2
        log('\n📥 Checking received requests for User 2...', 'blue');
        
        const receivedResponse = await makeRequest('GET', '/friends/requests', null, user2Token);
        
        if (receivedResponse.success) {
            console.log('   Response:', JSON.stringify(receivedResponse.data, null, 2));
            
            if (receivedResponse.data.count > 0) {
                log('🎉 SUCCESS! User 2 can see the friend request!', 'green');
            } else {
                log('❌ PROBLEM: User 2 still cannot see the friend request', 'red');
            }
        } else {
            log('❌ Error checking received requests', 'red');
            console.log('   Error:', receivedResponse.error);
        }

        // Check sent requests for User 1
        log('\n📤 Checking sent requests for User 1...', 'blue');
        
        const sentResponse = await makeRequest('GET', '/friends/requests/sent', null, user1Token);
        
        if (sentResponse.success) {
            console.log('   Response:', JSON.stringify(sentResponse.data, null, 2));
        }

    } else {
        log('❌ Error sending friend request', 'red');
        console.log('   Error:', sendResponse.error);
    }
}

async function main() {
    log('🔍 Checking if server is running...', 'blue');
    
    try {
        await axios.get(`${BASE_URL}/api/health`);
        log('✅ Server is running', 'green');
    } catch (error) {
        log('❌ Server is not running!', 'red');
        process.exit(1);
    }

    await testWithExistingUsers();
}

main().catch(console.error); 