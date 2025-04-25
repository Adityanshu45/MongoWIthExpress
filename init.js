const mongoose = require('mongoose');
const Chat = require('./models/chat.js');

main().then(()=>{
    console.log("Connection successfull");
}).catch((err)=>{
    console.log(err)
})
async function main() {
   await mongoose.connect("mongodb://localhost:27017/fakewhatsapp");
}

let allChat=[
    {
        from:"Aditya Chaudhary",
        to:"Amit Verma",
        message:"kya haal dost kya ho rha hai",
        created_at: new Date()
    },
    {
        from:"Arpit",
        to:"kaka",
        message:"main ghr ja rha hu tum aa jao",
        created_at: new Date()
    },
    {
        from:"Anand",
        to:"Amit Verma",
        message:"ka ho amit ka haal  ba",
        created_at: new Date()
    },
    {
        from:"Aditya Chaudhary",
        to:"Anand",
        message:"aur mitra aanand ka haal ba",
        created_at: new Date()
    }
]


Chat.insertMany(allChat).then((res)=>{
    console.log(res);
})
.catch((err)=>{
    console.log(err);
});
