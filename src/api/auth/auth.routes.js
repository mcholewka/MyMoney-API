const express = require('express');
const router = express.Router();
const AuthModel = require('./auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Register user
router.post('/register', async (req, res) => {

    const checkEmail = await AuthModel.findOne({email: req.body.email});
    if(checkEmail) return res.status(400).send('Email already taken');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const authUser = new AuthModel({
        email: req.body.email,
        displayName: req.body.displayName,
        password: hashPassword
    });
    try{
        const savedUser = await authUser.save();
        res.send({_id: savedUser._id});
    } catch(err) {
        res.status(400).send(err);
    }
});

//Login user, add auth-token to header
router.post('/login', async (req, res) => {

    const user = await AuthModel.findOne({email: req.body.email});
    if(!user) return res.status(400).send({message:'Email does not exists'});
    
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send({message:'Invalid password!'});

    //JWT
    const token = jwt.sign({_id: user._id, email: user.email, displayName: user.displayName}, process.env.TOKEN);
    res.header('auth-token', token).send({token: token});
});

module.exports = router;
