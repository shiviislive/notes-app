const userModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

 async function userRegisterController(req, res) {

try{  const { email, name, password } = req.body;

    const isExists = await userModel.findOne({
       email : email
    })

    if(isExists){
        return res.status(422).json({
            message: 'Email already exists',
            status: "failed"
        })
    }

    const user = await userModel.create({
        email,name,password
    })

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })

    res.cookie('token', token) ;

    return res.status(201).json({
        message: 'User registered successfully',
        status: "success",
        user: {
            id : user._id,
            email: user.email,
            name: user.name
        },
        token
    })} catch(err){
        return res.status(500).json({
      message: "Server error",
      error: err.message
    })
}

}

async function userLoginController(req, res) {
  try {const {email,password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
       return res.status(401).json({
            message: 'Invalid email or password',
            status: "failed"
        })
    }

    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid){
      return res.status(401).json({
            message: 'Invalid email or password',
            status: "failed"
        })
    }

    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {
        expiresIn: '3d'
    })

    res.cookie('token', token) ;

    return res.status(200).json({
        message: 'User Login successfully',
        status: "success",
        user: {
            id : user._id,
            email: user.email,
            name: user.name,
            role: user.role
        },
        token
    })} catch(err){
        return res.status(500).json({
      message: "Server error",
      error: err.message
    })
    }

}

async function userLogoutController(req, res) {
   try{ const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if(!token){
        return res.status(200).json({
            message: "No token found to logout",
            status: "success"
        })
    }

    res.cookie('token', '');

    await tokenBlacklistModel.create({
        token : token
    })
   
    res.status(200).json({
        message: "User logged out successfully",
        status: "success"
    })
    } catch(err){
        return res.status(500).json({
      message: "Server error",
      error: err.message
        })
    }
}

module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}