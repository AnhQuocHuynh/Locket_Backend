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

async function checkSpecificUsers() {
    log('🔍 Checking Specific Users from Your Data', 'yellow');
    log('=========================================', 'yellow');

    // Based on your data:
    // requester: "685d20885661ac7152826e23" (User 1 - sender)
    // recipient: "685ebd3640d364b12d504257" (User 2 - receiver, username: "testuser")

    log('\n📝 From your data:', 'blue');
    console.log('   User 1 (Sender) ID: 685d20885661ac7152826e23');
    console.log('   User 2 (Receiver) ID: 685ebd3640d364b12d504257 (username: testuser)');
    console.log('   Friendship ID: 685eceecf17ce6bee8efac26');

    // We need to find out which tokens belong to which users
    // Let's try different login combinations

    log('\n🔍 Trying to identify users...', 'blue');

    // Try common test emails
    const testEmails = [
        'test@example.com',
        'test2@example.com', 
        'testuser@example.com',
        'user1@test.com',
        'user2@test.com',
        'friend1@example.com',
        'friend2@example.com'
    ];

    let user1Token = null;
    let user2Token = null;
    let user1Data = null;
    let user2Data = null;

    for (const email of testEmails) {
        const response = await makeRequest('POST', '/auth/login', {
            email: email,
            password: 'Password123'
        });

        if (response.success && response.data.success) {
            const userId = response.data.user.id;
            const username = response.data.user.username;
            
            console.log(`   ✅ Found user: ${email} → ID: ${userId}, Username: ${username}`);
            
            if (userId === '685d20885661ac7152826e23') {
                user1Token = response.data.token;
                user1Data = response.data.user;
                log(`   🎯 This is User 1 (Sender): ${username}`, 'green');
            } else if (userId === '685ebd3640d364b12d504257') {
                user2Token = response.data.token;
                user2Data = response.data.user;
                log(`   🎯 This is User 2 (Receiver): ${username}`, 'green');
            }
        }
    }

    if (!user1Token || !user2Token) {
        log('\n❌ Cannot find tokens for both users', 'red');
        log('Please provide the correct email/password for these users:', 'yellow');
        console.log('   User 1 ID: 685d20885661ac7152826e23');
        console.log('   User 2 ID: 685ebd3640d364b12d504257');
        return;
    }

    log('\n✅ Found both users!', 'green');
    console.log(`   User 1 (${user1Data.username}): ${user1Data.email}`);
    console.log(`   User 2 (${user2Data.username}): ${user2Data.email}`);

    // Now check the friend requests with correct tokens
    log('\n🔍 Checking sent requests for User 1 (Sender)...', 'blue');
    const sentResponse = await makeRequest('GET', '/friends/requests/sent', null, user1Token);
    
    if (sentResponse.success) {
        console.log('   Response:', JSON.stringify(sentResponse.data, null, 2));
    } else {
        log('❌ Error getting sent requests', 'red');
        console.log('   Error:', sentResponse.error);
    }

    log('\n🔍 Checking received requests for User 2 (Receiver)...', 'blue');
    const receivedResponse = await makeRequest('GET', '/friends/requests', null, user2Token);
    
    if (receivedResponse.success) {
        console.log('   Response:', JSON.stringify(receivedResponse.data, null, 2));
        
        if (receivedResponse.data.count === 0) {
            log('\n⚠️  User 2 has no received requests!', 'yellow');
            log('This could mean:', 'yellow');
            console.log('   1. The request was already accepted');
            console.log('   2. The request was deleted/cancelled');
            console.log('   3. There\'s a data inconsistency');
        } else {
            log('\n✅ User 2 has received requests!', 'green');
        }
    } else {
        log('❌ Error getting received requests', 'red');
        console.log('   Error:', receivedResponse.error);
    }

    // Check if they are already friends
    log('\n🔍 Checking if users are already friends...', 'blue');
    const friendsResponse1 = await makeRequest('GET', '/friends', null, user1Token);
    const friendsResponse2 = await makeRequest('GET', '/friends', null, user2Token);

    if (friendsResponse1.success && friendsResponse2.success) {
        console.log('   User 1 friends count:', friendsResponse1.data.data.length);
        console.log('   User 2 friends count:', friendsResponse2.data.data.length);
        
        if (friendsResponse1.data.data.length > 0 || friendsResponse2.data.data.length > 0) {
            log('   💡 They might already be friends!', 'yellow');
        }
    }

    // Check all requests for both users
    log('\n🔍 Checking all requests for both users...', 'blue');
    const allResponse1 = await makeRequest('GET', '/friends/requests/all', null, user1Token);
    const allResponse2 = await makeRequest('GET', '/friends/requests/all', null, user2Token);

    if (allResponse1.success) {
        console.log('   User 1 all requests:', JSON.stringify(allResponse1.data, null, 2));
    }

    if (allResponse2.success) {
        console.log('   User 2 all requests:', JSON.stringify(allResponse2.data, null, 2));
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

    await checkSpecificUsers();
}

main().catch(console.error); 