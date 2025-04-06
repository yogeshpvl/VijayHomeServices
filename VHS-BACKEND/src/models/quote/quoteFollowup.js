const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const QuoteFollowup = sequelize.define(
  "QuoteFollowup",
  {
    enquiryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "enquiry_id",
    },

    category: DataTypes.TEXT,
    foll_date: DataTypes.DATEONLY,
    foll_time: DataTypes.TEXT,
    staff_name: DataTypes.TEXT,
    response: DataTypes.TEXT,
    description: DataTypes.TEXT,
    nxtfoll: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    colorcode: DataTypes.TEXT,
  },
  {
    tableName: "quote_followups",
    timestamps: true,
  }
);

module.exports = QuoteFollowup;
