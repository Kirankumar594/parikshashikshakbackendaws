// const { toTitleCase } = require("../../Config/function");
// const weightageofthecontentmodel = require("../../Module/Admin/Weighttageofthecontent");

// class weightageofthecontent {
//   async addweightage(req, res) {
//     try {
//       let { mediumName,Subject, Content } = req.body;
//       if (!mediumName) {
//         return res.status(400).json({ error: "Please Enter Content" });
//       }
//       if (!Subject) {
//         return res.status(400).json({ error: "Please Select Subject" });
//       }
//       if (!Content) {
//         return res.status(400).json({ error: "Please Enter Content" });
//       }
//       mediumName = toTitleCase(mediumName);
//       Subject = toTitleCase(Subject);
//       Content = toTitleCase(Content);
//       let data = await weightageofthecontentmodel.findOne({
//         Subject: Subject,
//         Content: Content,
//       });
//       if (data)
//         return res.status(400).json({ error: `${Content} already exists` });
//       await weightageofthecontentmodel.create({ mediumName,Subject, Content });
//       return res.status(200).json({ success: "Successfully Added" });
//     } catch (error) {
//       console.log(error);
//       return res.status(400).json({ error: "Something Went Wrong" });
//     }
//   }
//   async getallcontent(req, res) {
//     try {
//       let data = await weightageofthecontentmodel.find({}).sort({ _id: -1 });
//       return res.status(200).json({ success: data });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({ error: "Somethig Went Wrong" });
//     }
//   }
//   async updateallcontent(req, res) {
//     try {
//       let { id, mediumName,Subject, Content } = req.body;
//       let obj = {};
//       if (mediumName) {
//         mediumName = toTitleCase(mediumName);
//         obj["mediumName"] = mediumName;
//       }
//       if (Subject) {
//         Subject = toTitleCase(Subject);
//         obj["Subject"] = Subject;
//       }
//       if (Content) {
//         Content = toTitleCase(Content);
//         obj["Content"] = Content;
//       }
//       let data = await weightageofthecontentmodel.findOneAndUpdate(
//         { _id: id },
//         { $set: obj },
//         { new: true }
//       );
//       if (!data) return res.status(400).json({ error: "Data not found" });
//       return res.status(200).json({ success: "Succesfully Updated !!!" });
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   async deleteweightage(req, res) {
//     try {
//       let id = req.params.id;
//       let data = await weightageofthecontentmodel.deleteOne({ _id: id });
//       if (data.deletedCount == 0)
//         return res.status(400).json({ error: "Data Not Found" });
//       return res.status(200).json({ success: "Sucessfully Deleted" });
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }
// module.exports = new weightageofthecontent();
 
 
 
const { toTitleCase } = require("../../Config/function");
const weightageofthecontentmodel = require("../../Module/Admin/Weighttageofthecontent");

class weightageofthecontent {
  async addweightage(req, res) {
    try {
      let { mediumName, Subject, Content } = req.body;
      if (!mediumName) {
        return res.status(400).json({ error: "Please Enter Content" });
      }
      if (!Subject) {
        return res.status(400).json({ error: "Please Select Subject" });
      }
      if (!Content) {
        return res.status(400).json({ error: "Please Enter Content" });
      }
      mediumName = toTitleCase(mediumName);
      Subject = toTitleCase(Subject);
      Content = toTitleCase(Content);
      let data = await weightageofthecontentmodel.findOne({
        Subject: Subject,
        Content: Content,
      });
      if (data)
        return res.status(400).json({ error: `${Content} already exists` });
      await weightageofthecontentmodel.create({ mediumName, Subject, Content });
      return res.status(200).json({ success: "Successfully Added" });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ error: "Something Went Wrong" });
    }
  }

  async getallcontent(req, res) {
    try {
      // Extract query parameters with defaults
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const search = req.query.search || '';
      const startDate = req.query.startDate;
      const endDate = req.query.endDate;

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Build search query
      let searchQuery = {};

      // Text search across multiple fields
      if (search) {
        searchQuery.$or = [
          { mediumName: { $regex: search, $options: 'i' } },
          { Subject: { $regex: search, $options: 'i' } },
          { Content: { $regex: search, $options: 'i' } }
        ];
      }

      // Date range filter
      if (startDate && endDate) {
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        // Set end date to end of day
        endDateObj.setHours(23, 59, 59, 999);
        
        searchQuery.createdAt = {
          $gte: startDateObj,
          $lte: endDateObj
        };
      }

      // Execute queries in parallel for better performance
      const [data, totalCount] = await Promise.all([
        weightageofthecontentmodel
          .find(searchQuery)
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean(), // Use lean() for better performance when we don't need mongoose document methods
        weightageofthecontentmodel.countDocuments(searchQuery)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      // Return paginated response
      return res.status(200).json({
        success: data,
        pagination: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: hasNextPage,
          hasPrevPage: hasPrevPage,
          startIndex: skip + 1,
          endIndex: Math.min(skip + limit, totalCount)
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something Went Wrong" });
    }
  }

  async updateallcontent(req, res) {
    try {
      let { id, mediumName, Subject, Content } = req.body;
      let obj = {};
      if (mediumName) {
        mediumName = toTitleCase(mediumName);
        obj["mediumName"] = mediumName;
      }
      if (Subject) {
        Subject = toTitleCase(Subject);
        obj["Subject"] = Subject;
      }
      if (Content) {
        Content = toTitleCase(Content);
        obj["Content"] = Content;
      }
      let data = await weightageofthecontentmodel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully Updated !!!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something Went Wrong" });
    }
  }

  async deleteweightage(req, res) {
    try {
      let id = req.params.id;
      let data = await weightageofthecontentmodel.deleteOne({ _id: id });
      if (data.deletedCount == 0)
        return res.status(400).json({ error: "Data Not Found" });
      return res.status(200).json({ success: "Successfully Deleted" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something Went Wrong" });
    }
  }
}

module.exports = new weightageofthecontent();