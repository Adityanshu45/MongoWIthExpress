const express = require('express');
const mongoose = require('mongoose');
const path= require('path');
const port= 8080;
const Chat = require('./models/chat.js');
const app = express();
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
   await mongoose.connect("mongodb://localhost:27017/whatsapp");
}
// create server
app.listen(port, ()=>{
    console.log("Server start");
});

app.get("/", (req, res)=>{
    res.send("home screen");
});

//creating Chats route

app.get("/chats", async(req, res)=>{
    let chats = await Chat.find();
    res.render('showChats.ejs' ,{chats});
});

//cerating a new chat

app.get("/chats/new" , (req, res)=>{
    res.render('new.ejs');
});

app.post("/chats" , (req, res)=>{
    let {from, to, message}=req.body;
    const newChat= new Chat(
        {
        from:from,
        to:to,
        message:message,
        created_at: new Date()
        }
    );
    newChat.save()
    .then((res)=>{console.log(res)})
    .catch((err)=>{console.log(err)});
    res.redirect("/chats");
});

//Edit and update route

app.get("/chats/:id/edit",async(req,res)=>{
    //find id
    let {id}= req.params;
    //using id find chat 
    //it  is a async function
    let chat= await Chat.findById(id);
    res.render("edit.ejs", {chat});
});

app.put("/chats/:id" , async(req, res)=>{
    let {id}= req.params;
    let { message :newMsg}= req.body;
    let updateChat = await Chat.findByIdAndUpdate(id, 
        {message: newMsg} ,{runValidators : true , new: true});
    res.redirect("/chats");
});

//destroy route

app.delete("/chats/:id" ,async(req,res)=>{
    let {id} = req.params;
    console.log(id);
    let deleteChat= await Chat.findByIdAndDelete(id,{runValidators : true , new: true});
    res.redirect("/chats");
})