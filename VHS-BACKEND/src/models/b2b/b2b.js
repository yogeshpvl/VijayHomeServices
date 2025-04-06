const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const B2B = sequelize.define(
  "B2B",
  {
    b2bname: DataTypes.TEXT,
    b2b_id: DataTypes.TEXT,
    contactperson: DataTypes.TEXT,
    maincontact: DataTypes.TEXT,
    alternateno: DataTypes.TEXT,
    email: DataTypes.TEXT,
    gst: DataTypes.TEXT,
    address: DataTypes.TEXT,
    city: DataTypes.TEXT,
    b2btype: DataTypes.TEXT,
    approach: DataTypes.TEXT,
    executive_name: DataTypes.TEXT,
    executive_number: DataTypes.TEXT,
    instructions: DataTypes.TEXT,
    date: DataTypes.DATEONLY,
    time: DataTypes.STRING,
  },
  {
    tableName: "b2bs",
    timestamps: true,
  }
);

module.exports = B2B;
