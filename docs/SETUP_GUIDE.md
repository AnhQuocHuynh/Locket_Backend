# 🚀 Complete Setup Guide - Locket Backend

## 📖 **TỔNG QUAN**

Guide này hướng dẫn setup complete Locket Backend với hỗ trợ đa nền tảng (Windows, macOS, Linux) và automation tools cho team development.

---

## 🔧 **PHASE 1: HỆ THỐNG YÊU CẦU**

### **📋 Kiểm tra requirements:**
```bash
✅ Node.js v16+ (Khuyến nghị LTS)
✅ npm v8+ (đi kèm với Node.js)
✅ Kết nối Internet (cho MongoDB Atlas)
✅ Terminal/Command Line
✅ Git (tùy chọn - cho team collaboration)
```

### **🔍 Verify installation:**
```bash
# Kiểm tra phiên bản Node.js
node --version

# Kiểm tra phiên bản npm
npm --version

# Nếu chưa có Node.js: https://nodejs.org
```

---

## 🚀 **PHASE 2: PLATFORM-SPECIFIC SETUP**

### **🪟 Windows Setup**

#### **Files automation có sẵn:**
```
📂 Locket_Backend/
├── 🚀 start.bat              # Khởi chạy server
├── 🔄 switch-database.bat    # Chuyển đổi database
└── 📦 download-postman.bat   # Tải Postman
```

#### **Quick Start Windows:**
```bash
# Bước 1: Clone/Download project
cd D:\locket-backend\Locket_Backend

# Bước 2: Khởi chạy server (all-in-one)
.\start.bat

# Script tự động:
# ✅ Kiểm tra .env configuration
# ✅ Cài đặt dependencies nếu thiếu  
# ✅ Kiểm tra internet connection
# 🚀 Khởi chạy development server
```

#### **Database switching:**
```bash
# Chuyển đổi database
.\switch-database.bat

# Menu options:
# 1. Local MongoDB (localhost)
# 2. MongoDB Atlas (cloud/team)
```

### **🍎 macOS/Linux Setup**

#### **Files automation có sẵn:**
```
📂 Locket_Backend/
├── 🚀 start.sh               # Khởi chạy server
├── 🔄 switch-database.sh     # Chuyển đổi database
├── 🔍 platform-check.sh      # Kiểm tra platform
└── 📦 download-postman.sh    # Tải Postman
```

#### **First-time setup:**
```bash
# Bước 1: Cấp quyền thực thi (chỉ cần 1 lần)
chmod +x *.sh

# Bước 2: Kiểm tra platform và environment
./platform-check.sh

# Bước 3: Khởi chạy server
./start.sh
```

#### **Database switching:**
```bash
# Chuyển đổi database
./switch-database.sh
```

---

## 💾 **PHASE 3: DATABASE CONFIGURATION**

### **🔄 Database Switching System**

Project hỗ trợ 2 modes database:

#### **Mode 1: Local MongoDB**
- 🏠 **Dành cho:** Development cá nhân
- 📍 **URI:** `mongodb://localhost:27017/locket_db`
- ⚡ **Ưu điểm:** Nhanh, không cần internet
- ❌ **Nhược điểm:** Không share với team

#### **Mode 2: MongoDB Atlas (Cloud)**
- 👥 **Dành cho:** Team collaboration
- 🌐 **URI:** MongoDB Atlas connection string
- ✅ **Ưu điểm:** Share data real-time với team
- 📶 **Yêu cầu:** Internet connection

### **Environment Files Structure:**
```
📂 .env         # ← Active configuration (được sử dụng)
📂 .env.local   # ← Backup Local MongoDB config
📂 .env.atlas   # ← Backup Atlas MongoDB config
```

### **Switching Process:**
1. **Chạy switcher script** (bat/sh)
2. **Chọn database mode** (Local hoặc Atlas)
3. **Script tự động copy** config file tương ứng → `.env`
4. **Restart server** để apply changes

---

## 🛠️ **PHASE 4: DEVELOPMENT WORKFLOW**

### **🎯 Workflow cho Team Development:**

#### **Scenario 1: Individual Development**
```bash
# 1. Switch to Local Database
.\switch-database.bat → Option 1 (Local)

# 2. Start development server
.\start.bat

# 3. Develop features
# Data chỉ lưu trên máy local
```

