# 🚀 HƯỚNG DẪN SỬ DỤNG CÁC FILE BAT CHO TEAM

## 📁 TỔNG QUAN CÁC FILE BAT

Trong thư mục backend có **2 file .bat** chính để hỗ trợ team development:

```
📂 Locket_Backend/
├── 🚀 start.bat              # Khởi chạy backend server
├── 🔄 switch-database.bat    # Chuyển đổi database
└── 📝 Các file hướng dẫn khác
```

---

## 🚀 FILE: start.bat

### **Mục đích:**
- Khởi chạy backend server một cách tự động và an toàn
- Kiểm tra môi trường trước khi chạy
- Hiển thị thông tin cần thiết cho development

### **Cách sử dụng:**

#### **Cách 1: Double-click (Khuyến nghị)**
```
👆 Click đúp vào file start.bat trong Windows Explorer
```

#### **Cách 2: Từ Command Line**
```cmd
cd D:\locket-backend\Locket_Backend
start.bat
```

#### **Cách 3: Từ PowerShell**
```powershell
cd D:\locket-backend\Locket_Backend
.\start.bat
```

### **Những gì file này làm:**
1. ✅ **Kiểm tra file .env** - Đảm bảo cấu hình database có sẵn
2. ✅ **Kiểm tra node_modules** - Tự động cài dependencies nếu thiếu
3. ✅ **Kiểm tra internet** - Cần cho MongoDB Atlas
4. 🚀 **Khởi chạy server** - Chạy `npm run dev`
5. 📱 **Hiển thị URLs** - Cho localhost và Android emulator

### **Kết quả khi chạy thành công:**
```
================================================
         LOCKET BACKEND SERVER
================================================

Starting Locket Backend Server...
Using MongoDB Atlas (Cloud Database)

[INFO] Starting development server with MongoDB Atlas...
[INFO] Server will be available at: http://localhost:3000
[INFO] For Android Emulator use: http://10.0.2.2:3000
[INFO] Database: MongoDB Atlas (Cloud)

🚀 Server running on port 3000
MongoDB Connected: locket-cluster.tl4qrvz.mongodb.net
```

---

## 🔄 FILE: switch-database.bat

### **Mục đích:**
- Chuyển đổi giữa Local MongoDB và MongoDB Atlas
- Hữu ích khi cần test với database khác nhau
- Backup và restore cấu hình database

### **Cách sử dụng:**

#### **Chạy file:**
```
👆 Double-click switch-database.bat
```

#### **Menu lựa chọn:**
```
================================================
       DATABASE CONFIGURATION SWITCHER
================================================

Choose database configuration:
1. Local MongoDB (localhost)
2. MongoDB Atlas (cloud/team sharing)

Enter your choice (1 or 2): _
```

### **Lựa chọn 1: Local MongoDB**
- 🏠 **Dành cho:** Development cá nhân
- 📍 **Database:** mongodb://localhost:27017/locket_db
- ⚡ **Ưu điểm:** Nhanh, không cần internet
- ❌ **Nhược điểm:** Không share được với team

### **Lựa chọn 2: MongoDB Atlas**
- 👥 **Dành cho:** Team collaboration
- 🌐 **Database:** MongoDB Atlas (Cloud)
- ✅ **Ưu điểm:** Share với cả team, backup tự động
- 📶 **Yêu cầu:** Cần internet connection

### **Files được quản lý:**
```
📂 .env         # Cấu hình hiện tại (active)
📂 .env.local   # Backup cấu hình Local MongoDB  
📂 .env.atlas   # Backup cấu hình Atlas MongoDB
```

---

## 🎯 WORKFLOW KHUYẾN NGHỊ CHO TEAM

### **Scenario 1: Development Cá Nhân**
```bash
1. switch-database.bat → Chọn "1" (Local)
2. start.bat → Khởi chạy với local DB
3. Develop features độc lập
```

### **Scenario 2: Team Collaboration**
```bash
1. switch-database.bat → Chọn "2" (Atlas)
2. start.bat → Khởi chạy với shared DB  
3. Test với data chung của team
```

### **Scenario 3: Testing & Deployment**
```bash
1. switch-database.bat → Chọn "2" (Atlas)
2. start.bat → Test với production-like environment
3. Share results với team
```

---

## 📋 CHECKLIST CHO TEAM MEMBERS

### **Lần đầu setup:**
- [ ] Đảm bảo có file `.env` với Atlas connection string
- [ ] Test `start.bat` - server phải chạy thành công
- [ ] Test `switch-database.bat` - có thể chuyển đổi database
- [ ] Verify kết nối: `curl http://localhost:3000/api/health`

### **Hàng ngày development:**
- [ ] Chạy `start.bat` để khởi chạy server
- [ ] Kiểm tra server URL: http://localhost:3000
- [ ] Android testing URL: http://10.0.2.2:3000/api
- [ ] Dùng `switch-database.bat` khi cần đổi database

---

## 🚨 TROUBLESHOOTING

### **Lỗi: ".env not found"**
**Nguyên nhân:** Thiếu file .env  
**Giải pháp:** 
```
1. Xem file team-share-info.md
2. Copy connection string Atlas vào .env
3. Hoặc chạy switch-database.bat
```

### **Lỗi: "No internet connection"**
**Nguyên nhân:** Không có mạng (cần cho Atlas)  
**Giải pháp:**
```
1. Kiểm tra internet connection
2. Hoặc switch sang Local MongoDB
```

### **Lỗi: "Failed to install dependencies"**
**Nguyên nhân:** Node.js chưa cài hoặc network issue  
**Giải pháp:**
```
1. Cài Node.js từ nodejs.org
2. Kiểm tra npm: npm --version
3. Run as Administrator
```

### **Server không khởi chạy được**
**Nguyên nhân:** Port 3000 đã được sử dụng  
**Giải pháp:**
```
1. Tắt ứng dụng đang dùng port 3000
2. Hoặc đổi PORT trong .env
3. Restart máy nếu cần
```

---

## 💡 TIPS CHO TEAM

### **🔄 Switching Database:**
- Dùng Local MongoDB khi develop features mới
- Dùng Atlas khi cần test với team data
- Luôn kiểm tra database hiện tại trước khi code

### **🚀 Quick Start:**
- Bookmark URL: http://localhost:3000
- Tạo desktop shortcut cho start.bat
- Thêm URLs vào bookmark browser

### **👥 Team Collaboration:**
- Thông báo team khi switch sang Atlas
- Share status database đang dùng
- Coordinate khi cần test cùng data

---

## ✅ KẾT LUẬN

**Với 2 file .bat này, team có thể:**
- ⚡ **Khởi chạy server nhanh chóng** với start.bat
- 🔄 **Chuyển đổi database linh hoạt** với switch-database.bat
- 🛠️ **Tự động xử lý lỗi** và dependency management
- 👥 **Collaborate hiệu quả** giữa local và cloud database

**Chỉ cần double-click và everything works! 🎉** 