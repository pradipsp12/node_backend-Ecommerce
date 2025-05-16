const mongoos = require('mongoose');

const userSchema = new mongoos.Schema({
    name: {
        type:String,
        require: true
    },
    password: {
        type: String,
        require : true
    },
    createdAt :{
        type: Date,
        default: Date.now
    },
    updatedAt : {
        type : Date,
        default : Date.now
    }
});

const User = mongoos.model('User', userSchema);

module.exports = User;