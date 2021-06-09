const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
},{
    timestamps: true
});

const chatSchema = new Schema({
    password: {
        type: String,
        required: true
    },
    messages: [messageSchema]
},{
    timestamps: true
});

var Chats = mongoose.model('Chat', chatSchema);

module.exports = Chats;