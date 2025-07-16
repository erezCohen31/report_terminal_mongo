import { MongoClient } from 'mongodb';
import dotenv from "dotenv";
dotenv.config()

const uri = process.env.MONGO_URI
export const client = new MongoClient(uri);

export async function connectDB(func) {
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        await func()
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
    }
    finally {
        await client.close();
    }
}
