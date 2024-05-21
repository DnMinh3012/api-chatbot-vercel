import customerService from "../services/customerService"
require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

let handleGetUsers = async (req, res) => {
    let id = req.query.id; //all,id
    if (id) {
        let users = await customerService.getUsers(id);
        return res.status(200).json({
            errCode: 0,
            message: 'ok',
            users
        })
    } else {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!',
            users: []
        })
    }
}
let handleGetDishes = async (req, res) => {
    let id = req.query.id; //all,id
    let users = await customerService.getDishes('ALL');
    // if (id) {
    //     let users = await customerService.getDishes('ALL');
    //     return res.status(200).json({
    //         errCode: 0,
    //         message: 'ok',
    //         users
    //     })
    // } else {
    //     return res.status(500).json({
    //         errCode: 1,
    //         message: 'Missing inputs parameter!',
    //         users: []
    //     })
    // }
}


let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        });

    }
    let message = await customerService.deleteUser(req.body.id);
    return res.status(200).json(message);
}
let handleCompleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!'
        });

    }
    let message = await customerService.CompleteUser(req.body.id);
    return res.status(200).json(message);
}
let handleGetFeedback = async (req, res) => {
    let id = req.query.id; //all,id
    if (id) {
        let users = await customerService.getAllFeedback(id);
        return res.status(200).json({
            errCode: 0,
            message: 'ok',
            users
        })
    } else {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!',
            users: []
        })
    }
}

module.exports = {
    handleGetUsers: handleGetUsers,
    handleDeleteUser: handleDeleteUser,
    handleCompleteUser: handleCompleteUser,
    handleGetFeedback: handleGetFeedback,
    handleGetDishes: handleGetDishes
}