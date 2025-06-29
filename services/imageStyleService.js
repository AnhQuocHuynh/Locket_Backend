const { VertexAI } = require('@google-cloud/vertexai');
const fetch = require('node-fetch');

// Cấu hình Vertex AI
const project = process.env.GOOGLE_CLOUD_PROJECT;
const location = 'us-central1';
const vertexAI = new VertexAI({ project, location });

// Chọn model chuyên cho việc chỉnh sửa ảnh
const imageEditingModel = vertexAI.getGenerativeModel({
    model: 'imageedit-generation-001',
});

/**
 * Tải ảnh từ URL và chuyển sang dạng base64
 */
async function imageUrlToBase64(url) {
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const buffer = await response.buffer();
    return buffer.toString('base64');
}

/**
 * Biến đổi hình ảnh theo một phong cách nhất định bằng Imagen
 * @param {string} base64Image - Ảnh gốc dưới dạng base64.
 * @param {string} stylePrompt - Mô tả phong cách (ví dụ: 'in anime style', 'as a watercolor painting').
 * @returns {string} - Dữ liệu base64 của ảnh đã được biến đổi.
 */
async function transformImage(base64Image, stylePrompt) {
    try {
        // Chuẩn bị các phần của request
        const textPart = { text: stylePrompt };
        const imagePart = { inlineData: { mimeType: 'image/png', data: base64Image } };

        // Gọi API bằng phương thức generateContent
        const result = await imageEditingModel.generateContent({
            contents: [{ role: 'user', parts: [textPart, imagePart] }],
        });

        // Trích xuất dữ liệu ảnh từ kết quả trả về
        const response = result.response;
        const imageData = response.candidates[0].content.parts[0].inlineData.data;
        
        return imageData;

    } catch (error) {
        console.error('Lỗi khi biến đổi hình ảnh bằng Imagen:', error);
        throw new Error('Không thể biến đổi hình ảnh.');
    }
}

module.exports = { transformImage, imageUrlToBase64 };
