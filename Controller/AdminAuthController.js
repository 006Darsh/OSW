require("dotenv").config({ path: "../.env" });
const Admin = require("../Models/Admin");
const genToken = require("../Services/jwtTokenService");
const bcrypt = require("bcrypt");

exports.AddAdmin = async (req, res) => {
  try {
    const adminId = req.user._id;
    const admin = await Admin.findOne({ _id: adminId });
    if (!admin.superadmin) {
      return res
        .status(401)
        .send({ success: false, message: "Not Authorized." });
    }
    const { email, password } = req.body;
    // Check if admin with the same email already exists
    const exist = await Admin.findOne({ email: email });
    if (exist) {
      return res.status(400).send({
        success: false,
        message: "Admin with this email already exists.",
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    // Save the admin data to the Admin schema
    const newAdmin = new Admin({
      email: email,
      password: password,
    });

    await newAdmin.save();

    res.status(200).send({
      success: true,
      message: "Adim added Successfully",
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
    let isPasswordMatch;
    if (admin.superadmin) {
      isPasswordMatch = await bcrypt.compare(password, admin.password);
    } else {
      isPasswordMatch = password === admin.password ? true : false;
    }

    if (isPasswordMatch) {
      // Passwords match, generate token and send the response
      const payload = {
        _id: admin._id,
        email: admin.email,
        superadmin: admin.superadmin,
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
