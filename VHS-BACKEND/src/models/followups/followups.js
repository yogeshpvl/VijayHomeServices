const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const Enquiry = require("../enquiry/enquiry");

const Followup = sequelize.define(
  "Followup",
  {
    followupId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    enquiryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Enquiry,
        key: "enquiryId",
      },
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    staff: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    response: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    color: {
      type: DataTypes.TEXT,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    next_followup_date: {
      type: DataTypes.DATE,
    },
    // ✅ New fields added correctly
    appo_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    appo_time: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    executive_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "NOT ASSIGNED",
    },
    creason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    executive_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "vendors", // 🔁 typo fixed: was "venodrs"
        key: "id", // make sure this matches vendor primary key
      },
    },
  },
  {
    timestamps: true,
    tableName: "followups",
    indexes: [
      { fields: ["enquiryId", "createdAt"], unique: false },
      { fields: ["next_followup_date", "response"] },
    ],
  }
);

Enquiry.hasMany(Followup, { foreignKey: "enquiryId", as: "followups" });
Followup.belongsTo(Enquiry, { foreignKey: "enquiryId", as: "Enquiry" });

module.exports = Followup;
