const mongoose = require("mongoose");

//create schema object

const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First Name is required"],
      typeof: "string",
    },
    lastName: {
      required: [true, "Last Name is required"],
      typeof: "string",
    },
    profilePhoto: {
      typeof: "string",
      default:
        "https://cdn.pixabay.com/photo/2014/04/02/10/25/man-303792_1280.png",
    },
    email: {
      typeof: "string",
      required: [true, "Email is required"],
    },
    bio: {
      typeof: "string",
    },
    password: {
      typeof: "string",
      required: [true, "Password is required"],
    },
    postCount: {
      typeof: "number",
      default: 0,
    },
    isBlocked: {
      typeof: "boolean",
      default: false,
    },
    isAdmin: {
      typeof: "boolean",
      default: false,
    },
    role: {
      typeof: "string",
      enum: ["Admin", "Guest", "Blogger"],
    },
    isFollwing: {
      typeof: "boolean",
      default: false,
    },
    unFollwing: {
      typeof: "boolean",
      default: false,
    },
    isAccountVerified: {
      typeof: "boolean",
      default: false,
    },
    accountVerificationToken: String,
    accountVerificationTokenExpires: Date,
    viewdBy: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followers: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    followimg: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// compile schema into model
const User = mongoose.model("User", userSchema);

module.exports = User;
