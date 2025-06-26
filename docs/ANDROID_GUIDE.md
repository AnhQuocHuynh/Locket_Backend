# 📱 HƯỚNG DẪN TEST ỨNG DỤNG ANDROID

## ✅ TRẠNG THÁI BACKEND
- **Server:** ✅ Đang chạy trên port 3000
- **Database:** ✅ MongoDB Atlas đã kết nối  
- **APIs:** ✅ Tất cả endpoints đã test thành công
- **Authentication:** ✅ JWT hoạt động bình thường

## 🔗 API ENDPOINTS CHO ANDROID

### Base URLs
```
Local Testing: http://10.0.2.2:3000/api
Production: http://localhost:3000/api
```

### 🔐 Endpoints Xác Thực

#### Đăng Ký User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com", 
  "password": "Test123ABC"
}

Response: 201 Created
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

#### Đăng Nhập User  
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123ABC"
}

Response: 200 OK
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### Lấy Thông Tin Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "user": { ... }
}
```

### 📸 Endpoints Posts

#### Tạo Post Mới
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Bài đăng tuyệt vời của tôi!"
}

Response: 201 Created
{
  "success": true,
  "data": { ... }
}
```

#### Lấy Feed Posts
```http
GET /api/posts?page=1&limit=10
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pages": 1,
    "total": 5
  }
}
```

#### Like Post
```http
POST /api/posts/:id/like
Authorization: Bearer <token>

Response: 200 OK
{
  "success": true,
  "message": "Post đã được like",
  "liked": true,
  "likesCount": 1
}
```

#### Thêm Comment
```http
POST /api/posts/:id/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Bài đăng hay quá!"
}

Response: 201 Created
{
  "success": true,
  "comment": { ... }
}
```

## 🧪 CÁC KỊCH BẢN TEST

### Kịch bản 1: Đăng ký & Đăng nhập User
1. Đăng ký user mới với dữ liệu hợp lệ
2. Đăng nhập với thông tin vừa đăng ký  
3. Kiểm tra nhận được JWT token
4. Sử dụng token để truy cập các endpoints cần xác thực

### Kịch bản 2: CRUD Posts
1. Tạo post với image URL và caption
2. Lấy posts feed và kiểm tra post xuất hiện
3. Like post và kiểm tra số lượng like
4. Thêm comment và kiểm tra comment xuất hiện

### Kịch bản 3: Xử lý Lỗi
1. Thử đăng ký với email đã tồn tại → lỗi 400
2. Thử đăng nhập với mật khẩu sai → lỗi 401  
3. Truy cập endpoint cần xác thực mà không có token → lỗi 401
4. Tạo post mà không có image URL → lỗi 400

## 📲 GỢI Ý IMPLEMENT ANDROID

### Network Security Config
```xml
<!-- app/src/main/res/xml/network_security_config.xml -->
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

### Retrofit API Interface
```java
public interface LocketAPI {
    @POST("auth/register")
    Call<AuthResponse> register(@Body RegisterRequest request);
    
    @POST("auth/login") 
    Call<AuthResponse> login(@Body LoginRequest request);
    
    @GET("auth/profile")
    Call<UserResponse> getProfile(@Header("Authorization") String token);
    
    @GET("posts")
    Call<PostsResponse> getPosts(@Header("Authorization") String token,
                                @Query("page") int page);
    
    @POST("posts")
    Call<PostResponse> createPost(@Header("Authorization") String token,
                                 @Body CreatePostRequest request);
}
```

### Mẫu API Client
```java
public class APIClient {
    private static final String BASE_URL = "http://10.0.2.2:3000/api/";
    private static Retrofit retrofit;
    
    public static Retrofit getClient() {
        if (retrofit == null) {
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
        return retrofit;
    }
}
```

## ✅ CHECKLIST TEST

- [ ] Backend server đang chạy trên port 3000
- [ ] MongoDB Atlas đã kết nối
- [ ] Android app có thể truy cập http://10.0.2.2:3000/api/health
- [ ] Đăng ký user hoạt động
- [ ] Đăng nhập user trả về JWT token hợp lệ
- [ ] Các endpoints cần xác thực hoạt động với token
- [ ] Các thao tác CRUD posts hoạt động
- [ ] Xử lý lỗi response đúng cách

## 🚨 KHẮC PHỤC SỰ CỐ

### Vấn đề Kết nối
- Đảm bảo backend server đang chạy
- Sử dụng 10.0.2.2:3000 cho Android emulator
- Kiểm tra network security config
- Xác minh kết nối MongoDB Atlas

### Vấn đề Xác thực  
- Kiểm tra định dạng JWT token
- Xác minh Authorization header: "Bearer <token>"
- Đảm bảo token chưa hết hạn (mặc định 7 ngày)

### Lỗi API
- Kiểm tra Content-Type header trong request
- Xác minh định dạng JSON trong request body
- Xử lý HTTP status codes đúng cách
- Log response errors để debug

---
**Backend đã sẵn sàng cho việc test Android! 🚀** 