const express = require("express");
const  routes  = require("./routes/routes")
const { OTP_LENGTH,SERVER_PORT} = require('./constants/constants');
//const cors = require('cors');
const bodyParser = require('body-parser');


const app=express();
//app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({limit:"60mb"}));
app.use(express.json());
app.use('/',routes)



const listener=app.listen(SERVER_PORT,()=>{
    console.log(" app is running on "+listener.address().port);
})
