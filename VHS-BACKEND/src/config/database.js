const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize with PostgreSQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database Name
  process.env.DB_USER, // Username
  process.env.DB_PASSWORD, // Password
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    logging: false, // Disable logs
  }
);

// Test Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL database");
  } catch (error) {
    console.error("❌ Unable to connect to PostgreSQL:", error.message);
  }
})();

module.exports = sequelize;
