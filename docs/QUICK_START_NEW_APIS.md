# 🚀 Quick Start Guide - New APIs

## 📋 Tổng quan

Hướng dẫn nhanh để chạy và test các API mới đã được thêm vào Locket Backend.

## 🛠️ Cài đặt & Chạy

### 1. Khởi động Server
```bash
# Windows
start.bat

# macOS/Linux
./start.sh

# Hoặc chạy trực tiếp
npm start
```

### 2. Kiểm tra Server
```bash
# Health check
curl http://localhost:3000/api/health

# Hoặc mở browser
http://localhost:3000/api/health
```

## 🧪 Test các API mới

### Chạy Test Script
```bash
# Chạy test script tự động
node tests/test_new_apis.js
```

### Test thủ công với cURL

#### 1. Notifications APIs

```bash
# Đăng ký user mới
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Login để lấy token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'

# Lấy danh sách notifications
curl -X GET http://localhost:3000/api/notifications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Lấy số notifications chưa đọc
curl -X GET http://localhost:3000/api/notifications/unread-count \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Đánh dấu tất cả đã đọc
curl -X PUT http://localhost:3000/api/notifications/read-all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 2. User Search & Discovery

```bash
# Tìm kiếm users
curl -X GET "http://localhost:3000/api/users/search?q=test" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Lấy user suggestions
curl -X GET http://localhost:3000/api/users/suggestions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Lấy profile user theo ID
curl -X GET http://localhost:3000/api/users/USER_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 3. User Management

```bash
# Đổi mật khẩu
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "TestPass123",
    "newPassword": "NewTestPass123",
    "confirmPassword": "NewTestPass123"
  }'

# Quên mật khẩu
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Xóa tài khoản
curl -X DELETE http://localhost:3000/api/auth/account \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "TestPass123"
  }'
```

## 📱 Test với Postman

### Import Collection
1. Mở Postman
2. Import file: `Locket_API_Collection.postman_collection.json`
3. Collection sẽ có sẵn các API mới

### Environment Variables
Tạo environment với các variables:
- `base_url`: `http://localhost:3000/api`
- `token`: Token sau khi login

## 🔍 Debug & Troubleshooting

### Kiểm tra Logs
```bash
# Xem logs server
npm start

# Hoặc nếu dùng PM2
pm2 logs
```

### Kiểm tra Database
```bash
# Kết nối MongoDB
mongosh "your_connection_string"

# Xem collections
show collections

# Xem notifications
db.notifications.find().limit(5)

# Xem users
db.users.find().limit(5)
```

### Common Issues

#### 1. Server không khởi động
```bash
# Kiểm tra port
netstat -an | findstr :3000

# Kill process nếu cần
taskkill /F /PID <PID>
```

#### 2. Database connection error
```bash
# Kiểm tra config.js
cat config.js

# Test connection
node -e "require('./database')"
```

#### 3. Validation errors
- Kiểm tra format request body
- Đảm bảo đúng Content-Type header
- Xem validation rules trong `middleware/validation.js`

## 📊 API Status Check

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Locket Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

### Available Endpoints
```bash
curl http://localhost:3000/
```

Expected response:
```json
{
  "success": true,
  "message": "Welcome to Locket Backend API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "posts": "/api/posts",
    "friends": "/api/friends",
    "notifications": "/api/notifications",
    "users": "/api/users",
    "health": "/api/health"
  }
}
```

## 🎯 Next Steps

1. **Test tất cả APIs**: Chạy `node tests/test_new_apis.js`
2. **Integrate với Frontend**: Sử dụng các endpoints mới
3. **Setup Email Service**: Cho password reset và email verification
4. **Add Push Notifications**: Cho real-time notifications
5. **Performance Optimization**: Add caching, pagination optimization

## 📞 Support

- **Documentation**: Xem `docs/API_ROADMAP.md` cho chi tiết đầy đủ
- **Issues**: Kiểm tra logs và test script
- **Questions**: Xem code comments và documentation

---

**Happy Coding! 🚀** 