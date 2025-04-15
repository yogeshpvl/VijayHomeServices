const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Vendor = sequelize.define(
  "vendors",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category: { type: DataTypes.JSONB }, // Array of objects
    type: { type: DataTypes.STRING }, // Executive, Technician, PM, etc.
    fcmtoken: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING, allowNull: false },
    vhsname: { type: DataTypes.STRING, allowNull: false },
    smsname: { type: DataTypes.STRING, allowNull: false },
    number: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    experiance: { type: DataTypes.STRING, allowNull: false },
    languagesknow: { type: DataTypes.STRING, allowNull: false },
    area: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },
    radius: { type: DataTypes.INTEGER },
    vimg: { type: DataTypes.STRING },
    status: { type: DataTypes.BOOLEAN, defaultValue: true },
    block: { type: DataTypes.BOOLEAN, defaultValue: false },
    reason: { type: DataTypes.TEXT },
    adharno: { type: DataTypes.TEXT },
    adhar_img_url: { type: DataTypes.TEXT },
    id_proof: { type: DataTypes.BOOLEAN, defaultValue: false },
    address_proof: { type: DataTypes.BOOLEAN, defaultValue: false },
    bank_proof: { type: DataTypes.BOOLEAN, defaultValue: false },
    vendor_amt: { type: DataTypes.DECIMAL, defaultValue: 0 },
  },
  {
    timestamps: true,
    tableName: "vendors",
  }
);

module.exports = Vendor;
