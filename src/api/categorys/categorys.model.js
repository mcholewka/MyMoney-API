const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorysSchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('categorys', categorysSchema);