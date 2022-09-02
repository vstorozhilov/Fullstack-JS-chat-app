const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    login : String,
    password: String,
    profile : {
        avatar: String,
        fullname: String,
        nickname: String,
        birthdate: Date,
        email: String,
        about: String
    },
  },
  { collection: "Users" }
);

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;