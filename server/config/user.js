// 暂时没考虑注册用户，所以用户存储在本地好了
const users = require('../../config.js').users;
module.exports = {
    items: users
};