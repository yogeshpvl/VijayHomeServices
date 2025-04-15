const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Enquiry = sequelize.define(
  "Enquiry",
  {
    enquiryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.STRING,
    },
    time: {
      type: DataTypes.STRING,
    },
    executive: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact2: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference1: {
      type: DataTypes.STRING,
    },
    reference2: {
      type: DataTypes.STRING,
    },
    reference3: {
      type: DataTypes.STRING,
    },
    reference4: {
      type: DataTypes.STRING,
    },
    reference5: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.STRING,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    interested_for: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    service_id: {
      type: DataTypes.STRING,
    },
    utm_source: {
      type: DataTypes.STRING,
    },
    utm_campaign: {
      type: DataTypes.STRING,
    },
    utm_content: {
      type: DataTypes.STRING,
    },
    tag: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "enquiries",
  }
);

module.exports = Enquiry;
