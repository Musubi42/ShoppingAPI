const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");

const UsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      // Cannot replicate this user name
      unique: false //Une fois le schema crée je ne peux pas le modifier d'un claquement de doigt, voir la doc
      //https://mongoosejs.com/docs/faq.html
    },
    email: {
      type: String,
      required: true,
      // unique: true
    }, //
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UsersSchema);
