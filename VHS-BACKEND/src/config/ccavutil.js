// const crypto = require("crypto");

// exports.encrypt = function (plainText, keyBase64, ivBase64) {
//   const key = Buffer.from(keyBase64, "base64");
//   const iv = Buffer.from(ivBase64, "base64");

//   const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
//   let encrypted = cipher.update(plainText, "utf8", "hex");
//   encrypted += cipher.final("hex");
//   return encrypted;
// };

// exports.decrypt = function (messagebase64, keyBase64, ivBase64) {
//   const key = Buffer.from(keyBase64, "base64");
//   const iv = Buffer.from(ivBase64, "base64");

//   const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
//   let decrypted = decipher.update(messagebase64, "hex", "utf8");
//   decrypted += decipher.final("utf8");
//   return decrypted;
// };

// function getAlgorithm(keyBase64) {
//   const key = Buffer.from(keyBase64, "base64");
//   switch (key.length) {
//     case 16:
//       return "aes-128-cbc";
//     case 32:
//       return "aes-256-cbc";
//   }
//   throw new Error("Invalid key length: " + key.length);
// }

const crypto = require("crypto");

exports.encrypt = function (plainText, workingKey) {
  var m = crypto.createHash("md5");
  m.update(workingKey);
  var key = Buffer.from(m.digest("hex"), "hex"); // Convert to Buffer (binary)
  var iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]); // IV in Buffer (binary)
  var cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  var encoded = cipher.update(plainText, "utf8", "hex");
  encoded += cipher.final("hex");
  return encoded;
};

exports.decrypt = function (encText, workingKey) {
  var m = crypto.createHash("md5");
  m.update(workingKey);
  var key = Buffer.from(m.digest("hex"), "hex"); // Convert to Buffer (binary)
  var iv = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]); // IV in Buffer (binary)
  var decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  var decoded = decipher.update(encText, "hex", "utf8");
  decoded += decipher.final("utf8");
  return decoded;
};
