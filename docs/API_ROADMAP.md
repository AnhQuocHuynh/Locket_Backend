# 🗺️ API Development Roadmap - Locket Backend

## 📋 Tổng quan

Roadmap này mô tả việc phát triển các API mới cho ứng dụng Locket clone, bao gồm:
- **Notifications APIs** - Quản lý thông báo
- **User Search & Discovery** - Tìm kiếm và khám phá người dùng  
- **User Management** - Quản lý tài khoản người dùng

## ✅ Đã hoàn thành

### 1. Notifications APIs

#### ✅ GET /api/notifications
- **Mô tả**: Lấy danh sách thông báo của người dùng
- **Quyền truy cập**: Private (cần authentication)
- **Query Parameters**:
  - `page` (optional): Số trang (default: 1)
  - `limit` (optional): Số lượng item mỗi trang (default: 20)
  - `type` (optional): Lọc theo loại thông báo
- **Response**:
```json
{
  "success": true,
  "data": {
    "notifications": [...],
    "pagination": {
      "page": 1,
      "pages": 5,
      "total": 100,
      "hasNext": true,
      "hasPrev": false
    },
    "unreadCount": 15
  }
}
```

#### ✅ PUT /api/notifications/:id/read
- **Mô tả**: Đánh dấu một thông báo cụ thể đã đọc
- **Quyền truy cập**: Private
- **Parameters**: `id` - ID của thông báo
- **Response**:
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": { ... }
}
```

#### ✅ PUT /api/notifications/read-all
- **Mô tả**: Đánh dấu tất cả thông báo đã đọc
- **Quyền truy cập**: Private
- **Response**:
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "modifiedCount": 15
  }
}
```

#### ✅ GET /api/notifications/unread-count
- **Mô tả**: Lấy số lượng thông báo chưa đọc
- **Quyền truy cập**: Private
- **Response**:
```json
{
  "success": true,
  "data": {
    "unreadCount": 15
  }
}
```

#### ✅ DELETE /api/notifications/:id
- **Mô tả**: Xóa một thông báo cụ thể
- **Quyền truy cập**: Private
- **Parameters**: `id` - ID của thông báo

### 2. User Search & Discovery

#### ✅ GET /api/users/search
- **Mô tả**: Tìm kiếm người dùng theo username, displayName, hoặc bio
- **Quyền truy cập**: Private
- **Query Parameters**:
  - `q` (required): Từ khóa tìm kiếm (tối thiểu 2 ký tự)
  - `page` (optional): Số trang
  - `limit` (optional): Số lượng item mỗi trang
- **Response**:
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "...",
        "username": "john_doe",
        "displayName": "John Doe",
        "profilePicture": "...",
        "bio": "...",
        "friendshipStatus": "none|friends|sent|received"
      }
    ],
    "pagination": { ... }
  }
}
```

#### ✅ GET /api/users/suggestions
- **Mô tả**: Lấy gợi ý người dùng dựa trên bạn của bạn và người dùng phổ biến
- **Quyền truy cập**: Private
- **Query Parameters**:
  - `page` (optional): Số trang
  - `limit` (optional): Số lượng item mỗi trang
- **Response**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "_id": "...",
        "username": "jane_smith",
        "displayName": "Jane Smith",
        "mutualFriends": 3,
        "friendshipStatus": "none"
      }
    ],
    "pagination": { ... }
  }
}
```

