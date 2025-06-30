# 🧪 Test Scripts for Locket Backend

This folder contains various test scripts for testing the Locket Backend API endpoints.

## 📋 Test Files Overview

### 🚀 **Main Test Scripts**

#### `test_api.js`
**Comprehensive API testing script**
- Tests all main API endpoints (auth, posts, friends)
- Includes authentication, CRUD operations, and error handling
- Automated test runner with colored output
- **Usage:** `node tests/test_api.js`

#### `test_friend_requests.js` 
**Dedicated friend request testing**
- Creates fresh test users for friend request testing
- Tests complete friend request flow (send → receive → accept → remove)
- Tests all friend request endpoints
- **Usage:** `node tests/test_friend_requests.js`

### 🔍 **Debug & Diagnostic Scripts**

#### `debug_friend_requests.js`
**Debug friend request issues**
- Tests with existing users from previous tests
- Sends new friend requests and checks responses
- Useful for troubleshooting friend request problems
- **Usage:** `node tests/debug_friend_requests.js`

#### `check_specific_users.js`
**Check specific user data**
- Identifies users by ID from provided data
- Tries to find emails for specific user IDs
- Useful for debugging data inconsistencies
- **Usage:** `node tests/check_specific_users.js`

#### `find_user_email.js`
**Find email for specific user**
- Searches for email of a specific user (testuser1)
- Tests common email patterns
- Automatically tests received requests for found user
- **Usage:** `node tests/find_user_email.js`

#### `clean_test.js`
**Clean testing with existing users**
- Uses existing users instead of creating new ones
- Sends fresh friend requests between known users
- Good for testing without user registration conflicts
- **Usage:** `node tests/clean_test.js`

## 🛠️ **How to Run Tests**

### **Prerequisites:**
1. **Server must be running:** `npm start` or `node server.js`
2. **Database connection:** MongoDB (local or Atlas)

### **Run Individual Tests:**
```bash
# Main comprehensive test
node tests/test_api.js

# Friend request specific test
node tests/test_friend_requests.js

# Debug friend request issues
node tests/debug_friend_requests.js

# Find specific user email
node tests/find_user_email.js

# Test with existing users
node tests/clean_test.js

# Check specific user data
node tests/check_specific_users.js
```

### **Run All Tests:**
```bash
# Run the main comprehensive test (recommended)
node tests/test_api.js
```

## 📊 **Test Coverage**

### **Authentication Endpoints:**
- ✅ User Registration
- ✅ User Login  
- ✅ Get Profile
- ✅ Update Profile
- ✅ Authentication validation

### **Posts Endpoints:**
- ✅ Create Post
- ✅ Get Posts (all, single, paginated)
- ✅ Update Post
- ✅ Delete Post
- ✅ Like/Unlike Post
- ✅ Add Comments
- ✅ Get User Posts

### **Friends Endpoints:**
- ✅ Send Friend Request
- ✅ Get Received Friend Requests
- ✅ Get Sent Friend Requests
- ✅ Get All Friend Requests
- ✅ Accept Friend Request
- ✅ Get Friends List
- ✅ Remove Friend

### **Error Handling:**
- ✅ 404 endpoints
- ✅ Authentication errors
- ✅ Validation errors
- ✅ Duplicate data errors

## 🎯 **Test Data**

### **Test Users:**
- **User 1:** `test@example.com` / `user1`
- **User 2:** `test2@example.com` / `testuser456` 
- **User 3:** `test1@example.com` / `testuser1`
- **Friend Users:** `friend1@example.com`, `friend2@example.com`

### **Default Password:** `Password123`

## 📝 **Notes**

- All scripts include server status checking
- Colored console output for better readability
- Error handling and detailed logging
- Scripts can handle existing user conflicts
- Some scripts create fresh users, others use existing ones

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Server not running:** Start server with `npm start`
2. **User already exists:** Use `clean_test.js` or `debug_friend_requests.js`
3. **Friend request not showing:** Check user IDs and tokens match
4. **Database connection:** Verify MongoDB connection in `config.js`

### **Debug Steps:**
1. Run `debug_friend_requests.js` to check current state
2. Use `find_user_email.js` to locate specific users
3. Check `check_specific_users.js` for data inconsistencies

---

**Happy Testing! 🚀** 