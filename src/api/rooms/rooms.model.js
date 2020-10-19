const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomsSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true
    },
    users: [{type: Schema.Types.ObjectId, ref: 'authUser'}],
});

module.exports = mongoose.model('rooms', roomsSchema);