const jwt = require("jsonwebtoken");

function getNameFromEmail(email) {
  const regex = /^(.*?)@/;
  const match = email.match(regex);

  if (match) {
    return match[1];
  } else {
    return email;
  }
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
module.exports = { getNameFromEmail, generateToken };
