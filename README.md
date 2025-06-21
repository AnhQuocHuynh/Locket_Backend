# Locket Backend API

Backend API cho ứng dụng Locket Clone được xây dựng với Node.js, Express, và MongoDB.

## 🚀 Tính năng

- ✅ User Authentication (Register/Login)
- ✅ JWT Token Authentication
- ✅ Password Hashing với bcrypt
- ✅ CRUD Operations cho Posts
- ✅ Like/Unlike Posts
- ✅ Comment System
- ✅ Input Validation
- ✅ Error Handling
- ✅ CORS Support
- ✅ Security Middleware (Helmet)

## 📋 Yêu cầu hệ thống

- Node.js (v16 trở lên)
- MongoDB (v4.4 trở lên)
- npm hoặc yarn

## 🛠️ Cài đặt và Chạy Backend

### Bước 1: Điều hướng đến thư mục backend
```powershell
# Từ thư mục root của project
cd locket-backend
```

### Bước 2: Cài đặt dependencies
```powershell
# Sử dụng đường dẫn đầy đủ nếu gặp lỗi execution policy
"C:\Program Files\nodejs\npm.cmd" install

# Hoặc nếu npm đã được cấu hình trong PATH
npm install
```

### Bước 3: Cài đặt MongoDB
- **Windows**: Download từ [MongoDB Official](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Ubuntu**: `sudo apt install mongodb`

### Bước 4: Khởi động MongoDB
```powershell
# Windows (chạy với quyền Administrator)
net start MongoDB

# Hoặc khởi động MongoDB Compass nếu đã cài đặt
```

### Bước 5: Tạo file .env (QUAN TRỌNG!)
Tạo file `.env` trong thư mục `locket-backend` với nội dung:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/locket_db
JWT_SECRET=locket_super_secret_jwt_key_2024_make_this_very_long_and_complex_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

**Cách tạo file .env bằng PowerShell:**
```powershell
# Tạo file .env
New-Item -Path ".env" -ItemType File -Force

# Thêm nội dung vào file
echo "PORT=3000" > .env
echo "NODE_ENV=development" >> .env
echo "MONGODB_URI=mongodb://localhost:27017/locket_db" >> .env
echo "JWT_SECRET=locket_super_secret_jwt_key_2024_make_this_very_long_and_complex_in_production" >> .env
echo "JWT_EXPIRE=7d" >> .env
echo "CORS_ORIGIN=*" >> .env
```

### Bước 6: Chạy server
```powershell
# Phương pháp 1: Sử dụng npm (khuyến nghị)
"C:\Program Files\nodejs\npm.cmd" run dev

# Phương pháp 2: Chạy trực tiếp với node
"C:\Program Files\nodejs\node.exe" server.js

# Phương pháp 3: Nếu PATH đã được cấu hình
npm run dev
```

### Bước 7: Kiểm tra server
Mở trình duyệt hoặc sử dụng PowerShell để test:
```powershell
# Test server
curl http://localhost:3000

# Test health endpoint
curl http://localhost:3000/api/health
```

## 🔧 Lệnh Chạy Nhanh (Quick Start)

**Chạy backend trong 3 lệnh:**
```powershell
# 1. Điều hướng đến backend
cd locket-backend

# 2. Cài đặt dependencies (chỉ cần chạy 1 lần)
"C:\Program Files\nodejs\npm.cmd" install

# 3. Chạy server
"C:\Program Files\nodejs\npm.cmd" run dev
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    - Đăng ký user mới
POST   /api/auth/login       - Đăng nhập
GET    /api/auth/profile     - Lấy profile user (Private)
PUT    /api/auth/profile     - Cập nhật profile (Private)
```

### Posts
```
GET    /api/posts            - Lấy danh sách posts (Private)
POST   /api/posts            - Tạo post mới (Private)
GET    /api/posts/:id        - Lấy post theo ID (Private)
PUT    /api/posts/:id        - Cập nhật post (Private)
DELETE /api/posts/:id        - Xóa post (Private)
POST   /api/posts/:id/like   - Like/Unlike post (Private)
POST   /api/posts/:id/comment - Thêm comment (Private)
GET    /api/posts/user/:userId - Lấy posts của user (Private)
```

### Health Check
```
GET    /api/health           - Kiểm tra server status
GET    /                     - API information
```

## 📝 Ví dụ API Usage

### Register User
```javascript
POST /api/auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123"
}
```

### Login User
```javascript
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "Password123"
}
```

### Create Post
```javascript
POST /api/posts
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "imageUrl": "https://example.com/image.jpg",
    "caption": "My awesome post!"
}
```

## 🔒 Authentication

API sử dụng JWT (JSON Web Tokens) để authentication. Sau khi login thành công, client sẽ nhận được token. Token này cần được gửi trong header cho các protected routes:

```
Authorization: Bearer <jwt_token>
```

## 📊 Database Schema

### User Schema
```javascript
{
    username: String (unique, required),
    email: String (unique, required),
    password: String (hashed, required),
    profilePicture: String,
    friends: [ObjectId],
    isActive: Boolean,
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date
}
```

### Post Schema
```javascript
{
    user: ObjectId (ref: User),
    imageUrl: String (required),
    caption: String,
    likes: [{
        user: ObjectId (ref: User),
        createdAt: Date
    }],
    comments: [{
        user: ObjectId (ref: User),
        text: String,
        createdAt: Date
    }],
    isActive: Boolean,
    createdAt: Date,
    updatedAt: Date
}
```

## 🧪 Testing API

Bạn có thể test API bằng:
- **Postman**: Import collection và test endpoints
- **cURL**: Command line testing
- **Thunder Client**: VS Code extension

### Ví dụ với cURL:
```bash
# Health check
curl http://localhost:3000/api/health

# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Password123"}'
```

## 🐛 Troubleshooting - Cách Fix Các Lỗi Thường Gặp

### ❌ Lỗi 1: "npm is not recognized" hoặc "Execution Policy"
```powershell
# Lỗi: npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled
# Giải pháp: Sử dụng đường dẫn đầy đủ
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npm.cmd" run dev
```

### ❌ Lỗi 2: "Could not read package.json: ENOENT"
```powershell
# Lỗi: npm error path D:\Locket\package.json
# Nguyên nhân: Đang chạy npm từ thư mục sai
# Giải pháp: Điều hướng đến thư mục backend
cd locket-backend
npm run dev
```

### ❌ Lỗi 3: "Cannot find module 'D:\Locket\server.js'"
```powershell
# Lỗi: Error: Cannot find module 'D:\Locket\server.js'
# Nguyên nhân: Đang chạy node từ thư mục sai
# Giải pháp: Điều hướng đến thư mục backend
cd locket-backend
node server.js
```

### ❌ Lỗi 4: "Failed to connect to MongoDB"
```powershell
# Kiểm tra MongoDB có chạy không
# Windows:
net start MongoDB

# Hoặc mở MongoDB Compass để kiểm tra kết nối
# URL: mongodb://localhost:27017
```

### ❌ Lỗi 5: "Port 3000 is already in use"
```powershell
# Tìm process đang sử dụng port 3000
netstat -ano | findstr :3000

# Kill process (thay <PID> bằng Process ID)
taskkill /PID <PID> /F

# Hoặc thay đổi port trong file .env
# PORT=3001
```

### ❌ Lỗi 6: "failed to connect to /10.0.2.2 (port 3000)" - Android Emulator
```powershell
# Đảm bảo server bind đến tất cả interfaces
# Trong server.js, dòng cuối cùng phải là:
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

# Android app phải sử dụng URL: http://10.0.2.2:3000/api
# KHÔNG sử dụng: http://localhost:3000/api
```

### ❌ Lỗi 7: "JWT_SECRET is not defined"
```powershell
# Nguyên nhân: Thiếu file .env
# Giải pháp: Tạo file .env trong thư mục locket-backend
New-Item -Path ".env" -ItemType File -Force
echo "JWT_SECRET=locket_super_secret_jwt_key_2024" >> .env
```

### ❌ Lỗi 8: PowerShell "&&" không được hỗ trợ
```powershell
# Lỗi: The token '&&' is not a valid statement separator
# Thay vì: cd locket-backend && npm run dev
# Sử dụng: 
cd locket-backend
npm run dev

# Hoặc sử dụng dấu chấm phẩy:
cd locket-backend; npm run dev
```

## 🔍 Kiểm Tra Server Hoạt Động

### Test server bằng PowerShell:
```powershell
# Test cơ bản
Invoke-WebRequest -Uri http://localhost:3000

# Test API health
Invoke-WebRequest -Uri http://localhost:3000/api/health

# Test với curl (nếu có)
curl http://localhost:3000
```

### Test server bằng trình duyệt:
- Mở trình duyệt và truy cập: `http://localhost:3000`
- Kết quả mong đợi: JSON response với thông tin API

## 🚀 Script Tự Động (Tạo file start.bat)

Tạo file `start.bat` trong thư mục `locket-backend`:
```batch
@echo off
echo Starting Locket Backend Server...
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run dev
pause
```

Sau đó chỉ cần double-click file `start.bat` để chạy server!

## 📁 Cấu trúc thư mục
```
locket-backend/
├── models/
│   ├── User.js
│   └── Post.js
├── routes/
│   ├── auth.js
│   └── posts.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── config.js
├── database.js
├── server.js
├── package.json
└── README.md
```

## 🔮 Tính năng sắp tới

- [ ] File Upload với Multer
- [ ] Real-time notifications với Socket.IO
- [ ] Friend system
- [ ] Image resizing với Sharp
- [ ] Rate limiting
- [ ] Email verification
- [ ] Password reset functionality

## 📱 Kết Nối với Android App

### URL cho Android Emulator:
```java
// Trong Android app, sử dụng URL này:
private static final String BASE_URL = "http://10.0.2.2:3000/api/";

// KHÔNG sử dụng:
// private static final String BASE_URL = "http://localhost:3000/api/";
```

### Cấu hình Network Security (Android):
Thêm vào `app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

### Test kết nối từ Android:
1. Đảm bảo backend đang chạy trên `http://localhost:3000`
2. Từ Android Emulator, test URL: `http://10.0.2.2:3000/api/health`
3. Kiểm tra Logcat để xem lỗi kết nối

## 📞 Support & Checklist

**Trước khi báo lỗi, hãy kiểm tra:**

✅ **Backend Setup:**
- [ ] Đã điều hướng đến thư mục `locket-backend`
- [ ] File `.env` đã được tạo với đầy đủ biến môi trường
- [ ] MongoDB đang chạy (`net start MongoDB`)
- [ ] Dependencies đã được cài đặt (`npm install`)
- [ ] Server chạy thành công (`npm run dev`)
- [ ] Test URL `http://localhost:3000` trả về JSON response

✅ **Android Connection:**
- [ ] Sử dụng URL `http://10.0.2.2:3000/api/` cho Android Emulator
- [ ] Đã cấu hình `network_security_config.xml`
- [ ] Kiểm tra Logcat để xem lỗi chi tiết
- [ ] Server bind đến `0.0.0.0` thay vì chỉ `localhost`

✅ **Common Issues:**
- [ ] Port 3000 không bị conflict với ứng dụng khác
- [ ] PowerShell Execution Policy không chặn npm
- [ ] Node.js và npm đã được cài đặt đúng cách 