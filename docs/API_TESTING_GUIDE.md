# Locket Backend API Testing Guide (2024)

## Quick Start

1. **Start the server:**
   ```bash
   npm start
   # or
   ./start.sh (Linux/macOS)
   .\start.bat (Windows)
   ```
2. **Import Postman Collection:**
   - Open Postman
   - Import `Locket_API_Collection.postman_collection.json`
   - All requests are grouped and renamed for clarity

---

## API Groups & Testing Flow

### 1. Health & Status
- **Health Check**: `GET /api/health`
  - Test if the server is running

### 2. User Registration & Email Verification
- **Register New User**: `POST /api/auth/register`
- **Verify Email (OTP)**: `POST /api/auth/verify-email`
- **Resend Verification Email**: `POST /api/auth/send-verification-email`

**Test flow:**
1. Register a new user
2. Get the verification code (from email or dev response)
3. Verify email using the code
4. (Optional) Resend verification email if needed

### 3. User Login & Profile
- **Login User**: `POST /api/auth/login`
- **Get User Profile**: `GET /api/auth/profile`
- **Update User Profile**: `PUT /api/auth/profile`
- **Logout User**: `POST /api/auth/logout`

**Test flow:**
1. Login with verified account
2. Use the token for all protected endpoints
3. Get and update profile
4. Logout

### 4. Password Management
- **Change Password**: `POST /api/auth/change-password`
- **Request Password Reset (Forgot Password)**: `POST /api/auth/forgot-password`
- **Verify Password Reset Code**: `POST /api/auth/verify-reset-code`
- **Reset Password**: `POST /api/auth/reset-password`

**Test flow:**
1. Change password (must be logged in)
2. Forgot password: request reset code
3. Verify reset code
4. Reset password with code

### 5. Account Management
- **Delete User Account**: `DELETE /api/auth/account`

**Test flow:**
1. Delete account (must be logged in)

### 6. Notifications
- **Get All Notifications**: `GET /api/notifications`
- **Mark Notification as Read**: `PUT /api/notifications/:id/read`
- **Mark All Notifications as Read**: `PUT /api/notifications/read-all`
- **Get Unread Notification Count**: `GET /api/notifications/unread-count`
- **Delete Notification**: `DELETE /api/notifications/:id`

### 7. User Search & Suggestions
- **Search Users**: `GET /api/users/search?q=...`
- **Get User Suggestions**: `GET /api/users/suggestions`
- **Get User by ID**: `GET /api/users/:id`

### 8. Posts
- **Get All Posts (Feed)**: `GET /api/posts`
- **Create New Post**: `POST /api/posts`
- **Get Single Post by ID**: `GET /api/posts/:id`
- **Update Post by ID**: `PUT /api/posts/:id`
- **Delete Post by ID**: `DELETE /api/posts/:id`
- **Like or Unlike Post**: `POST /api/posts/:id/like`
- **Add Comment to Post**: `POST /api/posts/:id/comment`
- **Get Posts by User ID**: `GET /api/posts/user/:userId`

---

## Testing Tips
- Always login and use the JWT token for protected endpoints (set as `{{token}}` in Postman)
- Follow the group order for a realistic user flow
- Use the example bodies provided in each request
- Check the response for `success: true` and expected data

---

**Happy testing!** 