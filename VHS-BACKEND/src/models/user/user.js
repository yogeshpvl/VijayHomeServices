const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bcrypt = require("bcryptjs");

const User = sequelize.define("users", {
  displayname: { type: DataTypes.STRING, allowNull: false },
  contactno: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  roles: { type: DataTypes.JSONB, defaultValue: {} },
  category: { type: DataTypes.JSONB, defaultValue: [] },
  city: { type: DataTypes.JSONB, defaultValue: [] },
});

// Hash Password Before Saving
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// Compare Password Method
User.prototype.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
