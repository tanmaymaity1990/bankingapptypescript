const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null){
        return res.status(401).json({message:"Invalid Token."});
    }
    else {
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if(err){
                return res.status(401).json({message:"Invalid Token."});
            }
            else {
                req.user = user;
                next();
            }
          })
    }
}