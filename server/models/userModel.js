const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    login: String,
    password: String,
    isOnline: { type: Boolean, default: false },
    profile: {
      avatar: String,
      fullname: String,
      nickname: String,
      birthdate: Date,
      email: String,
      about: String
    }
  },
  { collection: 'Users' }
);

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = UserModel;
