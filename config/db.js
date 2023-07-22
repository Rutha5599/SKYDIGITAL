const mongoose =require('mongoose');
const db = mongoose.connection;

mongoose.connect('mongodb+srv://dharmik:Dharmik5599@cluster0.cnfcnth.mongodb.net/master-admin-palne');

db.once('open',(err)=>{
    if(err){
        console.log('db not connected');
    }
    console.log('db connected');
}); 
   
module.exports = db;