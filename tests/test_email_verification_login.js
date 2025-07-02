const axios = require('axios');

// Base URL configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Generate unique identifiers to avoid conflicts
const UNIQUE = Date.now().toString(36);

const testUser = {
    username: `verify_test_${UNIQUE}`,
    email: `verify_test_${UNIQUE}@example.com`,
    password: 'Password123'
};

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

async function makeRequest(method, endpoint, data = null, token = null) {
    try {
        const config = {
            method,
            url: `${API_URL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        if (data) {
            config.data = data;
        }

        const response = await axios(config);
        return { success: true, data: response.data, status: response.status };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message,
            status: error.response?.status,
            data: error.response?.data
        };
    }
}

async function testEmailVerificationRequirement() {
    log('\n🧪 Testing Email Verification Requirement for Login', 'blue');
    
    // Step 1: Register a new user
    log('\n📝 Step 1: Registering new user...', 'yellow');
    const registerResponse = await makeRequest('POST', '/auth/register', testUser);
    
    if (!registerResponse.success || !registerResponse.data.success) {
        log('❌ Failed to register user', 'red');
        console.log('   Error:', registerResponse.error);
        return false;
    }
    
    log('✅ User registered successfully', 'green');
    console.log('   User ID:', registerResponse.data.user.id);
    console.log('   Username:', registerResponse.data.user.username);
    
    const verificationCode = registerResponse.data.devVerificationCode;
    if (verificationCode) {
        log(`   Verification code: ${verificationCode}`, 'yellow');
    }

    // Step 2: Try to login without email verification
    log('\n🔐 Step 2: Attempting login without email verification...', 'yellow');
    const loginResponse = await makeRequest('POST', '/auth/login', {
        email: testUser.email,
        password: testUser.password
    });
    
    // Should fail with 403 and requiresEmailVerification: true
    if (!loginResponse.success && loginResponse.status === 403) {
        if (loginResponse.data?.requiresEmailVerification) {
            log('✅ Login correctly blocked due to unverified email', 'green');
            console.log('   Message:', loginResponse.data.message);
            console.log('   Email:', loginResponse.data.email);
        } else {
            log('❌ Login failed but not due to email verification', 'red');
            console.log('   Response:', loginResponse.data);
            return false;
        }
    } else {
        log('❌ Login should have been blocked for unverified email', 'red');
        console.log('   Status:', loginResponse.status);
        console.log('   Response:', loginResponse.data);
        return false;
    }

    // Step 3: Verify email if we have the code
    if (verificationCode) {
        log('\n✉️ Step 3: Verifying email...', 'yellow');
        const verifyResponse = await makeRequest('POST', '/auth/verify-email', {
            code: verificationCode
        });
        
        if (verifyResponse.success && verifyResponse.data.success) {
            log('✅ Email verified successfully', 'green');
        } else {
            log('❌ Email verification failed', 'red');
            console.log('   Error:', verifyResponse.error);
            return false;
        }

        // Step 4: Try login again after verification
        log('\n🔐 Step 4: Attempting login after email verification...', 'yellow');
        const loginAfterVerifyResponse = await makeRequest('POST', '/auth/login', {
            email: testUser.email,
            password: testUser.password
        });
        
        if (loginAfterVerifyResponse.success && loginAfterVerifyResponse.data.success) {
            log('✅ Login successful after email verification', 'green');
            console.log('   Token received:', !!loginAfterVerifyResponse.data.token);
            console.log('   User ID:', loginAfterVerifyResponse.data.user.id);
        } else {
            log('❌ Login failed after email verification', 'red');
            console.log('   Error:', loginAfterVerifyResponse.error);
            return false;
        }
    } else {
        log('⚠️ No verification code available (production mode), skipping verification test', 'yellow');
    }

    return true;
}

async function checkServerHealth() {
    try {
        const response = await axios.get(`${BASE_URL}/api/health`);
        if (response.status === 200) {
            log('✅ Server is running', 'green');
            return true;
        }
    } catch (error) {
        log('❌ Server is not running!', 'red');
        console.log('   Please start the server with: npm start');
        return false;
    }
}

async function main() {
    log('🔍 Email Verification Login Test', 'blue');
    log('=====================================', 'blue');
    
    // Check if server is running
    const serverOk = await checkServerHealth();
    if (!serverOk) {
        process.exit(1);
    }

    // Run the test
    const testPassed = await testEmailVerificationRequirement();
    
    log('\n📊 Test Summary', 'blue');
    log('=================', 'blue');
    
    if (testPassed) {
        log('✅ All email verification login tests passed!', 'green');
        process.exit(0);
    } else {
        log('❌ Some tests failed!', 'red');
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
    log('❌ Unhandled rejection:', 'red');
    console.error(err);
    process.exit(1);
});

// Run the test
main(); 