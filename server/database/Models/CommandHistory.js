const mongoose = require('mongoose');

const CommandHistorySchema = new mongoose.Schema({
    connection_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Connection",
        required: true,
    },
    command : {
        type : String,
        required : true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
})

const CommandHistory = mongoose.model('CommandHistory', CommandHistorySchema);
module.exports = CommandHistory;