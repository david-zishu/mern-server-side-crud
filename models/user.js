const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate(value) {
        if (!isEmail(value)) {
          throw Error("Please enter a valid email!");
        }
      },
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minLength: 10,
      maxLength: 10,
    },
    gender: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dateCreated: Date,
    dateUpdated: Date,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("users", userSchema);
module.exports = User;
