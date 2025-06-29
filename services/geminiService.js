const { GoogleGenerativeAI } = require("@google/generative-ai");
const fetch = require('node-fetch');

// Khởi tạo Gemini client với API key từ biến môi trường
// Hãy chắc chắn rằng bạn đã thêm GEMINI_API_KEY vào file .env của mình
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Tải hình ảnh từ URL và chuyển đổi nó sang định dạng base64 mà Gemini có thể hiểu.
 * @param {string} url - URL của hình ảnh.
 * @returns {object} - Đối tượng chứa dữ liệu base64 và mime type.
 */
async function urlToGenerativePart(url) {
        const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    const mimeType = response.headers.get('content-type');
    if (!mimeType.startsWith('image/')) {
        throw new Error(`URL does not point to a valid image. Mime type: ${mimeType}`);
    }
    return {
        inlineData: {
            data: buffer.toString("base64"),
            mimeType,
        },
    };
}

/**
 * Gọi API Gemini để phân loại một hình ảnh.
 * @param {string} imageUrl - URL của hình ảnh cần phân loại.
 * @returns {string} - Tên danh mục được phân loại.
 */
async function classifyImage(imageUrl) {
    try {
        // Sử dụng model gemini-1.5-flash, một model đa phương thức hiệu quả
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = 'Phân loại hình ảnh này vào một trong các danh mục sau hoặc đề xuất một danh mục mới phù hợp nếu không có danh mục nào khớp: Đồ ăn, Phong cảnh, Vui nhộn, Con người, Động vật, Nghệ thuật, Thời trang, Thể thao, Công nghệ, Khác. Chỉ trả về tên danh mục dưới dạng một từ duy nhất.';

        const imagePart = await urlToGenerativePart(imageUrl);

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        
        // Trả về tên danh mục đã được làm sạch
        return text.trim();
    } catch (error) {
        console.error("Lỗi khi phân loại hình ảnh bằng Gemini:", error);
        // Ném lỗi để lớp gọi có thể xử lý
        throw new Error("Không thể phân loại hình ảnh.");
    }
}

module.exports = { classifyImage };
