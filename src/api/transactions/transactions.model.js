const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionsSchema = new mongoose.Schema({
    transactionName: {
        type: String,
        require: true,
    },
    transactionDescription: {
        type: String
    },
    transactionValue: {
        type: Number,
        require: true
    },
    transactionDate: {
        type: Date,
        require: true,
    },
    category: {
        type: String,
        required: true
    },
    room: {
        type: String,
        require: true
    },
    income: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('transactions', transactionsSchema);