# API Backend Locket - HOÀN CHỈNH VÀ SẴN SÀNG

API Backend cho ứng dụng Locket Clone được xây dựng với Node.js, Express, và MongoDB Atlas.

## 🚀 KHỞI ĐỘNG NHANH CHO NHÓM

### **Nếu bạn đọc file này lần đầu:**
1. 📖 **Đọc [team-share-info.md](team-share-info.md)** - Lấy connection string Atlas
2. 🔧 **Đọc [team-bat-files-guide.md](team-bat-files-guide.md)** - Cách sử dụng automation tools
3. 📱 **Đọc [android-test-guide.md](android-test-guide.md)** - Hướng dẫn kiểm tra với ứng dụng Android
4. ⚡ **Chạy `start.bat`** - Khởi chạy backend ngay lập tức

### **Nếu bạn đã có sẵn thiết lập:**
```bash
# Chỉ cần 1 lệnh:
.\start.bat
```

---

## 📊 TỔNG QUAN BACKEND

### **🎯 Trạng thái hiện tại: PRODUCTION READY**
- ✅ **Database:** MongoDB Atlas (Cloud) - Đã setup hoàn chỉnh
- ✅ **Authentication:** JWT với security best practices
- ✅ **APIs:** RESTful với đầy đủ CRUD operations
- ✅ **Team Ready:** Automation tools và documentation đầy đủ
- ✅ **Android Compatible:** URLs và endpoints sẵn sàng

### **🔗 Database & Infrastructure**
- **Database:** MongoDB Atlas (Cloud) - `locket-cluster.tl4qrvz.mongodb.net`
- **Environment:** Development với Atlas configuration
- **Security:** JWT tokens, password hashing, input validation
- **Performance:** Database indexing, pagination, error handling

---

## 📂 CẤU TRÚC DỰ ÁN

```
D:\locket-backend\Locket_Backend/
├── 📁 models/                    # Database Schemas
│   ├── User.js                   # User authentication & profiles
│   ├── Post.js                   # Posts với likes/comments
│   ├── Friendship.js             # Friend system
│   └── Notification.js           # Real-time notifications
├── 📁 routes/                    # API Endpoints
│   ├── auth.js                   # Authentication routes
│   └── posts.js                  # Posts CRUD + social features
├── 📁 middleware/                # Security & Validation
│   ├── auth.js                   # JWT authentication
│   └── validation.js             # Input validation
├── 🚀 start.bat                  # Quick start automation
├── 🔄 switch-database.bat        # Database switching tool
├── ⚙️ .env                       # Atlas configuration (ACTIVE)
├── 💾 .env.atlas                 # Atlas backup config
├── 🏠 .env.local                 # Local MongoDB backup
├── 📝 server.js                  # Main application
├── 🔧 config.js                  # App configuration
├── 🗄️ database.js                # MongoDB connection
└── 📦 package.json               # Dependencies & scripts
```

---

## 🛠️ THIẾT LẬP MÔI TRƯỜNG (YÊU CẦU)

### **📋 Yêu cầu hệ thống:**
```bash
✅ Node.js v16+ (Khuyến nghị phiên bản LTS)
✅ npm v8+ (đi kèm với Node.js)
✅ Kết nối Internet (để kết nối MongoDB Atlas)
✅ Windows PowerShell/Command Prompt
✅ Git (tùy chọn - cho cộng tác nhóm)
```

### **🔧 Hướng dẫn cài đặt:**

#### **1. Kiểm tra Node.js:**
```bash
# Kiểm tra phiên bản Node.js
node --version

# Kiểm tra phiên bản npm  
npm --version

# Nếu chưa có Node.js, tải xuống tại: https://nodejs.org
```

#### **2. Sao chép/Tải xuống dự án:**
```bash
# Tùy chọn A: Sao chép Git (khuyến nghị)
git clone [repository-url]
cd Locket_Backend

# Tùy chọn B: Tải xuống ZIP và giải nén vào thư mục
# Đảm bảo đường dẫn: D:\locket-backend\Locket_Backend
```

#### **3. Cài đặt phụ thuộc:**
```bash
# Điều hướng đến thư mục dự án
cd "D:\locket-backend\Locket_Backend"

# Cài đặt tất cả phụ thuộc
npm install

# Xác minh cài đặt
npm list --depth=0
```

#### **4. Thiết lập môi trường:**
```bash
# Backend đã có sẵn .env được cấu hình cho Atlas
# Không cần tạo thêm gì cả!

# Xác minh môi trường
type .env
```

