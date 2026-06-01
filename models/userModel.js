import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    profilePic: { type: String, default: "" }, //Cloudinary Image URL
    profilePicPublicId: { type: String, default: "" },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: { type: String, required: true }, //select: false but expilcit req in login is needed using .select("+password")
    role: { type: String, enum: ["user", "admin"], default: "user" },
    token: { type: String, default: null },
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },
    address: { type: String },
    city: { type: String },
    zipCode: { type: String, trim: true },
    phoneNo: { type: String, trim: true },
  },
  { timestamps: true },
);

export const User = mongoose.model("User", userSchema);
