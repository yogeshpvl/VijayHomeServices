const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Reschedule = sequelize.define(
  "Reschedule",
  {
    service_date: DataTypes.DATEONLY,
    service_id: DataTypes.INTEGER,
    techname: DataTypes.TEXT,
    reason: DataTypes.TEXT,
    number: DataTypes.TEXT,
  },
  {
    tableName: "reschedules",
    timestamps: true,
  }
);

module.exports = Reschedule;