### **⚡ Xác minh thiết lập nhanh:**
```bash
# Kiểm tra 1: Kiểm tra phụ thuộc
npm list express mongoose

# Kiểm tra 2: Thử khởi động máy chủ  
.\start.bat

# Kiểm tra 3: Kiểm tra tình trạng (trong terminal mới)
curl http://localhost:3000/api/health
```

### **🚨 Các vấn đề thiết lập thường gặp:**

| Vấn đề | Giải pháp | Lệnh |
|-------|----------|---------|
| **Không tìm thấy Node.js** | Cài đặt từ nodejs.org | `node --version` |
| **npm install thất bại** | Chạy với quyền Quản trị viên | `npm cache clean --force` |
| **Chính sách thực thi PowerShell** | Kích hoạt script | `Set-ExecutionPolicy RemoteSigned` |
| **Cổng 3000 bận** | Tắt tiến trình hiện tại | `netstat -ano \| findstr :3000` |
| **Thiếu phụ thuộc** | Cài đặt lại gói | `rm -rf node_modules && npm install` |

### **💻 Thiết lập môi trường phát triển:**

#### **Tiện ích mở rộng VS Code (Khuyến nghị):**
```json
{
  "recommendations": [
    "ms-vscode.vscode-json",
    "ms-vscode.powershell", 
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### **Cấu hình Git (Nhóm):**
```bash
# Cấu hình git cho làm việc nhóm
git config user.name "Tên của bạn"
git config user.email "email.cua.ban@example.com"

# Kiểm tra nhánh hiện tại
git branch

# Kéo các thay đổi mới nhất
git pull origin Quốc
```

### **📦 Dependencies Overview:**

#### **Production Dependencies:**
```json
{
  "express": "^4.18.2",           // Web framework
  "mongoose": "^8.0.3",          // MongoDB ODM
  "bcryptjs": "^2.4.3",          // Password hashing
  "jsonwebtoken": "^9.0.2",      // JWT authentication
  "cors": "^2.8.5",              // Cross-origin requests
  "helmet": "^7.1.0",            // Security middleware
  "express-validator": "^7.0.1",  // Input validation
  "dotenv": "^16.3.1"            // Environment variables
}
```

#### **Development Dependencies:**
```json
{
  "nodemon": "^3.0.2"            // Auto-restart development server
}
```

### **🌐 Network Requirements:**

#### **For MongoDB Atlas:**
```bash
# Required outbound connections:
✅ MongoDB Atlas: *.mongodb.net (port 27017)
✅ npm registry: registry.npmjs.org (port 443)
✅ Node.js downloads: nodejs.org (port 443)

# Firewall settings (if needed):
# Allow outbound HTTPS (443) and MongoDB (27017)
```

#### **For Android Testing:**
```bash
# Local network requirements:
✅ Backend server: localhost:3000
✅ Android emulator: 10.0.2.2:3000
✅ Physical device: [Your_PC_IP]:3000

# Check your PC IP:
ipconfig | findstr IPv4
```

### **🎯 HƯỚNG DẪN THIẾT LẬP HOÀN CHỈNH:**

#### **Cho người mới bắt đầu:**
```bash
# Bước 1: Tải xuống Node.js
# Truy cập: https://nodejs.org/en/download/
# Tải xuống: Phiên bản Windows x64 LTS
# Cài đặt: Làm theo trình cài đặt (chấp nhận tất cả mặc định)

# Bước 2: Xác minh cài đặt
node --version    # Nên hiển thị v16.x.x hoặc cao hơn
npm --version     # Nên hiển thị v8.x.x hoặc cao hơn

# Bước 3: Lấy dự án
# Tải xuống ZIP từ kho lưu trữ HOẶC git clone
# Giải nén vào: D:\locket-backend\Locket_Backend

# Bước 4: Mở terminal trong thư mục dự án
# Nhấp chuột phải trong thư mục → "Mở trong Terminal" HOẶC
# Win+R → cmd → cd "D:\locket-backend\Locket_Backend"

# Bước 5: Cài đặt phụ thuộc
npm install
# Chờ hoàn thành (có thể mất 2-3 phút)

# Bước 6: Khởi động máy chủ
.\start.bat
# Máy chủ nên khởi động tại http://localhost:3000

