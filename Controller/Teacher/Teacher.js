const teacherModel = require("../../Module/Teacher/Teacher");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10; 
const { sendMail } = require('../../Authentication/SendEmail');

class TEACHER {
  async registerTeacher(req, res) {
    try {
      let {
        FirstName,
        LastName,
        Mobile,
        Email,
        Country,
        State,
        City,
        Password,
        whatsAppNumber,
        CPassword,
        termndcond
      } = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileRegex = /^[789]\d{9}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!(FirstName)) {
        return res.status(400).json({ error: "Please enter first name" });
      }
      if (!(LastName)) {
        return res.status(400).json({ error: "Please enter last name" });
      }
      if (!Mobile || !mobileRegex.test(Mobile)) {
        return res.status(400).json({ error: "Please enter a valid mobile number" });
      }
      if (!whatsAppNumber || !mobileRegex.test(whatsAppNumber)) {
        return res.status(400).json({ error: "Please enter whatsapp number" });
      }
      if (!Email || !emailRegex.test(Email)) {
        return res.status(400).json({ error: "Please enter a valid email address" });
      }
      if (!Password) {
        return res.status(400).json({ error: "Please enter a password" });
      }
      if (!passwordRegex.test(Password)) {
        return res.status(400).json({ error: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long" });
      }
      if (Password !== CPassword) {
        return res.status(400).json({ error: "Password not Match" });
      }

      if (!termndcond) {
        return res.status(400).json({ error: "Accept, I agree the terms and conditions" });
      }
      let checkMobile = await teacherModel.findOne({ Mobile: Mobile });
      if (checkMobile) {
        return res.status(400).json({ error: `${Mobile} already exits` });
      }
      let checkWhats = await teacherModel.findOne({ whatsAppNumber: whatsAppNumber });
      if (checkWhats) {
        return res.status(400).json({ error: `${whatsAppNumber} already exits` });
      }
      let checkEmail = await teacherModel.findOne({ Email: Email });
      if (checkEmail) {
        return res.status(400).json({ error: `${Email} already exits` });
      }
      Password = await bcrypt.hash(Password, 10);
      let data = await teacherModel.create({
        FirstName,
        LastName,
        Mobile,
        Email,
        Country,
        State,
        City,
        Password,
        whatsAppNumber
      });
      if (!data) return res.status(400).json({ error: "Something went wrong" });
      return res.status(200).json({ success: "Successfully Registered" });
    } catch (error) {
      console.log(error);
    }
  }

  async loginTeacher(req, res) {
    try {
      let { Email, Password } = req.body;
      let check = await teacherModel.findOne({ Email: Email });
      if (!check) {
        check = await teacherModel.findOne({ Mobile: Email });
      }
      if (!check)
        return res.status(400).json({ error: `${Email} is not registered` });

      let compare = await bcrypt
        .compare(Password, check.Password)
        .then((res) => {
          return res;
        });

      if (!compare) {
        return res.status(400).send({ error: "Incorrect password" });
      }

      if (check?.isBlock == true)
        return res.status(400).json({ error: "Your account is blocked" });
      sendMail(check.FirstName, check.Email, "You are successfully login to your account");
      let token = jwt.sign(
        {
          userId: check._id.toString(),
        },
        "Guru_Resource",
        { expiresIn: "1d" }
      );

      res.header("Authorization", "Bearer : " + token);

      return res
        .status(200)
        .json({ msg: "Successfully login", success: check, token: token });
    } catch (error) {
      console.log(error);
    }
  }


  async getAllTeachers(req, res) {
    try {
      let data = await teacherModel.find({}).sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllUserById(req, res) {
    try {
      const teacherId = req.params.id;
      let data = await teacherModel.findById(teacherId);
      if (data) {
        return res.status(200).send({ success: data });
      }
      return res.status(400).json({ error: "No data is available!!!" })
    } catch (error) {
      console.log(error);
    }
  }

  async updateTeacher(req, res) {
    try {
      let {
        id,
        FirstName,
        LastName,
        Mobile,
        Email,
        Country,
        State,
        City,
        Password,
        whatsAppNumber
      } = req.body;
      let obj = {};
      if (whatsAppNumber) {
        obj["whatsAppNumber"] = whatsAppNumber
      }
      if (FirstName) {
        obj["FirstName"] = FirstName;
      }
      if (LastName) {
        obj["LastName"] = LastName;
      }
      if (Mobile) {
        let checkMobile = await teacherModel.findOne({ Mobile: Mobile });
        if (checkMobile)
          return res.status(400).json({ error: `${Mobile} already exits` });
        obj["Mobile"] = Mobile;
      }
      if (Email) {
        let checkEmail = await teacherModel.findOne({ Email: Email });
        if (checkEmail)
          return res.status(400).json({ error: `${Email} already exits` });
        obj["Email"] = Email;
      }
      if (Country) {
        obj["Country"] = Country;
      }
      if (State) {
        obj["State"] = State;
      }
      if (City) {
        obj["City"] = City;
      }
      if (Password) {
        obj["Password"] = await bcrypt.hash(Password, 10);
      }
      if (req.files.length != 0) {
        let arr = req.files
        let i
        for (i = 0; i < arr.length; i++) {
          if (arr[i].fieldname == "Profile") {
            obj["Profile"] = await uploadfile2(arr[i],"Profile")
          }
        }
      }
      let data = await teacherModel.findOneAndUpdate({ _id: id }, { $set: obj }, { new: true });
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data, msg: "Successfully Updated" })
    } catch (error) {
      console.log(error);
    }
  }

  async makeBlockAndUnblockTeachers(req, res) {
    try {
      let { id, isBlock } = req.body;
      let data = await teacherModel.findOneAndUpdate({ _id: id }, { $set: { isBlock: isBlock } }, { new: true });
      if (!data) return res.status(400).json({ error: "Something went wrong" });
      return res.status(200).json({ success: `Successfully ${data?.isBlock == true ? "Blocked" : "Un-Blocked"}` });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTeacher(req, res) {
    try {
      let id = req.params.id;
      let data = await teacherModel.deleteOne({ _id: id });
      if (data.deletedCount == 0) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Sucessfully deleted" })
    } catch (error) {
      console.log(error);
    }
  }

  async updatepassword(req, res) {
    try {
      const { Email, Password } = req.body;
      // Check if the email exists in the database
      const existingUser = await teacherModel.findOne({ Email: Email });
      if (!existingUser) {
        return res.status(400).json({ error: "Email not found" });
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(Password, 10);
      // Update the password in the database
      const updatedUser = await teacherModel.findOneAndUpdate(
        { Email: Email },
        { $set: { Password: hashedPassword } },
        { new: true }
      );
      if (updatedUser) {
        return res.status(200).json({ success: "Password updated successfully" });
      } else {
        return res.status(500).json({ error: "Failed to update password" });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new TEACHER(); 
