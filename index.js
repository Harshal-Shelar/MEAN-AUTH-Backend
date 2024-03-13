import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import crudRoute from './routes/product.js';
import userRoute from './routes/user.js';
import historyRoute from './routes/history.js';
import cookieParser from 'cookie-parser';
import {LocalStorage} from 'node-localstorage';
import History from './models/History.js';

const app = express();
dotenv.config();

var localStorage = new LocalStorage('./scratch');

app.use(express.json());

const connectMongoDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
    }catch(error){
        throw error;
    }
}
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:4200',
    credentials : true
}));

app.use("/api/role",roleRoute);
app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/crud",crudRoute);
app.use("/api/crud/history",historyRoute);

app.use((obj, req, res, next)=>{
    const statusCode = obj.status || 500;
    const errorMessage = obj.message || "Something went wrong";
    return res.status(statusCode).json({
        success : [200,201,204].some(a => a === obj.status) ? true : false,
        status : statusCode,
        message : errorMessage,
        data : obj.data
    })
});


app.listen(2511, ()=>{
    connectMongoDB();
    console.log("Server connected");
})