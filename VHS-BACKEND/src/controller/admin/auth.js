const adminAuthmodel = require("../../model/admin/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class MasterAdmin {
  // 🟢 Register a New User
  // 🟢 Register a New User
  async addUser(req, res) {
    try {
      let {
        displayname,
        contactno,
        loginnameOrEmail,
        password,
        confirmPassword,
      } = req.body;

      // Validate input fields
      if (
        !displayname ||
        !contactno ||
        !loginnameOrEmail ||
        !password ||
        !confirmPassword
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      // Check if a user already exists with the same displayname, contactno, or loginnameOrEmail
      const existingUser = await adminAuthmodel.findOne({
        $or: [{ displayname }, { contactno }, { loginnameOrEmail }],
      });

      if (existingUser) {
        let duplicateField = "";
        if (existingUser.displayname === displayname)
          duplicateField = "Display Name";
        else if (existingUser.contactno === contactno)
          duplicateField = "Contact Number";
        else if (existingUser.loginnameOrEmail === loginnameOrEmail)
          duplicateField = "Email/Login Name";

        return res
          .status(400)
          .json({
            error: `${duplicateField} already exists. Please use a different one.`,
          });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      let newUser = new adminAuthmodel({
        displayname,
        contactno,
        loginnameOrEmail,
        password: hashedPassword,
      });

      await newUser.save();
      return res.status(201).json({ success: "User registered successfully" });
    } catch (error) {
      console.error(error);

      // Handle MongoDB unique constraint errors
      if (error.code === 11000) {
        let field = Object.keys(error.keyPattern)[0];
        return res
          .status(400)
          .json({
            error: `${field} already exists. Please use a different one.`,
          });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // 🔵 User Login and Token Generation
  async loginUser(req, res) {
    try {
      const { loginnameOrEmail, password } = req.body;

      // Validate input
      if (!loginnameOrEmail || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Check if user exists
      const user = await adminAuthmodel.findOne({ loginnameOrEmail });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate JWT Token
      const token = jwt.sign(
        { id: user._id, loginnameOrEmail: user.loginnameOrEmail },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // Token expires in1 hr
      );

      return res.status(200).json({ success: "Login successful", token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async edituser(req, res) {
    try {
      const userData = req.params.userId;
      const {
        displayname,
        contactno,
        loginnameOrEmail,
        password,
        confirmPassword,
      } = req.body;

      // check if loginname is already exists
      const existingLoginnameOrEmail = await adminAuthmodel.findOne({
        loginnameOrEmail: loginnameOrEmail,
      });
      if (existingLoginnameOrEmail) {
        return res
          .status(400)
          .json({ error: "Loginname or Email already exists" });
      }

      // check if displayname is already exists
      const existingDisplayName = await adminAuthmodel.findOne({
        displayname: displayname,
      });
      if (existingDisplayName) {
        return res.status(400).json({ error: "Displayname already exists" });
      }

      // check if contact is already exists
      const existingContactno = await adminAuthmodel.findOne({
        contactno: contactno,
      });
      if (existingContactno) {
        return res.status(400).json({ error: "Contactno already exists" });
      }

      // Check if the user exists
      const user = await adminAuthmodel.findOne({ _id: userData });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update the user
      user.displayname = displayname || user.displayname;
      user.contactno = contactno || user.contactno;
      user.loginnameOrEmail = loginnameOrEmail || user.loginnameOrEmail;
      user.password = password
        ? await bcrypt.hash(password, 10)
        : user.password;
      user.confirmPassword = confirmPassword;

      await adminAuthmodel.findByIdAndUpdate(userData, user);
      return res
        .status(200)
        .json({ message: "Updated successfully", data: user });
    } catch (error) {
      console.log("Error in updateprofile: ", error);
      return res.status(500).send({
        message:
          "Something went wrong while updating your details. Please try again later.",
      });
    }
  }

  async giveRights(req, res) {
    try {
      const userData = req.params.userId;
      const {
        city,
        category,
        master,
        enquiry,
        enquiryAdd,
        enquiryFollowup,
        survey,
        quote,
        customer,
        quoteFollowup,
        dsr,
        runningProjects,
        closeProjects,
        b2b,
        community,
        reports,
        paymentReport,
        TryToBook,
        MissDSRDATA,
      } = req.body;
      let obj = {};
      // Check if the user exists
      const user = await adminAuthmodel.findOne({ _id: userData });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (typeof master !== "undefined") {
        obj["master"] = master;
      }
      if (typeof enquiry !== "undefined") {
        obj["enquiry"] = enquiry;
      }
      if (typeof enquiryAdd !== "undefined") {
        obj["enquiryAdd"] = enquiryAdd;
      }
      if (typeof enquiryFollowup !== "undefined") {
        obj["enquiryFollowup"] = enquiryFollowup;
      }
      if (typeof survey !== "undefined") {
        obj["survey"] = survey;
      }
      if (typeof quote !== "undefined") {
        obj["quote"] = quote;
      }
      if (typeof customer !== "undefined") {
        obj["customer"] = customer;
      }
      if (typeof TryToBook !== "undefined") {
        obj["TryToBook"] = TryToBook;
      }
      if (typeof quoteFollowup !== "undefined") {
        obj["quoteFollowup"] = quoteFollowup;
      }
      if (typeof MissDSRDATA !== "undefined") {
        obj["MissDSRDATA"] = MissDSRDATA;
      }
      if (typeof dsr !== "undefined") {
        obj["dsr"] = dsr;
      }
      if (typeof runningProjects !== "undefined") {
        obj["runningProjects"] = runningProjects;
      }
      if (typeof closeProjects !== "undefined") {
        obj["closeProjects"] = closeProjects;
      }
      if (typeof b2b !== "undefined") {
        obj["b2b"] = b2b;
      }
      if (typeof community !== "undefined") {
        obj["community"] = community;
      }
      if (typeof reports !== "undefined") {
        obj["reports"] = reports;
      }
      if (typeof paymentReport !== "undefined") {
        obj["paymentReport"] = paymentReport;
      }

      if (typeof category !== "undefined") {
        obj["category"] = category;
      }

      // Update city if provided
      if (typeof city !== "undefined") {
        // Save city data
        // const cityData = await cityymodel.create(city);
        obj["city"] = city;
      }
      let isData = await adminAuthmodel.findOneAndUpdate(
        { _id: userData },
        { $set: obj },
        {
          new: true,
        }
      );
      if (isData) {
        return res
          .status(200)
          .json({ message: "Updated successfully", data: isData });
      } else {
        return res.status(500).json({ status: false, msg: "No such profile" });
      }
    } catch (error) {
      console.log("Error in updateprofile : ", error);
      return res.status(403).send({
        message:
          "Something went wrong while updating your details Please try again later.",
      });
    }
  }
  //change password
  async changePassword(req, res) {
    try {
      // Get the user ID from the request parameters
      const userData = req.params.userId;

      // Get the old password, new password, and confirm password from the request body
      const { oldPassword, newPassword, newConfirmPassword } = req.body;

      // Check if the user exists
      const user = await adminAuthmodel.findById(userData);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the old password matches the stored password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid old password" });
      }

      // Check if the new password and confirm password match
      if (newPassword !== newConfirmPassword) {
        return res
          .status(400)
          .json({ error: "New password and confirm password do not match" });
      }

      // Update the password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      // Return a success message
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.log("Error in changePassword: ", error);
      return res.status(500).send({
        message:
          "Something went wrong while changing the password. Please try again later.",
      });
    }
  }

  //get all master added user

  async getuser(req, res) {
    let data = await adminAuthmodel.find({}).sort({ _id: -1 });
    if (data) {
      return res.json({ masteruser: data });
    }
  }

  async postdeleteuser(req, res) {
    let id = req.params.id;
    const data = await adminAuthmodel.deleteOne({ _id: id });

    return res.json({ success: "Successfully" });
  }

  async getsignout(req, res) {
    let id = req.params.id;
    try {
      const data = await adminAuthmodel.findOneAndUpdate(
        { _id: id },
        { status: "offline" }
      );
      if (!data) {
        return res.status(403).json({
          error: "Cannot able to find the user",
        });
      } else {
        return res.json({ success: "Sign Out Successful" });
      }
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = new MasterAdmin();
