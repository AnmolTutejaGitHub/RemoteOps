const express = require('express');
const router = express.Router();
const Auth = require("../middleware/Auth");
const User = require('../database/Models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const config = require("../config/config");
const bcrypt = require("bcrypt");


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }
        
        if (!user.isVerified) {
            return res.status(401).json({ redirect: `${config.FRONTEND_URL}/verify` });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).send({ error: "Invalid Credentials" });
        }

        const token = jwt.sign({ user_id: user._id },config.JWT_TOKEN_SECRET, { expiresIn: '30d' });
        res.status(200).send({
            token: token,
            username: user.name,
            user_id : user._id
        });
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
})

router.post('/signup', async (req, res) => {
    const { email, password,confirm_password, name } = req.body;
    try {
        if(password != confirm_password){
            return res.status(400).send({error : "Password Doesn't Match"});
        }
        const exist = await User.findOne({
            email : email
        })
        
        if(exist && !exist.isVerified) {
            const delc = await User.deleteOne({email : email});
            console.log(delc)
        }
        const user = new User({ email, password, name });
        await user.save();
        const token = jwt.sign({ user_id: user._id }, config.JWT_TOKEN_SECRET, { expiresIn: '30d' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
})

router.post("/generate-Verification-Token", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).send({ message: "Email is required" });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).send({ message: "No account found with this email" });
      }

      if (user.isVerified) {
        return res.status(400).send({ message: "This account is already verified" });
      }

      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        config.JWT_TOKEN_SIGNUP_MAIL_SECRET,
        { expiresIn: "5m" }
      );
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: "anmoltutejaserver@gmail.com",
          pass: config.NODEMAIL_APP_PASSWORD,
        },
      });
  
      const mailOptions = {
        from: '"RemoteOps" <anmoltutejaserver@gmail.com>',
        to: user.email,
        subject: 'Email Verification Link',
        html: `
        <h3>Email Verification</h3>
        <p>Click the button below to verify your email:</p>
        <a 
            href="${config.FRONTEND_URL}/verify-email/${token}" 
            style="display: inline-block; margin: 10px 0; padding: 10px 20px; background-color: #000814; color: #ffffff; text-decoration: none; border-radius: 5px;"
        >
        Verify Email
        </a>
        <p>If the button doesn't work, copy and paste this URL into your browser:</p>
        <p>${config.FRONTEND_URL}/verify-email/${token}</p>
        <p><b>Note:</b> This link is valid for only 5 minutes.</p>
        `,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending mail:", error);
          return res.status(400).send({ message: "Error sending email", error });
        }
        res.status(200).send({ message: "Verification email sent. Check your inbox." });
      });
  
    } catch (err) {
      console.error("Server error:", err.message);
      res.status(400).send({ message: err.message });
    }
  });


router.get("/verify/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, config.JWT_TOKEN_SIGNUP_MAIL_SECRET);
        if (!decoded) res.status(400).send({ message: "Invalid Token" });
        const user = await User.findById(decoded.user_id);
        if (!user) return res.status(400).send({ message: "Invalid Token" });
        if(user.isVerified) return res.status(200).send({ message: "User is already verified" })
        user.isVerified = true;
        await user.save();
        res.status(200).send({ message: "User has been verified" });
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/resetPasswordToken', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).send({ error: 'Email is not registered with us' });
        const token = jwt.sign({ user_id: user._id, email: user.email }, config.JWT_RESET_PASSWORD_SECRET, { expiresIn: "5m" });
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: "anmoltutejaserver@gmail.com",
                pass: config.NODEMAIL_APP_PASSWORD,
            },
        });

        let mailOptions = {
            from: '"RemoteOps" <anmoltutejaserver@gmail.com>',
            to: email,
            subject: 'Password Reset Link',
            text: `You requested to reset your password. Click the link below to proceed. This link is valid for 5 minutes:\n\n${config.FRONTEND_URL}/update-password/${token}`,
            html: `
              <p>You requested to reset your password.</p>
              <p>This link is valid for <strong>5 minutes</strong>:</p>
              <a href="${config.FRONTEND_URL}/update-password/${token}">Reset Password</a>
            `,
          };
          

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(400).send(error);
            }
            res.status(200).send({ message: "Open Mail" });
        });

    } catch (e) {
        res.status(400).send(e);
    }
})

router.post("/resetPassword/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirm_password } = req.body;

       if (confirm_password !== password) {
            return res.status(400).send("Passwords don't match");
        }

        
        const decoded = jwt.verify(token,config.JWT_RESET_PASSWORD_SECRET);
        if (!decoded || !decoded.user_id) {
            return res.status(400).send({ message: "Invalid or expired token" });
        }

    
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }

        
        user.password = password;
        await user.save();

        return res.status(200).send("success");
    } catch (err) {
        console.error(err);
        return res.status(400).send(err);
    }
})

router.post('/verifytokenAndGetUserDetails', async (req, res) => {
    const { token } = req.body;

    try {
        const decoded = jwt.verify(token, config.JWT_TOKEN_SECRET);
        const user = await User.findById(decoded.user_id);

        if (!user) {
            return res.status(404).send({ error: 'Invalid or expired token' });
        }

        if(!user.isVerified) return res.status(400).send({error : "Your Email is not verfied !"})

        res.status(200).send({ username : user.name , userid : user._id, email: user.email });
    } catch (e) {
        res.status(400).send({ error: 'Invalid or expired token' });
    }
})

module.exports = router;