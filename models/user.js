const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

/* eslint no-param-reassign: 0 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: String,
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  }],
});

userSchema.plugin(uniqueValidator);

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
