// const uploadQuestionModel = require("../../Module/Admin/UploadQuestionPdf");  

// //questionPdf answerPdf
// class UPLOADQESTION {
//   // async addUploadQuestions(req, res) {
//   //   try {
//   //     let { year, Class, SubClass, subject, medium, Title, questionPdf,answerPdf } = req.body;
//   //         let check = await uploadQuestionModel.findOne({
//   //       year,
//   //       Class,
//   //       SubClass,
//   //       subject,
//   //       medium,
//   //       Title,
//   //       questionPdf,
//   //       answerPdf,
//   //     });
//   //     if (check) return res.status(400).json({ error: "Already exits " });
//   //     let obj = {
//   //       year,
//   //       Class,
//   //       SubClass,
//   //       subject,
//   //       medium,
//   //       Title,
//   //       questionPdf,
//   //       answerPdf,
//   //     };

//   //     if (req.files.length != 0) {
//   //       let arr = req.files;
//   //       let i;
//   //       for (i = 0; i < arr.length; i++) {
//   //         if (arr[i].fieldname == "questionPdf") {
//   //           obj["questionPdf"] = await uploadFile2(arr[i],"QuestionPdf");
//   //         }

//   //         if (arr[i].fieldname == "answerPdf") {
//   //           obj["answerPdf"] =await uploadFile2(arr[i],"QuestionPdf");
//   //         }
//   //       }
//   //     }
//   //     let data = await uploadQuestionModel.create(obj);
//   //     if (!data) return res.status(400).json({ error: "Something went wrong" });
//   //     return res.status(200).json({ succes: "Successfully added" });
//   //   } catch (error) {
//   //     return res.status(400).json({ error: "Api Error" });
//   //   }
//   // }
// async addUploadQuestions(req, res) {
//   try {
//     let { year, Class, SubClass, subject, medium, Title } = req.body;

//     // ✅ Use only relevant fields for checking duplicates (ignore file names)
//     let check = await uploadQuestionModel.findOne({
//       year,
//       Class,
//       SubClass,
//       subject,
//       medium,
//       Title,
//     });
//     if (check) return res.status(400).json({ error: "Already exists" });

//     let obj = {
//       year,
//       Class,
//       SubClass,
//       subject,
//       medium,
//       Title,
//       questionPdf: "",
//       answerPdf: "",
//     };

//     if (req.files && req.files.length > 0) {
//       req.files.forEach((file) => {
//         if (file.fieldname === "questionPdf") {
//           obj.questionPdf = file.filename;
//         }
//         if (file.fieldname === "answerPdf") {
//           obj.answerPdf = file.filename;
//         }
//       });
//     }

//     let data = await uploadQuestionModel.create(obj);
//     if (!data) return res.status(400).json({ error: "Something went wrong" });

//     return res.status(200).json({ success: "Successfully added" });
//   } catch (error) {
//     console.error("Error in addUploadQuestions:", error);
//     return res.status(400).json({ error: "API Error" });
//   }
// }

//   async updateUploadQuestions(req, res) {
//     try {
//       let {
//         id,
//         year,
//         Class,
//         SubClass,
//         subject,
//         medium,
//         Title,
//         Examinationname,
//       } = req.body;
//       let obj = {};
//       if (Title) {
//         obj["Title"] = Title;
//       }
//       if (Examinationname) {
//         obj["Examinationname"] = Examinationname;
//       }
//       if (year) {
//         obj["year"] = year;
//       }
//       if (Class) {
//         obj["Class"] = Class;
//       }
//       if (subject) {
//         obj["subject"] = subject;
//       }
//       if (SubClass) {
//         obj["SubClass"] = SubClass;
//       }
//       if (medium) {
//         obj["medium"] = medium;
//       }

//       if (req.files.length != 0) {
//         let arr = req.files;
//         let i;
//         for (i = 0; i < arr.length; i++) {
//           if (arr[i].fieldname == "questionPdf") {
//             obj["questionPdf"] = await uploadFile2(arr[i],"QuestionPdf");
//           }

//           if (arr[i].fieldname == "answerPdf") {
//             obj["answerPdf"] = await uploadFile2(arr[i],"QuestionPdf");
//           }
//         }
//       }
//       let data = await uploadQuestionModel.findOneAndUpdate(
//         { _id: id },
//         { $set: obj }
//       );
//       if (!data) return res.status(400).json({ error: "Data not found" });
//       return res.status(200).json({ success: "Successfully updated" });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getAllUploadQuestions(req, res) {
//     try {
//       let data = await uploadQuestionModel.find().sort({ _id: -1 });
//       return res.status(200).json({ success: data });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async getUploadPdfQuestionbyid(req, res) {
//     try {
//       let id = req.params.id;
//       let data = await uploadQuestionModel.findById({ _id: id });
//       if (data) return res.status(200).json({ succes: data });
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   async deletedUploadQuestionPdf(req, res) {
//     try {
//       let id = req.params.id;
//       let data = await uploadQuestionModel.deleteOne({ _id: id });
//       if (data.deletedCount == 0)
//         return res.status(400).json({ error: "Data not found" });
//       console.log("data", data);
//       return res.status(200).json({ success: "Successfully deleted" });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
// module.exports = new UPLOADQESTION();
 
const uploadQuestionModel = require("../../Module/Admin/UploadQuestionPdf");
const fs = require('fs');
const path = require('path');

// Ensure upload directory exists
const ensureUploadDir = () => {
  const uploadDir = path.join(__dirname, '../../Public/QuestionPdf');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Created upload directory:', uploadDir);
  }
};

