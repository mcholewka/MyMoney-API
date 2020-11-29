const room = require('../api/rooms/rooms.model');
const transactionsModel = require('../api/transactions/transactions.model');

module.exports = {
    getRoom:async function (req, res, next) {
        try {
            oneRoom = await room.findById(req.params.id);
            if(oneRoom == null) {
                return res.status(400).json({message: "Cannot find that room"});
    
            }
        } catch(err) {
            return res.status(500).json({message: err.message});
        }
    
        res.room = oneRoom;
        next();
    },

    getTransaction:async function (req, res, next) {
        try {
            findTransaction = await transactionsModel.findById(req.params.id);
            if(findTransaction == null) {
                return res.status(400).json({message: "Cannot find that room"});
    
            }
        } catch(err) {
            return res.status(500).json({message: err.message});
        }
    
        res.transaction = findTransaction;
        next();
    }
}