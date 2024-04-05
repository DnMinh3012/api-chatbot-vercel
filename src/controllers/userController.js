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
module.exports = {
    handleGetUsers: handleGetUsers,
}