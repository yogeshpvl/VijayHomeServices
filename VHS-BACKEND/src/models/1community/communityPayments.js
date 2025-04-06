const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const CommunityPayment = sequelize.define(
  "CommunityPayment",
  {
    payment_mode: DataTypes.TEXT,
    comment: DataTypes.TEXT,
    payment_date: DataTypes.DATEONLY,
    community_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "communities",
        key: "id",
      },
    },
    amount_paid_community: DataTypes.DECIMAL(10, 2),
  },
  {
    tableName: "community_payments",
    timestamps: true,
  }
);

module.exports = CommunityPayment;
