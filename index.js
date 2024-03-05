import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import Product from './models/Product.js';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import cookieParser from 'cookie-parser';
const app = express();
dotenv.config();

var getUserId;

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


app.post("/add-user", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send({ result });
});

app.get("/user-list", async (req, resp) => {
    const products = await Product.find({userId : "65e58868727ad72a1c1b2400"});
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Product found" })
    }
});

app.delete("/userDelete/:id", async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
});

app.get("/userUpdate/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }
})

app.put("/updateUser/:id", async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send({ result });
});

app.listen(2511, ()=>{
    connectMongoDB();
    console.log("Server connected");
})