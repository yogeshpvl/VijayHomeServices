const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TryToBooking = sequelize.define(
  "trytobooking",
  {
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,

      field: "phonenumber",
    },

    service: {
      type: DataTypes.STRING,
    },
    reference: {
      type: DataTypes.STRING,
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
    executive: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    timestamps: true,
    tableName: "trytobooking",
  }
);

module.exports = TryToBooking;
