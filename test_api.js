const axios = require('axios');

// Base URL configuration
const BASE_URL = 'http://localhost:3000';
const API_URL = `${BASE_URL}/api`;

// Test data
const testUser = {
    username: 'testuser123',
    email: 'test@example.com',
    password: 'Password123'
};

const testUser2 = {
    username: 'testuser456',
    email: 'test2@example.com',
    password: 'Password123'
};

const testPost = {
    imageUrl: 'https://example.com/test-image.jpg',
    caption: 'This is a test post'
};

let userToken = '';
let user2Token = '';
let createdPostId = '';

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

// Test functions
async function testHealthCheck() {
    log('\n🔍 Testing Health Check Endpoint', 'blue');
    
    const response = await makeRequest('GET', '/health');
    
    if (response.success && response.data.success) {
        log('✅ Health check passed', 'green');
        console.log('   Response:', JSON.stringify(response.data, null, 2));
    } else {
        log('❌ Health check failed', 'red');
        console.log('   Error:', response.error);
    }
}

async function testRootEndpoint() {
    log('\n🔍 Testing Root Endpoint', 'blue');
    
    // Test the actual root endpoint at /
    try {
        const response = await axios.get(BASE_URL);
        if (response.data && response.data.success) {
            log('✅ Root endpoint test passed', 'green');
            console.log('   Response:', JSON.stringify(response.data, null, 2));
        } else {
            log('❌ Root endpoint test failed', 'red');
            console.log('   Unexpected response:', response.data);
        }
    } catch (error) {
        log('❌ Root endpoint test failed', 'red');
        console.log('   Error:', error.response?.data || error.message);
    }
}

async function testUserRegistration() {
    log('\n🔍 Testing User Registration', 'blue');
    
    // Test user 1 registration
    const response1 = await makeRequest('POST', '/auth/register', testUser);
    
    if (response1.success && response1.data.success) {
        log('✅ User 1 registration passed', 'green');
        userToken = response1.data.token;
        console.log('   User ID:', response1.data.user.id);
        console.log('   Username:', response1.data.user.username);
    } else {
        log('❌ User 1 registration failed', 'red');
        console.log('   Error:', response1.error);
        return false;
    }

    // Test user 2 registration
    const response2 = await makeRequest('POST', '/auth/register', testUser2);
    
    if (response2.success && response2.data.success) {
        log('✅ User 2 registration passed', 'green');
        user2Token = response2.data.token;
        console.log('   User ID:', response2.data.user.id);
        console.log('   Username:', response2.data.user.username);
    } else {
        log('❌ User 2 registration failed', 'red');
        console.log('   Error:', response2.error);
    }

    // Test duplicate email registration
    const duplicateResponse = await makeRequest('POST', '/auth/register', testUser);
    
    if (!duplicateResponse.success && duplicateResponse.status === 400) {
        log('✅ Duplicate email validation passed', 'green');
    } else {
        log('❌ Duplicate email validation failed', 'red');
        console.log('   Should have returned 400 error');
    }

    return true;
}

async function testUserLogin() {
    log('\n🔍 Testing User Login', 'blue');
    
    const loginData = {
        email: testUser.email,
        password: testUser.password
    };

    const response = await makeRequest('POST', '/auth/login', loginData);
    
    if (response.success && response.data.success) {
        log('✅ User login passed', 'green');
        userToken = response.data.token;
        console.log('   Token received:', userToken.substring(0, 20) + '...');
    } else {
        log('❌ User login failed', 'red');
        console.log('   Error:', response.error);
        return false;
    }

    // Test invalid login
    const invalidResponse = await makeRequest('POST', '/auth/login', {
        email: testUser.email,
        password: 'WrongPassword123'
    });
    
    if (!invalidResponse.success && invalidResponse.status === 401) {
        log('✅ Invalid login validation passed', 'green');
    } else {
        log('❌ Invalid login validation failed', 'red');
    }

    return true;
}

async function testUserProfile() {
    log('\n🔍 Testing User Profile Endpoints', 'blue');
    
    // Test get profile
    const getResponse = await makeRequest('GET', '/auth/profile', null, userToken);
    
    if (getResponse.success && getResponse.data.success) {
        log('✅ Get profile passed', 'green');
        console.log('   Username:', getResponse.data.user.username);
        console.log('   Email:', getResponse.data.user.email);
    } else {
        log('❌ Get profile failed', 'red');
        console.log('   Error:', getResponse.error);
    }

    // Test update profile
    const updateData = {
        username: 'updateduser123',
        profilePicture: 'https://example.com/new-avatar.jpg'
    };

    const updateResponse = await makeRequest('PUT', '/auth/profile', updateData, userToken);
    
    if (updateResponse.success && updateResponse.data.success) {
        log('✅ Update profile passed', 'green');
        console.log('   Updated username:', updateResponse.data.user.username);
    } else {
        log('❌ Update profile failed', 'red');
        console.log('   Error:', updateResponse.error);
    }

    // Test get profile without token
    const noTokenResponse = await makeRequest('GET', '/auth/profile');
    
    if (!noTokenResponse.success && noTokenResponse.status === 401) {
        log('✅ Authentication validation passed', 'green');
    } else {
        log('❌ Authentication validation failed', 'red');
    }
}

