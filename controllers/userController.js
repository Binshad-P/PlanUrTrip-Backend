import User from "../models/userModel.js";
import Otps from '../models/otpModel.js'
import randomstring from "randomstring";
import sendEmail from "../utils/sendEmails.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Razorpay from "razorpay";
// import {instance} from '../server.js'
// <-------------------SignUp--------------------->
export const signupUser = async (req, res) => {
  const { username, email, phone, place, password } = req.body;
  console.log(req.body,8899);

  console.log(req.body,"444");
  if (!username || !email || !phone || !place || !password) {
    res.status(404).json({ message: "All fields are mandatory" });
    return;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(404).json({ message: "user already exist" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    phone,
    place,
    password: hashedPassword,
  });
  await user.save();
  res.status(200).json({ message: "user added sucessfully" });
};

// <-------------------Login--------------------->
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(404).json({ message: "All fields are mandatory" });
    return;
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    res.status(404).json({ message: "Pls enter correct Email" });
    return;
  } else {
    const verifyPassword = await bcrypt.compare(
      password,
      existingUser?.password
    );
    if (verifyPassword) {
      let resp = {
        id: existingUser._id,
      };
      let token = jwt.sign(resp, "secret", { expiresIn: "1d" });
      res.status(200).send({ auth: true, token });
    } else {
      res.status(404).json({ message: "password don't macth" });
      return;
    }
  }
  res.status(200).json({ message: "User Login Successfully" });
  return;
};

// <-------------------User Details--------------------->
export const userDetails = async (req, res) => {
  const userData = await User.find();
  res.json(userData);
};

// <-------------------User Profile--------------------->
export const userProfile = async (req, res) => {
  try {
    const userId = req.user;
    const userProfile = await User.findById(userId).select("-password");
    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const orders = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZOPAY_API_KEY,
      key_secret: process.env.RAZOPAY_API_SECRET,
    });

    const options = {
      amount: 50000, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const success = async (req, res) => {
  try {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};


function generateOTP() {
  return randomstring.generate({
      length: 4,
      charset: 'numeric'
  });
}

export const sendOTP = async (req, res, next) => {
  try {
      const { email } = req.body;
      const otp = generateOTP(); // Generate a 6-digit OTP
      const newOTP = new Otps({ email, otp });
      await newOTP.save();

      // Send OTP via email
      await sendEmail({
          to: email,
          subject: 'Your OTP',
          message: `<p>Your OTP is: <strong>${otp}</strong></p>`,
      });

      res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

// Verify OTP provided by the user
export const verifyOTP = async (req, res, next) => {
  try {
      const { email, otp } = req.query;
      const existingOTP = await Otps.findOneAndDelete({ email, otp });

      if (existingOTP) {
          // OTP is valid
          res.status(200).json({ success: true, message: 'OTP verification successful' });
      } else {
          // OTP is invalid
          res.status(400).json({ success: false, error: 'Invalid OTP' });
      }
  } catch (error) {
      console.error('Error verifying OTP:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
};