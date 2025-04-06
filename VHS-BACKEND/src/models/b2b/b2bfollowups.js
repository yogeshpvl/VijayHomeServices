const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const B2BFollowup = sequelize.define(
  "B2BFollowup",
  {
    b2b_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: DataTypes.TEXT,
    folldate: DataTypes.DATE,
    staffname: DataTypes.TEXT,
    response: DataTypes.TEXT,
    description: DataTypes.TEXT,
    value: DataTypes.DECIMAL(10, 2),
    colorcode: DataTypes.TEXT,
    nxtfoll: DataTypes.DATE,
  },
  {
    tableName: "b2bfollowups",
    timestamps: true,
  }
);

module.exports = B2BFollowup;
