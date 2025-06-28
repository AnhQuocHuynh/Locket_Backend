# 🧪 Complete API Testing Guide - Locket Backend

## 🚀 **QUICK START**

### **⚡ Kiểm tra server đang chạy:**
```bash
# Truy cập browser để test GET endpoints:
http://localhost:3000/api/health

# Response mong đợi:
{
  "success": true,
  "message": "Locket Backend API is running",
  "timestamp": "2025-06-26T09:13:18.469Z",
  "environment": "development"
}
```

### **🎯 Test Endpoints nhanh:**
```bash
# Windows: Khởi chạy server
.\start.bat

# macOS/Linux: Khởi chạy server  
./start.sh

# Test tự động tất cả APIs
npm run test-api
```

---

## ❌ **TROUBLESHOOTING PHỔ BIẾN**

### **Lỗi "Route not found" khi test qua browser:**
```json
{
  "success": false,
  "message": "Route /api/auth/login not found"
}
```

**🔥 NGUYÊN NHÂN:** Bạn đang sử dụng **GET request** (browser URL) để truy cập **POST endpoints**.

### **✅ HTTP Methods đúng:**

| Endpoint | Method | Browser Test | Tool Cần |
|----------|--------|--------------|----------|
| `/api/health` | **GET** | ✅ Browser OK | Any |
| `/` | **GET** | ✅ Browser OK | Any |
| `/api/auth/register` | **POST** | ❌ Browser không được | Postman/cURL |
| `/api/auth/login` | **POST** | ❌ Browser không được | Postman/cURL |
| `/api/auth/profile` | **GET** | 🔐 Cần JWT token | Postman + Auth |
| `/api/posts` | **GET/POST** | 🔐 Cần JWT token | Postman + Auth |

---

## 📋 **TẤT CẢ API ENDPOINTS**

### **🔍 Health & Status**
```http
GET /api/health          - Kiểm tra server status
GET /                    - API root info
```

### **🔐 Authentication**
```http
POST /api/auth/register  - Đăng ký user mới
POST /api/auth/login     - Đăng nhập user
GET /api/auth/profile    - Lấy thông tin profile (JWT required)
PUT /api/auth/profile    - Cập nhật profile (JWT required)
```

### **📝 Posts Management**
```http
GET /api/posts           - Lấy feed posts (JWT required)
POST /api/posts          - Tạo post mới (JWT required)
GET /api/posts/:id       - Lấy chi tiết post (JWT required)
PUT /api/posts/:id       - Cập nhật post (JWT required, owner only)
DELETE /api/posts/:id    - Xóa post (JWT required, owner only)
POST /api/posts/:id/like - Like/Unlike post (JWT required)
POST /api/posts/:id/comment - Add comment (JWT required)
GET /api/posts/user/:userId - Posts by user (JWT required)
```

---

## 🛠️ **TESTING TOOLS & METHODS**

### **Method 1: Automated Test Script (Recommended)**
```bash
# Terminal 1: Start server
npm start
# hoặc
.\start.bat

# Terminal 2: Run comprehensive tests
npm run test-api
```

**✅ Automated script bao gồm:**
- Authentication flow (register, login, profile)
- Posts CRUD operations
- Like/Unlike functionality
- Comment system
- Error handling validation
- Real data creation and cleanup

### **Method 2: cURL Commands**

#### **Authentication Flow:**
```bash
# 1. Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Password123"
  }'

# 2. Login to get JWT token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Save the token from response!
```

---

## 📱 **POSTMAN COMPLETE SETUP**

#### **Import Ready-made Collection:**
1. Mở Postman
2. Click **Import** 
3. Select file: `Locket_API_Collection.postman_collection.json`
4. Collection sẽ tự động được import với tất cả requests

---

**🎉 Complete API testing setup ready!**

**📚 Next:** Check `ANDROID_GUIDE.md` for mobile app integration hoặc `SETUP_GUIDE.md` for environment setup. 