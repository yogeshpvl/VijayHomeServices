const BankDetail = require("../../models/master/bankDetails");

exports.getAll = async (req, res) => {
  const data = await BankDetail.findAll({ order: [["id", "ASC"]] });
  res.json(data);
};

exports.create = async (req, res) => {
  const {
    account_number,
    account_holder_name,
    ifsc_code,
    bank_name,
    branch_name,
    upi_number,
  } = req.body;

  console.log(
    account_number,
    account_holder_name,
    ifsc_code,
    bank_name,
    branch_name,
    upi_number
  );

  if (
    !account_number ||
    !account_holder_name ||
    !ifsc_code ||
    !bank_name ||
    !branch_name
  ) {
    return res
      .status(400)
      .json({ error: "All fields except UPI are required" });
  }

  try {
    const created = await BankDetail.create({
      account_number,
      account_holder_name,
      ifsc_code,
      bank_name,
      branch_name,
      upi_number,
    });
    res.status(201).json(created);
  } catch (err) {
    console.log(" err.message ", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const {
    account_number,
    account_holder_name,
    ifsc_code,
    bank_name,
    branch_name,
    upi_number,
  } = req.body;

  try {
    const detail = await BankDetail.findByPk(id);
    if (!detail) return res.status(404).json({ error: "Not found" });

    Object.assign(detail, {
      account_number,
      account_holder_name,
      ifsc_code,
      bank_name,
      branch_name,
      upi_number,
    });

    await detail.save();
    res.json(detail);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  const { id } = req.params;
  try {
    await BankDetail.destroy({ where: { id } });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
