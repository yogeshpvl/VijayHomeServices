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
    value: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    next_followup_date: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: true,
    tableName: "followups",
  }
);

// Define relationships
Enquiry.hasMany(Followup, { foreignKey: "enquiryId", as: "followups" });
Followup.belongsTo(Enquiry, { foreignKey: "enquiryId" });

module.exports = Followup;
