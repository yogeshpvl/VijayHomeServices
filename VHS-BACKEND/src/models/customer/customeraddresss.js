const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const UserAddress = sequelize.define(
  "customeraddress",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    landmark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    other_data: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    platno: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    save_as: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    marker_coordinate: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  },
  {
    tableName: "customeraddress",
    timestamps: false,
  }
);

module.exports = UserAddress;