#### **Scenario 2: Team Collaboration**
```bash
# 1. Switch to Atlas Database  
.\switch-database.bat → Option 2 (Atlas)

# 2. Start development server
.\start.bat

# 3. Collaborate with team
# Data sync real-time với tất cả team members
```

#### **Scenario 3: Testing & Production**
```bash
# 1. Use Atlas for production-like testing
.\switch-database.bat → Option 2 (Atlas)

# 2. Run test suite
npm run test-api

# 3. Share results với team
```

### **🔄 Daily Development Checklist:**
- [ ] ✅ Chạy startup script để khởi chạy server
- [ ] ✅ Verify server running: `http://localhost:3000/api/health`
- [ ] ✅ Check database mode phù hợp (Local vs Atlas)
- [ ] ✅ Android testing URL ready: `http://10.0.2.2:3000/api`

---

## 📦 **PHASE 5: DEPENDENCY MANAGEMENT**

### **Auto-installation trong startup scripts:**
```bash
# Scripts tự động kiểm tra và cài đặt:
✅ node_modules/ folder existence
✅ package.json dependencies
✅ Chạy npm install nếu thiếu
```

### **Manual installation nếu cần:**
```bash
# Cài đặt dependencies
npm install

# Verify installation
npm list --depth=0

# Clean install nếu có issues
rm -rf node_modules package-lock.json
npm install
```

### **Key Dependencies:**
```json
{
  "express": "^4.18.2",           // Web framework
  "mongoose": "^8.0.3",          // MongoDB ODM
  "jsonwebtoken": "^9.0.2",      // JWT authentication
  "bcryptjs": "^2.4.3",          // Password hashing
  "cors": "^2.8.5",              // Cross-origin requests
  "helmet": "^7.1.0"             // Security middleware
}
```

---

## 🚨 **TROUBLESHOOTING**

### **🔧 Common Issues & Solutions:**

#### **1. Scripts không chạy được**

**Windows:**
```bash
# Issue: PowerShell execution policy
Set-ExecutionPolicy RemoteSigned

# Alternative: Sử dụng Command Prompt
cmd
start.bat
```

**macOS/Linux:**
```bash
# Issue: Permission denied
chmod +x *.sh

# Issue: Wrong line endings
dos2unix *.sh

# Issue: Bash not found
#!/bin/bash
```

#### **2. Server startup failures**

**Port 3000 đã được sử dụng:**
```bash
# Windows: Tìm process sử dụng port
netstat -ano | findstr :3000

# macOS/Linux: Tìm và kill process
lsof -ti:3000 | xargs kill

# Hoặc: Đổi PORT trong .env
PORT=3001
```

**Node.js không tìm thấy:**
```bash
# Verify Node.js installation
node --version

# Reinstall Node.js nếu cần
# Download: https://nodejs.org
```

#### **3. Database connection issues**

**MongoDB Atlas connection failed:**
```bash
✅ Kiểm tra internet connection
✅ Verify connection string trong .env
✅ Ensure IP whitelist (set 0.0.0.0/0)
✅ Check username/password đúng
```

**Local MongoDB không connect:**
```bash
# Windows: Start MongoDB service
net start MongoDB

# macOS: Start với Homebrew
brew services start mongodb-community

# Linux: Start systemd service  
sudo systemctl start mongod
```

#### **4. npm install failures**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Install với elevated permissions (if needed)
# Windows: Run as Administrator
# macOS/Linux: sudo npm install
```

---

## ⚡ **QUICK REFERENCE**

### **Essential Commands:**

**Windows:**
```bash
.\start.bat                    # Start server
.\switch-database.bat          # Switch DB
.\download-postman.bat         # Get Postman
npm run test-api               # Test APIs
```

**macOS/Linux:**
```bash
./start.sh                     # Start server
./switch-database.sh           # Switch DB
./platform-check.sh           # Check environment
./download-postman.sh          # Get Postman
npm run test-api               # Test APIs
```

### **Important URLs:**
```
Local Server:      http://localhost:3000
Health Check:      http://localhost:3000/api/health
Android Emulator:  http://10.0.2.2:3000/api
Documentation:     docs/ folder
```

### **Files để backup:**
```
✅ .env files (local, atlas configs)
✅ package.json & package-lock.json
✅ All .bat/.sh scripts
```

---

**🎉 Setup complete! Your Locket Backend is ready for development.**

**📱 Next steps:** Check `docs/API_TESTING_GUIDE.md` để test APIs hoặc `docs/ANDROID_GUIDE.md` cho Android integration. 