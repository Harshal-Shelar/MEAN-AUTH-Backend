import Role from "../models/Role.js";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CreateSuccess } from "../utils/success.js";
import { createError } from "../utils/error.js";
import UserToken from "../models/UserToken.js";
import nodemailer from 'nodemailer'
import {LocalStorage} from "node-localstorage";

var localStorage = new LocalStorage('./scratch'); 

export const register = async (req, res, next) => {
    const role = await Role.find({ role: 'User' });
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: hashPassword,
        roles: role,
    });

    await newUser.save();
    return res.status(200).json("User register successfully");
}

export const getRegUser = async(req,res)=>{
    const user = await User.find();
    console.log(user);
    if (user.length > 0) {
        res.send(user);
    } else {
        res.send({ result: "No Product found" })
    }
}
export const registerAdmin = async (req, res, next) => {
    const role = await Role.find({});
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        password: hashPassword,
        isAdmin: true,
        roles: role,
    })
    await newUser.save();
    return next(CreateSuccess(200, "Admin Registered Successfully"));
}

export const getRegUserId = async (req, resp) => {
    let result = await User.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }
};

export const updateRegDetails = async (req, resp) => {
    let result = await User.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    let updatedData = req.body;
    resp.send({ result, updatedData });
};

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("roles", "role");
        localStorage.setItem('LoggedUserId', user._id);

        const { roles } = user;
        if (!user) {
            return res.status(404).send("user not found")
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordCorrect) {
            return res.send(400).send("password is incorrect")
        }
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin, roles: roles },
            process.env.JWT_SECRET
        )
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({
                status: 200,
                message: "login success",
                data: user
            })

    } catch (error) {
        return res.status(500).send("something went wrong")
    }
}

export const sendEmail = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({ email: { $regex: '^' + email + '$', $options: 'i' } });
    if (!user) {
        return next(createError(404, "User not found"))
    }
    const payload = {
        email: user.email
    }
    const expiryTime = 300;
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiryTime });

    const newToken = new UserToken({
        userId: user._id,
        token: token
    });

    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "harshalshelar2511@gmail.com",
            pass: "onevhuwdugxbqepy"
        }
    });

    let mailDetails = {
        from: "harshalshelar2511@gmail.com",
        to: email,
        subject: "Reset Password",
        html: `
        <html>
        <head>
        <title>Password Reset Request</title>
        </head>
        <body>
        <h1>Password Reset Request</h1>
        <p>Dear ${user.username},</p>
        <p>We have recieved a request to reset your password for your account with BookMYBook.</p>
        <a href=${process.env.LIVE_URL}/reset/${token}><button style="background-color: #4CAF50; color : white; padding : 14px 20px; border : none; cursor:pointer">Reset Password </button></a>
        <p>Thank You </p>
        </body>
        </html>
        `,
    };
    mailTransporter.sendMail(mailDetails, async (err, data) => {
        if (err) {
            console.log(err);
            return next(createError(500, "Something went wrong while sending mail"))
        } else {
            await newToken.save();
            return next(CreateSuccess(200, "Email sent successfully"))
        }
    })
};

export const resetPassword = (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
        if (err) {
            return next(createError(500, "Reset link is Expired"))
        } else {
            const response = data;
            const user = await User.findOne({ email: { $regex: '^' + response.email + '$', $options: 'i' } });
            const salt = await bcrypt.genSalt(10);
            const encryptPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptPassword;
            try {
                const updatePassword = await User.findOneAndUpdate(
                    { _id: user._id },
                    { $set: user },
                    { new: true }
                )
                return next(CreateSuccess(200, "Password Reset Success !!"))
            } catch (error) {
                return next(createError(500, "Something went wrong while reseting the password !!"))
            }
        }
    })
}