class UPLOADQESTION {
  async addUploadQuestions(req, res) {
    try {
      // Ensure upload directory exists
      ensureUploadDir();

      let { year, Class, SubClass, subject, medium, Title, authId } = req.body;

      // Validate required fields
      if (!Title || !year) {
        return res.status(400).json({ error: "Title and Year are required" });
      }

      // Check for duplicates using only relevant fields (ignore file names)
      let check = await uploadQuestionModel.findOne({
        year,
        Class,
        SubClass,
        subject,
        medium,
        Title,
        authId
      });
      
      if (check) {
        return res.status(400).json({ error: "Already exists" });
      }

      let obj = {
        year,
        Class,
        SubClass,
        subject,
        medium,
        Title,
        authId,
        questionPdf: "",
        answerPdf: "",
      };

      // Process uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          if (file.fieldname === "questionPdf") {
            obj.questionPdf = file.filename;
          }
          if (file.fieldname === "answerPdf") {
            obj.answerPdf = file.filename;
          }
        });
      }

      let data = await uploadQuestionModel.create(obj);
      if (!data) {
        return res.status(400).json({ error: "Something went wrong while saving data" });
      }

      return res.status(200).json({ success: "Successfully added" });
    } catch (error) {
      console.error("Error in addUploadQuestions:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async updateUploadQuestions(req, res) {
    try {
      ensureUploadDir();

      let {
        id,
        year,
        Class,
        SubClass,
        subject,
        medium,
        Title,
        authId
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "ID is required for update" });
      }

      let obj = {};
      if (Title) obj["Title"] = Title;
      if (year) obj["year"] = year;
      if (Class) obj["Class"] = Class;
      if (subject) obj["subject"] = subject;
      if (SubClass) obj["SubClass"] = SubClass;
      if (medium) obj["medium"] = medium;
      if (authId) obj["authId"] = authId;

      // Process uploaded files
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          if (file.fieldname === "questionPdf") {
            obj["questionPdf"] = file.filename;
          }
          if (file.fieldname === "answerPdf") {
            obj["answerPdf"] = file.filename;
          }
        });
      }

      let data = await uploadQuestionModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );

      if (!data) {
        return res.status(404).json({ error: "Data not found" });
      }

      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.error("Error in updateUploadQuestions:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getAllUploadQuestions(req, res) {
    try {
      const { authId } = req.params;
      
      let query = {};
      if (authId && authId !== 'undefined') {
        query.authId = authId;
      }

      let data = await uploadQuestionModel.find(query).sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.error("Error in getAllUploadQuestions:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getUploadPdfQuestionbyid(req, res) {
    try {
      let id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      let data = await uploadQuestionModel.findById({ _id: id });
      if (!data) {
        return res.status(404).json({ error: "Data not found" });
      }

      return res.status(200).json({ success: data });
    } catch (error) {
      console.error("Error in getUploadPdfQuestionbyid:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async deletedUploadQuestionPdf(req, res) {
    try {
      let { id, authId } = req.params;
      
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }

      // Find the document first to get file names for cleanup
      let document = await uploadQuestionModel.findById(id);
      if (!document) {
        return res.status(404).json({ error: "Data not found" });
      }

      // Delete the database record
      let data = await uploadQuestionModel.deleteOne({ _id: id });
      if (data.deletedCount === 0) {
        return res.status(400).json({ error: "Failed to delete data" });
      }

      // Clean up files (optional - only if you want to delete physical files)
      const uploadDir = path.join(__dirname, '../../Public/QuestionPdf');
      try {
        if (document.questionPdf && fs.existsSync(path.join(uploadDir, document.questionPdf))) {
          fs.unlinkSync(path.join(uploadDir, document.questionPdf));
        }
        if (document.answerPdf && fs.existsSync(path.join(uploadDir, document.answerPdf))) {
          fs.unlinkSync(path.join(uploadDir, document.answerPdf));
        }
      } catch (fileError) {
        console.warn("Could not delete files:", fileError.message);
        // Don't fail the operation if file deletion fails
      }

      return res.status(200).json({ success: "Successfully deleted" });
    } catch (error) {
      console.error("Error in deletedUploadQuestionPdf:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new UPLOADQESTION();