#### ✅ GET /api/users/:id
- **Mô tả**: Lấy thông tin profile của người dùng theo ID
- **Quyền truy cập**: Private
- **Parameters**: `id` - ID của người dùng
- **Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "username": "john_doe",
      "displayName": "John Doe",
      "profilePicture": "...",
      "bio": "...",
      "friendshipStatus": "friends"
    }
  }
}
```

### 3. User Management

#### ✅ DELETE /api/auth/account
- **Mô tả**: Xóa tài khoản người dùng
- **Quyền truy cập**: Private
- **Body**:
```json
{
  "password": "current_password"
}
```

#### ✅ POST /api/auth/change-password
- **Mô tả**: Đổi mật khẩu
- **Quyền truy cập**: Private
- **Body**:
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

#### ✅ POST /api/auth/forgot-password
- **Mô tả**: Gửi email reset mật khẩu
- **Quyền truy cập**: Public
- **Body**:
```json
{
  "email": "user@example.com"
}
```

#### ✅ POST /api/auth/reset-password
- **Mô tả**: Reset mật khẩu với token
- **Quyền truy cập**: Public
- **Body**:
```json
{
  "token": "reset_token",
  "newPassword": "new_password",
  "confirmPassword": "new_password"
}
```

#### ✅ POST /api/auth/verify-email
- **Mô tả**: Xác thực email với token
- **Quyền truy cập**: Public
- **Body**:
```json
{
  "token": "verification_token"
}
```

## 🔧 Cấu trúc Database

### Notification Model
```javascript
{
  recipient: ObjectId,        // Người nhận
  sender: ObjectId,          // Người gửi
  type: String,              // Loại thông báo
  title: String,             // Tiêu đề
  message: String,           // Nội dung
  relatedPost: ObjectId,     // Post liên quan (optional)
  relatedFriendship: ObjectId, // Friendship liên quan (optional)
  data: Mixed,               // Dữ liệu bổ sung
  isRead: Boolean,           // Đã đọc chưa
  isDelivered: Boolean,      // Đã gửi chưa
  deliveredAt: Date,         // Thời gian gửi
  readAt: Date              // Thời gian đọc
}
```

### User Model (Updated)
```javascript
{
  // ... existing fields ...
  emailVerificationToken: String,    // Token xác thực email
  emailVerificationExpires: Date,    // Thời hạn token
  resetPasswordToken: String,        // Token reset password
  resetPasswordExpires: Date         // Thời hạn token
}
```

## 🧪 Testing

### Chạy test cho các API mới:
```bash
# Chạy test script
node tests/test_new_apis.js

# Hoặc sử dụng npm script (nếu có)
npm run test:new-apis
```

### Test Coverage:
- ✅ User Registration/Login
- ✅ Notifications CRUD operations
- ✅ User Search & Discovery
- ✅ Password Management
- ✅ Account Deletion

## 📁 File Structure

```
routes/
├── auth.js              # Authentication & User Management
├── notifications.js     # Notifications APIs
├── users.js            # User Search & Discovery
├── posts.js            # Posts APIs (existing)
└── friends.js          # Friends APIs (existing)

middleware/
├── auth.js             # Authentication middleware
└── validation.js       # Validation rules (updated)

models/
├── User.js             # User model (updated)
├── Notification.js     # Notification model (existing)
├── Post.js             # Post model (existing)
└── Friendship.js       # Friendship model (existing)

tests/
└── test_new_apis.js    # Test script for new APIs
```

## 🚀 Deployment Checklist

### Phase 1: Notifications ✅
- [x] Create notifications routes
- [x] Add validation middleware
- [x] Update server.js to include routes
- [x] Test all notification endpoints

### Phase 2: User Search & Discovery ✅
- [x] Create users routes
- [x] Implement search functionality
- [x] Implement suggestions algorithm
- [x] Test search and discovery endpoints

### Phase 3: User Management ✅
- [x] Update auth routes with new endpoints
- [x] Add password reset functionality
- [x] Add email verification
- [x] Add account deletion
- [x] Update User model with new fields

### Phase 4: Testing & Documentation ✅
- [x] Create comprehensive test script
- [x] Update validation middleware
- [x] Create API documentation
- [x] Test all endpoints

## 🔮 Future Enhancements

### Email Integration
- [ ] Integrate with email service (SendGrid, AWS SES)
- [ ] Send actual password reset emails
- [ ] Send email verification emails

### Push Notifications
- [ ] Integrate with Firebase Cloud Messaging
- [ ] Send push notifications for real-time updates
- [ ] Handle notification delivery status

### Advanced Search
- [ ] Add filters for search (location, age, interests)
- [ ] Implement search suggestions
- [ ] Add search history

### Security Enhancements
- [ ] Rate limiting for sensitive endpoints
- [ ] Two-factor authentication
- [ ] Account recovery options

## 📞 Support

Nếu có vấn đề hoặc cần hỗ trợ, vui lòng:
1. Kiểm tra logs server
2. Chạy test script để debug
3. Xem documentation chi tiết trong các file README

---

**Lưu ý**: Tất cả các API đã được implement và test. Có thể chạy server và test ngay lập tức! 