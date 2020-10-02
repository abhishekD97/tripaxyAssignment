const express = require("express")
const app = express()
const http = require('http').Server(app)
const io = require("socket.io")(http)
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))
app.set('view engine','ejs')
/////////////////////////////////////////////mongoose//////////////////////////////////////////////////////
mongoose.connect("mongodb://localhost:27017/chatDB",{ useNewUrlParser: true,useUnifiedTopology: true })


const customersSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:String
})

const Customer = new mongoose.model("Customer",customersSchema);

const managersSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:String
})

const Manager = new mongoose.model("Manager",managersSchema);

/////////////////////////////////////////////mongoose//////////////////////////////////////////////////////
app.get("/",function(req,res){
  res.render("index")
})

app.post("/",function(req,res){

  const role = req.body.role;
  const name = req.body.name;
  const email = req.body.email;


  if(role==="Customer"){

Customer.findOne({name:name},function(err,found){
    if(!err){
      if(!found){
        const newCustomer = new Customer({
          name:name,
          email:email
        })
        newCustomer.save();
        res.render("chat",{role:role,name:name});
      }else{
        res.render("chat",{role:role,name:name});
      }
    }
})
  }
  else
  {
    Manager.findOne({name:name},function(err,found){
        if(!err){
          if(!found){
            const newManager = new Manager({
              name:name,
              email:email            })
            newManager.save();
            res.render("chat",{role:role,name:name});
          }else{
            res.render("chat",{role:role,name:name});
          }
        }
    })
  }
})

io.on('connection', function(socket) {
  console.log("user connected")



  socket.on('msg', function(data) {
      //Send message to everyone
      console.log(data);
      io.sockets.emit('newmsg', data);
   })
})


http.listen(3000,function(req,res){
  console.log("server up @ 3000")
})
