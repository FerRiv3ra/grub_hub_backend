const jwt = require("jsonwebtoken");

const generateJWT = (uid = "") => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY,
      {
        expiresIn: "5d",
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("Sorry the token cannot be generate");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = {
  generateJWT,
};
