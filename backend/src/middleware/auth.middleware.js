const userModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(401).json({
            message: 'Unauthorized, token is missing',
            status: "failed"
        })
    }
    const blacklistedToken = await tokenBlacklistModel.findOne({token});

    if(blacklistedToken){
        return res.status(401).json({
            message: 'Unauthorized, token is blacklisted',
            status: "failed"
        })
    }

    try{
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        req.user = {
      id: user._id,
      role: user.role,
      email: user.email
    };
         next();
    }catch(err){
       return res.status(401).json({
            message: 'Unauthorized, invalid token',
            status: "failed"
       })
    }
}

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied, admin only',
      status: "failed"
    });
  }
  next();
}


module.exports = {
    authMiddleware,
    isAdmin
}