const express = require('express');
const router = express.Router();
const jwt_decode = require('jwt-decode');
const veryfy = require('../../config/verifyToken');
const room = require('./rooms.model');
const authUser = require("../auth/auth.model");
var middlewear = require('../../util/middlewares');

// Create new room
router.post('/', veryfy, async (req, res) => {
    
    try {
        const currentUserId = (jwt_decode(req.header('auth-token')))._id;

        const createRoom = new room({
            roomName: req.body.roomName,
            users: currentUserId
        });

        const savedRoom = await createRoom.save();

        const currrentUser = await authUser.findById(currentUserId);
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
        console.log((jwt_decode(req.header('auth-token')))._id);

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



module.exports = router;