# Bước 7: Kiểm tra trong trình duyệt
# Mở: http://localhost:3000/api/health
# Nên thấy: {"status": "OK", "message": "Server is running"}
```

#### **Thiết lập một lệnh (Cho người dùng có kinh nghiệm):**
```bash
# Nếu bạn đã cài đặt Node.js:
git clone [repo-url] && cd Locket_Backend && npm install && .\start.bat
```

### **🔍 Danh sách kiểm tra xác minh:**

| ✅ Kiểm tra | Lệnh | Kết quả mong đợi |
|----------|---------|-----------------|
| **Node.js đã cài đặt** | `node --version` | `v16.x.x` hoặc cao hơn |
| **npm hoạt động** | `npm --version` | `v8.x.x` hoặc cao hơn |
| **Dự án đã tải xuống** | `dir` | Thấy package.json, server.js, v.v. |
| **Phụ thuộc đã cài đặt** | `dir node_modules` | Thư mục tồn tại với các gói |
| **Môi trường sẵn sàng** | `type .env` | URI MongoDB Atlas hiển thị |
| **Máy chủ khởi động** | `.\start.bat` | "Server running on port 3000" |
| **API phản hồi** | `curl localhost:3000/api/health` | `{"status": "OK"}` |
| **Cơ sở dữ liệu kết nối** | Kiểm tra nhật ký máy chủ | "Connected to MongoDB Atlas" |

### **🆘 Nếu có gì đó không ổn:**

#### **Vấn đề Node.js:**
```bash
# Vấn đề: 'node' không được nhận dạng
# Giải pháp: Cài đặt lại Node.js, khởi động lại terminal

# Vấn đề: Phiên bản Node.js cũ
# Giải pháp: Gỡ cài đặt phiên bản cũ, cài đặt LTS mới nhất
```

#### **Vấn đề npm:**
```bash
# Vấn đề: npm install thất bại
npm cache clean --force
npm install

# Vấn đề: Quyền bị từ chối
# Chạy terminal với quyền Quản trị viên
```

#### **Vấn đề máy chủ:**
```bash
# Vấn đề: Cổng 3000 bận
netstat -ano | findstr :3000
# Tắt ID tiến trình được hiển thị
taskkill /PID [process_id] /F

# Vấn đề: Lỗi môi trường
copy .env.atlas .env
.\start.bat
```

#### **Vấn đề kết nối MongoDB:**
```bash
# Vấn đề: Hết thời gian kết nối
# Kiểm tra kết nối internet
# Kiểm tra cài đặt tường lửa (cho phép cổng MongoDB 27017)

# Vấn đề: Xác thực thất bại
# Xác minh file .env có URI Atlas đúng
type .env
```

---

## 🎯 TÀI LIỆU CHI TIẾT

### **📋 Cho team members:**
| File | Mục đích | Khi nào đọc |
|------|----------|-------------|
| **[team-share-info.md](team-share-info.md)** | 🔗 Atlas connection info | **LẦN ĐẦU SETUP** |
| **[team-bat-files-guide.md](team-bat-files-guide.md)** | 🛠️ Automation tools guide | **HỌC WORKFLOW** |
| **[android-test-guide.md](android-test-guide.md)** | 📱 API testing với Android | **KHI TEST APP** |

### **⚡ Quick Actions:**
```bash
# Khởi chạy server
.\start.bat

# Chuyển đổi database (local ↔ Atlas)
.\switch-database.bat

# Test API health
curl http://localhost:3000/api/health
```

---

## 🔗 API ENDPOINTS OVERVIEW

### **Authentication (`/api/auth`)**
- `POST /register` - Đăng ký user mới
- `POST /login` - Đăng nhập (trả về JWT token)
- `GET /profile` - Lấy thông tin profile (Private)
- `PUT /profile` - Cập nhật profile (Private)

### **Posts (`/api/posts`)**
- `GET /posts` - Feed posts với pagination (Private)
- `POST /posts` - Tạo post mới (Private)
- `POST /:id/like` - Like/Unlike post (Private)
- `POST /:id/comment` - Thêm comment (Private)
- `GET /user/:userId` - Posts của user cụ thể (Private)

### **System**
- `GET /api/health` - Health check
- `GET /` - API information

**📱 Android Base URL:** `http://10.0.2.2:3000/api`  
**🌐 Local Base URL:** `http://localhost:3000/api`

---

## 🏗️ ARCHITECTURE HIGHLIGHTS

### **🔐 Security Features**
- **JWT Authentication** với 7-day expiration
- **Password Hashing** với bcryptjs (cost 12)
- **Input Validation** với express-validator
- **CORS Configuration** for Android compatibility
- **Helmet Security** middleware

### **📊 Database Design**
- **User Model:** Comprehensive với friends system
- **Post Model:** Social features (likes, comments, virtual counts)
- **Friendship Model:** Status-based friend requests
- **Notification Model:** Multi-type notification system

