const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authentificationControl = async (token) => {

    try {
        const decoded = jwt.verify(token, "test key");
        const {login} = await User.findById(decoded.id);
        return login;
    }

    catch (e) {
        return null;
    }

};

module.exports = authentificationControl;
