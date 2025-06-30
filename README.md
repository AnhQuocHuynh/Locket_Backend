# 🚀 Locket Backend API - Complete & Ready

API Backend cho ứng dụng Locket Clone được xây dựng với Node.js, Express, và MongoDB Atlas.

## ⚡ **KHỞI ĐỘNG NHANH**

### **Windows:**
```bash
.\start.bat
```

### **macOS/Linux:**
```bash
chmod +x *.sh
./start.sh
```

### **Kiểm tra API:**
```bash
# Health check
curl http://localhost:3000/api/health

# Test tất cả endpoints
npm run test-api
```

---

## 📚 **DOCUMENTATION**

| Guide | Mô tả | Khi nào sử dụng |
|-------|-------|------------------|
| **[📖 Setup Guide](docs/SETUP_GUIDE.md)** | Complete setup cho tất cả platforms | **Lần đầu setup** hoặc troubleshooting |
| **[🧪 API Testing Guide](docs/API_TESTING_GUIDE.md)** | Testing từ basic → advanced | **Test APIs** với Postman, cURL, automation |
| **[📱 Android Guide](docs/ANDROID_GUIDE.md)** | Mobile app integration | **Android development** |
| **[👥 Team Info](docs/TEAM_INFO.md)** | Database sharing info | **Team collaboration** |

---

## 🎯 **CURRENT STATUS**

- ✅ **Server:** Production ready trên port 3000
- ✅ **Database:** MongoDB Atlas (Cloud) đã setup 
- ✅ **APIs:** Authentication + Posts + Social features
- ✅ **Team Ready:** Cross-platform automation tools
- ✅ **Android Ready:** URLs và endpoints sẵn sàng

---

## 🏗️ **PROJECT STRUCTURE**

```
Locket_Backend/
├── 📁 docs/                     # Complete documentation
├── 📁 tests/                    # Test scripts & automation
├── 📁 models/                   # Database schemas
├── 📁 routes/                   # API endpoints
├── 📁 middleware/               # Authentication & validation
├── 🚀 start.bat/.sh            # Platform automation
├── 🔄 switch-database.bat/.sh   # Database switching
├── 📱 Locket_API_Collection.json # Postman collection
└── ⚙️ .env                      # Configuration
```

---

## 🔗 **API ENDPOINTS**

### **Base URLs:**
- **Local:** `http://localhost:3000/api`
- **Android Emulator:** `http://10.0.2.2:3000/api`

### **Available APIs:**
```http
# Public
GET  /api/health              # Server status
POST /api/auth/register       # User registration
POST /api/auth/login          # User login

# Protected (JWT required)
GET  /api/auth/profile        # User profile
GET  /api/posts               # Posts feed
POST /api/posts               # Create post
POST /api/posts/:id/like      # Like/unlike
POST /api/posts/:id/comment   # Add comment
```

**👉 Chi tiết:** [docs/API_TESTING_GUIDE.md](docs/API_TESTING_GUIDE.md)

---

## 🚨 **QUICK TROUBLESHOOTING**

### **Server không khởi chạy?**
```bash
# Windows
.\start.bat

# macOS/Linux
./start.sh

# Manual
npm install && npm start
```

### **APIs không hoạt động?**
1. Kiểm tra server: `http://localhost:3000/api/health`
2. Xem logs trong terminal
3. Check database connection

### **Test APIs?**
```bash
# Run comprehensive tests
node tests/test_api.js

# Test friend requests specifically  
node tests/test_friend_requests.js
```

### **Cần help chi tiết?**
📖 **[Setup Guide](docs/SETUP_GUIDE.md)** - Complete troubleshooting  
🧪 **[Test Scripts](tests/README.md)** - Automated testing tools

---

## 🤝 **TEAM DEVELOPMENT**

### **New team member setup:**
1. Clone/download project
2. Read [docs/TEAM_INFO.md](docs/TEAM_INFO.md) for database access
3. Run platform automation: `start.bat` hoặc `start.sh`
4. Test APIs: `npm run test-api`

### **Database switching:**
```bash
# Switch giữa Local ↔ Atlas
.\switch-database.bat     # Windows
./switch-database.sh      # macOS/Linux
```

---

## 📱 **MOBILE DEVELOPMENT**

**Android URLs:**
- Emulator: `http://10.0.2.2:3000/api`
- Device: `http://YOUR_IP:3000/api`

**👉 Complete guide:** [docs/ANDROID_GUIDE.md](docs/ANDROID_GUIDE.md)

---

## 🎉 **WHAT'S INCLUDED**

- 🔐 **JWT Authentication** with registration, login, profile
- 📸 **Posts System** with CRUD, likes, comments
- 👥 **Social Features** like/unlike, commenting
- 🔄 **Cross-platform** automation (Windows/macOS/Linux)
- 🧪 **Complete testing** suite with Postman collection
- 📱 **Mobile ready** with Android emulator support
- 👥 **Team collaboration** with shared MongoDB Atlas

---

**📚 Need detailed help?** → Check [docs/](docs/) folder cho complete guides.
