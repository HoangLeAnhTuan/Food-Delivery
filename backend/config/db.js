import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://hoangleanhtuanhht:anhtuan1605@clusterdemo.qt6lk.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDemo').then(() => console.log('Connect Successfully'))
}