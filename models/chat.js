const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    from:{
        type: String,
        required:true,
        maxLength:20
    },
    to:{
        type:String,
        required:true,
        maxLength:20
    },
    message:{
        type:String,
        maxLength:50
    },
    created_at:{
        required:true,
        type:Date
    }
});

const Chat = mongoose.model("Chat" , userSchema);

module.exports=Chat;
