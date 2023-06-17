const jwt = require("jsonwebtoken");
module.exports = {

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
