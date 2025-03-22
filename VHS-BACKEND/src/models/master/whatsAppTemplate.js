const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

const Response = sequelize.define(
  "whatsapp_templates",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    template_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    content: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    tableName: "whatsapp_templates",
  }
);

module.exports = Response;
