// backend middleware code
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    console.log("Received Token:", token);

    if (!token) {
      return res.status(401).send({
        message: "Authorization header missing",
        success: false,
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        console.error(err);
        return res.status(401).send({
          message: "Authorization failed",
          success: false,
        });
      } else {
        console.log("Decoded Payload:", decode);
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Authorization failed",
      success: false,
    });
  }
};
