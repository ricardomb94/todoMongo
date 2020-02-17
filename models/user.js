const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// let SALT = 10;

let userSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: 'A name is required'
    },
    email: {
        type: 'string',
        required: 'Email adress is required',
        unique: true,
    },
    password: {
        type: 'string',
        required: 'You need to specifie a password',
        // minlength:6
    },

     createAt: {
        type:Date,default:Date.now()
    },
    listId:[{type:mongoose.Schema.Types.ObjectId, ref:'List'}]
});






module.exports = mongoose.model('User', userSchema);
