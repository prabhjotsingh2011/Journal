const jwt = require("jsonwebtoken");
module.exports = {
  // checkToken: (req, res, next) => {
  //   let token = req.get("authorization");
  //   if (token) {
  //     // Remove Bearer from string
  //     token = token.slice(7);
  //     jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
  //       if (err) {
  //         return res.json({
  //           success: 0,
  //           message: "Invalid Token..."
  //         });
  //       } else {
  //         req.decoded = decoded;
  //         next();
  //       }
  //     });
  //   } else {
  //     return res.json({
  //       success: 0,
  //       message: "Access Denied! Unauthorized User"
  //     });
  //   }
  // }

  validateTokenMiddleware: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      return res.json({ message: "please send token" }).sendStatus(401);
    }

    jwt.verify(token, 'secret_key', (err, user) => {
      if (err) {
        console.error('Invalid Token', err);
        return res.json({message:"Invalid Token"}).sendStatus(403);
      }
      else{
        req.user = user;
        next();
      }
    });
  }
};
