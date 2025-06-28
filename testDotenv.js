import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT || 3000;
console.log('Test MONGODB_URI:', process.env.MONGODB_URI);