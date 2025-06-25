# Locket Backend API - PHÂN TÍCH CẤU TRÚC HOÀN CHỈNH

Backend API cho ứng dụng Locket Clone được xây dựng với Node.js, Express, và MongoDB.

##  TỔNG QUAN CẤU TRÚC BACKEND (ĐÃ PHÂN TÍCH)

###  Thư mục chính: D:\locket-backend\Locket_Backend

`
D:\locket-backend\Locket_Backend/
 models/                      HOÀN CHỈNH
    User.js                  Schema đầy đủ với authentication
    Post.js                  Posts với likes/comments system
    Friendship.js            Hệ thống kết bạn với status
    Notification.js          Thông báo real-time
 routes/                      HOÀN CHỈNH
    auth.js                  Register/Login/Profile routes
    posts.js                 CRUD + Like/Comment routes
 middleware/                  HOÀN CHỈNH
    auth.js                  JWT authentication middleware
    validation.js            Input validation với express-validator
 node_modules/                Dependencies đã cài đặt
 .env                         CẦN TẠO (có template)
 .gitignore                   Git configuration
 config.js                    App configuration
 database.js                  MongoDB connection
 package.json                 Dependencies & scripts
 server.js                    Main application server
 start.bat                    Quick start script
 README.md                    Documentation (này)
`

##  TÍNH NĂNG ĐÃ TRIỂN KHAI

###  Authentication System (HOÀN CHỈNH)
- User registration với username/email/password validation
- User login với JWT token generation
- Password hashing với bcryptjs
- Protected routes với authentication middleware
- Profile management (get/update)

###  Posts System (HOÀN CHỈNH)
- Create post với image URL và caption
- Get posts feed với pagination
- Get posts by user ID
- Update post content
- Delete post
- Like/Unlike posts với toggle functionality
- Comment system với text validation
- Posts populated với user info và counts

###  Advanced Features (ĐÃ CÓ MODELS)
- **Friend System**: Request/Accept/Decline/Block functionality
- **Notification System**: Real-time notifications với types
- **Security**: CORS, Helmet, input validation
- **Performance**: Database indexing, pagination
- **Error Handling**: Comprehensive error responses

##  CÁCH CHẠY BACKEND

### 1. Chuẩn bị Environment
`powershell
# Điều hướng đến thư mục backend
cd "D:\locket-backend\Locket_Backend"

# Tạo file .env (QUAN TRỌNG!)
New-Item -Path ".env" -ItemType File -Force
echo "PORT=3000" > .env
echo "NODE_ENV=development" >> .env
echo "MONGODB_URI=mongodb://localhost:27017/locket_db" >> .env
echo "JWT_SECRET=locket_super_secret_jwt_key_2024" >> .env
echo "JWT_EXPIRE=7d" >> .env
echo "CORS_ORIGIN=*" >> .env

# Đảm bảo MongoDB đang chạy
net start MongoDB
`

### 2. Chạy Server
`powershell
# Sử dụng start script có sẵn
.\start.bat

# Hoặc chạy trực tiếp
"C:\Program Files\nodejs\npm.cmd" run dev

# Hoặc với node
"C:\Program Files\nodejs\node.exe" server.js
`

### 3. Test Server
`powershell
# Test health endpoint
curl http://localhost:3000/api/health

# Test từ Android Emulator
curl http://10.0.2.2:3000/api/health
`

##  API ENDPOINTS AVAILABLE

### Authentication (/api/auth)
- POST /api/auth/register - Đăng ký user mới
- POST /api/auth/login - Đăng nhập và nhận JWT token
- GET /api/auth/profile - Lấy thông tin profile (Private)
- PUT /api/auth/profile - Cập nhật profile (Private)

### Posts (/api/posts)
- GET /api/posts - Lấy feed posts với pagination (Private)
- POST /api/posts - Tạo post mới (Private)
- GET /api/posts/:id - Lấy post theo ID (Private)
- PUT /api/posts/:id - Cập nhật post (Private)
- DELETE /api/posts/:id - Xóa post (Private)
- POST /api/posts/:id/like - Like/Unlike post (Private)
- POST /api/posts/:id/comment - Thêm comment (Private)
- GET /api/posts/user/:userId - Lấy posts của user (Private)

### System
- GET /api/health - Health check
- GET / - API information

##  KẾT NỐI VỚI ANDROID APP

### Android Base URL:
`java
// Sử dụng trong Android app
private static final String BASE_URL = "http://10.0.2.2:3000/api/";
`

### Network Security Config:
`xml
<!-- app/src/main/res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
`

##  TROUBLESHOOTING

###  Lỗi thường gặp:
1. **Server không start**: Kiểm tra MongoDB đã chạy chưa
2. **Cannot find module**: Đảm bảo có đầy đủ files models/, routes/, middleware/
3. **Android không connect**: Sử dụng URL 10.0.2.2:3000 thay vì localhost
4. **JWT errors**: Tạo file .env với JWT_SECRET
5. **PowerShell execution policy**: Sử dụng đường dẫn đầy đủ đến npm.cmd

###  Quick Fix Commands:
`powershell
# Fix 1: Start MongoDB
net start MongoDB

# Fix 2: Navigate to correct directory
cd "D:\locket-backend\Locket_Backend"

# Fix 3: Create .env file
New-Item -Path ".env" -ItemType File -Force
echo "JWT_SECRET=locket_secret_key" >> .env
echo "MONGODB_URI=mongodb://localhost:27017/locket_db" >> .env

# Fix 4: Use full npm path
"C:\Program Files\nodejs\npm.cmd" run dev
`

##  DATABASE SCHEMAS

### User Model Features:
- Username/Email uniqueness validation
- Password hashing với bcrypt
- Profile fields: displayName, bio, profilePicture
- Friends array và counters
- Activity tracking
- Privacy settings

### Post Model Features:
- User reference với population
- Image URL storage
- Like system với user tracking
- Comment system với validation
- Virtual fields cho counts
- Timestamps và soft delete

### Advanced Models:
- **Friendship**: Status-based friend requests
- **Notification**: Multi-type notification system

##  KẾT LUẬN

**Backend D:\locket-backend\Locket_Backend đã HOÀN CHỈNH với:**
-  Tất cả models và routes cần thiết
-  Authentication system với JWT
-  Posts CRUD với social features
-  Security và validation đầy đủ
-  Ready cho Android app connection
-  Sẵn sàng cho production deployment

**Chỉ cần:**
1. Tạo file .env
2. Start MongoDB
3. Chạy .\start.bat
4. Connect từ Android app với URL http://10.0.2.2:3000/api/

**Backend sẵn sàng phục vụ Locket Clone App! **
