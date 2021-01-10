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

// Get all transactions from room by roomID

router.get("/:id", veryfy, async (req, res) => {
    try {
        const transactionRoom = await transactionsModel.find({room: req.params.id});
        return res.status(200).json(transactionRoom);
        
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

// Get filtered transactions from room by roomID

router.get("/filteredTransactions/:id", veryfy, async (req, res) => {
    try {


        if(req.query.expense=="true" && req.query.income=="true") {
            // if(req.query.category=="all") {
                const transactionRoom = await transactionsModel.find({room: req.params.id});
                return res.status(200).json(transactionRoom);
            // }
            // if(req.query.category!="all") {
            //     const transactionRoom = await transactionsModel.find({room: req.params.id, category: req.query.category});
            //     return res.status(200).json(transactionRoom);
            // } 
        }

        if(req.query.expense=="true" && req.query.income=="false") {
            // if(req.query.category=="all") {
                const transactionRoom = await transactionsModel.find({room: req.params.id, income: false});
                return res.status(200).json(transactionRoom);
            // }
            // if(req.query.category!="all") {
            //     const transactionRoom = await transactionsModel.find({room: req.params.id, income: false , category: req.query.category});
            //     return res.status(200).json(transactionRoom);
            // } 
        }

        if(req.query.expense=="false" && req.query.income=="true") {
            // if(req.query.category=="all") {
                const transactionRoom = await transactionsModel.find({room: req.params.id, income: true});
                return res.status(200).json(transactionRoom);
            // }
            // if(req.query.category!="all") {
            //     const transactionRoom = await transactionsModel.find({room: req.params.id, income: true, category: req.query.category});
            //     return res.status(200).json(transactionRoom);
            // } 
        }

        if(req.query.expense=="false" && req.query.income=="false") {
            const transactionRoom = null;
            return res.status(200).json(transactionRoom);
        }

    } catch(err) {

    }
});

//GET FILTERED V2

// router.get("/filteredTransactions/:id", veryfy, async (req, res) => {
//     try {
//         const transactionRoom = await transactionsModel.find(req.query);
//         console.log(transactionRoom);
//         return res.status(200).json(transactionRoom);

//     } catch(err) {

//     }
// });


//Delete transaction by transactionID

router.delete("/:id", veryfy, middlewear.getTransaction, async (req, res) => {
    try {
        await res.transaction.remove();
        res.json({message: 'Transaction has been deleted'});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

module.exports = router;