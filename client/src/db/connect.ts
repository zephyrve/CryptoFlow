import "dotenv/config";
import mongoose from "mongoose";

export const connect = async () => {
    if (mongoose.connections[0].readyState) {
        return;
    }
    await mongoose.connect(process.env.DATABASE_URL as string);
};

