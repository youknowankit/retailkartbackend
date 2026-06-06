import bcrypt from "bcryptjs";
import { User } from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";
import jwt from "jsonwebtoken";
import { verifyEmail } from "../email/verifyEmail.js";
import { Session } from "../models/sessionModel.js";
import { sendOTPMail } from "../email/sendOTPMail.js";
import cloudinary from "../utils/cloudinary.js";

export const registerService = async ({
  firstName,
  lastName,
  email,
  password,
}) => {
  //check if anything is missing while registering
  if (!firstName || !lastName || !email || !password) {
    throw new CustomError("All fields are required", 400);
  }

  //check if user already exists in the database
  const user = await User.findOne({ email });
  if (user) {
    throw new CustomError("User already exists", 409);
  }

  //Hashing for password using bcryptjs
  const hashedPassword = await bcrypt.hash(password, 10);

  //Now, we create user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  //Generating TOKEN
  const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
    expiresIn: "10m",
  });

  //We pass token to the new user
  newUser.token = token;

  await newUser.save();

  //Send the verification Email
  await verifyEmail(token, newUser.email);

  /*Removing password before sending response */
  newUser.password = undefined;
  // const userResponse = newUser.toObject();
  // delete userResponse.password;
  // return userResponse;

  return newUser;
};

export const verifyService = async ({ token }) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new CustomError("The registration token has expired", 400);
    }

    throw new CustomError("Token verification failed", 400);
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  user.token = null;
  user.isVerified = true;
  await user.save();

  return true;
};

export const reVerifyService = async ({ email }) => {
  //Find user in database
  const user = await User.findOne({ email });

  //Handle usernot found
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  //Generate the token again send email, provide new token to user in DB and save
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "10m",
  });
  verifyEmail(token, email); //sends email for verification again
  user.token = token;
  await user.save();

  return user.token;
};

export const loginService = async ({ email, password }) => {
  //check for missing details
  if (!email || !password) {
    throw new CustomError("All fields are required!", 400);
  }

  //check if user exists in the database
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new CustomError("Invalid Email or password!", 404);
  }

  //check password is valid or not
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);

  if (!isPasswordValid) {
    throw new CustomError("Invalid Credentials!", 401);
  }

  //Check if password valid but user not verified
  if (existingUser.isVerified === false) {
    throw new CustomError("Verify account and then login", 400);
  }

  //Generate access token and reference token
  const accessToken = jwt.sign(
    { id: existingUser._id },
    process.env.SECRET_KEY,
    { expiresIn: "10d" },
  );

  const refreshToken = jwt.sign(
    { id: existingUser._id },
    process.env.SECRET_KEY,
    { expiresIn: "30d" },
  );

  existingUser.isLoggedIn = true;
  await existingUser.save();

  //check for existing session if it exists then delete it
  const existingSession = await Session.findOne({ userId: existingUser._id });
  if (existingSession) {
    await Session.deleteOne({ userId: existingUser._id });
  }

  //create a new session for user
  await Session.create({ userId: existingUser._id });

  return { existingUser, accessToken, refreshToken };
};

export const logoutService = async ({ userId }) => {
  await Session.deleteMany({ userId });
  await User.findByIdAndUpdate(userId, { isLoggedIn: false });

  return true;
};

export const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  //If User exists then generate an OTP an send an Email
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); //10 min expiry

  user.otp = otp;
  user.otpExpiry = otpExpiry;

  await user.save();

  await sendOTPMail(otp, email);

  return true;
};

export const verifyOTPService = async ({ otp, email }) => {
  if (!otp) {
    throw new CustomError("OTP is required", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (!user.otp || !user.otpExpiry) {
    throw new CustomError("OTP is not generated or already verified", 400);
  }

  if (user.otpExpiry < new Date()) {
    throw new CustomError("OTP Expired. Please request a new OTP.", 400);
  }

  if (otp !== user.otp) {
    throw new CustomError("OTP is invalid", 400);
  }

  user.otp = null;
  user.optExpiry = null;

  await user.save();

  return true;
};

export const changePasswordService = async ({
  newPassword,
  confirmPassword,
  email,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  if (!newPassword || !confirmPassword) {
    throw new CustomError("All fields are required", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new CustomError("Passwords do not match", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  return true;
};

export const allUserService = async () => {
  const users = await User.find();
  return users;
};

export const getUserByIdService = async ({ userId }) => {
  const user = await User.findById(userId).select(
    "-password -otp -otpExpiry -token",
  ); //removes what not to show

  if (!user) {
    throw new CustomError("User not found", 404);
  }

  return user;
};

export const updateUserService = async ({
  userIdToUpdate,
  loggedUser,
  userDetails,
  file,
}) => {
  const { firstName, lastName, address, city, zipCode, phoneNo, role } =
    userDetails;

  //What if some another authenticated user tries to update another users profile?
  //This ensures either user or admin updates the profile
  if (
    loggedUser._id.toString() !== userIdToUpdate &&
    loggedUser.role !== "admin"
  ) {
    throw new CustomError("You are not allowed to update this profile", 403);
  }

  //find the user in DB to update
  let user = await User.findById(userIdToUpdate);
  //check for found user
  if (!user) {
    throw new CustomError("User not found", 404);
  }

  let profilePicUrl = user.profilePic;
  let profilePicPublicId = user.profilePicPublicId;

  //If a new file is uploaded
  if (file) {
    if (profilePicPublicId) {
      await cloudinary.uploader.destroy(profilePicPublicId);
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(file.buffer);
    });

    // console.log(uploadResult, uploadResult.secure_url);

    profilePicUrl = uploadResult.secure_url;
    profilePicPublicId = uploadResult.public_id;
  }

  //update fields
  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.address = address || user.address;
  user.city = city || user.city;
  user.zipCode = zipCode || user.zipCode;
  user.phoneNo = phoneNo || user.phoneNo;
  user.role = role;
  user.profilePic = profilePicUrl;
  user.profilePicPublicId = profilePicPublicId;

  const updatedUser = await user.save();

  return updatedUser;
};
