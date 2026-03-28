const Cryptr = require("cryptr");

const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);

function encryptSSH(key) {
  return cryptr.encrypt(key);
}

function decryptSSH(encryptedKey) {
  return cryptr.decrypt(encryptedKey);
}

module.exports = { encryptSSH, decryptSSH };