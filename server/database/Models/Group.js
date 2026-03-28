const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    createdBy: {
        type: String
    },
    members: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    connections: {
        type: [String]
    }
})

const Group = mongoose.model('Group', GroupSchema);
module.exports = Group;