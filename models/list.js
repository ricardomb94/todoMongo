const mongoose = require('mongoose')
       ,Schema = mongoose.Schema


let listSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: 'You need to specifie a name'
    },
    done:{type: false},
    userId:[{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    createAt: {
        type:Date,default:Date.now()
    }
});

module.exports = mongoose.model('List', listSchema);