async function testCreatePost() {
    log('\n🔍 Testing Create Post', 'blue');
    
    const response = await makeRequest('POST', '/posts', testPost, userToken);
    
    if (response.success && response.data.success) {
        log('✅ Create post passed', 'green');
        createdPostId = response.data.data._id;
        console.log('   Post ID:', createdPostId);
        console.log('   Caption:', response.data.data.caption);
        console.log('   Image URL:', response.data.data.imageUrl);
    } else {
        log('❌ Create post failed', 'red');
        console.log('   Error:', response.error);
        return false;
    }

    // Test create post without image URL
    const noImageResponse = await makeRequest('POST', '/posts', { caption: 'No image' }, userToken);
    
    if (!noImageResponse.success && noImageResponse.status === 400) {
        log('✅ Image URL validation passed', 'green');
    } else {
        log('❌ Image URL validation failed', 'red');
    }

    return true;
}

async function testGetPosts() {
    log('\n🔍 Testing Get Posts', 'blue');
    
    // Test get all posts
    const response = await makeRequest('GET', '/posts', null, userToken);
    
    if (response.success && response.data.success) {
        log('✅ Get all posts passed', 'green');
        console.log('   Total posts:', response.data.data.length);
        console.log('   Pagination:', response.data.pagination);
    } else {
        log('❌ Get all posts failed', 'red');
        console.log('   Error:', response.error);
    }

    // Test get single post
    if (createdPostId) {
        const singleResponse = await makeRequest('GET', `/posts/${createdPostId}`, null, userToken);
        
        if (singleResponse.success && singleResponse.data.success) {
            log('✅ Get single post passed', 'green');
            console.log('   Post caption:', singleResponse.data.data.caption);
        } else {
            log('❌ Get single post failed', 'red');
            console.log('   Error:', singleResponse.error);
        }
    }

    // Test get posts with pagination
    const paginatedResponse = await makeRequest('GET', '/posts?page=1&limit=5', null, userToken);
    
    if (paginatedResponse.success && paginatedResponse.data.success) {
        log('✅ Get posts with pagination passed', 'green');
        console.log('   Page:', paginatedResponse.data.pagination.page);
        console.log('   Limit:', paginatedResponse.data.data.length);
    } else {
        log('❌ Get posts with pagination failed', 'red');
        console.log('   Error:', paginatedResponse.error);
    }
}

async function testUpdatePost() {
    log('\n🔍 Testing Update Post', 'blue');
    
    if (!createdPostId) {
        log('❌ No post ID available for update test', 'red');
        return;
    }

    const updateData = {
        caption: 'Updated test post caption'
    };

    const response = await makeRequest('PUT', `/posts/${createdPostId}`, updateData, userToken);
    
    if (response.success && response.data.success) {
        log('✅ Update post passed', 'green');
        console.log('   Updated caption:', response.data.data.caption);
    } else {
        log('❌ Update post failed', 'red');
        console.log('   Error:', response.error);
    }

    // Test update post by different user
    if (user2Token) {
        const unauthorizedResponse = await makeRequest('PUT', `/posts/${createdPostId}`, updateData, user2Token);
        
        if (!unauthorizedResponse.success && unauthorizedResponse.status === 403) {
            log('✅ Unauthorized update validation passed', 'green');
        } else {
            log('❌ Unauthorized update validation failed', 'red');
        }
    }
}

async function testLikePost() {
    log('\n🔍 Testing Like/Unlike Post', 'blue');
    
    if (!createdPostId) {
        log('❌ No post ID available for like test', 'red');
        return;
    }

    // Test like post
    const likeResponse = await makeRequest('POST', `/posts/${createdPostId}/like`, null, userToken);
    
    if (likeResponse.success && likeResponse.data.success) {
        log('✅ Like post passed', 'green');
        console.log('   Liked:', likeResponse.data.liked);
        console.log('   Likes count:', likeResponse.data.likesCount);
    } else {
        log('❌ Like post failed', 'red');
        console.log('   Error:', likeResponse.error);
    }

    // Test unlike post
    const unlikeResponse = await makeRequest('POST', `/posts/${createdPostId}/like`, null, userToken);
    
    if (unlikeResponse.success && unlikeResponse.data.success) {
        log('✅ Unlike post passed', 'green');
        console.log('   Liked:', unlikeResponse.data.liked);
        console.log('   Likes count:', unlikeResponse.data.likesCount);
    } else {
        log('❌ Unlike post failed', 'red');
        console.log('   Error:', unlikeResponse.error);
    }

    // Test like with different user
    if (user2Token) {
        const user2LikeResponse = await makeRequest('POST', `/posts/${createdPostId}/like`, null, user2Token);
        
        if (user2LikeResponse.success && user2LikeResponse.data.success) {
            log('✅ Like by different user passed', 'green');
        } else {
            log('❌ Like by different user failed', 'red');
        }
    }
}

