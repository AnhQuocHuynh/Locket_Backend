# 🌟 LOCKET BACKEND - TEAM SHARING INFO

## ✅ MONGODB ATLAS ĐÃ SETUP THÀNH CÔNG!

### 📊 Thông tin Database Team
- **Database:** MongoDB Atlas (Cloud)
- **Status:** ✅ ACTIVE và sẵn sàng
- **Cluster:** Locket-Cluster
- **Region:** Singapore (ap-southeast-1)

### 🔗 Connection Information

**Database URI:**
```
mongodb+srv://locket_user:Quocmongodb0705!@locket-cluster.tl4qrvz.mongodb.net/locket_db?retryWrites=true&w=majority&appName=Locket-Cluster
```

**Credentials:**
- **Username:** `locket_user`
- **Password:** `Quocmongodb0705!`
- **Database Name:** `locket_db`

### 🚀 Cách Team Members Kết Nối

#### Bước 1: Cập nhật file .env
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://locket_user:Quocmongodb0705!@locket-cluster.tl4qrvz.mongodb.net/locket_db?retryWrites=true&w=majority&appName=Locket-Cluster
JWT_SECRET=locket_super_secret_jwt_key_2024_make_this_very_long_and_complex_in_production
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

#### Bước 2: Restart Backend Server
```powershell
npm run dev
```

#### Bước 3: Test Connection
```powershell
curl http://localhost:3000/api/health
```

### 🔄 Database Switching (Cho Developers)

**Nếu muốn switch giữa Local và Atlas:**
```powershell
.\switch-database.bat
```

**Files backup:**
- `.env.local` - Local MongoDB config
- `.env.atlas` - Atlas MongoDB config
- `.env` - Current active config

### 📱 API Endpoints (Tất cả team dùng chung)

**Base URLs:**
- Local: `http://localhost:3000/api`
- Android Emulator: `http://10.0.2.2:3000/api`

**Available Endpoints:**
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/comment` - Add comment

### 🎯 Team Development Workflow

1. **Tất cả team members** dùng cùng MongoDB Atlas
2. **Data sẽ sync real-time** giữa các developers
3. **Tạo users/posts** trên máy này → **Thấy ngay trên máy khác**
4. **Phù hợp cho testing** và **team collaboration**

### 🛠️ Troubleshooting

**Nếu connection failed:**
1. Kiểm tra internet connection
2. Kiểm tra .env file có đúng connection string
3. Restart server: `npm run dev`

**Nếu authentication failed:**
- Kiểm tra username/password trong connection string
- Đảm bảo IP được whitelist (đã set 0.0.0.0/0)

### 📞 Support

- **Setup by:** [Tên bạn]
- **Date:** 25/06/2025
- **Atlas Account:** [Email bạn dùng đăng ký]

---
**🎉 Database sẵn sàng cho team development!** 
**Tất cả members chỉ cần copy connection string vào .env và restart server.** 