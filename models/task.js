const mongoose = require('mongoose')
       ,Schema = mongoose.Schema

let taskSchema = new mongoose.Schema({
    title: {
        type: 'string',
        required: 'You need to specifie a title'
    },
    listId: [{type: mongoose.Schema.Types.ObjectId, ref: 'List' }],

    done:{
         type: "boolean",
         default:false
            },

    createAt: {
        type:Date,
        default:Date.now()
    }

});

module.exports = mongoose.model('Task', taskSchema);
