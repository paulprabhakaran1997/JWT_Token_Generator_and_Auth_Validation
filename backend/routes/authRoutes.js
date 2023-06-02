const express = require('express');
const authRoutes = express.Router();
const User = require('../models/UserModel');
const { hashGenerate, hashValidator } = require("../helpers/hashing");
const { tokenGenerator } = require('../helpers/token');
const authVerify = require('../helpers/authVerify')

authRoutes.post('/signup', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: (req.body.email).toLowerCase() });
        if (existingUser) {
            res.status(409).json(`Email ${req.body.email} already Exists`)
        }else {
            const hashPassword = await hashGenerate(req.body.password)

            const user = new User({
                username: req.body.username,
                email: (req.body.email).toLowerCase(),
                password: hashPassword
            });
            const savedUser = await user.save();
            res.status(200).json(savedUser);
        }

    } catch (error) {
        res.status(400).json(error)
    }
});

authRoutes.post('/signin', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (!existingUser) {
            res.status(400).json({ type: 'error', message: 'Invalid Email' })
        } else {
            const checkPassword = await hashValidator(req.body.password, existingUser.password);
            if (!checkPassword) {
                res.status(400).json("Invalid Password")
            } else {
                const token = tokenGenerator(existingUser.email);
                res.cookie("jwt", token, { httpOnly: true })
                res.status(200).json({ type: 'success', message: 'Login successful', username: existingUser.username, token: token })
            }
        }
    } catch (error) {
        res.status(400).json(error)
    }
});

authRoutes.get('/protected', authVerify, (req, res) => {
    res.json('I am Protected Route')
});

module.exports = authRoutes;