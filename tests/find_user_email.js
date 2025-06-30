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

async function findUserEmail() {
    log('🔍 Finding Email for testuser1', 'yellow');
    log('================================', 'yellow');

    // Target user: testuser1 (ID: 685f7dc8e8676f28e101fcb2)
    const targetUserId = '685f7dc8e8676f28e101fcb2';
    const targetUsername = 'testuser1';

    log(`\n🎯 Looking for user: ${targetUsername} (ID: ${targetUserId})`, 'blue');

    // Try common email patterns
    const emailPatterns = [
        'testuser1@example.com',
        'testuser1@test.com',
        'user1@example.com',
        'user1@test.com',
        'test1@example.com',
        'test1@test.com',
        'testuser1@gmail.com',
        'testuser1@mail.com'
    ];

    log('\n🔑 Trying common email patterns...', 'blue');

    for (const email of emailPatterns) {
        const response = await makeRequest('POST', '/auth/login', {
            email: email,
            password: 'Password123'
        });

        if (response.success && response.data.success) {
            const userId = response.data.user.id;
            const username = response.data.user.username;
            
            console.log(`   ✅ Found user: ${email} → ID: ${userId}, Username: ${username}`);
            
            if (userId === targetUserId && username === targetUsername) {
                log(`\n🎉 FOUND TARGET USER!`, 'green');
                console.log(`   Email: ${email}`);
                console.log(`   Username: ${username}`);
                console.log(`   ID: ${userId}`);
                
                // Test received requests for this user
                log('\n📥 Testing received requests for testuser1...', 'blue');
                const receivedResponse = await makeRequest('GET', '/friends/requests', null, response.data.token);
                
                if (receivedResponse.success) {
                    console.log('   Response:', JSON.stringify(receivedResponse.data, null, 2));
                    
                    if (receivedResponse.data.count > 0) {
                        log('🎉 SUCCESS! testuser1 can see received friend requests!', 'green');
                    } else {
                        log('❌ testuser1 has no received requests', 'red');
                    }
                } else {
                    log('❌ Error getting received requests', 'red');
                    console.log('   Error:', receivedResponse.error);
                }
                
                return;
            }
        } else {
            console.log(`   ❌ Failed: ${email}`);
        }
    }

    log('\n❌ Could not find email for testuser1', 'red');
    log('💡 You may need to register this user first:', 'yellow');
    console.log('   POST /auth/register');
    console.log('   {');
    console.log('     "username": "testuser1",');
    console.log('     "email": "testuser1@example.com",');
    console.log('     "password": "Password123"');
    console.log('   }');
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

    await findUserEmail();
}

main().catch(console.error); 