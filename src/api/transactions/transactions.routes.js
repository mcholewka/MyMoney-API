const express = require('express');
const router = express.Router();
const jwt_decode = require('jwt-decode');
const veryfy = require('../../config/verifyToken');
var middlewear = require('../../util/middlewares');
const transactionsModel = require('./transactions.model');

// Create new transactions

router.post('/', veryfy, async (req, res) => {
    try {
        const newTransaction = new transactionsModel({
            transactionName: req.body.transactionName,
            transactionDescription: req.body.transactionDescription,
            transactionValue: req.body.transactionValue,
            transactionDate: req.body.transactionDate,
            category: req.body.category,
            room: req.body.room,
            income: req.body.income
        });

        const savedTransaction = await newTransaction.save();
        
        res.status(201).json(savedTransaction); 

    } catch(err) {
        res.status(400).json({message: err.message});
    }
});


module.exports = router;