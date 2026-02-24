const Subscription = require("../../Module/Admin/Subscription");

class SubscriptionController {
  async addSubscription(req, res) {
    try {
      const {
        subscriptionName,
        subclassId,
        subclassName,
        examinations,
        price,
        description,
      } = req.body;

      if (!subscriptionName) {
        return res.status(400).json({ error: "Please enter subscription name" });
      }
      if (!subclassId || !subclassName) {
        return res.status(400).json({ error: "Please select a subclass" });
      }
      if (!examinations || examinations.length === 0) {
        return res.status(400).json({ error: "Please select at least one examination" });
      }
      // Validate each examination has valid questionPapers
      for (const exam of examinations) {
        if (!exam.questionPapers || exam.questionPapers < 1) {
          return res.status(400).json({ error: `Please enter valid number of papers for ${exam.examinationName}` });
        }
      }
      if (price === undefined || price < 0) {
        return res.status(400).json({ error: "Please enter valid price" });
      }

      const newSubscription = await Subscription.create({
        subscriptionName,
        subclassId,
        subclassName,
        examinations,
        price,
        description,
      });

      return res.status(200).json({ 
        success: "Subscription added successfully",
        data: newSubscription 
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async updateSubscription(req, res) {
    try {
      const {
        id,
        subscriptionName,
        subclassId,
        subclassName,
        examinations,
        price,
        description,
        isActive,
      } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Subscription ID is required" });
      }

      const updateObj = {};
      if (subscriptionName) updateObj.subscriptionName = subscriptionName;
      if (subclassId) updateObj.subclassId = subclassId;
      if (subclassName) updateObj.subclassName = subclassName;
      if (examinations) updateObj.examinations = examinations;
      if (price !== undefined) updateObj.price = price;
      if (description !== undefined) updateObj.description = description;
      if (isActive !== undefined) updateObj.isActive = isActive;

      const updated = await Subscription.findByIdAndUpdate(
        id,
        { $set: updateObj },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Subscription not found" });
      }

      return res.status(200).json({ 
        success: "Subscription updated successfully",
        data: updated 
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async getAllSubscriptions(req, res) {
    try {
      const subscriptions = await Subscription.find({})
        .populate("subclassId")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: subscriptions });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async getActiveSubscriptions(req, res) {
    try {
      const subscriptions = await Subscription.find({ isActive: true })
        .populate("subclassId")
        .sort({ createdAt: -1 });
      return res.status(200).json({ success: subscriptions });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async getSubscriptionById(req, res) {
    try {
      const { id } = req.params;
      const subscription = await Subscription.findById(id).populate("subclassId");
      
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      return res.status(200).json({ success: subscription });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async getSubscriptionsBySubclass(req, res) {
    try {
      const { subclassId } = req.params;
      const subscriptions = await Subscription.find({ 
        subclassId, 
        isActive: true 
      }).sort({ createdAt: -1 });
      
      return res.status(200).json({ success: subscriptions });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async deleteSubscription(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Subscription.findByIdAndDelete(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      return res.status(200).json({ success: "Subscription deleted successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }

  async toggleSubscriptionStatus(req, res) {
    try {
      const { id } = req.params;
      const subscription = await Subscription.findById(id);
      
      if (!subscription) {
        return res.status(404).json({ error: "Subscription not found" });
      }
      
      subscription.isActive = !subscription.isActive;
      await subscription.save();
      
      return res.status(200).json({ 
        success: `Subscription ${subscription.isActive ? 'activated' : 'deactivated'} successfully`,
        data: subscription 
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong!" });
    }
  }
}

module.exports = new SubscriptionController();
