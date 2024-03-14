import app from "express";
import nodemailer from "nodemailer";
import User from "../models/user.js";
const router = app.Router();

router.post("/sentMsg", async (req, res) => {
  try {
    const { senderemailId, receipentemailId, msgContent } = req.body;
    const sender = await User.findOne({ emailId: senderemailId });
    const receipent = await User.findOne({ emailId: receipentemailId });
    if (receipent && sender) {
      let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
      let mailOptions = {
        from: `${process.env.GMAIL_ADDRESS}`,
        to: receipentemailId,
        subject: `Hello ${receipent.firstName}, ${sender.firstName} from Watchme wants to connect with you`,
        text: `
            Hello <b>${receipent.firstName}</b>, Hope you are doing well
            <b>${sender.firstName}<b> from Watchme wants to connect with you regarding some talks.

            Their message included the folllowing:

            <b>${msgContent}</b>
            
            If you want to connect with them you can email them on their emailId "${senderemailId}"

            Thank you,
            WatchMe
            `,
        html: `
        <p>Hello ${receipent.firstName}, Hope you are doing well.</p>
        <p><b>${sender.firstName} </b> from Watchme wants to connect with you regarding some talks.</p>

        <p>Their message included the following:</p>

        <p><b>${msgContent}</b></p>
        
        <p>If you want to connect with them, you can email them at their email address: <b>${senderemailId}</b></p>

        <p>Thank you,<br>WatchMe</p>`,
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
          return res.status(200).json({ message: "Email sent successfully" });
        }
      });
    } else {
      res.status(200).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(200).json({ message: "some error occured", error });
  }
});

export default router;
