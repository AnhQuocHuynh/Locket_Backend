# MongoDB Atlas Setup Guide

## Bước 1: Tạo Account và Cluster

### 1.1 Đăng ký MongoDB Atlas
- Truy cập: https://www.mongodb.com/atlas
- Click "Try Free" 
- Đăng ký với email (hoặc Google)

### 1.2 Tạo Organization và Project
- Organization Name: `Locket-Team`
- Project Name: `Locket-Backend`

### 1.3 Tạo Database Cluster
- Chọn "M0 Sandbox (FREE)" - 512MB
- Cloud Provider: AWS
- Region: Singapore (ap-southeast-1) 
- Cluster Name: `Locket-Cluster`

## Bước 2: Cấu hình Database Access

### 2.1 Tạo Database User
```
Username: locket_user
Password: LocketApp2024!
Privileges: Read and write to any database
```

### 2.2 Cấu hình Network Access
- Allow Access from Anywhere (0.0.0.0/0)
- Comment: "Development Team Access"

## Bước 3: Lấy Connection String

1. Clusters → Connect → Drivers
2. Driver: Node.js, Version 4.1+
3. Copy connection string:

```
mongodb+srv://locket_user:<password>@locket-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Bước 4: Cập nhật Project

### 4.1 Backup file .env hiện tại
```powershell
copy .env .env.local
```

### 4.2 Cập nhật .env với Atlas URI
```env
MONGODB_URI=mongodb+srv://locket_user:LocketApp2024!@locket-cluster.xxxxx.mongodb.net/locket_db?retryWrites=true&w=majority
```

### 4.3 Test kết nối
```powershell
npm run dev
```

## Bước 5: Share với Team

### Thông tin để share:
- **MongoDB Atlas Account:** [email của bạn]
- **Connection String:** mongodb+srv://locket_user:LocketApp2024!@locket-cluster.xxxxx.mongodb.net/locket_db
- **Username:** locket_user  
- **Password:** LocketApp2024!

### Team members cần:
1. Copy connection string vào file .env của họ
2. Restart backend server
3. Tất cả sẽ dùng chung 1 database

## Bước 6: Migration Data (Nếu cần)

### Từ Local sang Atlas:
```bash
# Nếu có MongoDB tools
mongodump --uri="mongodb://localhost:27017/locket_db" --out=./backup
mongorestore --uri="mongodb+srv://locket_user:LocketApp2024!@cluster.mongodb.net/locket_db" ./backup/locket_db
```

### Hoặc tạo data mẫu mới trên Atlas

## Troubleshooting

### Lỗi thường gặp:
1. **Authentication failed** → Kiểm tra username/password
2. **IP not whitelisted** → Kiểm tra Network Access  
3. **Connection timeout** → Kiểm tra firewall/internet

### Commands hữu ích:
```powershell
# Switch giữa local và atlas
copy .env.local .env    # Dùng local MongoDB
copy .env.atlas .env    # Dùng Atlas MongoDB

# Test connection
curl http://localhost:3000/api/health
``` 