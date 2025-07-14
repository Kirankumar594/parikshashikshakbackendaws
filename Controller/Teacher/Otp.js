const { sendMail } = require('../../EmailSender/send');
const otpModel = require('../../Module/Teacher/Otp');
const teacherModel = require("../../Module/Teacher/Teacher");

class OTP {
    async sendOtpRegisterEmail(req, res) {
        try {
            let { name, email } = req.body;
            let data = await teacherModel.findOne({ Email: email });
            if (!data) {
                return res.status(400).json({ error: `${email} is not register` });
            }
            let otp = ((Math.floor(Math.random() * 1000000)) + 1000000).toString().substring(1);

            let check = await otpModel.findOne({ email: email });
            if (check) {
                check.otp = otp;
                check = await check.save();
            } else {
                check = await otpModel.create({ email: email, otp: otp });
            }
            sendMail(email, "Email Verification", `<h1>${name}</h1><p>This is ${check.otp} otp for register please do not share your otp <h3>Thank you <br/>Team GRM</h3></p>`)
            return res.status(200).json({ success: "Successfully send otp", otp: check.otp })
        } catch (error) {
            console.log(error);
        }
    }

    async verifyEmail(req, res) {
        try {
            let { email, otp } = req.body;
            let data = await otpModel.findOne({ email: email, otp: otp });
            if (!data) return res.status(400).json({ error: "Incurrect otp" });
            return res.status(200).json({ success: "Successfully verify" })
        } catch (error) {
            console.log(error);
        }
    }

    async sendOtpForLogin(req, res) {
        try {
            let { name, email } = req.body;
            let data = await teacherModel.findOne({ Email: email });
            if (!data) return res.status(400).json({ error: `${email} not registered` });
            let otp = ((Math.floor(Math.random() * 1000000)) + 1000000).toString().substring(1);
            let check = await otpModel.findOne({ email: email });
            if (check) {
                check.otp = otp;
                check = await check.save();
            } else {
                check = await otpModel.create({ email: email, otp: otp });
            }
            sendMail(email, "Email Verification", `<h1>${name}</h1><p>This is ${check.otp} otp for login please do not share your otp <h3>Thank you <br/>Team GRM</h3></p>`)
            return res.status(200).json({ success: "Successfully send otp", otp: check.otp })
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new OTP();
