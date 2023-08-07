require("dotenv").config({ path: "../.env" });
const Admin = require("../Models/Admin");
const genToken = require("../Services/jwtTokenService");
const bcrypt = require("bcrypt");

exports.AdminSignup = async (req, res) => {
  try {
    const { email, password, confirm_password } = req.body;
    // Check if admin with the same email already exists
    const exist = await Admin.findOne({ email: email });
    if (exist) {
      return res.status(400).send({
        success: false,
        message: "Admin with this email already exists.",
      });
    }
    // Check if password and confirm_password match
    if (password !== confirm_password) {
      return res.status(400).send({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }
    // Encrypt the password using bcrypt
    // const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save the admin data to the Admin schema
    const newAdmin = new Admin({
      email: email,
      password: hashedPassword,
    });

    await newAdmin.save();

    const payload = {
      _id: newAdmin._id,
      email: newAdmin.email,
      password: newAdmin.password,
      type: "admin",
    };

    const authToken = genToken(payload);

    res.status(200).send({
      success: true,
      result: authToken,
      _id: newAdmin._id,
      email: newAdmin.email,
      type: "admin",
    });
  } catch (error) {
    console.error("Error in AdminSignup:", error);
    return res.status(500).send({
      success: false,
      message: "An error occurred while registering the admin.",
    });
  }
};

exports.AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Email address is not registered",
      });
    }
    // Compare the password from the request with the encrypted password stored in the database
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (isPasswordMatch) {
      // Passwords match, generate token and send the response
      const payload = {
        _id: admin._id,
        email: admin.email,
        type: "admin",
      };

      const authToken = genToken(payload);

      return res.status(200).send({
        success: true,
        result: authToken,
        _id: admin._id,
        email: admin.email,
        type: "admin",
      });
    } else {
      // Passwords do not match
      return res.status(401).send({
        success: false,
        message: "Not able to Login - Invalid credentials",
      });
    }
  } catch (error) {}
};
