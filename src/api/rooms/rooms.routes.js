const express = require('express');
const router = express.Router();
const jwt_decode = require('jwt-decode');
const veryfy = require('../../config/verifyToken');
const room = require('./rooms.model');
const AuthModel = require("../auth/auth.model");
var middlewear = require('../../util/middlewares');
const transactionsModel = require('../transactions/transactions.model');

// Create new room
router.post('/', veryfy, async (req, res) => {
    try {

        const currentUserId = (jwt_decode(req.header('auth-token')))._id;

        const createRoom = new room({
            roomName: req.body.roomName,
            users: currentUserId
        });

        const savedRoom = await createRoom.save();

        const currrentUser = await AuthModel.findById(currentUserId);
        currrentUser.rooms.push({_id: savedRoom._id});
        await currrentUser.save();
        
        res.status(201).json(savedRoom); 

    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

// Get list of all rooms to which current user is containing
router.get('/',veryfy, async (req, res) => {
    try {
        const currentUserId = (jwt_decode(req.header('auth-token')))._id;
        const currentUserRooms = await room.find({users: currentUserId});
        res.json({rooms: currentUserRooms});        
    } catch(err) {
        res.status(400).json({message: err.message});
    }
});

// Get one room by roomID
router.get('/:id', veryfy, middlewear.getRoom, (req, res) => {
    res.json(res.room);
});

// Delete one room by roomID
router.delete('/:id', veryfy, middlewear.getRoom, async (req, res) => {
    try {
        await res.room.remove();
        res.json({message: 'Bucket has been deleted'});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

// Get all users belongs to room by room id

router.get('/getRoomUsers/:id', veryfy, async (req,res) => {
    const getRoom = await room.findById(req.params.id);

    await getRoom.populate('users').execPopulate();

    const users = getRoom.populate('users');

    return res.status(200).json(users.users);
});

// Add user to room by user email and roomID
router.post('/addUser/:id', veryfy, middlewear.getRoom ,async (req, res) => {
    const user = await AuthModel.findOne({email: req.body.email});
    if(!user) return res.status(400).send({message:'That user does not exists'});
    
    const userWithoutRoom = await AuthModel.findOne({ email: req.body.email, rooms: {"$in": [req.params.id]}});
    if(userWithoutRoom!=null) return res.status(400).send({message:'This user is already in this room'});

    user.rooms.push({_id: req.params.id});
    await user.save();

    const roomParent = res.room;
    roomParent.users.push({_id: user._id});
    roomParent.save();
    return res.status(200).send({message:'User has been added succesfully!'});
});

// Delete user from room by userID and roomID
router.delete('/:roomId/user/:userId', veryfy, async (req, res) => {

    try {
        const deleteRoom = await room.updateOne({_id: req.params.roomId}, { $pullAll: {users: [req.params.userId] }});
        const user = await AuthModel.updateOne({_id: req.params.userId}, { $pullAll: {rooms: [req.params.roomId]}});
    } catch(err) {
        return res.status(400).send({message: err.message});
    }
    
    return res.status(200).send({message: 'Usunieto!'});
});


// Get Pie Chart by category data
router.get("/pieChartData/:roomId", veryfy, async (req,res) => {
    try {
        const transactionRoom = await transactionsModel.aggregate([{ $match : { room : req.params.roomId}} ,{$group: {_id: "$category", total: {$sum: "$transactionValue"}}}]); 

        return res.status(200).json(transactionRoom);
    } catch(err) {
        return res.status(400).send({message: err.message});
    }
});


//Get Bar Chart by date data
router.get("/barChartData/:roomId", veryfy, async (req,res) => {
    try {
        const transactionRoom = await transactionsModel.aggregate([
            {
                 $match : { room : req.params.roomId}} ,
                 {
                     $group: {
                        _id: { $month: "$transactionDate"}, 
                        totalIncome: {$sum: { "$cond": [{ "$eq": ["$income", true] }, "$transactionValue", 0] }},
                        totalExpense: {$sum: { "$cond": [{ "$eq": ["$income", false] }, "$transactionValue", 0] }},
                }
            }
            ]); 

        return res.status(200).json(transactionRoom);
    } catch(err) {
        return res.status(400).send({message: err.message});
    }
});

module.exports = router;