//import express
const express = require('express');

//import validationResult from express-validator
const { validationResult } = require('express-validator');

//import bcrypt
const bcrypt = require('bcryptjs');

//import jsonwebtoken
const jwt = require('jsonwebtoken');

//import prisma client
const prisma = require('../prisma/client');

//function login
const login = async (req, res) => {

    //periksa hasil validasi
    const error = validationResult(req);

    if(!error.isEmpty()) {
        //jika ada error, kembalikan error ke pengguna
        return res.status(422).json({
            succes: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }

    try {
        //find user
        const user = await prisma.user.findFirst({
            where: {
                email: req.body.email,
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            },
        });

        //user not found
        if (!user) 
            return res.status(404).json({
                succes: false,
                message: 'User not found',
            });

        //compare password
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        //password incorrect
        if (!validPassword)
            return res.status(401).json({
                succes: false,
                message: 'Invalid password',
            });

        //generate token JWT
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        //destructure to remove password from user object
        const { password, ...userWithoutPassword } = user;

        //return response
        res.status(200).send({
            succes: true,
            message: 'Login succesfully',
            data: {
                user: userWithoutPassword,
                token: token,
            },
        });
    } catch (error) {
        res.status(500).send({
            succes: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { login };