### **⚡ Performance**
- **Database Indexing** cho optimal queries
- **Pagination** cho large datasets
- **Virtual Fields** cho computed data
- **Population** cho related data

---

## 🌐 TEAM DEVELOPMENT WORKFLOW

### **🔄 Database Options**
```bash
# Sử dụng Atlas (Team Sharing) - RECOMMENDED
.\switch-database.bat → Chọn "2"

# Sử dụng Local (Individual Dev)
.\switch-database.bat → Chọn "1"
```

### **👥 Team Collaboration**
1. **Tất cả dùng MongoDB Atlas** cho shared development
2. **Data sync real-time** giữa team members
3. **Consistent environment** cho testing
4. **Easy onboarding** với automation tools

---

## 🚨 XỬ LÝ SỰ CỐ

### **❓ Nếu gặp vấn đề:**

| Vấn đề | Giải pháp | File tham khảo |
|--------|----------|----------------|
| 🔧 **Không biết cách khởi động** | Chạy `.\start.bat` | [team-bat-files-guide.md](team-bat-files-guide.md) |
| 🌐 **Kết nối thất bại** | Kiểm tra .env Atlas URI | [team-share-info.md](team-share-info.md) |
| 📱 **Android không kết nối** | Dùng URL `10.0.2.2:3000` | [android-test-guide.md](android-test-guide.md) |
| 🔄 **Muốn đổi cơ sở dữ liệu** | Chạy `.\switch-database.bat` | [team-bat-files-guide.md](team-bat-files-guide.md) |

### **🆘 Lệnh khẩn cấp:**
```bash
# Đặt lại cấu hình Atlas
copy .env.atlas .env
.\start.bat

# Đặt lại cấu hình cục bộ  
copy .env.local .env
.\start.bat

# Kiểm tra cơ sở dữ liệu hiện tại
type .env | findstr MONGODB_URI
```

---

## 📱 TÍCH HỢP ANDROID

### **🔗 URL sẵn sàng sử dụng:**
```java
// URL cơ sở cho ứng dụng Android
private static final String BASE_URL = "http://10.0.2.2:3000/api/";

// Kiểm tra tình trạng
GET http://10.0.2.2:3000/api/health
```

### **📖 Chi tiết tích hợp:**
👉 **Xem [android-test-guide.md](android-test-guide.md)** để có:
- Mã thiết lập Retrofit
- Cấu hình bảo mật mạng
- Kịch bản kiểm tra API
- Ví dụ xử lý lỗi

---

## ✅ STATUS CHECK

### **💯 Backend đã sẵn sàng cho:**
- ✅ **Team Development** - Automation và documentation đầy đủ
- ✅ **Android Integration** - APIs tested và working
- ✅ **Production Deployment** - Security và performance optimized
- ✅ **Scalability** - MongoDB Atlas với proper indexing
- ✅ **Maintenance** - Clear documentation và troubleshooting

---

## 🎉 KẾT LUẬN

**Backend Locket đã HOÀN CHỈNH và sẵn sàng!**

### **🚀 Khởi động nhanh cho nhóm:**
1. **Cài đặt Node.js** từ https://nodejs.org (phiên bản LTS)
2. **Tải xuống dự án** và giải nén vào `D:\locket-backend\Locket_Backend`
3. **Mở terminal** trong thư mục dự án
4. **Chạy:** `npm install` (chờ 2-3 phút)
5. **Khởi động:** `.\start.bat`
6. **Kiểm tra:** Mở http://localhost:3000/api/health

### **📚 Tài liệu chi tiết:**
- 📖 **[team-share-info.md](team-share-info.md)** - Kết nối MongoDB Atlas
- 🔧 **[team-bat-files-guide.md](team-bat-files-guide.md)** - Công cụ tự động
- 📱 **[android-test-guide.md](android-test-guide.md)** - Tích hợp Android

### **✅ Sẵn sàng cho:**
- ✅ **Phát triển nhóm** - Cơ sở dữ liệu MongoDB Atlas chia sẻ
- ✅ **Tích hợp Android** - API đã kiểm tra và hoạt động  
- ✅ **Triển khai sản xuất** - Bảo mật và hiệu suất được tối ưu hóa
- ✅ **Hướng dẫn thành viên mới** - Tài liệu thiết lập hoàn chỉnh

**🚀 Mọi thứ đều được tự động hóa và tài liệu hóa để phát triển nhóm mượt mà!**
