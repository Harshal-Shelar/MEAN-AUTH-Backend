import Product from '../models/Product.js';
import {LocalStorage} from 'node-localstorage';

var localStorage = new LocalStorage('./scratch');

export const addUser = async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    resp.send({ result });
};

export const userList = async (req, resp) => {
    let LoggedUserId = localStorage.getItem('LoggedUserId');
    const products = await Product.find({userId : LoggedUserId});
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Product found" })
    }
};

export const getAllEmail = async (req, resp) => {
    const products = await Product.find();
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Product found" })
    }
};

export const deleteUser =  async (req, resp) => {
    let result = await Product.deleteOne({ _id: req.params.id });
    resp.send(result)
};

export const updateUser = async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    } else {
        resp.send({ "result": "No Record Found." })
    }
};

export const updateUserbyId = async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    let updatedData = req.body;
    resp.send({ result, updatedData });
};