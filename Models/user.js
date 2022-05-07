const mongoose = require("mongoose");
const slugify = require("slugify");
const { isEmail } = require("validator");
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  profile_picture: {
    type: String,
    trim: true,
    default: "",
  },
  slug: String,
  totalFollowing: {
    type: Array,
    default: null,
  },
  totalFollowers: {
    type: Array,
    default: null,
  },
  email_verified: {
    type: Boolean,
    default: false,
  },
});
userSchema.pre("save", function (next) {
  if (!this.isModified("username", "description")) {
    next();
    return;
  }
  this.slug = slugify(this.username);
  next();
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("email")) return next();
  this.email_verified = false;
});

userSchema.post("save", function (error, doc, next) {
  let errorMessage;

  // map with all unique items you defined in your schema
  const errorsMap = {
    email: "this email is already in use",
    username: "this username is already taken",
  };

  if (error.code === 11000) {
    errorMessage = Object.keys(error.keyValue)
      .map((key) => errorsMap[key])
      .join(", ");
  } else {
    errorMessage = error.message;
  }

  if (errorMessage) next(new Error(errorMessage));
  else next();
});
module.exports = mongoose.model("authentication", userSchema, "authentication");
