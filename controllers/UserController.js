//import express
const express = require('express');

//import prisma client
const prisma = require('../prisma/client');

//function findUsers
const findUser = async (req, res) => {
    try {
        //get all users from database
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            }, orderBy: {
                id: 'desc',
            },
        });

        //send response
        res.status(200).send({
            succes: true,
            message: 'Get all users succesfully',
            data: users,
        });
    } catch(error) {
        res.status(500).send({
            succes: false,
            message: 'Internal server error',
        });
    }
};

module.exports = { findUser };