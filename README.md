# 🚀 Locket Backend - Setup Guide

Backend API cho ứng dụng mạng xã hội Locket được xây dựng với Node.js, Express, và MongoDB.

## 📋 Yêu cầu hệ thống

- **Node.js** v16+ (khuyến nghị LTS)
- **npm** v8+ (đi kèm với Node.js)
- **MongoDB** (Local hoặc MongoDB Atlas)
- **Git** (tùy chọn)

## 🔧 Cài đặt môi trường

### Windows

#### 1. Cài đặt Node.js
```bash
# Tải và cài đặt từ: https://nodejs.org
# Hoặc sử dụng Chocolatey
choco install nodejs

# Kiểm tra cài đặt
node --version
npm --version
```

#### 2. Cài đặt MongoDB
```bash
# Tải MongoDB Community Server từ: https://www.mongodb.com/try/download/community
# Hoặc sử dụng Chocolatey
choco install mongodb

# Khởi động MongoDB service
net start MongoDB
```

#### 3. Clone và setup project
```bash
# Clone repository
git clone <repository-url>
cd Locket_Backend

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
copy .env.example .env
```

#### 4. Cấu hình database
```bash
# Chạy script chuyển đổi database
.\switch-database.bat

# Chọn option:
# 1. Local MongoDB (localhost:27017)
# 2. MongoDB Atlas (cloud)
```

#### 5. Khởi chạy server
```bash
# Sử dụng script automation
.\start.bat

# Hoặc manual
npm start
```

### macOS

#### 1. Cài đặt Node.js
```bash
# Sử dụng Homebrew
brew install node

# Hoặc tải từ: https://nodejs.org
# Kiểm tra cài đặt
node --version
npm --version
```

#### 2. Cài đặt MongoDB
```bash
# Sử dụng Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Khởi động MongoDB service
brew services start mongodb-community
```

#### 3. Clone và setup project
```bash
# Clone repository
git clone <repository-url>
cd Locket_Backend

# Cấp quyền thực thi cho scripts
chmod +x *.sh

# Cài đặt dependencies
npm install

# Tạo file .env từ .env.example
cp .env.example .env
```

#### 4. Cấu hình database
```bash
# Chạy script chuyển đổi database
./switch-database.sh

# Chọn option:
# 1. Local MongoDB (localhost:27017)
# 2. MongoDB Atlas (cloud)
```

#### 5. Khởi chạy server
```bash
# Sử dụng script automation
./start.sh

# Hoặc manual
npm start
```

## ⚙️ Cấu hình

### File .env
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/locket_db
# Hoặc MongoDB Atlas URI

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# Email Configuration (cho xác thực email)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### MongoDB Atlas Setup (tùy chọn)
1. Tạo tài khoản tại [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Tạo cluster mới
3. Tạo database user
4. Whitelist IP (0.0.0.0/0 cho development)
5. Lấy connection string và cập nhật MONGODB_URI

## 🚀 Khởi chạy

### Windows
```bash
# Sử dụng script automation (khuyến nghị)
.\start.bat

# Hoặc manual
npm install
npm start
```

### macOS/Linux
```bash
# Sử dụng script automation (khuyến nghị)
./start.sh

# Hoặc manual
npm install
npm start
```

## ✅ Kiểm tra hoạt động

```bash
# Health check
curl http://localhost:3000/api/health

# Hoặc mở browser: http://localhost:3000/api/health
```

## 📱 URLs cho Mobile Development

- **Local:** `http://localhost:3000/api`
- **Android Emulator:** `http://10.0.2.2:3000/api`
- **iOS Simulator:** `http://localhost:3000/api`

## 🧪 Testing

Xem file `docs/TEST_GUIDE.md` để biết chi tiết về testing APIs.

```bash
# Chạy test suite
npm run test-api

# Test specific functionality
node tests/test_friend_requests.js
```

## 📁 Cấu trúc project

```
Locket_Backend/
├── 📁 docs/                     # Documentation
├── 📁 tests/                    # Test scripts
├── 📁 models/                   # Database schemas
├── 📁 routes/                   # API endpoints
├── 📁 middleware/               # Authentication & validation
├── 📁 utils/                    # Utility functions
├── 🚀 start.bat/.sh            # Platform automation
├── 🔄 switch-database.bat/.sh   # Database switching
├── 📱 Locket_API_Collection.json # Postman collection
└── ⚙️ .env                      # Configuration
```

## 🚨 Troubleshooting

### Server không khởi chạy
```bash
# Kiểm tra port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # macOS/Linux

# Kiểm tra MongoDB
mongo --eval "db.runCommand('ping')"
```

### Database connection failed
```bash
# Kiểm tra MongoDB service
net start MongoDB              # Windows
brew services start mongodb-community  # macOS

# Kiểm tra connection string trong .env
```

### Dependencies issues
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📚 Tài liệu tham khảo

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)

---

**🎉 Setup complete! Server đang chạy tại http://localhost:3000**
