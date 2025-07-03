# 🧪 PicketPicket Backend - Testing Guide

Hướng dẫn chi tiết về testing APIs cho Picket Backend.

## 🚀 Quick Start

### 1. Khởi động server
```bash
# Windows
.\start.bat

# macOS/Linux
./start.sh

# Hoặc manual
npm start
```

### 2. Import Postman Collection
- Mở Postman
- Import file `Locket_API_Collection.postman_collection.json`
- Tất cả requests đã được nhóm và đặt tên rõ ràng

## 📋 API Testing Flow

### 1. Health & Status
- **Health Check**: `GET /api/health`
  - Kiểm tra server có đang chạy không

### 2. User Registration & Email Verification
- **Register New User**: `POST /api/auth/register`
- **Verify Email (OTP)**: `POST /api/auth/verify-email`
- **Resend Verification Email**: `POST /api/auth/send-verification-email`

**Test flow:**
1. Đăng ký user mới
2. Lấy verification code (từ email hoặc dev response)
3. Xác thực email bằng code
4. (Tùy chọn) Gửi lại email xác thực nếu cần

### 3. User Login & Profile
- **Login User**: `POST /api/auth/login`
- **Get User Profile**: `GET /api/auth/profile`
- **Update User Profile**: `PUT /api/auth/profile`
- **Logout User**: `POST /api/auth/logout`

**Test flow:**
1. Đăng nhập với tài khoản đã xác thực
2. Sử dụng token cho tất cả protected endpoints
3. Lấy và cập nhật profile
4. Đăng xuất

### 4. Password Management
- **Change Password**: `POST /api/auth/change-password`
- **Request Password Reset (Forgot Password)**: `POST /api/auth/forgot-password`
- **Verify Password Reset Code**: `POST /api/auth/verify-reset-code`
- **Reset Password**: `POST /api/auth/reset-password`

**Test flow:**
1. Đổi mật khẩu (phải đăng nhập)
2. Quên mật khẩu: yêu cầu reset code
3. Xác thực reset code
4. Đặt lại mật khẩu với code

### 5. Account Management
- **Delete User Account**: `DELETE /api/auth/account`

**Test flow:**
1. Xóa tài khoản (phải đăng nhập)

### 6. Friend Management
- **Search Users**: `GET /api/users/search?q=...`
- **Send Friend Request**: `POST /api/users/:id/friend-request`
- **Accept Friend Request**: `POST /api/users/:id/accept-friend`
- **Decline Friend Request**: `POST /api/users/:id/decline-friend`
- **Get Friend Requests**: `GET /api/users/friend-requests`
- **Remove Friend**: `DELETE /api/users/:id/friend`

**Test flow:**
1. Tìm kiếm user
2. Gửi lời mời kết bạn
3. Chấp nhận/từ chối lời mời
4. Xem danh sách lời mời
5. Hủy kết bạn

### 7. Posts
- **Get All Posts (Feed)**: `GET /api/posts`
- **Create New Post**: `POST /api/posts`
- **Get Single Post by ID**: `GET /api/posts/:id`
- **Update Post by ID**: `PUT /api/posts/:id`
- **Delete Post by ID**: `DELETE /api/posts/:id`
- **Like or Unlike Post**: `POST /api/posts/:id/like`
- **Add Comment to Post**: `POST /api/posts/:id/comment`
- **Get Posts by User ID**: `GET /api/posts/user/:userId`

**Test flow:**
1. Tạo post mới
2. Lấy danh sách posts
3. Like/unlike post
4. Thêm comment
5. Cập nhật/xóa post

### 8. Notifications
- **Get All Notifications**: `GET /api/notifications`
- **Mark Notification as Read**: `PUT /api/notifications/:id/read`
- **Mark All Notifications as Read**: `PUT /api/notifications/read-all`
- **Get Unread Notification Count**: `GET /api/notifications/unread-count`
- **Delete Notification**: `DELETE /api/notifications/:id`

## 🔧 Testing Tools

### 1. Automated Tests
```bash
# Chạy tất cả tests
npm run test-api

# Test specific functionality
node tests/test_friend_requests.js
node tests/test_email_verification_login.js
node tests/test_notifications_detailed.js
```

### 2. Manual Testing với Postman
- Import collection: `Locket_API_Collection.postman_collection.json`
- Set environment variables:
  - `baseUrl`: `http://localhost:3000/api`
  - `token`: JWT token sau khi login

### 3. cURL Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 📝 Test Data Examples

### User Registration
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### User Login
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Create Post
```json
{
  "content": "This is a test post",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Send Friend Request
```json
{
  "message": "Hi, let's be friends!"
}
```

## 🚨 Common Issues & Solutions

### 1. Authentication Issues
- **Problem**: 401 Unauthorized
- **Solution**: Đảm bảo đã login và sử dụng token hợp lệ
- **Check**: Token có trong header `Authorization: Bearer <token>`

### 2. Email Verification Issues
- **Problem**: Email không được gửi
- **Solution**: Kiểm tra cấu hình email trong `.env`
- **Alternative**: Sử dụng `devVerificationCode` trong response (development mode)

### 3. Database Connection Issues
- **Problem**: 500 Internal Server Error
- **Solution**: Kiểm tra MongoDB connection
- **Check**: `http://localhost:3000/api/health`

### 4. Validation Errors
- **Problem**: 400 Bad Request
- **Solution**: Kiểm tra format dữ liệu gửi lên
- **Check**: Đảm bảo đúng schema và validation rules

## 📊 Test Results

### Expected Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 🎯 Testing Checklist

- [ ] ✅ Server khởi động thành công
- [ ] ✅ Health check endpoint hoạt động
- [ ] ✅ User registration và email verification
- [ ] ✅ User login và JWT token generation
- [ ] ✅ Protected endpoints với authentication
- [ ] ✅ Friend request flow (send, accept, decline)
- [ ] ✅ Post creation và management
- [ ] ✅ Notification system
- [ ] ✅ Error handling và validation
- [ ] ✅ Database operations

## 📚 Additional Resources

- **API Documentation**: Xem các file trong thư mục `docs/`
- **Postman Collection**: `Locket_API_Collection.postman_collection.json`
- **Test Scripts**: Thư mục `tests/`
- **Environment Setup**: `README.md`

---

**Happy testing! 🎉** 