const QuestionGenModel = require("../../Module/Teacher/GenrateQA");
const blobUtil = require('blob-util');
var FileReader = require('filereader');
const TeacherSchema = require('../../Module/Teacher/Teacher')
const { removeImages } = require("../../RemoveFiles");
const {uploadFile2}=require('../../Authentication/Aws')

const nodemailer = require("nodemailer");

const sendMail = async (name, email, msg, id) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "parikshashikshak@gmail.com",
        pass: "fottdrjdudjpvbbv", // Use environment variables in production
      },
      port: 465,
      host: "smtp.gmail.com",
    });

    const downloadLink = `https://parikshashikshak.com/admincoverpage?id=${id}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello ${name},</h2>
        <p>Your question paper has been <strong>successfully generated</strong>.</p>
        <p>${msg}</p>
        <p>
          👉 <a href="${downloadLink}" style="color: #1E90FF; text-decoration: none;" target="_blank">
            Click here to download your paper
          </a>
        </p>
        <br/>
        <p>Thank you,<br/>Team Parikshashikshak</p>
      </div>
    `;

    const mailOptions = {
      from: "Parikshashikshak 📚 <parikshashikshak@gmail.com>",
      to: email,
      subject: "✅ Question Paper Generated - Download Now",
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error sending mail:", error.message);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

  } catch (err) {
    console.log("Send mail error:", err.message);
  }
};



