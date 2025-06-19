import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const connect = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1); // Exit the process if connection fails
    }
}
export default connect;
//"type": "commonjs",