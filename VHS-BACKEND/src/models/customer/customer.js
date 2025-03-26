const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Customer = sequelize.define(
  "customers",
  {
    cardNo: { type: DataTypes.INTEGER, unique: true },
    enquiryId: { type: DataTypes.INTEGER },
    customerName: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    contactPerson: { type: DataTypes.STRING },
    mainContact: { type: DataTypes.BIGINT, allowNull: false, unique: true },
    alternateContact: { type: DataTypes.BIGINT },
    email: { type: DataTypes.STRING },
    gst: { type: DataTypes.STRING },
    rbhf: { type: DataTypes.STRING },
    cnap: { type: DataTypes.STRING },
    lnf: { type: DataTypes.STRING },
    mainArea: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    pinCode: { type: DataTypes.INTEGER },
    customerType: { type: DataTypes.STRING },
    size: { type: DataTypes.STRING },
    approach: { type: DataTypes.STRING },
    serviceExecute: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING }, // optional
    type: { type: DataTypes.STRING },
    wAmount: { type: DataTypes.FLOAT },
    referralCode: { type: DataTypes.STRING },
    fcmtoken: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
  },
  {
    tableName: "customers",
    timestamps: true,
  }
);

module.exports = Customer;