class QGA {
  async registerGuestionGenrate(req, res) {
    try {
      let {
        teacheName,
        teacherId,
        Board,
        Medium,
        Class,
        Sub_Class,
        Exam_Name, Exam_Lavel,
        Tell_Us,
        Pay_Amount,
        Pay_Id,
        Institute_Name,
        Subject,
        Paper_Name,
        Test_Date,
        Size_ofthe_Question, userType, ExamTime, SchoolAddress

      } = req.body;
      let QuestionPdf = "";
      let BlueprintPdf = "";
      let School_Logo = "";
      let AnswerKeyPdf = "";

      let data = await QuestionGenModel.create({
        School_Logo,
        BlueprintPdf,
        QuestionPdf,
        teacheName,
        teacherId,
        Board,
        Medium,
        Class,
        Sub_Class,
        Exam_Name, Exam_Lavel,
        Tell_Us,
        Pay_Amount,
        Pay_Id,
        Institute_Name,
        Subject,
        Paper_Name,
        Test_Date,
        Size_ofthe_Question, userType, ExamTime, SchoolAddress
      });
      if (!data) return res.status(400).json({ error: "Something went wrong" });

      return res.status(200).json({ msg: "Successfully Added", success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async upadeteQuestionPaper(req, res) {
    try {
      let {
        id,
        teacheName,
        teacherId,
        Board,
        Medium,
        Class,
        Sub_Class,
        Exam_Name,
        Exam_Lavel,
        Tell_Us,
        Pay_Amount,
        Pay_Id,
        Institute_Name,
        Subject,
        Paper_Name,
        Test_Date,
        Size_ofthe_Question,
        status,
        Individual,
        numberOfPaper,
        bluePrintId,
        userType, ExamTime, SchoolAddress, Questions
      } = req.body;


      let obj = {};
      if (Questions) {
        obj["Questions"] = Questions
      }
      if (ExamTime) {
        obj["ExamTime"] = ExamTime
      }
      if (userType) {
        obj["userType"] = userType;
      }
      if (bluePrintId) {
        obj["bluePrintId"] = bluePrintId;
      }
      if (Individual) {
        obj["Individual"] = Individual
      }
      if (numberOfPaper) {
        obj["numberOfPaper"] = numberOfPaper
      }
      if (status) {
        obj["status"] = status
      }
      if (teacheName) {
        obj["teacheName"] = teacheName;
      }
      if (teacherId) {
        obj["teacherId"] = teacherId;
      }
      if (Board) {
        obj["Board"] = Board;
      }
      if (Medium) {
        obj["Medium"] = Medium;
      }
      if (Class) {
        obj["Class"] = Class;
      }
      if (Sub_Class) {
        obj["Sub_Class"] = Sub_Class;
      }
      if (Exam_Name) {
        obj["Exam_Name"] = Exam_Name;
      }
      if (Exam_Lavel) {
        obj["Exam_Lavel"] = Exam_Lavel;
      }
      if (Tell_Us) {
        obj["Tell_Us"] = Tell_Us;
      }
      if (Pay_Amount) {
        obj["Pay_Amount"] = Pay_Amount;
      }
      if (Pay_Id) {
        obj["Pay_Id"] = Pay_Id;
      }
      if (Institute_Name) {
        obj["Institute_Name"] = Institute_Name;
      }
      if (Subject) {
        obj["Subject"] = Subject;
      }
      if (Paper_Name) {
        obj["Paper_Name"] = Paper_Name;
      }
      if (Test_Date) {
        obj["Test_Date"] = Test_Date;
      }
      if (Size_ofthe_Question) {
        obj["Size_ofthe_Question"] = Size_ofthe_Question;
      }
      if (SchoolAddress) {
        obj["SchoolAddress"] = SchoolAddress
      }
      let arr = req.files;
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].fieldname == "QuestionPdf") {
          obj["QuestionPdf"] = await uploadFile2(arr[i], "questionpdf");
        }
        if (arr[i].fieldname == "BlueprintPdf") {
          obj["BlueprintPdf"] = await uploadFile2(arr[i], "profile");
        }
        if (arr[i].fieldname == "School_Logo") {
          obj["School_Logo"] = await uploadFile2(arr[i], "profile");
        }
        if (arr[i].fieldname == "AnswerKeyPdf") {
          obj["AnswerKeyPdf"] = await uploadFile2(arr[i], "profile");
        }
        if (arr[i].fieldname == "SyllbusPdf") {
          obj["SyllbusPdf"] = await uploadFile2(arr[i], "profile");
        }
      }

      let data = await QuestionGenModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });

      if (data.teacherId && data.status == "Completed" && !data.isEmail) {
        const teach = await TeacherSchema.findById(data.teacherId)

        sendMail(teach.FirstName, teach?.Email, `Please keep this link secure. It contains your exam content.`, data?._id?.toString())
        data.isEmail = true;
        await data.save()
      }
      return res
        .status(200)
        .json({ msg: "Successfully Updated", success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllGenQuestionPaper(req, res) {
    try {
      let data = await QuestionGenModel.find()
        .sort({ _id: -1 })
        .populate("teacherId");
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async getAllGenQuestionPaperById(req, res) {
    try {
      let id = req.params.id;
      let data = await QuestionGenModel.findById(id).populate("teacherId");
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }


  async getAllGenQuestionByUserId(req, res) {
    try {
      let id = req.params.id;
      let data = await QuestionGenModel.find({ teacherId: id }).sort({ _id: -1 });
      return res.status(200).json({ success: data })
    } catch (error) {
      console.log(error);
    }
  }

  async getGenQuestionById(req, res) {
    try {
      let id = req.params.id;
      let data = await QuestionGenModel.findById(id).populate("bluePrintId")
      return res.status(200).json({ success: data })
    } catch (error) {
      console.log(error);
    }
  }

  async deleteGenQuestionPaper(req, res) {
    try {
      let id = req.params.id;
      let check = await QuestionGenModel.findById(id);

      if (!check) return res.status(400).json({ error: "Data not found" });

      if (check.QuestionPdf) {
        removeImages('Public/Teacher/' + check.QuestionPdf)
      }
      if (check.BlueprintPdf) {
        removeImages('Public/Teacher/' + check.BlueprintPdf)
      }
      if (check.School_Logo) {
        removeImages('Public/Teacher/' + check.School_Logo)
      }
      if (check.AnswerKeyPdf) {
        removeImages('Public/Teacher/' + check.AnswerKeyPdf)
      }
      if (check.SyllbusPdf) {
        removeImages('Public/Teacher/' + check.SyllbusPdf)
      }

      let data = await QuestionGenModel.deleteOne({ _id: id });

      return res.status(200).json({ error: "Successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }

  async pdfsendtomail(req, res) {
    try {

    } catch (error) {

    }
  }
}
module.exports = new QGA();
