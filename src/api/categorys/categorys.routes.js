const express = require('express');
const router = express.Router();
const jwt_decode = require('jwt-decode');
const veryfy = require('../../config/verifyToken');
var middlewear = require('../../util/middlewares');
const categorysModel = require('./categorys.model');

// Create new category

router.post('/', veryfy, async (req, res) => {
    try {
        const newCategory = new categorysModel({
            categoryName: req.body.categoryName,
            room: req.body.room
        });

        const savedCategory = await newCategory.save();
        
        res.status(201).json(savedCategory); 

    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

// Get all room categorys

router.get('/:id', veryfy, async (req,res) => {
    const getCategorys = await categorysModel.find({room: req.params.id});
    
    return res.status(200).json(getCategorys);
});


module.exports = router;