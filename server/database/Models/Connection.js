const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
    sshEncrypted : {
        type : String,
        required : true,
    },
    name : {
        type : String,
        required : true,
    },
    type : {
        type : String,
        enum : ['personal','group'],
        required : true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
        },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        default: null
    },
    hostName : {
        type : String,
    },
    ip : {
        type : String,
    },
    commandHistory : {
        type : [String]
    },
    CPUInfo : {
        usagePercent: { type: Number,
            min: 0,
            max: 100 
        },
        lastUpdated: { type: Date, }
    },

    RamInfo : {
        total: { type: Number },
        used: { type: Number },
        lastUpdated: { type: Date, }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
})

const Connection = mongoose.model('Connection', ConnectionSchema);
module.exports = Connection;