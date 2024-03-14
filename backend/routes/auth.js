import app from "express";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import upload from "../middleware/upload.js";
import nodemailer from "nodemailer";
const router = app.Router();

let forgotOTP = "",
  signupOTP = "";

router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, userName } = req.body;
    const isexistingEmailID = await User.findOne({ emailId });
    const isexistingUSerName = await User.findOne({ userName });
    if (isexistingEmailID) {
      return res.status(200).json({ message: "EmailID is already in use" });
    }
    if (isexistingUSerName) {
      return res.status(200).json({ message: "Username is already in use" });
    }
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        // This is app password for my account
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    signupOTP = String(Math.floor(10000 + Math.random() * 90000));
    let mailOptions = {
      from: `"WatchMe" ${process.env.GMAIL_ADDRESS}`,
      to: emailId,
      subject: "WATCHME OTP",
      text: `
      Hello ${firstName} + ${lastName},
      This is your OTP ${signupOTP} to signup your account on WATCHME.
      Please do not share with anyone
      If this is not you then just ignore this mail
      `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        if (error.code === "EENVELOPE" && error.responseCode === 553) {
          return res.status(200).json({ message: "Wrong Email Address" });
        } else {
          return res
            .status(200)
            .json({ message: "There's some error in sending mail" });
        }
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "Email sent successfully", otp: signupOTP });
      }
    });
  } catch (error) {
    if (error.keyPattern.emailId) {
      res.status(200).json({ message: "EmailID is already in use", error });
      return;
    }
    if (error.keyPattern.userName) {
      res.status(200).json({ message: "Username is already in use", error });
      return;
    }
    res.status(200).json({ message: "Some error from our side", error });
  }
});

router.post("/signupotp", async (req, res) => {
  try {
    const { firstName, lastName, emailId, userName, userPassword, userOTP } =
      req.body;
    if (signupOTP === userOTP) {
      signupOTP = "";
      const hashPassword = bcryptjs.hashSync(userPassword);
      const user = new User({
        firstName,
        lastName,
        emailId,
        userName,
        password: hashPassword,
      });
      await user.save();
      const { password, ...others } = user._doc;
      return res
        .status(200)
        .json({ message: "Signup Successful", others: others });
    } else {
      return res.status(200).json({ message: "INCORRECT OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "Some error from our side", error });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      return res.status(200).json({ message: "Please signup first" });
    }

    const isPasswordCorrect = bcryptjs.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return res.status(200).json({ message: "Password is not correct" });
    }
    const { password, ...others } = user._doc;
    return res.status(200).json({ others });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ error });
  }
});
router.post("/forgotPassword", async (req, res) => {
  try {
    const { emailId } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      return res.status(200).json({ message: "This emailId doesn't exit" });
    }
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        // This is app password for my account
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
    forgotOTP = String(Math.floor(10000 + Math.random() * 90000));

    let mailOptions = {
      from: `"WatchMe" ${process.env.GMAIL_ADDRESS}`,
      to: emailId,
      subject: "WATCHME OTP",
      text: `
      Hello ${user.firstName} + ${user.lastName},
      This is your OTP ${forgotOTP} to recover your account of WATCHME.
      Please do not share with anyone
      If this is not you then just ignore this mail
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        if (error.code === "EENVELOPE" && error.responseCode === 553) {
          return res.status(200).json({ message: "Wrong Email Address" });
        } else {
          return res
            .status(200)
            .json({ message: "There's some error in sending mail" });
        }
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "Email sent successfully", otp: forgotOTP });
      }
    });
  } catch (error) {}
});

router.post("/forgotOTP", async (req, res) => {
  const { userOTP } = req.body;
  if (forgotOTP === userOTP) {
    forgotOTP = "";
    return res.status(200).json({ message: "CORRECT OTP" });
  } else {
    return res.status(200).json({ message: "INCORRECT OTP" });
  }
});

router.post("/update-image", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(200).json({ message: "Please signup first" });
    }

    // Update the user's image if a new image is provided
    if (req.file) {
      user.image = req.file.path;
    }
    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Image updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/getUser", async (req, res) => {
  try {
    const { userId } = req.body;
    const existingUser = await User.findById(userId);
    return res.status(200).json({ user: existingUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/updateProfile", upload.single("image"), async (req, res) => {
  try {
    const { userId, firstName, lastName, emailId, userName, about } = req.body;
    const existingUser = await User.findById(userId);
    if (firstName) {
      existingUser.firstName = firstName;
    }
    if (lastName) {
      existingUser.lastName = lastName;
    }
    if (emailId) {
      existingUser.emailId = emailId;
    }
    existingUser.about = about;
    if (userName) {
      existingUser.userName = userName;
    }
    if (req.file) {
      existingUser.image = req.file.path;
    }

    await existingUser.save();
    res.status(200).json({ message: "Updated successfully", existingUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/userInfo", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/updatePassword", async (req, res) => {
  const { emailId, newPassword } = req.body;
  const user = await User.findOne({ emailId });
  if (user) {
    const hashPassword = bcryptjs.hashSync(newPassword);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: "Password changed Successfully" });
  }
});
export default router;
