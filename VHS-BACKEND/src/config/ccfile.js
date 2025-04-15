const crypto = require("crypto");

exports.encrypt = function (plainObject, keyBase64, ivBase64) {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const plainText =
    typeof plainObject === "string" ? plainObject : JSON.stringify(plainObject);

  console.log("plainObject", plainObject);

  const cipher = crypto.createCipheriv(getAlgorithm(key), key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

exports.decrypt = function (encryptedText, keyBase64, ivBase64) {
  const key = Buffer.from(keyBase64, "base64");
  const iv = Buffer.from(ivBase64, "base64");

  const decipher = crypto.createDecipheriv(getAlgorithm(key), key, iv);
  console.log("decipher", decipher);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  try {
    return JSON.parse(decrypted);
  } catch (e) {
    return decrypted;
  }
};

function getAlgorithm(key) {
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 24:
      return "aes-192-cbc";
    case 32:
      return "aes-256-cbc";
    default:
      throw new Error("Invalid key length: " + key.length);
  }
}
