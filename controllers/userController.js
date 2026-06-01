import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../email/verifyEmail.js";
import { Session } from "../models/sessionModel.js";

import cloudinary from "../utils/cloudinary.js";
import asyncHandler from "../middleware/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import {
  allUserService,
  changePasswordService,
  forgotPasswordService,
  getUserByIdService,
  loginService,
  logoutService,
  registerService,
  reVerifyService,
  updateUserService,
  verifyOTPService,
  verifyService,
} from "../services/user.service.js";

//REGISTER USER
export const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const newUser = await registerService({
    firstName,
    lastName,
    email,
    password,
  });

  //return success response as well as the newUser created in the database
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
});

//VERIFY USER
export const verify = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomError("Auth token is missing or invalid", 400);
  }

  /*AuthHeader looks like 
    "[Bearer asds23adasdasd....]-Array" 
    index=0=>Bearer 
    index=1 =>token(asds23adasdasd....)
    
    So, basically we are extracting a token
    */
  const token = authHeader.split(" ")[1];

  const status = await verifyService({ token });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully!",
    data: status,
  });
});

//RE-VERIFY USER
export const reVerify = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const userToken = await reVerifyService({ email });

  return res.status(200).json({
    success: true,
    message: "Verification Email resent successfully!",
    token: userToken,
  });
});

//LOGIN
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { existingUser, accessToken, refreshToken } = await loginService({
    email,
    password,
  });

  return res.status(200).json({
    success: true,
    message: `Welcome back ${existingUser.firstName}!`,
    user: existingUser,
    accessToken,
    refreshToken,
  });
});

//LOGOUT
export const logout = asyncHandler(async (req, res) => {
  //We are getting userId from req.id which we assigned in middleware
  const userId = req.id;
  const status = await logoutService({ userId });

  return res.status(200).json({
    success: true,
    message: "You are successfully logged out!",
    data: status,
  });
});

//FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const status = await forgotPasswordService({ email });

  return res.status(200).json({
    success: true,
    message: "OTP sent to email successfully",
    data: status,
  });
});

//VERIFY OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;
  const email = req.params.email;

  const status = await verifyOTPService({ otp, email });

  return res.status(200).json({
    success: true,
    message: "OTP verified successfully",
    data: status,
  });
});

//CHANGE PASSWORD
export const changePassword = asyncHandler(async (req, res) => {
  //To change password we need new password and confirm password
  const { newPassword, confirmPassword } = req.body;
  const { email } = req.params;

  const status = await changePasswordService({
    newPassword,
    confirmPassword,
    email,
  });

  return res.status(200).json({
    success: true,
    message: "Password changed successfully!",
    data: status,
  });
});

//GET ALL USERS | ADMIN ONLY
export const allUser = asyncHandler(async (_, res) => {
  const users = await allUserService();

  return res.status(200).json({
    success: true,
    users,
  });
});

//GET USER BY ID
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await getUserByIdService({ userId });

  res.status(200).json({
    success: true,
    user,
  });
});

//UPDATE USER
export const updateUser = asyncHandler(async (req, res) => {
  const userIdToUpdate = req.params.id;

  //This will come from isAuthenticated middleware which we will put in the route
  const loggedUser = req.user;
  const { firstName, lastName, address, city, zipCode, phoneNo, role } =
    req.body;
  const file = req.file;

  const updatedUser = await updateUserService({
    userIdToUpdate,
    loggedUser,
    userDetails: {
      firstName,
      lastName,
      address,
      city,
      zipCode,
      phoneNo,
      role,
    },
    file,
  });

  return res.status(200).json({
    success: true,
    message: "Profile Updated Successfully!",
    user: updatedUser,
  });
});
