import user from "../models/user.js";
import { createError } from "../utils/error.js";
import { CreateSuccess } from "../utils/success.js"

export const getAllUser = async (req,res, next) =>{
    try {
        const users = await user.find()
        return next(CreateSuccess(200, "All Users", users))
    } catch (error) {
        return next(createError(200, "Internal server error"));
    }
}

export const getById = async (req,res, next) =>{
    try {
        const user = await user.findById(req.params.id);
        if(!user){
            return next(createError(404, "User not found"));
        }else{
            return next(CreateSuccess(200, "Single User", user));
        }
    } catch (error) {
        return next(createError(200, "Internal server error"));
    }
}