const express = require('express');
const mongoose = require('mongoose');
const path= require('path');
const port= 8080;
const Chat = require('./models/chat.js');
const app = express();
const ExpressError=require("./ExpressError.js");

app.set("views" ,path.join(__dirname ,"views"));
app.set("view engine" , "ejs");
//set public folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
//method override
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

main().then(()=>{
    console.log("Connection successfull");
}).catch((err)=>{
    console.log(err)
})
async function main() {
   await mongoose.connect("mongodb://localhost:27017/fakewhatsapp");
}
// create server
app.listen(port, ()=>{
    console.log("Server start");
});

app.get("/", (req, res)=>{
    res.send("home screen");
});



//creating Chats route

app.get("/chats",asyncWrap( async(req,res,next)=>{
    let chats = await Chat.find();
    res.render('showChats.ejs' ,{chats});  
}));
//creating a new chat

app.get("/chats/new" , (req, res)=>{
    // throw new ExpressError(404, "page not found");
    res.render('new.ejs');
});
//creating wrap async

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>{
            next(err);
        })
    }
}

// new show routes

app.get ("/chats/:id" , asyncWrap( async(req,res,next)=>{
    let {id}=req.params;
    let chat = await Chat.findById(id);
    if(!chat){
       throw new ExpressError(404, "chat not found");
    }
    res.render("edit.ejs" ,{chat});
    
}));





app.post("/chats" ,asyncWrap( async(req, res,next)=>{
    
    let {from, to, message}=req.body;
    const newChat= new Chat(
    {
    from:from,
    to:to,
    message:message,
    created_at: new Date()
    }
    );
    await newChat.save(); 
}));

//Edit and update route

app.get("/chats/:id/edit", asyncWrap( async(req,res,next)=>{
    
    //find id
    let {id}= req.params;
    //using id find chat 
    //it  is a async function
    let chat= await Chat.findById(id);
    res.render("edit.ejs", {chat});
}));

app.put("/chats/:id" , asyncWrap( async(req, res,next)=>{
    let {id}= req.params;
    let { message :newMsg}= req.body;
    let updateChat = await Chat.findByIdAndUpdate(id, 
    {message: newMsg} ,{runValidators : true , new: true});
    res.redirect("/chats");
}));

//handling middleware


//destroy route

app.delete("/chats/:id" , asyncWrap( async(req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deleteChat= await Chat.findByIdAndDelete(id,{runValidators : true , new: true});
    res.redirect("/chats");
    
    
}));

//print error name

app.use((err, req, res, next)=>{
    console.log(err.name);
    next(err);
});

app.use((err,req, res, next)=>{
    let {status=404,message="error occurs"}=err;
    res.status(status).send(message);
});