async function testAddComment() {
    log('\n🔍 Testing Add Comment', 'blue');
    
    if (!createdPostId) {
        log('❌ No post ID available for comment test', 'red');
        return;
    }

    const commentData = {
        text: 'This is a test comment'
    };

    const response = await makeRequest('POST', `/posts/${createdPostId}/comment`, commentData, userToken);
    
    if (response.success && response.data.success) {
        log('✅ Add comment passed', 'green');
        console.log('   Comment text:', response.data.comment.text);
        console.log('   Comment user:', response.data.comment.user.username);
    } else {
        log('❌ Add comment failed', 'red');
        console.log('   Error:', response.error);
    }

    // Test add comment with different user
    if (user2Token) {
        const user2CommentData = {
            text: 'Comment from user 2'
        };

        const user2Response = await makeRequest('POST', `/posts/${createdPostId}/comment`, user2CommentData, user2Token);
        
        if (user2Response.success && user2Response.data.success) {
            log('✅ Add comment by different user passed', 'green');
        } else {
            log('❌ Add comment by different user failed', 'red');
        }
    }

    // Test add empty comment
    const emptyCommentResponse = await makeRequest('POST', `/posts/${createdPostId}/comment`, { text: '' }, userToken);
    
    if (!emptyCommentResponse.success && emptyCommentResponse.status === 400) {
        log('✅ Empty comment validation passed', 'green');
    } else {
        log('❌ Empty comment validation failed', 'red');
    }
}

async function testGetUserPosts() {
    log('\n🔍 Testing Get User Posts', 'blue');
    
    // First, get current user profile to get user ID
    const profileResponse = await makeRequest('GET', '/auth/profile', null, userToken);
    
    if (!profileResponse.success) {
        log('❌ Could not get user profile for user posts test', 'red');
        return;
    }

    const userId = profileResponse.data.user._id;
    const response = await makeRequest('GET', `/posts/user/${userId}`, null, userToken);
    
    if (response.success && response.data.success) {
        log('✅ Get user posts passed', 'green');
        console.log('   User posts count:', response.data.data.length);
        console.log('   Pagination:', response.data.pagination);
    } else {
        log('❌ Get user posts failed', 'red');
        console.log('   Error:', response.error);
    }
}

async function testDeletePost() {
    log('\n🔍 Testing Delete Post', 'blue');
    
    if (!createdPostId) {
        log('❌ No post ID available for delete test', 'red');
        return;
    }

    // Test delete by different user (should fail)
    if (user2Token) {
        const unauthorizedResponse = await makeRequest('DELETE', `/posts/${createdPostId}`, null, user2Token);
        
        if (!unauthorizedResponse.success && unauthorizedResponse.status === 403) {
            log('✅ Unauthorized delete validation passed', 'green');
        } else {
            log('❌ Unauthorized delete validation failed', 'red');
        }
    }

    // Test delete by owner
    const response = await makeRequest('DELETE', `/posts/${createdPostId}`, null, userToken);
    
    if (response.success && response.data.success) {
        log('✅ Delete post passed', 'green');
        console.log('   Message:', response.data.message);
    } else {
        log('❌ Delete post failed', 'red');
        console.log('   Error:', response.error);
    }

    // Test access deleted post
    const deletedPostResponse = await makeRequest('GET', `/posts/${createdPostId}`, null, userToken);
    
    if (!deletedPostResponse.success && deletedPostResponse.status === 404) {
        log('✅ Deleted post access validation passed', 'green');
    } else {
        log('❌ Deleted post access validation failed', 'red');
    }
}

async function test404Endpoint() {
    log('\n🔍 Testing 404 Endpoint', 'blue');
    
    const response = await makeRequest('GET', '/nonexistent');
    
    if (!response.success && response.status === 404) {
        log('✅ 404 endpoint test passed', 'green');
        console.log('   Message:', response.error.message);
    } else {
        log('❌ 404 endpoint test failed', 'red');
    }
}

// Main test runner
async function runAllTests() {
    log('🚀 Starting API Tests for Locket Backend', 'yellow');
    log('==========================================', 'yellow');

    try {
        // Basic endpoints
        await testHealthCheck();
        await testRootEndpoint();

        // Authentication tests
        await testUserRegistration();
        await testUserLogin();
        await testUserProfile();

        // Posts tests
        await testCreatePost();
        await testGetPosts();
        await testUpdatePost();
        await testLikePost();
        await testAddComment();
        await testGetUserPosts();
        await testDeletePost();

        // Error handling
        await test404Endpoint();

        log('\n🎉 All tests completed!', 'yellow');
        log('==========================================', 'yellow');

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

    log('✅ Server is running, starting tests...', 'green');
    await runAllTests();
}

main().catch(console.error);