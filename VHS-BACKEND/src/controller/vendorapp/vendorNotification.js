const vendorNotificationmodel = require("../../model/vendorapp/vendorNotification");

class vendorNotification {
  async addvendorNotification(req, res) {
    let { title, desc, date, vendorId, amount } = req.body;

    let add = new vendorNotificationmodel({
      title,
      desc,
      date,
      vendorId,
      serviceId,
      amount,
    });
    try {
      let save = await add.save();
      if (save) {
        return res.json({
          success: "vendorNotification name added successfully",
        });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to add vendorNotification" });
    }
  }

  async getvendorNotification(req, res) {
    const vendorId = req.params.vendorId;
    try {
      let vendorNotification = await vendorNotificationmodel
        .find({ vendorId: vendorId })
        .sort({ _id: -1 });
      if (vendorNotification) {
        return res.json({ vendorNotification: vendorNotification });
      } else {
        return res.status(404).json({ error: "No categories found" });
      }
    } catch (error) {
      return res.status(500).json({ error: "Failed to retrieve categories" });
    }
  }

  async postdeletevendorNotification(req, res) {
    let id = req.params.id;
    try {
      const data = await vendorNotificationmodel.deleteOne({ _id: id });
      if (data.deletedCount > 0) {
        return res.json({ success: "Successfully deleted" });
      } else {
        return res.status(404).json({ error: "vendorNotification not found" });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to delete vendorNotification" });
    }
  }
}

const vendorNotificationController = new vendorNotification();
module.exports = vendorNotificationController;
