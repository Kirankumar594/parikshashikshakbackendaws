const ChapterModel = require("../../Module/Admin/Chapter");
const { toTitleCase } = require("../../Config/function");

class CHAPTER {
  async addChapter(req, res) {
    try {
      let { mediumName,chapterName, subjectName, SubjectPart, Classname,Sub_classname } = req.body;
      //   if (!chapterName)
      //     return res.status(400).json({ error: "Please enter Chapter name" });
      //     if (!subjectName)
      //     return res.status(400).json({ error: "Please select subject name" });
      chapterName = toTitleCase(chapterName);
      let data = await ChapterModel.findOne({
        mediumName: mediumName,
        chapterName: chapterName,
        subjectName: subjectName,
        SubjectPart: SubjectPart,
        Classname: Classname,
        Sub_classname: Sub_classname,
      });
      console.log("object", data);
      if (data)
        return res.status(400).json({ error: `${chapterName} already exits` });
      await ChapterModel.create({
        mediumName,
        chapterName,
        subjectName,
        SubjectPart,
        Sub_classname,
        Classname,
      });
      return res.status(200).json({ success: "Successfully added" });
    } catch (error) {
      console.log(error);
    }
  }

  async updateChapter(req, res) {
    try {
      let { id, mediumName,chapterName, subjectName, SubjectPart,Sub_classname,Classname } = req.body;
      let obj = {};
      if (chapterName) {
        chapterName = toTitleCase(chapterName);
        let data = await ChapterModel.findOne({
          mediumName:mediumName,
          chapterName: chapterName,
          subjectName: subjectName,
          SubjectPart: SubjectPart,
          Sub_classname:Sub_classname,
          Classname:Classname
        });
        if (data)
          return res
            .status(400)
            .json({ error: `${chapterName} already exists` });
        obj["chapterName"] = chapterName;
      }
      if (mediumName) {
        obj["mediumName"] = mediumName;
      }
      if (subjectName) {
        obj["subjectName"] = subjectName;
      }
      if (SubjectPart) {
        obj["SubjectPart"] = SubjectPart;
      }
      if(Classname){
        obj["Classname"]= Classname;
      }
      if(Sub_classname){
        obj["Sub_classname"]=Sub_classname
      }
      let data = await ChapterModel.findOneAndUpdate(
        { _id: id },
        { $set: obj },
        { new: true }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.log(error);
    }
  }
  // async getAllChapter(req, res) {
  //   try {
  //     let { chapterName, subjectName } = req.body;
  //     if (!chapterName)
  //       return res.status(400).json({ error: "Please enter chapter name" });
  //     if (!subjectName)
  //       return res.status(400).json({ error: "Please select subject name" });
  //     chapterName = toTitleCase(chapterName);
  //     let data = await ChapterModel.findOne({
  //       chapterName: chapterName,
  //       subjectName: subjectName,
  //       SubjectPart: SubjectPart,
  //     });
  //     if (data)
  //       return res.status(400).json({ error: `${chapterName} already exits` });
  //     await ChapterModel.create({ chapterName });
  //     return res.status(200).json({ success: "Successfully added" });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // } 
    
  async getAllChapter(req, res) {
    try {
      const { subjectName, subclassName } = req.query; // Get filters from query params

      let query = {};

      if (subjectName) {
        query.subjectName = subjectName;
      }

      if (subclassName) {
        query.subclassName = subclassName;
      }

      const chapters = await ChapterModel.find(query);
      return res.status(200).json({ success: chapters });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  async updateChapter(req, res) {
    try {
      let { id, mediumName,Classname,Sub_classname,chapterName, subjectName } = req.body;
      let obj = {};
      if (mediumName) {
        obj["mediumName"] = mediumName;
      }
      if (Classname) {
        obj["Classname"] = Classname;
      }
      if (Sub_classname) {
        obj["Sub_classname"] = Sub_classname;
      }
      if (chapterName) {
        chapterName = toTitleCase(chapterName);
        let data = await ChapterModel.findOne({ chapterName: chapterName });
        if (data)
          return res
            .status(400)
            .json({ error: `${chapterName} already exits` });
        obj["chapterName"] = chapterName;
      }
      if (subjectName) {
        obj["subjectName"] = subjectName;
      }
      let data = await ChapterModel.findOneAndUpdate(
        { _id: id },
        { $set: obj }
      );
      if (!data) return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Successfully updated" });
    } catch (error) {
      console.log(error);
    }
  }
  async getAllChapter(req, res) {
    try {
      let data = await ChapterModel.find({}).sort({ _id: -1 });
      return res.status(200).json({ success: data });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteChapter(req, res) {
    try {
      let id = req.params.id;
      let data = await ChapterModel.deleteOne({ _id: id });
      if (data.deletedCount == 0)
        return res.status(400).json({ error: "Data not found" });
      return res.status(200).json({ success: "Sucessfully deleted" });
    } catch (error) {
      console.log(error);
    }
  }

  // New optimized method with filtering and pagination
  async getChaptersWithFilters(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        mediumName = "",
        className = "",
        subClassName = "",
        subjectName = "",
        subjectPart = "",
        sortBy = "createdAt",
        sortOrder = "desc"
      } = req.query;

      // Build filter query
      let filterQuery = {};

      // Text search across multiple fields
      if (search) {
        filterQuery.$or = [
          { chapterName: { $regex: search, $options: "i" } },
          { subjectName: { $regex: search, $options: "i" } },
          { SubjectPart: { $regex: search, $options: "i" } },
          { mediumName: { $regex: search, $options: "i" } },
          { Classname: { $regex: search, $options: "i" } },
          { Sub_classname: { $regex: search, $options: "i" } }
        ];
      }

      // Specific field filters
      if (mediumName) filterQuery.mediumName = mediumName;
      if (className) filterQuery.Classname = className;
      if (subClassName) filterQuery.Sub_classname = subClassName;
      if (subjectName) filterQuery.subjectName = subjectName;
      if (subjectPart) filterQuery.SubjectPart = subjectPart;

      // Calculate pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Build sort object
      const sortObj = {};
      sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Execute query with pagination
      const [chapters, totalCount] = await Promise.all([
        ChapterModel.find(filterQuery)
          .sort(sortObj)
          .skip(skip)
          .limit(limitNum)
          .lean(), // Use lean() for better performance
        ChapterModel.countDocuments(filterQuery)
      ]);

      // Calculate pagination info
      const totalPages = Math.ceil(totalCount / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;

      return res.status(200).json({
        success: true,
        data: {
          chapters,
          pagination: {
            currentPage: pageNum,
            totalPages,
            totalCount,
            limit: limitNum,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? pageNum + 1 : null,
            prevPage: hasPrevPage ? pageNum - 1 : null
          },
          filters: {
            search,
            mediumName,
            className,
            subClassName,
            subjectName,
            subjectPart,
            sortBy,
            sortOrder
          }
        }
      });
    } catch (error) {
      console.log("Error in getChaptersWithFilters:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Server error while fetching chapters" 
      });
    }
  }

  // Get filter options for dropdowns
  async getFilterOptions(req, res) {
    try {
      console.log("getFilterOptions called");
      const [
        mediumOptions,
        classOptions,
        subClassOptions,
        subjectOptions,
        subjectPartOptions
      ] = await Promise.all([
        ChapterModel.distinct("mediumName"),
        ChapterModel.distinct("Classname"),
        ChapterModel.distinct("Sub_classname"),
        ChapterModel.distinct("subjectName"),
        ChapterModel.distinct("SubjectPart")
      ]);

      console.log("Distinct values:", {
        mediumOptions,
        classOptions,
        subClassOptions,
        subjectOptions,
        subjectPartOptions
      });

      return res.status(200).json({
        success: true,
        data: {
          mediumOptions: mediumOptions.filter(Boolean).sort(),
          classOptions: classOptions.filter(Boolean).sort(),
          subClassOptions: subClassOptions.filter(Boolean).sort(),
          subjectOptions: subjectOptions.filter(Boolean).sort(),
          subjectPartOptions: subjectPartOptions.filter(Boolean).sort()
        }
      });
    } catch (error) {
      console.log("Error in getFilterOptions:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Server error while fetching filter options" 
      });
    }
  }

  // Get cascading filter options based on selected filters
  async getCascadingFilterOptions(req, res) {
    try {
      const { mediumName, className, subClassName, subjectName } = req.query;
      
      console.log("getCascadingFilterOptions called with:", { mediumName, className, subClassName, subjectName });

      // Build filter objects for each level
      const mediumFilter = {};
      const classFilter = mediumName ? { mediumName } : {};
      const subClassFilter = {};
      const subjectFilter = {};
      const subjectPartFilter = {};

      if (mediumName) {
        subClassFilter.mediumName = mediumName;
        subjectFilter.mediumName = mediumName;
        subjectPartFilter.mediumName = mediumName;
      }
      if (className) {
        subClassFilter.Classname = className;
        subjectFilter.Classname = className;
        subjectPartFilter.Classname = className;
      }
      if (subClassName) {
        subjectFilter.Sub_classname = subClassName;
        subjectPartFilter.Sub_classname = subClassName;
      }
      if (subjectName) {
        subjectPartFilter.subjectName = subjectName;
      }

      console.log("Filters:", { mediumFilter, classFilter, subClassFilter, subjectFilter, subjectPartFilter });

      // Get distinct values based on current filters
      const [mediumOptions, classOptions, subClassOptions, subjectOptions, subjectPartOptions] = await Promise.all([
        ChapterModel.distinct("mediumName", mediumFilter),
        ChapterModel.distinct("Classname", classFilter),
        ChapterModel.distinct("Sub_classname", subClassFilter),
        ChapterModel.distinct("subjectName", subjectFilter),
        ChapterModel.distinct("SubjectPart", subjectPartFilter)
      ]);

      console.log("Cascading distinct values:", {
        mediumOptions,
        classOptions,
        subClassOptions,
        subjectOptions,
        subjectPartOptions
      });

      return res.status(200).json({
        success: true,
        data: {
          mediumOptions: mediumOptions.filter(Boolean).sort(),
          classOptions: classOptions.filter(Boolean).sort(),
          subClassOptions: subClassOptions.filter(Boolean).sort(),
          subjectOptions: subjectOptions.filter(Boolean).sort(),
          subjectPartOptions: subjectPartOptions.filter(Boolean).sort()
        }
      });
    } catch (error) {
      console.log("Error in getCascadingFilterOptions:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Server error while fetching cascading filter options" 
      });
    }
  }
}
module.exports = new CHAPTER();
