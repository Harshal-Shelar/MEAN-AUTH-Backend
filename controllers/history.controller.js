import History from '../models/History.js';
import {LocalStorage} from 'node-localstorage';

var localStorage = new LocalStorage('./scratch');

export const addHistory = async (req, resp) => {
    let product = new History(req.body);
    let result = await product.save();
    resp.send({ result });
};

export const getHistoryList = async (req, resp) => {
    let LoggedUserId = localStorage.getItem('LoggedUserId');
    const products = await History.find({userId : LoggedUserId});
    if (products.length > 0) {
        resp.send(products);
    } else {
        resp.send({ result: "No Product found" })
    }
};
